from sqlalchemy import Column, String, CheckConstraint, UUID, JSON, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class Clearance(Base):
    __tablename__ = "clearances"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    release_request_id = Column(PGUUID(as_uuid=True), ForeignKey("release_requests.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)
    status = Column(String(30), nullable=False, default="PENDING")
    source = Column(String(20), nullable=False, default="MOCK")
    reference = Column(String(100), nullable=True)
    verified_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    is_official = Column(Boolean, nullable=False, default=True)
    required = Column(Boolean, nullable=False, default=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('PENDING','CLEAR','BLOCKED','NEEDS_INFO','SOURCE_UNAVAILABLE','NOT_APPLICABLE')",
            name="chk_clearance_status",
        ),
        CheckConstraint(
            "type IN ('DOCUMENTS','PROVENANCE','PGRC','VIGILANCE','GRANTS','FINANCIAL_EMBEZZLEMENT','COMPLAINTS_DISCIPLINARY','PROGRESSIVE_CLOSURE','MERGER','TERM_SERVED','DUES_PENALTIES','BANK_LIEN','RTGS_SANCTION')",
            name="chk_clearance_type",
        ),
        __import__("sqlalchemy").schema.UniqueConstraint("release_request_id", "type", name="uq_release_request_clearance_type"),
    )

    release_request = relationship("ReleaseRequest", back_populates="clearances")
    verifier = relationship("User", back_populates="clearances_verified")