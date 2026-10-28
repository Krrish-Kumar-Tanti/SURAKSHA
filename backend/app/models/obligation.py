from sqlalchemy import Column, String, Date, Integer, Boolean, CheckConstraint, UUID, JSON, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    institution_id = Column(PGUUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(30), nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="OPEN")
    escalation_level = Column(Integer, nullable=False, default=0)
    owner_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    fingerprint = Column(String(64), nullable=False, unique=True)
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('OPEN','DONE','OVERDUE','CANCELLED')",
            name="chk_obligation_status",
        ),
    )

    instrument = relationship("Instrument", back_populates="obligations")
    institution = relationship("Institution", back_populates="obligations")
    owner = relationship("User", back_populates="obligations_created")