# SIH 2026 AICTE — Context, Decision & Winning Plan

**Document control**

| Field | Value |
|---|---|
| Version | 1.3 (research synthesis + factual audit + PS lock; demo pointer aligned) |
| Prepared | 25 Oct 2026 |
| Updated | 26 Oct 2026 — demo sequence points to build pack |
| Owner | OpenCode (lead researcher / architect) for the Boss |
| Status | PS selected: SIH26265; idea stage; submission deadline 28 Oct 2026 |
| Scope | SIH26261–SIH26265 (AICTE, Software, Smart Automation) |
| Companion files | `26265.md` (build brief), `opponent.md` (competitive intelligence), `agent_talking.md` (agent handoff protocol), `enhancement.md` (anti-gravity reuse plan) |
| Rule | If a claim is not in this file or in the source ledger, it is not approved for the idea PPT or jury answers. |

**Truth labels used in this file**

- `[FACT]` — directly supported by a primary/official source or by direct inspection; source given.
- `[INFERENCE]` — a reasoned conclusion from facts; not a primary-source claim.
- `[UNVERIFIED]` — found in a secondary source or plausible but not confirmed; do not state as fact.
- `[OPINION]` — a strategic judgement; can be debated.

---

## 1. Executive summary

### 1.1 What we are deciding

The Boss has five new AICTE problem statements for SIH 2026 (SIH26261–SIH26265). The national idea-submission deadline is **28 October 2026**. The team must pick one PS, produce the idea PPT, and (if shortlisted) build a working prototype.

### 1.2 The short answer

**Recommended PS: SIH26265 — Streamline of security deposit / FDR portal.** `[OPINION, based on the evidence below]`

Why:

1. **Lowest strong-competitor density of the five.** The PS has fewer dedicated repos and fewer teams than 26261, 26263, and 26264. The strongest incumbent is one team (`Shash1704/aicte-fdr-portal`), not four.
2. **Bounded, demoable scope.** A security-deposit/FDR lifecycle can be shown end-to-end in 7 minutes: submit → verify → hold → mature → renew → release. No computer-vision research breakthrough or cryptography research is required.
3. **A real policy moat that most teams will miss.** The 2026-27 Addendum/Corrigendum changes the security-deposit rules: 50% for institutions in NE/J&K/Ladakh/Aspirational Districts/Andaman & Nicobar/Lakshadweep, women-only institutions and PwD-only institutions; double for leased building/land; RPGF included in release. Almost every competitor uses “illustrative norms” or leaves the rules as drafts. We can encode the actual, versioned rules with clause citations.
4. **High financial stakes.** The base APH Table 1.4 amount for an Engineering UG institution is ₹35 lakh (₹70 lakh if leased), held for 10 years, with interest retained by AICTE. This is a “₹ at risk” story, not a generic dashboard story.
5. **The incumbent’s gap is our opening.** `Shash1704/aicte-fdr-portal` is excellent on provenance, bank sandbox, release workflow and reminders, but its own README says requirement amounts/periods are “illustrative and editable,” and its code models requirements as editable rows. It does not encode the 2026-27 50% concession or the full 6.46 clearance graph. We can match its strengths and beat it on policy accuracy, release eligibility, and cash-flow forecasting.

**Fallback PS: SIH26262 — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System.** `[OPINION]`

Why: the “APH-native workflow compiler” angle is differentiated, the build is feasible, and the competitor set is strong but not as deep as 26261/26263. Choose 26262 only if the Boss prefers a workflow product or if 26265 becomes too crowded before submission.

**Do not choose (for this team, this cycle): SIH26261 and SIH26263.** `[OPINION]`
They are the most crowded and have national-quality full-product competitors. 26261 requires credible document forensics/OCR/issuer verification; 26263 requires privacy/cryptography and APAAR integration judgement. The risk of being out-executed in 36 hours is highest there. 26264 is possible but has a very strong incumbent (`Shash1704/aicte-icms`) and a narrower differentiation surface.

### 1.3 Winning thesis for SIH26265

> **Most teams are building a portal that stores FDRs. We will build a policy-native control tower that proves every rupee is real, correctly sized, continuously pledged, and safe to release.**

Working name: **SURAKSHA — AICTE Security Deposit Control Tower**. The name is a placeholder; the Boss can rename.

Five pillars:

1. **Policy Pack 2026-27** — versioned APH 2024-27 + Addendum/Corrigendum 2026-27, exact Table 1.4, 50% concession, leased multiplier, 10-year hold, interest retention, penalty rules, release checklist.
2. **Three-way provenance** — declared vs. document vs. bank, field by field, with evidence.
3. **Release Eligibility Graph** — not a flat checklist: PGRC, Vigilance, Grants, dues, complaints, disciplinary proceedings, affiliation/students, bank lien, RTGS vs FDR vs RPGF.
4. **Pledge Graph + Maturity Cash-Flow Forecast** — detect one FDR pledged twice; forecast ₹ maturing by quarter and at-risk instruments.
5. **Evidence Vault + Time Machine** — hash-chained audit, encrypted documents, maker-checker-approver, and a demo clock that advances through maturity/renewal/escalation.

### 1.4 What “winning” means

- **Idea stage (by 28 Oct 2026):** a 6-slide PPT that shows real problem evidence, a differentiated solution, a credible architecture, a working demo plan, measurable impact, and honest integration boundaries.
- **Prototype stage (if shortlisted):** a deployed, testable prototype with synthetic data, a 7-minute scripted demo, a jury Q&A bank, and a clear “what is simulated vs. what is production-ready” disclosure.
- **Judge’s mental model:** “This team understands AICTE’s actual rules, not just the problem statement. They built the control layer, not another CRUD dashboard.”

---

## 2. The five problem statements at a glance

| PS | Title | Theme | National ideas (25 Oct image) | Zaid mirror (23 Oct) | DScE team slots left (25 Oct) | Our read |
|---|---|---|---:|---:|---:|---|
| SIH26261 | AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification | Smart Automation | 17 / 500 | 25 | 3 / 8 | Most crowded + strongest full-product competitors; avoid |
| SIH26262 | Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System | Smart Automation | 15 / 500 | 23 | 7 / 8 | Moderate density; strong workflow competitors; viable fallback |
| SIH26263 | Development of an APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions | Smart Automation | 17 / 500 | 21 | 5 / 8 | Very strong full-product competitors; avoid |
| SIH26264 | Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells | Smart Automation | 25 / 500 | 31 | 4 / 8 | Strong incumbent; narrower differentiation; third choice |
| SIH26265 | Streamline of security deposit / FDR portal | Smart Automation | 13 / 500 | 15 | 6 / 8 | Lowest density + policy moat; **recommended** |

**Caveats on the numbers**

- `[FACT]` The “national ideas” column is from the Boss’s 25 Oct 2026 screenshot of the official SIH portal.
- `[FACT]` The “Zaid mirror” column is from `zaidsayyed.in`, which says it counts the official portal twice a day; its snapshot is dated 23 Oct 2026.
- `[FACT]` The DScE portal (`sih.dsce.in/sih/problem-statements`) shows “Available: n/8” per PS. This is a college-level team-slot counter, **not** a national idea count.
- `[INFERENCE]` The counts differ because they were taken at different times and possibly count different things (“ideas submitted” vs. “teams registered”). Do not present either as the exact current count. In the PPT, say “double-digit ideas and rising; the field is forming” unless the Boss has a fresher official screenshot.
- `[FACT]` All five PS were added mid-season (first appeared 20 Oct 2026 per Zaid mirror), after the original list went out. Many teams have not seen them yet. `[INFERENCE]` This is why counts are still low relative to older PS.

---

## 3. Official PS briefs (structured)

> Source for all five: `https://zaidsayyed.in/tools/sih-problem-statements/sih26261` … `/sih26265`, fetched 25 Oct 2026. The mirror reproduces the official SIH text. Where we quote, the quote is exact from that page. The official `sih.gov.in` was down at retrieval time.

### 3.1 SIH26261 — AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification

**Users:** AICTE scrutiny officers, Regulation Bureau, Regional Offices, EVC members.

**As-is pain (official):** AICTE processes EoA and approval-related applications. Manual checking is time-consuming; documents may be missing, expired, inconsistent, altered, or hard to confirm with issuing authorities.

**What the system must do:**

1. Identify the application category and applicable checklist.
2. Retrieve relevant institutional records from authorized AICTE systems (affidavits, accreditation, NOCs, previous EoA, approved programmes/intake, faculty, compliance/deficiency, TER payment, application history).
3. OCR/document classification/extraction; find missing fields, incomplete submissions, expired documents, inconsistencies within and across records.
4. Detect potential alterations, duplication, anomalies, metadata inconsistencies, mismatched identifiers, irregular dates; each flag must show evidence and reason; findings are preliminary, not proof.
5. Verify with issuing authorities via authorized APIs/portals/digitally signed records/QR/reference numbers; compare submitted vs. source; record source, timestamp, result; statuses: verified, mismatch, expired, pending, source unavailable, manual review.
6. Compare application/infrastructure evidence against configurable APH checklists; CV may flag visible discrepancies or need for inspection; advisory only.
7. Dashboard, alerts, audit trail of rules applied, records checked, source responses, alerts, observations, actions.
8. Role-based access, secure document handling, confidentiality, human review before adverse action.

**Deliverables:** functional prototype integrated/design-for-integration with AICTE portal; category-based configurable checklists; OCR classification/extraction/completeness; cross-document consistency with evidence; issuer-verification workflow; compliance-assistance module; dashboard; RBAC/security/human review.

**Evaluation:** extraction accuracy, validation accuracy, anomaly-detection performance, source-verification rate, discrepancy reliability, average verification time, alert timeliness, reduction in manual effort.

**Safeguards:** configurable to APH; authorized/role-based access; no bypassing access controls; data protection; explainable evidence; AI is decision support only.

**Competitive implication:** crowded; top teams already have OCR + ELA + trust scores + dashboards. The differentiator would be real issuer verification and APH rule versioning, but the build risk is high. `[INFERENCE]`

### 3.2 SIH26262 — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System

**Users:** AICTE Regional officers, Bureau officers, committees (Scrutiny/Re-Scrutiny, EVC, SAC/SHC), competent authorities, institutions.

**As-is pain (official):** Applications move through Scrutiny/Re-Scrutiny, EVC, SAC/SHC and other APH stages. Monitoring movement, stage-wise pendency, EVC scheduling, undertakings, compliance submissions and document validity across Regions/officials involves coordination and follow-up.

**What the system must do:**

1. **End-to-end workflow automation:** route applications through applicable stages (Only Scrutiny, Scrutiny + EVC, EVC + SAC/SHC, Only EVC, other combinations); auto-move to next stage after completion subject to rules/authorized actions; return/revert with reasons; automate routine communications/case summaries where permissible.
2. **Dashboard/pendency:** status across Regions, stages, institutions, officers/committees; ageing, timelines, workload, bottlenecks; alerts near/exceeding timelines; role-based dashboards; audit trail.
3. **EVC scheduling/alerts:** identify applications needing EVC; queue after preliminary processing; track scheduling/completion; reminders; escalate delays.
4. **Time-bound undertakings/compliance:** digital record of conditions, evidence, due dates; notify institutions; online submission; verification; reminders; escalate unfulfilled.
5. **Lease/document validity:** track expiry; advance alerts; renewal submission/verification; overdue alerts/escalation.
6. **Notifications/escalation/reports:** configurable notifications; automatic escalation per rules; consolidated reports; audit trail of alerts/submissions/verification/escalation/closure.
7. **Key requirements:** single platform; configurable APH-aligned rules/timelines; secure documents/RBAC/confidentiality/traceability; integration with authorized AICTE systems; human oversight for regulatory decisions.
8. **Regulatory safeguard:** automated alerts/recommendations/workflow actions support but do not replace statutory scrutiny, verification, inspections, or competent-authority decisions.

**Evaluation:** workflow accuracy, alert timeliness, deadline tracking reliability, visibility of pending cases, reduction in manual follow-up, completeness of audit trail.

**Competitive implication:** two strong competitors (`MahatvaGoell`, `saran612`) already model versioned policy/obligations/audit. The differentiator would be an APH-native stage matrix and a “digital twin” of the approval year. Viable, but 26265 has a clearer moat. `[INFERENCE]`

### 3.3 SIH26263 — APAAR ID-Based Student Data Management and Verification Platform for AICTE-Approved Institutions

**Users:** AICTE, approved institutions, students, employers/verifiers, other regulators.

**As-is pain (official):** PGDM institutions provide detailed student data annually; other AICTE-approved institutions mainly provide totals during approval. AICTE lacks complete, authentic, verifiable student records. APAAR ID is the national academic identity.

**What the system must do:**

1. Secure platform/API for institutions to upload/update student-level data using APAAR ID as the unique identifier.
2. Fields: approved intake, actual enrolment, supernumerary seats, NRI category, OCI status, foreign national status, other relevant information.
3. Automated validation: duplicate records, invalid/missing APAAR IDs, admissions exceeding approved intake, inconsistencies, potential duplicate enrolment across institutions.
4. Real-time dashboards for AICTE and institutions.
5. Secure verification mechanism for AICTE, institutions, employers, regulators.
6. Verifiable student records linked to academic identity.
7. Integration/API with institutional and AICTE systems.
8. Data security/privacy/authentication/RBAC/audit/consent.
9. Reports for policy, accreditation, monitoring, regulation.
10. Support printing/display of APAAR ID with student ID on certificates.

**Expected flow:** Institution → Student Data Upload → APAAR Validation → Data Verification → AICTE Central Repository → Analytics & Monitoring → Authorized Verification.

**Innovation expected:** beyond simple collection — automated validation, intelligent anomaly detection, real-time monitoring, secure verification, analytics, national-level student data ecosystem.

**Competitive implication:** the most dangerous PS. `Garv1105` (VidyaPramaan) and `Soumya-Vinod` (APAAR Integrity Platform) are national-quality full products with tests, live demos, privacy engineering and evaluation. Beating them in 36 hours is unlikely. Avoid. `[OPINION]`

### 3.4 SIH26264 — Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells

**Users:** AICTE Regulation Bureau (RB), Public Grievance Redressal Cell (PGRC), other Bureaus/Cells, Regional Offices, authorized officers/senior management, competent authority.

**As-is pain (official):** Complaints/grievances come from students, faculty, stakeholders. Different Bureaus/Cells handle cases relating to the same institution. No centralized real-time mechanism → overlapping actions, duplication, delays, unclear ownership.

**What the system must do:**

1. **Centralized institution profile:** unique AICTE Permanent ID, name, address, region, consolidated complaint/case history.
2. **Case tracking:** unique case ID, receipt date, nature/category, status, current Bureau/Cell, assigned officer, last action, next action, last action date, expected disposal date.
3. **Cross-Bureau overlap detection:** automatically identify same-institution cases handled by RB, PGRC or others; alert; link/map related cases.
4. **Real-time dashboard:** total, pending, under process, disposed, transferred, beyond timeline, institution-wise, Bureau-wise workload.
5. **Workflow/action history:** chronological actions, responsible officer/Bureau, timestamp, remarks/documents, transfer/escalation history.
6. **Search/filters:** institution name, AICTE Permanent ID, case ID, Bureau/Cell, region, category, status, date range.
7. **Alerts/notifications:** duplicate/overlap, pending reminders, escalation, SLA.
8. **Reports/analytics:** Bureau, region, institution history, ageing, disposal rate, overlaps/duplicates, monthly/quarterly performance.
9. **Innovation:** data matching, rule-based logic and/or AI-assisted analytics to identify same-institution complaints even when descriptions/references differ; display “Potential Overlapping Cases – Coordination Required.”

**Expected outcomes:** single source of truth, less duplication, no conflicting/parallel actions, better coordination, timely disposal, accountability/transparency, real-time management, data-driven decisions.

**Competitive implication:** `Shash1704/aicte-icms` is very strong (fuzzy entity resolution, overlap engine, coordination workflow, SLA, live demo). A second team (`Adit-K06`) has a full-stack ML implementation but a broken live link. Differentiation is possible (complaint-to-regulatory-action graph, privacy, CPGRAMS), but the incumbent is hard to displace. `[INFERENCE]`

### 3.5 SIH26265 — Streamline of Security Deposit / FDR Portal

**Users:** AICTE Regulation Bureau, authorized stakeholders, institutions/Trusts/Societies/Companies, banks, Accounts, Competent Authority, auditors.

**As-is pain (official):** Security deposits/FDRs are part of approval/compliance. Management involves institution-wise records, verifying instruments, monitoring validity/maturity, tracking renewal/replacement, recording release/refund requests, keeping documents available for regulatory verification. Fragmented records, manual correspondence and multiple tracking mechanisms make it hard to maintain an accurate, up-to-date view of deposit status, pending actions and time-sensitive requirements.

**What the system must do:**

1. **Centralized repository:** institution-wise and instrument-wise records, reference numbers, issuing bank details, amount, issue date, maturity date, validity status, supporting documents, current administrative status.
2. **Digital document management:** secure upload/storage/retrieval/review of FDRs, deposit confirmations, prescribed records.
3. **Verification/discrepancy detection:** review submitted information; verify instrument details through legitimate bank-issued verification mechanisms where supported; identify incomplete records; flag discrepancies; distinguish institution-submitted vs. independently bank-confirmed information.
4. **Automated validity/maturity tracking:** maturity dates, validity periods, renewal/replacement requirements, prescribed timelines; configurable reminders before deadlines; overdue/unresolved flags.
5. **Renewal/replacement monitoring:** track submission of renewed/replacement instruments; complete history of changes.
6. **Release/refund workflow:** submission, processing and status tracking subject to applicable regulations, prescribed conditions and competent-authority authorization.
7. **Alerts/escalation:** pending verification, approaching deadlines, overdue actions, unresolved cases.
8. **Dashboard/reports:** active, expiring, matured, renewed, released, pending; search; document histories; permitted field updates; scrutiny observations; status monitoring; automated reports for pending verifications, upcoming maturities, missing documents, intervention cases.
9. **Audit trail/access control:** traceable submissions, verification results, changes, approvals, actions; RBAC; secure document storage; encryption; controlled access to financial/institutional information.
10. **Integration/data security:** where technically feasible and formally authorized, integrate with existing AICTE systems and bank verification services to reduce duplicate data entry and improve reliability.

**Expected solution:** user-friendly, secure, integrated portal that streamlines the complete administrative lifecycle. Prototype should demonstrate measurable improvements in record accuracy, verification turnaround, timely renewal monitoring, reduction in manual tracking, and visibility into pending cases. Testing should cover new FDR submission, validity tracking, approaching maturity, renewal, discrepancy identification, authorized release. Ultimate objective: efficient, transparent, accountable digital mechanism; minimize avoidable delays; enable the Regulation Bureau to monitor financial instruments systematically while ensuring compliance with regulations and financial procedures.

**Competitive implication:** the strongest incumbent is excellent on the generic portal capabilities but weak on exact 2026-27 policy rules. This is the best opening. `[OPINION]`

---

## 4. Domain facts you must know (and cite)

> This section is the team’s “unfair advantage.” Most competitors will read only the PS text. We read the APH and the 2026-27 addendum.

### 4.0 What APH and the 2026-27 Addendum are

`[FACT]` **APH** = `Approval Process Handbook 2024-25 to 2026-27`, AICTE’s official rulebook for approval, compliance and security deposits. Its cover states: “This Handbook is a Legal Document as per All India Council for Technical Education Act, 1987 (52 of 1987).” It is not a portal, a dashboard, or a research paper.

`[FACT]` For SIH26265, APH answers five questions: who must create a deposit (Clauses 1.12 and 4.10), how much (Table 1.4), how long and who keeps the interest (Clause 1.12(iv)–(v)), what happens on late deposit, early encashment or closure (Clauses 2.25(f), 7.7, 2.21), and how release works (Clause 6.46).

`[FACT]` The **Addendum/Corrigendum 2026-27** is a separate 21-page amendment. It does not replace APH; it changes specific clauses. For SIH26265: the 50% concession (Item 10), the leased-building/land multiplier (Item 11), the late-deposit cross-reference (Item 28), and RPGF in release (Items 36–37). We encode APH and the addendum as two versioned rule packs.

### 4.1 APH 2024-27 security deposit rules

**Source:** `Approval Process Handbook 2024-25 to 2026-27`, AICTE. PDF: `https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf` (retrieved 25 Oct 2026; 14,735 lines of extracted text). Clause numbers below are from that PDF.

**Who must create a security deposit**

- `[FACT]` Applicants for starting new technical institutions (other than Government/Government-aided) whose applications are recommended for LoA by the Executive Committee are informed to create the security deposit per APH. (Clause 1.12)
- `[FACT]` Existing institutions that applied under Clause 1.3.3 and have been in existence for more than 5 years with the respective regulatory bodies are exempt from payment. (Clause 1.12(i))
- `[FACT]` Applicants under Clause 1.5.2 recommended for starting new technical institutions create the deposit for the balance amount. (Clause 1.12(ii))
- `[FACT]` A deposit created earlier is for the remaining period of 10 years, as applicable. No deposit is required where an NOC was already issued for release of the earlier FDR. (Clause 1.12(iii))
- `[FACT]` Central University/State University/Government Deemed University are not required to pay the security deposit. (Clause 4.10(a))
- `[FACT]` Private Universities/Private Deemed Universities in existence for more than 10 years with UGC are exempt; otherwise they pay for 10 years per Table 1.4. (Clause 4.10(b))
- `[FACT]` If any University starts a new Programme/Level, it must create the security deposit per APH even if it has existed for more than 10 years with UGC. (Clause 4.10(c))

**Table 1.4 — Security Deposit (₹ lakh)**

| Sl. | Programme | Diploma/Post Diploma | Under Graduate | PG Diploma/PG Degree |
|---:|---|---:|---:|---:|
| 1 | Engineering and Technology | 15 | 35 | 15 |
| 2 | Planning | 15 | 15 | 15 |
| 3 | Applied Arts and Crafts | 15 | 15 | 15 |
| 4 | Design | 15 | 15 | 15 |
| 5 | Hotel Management and Catering Technology (HMCT) | 15 | 15 | 15 |
| 6 | Computer Applications (BCA, MCA, etc.) | — | 5 | 15 |
| 7 | Management (BBA, MBA, etc.) | — | 5 | 15 |

`[FACT]` Base APH note: “The Security Deposit amount shall be DOUBLE in case of private leased building / land.” (Table 1.4 note)

`[FACT]` The amount remains with the Council for **10 years**. The interest accumulated is **retained and utilized by the Council** for institutional development, quality improvement, faculty scholarships, etc. (Clause 1.12(iv))

`[FACT]` The **principal amount** is returned to the Trust/Society/Company on completion of the term. The term may be extended for a further period on a case-by-case basis and/or forfeited for violation of norms/conditions/requirements, non-performance, or complaints against the institution. (Clause 1.12(v))

**Late deposit penalties**

- `[FACT]` Applicants must submit payment proof + Affidavit 3 within 15 days of intimation; otherwise a penalty of **10%** (up to 31 May) and **20%** (up to 31 July) of the security deposit is imposed; beyond that, approval is withdrawn. (Clause 2.25(f), as modified by the 2026-27 addendum; base APH has the same 10%/20% language)
- `[FACT]` Where an institution fails to admit students due to non-affiliation/non-fulfilment of State/UT requirements, it may submit an affidavit within 7 days for credit of the security deposit; it may pay in the next academic year per deadlines. (Clause around 1.9/1.12, p.8)

**Early encashment / non-deposit penalty**

- `[FACT]` “In case of Institutions where FDRs are encashed before the date of maturity or not depositing the required Security Deposit at the time of LoA, a penalty of **10% of the value of the FDR** shall be imposed. However, Institutions NOT created FDR / created FDR for lesser duration / lesser amount than prescribed at the time of LoA have to create the same as per the Rules / Policy as specified in the Approval Process Handbook.” (Clause 7.7)

**Release of security deposit**

- `[FACT]` Clause 6.46(a): the Trust/Society/Company uploads/submits:
  - (i) application/request letter for FDR/RTGS release;
  - (ii) Affidavit 6 with institution/Trust/Society/Company details and FDR/RTGS details;
  - (iii) copy of the FDR to be released, in a corpus fund made by RPGF, copy(s) of the Demand Draft (if any) submitted to AICTE for creation of RPGF / online payment proof for the security deposit;
  - (iv) copy of the latest LoA/EoA.
- `[FACT]` Clause 6.46(b): **clearance from PGRC, Vigilance Cell and Other Cells/Bureaus (Grants released to the Institutions)** is required for release.
- `[FACT]` Clause 6.46(c): for FDR/RPGF, after all clearances, an **NOC** is issued by the Approval Bureau.
- `[FACT]` Clause 6.46(d): for RTGS, the **sanction order** is issued by the Council.
- `[FACT]` Clause 6.46(e): if the institution has financial embezzlement with Government bodies/banks, the deposit is **not released** until NOC from that body is received.
- `[FACT]` Clause 6.46(f): violation of security-deposit norms → appropriate penal action.
- `[FACT]` Clause 6.46(g): for AICTE-approved institutions later converted into a Private University/Deemed University, release is subject to **no pending complaints or disciplinary proceedings**, in addition to the documents.
- `[FACT]` Clause 6.46(h): for progressive closure, release on request subject to a certificate from the affiliating University/Board that no students are studying; not needed if the deposit is already matured.
- `[FACT]` Clause 6.46(i): for merger, the child institution’s deposit is released on request subject to the same “no students” certificate.

**Official AICTE circular lead**

- `[UNVERIFIED]` AICTE’s 2026-27 approval page (`https://aicte.gov.in/approal-process-2026-2027`) and `https://aicte.gov.in/node/3299` index a circular titled “Release of FDR / Security Deposit Upon Completion of Maturity Period -reg” (listed 6 October 2025). A secondary Scribd copy summarizes that institutions with matured FDRs must apply through the AICTE portal, and legal/compliance issues block release until resolved. This directly supports the PS pain. The official PDF (`https://aicte.gov.in/sites/default/files/Circular_FDR_List_Institutions_completion%20of%20maturity%20period_%20not%20applied%20on%20portal.pdf`) returned 404 to our fetcher on 25 Oct 2026; do not quote it as verified until downloaded.

**Closure penalties**

- `[FACT]` Where an institution’s closure application is processed and security deposits are to be released, a penalty of **10% of the value of the security deposit** is imposed before release. (Clause 2.21(h))
- `[FACT]` Where an institution has not applied on the portal for EoA for the preceding six years and AICTE closes it, a penalty of **50% of the value of the security deposit** is imposed before release. (Clause 2.21(i))

### 4.2 The 2026-27 Addendum/Corrigendum — the detail almost everyone will miss

**Source:** `ADDENDUM/CORRIGENDUM 2026-27 Of APH 2024-27`, AICTE, 21 pages. PDF retrieved from `https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52940/AICTE-issued-the-Corrigendum-regarding-the-Approval-Process-2026-27-February202026.pdf` on 25 Oct 2026. The official AICTE URLs `https://aicte.gov.in/downloads/aph/Final%20Addendum%202026-27.pdf` and `https://aicte.gov.in/downloads/aph/Final%20Addendum%202026-27_V2.pdf` were indexed by search but returned 404 at retrieval time; the blob copy appears to be the same document. `[FACT]` for content; `[UNVERIFIED]` for exact identity with the official file and for whether the blob is the latest version (it is titled “Addendum/Corrigendum 2026-27 of APH 2024-27” and is 21 pages).

**Item 10 (Table 1.4):**

> “1.12. Table 1.4: Security Deposit for New Institutions established / Existing institutions applying for New Level / New Programme in **North Eastern States/Jammu & Kashmir/Ladakh / Aspirational Districts / Andaman and Nicobar / Lakshadweep / only Women Institutions / Institutions only for PwD** shall be **50%** as mentioned in Table 1.4.”

**Item 11 (Table 1.4 note):**

> “1.12. Table 1.4: Note: The Security Deposit amount shall be **DOUBLE in case of leased building / land**.” (The base APH says “private leased building / land”; the addendum removes “private”.)

**Item 28 (Clause 2.25(f)):** confirms the 10%/20% late-deposit penalty and withdrawal beyond 31 July. It also changes the cross-reference from Clause 2.3.2 to Clause 2.12.

**Items 36–37 (Clause 6.46):** the heading becomes **“Release of Security Deposit/FDR/RTGS”**, and the application/Affidavit 6 language includes **“Security Deposit/FDR/RTGS/RPGF (wherever applicable)”**.

**Why this matters for our solution**

- A correct calculator cannot be a single table lookup. It needs:
  - programme + level;
  - institution location/category (NE/J&K/Ladakh/Aspirational District/A&N/Lakshadweep/women-only/PwD-only);
  - leased vs. owned building/land;
  - existing deposit and remaining 10-year term;
  - exemptions (government/aided, existing >5 years, private university >10 years with UGC, NOC already issued);
  - instrument type (FDR, RTGS, RPGF, BG if applicable);
  - effective policy version (base APH vs. 2026-27 addendum).
- A correct release workflow cannot be a generic checklist. It needs the 6.46 clearance graph, including PGRC, Vigilance, Grants, financial embezzlement NOC, pending complaints/disciplinary proceedings for converted universities, progressive-closure certificate, merger certificate, and the RTGS vs. FDR/RPGF difference.
- A correct penalty engine needs at least:
  - 10% late deposit up to 31 May;
  - 20% late deposit up to 31 July;
  - withdrawal beyond 31 July;
  - 10% early encashment / non-deposit at LoA;
  - 10% closure release penalty;
  - 50% six-year non-application closure penalty;
  - extension/forfeiture discretion (not automatically calculable; route to competent authority).

### 4.3 RPGF

`[FACT]` RPGF = **Refundable Performance Guaranty Fund** (APH abbreviation list). Clause 6.46 treats RPGF alongside FDR/RTGS for release. The 2026-27 addendum explicitly adds RPGF to the release heading and application/Affidavit 6 language.

**Implication:** the data model should support at least four instrument families: **FDR**, **RTGS/online security deposit**, **RPGF**, and **Bank Guarantee (BG)** (if the institution’s approval route uses BG; the PS says “security deposits or FDRs”, so BG is optional but useful). Each has different release mechanics: FDR/RPGF → NOC by Approval Bureau; RTGS → sanction order by Council; BG → discharge/release letter to bank.

### 4.4 Approval stages and committees (for 26262 context)

`[FACT]` The APH describes new applications as processed through **Scrutiny, Re-Scrutiny, EVC, SAC/SHC** (Clause 1.2(b), Annexure-7). `[FACT]` EVC is constituted by the Regional Officer (base APH) / Council (2026-27 addendum) and verifies infrastructure physically/online/hybrid. `[FACT]` SAC = Standing Appellate Committee; SCSC = Standing Complaint Scrutiny Committee; SHC = Standing Hearing Committee. `[FACT]` The Executive Committee grants approval; appeals go to the Council via SAC within 7 days of LoD. `[FACT]` The APH cover states: “This Handbook is a Legal Document as per All India Council for Technical Education Act, 1987 (52 of 1987).” `[INFERENCE]` Treat its clauses as authoritative for the compliance product, subject to AICTE’s interpretation.

**Implication for 26262:** a workflow product must model the actual stage matrix per application category, not a generic Kanban. This is the fallback wedge if we choose 26262.

### 4.5 APAAR facts (for 26263 context)

- `[FACT]` APAAR = Automated Permanent Academic Account Registry; a unique **12-digit** student ID linked to the Academic Bank of Credits (ABC) and DigiLocker; part of “One Nation, One Student ID.” (PIB factsheet, 4 Jul 2026; `apaar.education.gov.in`; `abc.gov.in`)
- `[FACT]` As of **2 July 2026**, **26.35 crore verified APAAR IDs** had been generated across India. (PIB factsheet, 4 Jul 2026: `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281148`; PDF: `https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jul/doc202675912501.pdf`)
- `[FACT]` The APAAR portal homepage displays **33.74 crore APAAR ID registered** (retrieved 25 Oct 2026: `https://apaar.education.gov.in/`).
- `[FACT]` A separate PIB factsheet, posted 12 Aug 2026, says **more than 33.74 crore APAAR IDs had been generated by June 2026** (`https://www.pib.gov.in/FactsheetDetails.aspx?ModuleId=16&NoteId=150840&id=150840&lang=1&reg=6`).
- `[INFERENCE]` The figures are not necessarily contradictory: “verified” (26.35 crore as of 2 July 2026), “registered” (APAAR portal homepage), and “generated” (PIB factsheet, June 2026) may use different definitions and dates. In the PPT, cite one number with its exact label and date, or use “26.35 crore verified (July 2026)” as the conservative number. Do not say “33.74 crore verified,” and do not combine the figures.
- `[FACT]` APAAR IDs are generated through schools/UDISE+, higher/skill institutions, DigiLocker, UMANG, or Common Service Centres; parent consent is required for minors. (APAAR FAQ / ABC portal)
- `[FACT]` APAAR is pushed into the student’s DigiLocker account; ABC receives academic credits from institutions/awarding bodies through the National Academic Depository. (ABC portal / PIB)
- `[UNVERIFIED]` Whether AICTE has a production API for institutions to push student-level data keyed by APAAR, and whether third-party access is available without an MoU. The PS asks for integration/API capability; the prototype should simulate it and disclose that. Do not claim live API access.
- `[INFERENCE]` The hard part of 26263 is not the dashboard; it is consent, privacy, cross-institution duplicate detection without sharing raw PII, and handling non-APAAR/legacy records. The top competitors already do this. This is why 26263 is a poor choice for a 36-hour team without a crypto/privacy specialist.

### 4.6 Complaint ecosystem (for 26264 context)

- `[FACT]` The PS names the Regulation Bureau (RB) and Public Grievance Redressal Cell (PGRC) as the main handlers, plus other Bureaus/Cells and Regional Offices.
- `[FACT]` The APH defines **SCSC** (Standing Complaint Scrutiny Committee) for scrutiny of complaints against technical institutions. `[FACT]` **SHC** reviews EVC reports/replies to show-cause notices. `[FACT]` **SAC** hears appeals.
- `[UNVERIFIED]` Actual AICTE complaint SLA values. Do not present a specific number of days as official unless sourced. If we build 26264, use configurable SLAs and label defaults as demo assumptions.
- `[INFERENCE]` The strongest 26264 competitors already do fuzzy institution resolution and overlap detection. A differentiator would be linking complaints to approval/release decisions (e.g., a pending PGRC complaint blocks an FDR release), which is exactly the cross-PS integration we can showcase in 26265.

### 4.7 Integration reality (use this to sound mature, not naive)

| Domain | Real integration path | What we can honestly build in 36h | Label in demo |
|---|---|---|---|
| Bank FDR verification | Bank API / NeSL e-BG / RBI Account Aggregator / PFMS / manual bank letter | Adapter with sandbox + uploaded bank confirmation + officer-recorded verification | **SIMULATED / SANDBOX** |
| AICTE approval data | AICTE portal/ICMS (internal) | CSV/JSON import + adapter interface; synthetic seed | **MOCK / DESIGN-FOR-INTEGRATION** |
| Complaints (PGRC/RB) | CPGRAMS / AICTE CMS | Mock complaint service + adapter contract | **MOCK** |
| DigiLocker / eSign | DigiLocker Authorized Partner API / CCA eSign | Mock consent/verification + document hash; optional eSign sandbox | **MOCK** |
| APAAR/ABC | ABC/APAAR APIs, likely MoU-gated | Mock registry + deterministic format/duplicate checks | **MOCK** |
| Payments/RTGS | PFMS / bank gateway | Payment proof upload + UTR matching; no live transfer | **SIMULATED** |
| SMS/email | NIC/BSNL/email gateway | Console/email log + adapter | **SIMULATED** |

**Jury rule:** never say “integrated with banks/APAAR/DigiLocker” if it is simulated. Say “adapter-ready; the prototype uses a labelled sandbox because production access requires an MoU.”

---

## 5. Competitive landscape summary

> Full detail, repo-by-repo, is in `opponent.md`. This is the decision-grade summary.

### 5.1 Headline numbers

- `[FACT]` GitHub API search for `SIH26261 OR SIH26262 OR SIH26263 OR SIH26264 OR SIH26265` returned **31 repositories** on 25 Oct 2026 (sorted by update).
- `[FACT]` Broader searches for `APAAR` / `AICTE` found additional repos; **30 repos were cloned and inspected** for README/code/stats.
- `[FACT]` At least **10 live demo URLs returned HTTP 200** on 25 Oct 2026 (see `opponent.md`). One repo homepage returned 404.
- `[INFERENCE]` The real number of competing teams is higher than the repo count because many teams do not publish code. The GitHub landscape is a lower bound, not a census.

### 5.2 Strongest competitor per PS

| PS | Strongest repo(s) | Why they are dangerous | Their gap |
|---|---|---|---|
| 26261 | `Adi-ctive/pramaan`, `aquasimp/SIH26261`, `omkardiggi/sih26261-scandoc`, `sethupathy03/sih26261-satyapramaan` | Live demos, OCR/ELA/trust scores, rule packs, audit, tests, polished UI | Most simulate issuer verification; few encode APH versioning; false-positive risk |
| 26262 | `MahatvaGoell/aicte-approval-compliance-platform`, `saran612/SIH26262` | Versioned policy, obligations table, virtual clock, hash-chained audit, roles | Rules are demo assumptions, not the full APH stage matrix; EVC scheduling generic |
| 26263 | `Garv1105/...VidyaPramaan`, `Soumya-Vinod/apaar-integrity-platform`, `Purva2907/VIDYA-VERIFY`, `DeepakUK17/EduTrace` | Full products, tests, live demos, privacy/crypto, duplicate detection, evaluation | APAAR/ABC integration is simulated; legacy/non-APAAR and graph fraud remain hard |
| 26264 | `Shash1704/aicte-icms`, `Adit-K06/SIH26264-Complains-Dashboard` | Fuzzy entity resolution, overlap engine, coordination workflow, SLA, live demo | Complaint-to-regulatory-action link, privacy, CPGRAMS integration |
| 26265 | `Shash1704/aicte-fdr-portal`, `MR-JK-37/aicte-fdr-portal` | Three-way provenance, bank sandbox, release workflow, reminders, audit, live demo | **Policy rules are illustrative/draft; missing 2026-27 addendum; release graph incomplete; no maturity cash-flow forecast** |

### 5.3 What the jury will see from most teams

`[INFERENCE]` based on the repos:

- A polished dashboard with synthetic data.
- “AI-powered” OCR/LLM claims without an evaluation.
- A trust score/risk score with arbitrary weights.
- A generic release checklist (if any).
- “Blockchain” or “immutable audit” claims without a verifiable chain.
- A demo that works on the happy path but not on edge cases.

**How we win:** exact rules, evidence-linked outputs, a coherent end-to-end story, edge-case demos, honest integration labels, and a working time machine. Substance over buzzwords.

---

## 6. PS decision matrix

### 6.1 Criteria and weights

Weights reflect what matters for a 36-hour SIH prototype and a jury demo. `[OPINION]`

| Criterion | Weight | What “5” means |
|---|---:|---|
| Competitor density (lower is better) | 25% | Few strong teams; clear whitespace |
| Build feasibility in 36h | 20% | Can ship a credible end-to-end demo with the team’s skills |
| Demo wow factor | 15% | Visual, memorable, easy to explain in 7 minutes |
| Domain moat / research advantage | 15% | We can know something most teams do not |
| Integration clarity | 10% | Clear adapter path; honest simulation |
| Jury appeal / impact | 10% | Financial/regulatory stakes, measurable outcomes |
| Team fit (hardware + AI agents) | 5% | Leverages our strengths; no rare specialist needed |

### 6.2 Scores

Scores 1–5. Higher is better except “competitor density,” where 5 = least crowded.

| PS | Competitor density | Build feasibility | Demo wow | Domain moat | Integration clarity | Jury appeal | Team fit | Weighted |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 26261 | 1 | 2 | 5 | 3 | 4 | 5 | 2 | **2.85** |
| 26262 | 3 | 4 | 3 | 5 | 3 | 4 | 4 | **3.65** |
| 26263 | 1 | 2 | 4 | 3 | 4 | 5 | 2 | **2.70** |
| 26264 | 3 | 3 | 3 | 3 | 3 | 4 | 3 | **3.10** |
| **26265** | **4** | **4** | **5** | **5** | **4** | **5** | **4** | **4.40** |

### 6.3 Sensitivity check

- If **build feasibility** is weighted 30% and competitor density 15%, 26262 narrows the gap but 26265 still leads (because 26265 is feasible and has a stronger moat).
- If **competitor density** is weighted 35%, 26265 wins more clearly.
- If the team has a strong ML/CV specialist, 26261 becomes more viable, but the competitor density remains the worst.
- If the team has a strong crypto/privacy specialist, 26263 becomes more viable, but `Garv1105` and `Soumya-Vinod` are still national-quality.
- If the team wants the safest “we can definitely build this” PS, 26262 is the fallback.

### 6.4 Recommendation

**Primary: SIH26265.** **Fallback: SIH26262.** **Third: SIH26264.** **Avoid: SIH26261, SIH26263.** `[OPINION]`

**Decision rule for the Boss:** if by the end of 25 Oct the team agrees with the policy-moat thesis and can commit to a 7-minute demo, choose 26265. If the team is uncomfortable with financial/regulatory domain rules or wants a more conventional workflow product, choose 26262.

---

## 7. Winning solution for SIH26265 — SURAKSHA Control Tower

### 7.1 One-line pitch

> “SURAKSHA is a policy-native security-deposit control tower that proves every FDR is real, correctly sized, continuously pledged, and safe to release — with every decision traceable to the AICTE Approval Process Handbook.”

### 7.2 The problem in one slide

- `[FACT]` A new Engineering UG institution must deposit **₹35 lakh**; if the building/land is leased, **₹70 lakh**; the deposit stays with AICTE for **10 years**; interest is retained by AICTE; only the principal is returned. (APH Table 1.4, Clause 1.12)
- `[FACT]` Release requires a document set, **PGRC/Vigilance/Grants clearances**, and an NOC/sanction order; certain cases are blocked by complaints, disciplinary proceedings, or financial embezzlement. (Clause 6.46)
- `[FACT]` Premature encashment or non-deposit at LoA attracts a **10% penalty**; late deposit attracts **10%/20%**; closure cases can attract **10% or 50%**. (Clauses 7.7, 2.25(f), 2.21(h)/(i))
- `[INFERENCE]` Fragmented tracking makes it hard to know: which instrument is real, which is about to mature, which institution has a shortfall, and which release is safe. That is the gap.

### 7.3 Users and jobs-to-be-done

| User | Job | Pain today | What SURAKSHA gives |
|---|---|---|---|
| Institution Registrar/Finance | Submit/renew/release FDR; prove compliance | Re-uploading, e-mail follow-ups, unclear status | Single window, status, reminders, pre-check |
| Dealing Officer (RB) | Verify instruments, scrutinize discrepancies | Manual OCR, bank letters, spreadsheets | Three-way provenance, evidence, queue |
| Director, RB | Approve/waive, monitor risk | No portfolio view, no ₹ at risk | Dashboard, pledge graph, cash-flow forecast |
| Competent Authority | Approve releases | Incomplete files, hidden complaints | Release eligibility graph, maker-checker |
| Accounts | Confirm refund account, issue release letter | Manual reconciliation | Verified account, letter generation |
| Auditor | Audit actions | Fragmented logs | Hash-chained audit, export |
| Bank Verifier | Confirm FDR/lien | Ad-hoc letters | Structured verification request/response |

### 7.4 Core modules (build these, in this order)

#### M1. Instrument Register & Institution 360

- Institution master keyed by AICTE Permanent ID; Trust/Society/Company; region; programme/level; approval status; leased/owned; location category.
- Instrument record: type (FDR/RTGS/RPGF/BG), number, bank, branch, IFSC, amount, issue date, maturity date, tenure, interest rate, depositor, lien in favour of AICTE, status, document IDs, bank verification IDs, predecessor/successor (renewal lineage).
- Status machine: `DRAFT → SUBMITTED → UNDER_SCRUTINY → QUERY_RAISED → VERIFIED → ACTIVE → EXPIRING → MATURED → RENEWAL_DUE → RENEWED/REPLACED → RELEASE_REQUESTED → CLEARANCES_PENDING → APPROVED → RELEASED/DISCHARGED → CLOSED`; side exits `REJECTED`, `WITHDRAWN`, `FORFEITED` (only by competent authority).
- Every status change writes an audit event and, where relevant, an obligation.

#### M2. Intake, OCR & Three-Way Provenance

- Upload PDF/image; SHA-256; AES-256-GCM at rest; versioning.
- Extract fields from the PDF text layer first; OCR fallback (Tesseract/browser or server).
- For each key field, store three values:
  1. **Declared** (institution form);
  2. **Document** (OCR/extraction, with page/bbox/confidence);
  3. **Bank** (verification response, with source/timestamp/reference).
- Discrepancy rules:
  - amount mismatch (critical);
  - instrument number mismatch (critical);
  - issue/maturity date mismatch (serious);
  - IFSC/branch/bank mismatch (serious);
  - depositor ≠ Trust/Society/Company (serious);
  - lien not in favour of AICTE (critical);
  - tenure < required (serious);
  - duplicate instrument number across institutions (critical);
  - duplicate file hash (critical);
  - missing prescribed documents (warning);
  - bank record not found/encashed/closed (critical).
- Every finding: severity, reason, evidence pointer, suggested action, and a human disposition (`open`, `accepted`, `waived` with reason, `resolved`).

#### M3. Policy Pack 2026-27 (the moat)

- **Versioned rule sets:** `APH_2024_27_BASE` and `APH_2026_27_ADDENDUM`. Each rule has `id`, `clause`, `effective_from`, `effective_to`, `source_url`, `text_excerpt`, `status` (`active`, `draft`, `blocked`).
- **Requirement calculator:**
  ```
  base = Table1_4[programme][level]
  if location_category in {NE, J&K, Ladakh, Aspirational District, A&N, Lakshadweep}
     or institution_type in {women_only, PwD_only}:
      base = base * 0.50          # Addendum 2026-27 item 10
  if building_or_land == leased:
      base = base * 2.00          # Addendum 2026-27 item 11
  if exemption applies:
      required = 0
  else if existing_deposit and remaining_term:
      required = max(0, base - eligible_existing_credit)
  else:
      required = base
  ```
  - Exemptions: Government/Government-aided; Central/State University/Government Deemed; existing >5 years with regulatory bodies (Clause 1.12(i)); private university/deemed >10 years with UGC (Clause 4.10(b)); NOC already issued for earlier FDR (Clause 1.12(iii)).
  - The calculator must show the rule trace: base → concession → leased multiplier → exemption/credit → required.
- **Holding-period clock:** start date, 10-year end date, extension flag, forfeiture flag; interest is not part of the refundable principal.
- **Penalty engine:**
  - late deposit: 10% up to 31 May, 20% up to 31 July, withdrawal beyond (Clause 2.25(f));
  - early encashment/non-deposit at LoA: 10% (Clause 7.7);
  - closure release: 10% (Clause 2.21(h));
  - six-year non-application closure: 50% (Clause 2.21(i));
  - extension/forfeiture: route to competent authority; do not auto-calculate.
- **Policy diff screen:** side-by-side base vs. addendum, with clause citations and effective dates. This is a jury “wow” moment and a genuine compliance feature.

#### M4. Bank Verification Adapter

- Interface:
  ```
  verify(instrument) -> {
    status: FOUND | NOT_FOUND | ENCASHED | CLOSED | UNSUPPORTED | SOURCE_UNAVAILABLE,
    record: { amount, issue_date, maturity_date, ifsc, branch, depositor, lien },
    source, reference, timestamp, confidence
  }
  ```
- Modes:
  1. **API** (where authorized);
  2. **Bank letter/e-mail** (upload + officer-recorded fields);
  3. **Sandbox** (demo).
- Never auto-accept without bank confirmation unless a Director/Competent Authority records a written reason; label the record `officer-verified`, not `bank-confirmed`.
- Periodic re-verification every 30 days to catch post-acceptance encashment.

#### M5. Lifecycle, Reminders & Time Machine

- Daily idempotent job:
  - move to `MATURED` on maturity date;
  - reminder ladder T-90/60/30/15/7/0 while renewal is needed;
  - overdue notice every 7 days after maturity;
  - escalation: L1 dealing officer (day 1), L2 Director (day 15), L3 Competent Authority with final notice (day 30);
  - periodic bank re-check;
  - auto-resolve alerts when the condition clears.
- Time machine for demo: advance the system date; show reminders/maturity/escalation live.
- Renewal lineage: successor instrument linked to predecessor; gap/overlap detection; history preserved.

#### M6. Release Eligibility Graph

- A release request is a node; the graph evaluates:
  - term served (10-year hold; maturity; early-release conditions);
  - document set complete (application, Affidavit 6, FDR/RPGF proof, latest LoA/EoA);
  - PGRC clearance;
  - Vigilance clearance;
  - Grants/other cell clearance;
  - outstanding dues/penalties;
  - financial embezzlement NOC (if applicable);
  - pending complaints/disciplinary proceedings (converted universities);
  - progressive-closure “no students” certificate (not needed if the deposit is already matured, per Clause 6.46(h));
  - merger “no students” certificate;
  - bank lien/discharge confirmation;
  - RTGS vs. FDR/RPGF routing (sanction order vs. NOC).
- **Official vs. system-level:** Clause 6.46 explicitly names the document set, PGRC, Vigilance, other cells/bureaus (grants), financial-embezzlement NOC, converted-university complaints/disciplinary proceedings, progressive-closure certificate, merger certificate, and RTGS vs. FDR/RPGF routing. “Outstanding dues/penalties” and “bank lien/discharge” are system-level controls implied by Clause 6.46(f) and Clause 1.12; label them as system checks, not as APH-mandated clearances, until AICTE confirms.
- Output: `ELIGIBLE`, `BLOCKED` (with blocker nodes), `NEEDS_INFO`, `PENDING_SOURCE`.
- Workflow: maker (dealing officer) → checker (Director) → approver (Competent Authority) → Accounts (release letter/refund). Segregation of duties enforced.
- Every decision cites the clause and the evidence.

#### M7. Pledge Graph & Fraud Detection

- Visual graph: institutions, instruments, banks, approvals, documents.
- Edges: “pledged for”, “renewed from”, “same instrument number”, “same file hash”, “same account”, “same signatory”.
- Detect:
  - one FDR pledged for two institutions/approvals;
  - one file re-used with altered metadata;
  - a bank branch/IFSC that does not match the instrument;
  - premature encashment after acceptance;
  - maturity date arithmetic inconsistent with issue date + tenure;
  - interest rate/amount anomalies.
- Use graph algorithms (connected components, shared-neighbour scoring) but keep the output explainable.

#### M8. Maturity Cash-Flow Forecast

- Portfolio view for the Director/Competent Authority:
  - ₹ maturing by quarter/month;
  - expected renewals vs. releases;
  - instruments with no renewal instruction;
  - at-risk amount (critical findings + lapsed + bank-not-found);
  - staffing load (verification/release requests per officer);
  - region/bank/programme concentration.
- Export CSV/PDF; drill-down to the filtered list.
- This is a genuine differentiator: most teams stop at “active/expiring/matured” counts.

#### M9. Evidence Vault, Audit & Security

- Document store: AES-256-GCM at rest; SHA-256 fingerprints; signed short-lived URLs; no public buckets.
- Audit: append-only, hash-chained (`SHA256(prev_hash + event + actor + timestamp + payload)`); verify endpoint; export.
- RBAC + ABAC: institution users see only their records; regional officers see their region; release roles separated.
- PII/financial data: masked by default; field-level encryption for account numbers; no raw PII in logs.
- eSign: optional integration; hash of the release letter stored with the signature.
- DPDP-aligned retention/consent notes; label what is not legally reviewed.

#### M10. Dashboards & Reports

- Institution dashboard: my deposits, status, upcoming actions, queries, release requests.
- RB dashboard: queue, discrepancies, pending verification, ₹ at risk, maturity calendar.
- Director/CA dashboard: portfolio, forecast, release approvals, escalations.
- Reports: active/expiring/matured/renewed/released/pending; bank-wise; region-wise; programme-wise; missing documents; overdue; audit; release turnaround.
- Every number drill-downs to the underlying records. No orphan metrics.

### 7.5 Differentiators vs. the two strongest incumbents

| Capability | `Shash1704/aicte-fdr-portal` | `MR-JK-37/aicte-fdr-portal` | SURAKSHA |
|---|---|---|---|
| Three-way provenance | Yes | Yes (evidence levels L0–L3) | Yes, field-level + evidence pointers |
| Bank sandbox | Yes | Claims real integrations, but BG/e-BG disabled; APH rules draft | Yes, adapter + honest labels |
| Release workflow | Yes (maker-checker-approver, ICMS check) | Yes (complex state machine) | Yes + **release eligibility graph** with all 6.46 clearances |
| Reminder ladder | T-90/60/30/15/7/0 + escalation | 90/60/30/15/0 + DB-leased scheduler | Yes + time machine + forecast |
| Policy accuracy | **Illustrative norms, editable** | **Table 1.4 draft; penalties BLOCKED** | **Base APH + 2026-27 addendum, versioned, cited** |
| 50% NE/J&K/Ladakh/Aspirational District/women/PwD concession | No | No (draft only) | **Yes** |
| Leased-land double | Partial/illustrative | Draft | **Yes, addendum wording** |
| Interest retention | Not a first-class concept | Partial | **Yes: principal vs. interest** |
| RPGF | Not first-class | Partial | **Yes, addendum 6.46** |
| Maturity cash-flow forecast | No | No | **Yes** |
| Pledge graph | Duplicate instrument rule | Duplicate checks | **Yes, visual graph** |
| Live demo | Yes (GitHub Pages) | No live demo found | Yes (we will deploy) |
| Tests | 9 e2e scenarios | 632 backend tests (overkill) | Focused tests on policy + edge cases |

**How to talk about the incumbents without attacking them:** “They built a strong portal. We built the compliance brain on top of the portal: the Policy Pack, the release graph, and the portfolio forecast. That is the difference between storing an FDR and being able to defend a release.”

### 7.6 7-minute demo script

**Superseded:** use `build/04_DELIVERY.md` §5 for the exact current sequence. The table below is historical.

**Setup:** synthetic institution “Sanjeevani Institute of Technology” (Engineering UG, leased building, ₹70 lakh required under base + leased multiplier; or use a NE institution to show the 50% concession — pick one hero case and one contrast case).

| Time | Screen | Action | Line |
|---:|---|---|---|
| 0:00–0:40 | Home | Show portfolio: active, expiring, ₹ at risk, upcoming maturities | “AICTE holds security deposits for institutions. The question is not where the FDRs are; it is which ones are real, correctly sized, and safe to release.” |
| 0:40–1:40 | Institution submission | Upload FDR; OCR extracts amount, dates, IFSC, lien | “The institution declares ₹70 lakh. The document says ₹70 lakh. The bank says ₹35 lakh. The system shows all three, side by side.” |
| 1:40–2:30 | Provenance | Highlight mismatch; show evidence; bank sandbox verification | “This is not a black-box fraud score. It is a field-level discrepancy with the page, the bounding box, and the bank reference.” |
| 2:30–3:20 | Policy Pack | Show requirement trace: base 35L → leased ×2 → 70L; switch institution to NE → 17.5L; show clause citations | “This is the 2026-27 addendum. Most portals use illustrative norms. Ours can show why the number is the number.” |
| 3:20–4:10 | Release request | Request release; graph blocks on PGRC complaint and missing Vigilance clearance | “The deposit is mature, but release is not automatic. The graph shows exactly what is missing and who must clear it.” |
| 4:10–4:50 | Clearances | Clear PGRC/Vigilance; maker-checker-approver; generate NOC/release letter | “Every release is a decision with evidence, not an e-mail trail.” |
| 4:50–5:40 | Time machine | Advance 90 days; show reminder, maturity, escalation, renewal; show forecast | “The system runs the calendar before the calendar runs the institution.” |
| 5:40–6:30 | Pledge graph / fraud | Show one FDR pledged to two institutions; show graph and block | “This is the fraud you cannot see in a spreadsheet.” |
| 6:30–7:00 | Audit | Verify hash chain; show audit export | “Every action is traceable. The jury can click verify.” |

**Fallback:** if the live demo fails, play a recorded 3-minute video and walk through screenshots. Never debug live for more than 20 seconds.

### 7.7 Impact metrics (use these, not invented percentages)

| Metric | Definition | Baseline (manual) | Target (prototype) | How we measure in demo |
|---|---|---|---|---|
| Verification turnaround | Median days from submission to bank-confirmed/verified | Manual baseline from seeded “pre-portal” records | < 1 day in demo; show median | Timestamps in audit |
| % bank-confirmed | Held instruments with bank confirmation / total held | Baseline from seed | 100% for new submissions; officer-verified flagged separately | Dashboard |
| Renewals before maturity | Renewed before maturity / renewals due | Baseline from seed | 100% in demo | Reminder/maturity log |
| Release cycle time | Days from release request to decision | Baseline from seed | < 3 days in demo | Release audit |
| ₹ at risk caught | Value of instruments with critical findings | 0 (not visible) | Show ₹ value | Pledge/discrepancy dashboard |
| Manual tracking effort | Notices sent automatically vs. manual | Baseline from seed | Show count | Alert log |
| Policy traceability | % decisions with clause citation | 0% | 100% | Audit/decision record |

`[OPINION]` Do not claim “reduces manual work by 70%” unless the Boss has a source or a measured baseline. Use “target” and “prototype measurement,” not “proven.”

### 7.8 Idea PPT outline (6 slides, due 28 Oct 2026)

**Slide 1 — Title**
- SURAKSHA: AICTE Security Deposit Control Tower.
- PS SIH26265, Software, Smart Automation.
- Team name, college, members, roles.
- One-line pitch.

**Slide 2 — Problem**
- The deposit lifecycle is fragmented: institution records, bank instruments, maturity dates, renewals, release clearances, complaints.
- Official facts: ₹35L/₹70L, 10-year hold, interest retained, 6.46 clearances, 10%/20%/50% penalties.
- Who suffers: institutions (delays/queries), RB officers (manual verification), AICTE (₹ at risk/release risk), students (institutional compliance).
- “What happens today” story: an FDR matures; the institution e-mails; the officer searches a spreadsheet; the release file misses a PGRC clearance; the case waits.

**Slide 3 — Solution**
- Five pillars: Policy Pack, Three-way provenance, Release Eligibility Graph, Pledge Graph + Forecast, Evidence Vault + Time Machine.
- One screenshot/wireframe of the provenance screen and the release graph.
- “Not another CRUD portal; a compliance brain.”

**Slide 4 — Architecture / how it works**
- Simple diagram: React frontend → FastAPI/Node API → Postgres → document store → policy engine → bank/complaint adapters.
- Show the rule trace and the graph.
- Label simulated adapters.

**Slide 5 — Impact / differentiation**
- Metrics table (targets, not invented results).
- Comparison: “Portal vs. control tower.”
- Moat: exact 2026-27 policy + release graph + forecast.

**Slide 6 — Feasibility / roadmap**
- 36-hour build plan (6 blocks).
- Tech stack and team roles.
- Integration path: sandbox now, MoU/API later.
- Security/privacy.
- Ask: shortlist us; we will demo the time machine and the release graph live.

**PPT rules:** no wall of text; one idea per slide; cite the APH clause on the policy slide; use the official PS ID; include a “what is simulated” footnote.

### 7.9 36-hour prototype build plan (post-shortlist)

Assumes 3 builders + 1 presenter/QA + AI agents. Adjust to the actual team.

| Block | Hours | Owner | Deliverable | Acceptance |
|---|---:|---|---|---|
| B0 | 0–2 | All | Repo, CI, env, seed data, auth skeleton, deploy target | `npm test`/`pytest` green; app loads |
| B1 | 2–8 | Kiro | DB schema + instrument/institution APIs + document upload + SHA/AES | CRUD + upload + audit event |
| B2 | 8–14 | Kiro + OpenCode | Policy engine + requirement calculator + penalty rules + tests | Table 1.4, 50% concession, leased ×2, exemptions, 10%/20%/10%/50% tests pass |
| B3 | 14–20 | anti-gravity | Institution + RB dashboards; provenance screen; discrepancy evidence | Screens work on seeded data |
| B4 | 20–26 | Kiro | Release eligibility graph + clearances + maker-checker-approver + NOC letter | Blocked/allowed scenarios pass |
| B5 | 26–30 | anti-gravity | Time machine, reminders, maturity forecast, pledge graph | Demo script steps 4–6 work |
| B6 | 30–34 | All | End-to-end demo data, video fallback, PPT v2, jury Q&A | 7-minute run-through twice |
| B7 | 34–36 | Auditor + Boss | Audit pass, security check, final deploy, submit | No P0 bugs; truth labels correct |

**Cut list if behind:** pledge graph → maturity forecast → eSign → BG support → multi-language. Keep: policy engine, provenance, release graph, time machine, audit.

### 7.10 Fallback plan for SIH26262 (if the Boss chooses it)

**Thesis:** “An APH-native workflow compiler that turns the legal handbook into an executable, auditable approval calendar.”

Modules:
1. **Rulebook compiler:** parse/encode the APH stage matrix per application category (new institution, EoA, new course, intake increase, closure, university, etc.).
2. **Workflow engine:** stage transitions, return/revert reasons, role/committee routing, SLA clocks.
3. **EVC scheduler:** panel composition, conflict-of-interest, workload/geography, reminders.
4. **Undertaking/lease register:** conditions, evidence, due dates, expiry, escalation.
5. **Digital twin:** simulate the approval year; show bottlenecks and what-if staffing.
6. **Audit:** hash-chained event log; role-based dashboards.

Differentiator vs. `MahatvaGoell`/`saran612`: exact APH stage matrix + digital twin + EVC scheduling constraints. Still strong, but less visually demoable than 26265’s ₹ story.

---

## 8. Jury Q&A bank (26265)

> Answer short, cite the rule, and show the screen. If you do not know, say “That is an open policy question; our system routes it to the competent authority.”

1. **“Why not just use Excel or an ERP?”**
   Excel cannot prove provenance, enforce release clearances, or produce a tamper-evident audit. An ERP stores records; SURAKSHA enforces the APH rules and shows the evidence.

2. **“This already exists. Why yours?”**
   Existing tools are generic document/workflow products. SURAKSHA is built around the AICTE security-deposit lifecycle: Table 1.4, the 2026-27 50% concession, the 10-year hold, the 6.46 clearance graph, and the ₹ at-risk portfolio.

3. **“Will banks give you APIs?”**
   Not universally. We designed a bank verification adapter with three modes: authorized API, bank letter/e-mail confirmation, and a labelled sandbox. Production access requires an MoU; the prototype is honest about that.

4. **“Why not blockchain?”**
   We use a hash-chained audit log, which gives tamper-evidence without consensus overhead. Blockchain could later notarize across organizations, but it is not required for the core problem.

5. **“How do you handle the 2026-27 addendum?”**
   The Policy Pack is versioned. The calculator applies the 50% concession for NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only institutions, doubles for leased building/land, and includes RPGF in release. The policy diff screen shows the base vs. addendum.

6. **“What about interest?”**
   APH says the interest accumulated is retained by AICTE; only the principal is returned. We track principal and interest separately and never include interest in the refundable amount.

7. **“What if the FDR is encashed early?”**
   The bank re-check (every 30 days) flags it as critical; the system raises a show-cause and applies the 10% penalty under Clause 7.7, with human approval.

8. **“How do you prevent one FDR being used twice?”**
   Duplicate instrument number, duplicate file hash, bank confirmation, and the pledge graph. Critical findings block acceptance.

9. **“How do you handle release when a complaint is pending?”**
   The release eligibility graph queries PGRC, Vigilance, Grants, dues, and disciplinary proceedings. It blocks release and shows the exact missing clearance.

10. **“What if the bank says ‘not found’?”**
    Status `NOT_FOUND` or `SOURCE_UNAVAILABLE`; route to manual review. We never auto-reject on a bank non-response.

11. **“Is this scalable?”**
    Postgres + object storage + async jobs; region/bureau scoping; 10-year records; indexes on institution/instrument/maturity; audit partitioning. The demo is small, the design is not.

12. **“What is your moat?”**
    The Policy Pack + release graph + provenance + portfolio forecast. The UI is easy to copy; the regulatory encoding and evidence trail are not.

13. **“Why will institutions use it?”**
    One window, clear status, fewer queries, reminders, faster release.

14. **“Why will AICTE use it?”**
    ₹ at-risk visibility, release control, audit, workload management, and a defensible decision record.

15. **“What is simulated?”**
    Bank verification, AICTE approval data, complaints, DigiLocker/eSign, APAAR/ABC, payments. Everything is labelled. The policy engine, workflow, audit, and UI are real.

16. **“What about data privacy?”**
    Role-based access, field-level encryption for account numbers, encrypted documents, masked PII, audit logs, retention policy. DPDP alignment is a design goal, not a certification claim.

17. **“What if the institution disputes a finding?”**
    Every finding has evidence and a disposition; the institution can respond; the officer can waive with a reason (except critical findings); the audit records both.

18. **“What happens after the 10-year term?”**
    The system computes maturity, checks release eligibility, and routes to NOC/sanction. Extension/forfeiture is a competent-authority decision, not automatic.

19. **“How is this different from the strongest GitHub repo?”**
    They built a strong portal with provenance and reminders. We add the exact 2026-27 policy, the release eligibility graph, the pledge graph, and the maturity cash-flow forecast. We respect their work; we are building the compliance brain.

20. **“Can you show it in 5 minutes?”**
    Yes: submit → provenance mismatch → policy trace → release blocked → clearance → time machine → audit verify.

---

## 9. Source ledger

| # | Source | URL | Retrieved | Used for | Confidence |
|---:|---|---|---|---|---|
| 1 | SIH26261 mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26261` | 25 Oct 2026 | Full official description | High (mirror of official) |
| 2 | SIH26262 mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26262` | 25 Oct 2026 | Full official description | High |
| 3 | SIH26263 mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26263` | 25 Oct 2026 | Full official description | High |
| 4 | SIH26264 mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26264` | 25 Oct 2026 | Full official description | High |
| 5 | SIH26265 mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26265` | 25 Oct 2026 | Full official description | High |
| 6 | APH 2024-27 PDF | `https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf` | 25 Oct 2026 | Table 1.4, Clauses 1.12, 2.21, 2.25, 4.10, 6.46, 7.7 | High (official) |
| 7 | APH 2026-27 Addendum | `https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52940/AICTE-issued-the-Corrigendum-regarding-the-Approval-Process-2026-27-February202026.pdf` | 25 Oct 2026 | 50% concession, leased multiplier, 6.46/RPGF, 2.25(f) | High for content; latest-version status `[UNVERIFIED]` |
| 8 | PIB APAAR factsheet | `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281148` | 25 Oct 2026 | 26.35 crore verified APAAR IDs as of 2 Jul 2026 | High |
| 9 | PIB APAAR PDF | `https://static.pib.gov.in/WriteReadData/specificdocs/documents/2026/jul/doc202675912501.pdf` | 25 Oct 2026 | APAAR/ABC details | High |
| 10 | APAAR portal | `https://apaar.education.gov.in/` | 25 Oct 2026 | 33.74 crore registered | High for page text; counting method `[UNVERIFIED]` |
| 11 | ABC portal | `https://www.abc.gov.in/` | 25 Oct 2026 | APAAR/ABC/DigiLocker flow | High |
| 12 | DScE SIH portal | `https://sih.dsce.in/sih/problem-statements` | 25 Oct 2026 | Team-slot availability per PS | High for DScE page; not a national count |
| 13 | GitHub search API | `https://api.github.com/search/repositories?q=SIH26261+OR+SIH26262+OR+SIH26263+OR+SIH26264+OR+SIH26265` | 25 Oct 2026 | 31 PS-specific repos | High |
| 14 | GitHub repo pages | Individual repo URLs in `opponent.md` | 25 Oct 2026 | READMEs, code stats, live demos | High for what is public |
| 15 | Live demo URLs | See `opponent.md` | 25 Oct 2026 | HTTP status checks | High for status; not full QA |
| 16 | LinkedIn searches | Queries in `opponent.md` | 25 Oct 2026 | Negative-result search | High for search performed; absence of evidence is not proof |
| 17 | PIB factsheet, posted 12 Aug 2026 | `https://www.pib.gov.in/FactsheetDetails.aspx?ModuleId=16&NoteId=150840&id=150840&lang=1&reg=6` | 25 Oct 2026 | >33.74 crore APAAR IDs generated by June 2026 | High for page text; definition differs from “verified” |
| 18 | AICTE Approval Process 2026-2027 page | `https://aicte.gov.in/approal-process-2026-2027` | 25 Oct 2026 | Lists “Release of FDR / Security Deposit Upon Completion of Maturity Period -reg” circular | `[UNVERIFIED]`; page indexed, direct fetch 404 |
| 19 | AICTE addendum official path | `https://aicte.gov.in/downloads/aph/Final%20Addendum%202026-27.pdf` | 25 Oct 2026 | Search snippet confirms Items 10, 11, 28, 36–37 | `[UNVERIFIED]`; direct fetch 404 |
| 20 | AICTE FDR release circular page | `https://aicte.gov.in/node/3299` | 25 Oct 2026 | Circular title and PDF link | `[UNVERIFIED]`; direct fetch 404 |
| 21 | Scribd copy of FDR circular | `https://www.scribd.com/document/974568476/Circular-FDR-List-Institutions-completion-of-Maturity-Period-Not-Applied-on-Portal` | 25 Oct 2026 | Secondary summary: matured FDRs need portal application; legal/compliance issues block release | `[UNVERIFIED]`; JS challenge, not independently read |
| 22 | APH 2022-23 official PDF | `https://www.aicte.gov.in/sites/default/files/Approval%20Process%20Handbook%2022-23.pdf` | 25 Oct 2026 | Title-page “Legal Document” language; older edition | High for title page; not the 2024-27 edition |

**Research notes (supporting, not authoritative for AICTE policy)**

- No direct peer-reviewed paper specifically on AICTE security-deposit/FDR portals was found on 25 Oct 2026.
- IJSRA 2026, “Intelligent regulatory monitoring and audit trail information systems for enterprise risk and compliance management” (`https://ijsra.net/sites/default/files/fulltext_pdf/IJSRA-2026-1165.pdf`) — design-science framing for AI/process-mining/blockchain audit; use as design rationale, not AICTE fact.
- Springer 2001, “Workflow Automation: Overview and Research Issues” (`https://link.springer.com/article/10.1023/A:1011457324641`) — lifecycle/state-machine background.
- eGSSM 2011, “E-Government System Security Model” (`https://www.computer.org/csdl/proceedings-article/passat-socialcom/2011/06113295/12OmNCeaPWI`) — e-government security/risk framing.
- NIST hash chain (`https://csrc.nist.gov/glossary/term/hash_chain`) and NISTIR 8387 (`https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf`) — tamper-evident audit/evidence preservation.
- IAPP RegTech Report 2026 (`https://iapp.org/resources/article/reg-tech-report`) — compliance-automation context.
- US8510216B2 (`https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/8510216`) — financial-instrument/maturity management patent, not peer-reviewed.

**Known source limitations**

- Official `sih.gov.in` was down at retrieval; the Zaid mirror is a secondary source that reproduces official text. Treat it as high-confidence but not primary.
- Official idea counts cannot be verified live; the 25 Oct screenshot and 23 Oct mirror are snapshots.
- The 2026-27 addendum was retrieved from a CDN copy; the official AICTE URLs returned 404. The content is official-looking and matches search snippets, but the exact identity with the official file and “latest version” status are `[UNVERIFIED]`.
- AICTE’s 2026-27 page, addendum PDF, and FDR-release circular are indexed by search but returned 404 to our fetcher. The circular’s content is known only from a secondary summary; get the PDF before quoting it.
- No direct academic paper on AICTE FDR/security-deposit portals was found; the research notes are supporting literature only.
- APAAR “verified,” “registered,” and “generated” are different labels and may use different counting methods. Do not mix them; cite one with its date.
- Bank/APAAR/DigiLocker integration availability is not confirmed; assume MoU-gated and simulate.

---

## 10. Open questions and assumptions

1. **Final PS choice** — LOCKED: SIH26265 (Boss, 25 Oct 2026). Keep 26262 as fallback only.
2. **Team composition** — how many builders, who presents, who owns PPT/design? The 36-hour plan assumes 3 builders + 1 presenter/QA.
3. **Team skills** — React/TypeScript, Python/FastAPI or Node, Postgres, OCR, UI design. If the team is stronger in Node, switch the backend plan to Node/Express + SQLite/Postgres; the architecture is the same.
4. **Idea count freshness** — if the Boss has a 26/27 Oct screenshot, update the counts in the PPT. Do not use stale counts in the final submission.
5. **Official SIH rubric** — not published/verified; the PPT outline follows typical SIH dimensions. Label as inferred if asked.
6. **Bank integration** — no confirmed API access. The prototype must use a labelled sandbox.
7. **AICTE complaint data** — no confirmed API. Use a mock complaint service with a clear adapter contract.
8. **Policy legal review** — the team is not AICTE’s legal counsel. The prototype encodes public APH text; any real deployment needs AICTE sign-off. Say this in the PPT footnote.
9. **Addendum effective date** — the PDF is titled 2026-27; we did not verify the exact publication date from the official site. Cite it as “Addendum/Corrigendum 2026-27” and show the PDF.
10. **Trademark/name** — “SURAKSHA” is a placeholder; check for conflicts before using it in the final PPT.
11. **Official FDR circular** — obtain the PDF from AICTE before quoting its exact instructions; currently only the search-index title and a secondary summary are available.
12. **`enhancement.md` policy audit** — anti-gravity’s reuse plan has strong ideas but some clause labels are wrong (Clause 2.21 is closure, not joint pledge; Clause 4.10 is university SD exemption, not land-lease). Use `26265.md` §4 as the policy source of truth.

---

## 11. Glossary

| Term | Meaning |
|---|---|
| AICTE | All India Council for Technical Education |
| APH | Approval Process Handbook (2024-25 to 2026-27) |
| EoA | Extension of Approval |
| LoA / LoD / LoR | Letter of Approval / Deficiency / Rejection |
| EVC | Expert Visit Committee |
| SAC | Standing Appellate Committee |
| SCSC | Standing Complaint Scrutiny Committee |
| SHC | Standing Hearing Committee |
| RB | Regulation Bureau |
| PGRC | Public Grievance Redressal Cell |
| FDR | Fixed Deposit Receipt |
| RPGF | Refundable Performance Guaranty Fund |
| RTGS | Real Time Gross Settlement (online security deposit route) |
| BG | Bank Guarantee |
| TER | Technical Education Regulatory (charges) |
| APAAR | Automated Permanent Academic Account Registry |
| ABC | Academic Bank of Credits |
| NAD | National Academic Depository |
| DPDP | Digital Personal Data Protection Act, 2023 |
| NeSL | National e-Governance Services Limited (e-BG) |
| RBI AA | Reserve Bank of India Account Aggregator framework |
| PFMS | Public Financial Management System |
| CPGRAMS | Centralized Public Grievance Redress and Monitoring System |

---

## 12. Bottom line

- The five PS are real, current, and contested. The GitHub landscape is not empty.
- SIH26265 is the best risk-adjusted choice: fewer strong teams, a bounded build, a real policy moat, and a clear 7-minute story.
- The winning product is not “another FDR portal.” It is a **policy-native control tower**: exact rules, three-way provenance, release eligibility graph, pledge graph, maturity forecast, and a tamper-evident audit.
- The incumbents are strong. We beat them by being more accurate, more explainable, and more demoable — not by claiming more AI.
- **Next action:** Boss signs off on 26265; then `agent_talking.md` task board starts; idea PPT by 28 Oct 2026.
