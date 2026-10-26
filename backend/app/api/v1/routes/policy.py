from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List, Dict, Any, Union
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from app.db.session import get_db
from app.models.policy_pack import PolicyPack
from app.models.policy_rule import PolicyRule
from app.schemas.policy import (
    PolicyPackCreate,
    PolicyPackResponse,
    PolicyRuleCreate,
    PolicyRuleResponse,
    PolicyCalculateRequest,
    PolicyCalculateResponse,
    PolicyDiffResponse,
)


router = APIRouter(prefix="/policy", tags=["policy"])


@router.get("/packs", response_model=List[PolicyPackResponse])
async def list_policy_packs(
    db: AsyncSession = Depends(get_db),
):
    """List all policy packs."""
    result = await db.execute(select(PolicyPack).order_by(PolicyPack.academic_year))
    return result.scalars().all()


@router.get("/packs/{pack_id}/rules", response_model=List[PolicyRuleResponse])
async def list_policy_rules(
    pack_id: str,
    db: AsyncSession = Depends(get_db),
):
    """List all rules for a given policy pack."""
    result = await db.execute(select(PolicyRule).where(PolicyRule.pack_id == UUID(pack_id)))
    return result.scalars().all()


@router.post("/calculate", response_model=PolicyCalculateResponse)
async def calculate_requirement(
    payload: PolicyCalculateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Calculate the required security deposit for an institution.

    Applies: base → concession → leased → exemption → required.
    Returns a trace of every step with clause citations.
    """
    from app.services.policy_engine import calculate_requirement as calc

    result = await calc(payload, db)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return PolicyCalculateResponse(
        base_amount_paise=result["base_amount_paise"],
        concession_factor=result["concession_factor"],
        leased_multiplier=result["leased_multiplier"],
        exemption_applied=result["exemption_applied"],
        exemption_reason=result.get("exemption_reason"),
        required_amount_paise=result["required_amount_paise"],
        trace=result["trace"],
        computed_at=result["computed_at"],
    )


@router.get("/diff", response_model=PolicyDiffResponse)
async def policy_diff(
    base: str = Query(..., description="Base pack ID, e.g. APH_2024_27_BASE"),
    overlay: str = Query(..., description="Overlay pack ID, e.g. APH_2026_27_ADDENDUM"),
    db: AsyncSession = Depends(get_db),
):
    """Show the diff between two policy packs.

    Returns which rules changed, with clause citations and effective dates.
    """
    # Load base and overlay packs
    base_result = await db.execute(select(PolicyPack).where(PolicyPack.id == UUID(base)))
    overlay_result = await db.execute(select(PolicyPack).where(PolicyPack.id == UUID(overlay)))

    base_pack = base_result.scalar_one_or_none()
    overlay_pack = overlay_result.scalar_one_or_none()

    if not base_pack or not overlay_pack:
        raise HTTPException(status_code=404, detail="One or both policy packs not found.")

    # Load rules for both packs
    base_rules_result = await db.execute(select(PolicyRule).where(PolicyRule.pack_id == UUID(base)))
    overlay_rules_result = await db.execute(select(PolicyRule).where(PolicyRule.pack_id == UUID(overlay)))

    base_rules = {r.rule_key: r for r in base_rules_result.scalars().all()}
    overlay_rules = {r.rule_key: r for r in overlay_rules_result.scalars().all()}

    # Find differing rules
    all_keys = set(base_rules.keys()) | set(overlay_rules.keys())
    rules_differ = []
    for key in all_keys:
        br = base_rules.get(key)
        or_ = overlay_rules.get(key)
        if br is None:
            # New rule in overlay
            rules_differ.append(
                {
                    "rule_key": key,
                    "action": "added",
                    "overlay_rule": {
                        "clause": or_.clause,
                        "description": or_.description,
                        "rule_type": or_.rule_type,
                        "source_excerpt": or_.source_excerpt,
                        "effective_from": str(or_.effective_from) if or_.effective_from else None,
                        "effective_to": str(or_.effective_to) if or_.effective_to else None,
                        "status": or_.status,
                    },
                }
            )
        elif or_ is None:
            # Rule removed in overlay
            rules_differ.append(
                {
                    "rule_key": key,
                    "action": "removed",
                    "base_rule": {
                        "clause": br.clause,
                        "description": br.description,
                        "rule_type": br.rule_type,
                        "source_excerpt": br.source_excerpt,
                        "effective_from": str(br.effective_from) if br.effective_from else None,
                        "effective_to": str(br.effective_to) if br.effective_to else None,
                        "status": br.status,
                    },
                }
            )
        elif br.status != or_.status or br.effective_from != or_.effective_from or br.effective_to != or_.effective_to or br.payload_json != or_.payload_json:
            # Rule modified
            rules_differ.append(
                {
                    "rule_key": key,
                    "action": "modified",
                    "base_rule": {
                        "clause": br.clause,
                        "description": br.description,
                        "rule_type": br.rule_type,
                        "source_excerpt": br.source_excerpt,
                        "effective_from": str(br.effective_from) if br.effective_from else None,
                        "effective_to": str(br.effective_to) if br.effective_to else None,
                        "status": br.status,
                    },
                    "overlay_rule": {
                        "clause": or_.clause,
                        "description": or_.description,
                        "rule_type": or_.rule_type,
                        "source_excerpt": or_.source_excerpt,
                        "effective_from": str(or_.effective_from) if or_.effective_from else None,
                        "effective_to": str(or_.effective_to) if or_.effective_to else None,
                        "status": or_.status,
                    },
                }
            )

    # Compute effective changes summary
    effective_changes = []
    for r in rules_differ:
        if r["action"] == "added":
            effective_changes.append(
                f"Rule '{r['rule_key']}' added: {r['overlay_rule']['clause']}"
            )
        elif r["action"] == "removed":
            effective_changes.append(
                f"Rule '{r['rule_key']}' removed: {r['base_rule']['clause']}"
            )
        elif r["action"] == "modified":
            effective_changes.append(
                f"Rule '{r['rule_key']}' modified: base {r['base_rule']['clause']} → overlay {r['overlay_rule']['clause']}"
            )

    return PolicyDiffResponse(
        base_pack=PolicyPackResponse(
            id=base_pack.id,
            label=base_pack.label,
            academic_year=base_pack.academic_year,
            source_url=base_pack.source_url,
            effective_from=base_pack.effective_from,
            effective_to=base_pack.effective_to,
            status=base_pack.status,
            created_at=base_pack.created_at,
        ),
        overlay_pack=PolicyPackResponse(
            id=overlay_pack.id,
            label=overlay_pack.label,
            academic_year=overlay_pack.academic_year,
            source_url=overlay_pack.source_url,
            effective_from=overlay_pack.effective_from,
            effective_to=overlay_pack.effective_to,
            status=overlay_pack.status,
            created_at=overlay_pack.created_at,
        ),
        rules_differ=rules_differ,
        effective_changes=effective_changes,
    )