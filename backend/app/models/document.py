from sqlalchemy import Column, String, DateTime, Text, BigInteger, UUID, CheckConstraint, ForeignKey, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    release_request_id = Column(PGUUID(as_uuid=True), ForeignKey("release_requests.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(50), nullable=False)
    file_name = Column(String(500), nullable=False)
    sha256 = Column(String(64), nullable=False, unique=True)
    storage_key = Column(String(500), nullable=False)
    encryption_meta = Column(JSON, nullable=False, default="{}")
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(BigInteger, nullable=False)
    uploaded_by = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    uploaded_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))
    version = Column(Integer, nullable=False, default=1)
    ocr_status = Column(String(30), nullable=False, default="PENDING")

    __table_args__ = (
        CheckConstraint(
            "ocr_status IN ('PENDING','TEXT_LAYER','OCR_DONE','NEEDS_REVIEW','FAILED')",
            name="chk_document_ocr_status",
        ),
    )

    instrument = relationship("Instrument", back_populates="documents")
    uploader = relationship("User", back_populates="uploaded_documents")