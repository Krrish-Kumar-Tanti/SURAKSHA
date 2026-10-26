# Unnati Sharma — NOC / Sanction Document Generator (§6.9)
# File: services/noc_document.md
# SURAKSHA SIH26265 — Backend Deliverable

# On final approval:
# - FDR / RPGF / BG: NOC number format AICTE/RB/NOC/{year}/{seq}
# - RTGS: sanction order AICTE/RB/SANCTION/{year}/{seq}
# - PDF includes: institution, instrument, amount in words/figures (principal only), interest retained note, clearance references, decision actors, audit hash, optional verification token, "synthetic demo" label.
# - Document hashed into audit event. No real AICTE seal; demo watermark only.
