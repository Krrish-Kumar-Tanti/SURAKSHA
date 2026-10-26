from datetime import datetime, timezone
from decimal import Decimal
from uuid import UUID

from app.core.config import settings
from app.db.base import Base
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.institution import Institution
from app.models.programme import Programme
from app.models.policy_pack import PolicyPack
from app.models.policy_rule import PolicyRule
from app.models.requirements import Requirement
from app.schemas.policy import PolicyCalculateRequest, PolicyCalculateResponse


# Concession locations and types
CONCESSION_LOCATIONS = {"NE", "JK", "LADAKH", "ASPIRATIONAL", "AN", "LAKSHADWEEP"}


def select_pack(academic_year: str) -> PolicyPack:
    """Select the policy pack for the given academic year."""
    # For the prototype, we select based on academic year string
    # In production, this would query the DB
    if academic_year and "2026" in academic_year:
        # Try to find the addendum pack
        from app.models.policy_pack import PolicyPack
        return {"pack_id": "APH_2026_27_ADDENDUM", "name": "APH 2026-27 Addendum"}
    return {"pack_id": "APH_2024_27_BASE", "name": "APH 2024-27 Base"}


table_1_4 = {
    "ENGINEERING": {"DIPLOMA": 15, "UG": 35, "PG": 15},
    "PLANNING": {"DIPLOMA": 15, "UG": 15, "PG": 15},
    "APPLIED_ARTS": {"DIPLOMA": 15, "UG": 15, "PG": 15},
    "DESIGN": {"DIPLOMA": 15, "UG": 15, "PG": 15},
    "HMCT": {"DIPLOMA": 15, "UG": 15, "PG": 15},
    "COMPUTER_APPLICATIONS": {"DIPLOMA": None, "UG": 5, "PG": 15},
    "MANAGEMENT": {"DIPLOMA": None, "UG": 5, "PG": 15},
}


def lakh_in_paise() -> int:
    return 100000


def exemption_for(inst, programme: str, level: str) -> tuple[bool, str | None]:
    """Determine if an institution is exempt from the security deposit.

    Returns (exempt, reason).
    """
    # Government universities are exempt
    if inst.university_type == "GOVERNMENT":
        return True, "Government university type — APH 4.10(a)"

    # Private University / Deemed > 10 years with UGC, not a new programme
    if inst.university_type in ("PRIVATE_UNIVERSITY", "DEEMED"):
        if inst.ugc_years > 10 and inst.application_category not in ("NEW_LEVEL_PROGRAMME", "UNIVERSITY_NEW_PROGRAMME"):
            return True, f"Private {inst.university_type} with {inst.ugc_years}+ UGC years — APH 4.10(b)"

    # Existing institution under 1.3.3 for more than 5 years with regulatory bodies
    if inst.application_category == "EXISTING_1_3_3" and inst.regulatory_years > 5:
        return True, "Existing institution under Clause 1.3.3 for >5 years — APH 1.12(i)"

    # Prior release NOC — no new deposit
    if inst.prior_release_noc:
        return True, "Prior NOC issued for earlier FDR release — APH 1.12(iii)"

    # University starts a new programme/level at >10-year university — NOT exempt
    if inst.university_type in ("PRIVATE_UNIVERSITY", "DEEMED") and inst.ugc_years > 10:
        # If applying for a new programme/level, not exempt
        if inst.application_category in ("NEW_LEVEL_PROGRAMME", "UNIVERSITY_NEW_PROGRAMME"):
            return False, "New programme/level at >10-year university — not exempt per APH 4.10(c)"

    return False, ""


async def calculate_requirement(
    payload: PolicyCalculateRequest,
    db: AsyncSession,
) -> dict:
    """Calculate the required security deposit amount.

    Implements the exact algorithm from §3.3 of 01_BACKEND.md.
    Returns a dict with: base_amount_paise, concession_factor, leased_multiplier,
    exemption_applied, exemption_reason, required_amount_paise, trace, computed_at.
    """
    academic_year = payload.academic_year
    existing_credit_paise = payload.existing_credit_paise or 0

    # 1. Select policy pack
    pack_info = select_pack(academic_year)
    pack_id = pack_info["pack_id"]

    # 2. Get base amount from Table 1.4
    # We need the institution's programme and level
    inst_result = await db.execute(
        select(Institution).where(Institution.id == payload.institution_id)
    )
    institution = inst_result.scalar_one_or_none()

    prog_result = None
    if payload.programme_id:
        prog_result = await db.execute(
            select(Programme).where(Programme.id == payload.programme_id)
        )
        programme = prog_result.scalar_one_or_none()
    else:
        programme = None

    if not institution or not programme:
        return {"error": "Institution or programme not found"}

    # Get base amount from Table 1.4
    programme_name = programme.programme
    level = programme.level

    if programme_name not in table_1_4:
        return {"error": f"Invalid programme: {programme_name}"}

    base_amount_table = table_1_4[programme_name].get(level)
    if base_amount_table is None:
        return {"error": f"Level {level} not applicable for programme {programme_name}"}

    base = base_amount_table * lakh_in_paise()  # convert ₹ lakh to paise
    trace = [{"step": "base", "label": f"Table 1.4: {programme_name} {level}", "clause": "APH Table 1.4", "amount_paise": base}]

    # 3. Apply concession (50% for NE/J&K/Ladakh/Aspirational/A&N/Lakshadweep or women-only/PwD-only)
    concession = (
        institution.location_category in CONCESSION_LOCATIONS
        or institution.institution_type in {"WOMEN_ONLY", "PWD_ONLY"}
    )

    factor = Decimal("0.50") if concession else Decimal("1.00")
    if concession:
        base = int(Decimal(base) * factor)
        trace.append({
            "step": "concession",
            "label": "NE / women-only concession",
            "clause": "Addendum 2026-27 Item 10",
            "factor": "0.50",
            "amount_paise": base,
        })

    # 4. Apply leased multiplier (double if leased building/land)
    leased_factor = Decimal("2.00") if institution.building_ownership == "LEASED" else Decimal("1.00")
    if leased_factor != 1:
        base = int(Decimal(base) * leased_factor)
        trace.append({
            "step": "leased",
            "label": "Leased building/land multiplier",
            "clause": "Addendum 2026-27 Item 11",
            "factor": "2.00",
            "amount_paise": base,
        })

    # 5. Check exemptions
    exempt, reason = exemption_for(institution, programme_name, level)
    if exempt:
        trace.append({"step": "exemption", "label": "Exempt", "reason": reason, "amount_paise": 0})
        required = 0
        return {
            "base_amount_paise": base if 'base' in [t.get('step') for t in trace] else 0,
            "concession_factor": "0.50" if any(t["step"] == "concession" for t in trace) else "1.0000",
            "leased_multiplier": "2.00" if any(t["step"] == "leased" for t in trace) else "1.00",
            "exemption_applied": True,
            "exemption_reason": reason,
            "required_amount_paise": 0,
            "trace": trace,
            "computed_at": datetime.now(timezone.utc).isoformat(),
        }

    # 6. Subtract existing credit
    required = max(0, base - existing_credit_paise)
    trace.append({"step": "required", "label": "Computed requirement", "amount_paise": required})

    # 7. Persist the requirement record
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    pack_result = await db.execute(
        select(PolicyPack).where(PolicyPack.id == PGUUID(pack_id.replace("APH_", "").replace("-27", "-27")))  # simplify
    )
    # Actually let's just create the requirement
    requirement = Requirement(
        institution_id=payload.institution_id,
        programme_id=payload.programme_id,
        pack_id=PGUUID(pack_id) if pack_id else None,
        base_amount_paise=base,
        concession_factor=float(factor),
        leased_multiplier=float(leased_factor),
        exemption_applied=False,
        existing_credit_paise=existing_credit_paise,
        required_amount_paise=required,
        trace_json=trace,
    )
    db.add(requirement)
    await db.flush()

    return {
        "base_amount_paise": base,
        "concession_factor": float(factor),
        "leased_multiplier": float(leased_factor),
        "exemption_applied": False,
        "exemption_reason": None,
        "required_amount_paise": required,
        "trace": trace,
        "computed_at": datetime.now(timezone.utc).isoformat(),
    }