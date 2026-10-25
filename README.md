# SURAKSHA — AICTE Security Deposit Control Tower (SIH26265)

> **SIH 2026 Problem Statement:** SIH26265 — Streamlining of Security Deposit / Fixed Deposit Receipt (FDR) Portal for AICTE Approved Institutions.

---

## 🏛️ Project Overview

**SURAKSHA** is a policy-native regulatory compliance and financial control tower designed for AICTE to monitor, verify, and manage institutional security deposits (Fixed Deposit Receipts - FDRs).

Unlike conventional portals that treat FDR verification as generic document uploads, SURAKSHA encodes the exact provisions of the **AICTE Approval Process Handbook (APH 2024–27 & 2026–27 Corrigendum)**:
1. **Three-Way Provenance:** Reconciles Institution Self-Declaration vs. OCR Document Evidence vs. Core Banking (CBS) / SFMS APIs.
2. **Deterministic APH Policy Engine:** Encodes Table 1.4 security deposit rates, 50% concession for North-East, J&K, Ladakh, Aspirational Districts, Women/PwD institutions, and the 2.0× leased land/building multiplier.
3. **Continuously Pledged Lifecycle:** Tracks joint lien endorsements ("In favour of Regional Officer, AICTE"), maturity alarms (T-90, T-60, T-30 days), and cross-institution duplicate pledge detection.
4. **Clause 6.46 Release Eligibility Graph:** Multi-NOC clearance DAG ensuring all statutory clearances (DTE, University, Anti-ragging, Zero salary arrears, RPGF) are met before 10-year maturity releases.
5. **Pan-India 5-Language Access:** 5-language localization (English, Hindi, Bengali, Tamil, Telugu) mapped directly to AICTE Regional Offices.
6. **Cryptographic Audit Vault:** Tamper-evident, hash-chained ledger logging every state change, document upload, and authorization.

---

## 📂 Core Documentation

- **[26265.md](./26265.md)** — Complete Product & Build Brief: 10 core modules, 10 screen specifications, 7-minute pitch script, and data model.
- **[enhancement.md](./enhancement.md)** — Master Amplification Plan fusing battle-tested architectures from past projects (PackParakh, Ekam, SchemeSaathi, and EduSphere) to elevate SURAKSHA to 500%–1000%.
- **[context.md](./context.md)** — Official domain truth, APH references, decision matrix, competitor analysis, and risk mitigations.
- **[opponent.md](./opponent.md)** — Deep competitive intelligence on existing public repositories and incumbent gaps.

---

## 🚀 Key Modules (M1–M10)

| Module | Functionality |
|---|---|
| **M1: Institution 360** | Centralized ledger of all institutions, instruments, and joint mandates |
| **M2: Intake & Three-Way Provenance** | OCR bounding-box extraction matched against Bank API and declared values |
| **M3: Policy Pack 2026-27** | Deterministic Table 1.4 calculator + 50% regional/demographic concessions |
| **M4: Bank Verification Adapter** | Simulated Core Banking / SFMS API with real-time lien verification |
| **M5: Lifecycle & Time Machine** | Proactive maturity alerts (T-90/60/30) and time-travel simulation engine |
| **M6: Release Eligibility Graph** | Clause 6.46 multi-department NOC clearance verification DAG |
| **M7: Pledge Graph** | Graph-based duplicate pledge detection across institutions and regulators |
| **M8: Cash-Flow Forecast** | AICTE HQ central treasury view of maturing corpus and risk exposure |
| **M9: Evidence Vault & Audit Chain** | SHA-256 chained audit trail and court-admissible discrepancy memos |
| **M10: Regional Cockpits** | Role-based dashboards for College Chairman, Regional Officer, and Bank Nodal Officer |

---

## 👥 Contributors & Team

- **Lead Architect / Owner:** Krrish Kumar Tanti
