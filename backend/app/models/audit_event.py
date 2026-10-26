from sqlalchemy import Column, BigInteger, String, DateTime, Text, JSON, CheckConstraint, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime, timezone
from app.db.base import Base


class AuditEvent(Base):
    __tablename__ = "audit_events"

    seq = Column(BigInteger, primary_key=True, autoincrement=True)
    event_type = Column(String(50), nullable=False)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    actor_role = Column(String(20), nullable=True)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(100), nullable=False)
    payload_json = Column(JSON, nullable=False)
    prev_hash = Column(String(64), nullable=False)
    hash = Column(String(64), nullable=False)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            """event_type IN (
                'INSTRUMENT_UPLOADED','INSTRUMENT_EXTRACTED','INSTRUMENT_VERIFIED',
                'FINDING_RAISED','FINDING_DISPOSED','REQUIREMENT_CALCULATED',
                'INSTRUMENT_STATUS_CHANGED','RELEASE_REQUEST_CREATED',
                'RELEASE_ELIGIBILITY_EVALUATED','RELEASE_DECISION',
                'AUDIT_CLOCK_ADVANCED','DOCUMENT_UPLOADED','AUDIT_CHAIN_VERIFIED'
            )""",
            name="chk_audit_event_type",
        ),
        Index("idx_audit_entity", "entity_type", "entity_id"),
        Index("idx_audit_created", "created_at"),
    )