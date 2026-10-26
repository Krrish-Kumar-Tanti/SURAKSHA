# Unnati Sharma — Release Graph Evaluation (§6.5)
# File: services/release_graph.py (spec implementation)
# SURAKSHA SIH26265

# Build required nodes by request type:
# Always official: DOCUMENTS, PGRC, VIGILANCE, GRANTS
# financial_embezzlement_flag: FINANCIAL_EMBEZZLEMENT
# converted university: COMPLAINTS_DISCIPLINARY
# PROGRESSIVE_CLOSURE (if not matured): PROGRESSIVE_CLOSURE
# MERGER: MERGER
# RTGS: RTGS_SANCTION
# System: PROVENANCE, TERM_SERVED, DUES_PENALTIES, BANK_LIEN

# PROVENANCE is CLEAR only when no CRITICAL finding with OPEN or ACCEPTED remains.
# WAIVED and RESOLVED count as satisfied. Critical waiver role-gated (DIRECTOR_RB/CA/ADMIN).
# DOCUMENTS clear: application + Affidavit 6 + FDR/RPGF proof + latest LoA/EoA.

# Evaluation order:
# if any required BLOCKED -> BLOCKED
# else if any required NEEDS_INFO -> NEEDS_INFO
# else if any required SOURCE_UNAVAILABLE -> PENDING_SOURCE
# else if any required PENDING -> BLOCKED
# else -> ELIGIBLE

# A required node is PENDING unless NOT_APPLICABLE (treated as satisfied).

# Maker/checker/approver segregation enforced server-side:
# Maker: DEALING_OFFICER / DIRECTOR_RB; Checker: DIRECTOR_RB; Approver: COMPETENT_AUTHORITY.
# Segregation: maker != checker; checker != approver.
# If eligibility != ELIGIBLE, APPROVE returns 422 RELEASE_BLOCKED.
# FDR/RPGF/BG: NOC (AICTE/RB/NOC/{year}/{seq})
# RTGS: SANCTION (AICTE/RB/SANCTION/{year}/{seq})
