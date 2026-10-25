# Existing Official Sites and Current System — SIH26265 (Security Deposit / FDR Portal)

## Document control

| Field | Value |
|---|---|
| Version | 1.1 |
| Prepared | 25 Oct 2026 |
| Related PS | SIH26265 — Streamline of security deposit / FDR portal |
| Organisation | AICTE |
| Truth labels | [FACT] / [INFERENCE] / [UNVERIFIED] / [OPINION] |

---

## 1. Existing official sites related to security deposits / FDRs

This section lists every official AICTE/SIH site/document that governs or touches the security deposit / FDR lifecycle. For each, it explains what the site is, how it works operationally, and its relevance to SIH26265.

### 1.1 AICTE official website — aicte.gov.in

| Field | Detail |
|---|---|
| URL | `https://aicte.gov.in` |
| Status | `[FACT]` — official AICTE portal |
| Role | Primary public website of the All India Council for Technical Education. Hosts approval-process pages, circulars, downloads, notices, the Approval Process Handbook (APH), and bureau/contact details. |

**How it works operationally:**
- The site is organized by **Bureaus** (Approval, Regulation, etc.) and by academic year (Approval Process 2024-25, 2025-26, 2026-27).
- Each year's section contains: the APH PDF, Addendum/Corrigendum, public notices, academic calendar, user manuals, guidelines, and a helpdesk phone/email.
- Institutions use it to find: which application group they belong to (GROUP-1/2/3), when the portal opens, where to download the APH, and which circulars apply to security deposits / FDR release.
- The home page "Latest News" feed publishes time-bound circulars — e.g., the "Release of FDR / Security Deposit Upon Completion of Maturity Period -reg" circular was listed here (6 October 2025).

**Relevance to SIH26265:** Source of the APH 2024-27, the 2026-27 Addendum/Corrigendum, and the index page for the FDR/security deposit release circular. Any prototype must cite the rules published here.

### 1.2 AICTE Approval Process 2026-2027 page

| Field | Detail |
|---|---|
| URL | `https://aicte.gov.in/approal-process-2026-2027` (note: typo "approal" on the live site) |
| Status | `[UNVERIFIED]` — indexed by search; direct fetch returned 404 on 25 Oct 2026 |
| Role | The year-specific landing page for the 2026-27 approval cycle. Lists all downloadable documents and live announcements for that year. |

**How it works operationally:**
- Lists links grouped by function: APH and Guidelines, Addendum/Corrigendum, Public Notice, Academic Calendar, Steps to Download Application Reports/Affidavits, user manuals.
- Shows **group-wise portal enablement dates** (e.g., "Approval process portal for GROUP-3 institutions enabled from 14th Dec 2024").
- Announces when institution login credentials are temporarily disabled (e.g., after TER payment) and when documents can be uploaded.
- Provides the helpdesk number (011-2958-1333, 1342, 1338, 10 am–9 pm Mon–Fri) that institutions call for portal/security-deposit issues.

**Relevance to SIH26265:** This is where an institution would learn the 2026-27 security-deposit deadlines and download the current Addendum/Corrigendum. The prototype's integration path starts here (CSV/JSON import of approval data).

### 1.3 AICTE node/3299 — circular index page

| Field | Detail |
|---|---|
| URL | `https://aicte.gov.in/node/3299` |
| Status | `[UNVERIFIED]` — indexed by search; direct fetch returned 404 on 25 Oct 2026 |
| Role | A Drupal node page that indexes and links to a specific circular. In this case: "Release of FDR / Security Deposit Upon Completion of Maturity Period -reg". |

**How it works operationally:**
- AICTE publishes circulars as Drupal nodes, each with a title, submission date, submitter (e.g., "aicteadmin"), and a direct PDF file link under `sites/default/files/...`.
- node/3299 links to `Circular_FDR_List_Institutions_completion%20of%20maturity%20period_%20not%20applied%20on%20portal.pdf`.
- Institutions discover these circulars via the home-page Latest News feed or by browsing the Approval Bureau section.

**Relevance to SIH26265:** Confirms there is an official circular governing matured-FDR release. The circular's content (per secondary Scribd summary, `[UNVERIFIED]`): institutions with matured FDRs must apply through the AICTE portal, and legal/compliance issues block release until resolved. This is the core pain point the PS describes.

### 1.4 AICTE Approval Process Handbook 2024-25 to 2026-27 (APH)

| Field | Detail |
|---|---|
| URL | `https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf` |
| Status | `[FACT]` — retrieved 25 Oct 2026; ~14,735 lines of extracted text |
| Role | AICTE's official rulebook for approval, compliance, and security deposits. Cover states: "This Handbook is a Legal Document as per All India Council for Technical Education Act, 1987 (52 of 1987)." |

**How it works operationally (security-deposit-specific clauses):**

**Clause 1.12 — Creation of security deposit:**
- Applicants for starting new technical institutions (other than Government/Government-aided), recommended for LoA by the Executive Committee, are informed to create the security deposit per APH.
- Existing institutions in existence >5 years with respective regulatory bodies are exempt (1.12(i)).
- Applicants under Clause 1.5.2 create the deposit for the balance amount (1.12(ii)).
- A deposit created earlier covers the remaining period of 10 years; no new deposit where an NOC was already issued for release of the earlier FDR (1.12(iii)).
- Amount stays with the Council for 10 years; interest accumulated is retained and utilized by the Council (1.12(iv)).
- Principal is returned to the Trust/Society/Company on completion of term; term may be extended case-by-case and/or forfeited for violation/non-performance/complaints (1.12(v)).

**Table 1.4 — Security Deposit amounts (₹ lakh):**

| Programme | Diploma/Post Diploma | Under Graduate | PG Diploma/PG Degree |
|---|---:|---:|---:|
| Engineering and Technology | 15 | 35 | 15 |
| Planning | 15 | 15 | 15 |
| Applied Arts and Crafts | 15 | 15 | 15 |
| Design | 15 | 15 | 15 |
| Hotel Management and Catering Technology | 15 | 15 | 15 |
| Computer Applications (BCA, MCA, etc.) | — | 5 | 15 |
| Management (BBA, MBA, etc.) | — | 5 | 15 |

- Note: amount is **DOUBLE in case of leased building / land** (base APH; addendum removes "private").
- Clause 2.3.2 (now 2.12 per addendum): applicants deposit the prescribed amount; payment proof + Affidavit 3 within 15 days of intimation; else 10% (up to 31 May) / 20% (up to 31 July) penalty; beyond that, approval withdrawn (Clause 2.25(f)).

**Clause 4.10 — University exemptions:**
- Central/State/Government Deemed Universities: not required to pay (4.10(a)).
- Private/Deemed Universities >10 years with UGC: exempt; otherwise pay per Table 1.4 for 10 years (4.10(b)).
- University starting a new Programme/Level: must create deposit even if >10 years with UGC (4.10(c)).

**Clause 6.46 — Release of Security Deposit/FDR/RTGS (operational procedure):**
- **Step 1 — Institution submits on AICTE Web-Portal:**
  - (i) Application/request letter for FDR/RTGS release;
  - (ii) Affidavit 6 (standard format) with Institution details, Trust/Society/Company name, FDR/RTGS details;
  - (iii) Copy of the FDR to be released; RPGF corpus fund proof; copies of Demand Draft (if any) submitted for RPGF / online payment proof for the security deposit;
  - (iv) Copy of the latest LoA/EoA.
- **Step 2 — Regional Office verification:** Regional Office verifies and forwards to the Approval Bureau, Grievance Redressal Cell (GRC/PGRC), and Vigilance Cell for clearance.
- **Step 3 — Clearances required:** PGRC, Vigilance Cell, and Other Cells/Bureaus (Grants released to the Institutions) must clear (6.46(b)).
- **Step 4 — Outcome:**
  - For FDR/RPGF: after all clearances, the Approval Bureau issues an **NOC** (6.46(c)).
  - For RTGS: the Council issues a **sanction order** (6.46(d)).
- **Step 5 — Blocks:** financial embezzlement with Government bodies/banks → no release until NOC from that body (6.46(e)); violation of norms → penal action (6.46(f)); converted universities → no pending complaints/disciplinary proceedings (6.46(g)); progressive closure → "no students" certificate from affiliating University/Board, not needed if already matured (6.46(h)); merger → same certificate for child institution (6.46(i)).
- **Rule:** Only online applications are accepted for release; status is viewed through the portal.

**Clause 7.7 — Early encashment / non-deposit penalty:**
- FDRs encashed before maturity, or required deposit not made at LoA → 10% of FDR value penalty; institution must still create the FDR per APH rules.

**Clause 2.21(h)/(i) — Closure release penalties:**
- Closure application processed: 10% of security deposit before release (2.21(h)).
- No EoA application for preceding 6 years and AICTE closes it: 50% of security deposit before release (2.21(i)).

**Relevance to SIH26265:** This is the single most important source document. The entire policy engine (M3) and release graph (M6) are built by encoding these clauses with citations.

### 1.5 Addendum/Corrigendum 2026-27 of APH 2024-27

| Field | Detail |
|---|---|
| URL (CDN copy) | `https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52940/AICTE-issued-the-Corrigendum-regarding-the-Approval-Process-2026-27-February202026.pdf` |
| URL (official, 404) | `https://aicte.gov.in/downloads/aph/Final%20Addendum%202026-27.pdf` and `_V2.pdf` |
| Status | `[FACT]` for content; `[UNVERIFIED]` for exact identity with official file / latest-version; 21 pages |
| Role | A 21-page amendment that changes specific APH clauses without replacing the handbook. Effective for the 2026-27 cycle. |

**How it works operationally (key items for SIH26265):**

- **Item 10 (Clause 1.12 / Table 1.4):** Security Deposit for New Institutions established / Existing institutions applying for New Level / New Programme in North Eastern States / Jammu & Kashmir / Ladakh / Aspirational Districts / Andaman & Nicobar / Lakshadweep / only Women Institutions / Institutions only for PwD shall be **50%** of Table 1.4.
- **Item 11 (Table 1.4 note):** Deposit amount is **DOUBLE in case of leased building / land** (removes the word "private" from base APH).
- **Item 28 (Clause 2.25(f)):** Confirms 10%/20% late-deposit penalty up to 31 May / 31 July, approval withdrawn beyond; changes cross-reference from Clause 2.3.2 to Clause 2.12.
- **Items 36–37 (Clause 6.46):** Heading becomes **"Release of Security Deposit/FDR/RTGS"**; application/Affidavit 6 language expanded to **"Security Deposit/FDR/RTGS/RPGF (wherever applicable)"**.

**Operational impact:** The requirement calculator must select the right rule pack by effective date. An institution in a concession location with a leased building gets 50% then ×2 (net = base), not just a single lookup. The release workflow must accept RPGF alongside FDR/RTGS.

**Relevance to SIH26265:** This is the "policy moat" — most competitors encode only the base APH table as editable/illustrative norms. Encoding the addendum precisely with clause citations and effective dates is a differentiator.

### 1.6 FDR / Security Deposit release circular (official PDF)

| Field | Detail |
|---|---|
| URL | `https://aicte.gov.in/sites/default/files/Circular_FDR_List_Institutions_completion%20of%20maturity%20period_%20not%20applied%20on%20portal.pdf` |
| Status | `[UNVERIFIED]` — returned 404 to fetcher on 25 Oct 2026; do not quote as verified until downloaded |
| Role | Circular titled "Release of FDR / Security Deposit Upon Completion of Maturity Period -reg", indexed on node/3299 (listed ~6 Oct 2025 / submitted 25 Oct 2025). |

**How it works operationally (per secondary Scribd summary, `[UNVERIFIED]`):**
- Institutions whose FDRs have reached maturity must apply for release through the AICTE portal.
- Release is not automatic; legal/compliance issues block release until resolved.
- The circular likely lists institutions whose maturity period is complete but who have not applied on the portal.

**Relevance to SIH26265:** Directly supports the PS pain point — matured deposits sit unreleased because institutions don't apply, and compliance issues block release. The prototype's maturity tracking + release workflow (M5, M6) addresses this.

### 1.7 AICTE web-portal for institutions — www.aicte-india.org / facilities.aicte-india.org

| Field | Detail |
|---|---|
| URL | `www.aicte-india.org` (institution login); `https://facilities.aicte-india.org` (approval portal facilities) |
| Status | `[INFERENCE]` — referenced in official user manuals and search snippets |
| Role | The transactional portal where institutions log in, submit applications, pay TER charges and security deposits, upload documents, and track status. |

**How the security deposit payment works operationally (per "Simple Steps for Making Security Deposit through Online" + user manual snippets):**

**Step 1 — Login:** Institution opens the AICTE web-portal and logs in with institution credentials.
**Step 2 — Open application:** Under the institution's login, open the relevant year's application under the 'New/Extension Approval' screen.
**Step 3 — Security deposit:** The system shows the prescribed security deposit amount (per Table 1.4 + modifiers). The institution pays via the integrated payment gateway.
**Step 4 — Payment proof + Affidavit 3:** Within 15 days of intimation, the institution submits payment proof and Affidavit 3. Failure → 10% (up to 31 May) / 20% (up to 31 July) penalty; beyond 31 July, approval withdrawn.
**Step 5 — Status tracking:** After payment, the institution clicks "Update Payment Status" to update the sub-status in the portal. Reports are downloadable during the Application Submission Phase.
**Step 6 — Document upload:** Institutions can upload documents at `https://documents.aicte-india.org/`.

**Roles in the flow:**
- **Institution (Trust/Society/Company):** logs in, pays, uploads FDR + affidavits, requests release.
- **Regional Office:** verifies submissions, forwards to Approval Bureau / PGRC / Vigilance Cell.
- **Approval Bureau:** processes release, issues NOC for FDR/RPGF.
- **Council:** issues sanction order for RTGS releases.
- **PGRC / Vigilance Cell / Grants Cell:** give clearances (or block).

**Relevance to SIH26265:** This is the existing "portal" the PS wants streamlined. It handles intake and payment but lacks: three-way provenance, policy-accurate calculation, automated maturity tracking, release eligibility graph, pledge-graph fraud detection, and a tamper-evident audit.

### 1.8 documents.aicte-india.org — document upload portal

| Field | Detail |
|---|---|
| URL | `https://documents.aicte-india.org/` |
| Status | `[INFERENCE]` — referenced on the Approval Process 2026-27 page |
| Role | Dedicated document-upload endpoint for institutions to upload affidavits, FDRs, LoA/EoA, and other prescribed records. |

**How it works operationally:**
- Institutions upload PDF/image documents linked to their application/institution record.
- Documents are associated with the application sub-status; reviewers (Regional Office, Approval Bureau) retrieve them for verification.
- No public-facing verification API is confirmed; access is via institution login.

**Relevance to SIH26265:** The digital document management requirement (PS item 2) maps to this. SURAKSHA's document store (SHA-256, AES-256-GCM, versioning) mirrors this but adds provenance and tamper-evidence.

### 1.9 SIH portal — sih.gov.in

| Field | Detail |
|---|---|
| URL | `https://sih.gov.in` |
| Status | Down at retrieval time on 25 Oct 2026; content sourced via mirror |
| Role | Smart India Hackathon official portal where PS SIH26265 is published and ideas are submitted. |

**How it works operationally:**
- Problem statements are published with ID, title, organisation, theme, category.
- Teams register and submit ideas before the deadline (28 Oct 2026 for this batch).
- National idea counts are displayed per PS (13/500 for SIH26265 on the 25 Oct image).

**Relevance to SIH26265:** The idea-submission channel and deadline source.

### 1.10 SIH problem-statement mirror — zaidsayyed.in

| Field | Detail |
|---|---|
| URL | `https://zaidsayyed.in/tools/sih-problem-statements/sih26265` |
| Status | `[FACT]` — mirror reproduces official SIH text; fetched 25 Oct 2026 |
| Role | Secondary mirror that reproduces the official SIH problem-statement text when sih.gov.in is down. |

**How it works operationally:** Crawls/mirrors the official SIH portal twice daily; provides a stable URL for each PS. Used by teams when the official portal is inaccessible.

**Relevance to SIH26265:** Source of the full official SIH26265 problem statement (users, as-is pain, required capabilities, expected solution).

### 1.11 DScE SIH problem-statements portal

| Field | Detail |
|---|---|
| URL | `https://sih.dsce.in/sih/problem-statements` |
| Status | `[FACT]` — shows "Available: n/8" per PS |
| Role | College-level (Dayananda Sagar College of Engineering) team-slot availability counter, not a national idea count. |

**How it works operationally:** Shows "Available: 6/8" slots for SIH26265 on 25 Oct 2026 — i.e., 6 of 8 internal college team slots remain.

**Relevance to SIH26265:** Internal team-allocation tracking; not a proxy for national competition density.

---

## 2. How the existing system works right now (end-to-end, as-is)

This section walks through the complete security-deposit / FDR lifecycle as it operates today across AICTE's official sites, the institution portal, regional offices, and banks. It is the "before" state that SURAKSHA replaces.

### 2.1 Phase 1 — Deposit creation (at LoA)

1. **Intimation:** AICTE's Approval Bureau intimation tells the institution (Trust/Society/Company) the prescribed security-deposit amount per Table 1.4 + modifiers (concession, leased ×2).
2. **Institution login:** Institution logs into `www.aicte-india.org`, opens its application under 'New/Extension Approval'.
3. **Payment:** Institution pays the security deposit through the portal's payment gateway. TER charges and security deposit may be paid together.
4. **Affidavit 3 + payment proof:** Within 15 days of intimation, the institution submits payment proof and Affidavit 3.
5. **Penalty if late:** 10% if paid by 31 May; 20% if by 31 July; beyond 31 July, approval is withdrawn (Clause 2.25(f)).
6. **Status update:** Institution clicks "Update Payment Status"; sub-status updates in the portal; reports downloadable.
7. **FDR creation:** Institution creates an FDR (or RTGS / RPGF) in favour of AICTE for the prescribed amount and tenure (10 years).
8. **Exemptions:** Government/aided institutions, universities >5/10 years, and cases with an existing NOC skip this phase.

### 2.2 Phase 2 — Holding period (10 years)

- The deposit amount remains with AICTE for 10 years (Clause 1.12(iv)).
- Interest accumulated is retained by AICTE for institutional development, quality improvement, faculty scholarships (Clause 1.12(iv)).
- Only the principal is returned on completion (Clause 1.12(v)).
- **Today:** There is no automated reminder system. Maturity dates are tracked manually (spreadsheets/letters). No T-90/60/30/15/7/0 reminder ladder. No escalation. No dashboard showing active/expiring/matured counts.

### 2.3 Phase 3 — Renewal / replacement (if needed)

- If the institution wants to continue, it submits a renewed/replacement instrument before maturity.
- **Today:** Change history is incomplete; no renewal lineage (predecessor/successor link); no gap/overlap detection; no automated flag when no renewal instruction is received.

### 2.4 Phase 4 — Release / refund (at maturity or early)

**Trigger:** Institution requests release after the 10-year term (or on closure/merger/progressive closure).

**Operational steps (Clause 6.46):**

1. **Institution submits on AICTE Web-Portal:**
   - (i) Application/request letter for FDR/RTGS release;
   - (ii) Affidavit 6 with Institution/Trust/Society/Company details and FDR/RTGIS details;
   - (iii) Copy of the FDR to be released; RPGF corpus proof; DD copies / online payment proof;
   - (iv) Copy of latest LoA/EoA.
2. **Regional Office verification:** RO verifies the documents and forwards to Approval Bureau, PGRC/GRC, and Vigilance Cell.
3. **Clearances (all required):**
   - PGRC clearance (grievance cell).
   - Vigilance Cell clearance.
   - Other Cells/Bureaus (Grants released to the Institutions) clearance.
4. **Outcome:**
   - FDR/RPGF → Approval Bureau issues **NOC**.
   - RTGS → Council issues **sanction order**.
5. **Blocks:**
   - Financial embezzlement with Government bodies/banks → no release until NOC from that body (6.46(e)).
   - Converted university → no pending complaints/disciplinary proceedings (6.46(g)).
   - Progressive closure / merger → "no students" certificate from affiliating University/Board; not needed if deposit already matured (6.46(h)/(i)).
   - Closure penalty: 10% (2.21(h)) or 50% if no EoA for 6 years (2.21(i)).
6. **Refund:** Principal returned to Trust/Society/Company; interest retained by AICTE.

**Today's problems in this phase:**
- Release is not automatic; institutions must apply and chase clearances.
- No release eligibility graph — officers don't see at a glance which clearance is missing.
- No maker-checker-approver segregation; no NOC/sanction tracking.
- No distinction between institution-submitted vs. bank-confirmed data.
- No tamper-evident audit of who cleared what and when.

### 2.5 Phase 5 — Penalties and enforcement

| Situation | Penalty | Clause | How applied today |
|---|---|---|---|
| Late deposit up to 31 May | 10% of deposit | 2.25(f) | Manual calculation; applied at approval stage |
| Late deposit up to 31 July | 20% of deposit | 2.25(f) | Manual calculation |
| Beyond 31 July | Approval withdrawn | 2.25(f) | Manual decision |
| FDR encashed before maturity / not deposited at LoA | 10% of FDR value | 7.7 | Manual detection; no bank re-check |
| Closure release | 10% of deposit | 2.21(h) | Manual |
| No EoA for 6 years + AICTE closes | 50% of deposit | 2.21(i) | Manual |
| Extension / forfeiture | Competent-authority discretion | 1.12(v) | Manual, case-by-case |

**Today:** Penalties are calculated manually, not system-enforced. There is no periodic bank re-check (every 30 days) to detect post-acceptance encashment.

### 2.6 Roles and who does what today

| Actor | Responsibility in current system |
|---|---|
| Institution / Trust / Society / Company | Pays deposit, uploads FDR + affidavits, requests release, follows up by email/letter |
| Regional Office | Verifies submissions, forwards to bureaus/cells |
| Approval Bureau | Processes release; issues NOC for FDR/RPGF |
| Council | Issues sanction order for RTGS |
| PGRC / Grievance Redressal Cell | Gives clearance for release; handles complaints |
| Vigilance Cell | Gives clearance for release |
| Grants Cell / Other Bureaus | Clearance on grants released to institution |
| Accounts | Processes refund; issues release letter |
| Bank | Issues FDR; (no confirmed API) verifies on request via letter |
| Competent Authority | Approves releases; discretion on extension/forfeiture |

---

## 3. Gaps in the existing system (current state → gap)

| Area | Current state (as-is) | Gap / what's missing |
|---|---|---|
| Records | Fragmented, institution-wise, manual spreadsheets/letters | No single source of truth; no accurate up-to-date portfolio view |
| Verification | Ad-hoc bank letters; no distinction submitted vs. bank-confirmed | No three-way provenance (declared vs. document vs. bank) |
| Validity/maturity tracking | Manual; no systematic reminders | No automated expiry/renewal tracking; no overdue flags; no T-90/60/30/15/7/0 ladder |
| Renewal/replacement | Manual; incomplete change history | No renewal lineage; no gap/overlap detection |
| Release/refund | Manual correspondence; competent-authority authorization | No release eligibility graph; no maker-checker-approver; no NOC/sanction tracking; no blocker visibility |
| Alerts/escalation | Manual follow-up; email/letters | No escalation levels (L1/L2/L3); no auto-resolve |
| Dashboard/reports | No centralized dashboard | No active/expiring/matured/renewed/released/pending counts; no automated reports |
| Audit trail | Not systematic; no hash chain | No tamper-evident audit; no RBAC; no secure encrypted document storage |
| Policy rules | Base APH table used as "illustrative/editable" norms | No versioned APH + 2026-27 addendum rule pack; no 50% concession; no leased ×2; no RPGF in release |
| Penalty engine | Manual calculation | No system-enforced 10%/20%/10%/50% penalties; no bank re-check for encashment |
| Fraud detection | None systematic | No duplicate-instrument/hash/account detection across institutions |
| Portfolio forecast | None | No ₹ maturity forecast by quarter; no at-risk amount; no concentration view |

---

## 4. Integration reality (what exists vs. honest prototype scope)

| Domain | Real integration path | Honest prototype scope (36h) | Demo label |
|---|---|---|---|
| Bank FDR verification | Bank API / NeSL e-BG / RBI Account Aggregator / PFMS / manual bank letter | Sandbox + uploaded bank confirmation + officer-recorded fields | SIMULATED / SANDBOX |
| AICTE approval data | AICTE portal / ICMS (internal) | CSV/JSON import + adapter interface; synthetic seed | MOCK / DESIGN-FOR-INTEGRATION |
| Complaints (PGRC/RB) | CPGRAMS / AICTE CMS | Mock complaint service + adapter contract | MOCK |
| DigiLocker / eSign | DigiLocker Authorized Partner API / CCA eSign | Mock consent/verification + document hash | MOCK |
| Payments/RTGS | PFMS / bank gateway | Payment proof upload + UTR matching; no live transfer | SIMULATED |
| SMS/email | NIC/BSNL/email gateway | Console/email log + adapter | SIMULATED |
| Document upload | documents.aicte-india.org | Local encrypted document store with SHA-256 | DESIGN-FOR-INTEGRATION |

**Jury rule:** Never say "integrated with banks/APAAR/DigiLocker" if simulated. Say "adapter-ready; the prototype uses a labelled sandbox because production access requires an MoU."

---

## 5. Sources

| # | Source | URL | Retrieved | Used for | Confidence |
|---|---|---|---|---|---|
| 1 | AICTE official website | `https://aicte.gov.in` | — | Main AICTE portal, bureau structure | FACT |
| 2 | AICTE Approval Process 2026-2027 page | `https://aicte.gov.in/approal-process-2026-2027` | 25 Oct 2026 | Circular index, group enablement, deadlines | UNVERIFIED (404 on fetch) |
| 3 | AICTE node/3299 | `https://aicte.gov.in/node/3299` | 25 Oct 2026 | FDR release circular index | UNVERIFIED (404 on fetch) |
| 4 | APH 2024-27 PDF | `https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf` | 25 Oct 2026 | Clauses 1.12, 2.21, 2.25, 4.10, 6.46, 7.7; Table 1.4 | FACT (official) |
| 5 | Addendum/Corrigendum 2026-27 | `https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52940/AICTE-issued-the-Corrigendum-regarding-the-Approval-Process-2026-27-February202026.pdf` | 25 Oct 2026 | Items 10, 11, 28, 36–37 | FACT for content; UNVERIFIED for latest-version identity |
| 6 | Addendum/Corrigendum 2026-27 V2 (official) | `https://aicte.gov.in/downloads/aph/Final%20Addendum%202026-27_V2.pdf` | 25 Oct 2026 | Items 10, 11, 28, 36–37 | UNVERIFIED (404 on fetch) |
| 7 | FDR release circular PDF | `https://aicte.gov.in/sites/default/files/Circular_FDR_List_Institutions_completion%20of%20maturity%20period_%20not%20applied%20on%20portal.pdf` | 25 Oct 2026 | Matured FDR release process | UNVERIFIED (404 on fetch) |
| 8 | Security Deposit User Manual | `https://www.aicte-india.org/sites/default/files/approval/2024-25/Security_deposit_user_Manual.pdf` | 25 Oct 2026 (search snippet) | Security deposit payment steps | UNVERIFIED (snippet only) |
| 9 | Simple Steps for Making Security Deposit | `https://www.aicte.gov.in/sites/default/files/Security_Deposit.pdf` | 25 Oct 2026 (search snippet) | Portal login → payment → status update flow | UNVERIFIED (404 on fetch) |
| 10 | APH Final.pdf (alternate mirror) | `https://www.aicte.gov.in/sites/default/files/approval/APH%20Final.pdf` | 25 Oct 2026 | Clause 6.46 release procedure, Affidavit 6 | UNVERIFIED (404 on fetch) |
| 11 | SIH portal | `sih.gov.in` | 25 Oct 2026 | PS publication; idea deadline | Down at retrieval |
| 12 | SIH mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26265` | 25 Oct 2026 | Full official SIH26265 text | FACT (mirror of official) |
| 13 | DScE SIH portal | `https://sih.dsce.in/sih/problem-statements` | 25 Oct 2026 | Team-slot counts | FACT for DScE page; not a national count |
| 14 | documents.aicte-india.org | `https://documents.aicte-india.org/` | 25 Oct 2026 (search snippet) | Institution document upload | UNVERIFIED (snippet only) |
| 15 | facilities.aicte-india.org | `https://facilities.aicte-india.org` | 25 Oct 2026 (search snippet) | Approval portal facilities | UNVERIFIED (snippet only) |

---

## 6. Note on verification

Claims marked `[UNVERIFIED]` were retrieved from search snippets or search-indexed pages that returned 404 on direct fetch on 25 Oct 2026. Before citing them in the PPT or jury answers, download the official document and confirm. Claims marked `[FACT]` were retrieved directly or corroborated by official search-indexed text. Claims marked `[INFERENCE]` are reasoned conclusions, not primary-source claims.
