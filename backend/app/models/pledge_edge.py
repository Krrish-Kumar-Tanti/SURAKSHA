from sqlalchemy import Column, String, CheckConstraint, UUID, JSON, ForeignKey, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID as PGUUID
import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import relationship
from app.db.base import Base


class PledgeEdge(Base):
    __tablename__ = "pledge_edges"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    from_instrument_id = Column(PGUUID(as_uuid=True), ForeignKey("instruments.id", ondelete="CASCADE"), nullable=False)
    to_entity_type = Column(String(30), nullable=False)
    to_entity_id = Column(String(100), nullable=False)
    edge_type = Column(String(30), nullable=False)
    confidence = Column(Numeric(5,4), nullable=False, default=1.0)
    evidence_json = Column(JSON, nullable=False, default="{}")
    created_at = Column(DateTime, nullable=False, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        CheckConstraint(
            "to_entity_type IN ('INSTITUTION','APPROVAL','BANK','DOCUMENT','SIGNATORY')",
            name="chk_pledge_entity_type",
        ),
        CheckConstraint(
            "edge_type IN ('PLEDGED_FOR','RENEWED_FROM','SAME_NUMBER','SAME_HASH','SAME_ACCOUNT','SAME_SIGNATORY')",
            name="chk_pledge_edge_type",
        ),
    )

    from_instrument = relationship(
        "Instrument",
        foreign_keys=[from_instrument_id],
        back_populates="pledge_edges_from",
    )
    to_instrument = relationship(
        "Instrument",
        foreign_keys=[to_entity_id],
        back_populates="pledge_edges_to",
    )