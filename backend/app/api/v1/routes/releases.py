from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime, timezone
from app.db.session import get_db
from app.core.deps import get_current_dealing_officer, get_current_director_rb, get_current_competent_authority
from app.models.instrument import Instrument
from app.models.release_request import ReleaseRequest
from app.models.clearance import Clearance
from app.models.finding import Finding
from app.schemas.release import (
    ReleaseRequestCreate,
    ReleaseRequestUpdate,
    ReleaseRequestResponse,
    ReleaseRequestEligibilityResponse,
)


router = APIRouter(prefix="/release-requests", tags=["release-requests"])


@router.post("/", response_model=ReleaseRequestResponse)
async def create_release_request(
    payload: ReleaseRequestCreate,
    current_user: dict = Depends(get_current_dealing_officer),
    db: AsyncSession = Depends(get_db),
):
    """Create a new release request."""
    from app.services.release_graph import evaluate_release_graph

    result = await db.execute(select(Instrument).where(Instrument.id == UUID(payload.instrument_id)))
    instrument = result.scalar_one_or_none()

    if not instrument:
        raise HTTPException(status_code=404, detail="Instrument not found.")

    if instrument.status not in ("MATURED", "RELEASE_REQUESTED", "ACTIVE", "EXPIRING"):
        raise HTTPException(
            status_code=422,
            detail=f"Instrument must be in MATURED, RELEASE_REQUESTED, ACTIVE, or EXPIRING status to request release, "
                   f"but current status is {instrument.status}.",
        )

    # Check for existing release request
    existing_result = await db.execute(
        select(ReleaseRequest).where(ReleaseRequest.instrument_id == UUID(payload.instrument_id))
    )
    if existing_result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="A release request already exists for this instrument.",
        )

    # Create the release request
    release_request = ReleaseRequest(
        id=UUID(),
        institution_id=instrument.institution_id,
        instrument_id=UUID(payload.instrument_id),
        request_type=payload.request_type,
        financial_embezzlement_flag=payload.financial_embezzlement_flag,
        requested_by=UUID(current_user["id"]) if current_user["id"] != "user" else UUID("00000000-0000-0000-0000-000000000001"),
        requested_at=datetime.now(timezone.utc),
        status="ELIGIBILITY_CHECK",
    )

    db.add(release_request)

    # Update instrument status to RELEASE_REQUESTED
    instrument.status = "RELEASE_REQUESTED"
    await db.flush()

    # Evaluate the release eligibility graph
    eval_result = await evaluate_release_graph(release_request, db)

    # Persist eligibility result
    release_request.eligibility_result = eval_result["result"]
    release_request.notes = eval_result.get("notes", "")

    # Set status based on eligibility
    if eval_result["result"] == "ELIGIBLE":
        release_request.status = "ELIGIBLE"
        instrument.status = "RELEASED"
    elif eval_result["result"] == "BLOCKED":
        release_request.status = "BLOCKED"
    elif eval_result["result"] == "NEEDS_INFO":
        release_request.status = "NEEDS_INFO"
    elif eval_result["result"] == "PENDING_SOURCE":
        release_request.status = "PENDING_SOURCE"

    # Emit audit events
    from app.models.audit import AuditEvent
    from sqlalchemy.dialects.postgresql import UUID as PGUUID

    # Audit: RELEASE_REQUEST_CREATED
    await AuditEvent.emit_audit_event(
        db=db,
        event_type="RELEASE_REQUEST_CREATED",
        actor_id=current_user.get("id", "user"),
        actor_role=current_user.get("role", "DEALING_OFFICER"),
        entity_type="RELEASE_REQUEST",
        entity_id=str(release_request.id),
        payload_json={
            "instrument_id": payload.instrument_id,
            "request_type": payload.request_type,
            "financial_embezzlement_flag": payload.financial_embezzlement_flag,
        },
    )

    # Audit: ELIGIBILITY_EVALUATED
    await AuditEvent.emit_audit_event(
        db=db,
        event_type="ELIGIBILITY_EVALUATED",
        actor_id=current_user.get("id", "user"),
        actor_role=current_user.get("role", "DEALING_OFFICER"),
        entity_type="RELEASE_REQUEST",
        entity_id=str(release_request.id),
        payload_json={
            "eligibility_result": eval_result["result"],
            "blockers": eval_result.get("blockers", []),
            "nodes": eval_result.get("nodes", []),
        },
    )

    await db.flush()

    return ReleaseRequestResponse(
        id=str(release_request.id),
        instrument_id=str(release_request.instrument_id),
        institution_id=str(release_request.institution_id),
        request_type=release_request.request_type,
        financial_embezzlement_flag=release_request.financial_embezzlement_flag,
        requested_at=release_request.requested_at,
        status=release_request.status,
        eligibility_result=release_request.eligibility_result,
        decision=release_request.decision,
        decided_at=release_request.decided_at,
        noc_number=release_request.noc_number,
        sanction_order_number=release_request.sanction_order_number,
        notes=release_request.notes,
    )


@router.get("/{request_id}", response_model=ReleaseRequestResponse)
async def get_release_request(
    request_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single release request by UUID."""
    from uuid import UUID

    result = await db.execute(select(ReleaseRequest).where(ReleaseRequest.id == UUID(request_id)))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Release request not found.")

    return ReleaseRequestResponse(
        id=str(item.id),
        instrument_id=str(item.instrument_id),
        institution_id=str(item.institution_id),
        request_type=item.request_type,
        financial_embezzlement_flag=item.financial_embezzlement_flag,
        requested_at=item.requested_at,
        status=item.status,
        eligibility_result=item.eligibility_result,
        decision=item.decision,
        decided_at=item.decided_at,
        noc_number=item.noc_number,
        sanction_order_number=item.sanction_order_number,
        notes=item.notes,
    )


@router.get("/{request_id}/eligibility", response_model=ReleaseRequestEligibilityResponse)
async def get_eligibility(
    request_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_dealing_officer),
):
    """Get the eligibility evaluation for a release request, including all clearance nodes."""
    from uuid import UUID

    # Get the release request
    result = await db.execute(select(ReleaseRequest).where(ReleaseRequest.id == UUID(request_id)))
    release_request = result.scalar_one_or_none()

    if not release_request:
        raise HTTPException(status_code=404, detail="Release request not found.")

    # Build the clearance nodes based on the release request type and instrument state
    from app.services.release_graph import build_clearance_nodes

    nodes = await build_clearance_nodes(release_request, db)

    # Determine the result
    # Evaluation order: if any required node is BLOCKED -> BLOCKED
    # else if any required node is NEEDS_INFO -> NEEDS_INFO
    # else if any required node is SOURCE_UNAVAILABLE -> PENDING_SOURCE
    # else if any required node is PENDING -> BLOCKED
    # else -> ELIGIBLE

    required_blocked = any(
        node["required"] and node["status"] == "BLOCKED" for node in nodes
    )
    required_needs_info = any(
        node["required"] and node["status"] in ("PENDING", "NEEDS_INFO") for node in nodes
    )
    required_source_unavailable = any(
        node["required"] and node["status"] == "SOURCE_UNAVAILABLE" for node in nodes
    )

    if required_blocked:
        result = "BLOCKED"
    elif required_needs_info:
        result = "NEEDS_INFO"
    elif required_source_unavailable:
        result = "PENDING_SOURCE"
    else:
        result = "ELIGIBLE"

    # Determine blockers
    blockers = [
        node["type"] for node in nodes
        if node["required"] and node["status"] in ("BLOCKED", "PENDING", "NEEDS_INFO")
    ]

    return ReleaseRequestEligibilityResponse(
        release_request_id=request_id,
        result=result,
        instrument_id=release_request.instrument_id,
        request_type=release_request.request_type,
        nodes=nodes,
        blockers=blockers,
        evaluated_at=datetime.now(timezone.utc),
    )


@router.put("/{request_id}/clearances/{clearance_type}")
async def update_clearance(
    request_id: str,
    clearance_type: str,
    payload: dict,
    current_user: dict = Depends(get_current_director_rb),
    db: AsyncSession = Depends(get_db),
):
    """Update a single clearance status for a release request."""
    from uuid import UUID
    from app.models.clearance import Clearance

    result = await db.execute(select(ReleaseRequest).where(ReleaseRequest.id == UUID(request_id)))
    release_request = result.scalar_one_or_none()

    if not release_request:
        raise HTTPException(status_code=404, detail="Release request not found.")

    # Update or create the clearance
    clearance_result = await db.execute(
        select(Clearance).where(
            Clearance.release_request_id == UUID(request_id),
            Clearance.type == clearance_type,
        )
    )
    clearance = clearance_result.scalar_one_or_none()

    if not clearance:
        clearance = Clearance(
            id=UUID(),
            release_request_id=UUID(request_id),
            type=clearance_type,
            status="PENDING",
            source="MOCK",
        )
        db.add(clearance)

    # Update clearance status
    new_status = payload.get("status", "CLEAR")
    reference = payload.get("reference", "")
    source = payload.get("source", "MOCK")
    notes = payload.get("notes", "")

    clearance.status = new_status
    clearance.reference = reference
    clearance.source = source
    clearance.notes = notes

    # If clearance is CLEAR, try to re-evaluate the graph
    if new_status in ("CLEAR", "PENDING", "BLOCKED", "NEEDS_INFO", "SOURCE_UNAVAILABLE", "NOT_APPLICABLE"):
        from app.services.release_graph import reevaluate_release_graph
        eval_result = await reevaluate_release_graph(release_request, db)

        release_request.eligibility_result = eval_result["result"]
        release_request.status = eval_result["status"]
        if eval_result["result"] == "ELIGIBLE":
            release_request.status = "ELIGIBLE"
            release_request.notes = "All required clearances satisfied."
        elif eval_result["result"] == "BLOCKED":
            release_request.status = "BLOCKED"
            release_request.notes = "; ".join(eval_result.get("blockers", []))

    await db.flush()

    return {"status": clearance.status, "reference": clearance.reference, "source": clearance.source}


@router.post("/{request_id}/decision", response_model=ReleaseRequestResponse)
async def make_decision(
    request_id: str,
    action: str,
    current_user: dict = Depends(get_current_competent_authority),
    db: AsyncSession = Depends(get_db),
):
    """Make a final decision on a release request."""
    from uuid import UUID
    from app.models.release_request import ReleaseRequest
    from app.models.instrument import Instrument

    result = await db.execute(select(ReleaseRequest).where(ReleaseRequest.id == UUID(request_id)))
    release_request = result.scalar_one_or_none()

    if not release_request:
        raise HTTPException(status_code=404, detail="Release request not found.")

    # Check eligibility based on action
    if action == "APPROVE":
        if release_request.eligibility_result != "ELIGIBLE":
            raise HTTPException(
                status_code=422,
                detail="Release cannot be approved; release is not eligible. "
                       "Blocked by required clearances or other conditions.",
            )
        # COMPETENT_AUTHORITY can approve
        release_request.status = "CA_APPROVED"
        release_request.decision = "APPROVE"
        release_request.decided_by = UUID(current_user["id"]) if current_user["id"] != "user" else UUID("00000000-0000-0000-0000-000000000001")
        release_request.decided_at = datetime.now(timezone.utc)

        # Update instrument status to RELEASED
        instr_result = await db.execute(select(Instrument).where(Instrument.id == release_request.instrument_id))
        instrument = instr_result.scalar_one_or_none()
        if instrument:
            instrument.status = "RELEASED"

        # Issue NOC or sanction order
        from datetime import datetime
        import uuid
        year = datetime.now(timezone.utc).year
        if release_request.request_type in ("MATURITY", "EARLY", "CLOSURE"):
            release_request.noc_number = f"AICTE/RB/NOC/{year}/{uuid.uuid4().hex[:6].upper()}"
        elif release_request.request_type == "MERGER":
            release_request.sanction_order_number = f"AICTE/RB/SANCTION/{year}/{uuid.uuid4().hex[:6].upper()}"

    elif action == "RECOMMEND":
        if release_request.status not in ("DRAFT", "SUBMITTED"):
            # DEALING_OFFICER or DIRECTOR_RB can recommend
            if release_request.status == "ELIGIBLE":
                release_request.status = "MAKER_RECOMMENDED"
            else:
                release_request.status = "NEEDS_INFO"
        else:
            release_request.status = "MAKER_RECOMMENDED"

    elif action == "CHECK":
        # DIRECTOR_RB can check
        if release_request.eligibility_result == "ELIGIBLE":
            release_request.status = "CHECKER_APPROVED"
        else:
            release_request.status = "BLOCKED"

    elif action == "RETURN":
        release_request.status = "NEEDS_INFO"
        release_request.notes = "Returned to applicant for additional information."

    elif action == "REJECT":
        release_request.status = "REJECTED"
        if release_request.request_type in ("MATURITY", "EARLY", "CLOSURE"):
            # Update instrument status
            instr_result = await db.execute(select(Instrument).where(Instrument.id == release_request.instrument_id))
            instrument = instr_result.scalar_one_or_none()
            if instrument:
                instrument.status = "REJECTED"

    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

    # Emit audit event
    from app.models.audit import AuditEvent
    await AuditEvent.emit_audit_event(
        db=db,
        event_type="RELEASE_DECISION",
        actor_id=current_user.get("id", "user"),
        actor_role=current_user.get("role", "COMPETENT_AUTHORITY"),
        entity_type="RELEASE_REQUEST",
        entity_id=request_id,
        payload_json={
            "action": action,
            "eligibility_result": release_request.eligibility_result,
            "previous_status": release_request.status,  # will be updated above
        },
    )

    await db.flush()

    return ReleaseRequestResponse(
        id=str(release_request.id),
        instrument_id=str(release_request.instrument_id),
        institution_id=str(release_request.institution_id),
        request_type=release_request.request_type,
        financial_embezzlement_flag=release_request.financial_embezzlement_flag,
        requested_at=release_request.requested_at,
        status=release_request.status,
        eligibility_result=release_request.eligibility_result,
        decision=release_request.decision,
        decided_at=release_request.decided_at,
        noc_number=release_request.noc_number,
        sanction_order_number=release_request.sanction_order_number,
        notes=release_request.notes,
    )