from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from datetime import datetime, timezone
from app.db.base import Base
from app.models.instrument import Instrument
from app.models.release_request import ReleaseRequest
from app.models.clearance import Clearance
from app.models.finding import Finding
from app.models.provenance_field import ProvenanceField
from app.schemas.release import ReleaseRequestEligibilityResponse


# Official Clause 6.46 clearance types (from §3.7 of 01_BACKEND.md)
OFFICIAL_CLEARANCE_TYPES = ["DOCUMENTS", "PGRC", "VIGILANCE", "GRANTS"]

# System-level controls (from §3.7 of 01_BACKEND.md)
SYSTEM_CLEARANCE_TYPES = ["PROVENANCE", "TERM_SERVED", "DUES_PENALTIES", "BANK_LIEN"]


async def build_clearance_nodes(release_request: ReleaseRequest, db: AsyncSession) -> list[dict]:
    """Build the required clearance nodes for a release request.

    Follows the evaluation order and node specification from §6.5 of 01_BACKEND.md.
    """
    from app.models.instrument import Instrument as InstrumentModel

    # Get the instrument
    instr_result = await db.execute(select(InstrumentModel).where(InstrumentModel.id == release_request.instrument_id))
    instrument = instr_result.scalar_one_or_none()

    if not instrument:
        return []

    nodes = []

    # Always official: DOCUMENTS, PGRC, VIGILANCE, GRANTS
    # DOCUMENTS: clear when document set is complete
    # In prototype, DOCUMENTS is system-controlled based on OCR + document uploads

    # PROVENANCE: system check - CLEAR only when no CRITICAL finding with disposition OPEN/ACCEPTED
    critical_findings = await db.execute(
        select(Finding).where(
            Finding.instrument_id == release_request.instrument_id,
            Finding.severity == "CRITICAL",
            Finding.disposition.in_(["OPEN", "ACCEPTED"]),
        )
    )
    has_critical_open = critical_findings.scalar_one_or_none() is not None

    provenance_status = "CLEAR" if not has_critical_open else "BLOCKED"
    # But WAIVED and RESOLVED count as satisfied
    if has_critical_open:
        # Check if any CRITICAL finding was waived
        waived_result = await db.execute(
            select(Finding).where(
                Finding.instrument_id == release_request.instrument_id,
                Finding.severity == "CRITICAL",
                Finding.disposition == "WAIVED",
            )
        )
        if waived_result.scalar_one_or_none():
            provenance_status = "CLEAR"

    nodes.append({
        "type": "DOCUMENTS",
        "status": "CLEAR",  # system-owned, simplified for prototype
        "is_official": True,
        "required": True,
        "source": "SYSTEM",
        "reference": "DOC-SET-OK",
    })

    nodes.append({
        "type": "PROVENANCE",
        "status": provenance_status,
        "is_official": False,
        "required": True,
        "source": "SYSTEM",
        "reference": "OPEN-CRITICAL" if provenance_status == "BLOCKED" else "NONE",
    })

    # PGRC: Public Grievance Redressal Cell
    pgrc_result = await db.execute(
        select(Clearance).where(
            Clearance.release_request_id == release_request.id,
            Clearance.type == "PGRC",
        )
    )
    pgrc_clearance = pgrc_result.scalar_one_or_none()
    pgrc_status = pgrc_clearance.status if pgrc_clearance else "PENDING"

    nodes.append({
        "type": "PGRC",
        "status": pgrc_status,
        "is_official": True,
        "required": True,
        "source": pgrc_clearance.source if pgrc_clearance else "MOCK",
        "reference": pgrc_clearance.reference if pgrc_clearance else None,
    })

    # VIGILANCE
    vigilance_result = await db.execute(
        select(Clearance).where(
            Clearance.release_request_id == release_request.id,
            Clearance.type == "VIGILANCE",
        )
    )
    vigilance_clearance = vigilance_result.scalar_one_or_none()
    vigilance_status = vigilance_clearance.status if vigilance_clearance else "PENDING"

    nodes.append({
        "type": "VIGILANCE",
        "status": vigilance_status,
        "is_official": True,
        "required": True,
        "source": vigilance_clearance.source if vigilance_clearance else "MOCK",
        "reference": vigilance_clearance.reference if vigilance_clearance else None,
    })

    # GRANTS
    grants_result = await db.execute(
        select(Clearance).where(
            Clearance.release_request_id == release_request.id,
            Clearance.type == "GRANTS",
        )
    )
    grants_clearance = grants_result.scalar_one_or_none()
    grants_status = grants_clearance.status if grants_clearance else "PENDING"

    nodes.append({
        "type": "GRANTS",
        "status": grants_status,
        "is_official": True,
        "required": True,
        "source": grants_clearance.source if grants_clearance else "MOCK",
        "reference": grants_clearance.reference if grants_clearance else "GRANTS/2026/77",
    })

    # Financial embezzlement flag
    if release_request.financial_embezzlement_flag:
        nodes.append({
            "type": "FINANCIAL_EMBEZZLEMENT",
            "status": "BLOCKED",
            "is_official": True,
            "required": True,
            "source": "SYSTEM",
            "reference": "EMBEMZZLEMENT-FLAG",
        })
    else:
        nodes.append({
            "type": "FINANCIAL_EMBEZZLEMENT",
            "status": "NOT_APPLICABLE",
            "is_official": True,
            "required": False,
            "source": "SYSTEM",
            "reference": None,
        })

    # Complaints disciplinary (for converted universities)
    # In prototype, we check if institution is a converted university
    # For now, mark as NOT_APPLICABLE unless explicitly set
    nodes.append({
        "type": "COMPLAINTS_DISCIPLINARY",
        "status": "NOT_APPLICABLE",
        "is_official": True,
        "required": False,
        "source": "SYSTEM",
        "reference": None,
    })

    # Progressive closure
    # If request type is PROGRESSIVE_CLOSURE and instrument is not matured, require certificate
    # If already matured, not required
    nodes.append({
        "type": "PROGRESSIVE_CLOSURE",
        "status": "NOT_APPLICABLE",
        "is_official": True,
        "required": False,
        "source": "SYSTEM",
        "reference": None,
    })

    # Merger
    nodes.append({
        "type": "MERGER",
        "status": "NOT_APPLICABLE",
        "is_official": True,
        "required": False,
        "source": "SYSTEM",
        "reference": None,
    })

    # RTGS sanction (only for RTGS)
    if instrument and instrument.type == "RTGS":
        nodes.append({
            "type": "RTGS_SANCTION",
            "status": "PENDING",
            "is_official": True,
            "required": True,
            "source": "MOCK",
            "reference": None,
        })
    else:
        nodes.append({
            "type": "RTGS_SANCTION",
            "status": "NOT_APPLICABLE",
            "is_official": True,
            "required": False,
            "source": "SYSTEM",
            "reference": None,
        })

    # TERM_SERVED: system check - PENDING until demo clock reaches hold_end_date
    # In prototype, we check if the instrument has been held for 10 years
    # For the demo, we'll check based on maturity date and issue date
    issue_date = instrument.issue_date if instrument else None
    maturity_date = instrument.maturity_date if instrument else None

    if instrument and instrument.status == "MATURED":
        # If matured, term served is considered clear
        term_served_status = "CLEAR"
    elif instrument and issue_date:
        # Simple check: if maturity date has passed, term served
        from datetime import date
        today = date.today()  # In prototype with demo clock, this would be the clock date
        if maturity_date and maturity_date < today:
            term_served_status = "CLEAR"
        else:
            term_served_status = "PENDING"
    else:
        term_served_status = "PENDING"

    nodes.append({
        "type": "TERM_SERVED",
        "status": term_served_status,
        "is_official": False,
        "required": True,
        "source": "SYSTEM",
        "reference": "10Y-CLOCK",
    })

    # DUES_PENALTIES: system-owned
    nodes.append({
        "type": "DUES_PENALTIES",
        "status": "CLEAR",
        "is_official": False,
        "required": True,
        "source": "SYSTEM",
        "reference": "NO-DUES",
    })

    # BANK_LIEN: from bank verification
    # In prototype, check bank verification status
    bv_result = await db.execute(
        select(__import__("sqlalchemy").dialects.postgresql).selectize()
    )
    # Simplified: bank lien is clear if verification found
    nodes.append({
        "type": "BANK_LIEN",
        "status": "CLEAR",  # sandbox typically FOUND
        "is_official": False,
        "required": True,
        "source": "SANDBOX",
        "reference": "SBX-2026-0001",
    })

    return nodes


async def evaluate_release_graph(release_request: ReleaseRequest, db: AsyncSession) -> dict:
    """Evaluate the release eligibility graph and return the result.

    Returns dict with: result (ELIGIBLE/BLOCKED/NEEDS_INFO/PENDING_SOURCE),
    blockers (list), nodes (list).
    """
    nodes = await build_clearance_nodes(release_request, db)

    # Evaluation order from §6.5:
    # 1. If any required node is BLOCKED -> BLOCKED
    # 2. Else if any required node is NEEDS_INFO -> NEEDS_INFO
    # 3. Else if any required node is SOURCE_UNAVAILABLE -> PENDING_SOURCE
    # 4. Else if any required node is PENDING -> BLOCKED
    # 5. Else -> ELIGIBLE

    required_blocked = any(
        node["required"] and node["status"] == "BLOCKED" for node in nodes
    )
    required_needs_info = any(
        node["required"] and node["status"] in ("PENDING", "NEEDS_INFO") for node in nodes
    )
    required_source_unavailable = any(
        node["required"] and node["status"] == "SOURCE_UNAVAILABLE" for node in nodes
    )
    required_pending = any(
        node["required"] and node["status"] == "PENDING" and not any(
            n["type"] == node["type"] and n["status"] in ("CLEAR", "NOT_APPLICABLE") for n in nodes
        ) for node in nodes
    )

    if required_blocked:
        # Collect blocker types
        blockers = [
            node["type"] for node in nodes
            if node["required"] and node["status"] == "BLOCKED"
        ]
        return {"result": "BLOCKED", "blockers": blockers, "nodes": nodes}
    elif required_needs_info:
        blockers = [
            node["type"] for node in nodes
            if node["required"] and node["status"] in ("PENDING", "NEEDS_INFO")
        ]
        return {"result": "NEEDS_INFO", "blockers": blockers, "nodes": nodes}
    elif required_source_unavailable:
        blockers = [
            node["type"] for node in nodes
            if node["required"] and node["status"] == "SOURCE_UNAVAILABLE"
        ]
        return {"result": "PENDING_SOURCE", "blockers": blockers, "nodes": nodes}
    elif required_pending:
        blockers = [
            node["type"] for node in nodes
            if node["required"] and node["status"] == "PENDING"
        ]
        return {"result": "BLOCKED", "blockers": blockers, "nodes": nodes}
    else:
        return {"result": "ELIGIBLE", "blockers": [], "nodes": nodes}


async def reevaluate_release_graph(release_request: ReleaseRequest, db: AsyncSession) -> dict:
    """Re-evaluate the release graph after a clearance change."""
    return await evaluate_release_graph(release_request, db)