from sqlalchemy import Column, String, Boolean, DateTime, Text, UUID, CheckConstraint, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class ReleaseRequest(Base):
    __tablename__ = "release_requests"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(PGUUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    request_type = Column(String(30), nullable=False)
    financial_embezzlement_flag = Column(Boolean, nullable=False, default=False)
    requested_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    requested_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    status = Column(String(30), nullable=False, default="DRAFT")
    eligibility_result = Column(String(30), nullable=True)
    decision = Column(String(30), nullable=True)
    decided_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    decided_at = Column(DateTime, nullable=True)
    noc_number = Column(String(50), nullable=True)
    sanction_order_number = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('DRAFT','SUBMITTED','ELIGIBILITY_CHECK','BLOCKED','NEEDS_INFO','PENDING_SOURCE','ELIGIBLE','MAKER_RECOMMENDED','CHECKER_APPROVED','CA_APPROVED','NOC_ISSUED','SANCTION_ISSUED','RELEASED','REJECTED','WITHDRAWN')",
            name="chk_release_request_status",
        ),
        CheckConstraint(
            "eligibility_result IN ('ELIGIBLE','BLOCKED','NEEDS_INFO','PENDING_SOURCE')",
            name="chk_eligibility_result",
        ),
        CheckConstraint(
            "request_type IN ('MATURITY','EARLY','CLOSURE','PROGRESSIVE_CLOSURE','MERGER')",
            name="chk_release_request_type",
        ),
    )

    institution = relationship("Institution", back_populates="release_requests")
    instrument = relationship("Instrument", back_populates="release_requests")
    requester = relationship("User", back_populates="release_requests_created")
    clearances = relationship("Clearance", back_populates="release_request", cascade="all, delete-orphan")