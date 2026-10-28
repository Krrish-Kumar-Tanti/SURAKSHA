from sqlalchemy import Column, String, CheckConstraint, UUID, JSON, ForeignKey, DateTime, Date, Integer
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(30), nullable=False)
    severity = Column(String(20), nullable=False)
    due_date = Column(Date, nullable=False)
    escalation_level = Column(Integer, nullable=False, default=0)
    status = Column(String(20), nullable=False, default="OPEN")
    fingerprint = Column(String(64), nullable=False, unique=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "severity IN ('INFO','WARNING','CRITICAL')",
            name="chk_alert_severity",
        ),
        CheckConstraint(
            "status IN ('OPEN','ACKNOWLEDGED','RESOLVED','CANCELLED')",
            name="chk_alert_status",
        ),
    )

    instrument = relationship("Instrument", back_populates="alerts")