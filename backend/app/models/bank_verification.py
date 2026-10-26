from sqlalchemy import Column, String, CheckConstraint, UUID, JSON, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class BankVerification(Base):
    __tablename__ = "bank_verifications"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(30), nullable=False)
    record_json = Column(JSON, nullable=False, default="{}")
    source = Column(String(30), nullable=False, default="MOCK")
    reference = Column(String(100), nullable=True)
    timestamp = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    confidence = Column(Numeric(5,4), nullable=True)
    mode = Column(String(20), nullable=False)
    officer_verified_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    officer_verified_at = Column(DateTime, nullable=True)
    written_reason = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('FOUND','NOT_FOUND','ENCASHED','CLOSED','UNSUPPORTED','SOURCE_UNAVAILABLE')",
            name="chk_bank_verification_status",
        ),
        CheckConstraint(
            "mode IN ('API','LETTER','SANDBOX')",
            name="chk_bank_verification_mode",
        ),
    )

    instrument = relationship("Instrument", back_populates="bank_verifications")
    officer = relationship("User", back_populates="bank_verifications_recorded")