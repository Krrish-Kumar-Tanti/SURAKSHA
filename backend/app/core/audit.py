import json
import hashlib
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.core.config import settings
from app.models.base import AuditEvent, AuditChainVerifier

# Genesis hash for the audit chain
GENESIS_HASH = "0" * 64


def emit_audit_event(
    db: Session,
    event_type: str,
    actor_id: str,
    actor_role: str | None,
    entity_type: str,
    entity_id: str,
    payload: dict | None = None,
) -> AuditEvent:
    """Create a new audit event and append it to the hash-chained audit log.

    The payload is stored as JSON; the hash is computed as:
        hash = sha256((prev_hash + canonical(payload)).encode("utf-8")).hexdigest()
    where canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    """
    # Get the last event's hash
    from app.models.audit_event import AuditEvent as AEModel
    last = db.execute(
        select(AEModel).order_by(AEModel.seq.desc())
    ).scalar_one_or_none()

    prev_hash = last.hash if last else GENESIS_HASH
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False) if payload else "{}"
    hash_value = hashlib.sha256((prev_hash + canonical).encode("utf-8")).hexdigest()

    event = AuditEvent(
        event_type=event_type,
        actor_id=actor_id,
        actor_role=actor_role,
        entity_type=entity_type,
        entity_id=entity_id,
        payload_json=json.dumps(payload) if payload else "{}",
        prev_hash=prev_hash,
        hash=hash_value,
        created_at=datetime.now(timezone.utc),
    )

    db.add(event)
    db.flush()
    return event


def verify_audit_chain(db: Session) -> bool:
    """Verify the entire audit chain from genesis to latest.

    Returns True if the chain is valid, False otherwise.
    Also returns the first broken sequence number if invalid.
    """
    from app.models.audit_event import AuditEvent as AEModel

    events = db.execute(
        select(AEModel).order_by(AEModel.seq.asc())
    ).scalars().all()

    if not events:
        return True  # Empty chain is valid

    prev_hash = GENESIS_HASH
    for i, event in enumerate(events):
        canonical = json.dumps(event.payload_json, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
        expected_hash = hashlib.sha256((prev_hash + canonical).encode("utf-8")).hexdigest()
        if event.hash != expected_hash:
            return False  # Chain broken at event i
        prev_hash = event.hash

    return True