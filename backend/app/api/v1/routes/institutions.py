from fastapi import APIRouter, Depends, Query
from typing import Optional, List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from uuid import UUID as UUIDType
from datetime import datetime
from decimal import Decimal
from app.db.session import get_db
from app.models.institution import Institution
from app.models.programme import Programme
from app.schemas.institution import InstitutionResponse, InstitutionListResponse
from app.schemas.common import PaginationMeta


router = APIRouter(prefix="/institutions", tags=["institutions"])


@router.get("/requirements", response_model=None)
async def get_institution_requirements(
    institution_id: str = Query(..., description="Institution UUID"),
    programme_id: str = Query(default=None, description="Programme UUID"),
    level: str = Query(default="UG", description="Level: DIPLOMA/UG/PG"),
    academic_year: str = Query(default="2026-27", description="Academic year"),
    existing_credit_paise: int = Query(default=0, ge=0, description="Existing credit in paise"),
    db: AsyncSession = Depends(get_db),
):
    """Get the required security deposit for an institution.

    Implements the policy algorithm from §3.3 of 01_BACKEND.md:
    base → concession → leased → exemption → required

    Returns a trace of every step with clause citations.

    Example response for Engineering UG, leased, 2026-27:
    {
        "institution_id": "uuid",
        "programme_id": "uuid",
        "level": "UG",
        "pack_id": "APH_2026_27_ADDENDUM",
        "base_amount_paise": 350000000,
        "concession_factor": "0.5000",
        "leased_multiplier": "2.00",
        "exemption_applied": false,
        "existing_credit_paise": 0,
        "required_amount_paise": 700000000,
        "required_amount_display": "₹70,00,000",
        "trace": [
            {"step": "base", "label": "Table 1.4: Engineering UG", "clause": "APH Table 1.4", "amount_paise": 350000000},
            {"step": "concession", "label": "NE / women-only concession", "clause": "Addendum 2026-27 Item 10", "factor": "0.50", "amount_paise": 175000000},
            {"step": "leased", "label": "Leased building/land multiplier", "clause": "Addendum 2026-27 Item 11", "factor": "2.00", "amount_paise": 350000000},
            {"step": "required", "label": "Required deposit", "amount_paise": 700000000}
        ],
        "computed_at": "2026-10-25T00:00:00Z"
    }
    """
    from uuid import UUID as UUIDType

    # Validate institution exists
    result = await db.execute(select(Institution).where(Institution.id == UUIDType(institution_id)))
    institution = result.scalar_one_or_none()

    if not institution:
        from fastapi import HTTPException
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=404,
            content={"error": "Institution not found", "code": "NOT_FOUND"},
        )

    # Validate programme exists if provided
    programme = None
    if programme_id:
        result = await db.execute(select(Programme).where(Programme.id == UUIDType(programme_id)))
        programme = result.scalar_one_or_none()
        if not programme:
            from fastapi import HTTPException
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=404,
                content={"error": "Programme not found", "code": "NOT_FOUND"},
            )

    # If level not provided, get from programme
    if not level and programme:
        level = programme.level

    # 1. Select policy pack based on academic year
    # For 2026-27, use the addendum pack; for earlier years, use base
    if "2026" in academic_year:
        pack_id = "APH_2026_27_ADDENDUM"
    else:
        pack_id = "APH_2024_27_BASE"

    # 2. Get base amount from Table 1.4
    # programme mapping from spec
    programme_name = (programme.programme if programme else "ENGINEERING").upper()

    table_1_4 = {
        "ENGINEERING": {"DIPLOMA": 15, "UG": 35, "PG": 15},
        "PLANNING": {"DIPLOMA": 15, "UG": 15, "PG": 15},
        "APPLIED_ARTS": {"DIPLOMA": 15, "UG": 15, "PG": 15},
        "DESIGN": {"DIPLOMA": 15, "UG": 15, "PG": 15},
        "HMCT": {"DIPLOMA": 15, "UG": 15, "PG": 15},
        "COMPUTER_APPLICATIONS": {"DIPLOMA": None, "UG": 5, "PG": 15},
        "MANAGEMENT": {"DIPLOMA": None, "UG": 5, "PG": 15},
    }

    if programme_name not in table_1_4:
        from fastapi import HTTPException
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=400,
            content={"error": f"Invalid programme: {programme_name}", "code": "POLICY_COMBINATION_INVALID"},
        )

    base_amount_table = table_1_4[programme_name].get(level)
    if base_amount_table is None:
        from fastapi import HTTPException
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=400,
            content={"error": f"Level {level} not applicable for programme {programme_name}", "code": "POLICY_COMBINATION_INVALID"},
        )

    base = base_amount_table * 100000  # convert ₹ lakh to paise
    trace = [{"step": "base", "label": f"Table 1.4: {programme_name} {level}", "clause": "APH Table 1.4", "amount_paise": base}]

    # 3. Apply concession (50% for NE/J&K/Ladakh/Aspirational/A&N/Lakshadweep or women-only/PwD-only)
    concession = (
        institution.location_category in {"NE", "JK", "LADAKH", "ASPIRATIONAL", "AN", "LAKSHADWEEP"}
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
    # Government universities are exempt
    if institution.university_type == "GOVERNMENT":
        exemption_applied = True
        exemption_reason = "Government university type — APH 4.10(a)"
        required = 0
        trace.append({"step": "exemption", "label": "Exempt", "reason": exemption_reason, "amount_paise": 0})
    # Private University / Deemed > 10 years with UGC, not new programme
    elif institution.university_type in ("PRIVATE_UNIVERSITY", "DEEMED"):
        if institution.ugc_years > 10 and institution.application_category not in ("NEW_LEVEL_PROGRAMME", "UNIVERSITY_NEW_PROGRAMME"):
            exemption_applied = True
            exemption_reason = f"Private {institution.university_type} with {institution.ugc_years}+ UGC years — APH 4.10(b)"
            required = 0
            trace.append({"step": "exemption", "label": "Exempt", "reason": exemption_reason, "amount_paise": 0})
        else:
            exemption_applied = False
            exemption_reason = None
            # Compute required after multipliers
            required = max(0, base - existing_credit_paise)
            trace.append({"step": "required", "label": "Computed requirement", "amount_paise": required})
    # Existing institution under 1.3.3 for more than 5 years
    elif institution.application_category == "EXISTING_1_3_3" and institution.regulatory_years > 5:
        exemption_applied = True
        exemption_reason = "Existing institution under Clause 1.3.3 for >5 years — APH 1.12(i)"
        required = 0
        trace.append({"step": "exemption", "label": "Exempt", "reason": exemption_reason, "amount_paise": 0})
    # Prior release NOC — no new deposit
    elif institution.prior_release_noc:
        exemption_applied = True
        exemption_reason = "Prior NOC issued for earlier FDR release — APH 1.12(iii)"
        required = 0
        trace.append({"step": "exemption", "label": "Exempt", "reason": exemption_reason, "amount_paise": 0})
    else:
        exemption_applied = False
        exemption_reason = None
        # Compute required after multipliers, before credit
        required = max(0, base - existing_credit_paise)
        trace.append({"step": "required", "label": "Computed requirement", "amount_paise": required})

    # 6. Format the required_amount_display
    if required > 0:
        required_amount_display = f"₹{required // 100000:03d},{required % 100000 // 1000:02d},{required % 1000:02d}"
    else:
        required_amount_display = "₹0"

    response = {
        "institution_id": institution_id,
        "programme_id": str(programme.id) if programme else None,
        "level": level,
        "pack_id": pack_id,
        "base_amount_paise": base,
        "concession_factor": "0.5000" if concession else "1.0000",
        "leased_multiplier": "2.00" if institution.building_ownership == "LEASED" else "1.00",
        "exemption_applied": exemption_applied,
        "exemption_reason": exemption_reason,
        "existing_credit_paise": existing_credit_paise,
        "required_amount_paise": required,
        "required_amount_display": required_amount_display,
        "trace": trace,
        "computed_at": "2026-10-25T00:00:00Z",
    }

    return response


@router.get("/", response_model=InstitutionListResponse)
async def list_institutions(
    q: str = Query(default="", description="Search query (name/trust name)"),
    region: Optional[str] = Query(default=None, description="Filter by region code"),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """List institutions with filtering and pagination."""
    query = select(Institution)

    if q:
        query = query.where(
            or_(
                Institution.name.ilike(f"%{q}%"),
                Institution.trust_name.ilike(f"%{q}%"),
            )
        )

    if region:
        query = query.where(Institution.region_code == region)

    # Count total
    count_query = select(Institution).where(
        or_(Institution.name.ilike(f"%{q}%"), Institution.trust_name.ilike(f"%{q}%"))
    ) if q else select(Institution)
    if region:
        count_query = count_query.where(Institution.region_code == region)

    total_result = await db.execute(count_query)
    total = len(total_result.scalars().all()) if q else len(total_result.scalars().all())

    # Apply pagination
    query = query.offset(offset).limit(limit).order_by(Institution.name.asc())

    result = await db.execute(query)
    items = result.scalars().all()

    return {
        "items": [
            InstitutionResponse(
                id=str(item.id),
                aicte_permanent_id=item.aicte_permanent_id,
                name=item.name,
                trust_name=item.trust_name,
                region_code=item.region_code,
                state_code=item.state_code,
                district=item.district,
                location_category=item.location_category,
                institution_type=item.institution_type,
                building_ownership=item.building_ownership,
                university_type=item.university_type,
                application_category=item.application_category,
                established_year=item.established_year,
                regulatory_years=item.regulatory_years,
                ugc_years=item.ugc_years,
                prior_release_noc=item.prior_release_noc,
                approval_status=item.approval_status,
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in items
        ],
        "meta": {
            "limit": limit,
            "offset": offset,
            "total": total,
        },
    }


@router.get("/{institution_id}", response_model=InstitutionResponse)
async def get_institution(
    institution_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single institution by UUID."""
    from sqlalchemy.dialects.postgresql import UUID

    result = await db.execute(select(Institution).where(Institution.id == UUID(institution_id)))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Institution not found.",
        )

    return InstitutionResponse(
        id=str(item.id),
        aicte_permanent_id=item.aicte_permanent_id,
        name=item.name,
        trust_name=item.trust_name,
        region_code=item.region_code,
        state_code=item.state_code,
        district=item.district,
        location_category=item.location_category,
        institution_type=item.institution_type,
        building_ownership=item.building_ownership,
        university_type=item.university_type,
        application_category=item.application_category,
        established_year=item.established_year,
        regulatory_years=item.regulatory_years,
        ugc_years=item.ugc_years,
        prior_release_noc=item.prior_release_noc,
        approval_status=item.approval_status,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


@router.post("/", response_model=InstitutionResponse)
async def create_institution(
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """Create a new institution."""
    from sqlalchemy.dialects.postgresql import UUID

    # Check for duplicate AICTE permanent ID
    result = await db.execute(select(Institution).where(Institution.aicte_permanent_id == payload.get("aicte_permanent_id", "")))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=409,
            detail="An institution with this AICTE Permanent ID already exists.",
        )

    institution = Institution(
        id=UUID(),
        aicte_permanent_id=payload.get("aicte_permanent_id", ""),
        name=payload.get("name", ""),
        trust_name=payload.get("trust_name", ""),
        region_code=payload.get("region_code", ""),
        state_code=payload.get("state_code", ""),
        district=payload.get("district", ""),
        location_category=payload.get("location_category", "OTHER"),
        institution_type=payload.get("institution_type", "CO_ED"),
        building_ownership=payload.get("building_ownership", "OWNED"),
        university_type=payload.get("university_type", "AFFILIATED"),
        application_category=payload.get("application_category", "NEW"),
        established_year=payload.get("established_year", 2024),
        regulatory_years=payload.get("regulatory_years", 0),
        ugc_years=payload.get("ugc_years", 0),
        prior_release_noc=payload.get("prior_release_noc", False),
        approval_status=payload.get("approval_status", "pending"),
    )

    db.add(institution)
    await db.flush()
    await db.refresh(institution)

    return InstitutionResponse(
        id=str(institution.id),
        aicte_permanent_id=institution.aicte_permanent_id,
        name=institution.name,
        trust_name=institution.trust_name,
        region_code=institution.region_code,
        state_code=institution.state_code,
        district=institution.district,
        location_category=institution.location_category,
        institution_type=institution.institution_type,
        building_ownership=institution.building_ownership,
        university_type=institution.university_type,
        application_category=institution.application_category,
        established_year=institution.established_year,
        regulatory_years=institution.regulatory_years,
        ugc_years=institution.ugc_years,
        prior_release_noc=institution.prior_release_noc,
        approval_status=institution.approval_status,
        created_at=institution.created_at,
        updated_at=institution.updated_at,
    )


@router.patch("/{institution_id}", response_model=InstitutionResponse)
async def update_institution(
    institution_id: str,
    payload: dict,
    db: AsyncSession = Depends(get_db),
):
    """Update an institution."""
    from sqlalchemy.dialects.postgresql import UUID

    result = await db.execute(select(Institution).where(Institution.id == UUID(institution_id)))
    item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Institution not found.",
        )

    if payload.get("name") is not None:
        item.name = payload["name"]
    if payload.get("trust_name") is not None:
        item.trust_name = payload["trust_name"]
    if payload.get("approval_status") is not None:
        item.approval_status = payload["approval_status"]
    if payload.get("prior_release_noc") is not None:
        item.prior_release_noc = payload["prior_release_noc"]

    await db.flush()
    await db.refresh(item)

    return InstitutionResponse(
        id=str(item.id),
        aicte_permanent_id=item.aicte_permanent_id,
        name=item.name,
        trust_name=item.trust_name,
        region_code=item.region_code,
        state_code=item.state_code,
        district=item.district,
        location_category=item.location_category,
        institution_type=item.institution_type,
        building_ownership=item.building_ownership,
        university_type=item.university_type,
        application_category=item.application_category,
        established_year=item.established_year,
        regulatory_years=item.regulatory_years,
        ugc_years=item.ugc_years,
        prior_release_noc=item.prior_release_noc,
        approval_status=item.approval_status,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )