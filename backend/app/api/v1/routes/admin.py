from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from uuid import UUID
from datetime import datetime, timezone
from app.db.session import get_db
from app.models.system_setting import SystemSetting
from app.models.audit_event import AuditEvent
from app.schemas.common import SuccessResponse


router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/time-machine")
async def time_machine(
    target_date: str,
    reason: str,
    current_user: dict = Depends(lambda: {"id": "admin", "role": "DIRECTOR_RB"}),
    db: AsyncSession = Depends(get_db),
):
    """Advance the demo clock to a target date.

    Only ADMIN or DIRECTOR_RB can advance the clock.
    This affects date-based jobs (reminders, term-served clearance, etc.)
    but does not mutate record dates themselves.
    """
    from datetime import datetime

    # Validate the target date
    try:
        parsed_date = datetime.strptime(target_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="target_date must be YYYY-MM-DD format")

    # Store the demo clock in system_settings
    setting_result = await db.execute(
        select(SystemSetting).where(SystemSetting.key == "demo_clock")
    )
    setting = setting_result.scalar_one_or_none()

    if not setting:
        setting = SystemSetting(
            key="demo_clock",
            value_json={"current_date": target_date, "updated_by": current_user.get("id", "admin")},
        )
        db.add(setting)
    else:
        setting.value_json = {
            "current_date": target_date,
            "updated_by": current_user.get("id", "admin"),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    await db.flush()

    # Emit audit event
    await AuditEvent.emit_audit_event(
        db=db,
        event_type="AUDIT_CLOCK_ADVANCED",
        actor_id=current_user.get("id", "admin"),
        actor_role=current_user.get("role", "DIRECTOR_RB"),
        entity_type="SYSTEM_SETTING",
        entity_id="demo_clock",
        payload_json={
            "target_date": target_date,
            "reason": reason,
            "previous_date": setting.value_json.get("current_date") if setting.value_json else None,
        },
    )

    return {
        "status": "ok",
        "demo_clock": target_date,
        "reason": reason,
        "message": f"Demo clock advanced to {target_date}",
    }


@router.get("/meta")
async def admin_meta(
    db: AsyncSession = Depends(get_db),
):
    """Return meta/enums for the API."""
    from app.schemas.common import EnumsResponse

    return EnumsResponse(
        roles=[
            "INSTITUTION_USER", "DEALING_OFFICER", "DIRECTOR_RB",
            "COMPETENT_AUTHORITY", "ACCOUNTS", "AUDITOR", "ADMIN"
        ],
        institution_type=["CO_ED", "WOMEN_ONLY", "PWD_ONLY"],
        location_category=["NE", "JK", "LADAKH", "ASPIRATIONAL", "AN", "LAKSHADWEEP", "OTHER"],
        building_ownership=["OWNED", "LEASED"],
        university_type=["AFFILIATED", "PRIVATE_UNIVERSITY", "DEEMED", "GOVERNMENT"],
        application_category=["NEW", "EXISTING_1_3_3", "NEW_LEVEL_PROGRAMME", "UNIVERSITY_NEW_PROGRAMME", "OTHER"],
        programme=["ENGINEERING", "PLANNING", "APPLIED_ARTS", "DESIGN", "HMCT", "COMPUTER_APPLICATIONS", "MANAGEMENT"],
        level=["DIPLOMA", "UG", "PG"],
        instrument_type=["FDR", "RTGS", "RPGF", "BG"],
        instrument_status=[
            "DRAFT", "SUBMITTED", "UNDER_SCRUTINY", "QUERY_RAISED", "VERIFIED", "ACTIVE",
            "EXPIRING", "MATUREd", "RENEWAL_DUE", "RENEWED", "REPLACED", "RELEASE_REQUESTED",
            "CLEARANCES_PENDING", "APPROVED", "RELEASED", "DISCHARGED", "CLOSED",
            "REJECTED", "WITHDRAWN", "FORFEITED"
        ],
        verification_status=["UNVERIFIED", "DOCUMENT_CHECKED", "OFFICER_VERIFIED", "BANK_CONFIRMED", "DISCREPANT", "SOURCE_UNAVAILABLE"],
        bank_verification_status=["FOUND", "NOT_FOUND", "ENCASHED", "CLOSED", "UNSUPPORTED", "SOURCE_UNAVAILABLE"],
        finding_severity=["CRITICAL", "SERIOUS", "WARNING"],
        finding_disposition=["OPEN", "ACCEPTED", "WAIVED", "RESOLVED"],
        obligation_type=["RENEWAL", "RELEASE_CLEARANCE", "UNDERTAKING", "BANK_RECHECK"],
        obligation_status=["OPEN", "DONE", "OVERDUE", "CANCELLED"],
        release_request_type=["MATURITY", "EARLY", "CLOSURE", "PROGRESSIVE_CLOSURE", "MERGER"],
        release_status=[
            "DRAFT", "SUBMITTED", "ELIGIBILITY_CHECK", "BLOCKED", "NEEDS_INFO",
            "PENDING_SOURCE", "ELIGIBLE", "MAKER_RECOMMENDED", "CHECKER_APPROVED",
            "CA_APPROVED", "NOC_ISSUED", "SANCTION_ISSUED", "RELEASED", "REJECTED", "WITHDRAWN"
        ],
        eligibility_result=["ELIGIBLE", "BLOCKED", "NEEDS_INFO", "PENDING_SOURCE"],
        clearance_type=["DOCUMENTS", "PROVENANCE", "PGRC", "VIGILANCE", "GRANTS", "FINANCIAL_EMBEZZLEMENT",
                         "COMPLAINTS_DISCIPLINARY", "PROGRESSIVE_CLOSURE", "MERGER", "TERM_SERVED",
                         "DUES_PENALTIES", "BANK_LIEN", "RTGS_SANCTION"],
        clearance_status=["PENDING", "CLEAR", "BLOCKED", "NEEDS_INFO", "SOURCE_UNAVAILABLE", "NOT_APPLICABLE"],
        release_decision=["RECOMMEND", "CHECK", "APPROVE", "RETURN", "REJECT"],
        pledge_edge_type=["PLEDGED_FOR", "RENEWED_FROM", "SAME_NUMBER", "SAME_HASH", "SAME_ACCOUNT", "SAME_SIGNATORY"],
        alert_type=["RENEWAL_DUE", "MATURITY_DUE", "OVERDUE", "BANK_RECHECK", "RELEASE_BLOCKED", "ESCALATION"],
        audit_entity_type=["INSTITUTION", "PROGRAMME", "INSTRUMENT", "DOCUMENT", "FINDING",
                          "REQUIREMENT", "RELEASE_REQUEST", "USER", "SETTING"],
    )