from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, BigInteger, UUID, CheckConstraint, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from app.db.base import Base


class Requirement(Base):
    __tablename__ = "requirements"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(PGUUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    programme_id = Column(PGUUID(as_uuid=True), ForeignKey("programmes.id", ondelete="SET NULL"), nullable=True)
    pack_id = Column(PGUUID(as_uuid=True), ForeignKey("policy_packs.id", ondelete="RESTRICT"), nullable=False)
    base_amount_paise = Column(BigInteger, nullable=False)
    concession_factor = Column(Integer, nullable=False, default=10000)  # stored as 1.0000 * 10000
    leased_multiplier = Column(Integer, nullable=False, default=100)  # stored as 1.00 * 100
    exemption_applied = Column(Boolean, nullable=False, default=False)
    exemption_reason = Column(Text, nullable=True)
    existing_credit_paise = Column(BigInteger, nullable=False, default=0)
    required_amount_paise = Column(BigInteger, nullable=False)
    trace_json = Column(JSON, nullable=False)
    computed_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    institution = relationship("Institution", back_populates="requirements")
    programme = relationship("Programme", back_populates="requirements")
    policy_pack = relationship("PolicyPack", back_populates="requirements")