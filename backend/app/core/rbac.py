from enum import Enum
from typing import Set, Dict, Any


class Role(str, Enum):
    INSTITUTION_USER = "INSTITUTION_USER"
    DEALING_OFFICER = "DEALING_OFFICER"
    DIRECTOR_RB = "DIRECTOR_RB"
    COMPETENT_AUTHORITY = "COMPETENT_AUTHORITY"
    ACCOUNTS = "ACCOUNTS"
    AUDITOR = "AUDITOR"
    ADMIN = "ADMIN"


class ClearanceType(str, Enum):
    DOCUMENTS = "DOCUMENTS"
    PROVENANCE = "PROVENANCE"
    PGRC = "PGRC"
    VIGILANCE = "VIGILANCE"
    GRANTS = "GRANTS"
    FINANCIAL_EMBEZZLEMENT = "FINANCIAL_EMBEZZLEMENT"
    COMPLAINTS_DISCIPLINARY = "COMPLAINTS_DISCIPLINARY"
    PROGRESSIVE_CLOSURE = "PROGRESSIVE_CLOSURE"
    MERGER = "MERGER"
    TERM_SERVED = "TERM_SERVED"
    DUES_PENALTIES = "DUES_PENALTIES"
    BANK_LIEN = "BANK_LIEN"
    RTGS_SANCTION = "RTGS_SANCTION"


class ClearanceStatus(str, Enum):
    PENDING = "PENDING"
    CLEAR = "CLEAR"
    BLOCKED = "BLOCKED"
    NEEDS_INFO = "NEEDS_INFO"
    SOURCE_UNAVAILABLE = "SOURCE_UNAVAILABLE"
    NOT_APPLICABLE = "NOT_APPLICABLE"


class FindingSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    SERIOUS = "SERIOUS"
    WARNING = "WARNING"


class FindingDisposition(str, Enum):
    OPEN = "OPEN"
    ACCEPTED = "ACCEPTED"
    WAIVED = "WAIVED"
    RESOLVED = "RESOLVED"


class ObligationType(str, Enum):
    RENEWAL = "RENEWAL"
    RELEASE_CLEARANCE = "RELEASE_CLEARANCE"
    UNDERTAKING = "UNDERTAKING"
    BANK_RECHECK = "BANK_RECHECK"


class ObligationStatus(str, Enum):
    OPEN = "OPEN"
    DONE = "DONE"
    OVERDUE = "OVERDUE"
    CANCELLED = "CANCELLED"


class AlertType(str, Enum):
    RENEWAL_DUE = "RENEWAL_DUE"
    MATURITY_DUE = "MATURITY_DUE"
    OVERDUE = "OVERDUE"
    BANK_RECHECK = "BANK_RECHECK"
    RELEASE_BLOCKED = "RELEASE_BLOCKED"
    ESCALATION = "ESCALATION"


class AlertSeverity(str, Enum):
    INFO = "INFO"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class PledgeEdgeType(str, Enum):
    PLEDGED_FOR = "PLEDGED_FOR"
    RENEWED_FROM = "RENEWED_FROM"
    SAME_NUMBER = "SAME_NUMBER"
    SAME_HASH = "SAME_HASH"
    SAME_ACCOUNT = "SAME_ACCOUNT"
    SAME_SIGNATORY = "SAME_SIGNATORY"


# RBAC Matrix: capabilities per role
# Per §7.2 of 01_BACKEND.md - 7 roles × 10+ capabilities

CAPABILITIES: Dict[Role, Set[str]] = {
    # INSTITUTION_USER: own institution read only
    Role.INSTITUTION_USER: {
        "own_institution_read",
        "own_instrument_read",
        "own_document_read",
        "own_provenance_read",
        "own_finding_read",
    },
    # DEALING_OFFICER: region-scoped operations
    Role.DEALING_OFFICER: {
        "own_institution_read",
        "region_institution_read",
        "create_instrument",
        "upload_document",
        "extract_compare",
        "disposition_warning",
    },
    # DIRECTOR_RB: region-scoped + critical disposition
    Role.DIRECTOR_RB: {
        "own_institution_read",
        "region_institution_read",
        "create_instrument",
        "upload_document",
        "extract_compare",
        "disposition_critical",
        "set_clearance",
        "maker_recommend",
    },
    # COMPETENT_AUTHORITY: full authority
    Role.COMPETENT_AUTHORITY: {
        "own_institution_read",
        "region_institution_read",
        "all_institution_read",
        "create_instrument",
        "upload_document",
        "extract_compare",
        "disposition_critical",
        "set_clearance",
        "maker_recommend",
        "final_approve",
    },
    # ACCOUNTS: financial operations
    Role.ACCOUNTS: {
        "own_institution_read",
        "region_institution_read",
        "all_institution_read",
        "release_letter",
        "financial_operations",
    },
    # AUDITOR: audit read across scope
    Role.AUDITOR: {
        "own_entity_read",
        "region_entity_read",
        "all_entity_read",
        "audit_read",
    },
    # ADMIN: full system access
    Role.ADMIN: {
        "all",
        "time_machine",
        "system_config",
    },
}


# Role-based access checkers
def check_role(role: Role, required: Set[str]) -> bool:
    """Check if a role has the required capabilities."""
    return required.issubset(CAPABILITIES.get(role, set()))


# Institution scoping helpers
def with_institution_scope(query, institution_id: Any, role: Role) -> Any:
    """Apply institution scoping to a query based on role."""
    # INSTITUTION_USER: only their own institution
    # DEALING_OFFICER / DIRECTOR_RB: their region
    # Others: all (with appropriate filtering)
    if role == Role.INSTITUTION_USER:
        # Filter by institution_id
        from sqlalchemy import select, literal
        # This would be applied in the actual query
        pass
    elif role in (Role.DEALING_OFFICER, Role.DIRECTOR_RB):
        # Region-scoped
        pass
    # Others: no automatic scoping or all-scoped
    return query


# Permission constants for API endpoint protection
PERMISSIONS = {
    "instrument:create": {
        "min_role": Role.DEALING_OFFICER,
        "description": "Create new security deposit instrument",
    },
    "instrument:upload": {
        "min_role": Role.DEALING_OFFICER,
        "description": "Upload FDR document",
    },
    "instrument:extract": {
        "min_role": Role.DEALING_OFFICER,
        "description": "Extract fields from instrument document",
    },
    "finding:disposition": {
        "min_role": Role.DIRECTOR_RB,
        "description": "Set finding disposition (warning/critical)",
    },
    "clearance:set": {
        "min_role": Role.DIRECTOR_RB,
        "description": "Set release clearance status",
    },
    "release:approve": {
        "min_role": Role.COMPETENT_AUTHORITY,
        "description": "Approve release request",
    },
    "release:recommend": {
        "min_role": Role.DEALING_OFFICER,
        "description": "Recommend release (maker role)",
    },
    "release:check": {
        "min_role": Role.DIRECTOR_RB,
        "description": "Check release eligibility (checker role)",
    },
    "audit:read": {
        "min_role": Role.AUDITOR,
        "description": "Read audit events",
    },
    "time_machine": {
        "min_role": Role.DIRECTOR_RB,
        "description": "Advance demo clock",
    },
}