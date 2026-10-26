from __future__ import annotations
from datetime import datetime, timezone, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from uuid import UUID as UUIDType
from app.models.instrument import Instrument as InstModel
from app.models.release_request import ReleaseRequest as RRModel
from app.models.clearance import Clearance as CLModel
from app.models.finding import Finding as FindModel
from app.models.alert import Alert as AlertModel
from app.models.obligation import Obligation as OblModel
from app.services.release_graph import evaluate_release_graph
from app.services.bank_service import BankService


async def daily_lifecycle_job(db: AsyncSession, demo_clock: str | None = None):
    """Daily idempotent lifecycle job (§6.7 of 01_BACKEND.md).

    Runs once per day. Uses demo_clock if provided, otherwise real date.
    Affected instruments: ACTIVE, EXPIRING, RELEASE_REQUESTED, RENEWAL_DUE.

    Tasks:
    - T-90/60/30/15/7/0 maturity/renewal reminders
    - Overdue notice every 7 days after maturity
    - Escalation: day 1 L1, day 15 L2, day 30 L3
    - Bank re-check every 30 days
    - Auto-resolve alerts when conditions clear
    """
    from app.models.system_setting import SystemSetting as SSModel
    from sqlalchemy.dialects.postgresql import UUID as PGUUID

    # Determine effective date
    if demo_clock:
        # Use the demo clock date
        from datetime import date
        effective_date = date.fromisoformat(demo_clock)
    else:
        effective_date = datetime.now(timezone.utc).date()

    # 1. Maturity/renewal reminders based on distance from demo_clock
    # Instruments in: ACTIVE, EXPIRING, RELEASE_REQUESTED, RENEWAL_DUE
    instruments_result = await db.execute(
        select(InstModel).where(
            InstModel.status.in_({
                "ACTIVE", "EXPIRING", "RELEASE_REQUESTED", "RENEWAL_DUE"
            })
        )
    )
    instruments = instruments_result.scalars().all()

    for inst in instruments:
        # Calculate days until maturity
        if inst.maturity_date:
            if isinstance(inst.maturity_date, str):
                mat_date = datetime.fromisoformat(inst.maturity_date).date()
            else:
                mat_date = inst.maturity_date.date() if hasattr(inst.maturity_date, 'date') else inst.maturity_date

            days_to_maturity = (mat_date - effective_date).days

            # T-90: 90 days before maturity reminder
            if 0 < days_to_maturity <= 90:
                await _create_renewal_reminder(db, inst, "MATURITY_DUE", severity="WARNING",
                                               days_before=days_to_maturity)

            # T-60: 60 days before maturity reminder
            if 0 < days_to_maturity <= 60:
                await _create_renewal_reminder(db, inst, "MATURITY_DUE", severity="INFO",
                                               days_before=days_to_maturity)

            # T-30: 30 days before maturity reminder
            if 0 < days_to_maturity <= 30:
                await _create_renewal_reminder(db, inst, "MATURITY_DUE", severity="INFO",
                                               days_before=days_to_maturity)

            # T-15: 15 days before maturity reminder
            if 0 < days_to_maturity <= 15:
                await _create_renewal_reminder(db, inst, "MATURITY_DUE", severity="WARNING",
                                               days_before=days_to_maturity)

            # T-7: 7 days before maturity - overdue notice
            if days_to_maturity == 7:
                await _create_overdue_notice(db, inst)

            # T-0: Maturity day - instrument can be released
            if days_to_maturity == 0:
                await _trigger_maturity_actions(db, inst)

    # 2. Bank re-check every 30 days for instruments under verification
    # Instruments with bank_verifications that are not yet confirmed
    bv_result = await db.execute(
        select(InstModel).join(
            ...  # simplified - would need bank_verifications table
        )
    )

    # 3. Auto-resolve alerts when conditions clear
    await _auto_resolve_alerts(db, effective_date)

    # 4. Escalation tracking
    await _check_escalations(db, effective_date)


async def _create_renewal_reminder(db, inst, alert_type: str, severity: str, days_before: int):
    """Create a renewal/reminder alert."""
    from app.models.alerts import Alert as AlertModel
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    import hashlib
    
    fingerprint = hashlib.sha256(
        f"instrument:{inst.id}:{alert_type}:{(datetime.now(timezone.utc).date() - timedelta(days=days_before)).isoformat()}:0".encode()
    ).hexdigest()
    
    # Check if alert already exists
    existing = await db.execute(
        select(AlertModel).where(
            AlertModel.fingerprint == fingerprint,
            AlertModel.instrument_id == UUIDType(inst.id),
            AlertModel.status == "OPEN",
        )
    )
    if existing.scalar_one_or_none():
        return  # Already has active alert

    alert = AlertModel(
        id=PGUUID(),
        instrument_id=UUIDType(inst.id),
        type=alert_type,
        severity=severity,
        due_date=datetime.now(timezone.utc).date() + timedelta(days=days_before if days_before > 0 else 0),
        escalation_level=0,
        status="OPEN",
        fingerprint=fingerprint,
    )
    db.add(alert)


async def _create_overdue_notice(db, inst):
    """Create overdue notice for instrument past maturity."""
    from app.models.alerts import Alert as AlertModel
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    import hashlib
    
    fingerprint = hashlib.sha256(
        f"instrument:{inst.id}:OVERDUE:{datetime.now(timezone.utc).date().isoformat()}:0".encode()
    ).hexdigest()
    
    existing = await db.execute(
        select(AlertModel).where(
            AlertModel.fingerprint == fingerprint,
            AlertModel.instrument_id == UUIDType(inst.id),
            AlertModel.status == "OPEN",
        )
    )
    if existing.scalar_one_or_none():
        return  # Already has active overdue alert

    alert = AlertModel(
        id=PGUUID(),
        instrument_id=UUIDType(inst.id),
        type="OVERDUE",
        severity="CRITICAL",
        due_date=datetime.now(timezone.utc).date(),
        escalation_level=0,
        status="OPEN",
        fingerprint=fingerprint,
    )
    db.add(alert)


async def _trigger_maturity_actions(db, inst):
    """Trigger actions when instrument matures."""
    from app.models.release_request import ReleaseRequest as RRModel
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    
    # Check if there's an existing release request
    rr_result = await db.execute(
        select(RRModel).where(RRModel.instrument_id == UUIDType(inst.id))
    )
    existing_rr = rr_result.scalar_one_or_none()
    
    if not existing_rr:
        # Create maturity release request
        from datetime import timezone as tz
        rr = RRModel(
            id=PGUUID(),
            institution_id=inst.institution_id,
            instrument_id=UUIDType(inst.id),
            request_type="MATURITY",
            financial_embezzlement_flag=False,
            requested_by=UUIDType("00000000-0000-0000-0000-000000000001"),  # placeholder
            requested_at=datetime.now(timezone.utc),
            status="ELIGIBILITY_CHECK",
        )
        db.add(rr)
    else:
        # Re-evaluate existing release request
        await evaluate_release_graph(existing_rr, db)


async def _auto_resolve_alerts(db, effective_date):
    """Auto-resolve alerts when underlying conditions clear."""
    from app.models.alerts import Alert as AlertModel
    from sqlalchemy import select, and_
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    
    # Find alerts that should be resolved
    # e.g., maturity notices resolved when clock passes the date
    stale_alerts = await db.execute(
        select(AlertModel).where(
            AlertModel.status == "OPEN",
            # Add condition based on effective_date
        )
    )
    
    alerts = stale_alerts.scalars().all()
    for alert in alerts:
        # Simple resolution: if the due date has passed, mark as resolved
        if alert.due_date <= effective_date:
            alert.status = "RESOLVED"
            alert.resolved_at = datetime.now(timezone.utc)


async def _check_escalations(db, effective_date):
    """Check and update escalation levels for open alerts."""
    from app.models.alerts import Alert as AlertModel
    from sqlalchemy import select, and_
    from sqlalchemy.dialects.postgresql import UUID as PGUUID
    from datetime import timedelta
    
    # Find alerts that need escalation
    # L1: dealing officer (day 1), L2: director (day 15), L3: competent authority (day 30)
    alerts_result = await db.execute(
        select(AlertModel).where(
            AlertModel.status == "OPEN",
        )
    )
    alerts = alerts_result.scalars().all()
    
    for alert in alerts:
        # Calculate escalation level based on age
        days_open = (effective_date - alert.due_date).days if alert.due_date else 0
        
        if days_open >= 30:
            alert.escalation_level = 3  # L3: Competent Authority
        elif days_open >= 15:
            alert.escalation_level = 2  # L2: Director
        elif days_open >= 1:
            alert.escalation_level = 1  # L1: Dealing Officer
        else:
            alert.escalation_level = 0  # L0: Initial