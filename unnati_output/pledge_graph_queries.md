# Unnati Sharma — Pledge Graph / Fraud Detection (§6.6)
# File: services/pledge_graph_queries.md
# SURAKSHA SIH26265 — Backend Deliverable

# Edges built on create/update/renew:
# PLEDGED_FOR (instrument -> institution/approval)
# RENEWED_FROM (successor -> predecessor)
# SAME_NUMBER (instrument -> instrument with same normalized number)
# SAME_HASH (document -> document with same SHA-256)
# SAME_ACCOUNT (instrument -> instrument with same refund account)
# SAME_SIGNATORY (instrument -> instrument with same depositor/signatory)

# Detection queries:
# 1. Duplicate instrument number across institutions.
# 2. Duplicate file hash across instruments.
# 3. One instrument pledged to >1 institution/approval.
# 4. Maturity arithmetic inconsistent with issue + tenure.
# 5. Bank/IFSC mismatch between declared and bank record.
# 6. Post-acceptance encashment.

# Output explainable: edge type, evidence, confidence, affected institutions/instruments.
# Duplicate finding attaches to later/incoming instrument; original holder not blocked solely by copy.
