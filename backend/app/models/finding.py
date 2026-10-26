from sqlalchemy import Column, String, Text, Integer, DateTime, UUID, JSON, CheckConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class Finding(Base):
    __tablename__ = "findings"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    rule_id = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)
    field_name = Column(String(50), nullable=True)
    reason = Column(Text, nullable=False)
    evidence_json = Column(JSON, nullable=False, default="{}")
    suggested_action = Column(Text, nullable=False)
    disposition = Column(String(20), nullable=False, default="OPEN")
    disposition_reason = Column(Text, nullable=True)
    actor_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "severity IN ('CRITICAL','SERIOUS','WARNING')",
            name="chk_finding_severity",
        ),
        CheckConstraint(
            "disposition IN ('OPEN','ACCEPTED','WAIVED','RESOLVED')",
            name="chk_finding_disposition",
        ),
    )

    instrument = relationship("Instrument", back_populates="findings")
    actor = relationship("User", back_populates="findings_actor")