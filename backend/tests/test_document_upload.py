import asyncio
import base64
import hashlib
import uuid

import httpx
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.api.v1.routes import instruments as instrument_routes
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.models import Institution, Instrument, Programme, ProvenanceField, User
from app.services.document_storage import read_encrypted_document


@compiles(PostgresUUID, "sqlite")
def compile_postgres_uuid_for_sqlite(type_, compiler, **kwargs):
    return "CHAR(36)"


def test_registrar_upload_encrypts_and_persists_ocr_results(tmp_path, monkeypatch):
    async def scenario():
        engine = create_async_engine("sqlite+aiosqlite:///:memory:")
        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with engine.begin() as connection:
            await connection.run_sync(Base.metadata.create_all)

        institution_id = uuid.UUID("a1111111-a111-4111-8111-111111111111")
        programme_id = uuid.UUID("b1111111-b111-4111-8111-111111111101")
        uploader_id = uuid.UUID("00000000-0000-0000-0000-000000000001")
        master_key = base64.b64encode(b"t" * 32).decode("ascii")
        document_content = b"%PDF-1.7 private registrar receipt"
        document_hash = hashlib.sha256(document_content).hexdigest()

        monkeypatch.setattr(instrument_routes.settings, "GEMINI_API_KEY", "test-key")
        monkeypatch.setattr(
            instrument_routes.settings, "DOCUMENT_MASTER_KEY", master_key
        )
        monkeypatch.setattr(
            instrument_routes.settings, "DOCUMENT_STORAGE_DIR", str(tmp_path)
        )

        async with session_factory() as session:
            session.add_all(
                [
                    Institution(
                        id=institution_id,
                        aicte_permanent_id="1-1092847291",
                        name="Sample Registrar Institute",
                        trust_name="Sample Education Trust",
                        region_code="WRO",
                        state_code="MH",
                        district="Pune",
                        location_category="OTHER",
                        institution_type="CO_ED",
                        building_ownership="LEASED",
                        university_type="AFFILIATED",
                        application_category="OTHER",
                        established_year=2000,
                        approval_status="ACTIVE",
                    ),
                    Programme(
                        id=programme_id,
                        institution_id=institution_id,
                        programme="ENGINEERING",
                        level="UG",
                        approved_intake=60,
                        active=True,
                    ),
                    User(
                        id=uploader_id,
                        email="registrar@test.example",
                        password_hash="test-hash",
                        display_name="Test Registrar",
                        role="INSTITUTION_USER",
                        region_code="WRO",
                        institution_id=institution_id,
                        is_active=True,
                    ),
                ]
            )
            await session.commit()

        async def override_get_db():
            async with session_factory() as session:
                try:
                    yield session
                    await session.commit()
                except Exception:
                    await session.rollback()
                    raise

        async def fake_extract(document, settings):
            assert read_encrypted_document(
                document.storage_key,
                document.sha256,
                document.encryption_meta,
                settings.DOCUMENT_STORAGE_DIR,
                settings.DOCUMENT_MASTER_KEY,
            ) == document_content
            return [
                {
                    "field_name": "amount",
                    "document_value": "7000000.00",
                    "confidence": 0.96,
                    "page": 1,
                    "bbox": {"x": 0.1, "y": 0.2, "w": 0.3, "h": 0.04},
                }
            ]

        monkeypatch.setattr(instrument_routes, "extract_document_fields", fake_extract)
        app.dependency_overrides[get_db] = override_get_db
        try:
            transport = httpx.ASGITransport(app=app)
            async with httpx.AsyncClient(
                transport=transport, base_url="http://test"
            ) as client:
                create_response = await client.post(
                    "/api/v1/instruments/",
                    json={
                        "institution_id": str(institution_id),
                        "programme_id": str(programme_id),
                        "type": "FDR",
                        "instrument_number": "FDR-TEST-OCR-001",
                        "bank_name": "State Bank of India",
                        "branch": "Pune Camp",
                        "ifsc": "SBIN0001482",
                        "amount_paise": 700000000,
                        "issue_date": "2024-01-01T00:00:00",
                        "maturity_date": "2034-01-01T00:00:00",
                        "tenure_months": 120,
                        "interest_rate": None,
                        "depositor_name": "Sample Education Trust",
                        "lien_in_favour": "AICTE",
                    },
                )
                assert create_response.status_code == 200, create_response.text
                instrument_id = create_response.json()["id"]

                upload_response = await client.post(
                    f"/api/v1/instruments/{instrument_id}/documents",
                    params={"document_type": "FDR_CERTIFICATE"},
                    files={
                        "file": (
                            "receipt.pdf",
                            document_content,
                            "application/pdf",
                        )
                    },
                )
                assert upload_response.status_code == 200, upload_response.text
                uploaded = upload_response.json()
                assert uploaded["sha256"] == document_hash
                assert uploaded["ocr_status"] == "PENDING"
                assert (tmp_path / f"doc_{document_hash}.enc").read_bytes() != document_content

                extraction_response = await client.post(
                    f"/api/v1/instruments/{instrument_id}/extract",
                    params={"document_id": uploaded["id"]},
                )
                assert extraction_response.status_code == 200, extraction_response.text
                extraction = extraction_response.json()
                assert extraction["ocr_status"] == "OCR_DONE"
                assert extraction["fields"][0]["document_value"] == "7000000.00"

            async with session_factory() as session:
                provenance = await session.scalar(
                    select(ProvenanceField).where(
                        ProvenanceField.instrument_id == uuid.UUID(instrument_id),
                        ProvenanceField.field_name == "amount",
                    )
                )
                assert provenance.document_value == "7000000.00"
                assert provenance.status == "MATCH"
                stored_instrument = await session.get(
                    Instrument, uuid.UUID(instrument_id)
                )
                assert stored_instrument is not None
        finally:
            app.dependency_overrides.pop(get_db, None)
            await engine.dispose()

    asyncio.run(scenario())
