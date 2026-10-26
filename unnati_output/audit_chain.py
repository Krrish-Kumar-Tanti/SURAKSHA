# Unnati Sharma — Audit Chain Implementation (§7.1)
# SURAKSHA SIH26265 — Backend Deliverable
# File: audit.py / core/audit.py equivalent

"""
Audit chain: append-only, SHA-256 hash-chained, tamper-evident.
Every mutation writes an event. Genesis prev_hash = "0" * 64.
"""

import hashlib
import json
from datetime import datetime, timezone
from typing import Optional


class AuditEvent:
    def __init__(
        self,
        event_type: str,
        actor_id: str,
        actor_role: str,
        entity_type: str,
        entity_id: str,
        payload: dict = None,
        timestamp: Optional[str] = None,
    ):
        self.event_type = event_type
        self.actor_id = actor_id
        self.actor_role = actor_role
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.payload = payload or {}
        self.timestamp = timestamp or datetime.now(timezone.utc).isoformat()
        self.seq: Optional[int] = None
        self.prev_hash: str = ""
        self.hash_digest: str = ""


def canonical_json(obj: dict) -> str:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def compute_digest(prev_hash: str, event: AuditEvent) -> str:
    payload = {
        "event_type": event.event_type,
        "actor_id": event.actor_id,
        "actor_role": event.actor_role,
        "entity_type": event.entity_type,
        "entity_id": event.entity_id,
        "timestamp": event.timestamp,
        "data": event.payload,
    }
    canonical = canonical_json(payload)
    combined = f"{prev_hash}|{canonical}"
    return hashlib.sha256(combined.encode("utf-8")).hexdigest()


def verify_chain(chain: list) -> dict:
    """Walk from genesis; return valid / first broken / checked count."""
    checked = 0
    for i, event in enumerate(chain):
        checked += 1
        expected_prev = "0" * 64 if i == 0 else chain[i - 1].hash_digest
        reconstructed = compute_digest(expected_prev, event)
        if reconstructed != event.hash_digest:
            return {
                "valid": False,
                "first_broken_seq": event.seq,
                "expected_prev": expected_prev,
                "actual_prev": event.prev_hash,
                "checked": checked,
            }
    return {"valid": True, "first_broken_seq": None, "checked": checked}


# Example fixture demonstrating chain
if __name__ == "__main__":
    genesis = AuditEvent(
        event_type="AUDIT_INIT",
        actor_id="system",
        actor_role="ADMIN",
        entity_type="SETTINGS",
        entity_id="audit-genesis",
    )
    genesis.seq = 1
    genesis.prev_hash = "0" * 64
    genesis.hash_digest = compute_digest(genesis.prev_hash, genesis)

    event2 = AuditEvent(
        event_type="INSTRUMENT_SUBMITTED",
        actor_id="user-001",
        actor_role="INSTITUTION_USER",
        entity_type="INSTRUMENT",
        entity_id="inst-001",
        payload={"instrument_number": "FDR-SIT-001"},
    )
    event2.seq = 2
    event2.prev_hash = genesis.hash_digest
    event2.hash_digest = compute_digest(event2.prev_hash, event2)

    chain = [genesis, event2]
    result = verify_chain(chain)
    print("Audit verify result:", result)
