# 04 — DELIVERY ULTIMATE
## SURAKSHA · SIH26265 · Security Deposit / FDR Control Tower

> **Pack version:** 1.0
> **Owner:** Presenter / Delivery Lead
> **Readers:** all four owners; this is also the pack index.
> **Status:** distribution-ready for the SIH 2026 build.
> **Scope:** SIH 36-hour MVP + 28 Oct idea PPT, not production AICTE deployment.
> **Authority:** policy/schema/API = `01_BACKEND.md`; UX = `02_FRONTEND.md`; fixtures/tests = `03_DATA_QA.md`; narrative/claims/ownership = this file.

---

## 0. Pack index and authority map

This is the only index. There are no extra build files.

| File | Owns | Must read |
|---|---|---|
| `build/01_BACKEND.md` | Policy, schema, API, workflows, audit, integrations | all owners |
| `build/02_FRONTEND.md` | UX, routes, screens, components, client state | all owners |
| `build/03_DATA_QA.md` | Seed, fixtures, tests, acceptance, QA gate | all owners |
| `build/04_DELIVERY.md` | Product, PPT, demo, claims, execution, runbook, ownership | all owners |

**Distribution rule:** give all four files to every teammate, not one file per person. Each teammate owns one file but reads the other three as read-only contracts. If you distribute only one file each, the interfaces will drift.

**Change rule:** any change to an enum, field, endpoint, policy rule, fixture, or claim requires a `CR-###` entry in the owning file and approval from the integrator. No silent changes.

**Truth rule:** if a claim is not in the claim registry in §4, it is not approved for the PPT or jury answers.

---

## 1. What we are building

### 1.1 One line

**SURAKSHA is a policy-native security-deposit control tower that proves every FDR is real, correctly sized, continuously pledged, and safe to release — with every decision traceable to the AICTE Approval Process Handbook.**

### 1.2 SIH context

- Problem statement: **SIH26265 — Streamline of security deposit / FDR portal**.
- Theme: Software / Smart Automation.
- Organisation: AICTE.
- Submission: idea PPT by **28 October 2026**; prototype if shortlisted.
- Team: six members; recommended **5 tech + 1 presenter/QA**.
- Demo: 7 minutes, local, synthetic data, simulated external integrations.

### 1.3 A-to-Z scope

This pack covers:

1. problem and users;
2. policy rules and citations;
3. data model and migrations;
4. backend APIs and workflows;
5. frontend screens and interactions;
6. seed data and edge cases;
7. tests and acceptance;
8. deployment and fallback;
9. PPT and jury answers;
10. ownership and handoff.

It does **not** cover production bank/AICTE APIs, legal sign-off, real money movement, or a production security audit. Those are explicitly out of scope.

### 1.4 Users and jobs

| User | Job | What SURAKSHA gives |
|---|---|---|
| Institution registrar/finance | Submit/renew/release FDR | One window, requirement trace, status, reminders |
| Dealing officer | Verify instruments | Three-way provenance, evidence, queue |
| Director RB | Approve/waive, monitor risk | Portfolio, ₹ at risk, pledge graph, forecast |
| Competent Authority | Approve releases | Eligibility graph, maker-checker, NOC |
| Accounts | Release/refund | Verified decision, NOC/sanction, letter |
| Auditor | Audit actions | Hash chain, verify, export |
| Bank verifier | Confirm FDR/lien | Structured sandbox/letter response |

### 1.5 Why it is not “just CRUD”

A basic portal stores an FDR. SURAKSHA proves:

- the declared amount, document amount, and bank amount agree;
- the requirement is correct under the 2026-27 policy;
- the deposit is continuously pledged;
- release is blocked until the named clearances exist;
- every action is traceable.

**Jury sentence:** “They built portals that store FDRs. We are building the compliance brain that can defend a release.”

---

## 2. Research synthesis — what we used and rejected

### 2.1 Source-to-feature traceability

| Source ID | Source | Cherry-picked into the workflow | Lands in |
|---|---|---|---|
| `SRC-SW-01` | Swetakshi, `existing-official-sites.md` | As-is five-phase lifecycle: creation, 10-year hold, renewal, release, penalties | Backend, Delivery |
| `SRC-SW-02` | Swetakshi | Official sites, roles, regional/bureau flow, gap table | Delivery, Frontend |
| `SRC-SW-03` | Swetakshi | Clause 6.46 release document set and clearance steps | Backend, Data/QA |
| `SRC-SW-04` | Swetakshi | Integration reality and honest `SIMULATED`/`MOCK` labels | Backend, Delivery |
| `SRC-UN-01` | Unnati, `architecture.md` | Multi-body ecosystem map: institution, bank, RO, HQ, PGRC, Vigilance, Grants, university, external oversight | Delivery, Backend |
| `SRC-UN-02` | Unnati | Bank-verification blind spot and paper-file custody risk | Backend, Delivery |
| `SRC-UN-03` | Unnati | Interest leakage and principal-vs-interest separation | Backend, Data/QA |
| `SRC-UN-04` | Unnati | Multi-bureau release paper chase and missing-clearance failure | Backend, Frontend |
| `SRC-UN-05` | Unnati | Data silos, duplicate pledge, lost file, officer liability | Backend, Delivery |
| `SRC-UN-06` | Unnati | As-is → SURAKSHA transition table | Delivery, Frontend |
| `SRC-BOSS-01` | Boss competitor research | Strongest incumbent features: provenance, release workflow, reminders, audit | Backend, Frontend |
| `SRC-BOSS-02` | Boss competitor research | Gaps: illustrative norms, missing 2026-27 addendum, incomplete release graph, no forecast | Delivery |
| `SRC-BOSS-03` | Boss competitor research | “Portal vs control tower” positioning | PPT, Demo |
| `SRC-FR-01` | Friend PDF / `friend research.md` | Four decoupled state dimensions | Backend, Frontend |
| `SRC-FR-02` | Friend PDF | Action Centre for pending actions | Frontend |
| `SRC-FR-03` | Friend PDF | Evidence Passport | Backend, Frontend |
| `SRC-FR-04` | Friend PDF | HTTP 422 blocked-release guard, idempotent alerts, lock ordering, separation of duties | Backend, Data/QA |
| `SRC-ENH-01` | `enhancement.md` | PackParakh evidence-bbox and PDF-memo patterns — patterns only | Frontend, Backend |
| `SRC-ENH-02` | `enhancement.md` | Ekam proposal/confirm gate and offline demo discipline — fresh implementation | Backend, Delivery |
| `SRC-ENH-03` | `enhancement.md` | Bilingual/5-language UI as optional polish, not OCR | Frontend |

### 2.2 What we rejected

| Rejected | Why |
|---|---|
| “500%–1000% amplification” | Opinion; not a result. Removed. |
| “SURAKSHA 75% superior” | Unsupported opinion. Removed. |
| “24-rule engine / 148 tests” | PackParakh has 9 substantive evaluators + 4 placeholders; tests not verified. |
| “Multi-script Indic OCR” | Not verified. UI localization is not OCR. |
| “800+ schemes” | SchemeSaathi seed has 100. |
| “WhatsApp/SMS bridge” | `wa.me` deep link only; no notification service. |
| “EduSphere campus RBAC” | Pitch deck only; no backend. |
| “Ekam hash-chained audit” | Append-only JSONL, not hash-chained. |
| “Clause 2.21 joint pledge” | Clause 2.21 is closure. |
| “Clause 4.10 land lease” | 4.10 is university exemption; leased ×2 is Addendum Item 11. |
| “DTE/anti-ragging/faculty-salary NOC” | Not APH 6.46 nodes. |
| “Trust Chairman + Regional Officer” | Joint deposit wording is Secretary of Trust/Society/Company + AICTE. |
| ₹2,500+ crore / 10,000+ institutions | Estimate, not sourced for this pack; do not use in PPT. |
| “6–24 month release” | Anecdotal; not sourced. |

### 2.3 Policy truth used

- APH 2024-27 Table 1.4: Engineering 15/35/15; Management —/5/15; Computer Applications —/5/15 ₹ lakh.
- 10-year hold; interest retained by AICTE; principal refundable.
- 50% concession: NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only.
- Leased building/land: ×2.
- Penalties: 10%/20% late; 10% early/non-deposit; 10%/50% closure.
- Clause 6.46: documents; PGRC; Vigilance; Grants/other cells; conditional embezzlement NOC; converted-university complaints/disciplinary; progressive-closure/merger no-students certificate; RTGS vs FDR/RPGF routing.
- System checks: provenance/open critical discrepancy, term served, dues/penalties, bank lien.
- Joint FDR: Secretary of Trust/Society/Company + AICTE.

### 2.4 Competitive position

| Generic portal | SURAKSHA |
|---|---|
| Stores FDR metadata | Proves declared vs document vs bank |
| Illustrative norms | Versioned APH + 2026-27 addendum |
| Flat release checklist | Clause 6.46 eligibility graph |
| Reminder emails | Time machine + escalation + renewal lineage |
| Counts | ₹ at risk + maturity forecast |
| Log table | Hash-chained audit + verify |
| Duplicate check | Pledge graph with evidence |
| “Active/expiring” | “Safe to release” |

Do not attack competitors by name in the PPT. Say: “They built strong portals. We are building the compliance brain on top.”

---

## 3. Claim registry

### 3.1 Approved claims

| Claim | Label | Source | Use |
|---|---|---|---|
| Engineering UG base security deposit is ₹35 lakh | `[FACT]` | APH Table 1.4 | PPT, demo |
| Leased building/land doubles the deposit | `[FACT]` | APH Table 1.4 note; Addendum Item 11 | PPT, demo |
| Deposit remains for 10 years; AICTE retains interest | `[FACT]` | APH 1.12(iv) | PPT, demo |
| 50% concession applies to NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only | `[FACT]` | Addendum Item 10 | PPT, demo |
| Release needs PGRC, Vigilance, Grants/other-cell clearances | `[FACT]` | APH 6.46(b) | PPT, demo |
| FDR/RPGF → NOC by Approval Bureau; RTGS → sanction order | `[FACT]` | APH 6.46(c)/(d) | PPT, demo |
| Financial-embezzlement NOC is conditional | `[FACT]` | APH 6.46(e) | PPT |
| Progressive-closure/merger needs no-students certificate; not if matured | `[FACT]` | APH 6.46(h)/(i) | PPT |
| 10%/20% late, 10% early, 10%/50% closure penalties | `[FACT]` | APH 2.25(f), 7.7, 2.21(h)/(i) | PPT |
| Most competitor portals use editable/illustrative norms | `[INFERENCE]` from reviewed repos | `opponent.md` | Differentiation, carefully |
| SURAKSHA’s target is faster verification and release visibility | `[TARGET]` | Prototype plan | Impact slide |

Source IDs for the policy rows: `SRC-APH-01` = APH Table 1.4 + 1.12(iv); `SRC-APH-02` = APH 6.46; `SRC-APH-03` = APH 2.25(f), 7.7, 2.21(h)/(i); `SRC-ADD-01` = Addendum/Corrigendum 2026-27 Items 10, 11, 28, 36–37; `SRC-OPP-01` = `opponent.md`. Full URLs and retrieval dates are in `context.md` §9; quote the clause, not a search snippet.

### 3.2 Quarantined claims

Do not use in PPT or jury answers:

- “500%–1000%.”
- “75% superior.”
- “₹2,500+ crore / 10,000+ institutions.”
- “6–24 months to release.”
- “CAG/CVC will act.”
- “100% enforcement.”
- “Real bank API.”
- “AICTE integrated.”
- “Legally decides.”
- “Blockchain.”
- “Only online applications are accepted” unless official manual is downloaded and verified.

### 3.3 Labels on screen

Every screen must carry:

```text
Synthetic data · Simulated integrations
```

Where relevant:

```text
SANDBOX | MOCK | ESTIMATE | SYSTEM CHECK | OFFICER VERIFIED | BANK CONFIRMED
```

Never label a sandbox result as “bank confirmed” unless an authorized API confirmed it.

---

## 4. Idea PPT — six slides

### Slide 1 — Title

**SURAKSHA**
AICTE Security Deposit Control Tower

- SIH26265 · Software · Smart Automation
- Team name, college, members, roles
- One line: “Prove every FDR is real, correctly sized, continuously pledged, and safe to release.”

**Speaker note:** “We are not building another upload portal. We are building the compliance layer AICTE needs to defend a release.”

### Slide 2 — Problem

**Headline:** An Engineering UG deposit of ₹35–70 lakh sits for 10 years. Release is a paper chase.

- ₹35L base for Engineering UG; ₹70L if leased.
- 10-year hold; interest retained by AICTE.
- Release needs documents + no open critical discrepancy + PGRC + Vigilance + Grants + NOC/sanction.
- 10%/20% late-deposit penalties; 10% early; 10%/50% closure.
- Fragmented records, manual bank letters, spreadsheets, missing clearances.

**Story:** An FDR matures. The institution emails the officer. The officer searches a spreadsheet. The release file misses a PGRC clearance. The case waits.

**Visual:** one lifecycle strip: submit → verify → hold → mature → renew → release, with the missing-clearance red node.

### Slide 3 — Solution

**Headline:** Not another portal. A policy-native control tower.

Five pillars:

1. Policy Pack 2026-27.
2. Three-way provenance.
3. Release eligibility graph.
4. Pledge graph + maturity forecast.
5. Evidence vault + time machine.

**Screenshot:** provenance mismatch or blocked release graph.

**Line:** “Most portals store the FDR. We prove it is real, correctly sized, and safe to release.”

### Slide 4 — Architecture

**Headline:** Explainable by design.

- React/Vite → FastAPI → Postgres.
- Document store with SHA-256 + AES-256-GCM.
- Policy engine with rule trace.
- Release graph with official vs system nodes.
- Adapters: bank sandbox, AICTE import, complaints, DigiLocker, payments.
- Hash-chained audit.

**Visual:** simple boxes; label every external adapter `SIMULATED` or `MOCK`.

**Line:** “The policy engine and audit will be our real code. The external integrations are adapter-ready and labelled simulated.”

### Slide 5 — Impact and differentiation

**Headline:** From counting FDRs to defending releases.

| Measure | Target, not result |
|---|---|
| Verification turnaround | Show median < 1 day in demo |
| Source-verified release records | 100% in demo; bank-confirmed and officer-verified shown separately |
| Renewals before maturity | 100% in demo |
| Release cycle | < 3 days in demo |
| ₹ at risk caught | Show the seeded ₹70L mismatch |
| Policy traceability | 100% of decisions have a clause |

**Differentiation:** “Policy accuracy + release graph + forecast.” No invented percentages.

### Slide 6 — Feasibility and ask

**Headline:** Buildable in 36 hours. Demoable in 7 minutes.

- 5 tech + 1 presenter/QA.
- React/FastAPI/Postgres.
- 36-hour build with cut list.
- Integration path: sandbox now, MoU/API later.
- Security/privacy: RBAC, encryption, audit, masked PII.
- Ask: shortlist us; we will demo the release graph and time machine live.

**Footnote:** “Synthetic data; bank/AICTE/complaint integrations simulated.”

### PPT rules

- One idea per slide.
- No wall of text.
- Cite APH clause on the policy slide.
- Use official PS ID.
- Use the claim registry.
- Do not use “AI-powered” unless you can show the exact AI step.
- Do not use “blockchain.”
- Do not claim production readiness.
- Include a “what is simulated” footnote.

---

## 5. Seven-minute demo script

### Setup

- Local app, seeded `demo_v1`, demo clock `2026-10-25`.
- Start as dealing officer; switch to Director/CA for the critical waiver, then to maker/checker/CA for the release decision.
- Browser zoom set for readability.
- Fallback video ready.
- No live debugging for more than 20 seconds.

### Script

| Time | Screen | Action | Spoken line |
|---:|---|---|---|
| 0:00–0:40 | Portfolio | Show active, ₹ held, ₹ at risk, expiring, pending release | “AICTE holds security deposits for institutions. The question is not where the FDRs are; it is which ones are real, correctly sized, and safe to release.” |
| 0:40–1:40 | Submission | Open SIT; show declared ₹70L; upload/extract FDR | “The institution declares ₹70 lakh. The document says ₹70 lakh. The bank sandbox says ₹35 lakh. The system shows all three.” |
| 1:40–2:30 | Provenance | Highlight amount mismatch; open evidence drawer; show page/bbox; verify with sandbox | “This is not a black-box fraud score. It is a field-level discrepancy with a page, a bounding box, and a bank reference.” |
| 2:30–3:20 | Policy trace | Show 35L → leased ×2 → 70L; switch Northstar → 17.5L; open clause | “This is the 2026-27 addendum. Most portals use illustrative norms. Ours can show why the number is the number.” |
| 3:20–4:10 | Release graph | Open SIT release; show blocked on `PROVENANCE`, PGRC, Vigilance and `TERM_SERVED` | “Four blockers: one critical amount discrepancy, two clearances, and an unserved term. The document set is complete; the release is not safe yet.” |
| 4:10–4:50 | Clearances, term, discrepancy | Clear PGRC and Vigilance; still blocked on `PROVENANCE` + `TERM_SERVED`; advance to 2026-11-01; switch to Director/CA; waive the critical finding with a reason; show `ELIGIBLE` | “Clearances and term are not enough while the amount discrepancy is open. A human resolves it with a reason; the audit keeps the evidence. Only then does the graph turn green.” |
| 4:50–5:30 | Time machine | Release is eligible but not yet decided; advance to 2026-11-15/30; show L2/L3 escalation, renewal lineage, forecast | “The system runs the calendar before the calendar runs the institution.” |
| 5:30–6:10 | Decision | Maker → checker → CA; issue NOC | “Every release is a decision with evidence, not an email trail.” |
| 6:10–6:40 | Pledge graph | Show SIT and Doon sharing number/hash | “This is the fraud you cannot see in a spreadsheet.” |
| 6:40–7:00 | Audit | Verify chain; show valid; export | “Every action is traceable. The jury can click verify.” |

### Fallback

- If the app fails, play a 3-minute recorded video.
- Walk through three screenshots: provenance mismatch, policy trace, blocked release graph.
- Never debug live for more than 20 seconds.
- Keep the same narrative; do not apologize for the prototype.

### Demo QA

- Run twice before the jury.
- Check clock reset.
- Check seed reset.
- Check bank sandbox.
- Check no console errors.
- Check every simulated label is visible.
- Check fallback video plays offline.

---

## 6. Jury Q&A

### Q1. Why not Excel or an ERP?

Excel cannot prove field-level provenance, enforce Clause 6.46 clearances, or produce a tamper-evident audit. An ERP stores records; SURAKSHA enforces the rules and shows evidence.

### Q2. This already exists. Why yours?

Existing tools are strong generic portals. SURAKSHA is built around the AICTE deposit lifecycle: Table 1.4, the 2026-27 concession, the 10-year hold, the 6.46 release graph, and the ₹ at-risk portfolio.

### Q3. Will banks give you APIs?

Not universally. We designed three modes: authorized API, bank letter/officer-recorded verification, and a labelled sandbox. Production access needs an MoU; the prototype is honest about it.

### Q4. Why not blockchain?

A hash-chained audit gives tamper-evidence without consensus overhead. Blockchain could later notarize across organizations, but it is not required for this problem.

### Q5. How do you handle the 2026-27 addendum?

The policy pack is versioned. The calculator applies the 50% concession, doubles for leased building/land, and includes RPGF in release. The policy diff shows base vs addendum.

### Q6. What about interest?

APH says interest is retained by AICTE. We track principal and interest separately and never include interest in the refundable amount.

### Q7. What if the FDR is encashed early?

The periodic bank re-check flags it; the system raises a critical finding and routes a show-cause/penalty review. It does not auto-penalize.

### Q8. How do you prevent one FDR being used twice?

Duplicate instrument number, duplicate file hash, bank verification, and the pledge graph. Critical findings block acceptance/release.

### Q9. How do you handle release when a complaint is pending?

The release graph queries PGRC, Vigilance, Grants, dues, open critical findings, and conditional disciplinary/complaint checks. It blocks and shows the exact missing clearance.

### Q10. What if the bank says “not found”?

Status `NOT_FOUND` or `SOURCE_UNAVAILABLE`; route to manual review. We never auto-reject on a bank non-response.

### Q11. Is this scalable?

Postgres + object storage + async jobs; region/bureau scoping; 10-year records; indexes on institution/instrument/maturity; audit partitioning. The demo is small, the design is not.

### Q12. What is your moat?

The policy pack + release graph + provenance + portfolio forecast + audited evidence. The UI is easy to copy; the regulatory encoding and evidence trail are not.

### Q13. Why will institutions use it?

One window, clear status, fewer queries, reminders, faster release.

### Q14. Why will AICTE use it?

₹ at-risk visibility, release control, audit, workload management, and a defensible decision record.

### Q15. What is simulated?

Bank verification, AICTE approval data, complaints, DigiLocker/eSign, APAAR/ABC (not used), payments, SMS/email. Everything is labelled. The policy engine, workflow, audit, and UI will be real code in the prototype.

### Q16. What about data privacy?

RBAC/ABAC, encrypted documents, masked PII, field-level encryption for account data, audit logs, retention notes. DPDP alignment is a design goal, not a certification claim.

### Q17. What if the institution disputes a finding?

Every finding has evidence and a disposition. The institution responds; the officer can waive with a reason except where role rules prevent it; both are audited.

### Q18. What happens after the 10-year term?

The system computes maturity, checks release eligibility, and routes to NOC/sanction. Extension/forfeiture is a competent-authority decision, not automatic.

### Q19. How is this different from the strongest GitHub repo?

They built a strong portal with provenance and reminders. We are adding the exact 2026-27 policy, the release eligibility graph, the pledge graph, and the maturity forecast. We respect their work; we are building the compliance brain.

### Q20. Can you show it in 5 minutes?

Yes: provenance mismatch → policy trace → release blocked → clearance → waiver → time machine → audit verify.

### Q21. Are you production-ready?

No. This is a SIH prototype with synthetic data and labelled mocks. Production needs AICTE sign-off, bank/API agreements, security audit, and legal review.

### Q22. What is the biggest risk?

Policy ambiguity and integration access. We mitigate with versioned rules, human review for ambiguity, adapter contracts, and labelled simulations.

---

## 7. 36-hour execution plan

### 7.1 Team

Recommended **5 tech + 1 presenter/QA**:

| Owner | Domain | File |
|---|---|---|
| Backend Lead | Core API, DB, policy | `01_BACKEND.md` |
| Backend 2 | Documents, provenance, bank, release | `01_BACKEND.md` |
| Backend 3 | Pledge, forecast, audit, integrations | `01_BACKEND.md` |
| Frontend 1 | Shell, portfolio, submission, policy | `02_FRONTEND.md` |
| Frontend 2 | Provenance, release, time machine, graphs | `02_FRONTEND.md` |
| Presenter/QA | PPT, demo, tests, claims | `03_DATA_QA.md` + this file |

If **4 tech**: one backend owner, one frontend owner, one data/QA, one delivery; backend/frontend owners absorb the shadow work. Keep all four files.

If **6 tech**: add a floater for integration/tests; do not split ownership of a file.

### 7.2 Schedule

| Block | Hours | Owner | Deliverable | Gate |
|---|---:|---|---|---|
| B0 | 0–2 | All | Repo, env, Docker, seed skeleton, auth | app loads; `/health` |
| B1 | 2–8 | Backend 1 | Schema, institutions, policy, requirements | policy matrix green |
| B2 | 8–14 | Backend 1 + 2 | Instruments, documents, provenance, findings | SIT mismatch works |
| B3 | 14–20 | Frontend 1 + 2 | Shell, portfolio, submission, provenance, policy | P0 screens on seed |
| B4 | 20–26 | Backend 2 + 3 | Bank, release graph, clearances, maker-checker | blocked → eligible |
| B5 | 26–30 | Frontend 2 + Backend 3 | Time machine, pledge graph, forecast, audit | demo steps 6–9 |
| B6 | 30–34 | All | End-to-end demo, PPT, video fallback | 7-minute run twice |
| B7 | 34–36 | Auditor + Boss | Audit, security, claims, final deploy | no P0; labels correct |

### 7.3 Cut list

If behind:

1. Pledge graph.
2. Forecast.
3. eSign.
4. BG support.
5. Multi-language.

**Never cut:** policy engine, provenance, release graph, time machine, audit, demo fallback.

### 7.4 Integration checkpoints

- **Hour 8:** policy matrix green; schema stable.
- **Hour 14:** SIT provenance mismatch visible via API.
- **Hour 20:** portfolio + submission + policy screens work.
- **Hour 26:** release graph blocked → eligible.
- **Hour 30:** time machine + audit verify.
- **Hour 34:** full demo twice.
- **Hour 36:** claims/security/final.

No integration checkpoint = no merge.

---

## 8. Ownership, merge, and distribution

### 8.1 Diamond rules

1. All four files are shared with all owners.
2. One owner per file.
3. The integrator approves changes to shared contracts.
4. No one edits another owner’s file.
5. Every change has a `CR-###`.
6. Backend contract is frozen before frontend wiring.
7. Data/QA tests are the referee.
8. Delivery owns the claim registry.
9. No mock data in the final demo if the API exists.
10. No unsourced claim in PPT or UI.

### 8.2 Merge order

```text
Backend schema + enums
  → Backend policy + API
  → Data/QA fixtures + contract tests
  → Frontend API client + P0 screens
  → Release graph + time machine
  → Pledge + forecast
  → PPT/demo/claims
```

### 8.3 Distribution message

Send this with the four files:

```text
SURAKSHA / SIH26265 build pack v1.0

Read all four files. Do not read only your own.
Own one file:
- Backend: build/01_BACKEND.md
- Frontend: build/02_FRONTEND.md
- Data/QA: build/03_DATA_QA.md
- Delivery: build/04_DELIVERY.md

Rules:
- do not invent APIs, fields, enums, policy rules, or claims;
- do not edit another owner's file;
- every mutation/decision needs an audit event;
- every external integration is simulated and labelled;
- no unsourced numbers in PPT/UI;
- no real data or secrets.

First checkpoint: policy matrix + schema.
Second: SIT provenance mismatch.
Third: release graph blocked → eligible.
Demo: 7 minutes, local, synthetic.
```

---

## 9. Deployment and demo runbook

### 9.1 Prerequisites

- Docker Desktop.
- Node 20+.
- Python 3.12+.
- 8 GB RAM.
- No external internet required for the demo.

### 9.2 Backend

```bash
cp .env.example .env
docker compose up -d db
alembic upgrade head
python scripts/seed.py --dataset demo_v1 --reset
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Verify:

```bash
curl http://localhost:8000/api/v1/health
curl http://localhost:8000/api/v1/meta/enums
```

### 9.3 Frontend

```bash
cd frontend
npm ci
npm run build
npm run preview -- --host 0.0.0.0 --port 5173
```

Open `http://localhost:5173`.

### 9.4 Demo reset

```bash
python scripts/seed.py --dataset demo_v1 --reset
```

Reset the browser session and demo clock.

### 9.5 Fallback

- Record a 3-minute video after the first successful full run.
- Store at `demo/fallback.mp4`.
- Test playback offline.
- Keep three screenshots: provenance mismatch, policy trace, blocked release graph.
- If live demo fails: play video, narrate, do not debug.

### 9.6 Submission checklist — 28 Oct 2026

- [ ] PS ID `SIH26265` on every slide.
- [ ] Team details complete.
- [ ] 6 slides, no wall of text.
- [ ] Policy citations present.
- [ ] “Synthetic data / simulated integrations” footnote.
- [ ] Claim registry checked.
- [ ] No 500–1000 / 75% / unsourced numbers.
- [ ] PDF exported and checked on a phone.
- [ ] File name includes team name and PS ID.
- [ ] Submission portal upload confirmed.
- [ ] Screenshot of confirmation saved.

---

## 10. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Policy ambiguity | Medium | High | Versioned packs; clause traces; human review; no invented dates |
| Team merge conflicts | Medium | High | 4-file ownership; frozen contracts; integrator |
| Frontend/backend drift | Medium | High | OpenAPI; Data/QA contract tests |
| Bank/AICTE integration unavailable | High | Medium | Adapter + labelled sandbox |
| 36-hour time slip | High | High | Cut list; 12-hour checkpoint; P0 only |
| Demo failure | Medium | High | Video fallback; local-first; no live debug |
| Unsourced claim in PPT | Medium | High | Claim registry; delivery review |
| Security/PII issue | Low | High | Synthetic data; RBAC; encryption; masked logs |
| Overbuilding | High | High | Freeze scope; defer P1/P2 if needed |
| Agent invents a file/contract | Medium | High | Diamond rules; handoff prompt; consistency gate |

### 10.1 Decision log

- 25 Oct 2026: SIH26265 locked by Boss.
- 25 Oct 2026: 26-doc plan collapsed to 4 ultimate files by Boss.
- 25 Oct 2026: policy truth remains `context.md` §4 / `26265.md` §4.
- 26 Oct 2026: build pack created for distribution.
- Open: exact addendum effective date; official FDR circular PDF; production API access.

---

## 11. Local Antigravity handoff

`agent_talking.md` is local and gitignored. Do not push it. Use it to keep Antigravity informed.

After each milestone, append:

```text
FROM: OpenCode
TO: Antigravity
TASK ID: T3.x
STATUS: DONE | REVIEW | BLOCKED
WHAT I DID:
- ...
FILES CHANGED:
- build/0x_...
EVIDENCE:
- command/test/screenshot
DECISIONS MADE:
- ...
WHAT I NEED FROM YOU:
- review 01_BACKEND §3/§6, 02_FRONTEND §7, 03_DATA_QA §5, 04_DELIVERY §3
NEXT OWNER / NEXT ACTION:
- ...
```

Required reviews:

- Antigravity reviews policy/release/claim sections.
- Backend reviews frontend API usage.
- Data/QA reviews acceptance.
- Delivery reviews PPT/claims.
- Boss approves distribution.

---

## 12. Final A-to-Z checklist

Before distributing tomorrow:

- [ ] All four files exist and are readable.
- [ ] No file is a stub; each has authority, contracts, code tree, acceptance, handoff.
- [ ] Enums match across backend/frontend/data.
- [ ] API paths and response shapes match.
- [ ] Schema fields match frontend types and fixtures.
- [ ] Policy rules match claim registry.
- [ ] SIT/Northstar/Doon fixtures produce expected outputs.
- [ ] Release graph blocks and clears correctly.
- [ ] Audit chain validates; tamper test fails correctly.
- [ ] Every screen has loading/empty/error/forbidden/simulated states.
- [ ] Every graph has a list fallback.
- [ ] Every external source is labelled.
- [ ] README links to the four files and no stale 500%–1000% claim.
- [ ] `agent_talking.md` stays local.
- [ ] `competitor/` clones/node_modules are not committed.
- [ ] PPT claims are sourced.
- [ ] Demo script is 7 minutes and has fallback.
- [ ] Distribution message is ready.
- [ ] Team knows: read all four; own one.
- [ ] Boss gives the final go.

---

*End of delivery contract. This file owns the narrative, claims, demo, execution, and runbook. It does not own policy, schema, API, UX, fixtures, or tests.*
