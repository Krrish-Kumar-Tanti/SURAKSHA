from sqlalchemy import Column, String, Text, Numeric, Integer, DateTime, UUID, JSON, CheckConstraint, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class ProvenanceField(Base):
    __tablename__ = "provenance_fields"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    field_name = Column(String(50), nullable=False)
    declared_value = Column(Text, nullable=True)
    document_value = Column(Text, nullable=True)
    bank_value = Column(Text, nullable=True)
    document_confidence = Column(Numeric(5,4), nullable=True)
    document_page = Column(Integer, nullable=True)
    document_bbox = Column(JSON, nullable=True)
    bank_source = Column(String(50), nullable=True)
    bank_reference = Column(String(100), nullable=True)
    bank_timestamp = Column(DateTime, nullable=True)
    status = Column(String(30), nullable=False)

    __table_args__ = (
        CheckConstraint(
            "status IN ('MATCH','MISMATCH','MISSING_DOCUMENT','MISSING_BANK','LOW_CONFIDENCE')",
            name="chk_provenance_status",
        ),
        __import__("sqlalchemy").schema.UniqueConstraint("instrument_id", "field_name", name="uq_prov_instrument_field"),
    )

    instrument = relationship("Instrument", back_populates="provenance_fields")