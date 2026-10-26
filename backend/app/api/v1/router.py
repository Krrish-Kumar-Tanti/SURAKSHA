from fastapi import APIRouter
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.institutions import router as institutions_router
from app.api.v1.routes.policy import router as policy_router
from app.api.v1.routes.instruments import router as instruments_router
from app.api.v1.routes.releases import router as releases_router
from app.api.v1.routes.admin import router as admin_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(institutions_router)
api_router.include_router(policy_router)
api_router.include_router(instruments_router)
api_router.include_router(releases_router)
api_router.include_router(admin_router)

# Root health endpoint
@api_router.get("/health", include_in_schema=False)
def health():
    return {"status": "ok"}

# Meta/enums endpoint
@api_router.get("/meta/enums", include_in_schema=False)
def meta_enums():
    from app.schemas.common import EnumsResponse
    return EnumsResponse(
        roles=["INSTITUTION_USER", "DEALING_OFFICER", "DIRECTOR_RB",
               "COMPETENT_AUTHORITY", "ACCOUNTS", "AUDITOR", "ADMIN"],
        institution_type=["CO_ED", "WOMEN_ONLY", "PWD_ONLY"],
        location_category=["NE", "JK", "LADAKH", "ASPIRATIONAL", "AN", "LAKSHADWEEP", "OTHER"],
        building_ownership=["OWNED", "LEASED"],
        university_type=["AFFILIATED", "PRIVATE_UNIVERSITY", "DEEMED", "GOVERNMENT"],
        application_category=["NEW", "EXISTING_1_3_3", "NEW_LEVEL_PROGRAMME", "UNIVERSITY_NEW_PROGRAMME", "OTHER"],
        programme=["ENGINEERING", "PLANNING", "APPLIED_ARTS", "DESIGN", "HMCT", "COMPUTER_APPLICATIONS", "MANAGEMENT"],
        level=["DIPLOMA", "UG", "PG"],
        instrument_type=["FDR", "RTGS", "RPGF", "BG"],
        instrument_status=[
            "DRAFT", "SUBMITTED", "UNDER_SCRUTINY", "QUERY_RAISED", "VERIFIED", "ACTIVE",
            "EXPIRING", "MATUREd", "RENEWAL_DUE", "RENEWED", "REPLACED", "RELEASE_REQUESTED",
            "CLEARANCES_PENDING", "APPROVED", "RELEASED", "DISCHARGED", "CLOSED",
            "REJECTED", "WITHDRAWN", "FORFEITED"
        ],
        verification_status=["UNVERIFIED", "DOCUMENT_CHECKED", "OFFICER_VERIFIED", "BANK_CONFIRMED", "DISCREPANT", "SOURCE_UNAVAILABLE"],
        bank_verification_status=["FOUND", "NOT_FOUND", "ENCASHED", "CLOSED", "UNSUPPORTED", "SOURCE_UNAVAILABLE"],
        finding_severity=["CRITICAL", "SERIOUS", "WARNING"],
        finding_disposition=["OPEN", "ACCEPTED", "WAIVED", "RESOLVED"],
        obligation_type=["RENEWAL", "RELEASE_CLEARANCE", "UNDERTAKING", "BANK_RECHECK"],
        obligation_status=["OPEN", "DONE", "OVERDUE", "CANCELLED"],
        release_request_type=["MATURITY", "EARLY", "CLOSURE", "PROGRESSIVE_CLOSURE", "MERGER"],
        release_status=[
            "DRAFT", "SUBMITTED", "ELIGIBILITY_CHECK", "BLOCKED", "NEEDS_INFO",
            "PENDING_SOURCE", "ELIGIBLE", "MAKER_RECOMMENDED", "CHECKER_APPROVED",
            "CA_APPROVED", "NOC_ISSUED", "SANCTION_ISSUED", "RELEASED", "REJECTED", "WITHDRAWN"
        ],
        eligibility_result=["ELIGIBLE", "BLOCKED", "NEEDS_INFO", "PENDING_SOURCE"],
        clearance_type=["DOCUMENTS", "PROVENANCE", "PGRC", "VIGILANCE", "GRANTS", "FINANCIAL_EMBEZZLEMENT",
                         "COMPLAINTS_DISCIPLINARY", "PROGRESSIVE_CLOSURE", "MERGER", "TERM_SERVED",
                         "DUES_PENALTIES", "BANK_LIEN", "RTGS_SANCTION"],
        clearance_status=["PENDING", "CLEAR", "BLOCKED", "NEEDS_INFO", "SOURCE_UNAVAILABLE", "NOT_APPLICABLE"],
        release_decision=["RECOMMEND", "CHECK", "APPROVE", "RETURN", "REJECT"],
        pledge_edge_type=["PLEDGED_FOR", "RENEWED_FROM", "SAME_NUMBER", "SAME_HASH", "SAME_ACCOUNT", "SAME_SIGNATORY"],
        alert_type=["RENEWAL_DUE", "MATURITY_DUE", "OVERDUE", "BANK_RECHECK", "RELEASE_BLOCKED", "ESCALATION"],
        audit_entity_type=["INSTITUTION", "PROGRAMME", "INSTRUMENT", "DOCUMENT", "FINDING",
                          "REQUIREMENT", "RELEASE_REQUEST", "USER", "SETTING"],
    )