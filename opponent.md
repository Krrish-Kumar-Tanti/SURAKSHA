# SIH 2026 AICTE — Opponent & Competitive Intelligence

**Document control**

| Field | Value |
|---|---|
| Version | 1.0 |
| Prepared | 25 Oct 2026 |
| Owner | OpenCode (lead researcher) for the Boss |
| Scope | SIH26261–SIH26265 (AICTE, Software, Smart Automation) |
| Companion files | `context.md` (domain facts & winning plan), `agent_talking.md` (handoff protocol) |
| Rule | Public repos are for competitive analysis only. We do not copy code, assets, or private data. We build original code and cite ideas. |

**Truth labels**

- `[FACT]` — observed directly in a public repo, live URL, official page, or API response on 25 Oct 2026.
- `[INFERENCE]` — our reasoned judgement from the observed evidence.
- `[UNVERIFIED]` — plausible but not confirmed; do not put in the PPT as fact.
- `[OPINION]` — strategic judgement.

---

## 1. Headline numbers

- `[FACT]` GitHub API search for `SIH26261 OR SIH26262 OR SIH26263 OR SIH26264 OR SIH26265` returned **31 repositories** on 25 Oct 2026 (sorted by update). Query: `https://api.github.com/search/repositories?q=SIH26261+OR+SIH26262+OR+SIH26263+OR+SIH26264+OR+SIH26265&per_page=100&sort=updated`.
- `[FACT]` Broader searches for `APAAR` and `AICTE` found additional repos. We cloned **30 repos** into `/var/folders/zq/73xp1m952_dc7t8l80ykqtb00000gn/T/opencode/competitors` for README/code inspection.
- `[FACT]` At least **10 live demo URLs returned HTTP 200** on 25 Oct 2026; one repo homepage returned 404. See §7.
- `[INFERENCE]` The repo count is a lower bound on the number of competing teams. Many teams do not publish code, and some repos are placeholders.
- `[INFERENCE]` The strongest teams are full-product teams with tests, role-based access, audit, and a live demo. The weakest are UI-only or empty repos. The jury will see both.

---

## 2. Idea counts and team slots

| PS | Boss image (25 Oct) | Zaid mirror (23 Oct) | DScE slots left (25 Oct) | Read |
|---|---:|---:|---:|---|
| SIH26261 | 17 / 500 | 25 | 3 / 8 | Most contested at DScE; strongest full-product competitors |
| SIH26262 | 15 / 500 | 23 | 7 / 8 | Least taken at DScE; two strong repos |
| SIH26263 | 17 / 500 | 21 | 5 / 8 | Strongest national-quality repos |
| SIH26264 | 25 / 500 | 31 | 4 / 8 | Most national ideas; strong incumbent |
| SIH26265 | 13 / 500 | 15 | 6 / 8 | Fewest national ideas; one strong incumbent + one over-engineered repo |

**Caveats**

- `[FACT]` The Boss image is a 25 Oct 2026 screenshot of the official portal.
- `[FACT]` Zaid Sayyed’s mirror says it counts the official portal twice a day; its snapshot is dated 23 Oct 2026.
- `[FACT]` The DScE portal (`https://sih.dsce.in/sih/problem-statements`) shows “Available: n/8”. This is a college-level team-slot counter, not a national idea count.
- `[INFERENCE]` 26261 is the most contested at DScE (only 3 of 8 slots left), which matches its strong repo density. 26262 has 7 of 8 slots left, which makes it the least contested at DScE. 26265 has 6 of 8 slots left and the fewest national ideas, which supports our recommendation.
- `[OPINION]` Do not use these counts as the core of the PPT. Use them only to explain why the field is still forming and why we chose a PS with whitespace. The jury cares about the problem and the demo, not the idea count.

---

## 3. PS-by-PS landscape

### 3.1 SIH26261 — AI-Powered Application Validation, Document Authentication and Regulatory Compliance Verification

**Verdict:** `[OPINION]` Most crowded and highest execution risk. Avoid.

**Repo density:** `[FACT]` At least 13 PS-specific repos, plus broader forensic/AI repos. The top teams already have OCR, ELA, trust scores, issuer-verification adapters, audit, and live demos. `[INFERENCE]` A 36-hour team without a CV/forensics specialist is unlikely to out-execute them.

**Top competitors**

| Repo | Stack / scale | Live demo | What they have | Where they are weak |
|---|---|---|---|---|
| `Adi-ctive/pramaan` | Python/FastAPI + React/Vite; ~14k source lines; 5 tests + Playwright e2e; 21 docs | `https://pramaan-sih26.vercel.app` (200) | Rule packs, PDF text extraction + OCR fallback, six forensic checks, issuer-verification adapters, mock host portals, embeddable widget, human dispositions, audit, evaluation docs, LITE/FULL modes | LITE mode is CPU-only; issuer verification is simulated; rule packs are demo values; no 2026-27 addendum; complex to demo in 7 minutes |
| `aquasimp/SIH26261` | Next.js/React/TS; ~17.3k source lines | `https://aicte-scrutiny.vercel.app` (200) | Forensic workstation UI, ELA, Noiseprint/TruFor/LayoutLMv3/SLANet claims, DPI bridge, deficiency generator, Merkle audit, bilingual UI | Many model claims are likely heuristic/simulated; heavy UI; false-positive risk; no real issuer APIs; no APH addendum; hard to verify depth in 36h |
| `omkardiggi/sih26261-scandoc` | Python/FastAPI + React; ~21.6k source lines; 26 backend tests + Playwright | No live demo found | AES-256-GCM, PDF signature validation (pyHanko), SHA-256, OCR, APH Annexure-1/2 rule seed, evidence links, audit chain, jobs, RBAC, “no fabricated data” discipline | No live demo; Windows-heavy setup; Roboflow key needed for AI; rule pack limited to Annexure-1/2; no 2026-27 addendum |
| `sethupathy03/sih26261-satyapramaan` | JS/React + FastAPI; ~? | `https://sih26261-satyapramaan.vercel.app` (200) | ELA, EXIF, stamp/signature detection, OCR, DigiLocker/APAAR mock, trust score, officer dashboard | Trust-score weights are arbitrary; registries are mocks; happy-path demo; no APH versioning |
| `navyaanubhutii/AICTE-VERITAS` | React/TS + FastAPI; 14 tests | No live demo found | Stage-1 foundation: state machine, SHA-256, RBAC, clarification loop, audit | Explicitly defers OCR, rulebooks, external verification, forgery detection; not a full solution |
| `atharvaiddya/SIH26261` | TypeScript | Not verified | Likely UI/forensic workflow | Not deep-dived; unknown depth |

**Other repos:** `sarthakrajwar06/SIH26261`, `JAbhishek09/PramaanAI-SIH26261`, `Mukhesh-san/eduverify-ai`, `SanjayKrshna2006/Doculens_sih26261`, `saikoushik2108/sih26261`, `vinaysathwik-ai/SIH26261`, `mrudhulakarthikeyan-prog/SIH26261-Evidence-Linked-System`, `ShreyashS1107/datasetSIH26261`, `atharva23x/verigate`, `Dhapoo06/Sih-Team-kratoseyal-prototype`, `Dhapoo06/Sih-Team-kratoseyal-prototype-pdkv`, `fapieex/sih.2`. `[FACT]` A live demo at `https://verigate-app.vercel.app` returned 200; repo mapping not re-verified in this pass. `[FACT]` A live demo at `https://aicte-scrutiny.vercel.app` is `aquasimp/SIH26261`.

**Common pattern:** `[INFERENCE]` OCR + ELA + trust score + dashboard. The strongest teams add evidence links, audit, and mock issuer verification. Almost none encode the APH as a versioned rule pack with clause citations; almost all simulate DigiLocker/APAAR/land records. The jury will see many similar demos.

**How we would beat them (if we chose 26261):** not recommended, but the wedge would be “issuer-verification evidence graph + APH rule versioning,” not another trust score. The build risk is high.

---

### 3.2 SIH26262 — Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System

**Verdict:** `[OPINION]` Viable fallback. Two strong repos, but their rules are demo assumptions, not the full APH stage matrix.

**Repo density:** `[FACT]` At least 7 PS-specific repos; two are serious (`MahatvaGoell`, `saran612`), one is a scaffold (`ApproveDesk`), and several are UI/empty. `[INFERENCE]` Moderate density; a differentiated “APH-native workflow compiler” could win.

**Top competitors**

| Repo | Stack / scale | Live demo | What they have | Where they are weak |
|---|---|---|---|---|
| `MahatvaGoell/aicte-approval-compliance-platform` | React/TS + Node/Fastify + Postgres; Vitest against real Postgres | No live demo found | Versioned policy, workflow stages, obligations, audit, outbox, roles, idempotency, demo assumptions clearly labelled | Rules are `DEMO_ASSUMPTION`, not full APH; no exact stage matrix; EVC scheduling generic; no live demo |
| `saran612/SIH26262` | Python/FastAPI + React/TS + Postgres | No live demo found | Single `obligation` table, deterministic virtual clock, hash-chained audit, regional scoping, human-in-the-loop, `FOR UPDATE SKIP LOCKED` scheduler, MailHog | Rules are demo assumptions; no exact APH stage matrix; complex local setup; no live demo |
| `abhass450-code/ApproveDesk` | Python | No live demo found | Early scaffold for approval workflow | Not a full product yet |
| `shettyvaishnavi1406-oss/AICTE-workflow` | Unknown | No live demo found | README is essentially empty; may be UI-only | No evidence of backend/depth |
| `kartikjograna/SIH26262` | JavaScript | `https://sih-26262.vercel.app` (200) | Live frontend demo | Not deep-dived; likely UI/demo, not full rules |
| `Aditya948351/SIH26262` | Empty | None | Created 25 Oct 2026; no code | Placeholder |
| `Tharun-Kumaran/SIH26262` | TypeScript | None | Small repo | Not deep-dived |
| `fapieex/sih.2` | JavaScript | None | Unknown | Not deep-dived |

**Common pattern:** `[INFERENCE]` A generic workflow/Kanban with configurable stages, SLA timers, and audit. The strongest teams add versioned policy and a virtual clock. Almost none encode the actual APH stage matrix per application category, EVC panel constraints, or the legal consequences of missed undertakings/lease expiry.

**How we would beat them (if we chose 26262):**
1. **APH stage matrix compiler:** encode the actual routes (Only Scrutiny, Scrutiny + EVC, EVC + SAC/SHC, Only EVC, etc.) per application category, with clause citations.
2. **Digital twin:** simulate the approval year, show bottlenecks, and test what-if staffing/EVC scheduling.
3. **EVC scheduler:** panel composition, conflict-of-interest, workload/geography, reminders.
4. **Undertaking/lease register:** conditions, evidence, due dates, expiry, escalation, legal consequence.
5. **Audit:** hash-chained event log; role-based dashboards.
This is a strong fallback, but less visually demoable than 26265’s ₹ story.

---

### 3.3 SIH26263 — APAAR ID-Based Student Data Management and Verification Platform

**Verdict:** `[OPINION]` Most dangerous PS. National-quality full products. Avoid unless the team has a crypto/privacy specialist and a clear graph-fraud wedge.

**Repo density:** `[FACT]` At least 7 strong/related repos, including four full products with tests and live demos. `[INFERENCE]` The hardest field to beat in 36 hours.

**Top competitors**

| Repo | Stack / scale | Live demo | What they have | Where they are weak |
|---|---|---|---|---|
| `Garv1105/APAAR-Based-Student-Enrolment-Integrity-Verifiable-Credential-System` (VidyaPramaan) | Python 3.14/FastAPI + React 19 + Postgres 18 + Neon; ~24.2k source lines; 23 tests | `https://vidyapramaan.vercel.app` (200) | 19 validation codes, seat ledger, deterministic validation, W3C VC 2.0 with official test vectors, Ed25519, Bitstring status list, Postgres RLS, field encryption, consent OTP mock, guardian path, reports, 5 anomaly rules, advisory AI, 12 languages, certificate QR | APAAR/ABC/DigiLocker/AICTE are mocks; no real integration; DPDP not assessed; complex; hard to match in 36h |
| `Soumya-Vinod/apaar-integrity-platform` | React/Vite/TS + FastAPI + Supabase Postgres; ~43.8k source lines; 49 tests | `https://apaar-integrity-platform.vercel.app` (200); API on Render | Seat ledger, upload/validate/commit, exception queue, Integrity Score with Isolation Forest, Blind Match with HMAC Bloom filters + Dice, student portal, provisional ID for non-APAAR, Ed25519 credentials, hash-chained audit, submission windows, API keys, signed webhooks, Realtime, reports; synthetic evaluation with precision/recall 1.00 | Synthetic benchmark; DOB typo limitation; APAAR/ABC simulated; complex |
| `Purva2907/VIDYA-VERIFY` | React/TS + backend? | Not verified | Cross-institution collision engine, quota enforcement, ECDSA/Merkle receipts, 3D holographic UI, DPDPA claims, test suite claims | Style-heavy; claims need verification; likely less depth than Garv/Soumya |
| `DeepakUK17/EduTrace` | React/Vite + Node/Express + Prisma + Postgres; deployment configs for Neon/Render/Vercel | No confirmed live URL | AES-256-CBC APAAR, HMAC tokenization, 8 lifecycle states, intake engine, digital twin, 5-step import, opaque QR verification, AI compliance copilot, 5 roles | HMAC exact duplicate only; no blind fuzzy match; APAAR/ABC simulated; live deployment not confirmed |
| `Mukhesh-san/eduverify-ai` | Python | Not verified | AI educational document verification; may straddle 26261/26263 | Not deep-dived |
| `INCHANTED/sih26263` | HTML | None | Tiny repo | Not a threat |

**Other repos:** `dipanshu-gupta1/apaar-setu`, `sih2026-mitaoe/apaar-student-verification`, `russellsahoo21/SIH2026`. `[FACT]` These were cloned/inspected at a high level; not deep-dived.

**Common pattern:** `[INFERENCE]` Upload CSV/Excel, validate APAAR format, enforce intake caps, detect duplicates, dashboards, consent, credentials. The top two teams already do deterministic validation, seat ledgers, privacy-preserving matching, verifiable credentials, and evaluation. The remaining gaps are real APAAR/ABC integration, legacy/non-APAAR data, graph fraud rings, state-level quota complexity, and legal/DPDP review.

**How we would beat them (if we chose 26263):** not recommended, but the wedge would be an “admission integrity graph” that detects coordinated ghost-enrollment rings and agent-seat fraud, not just duplicates. That is a research-grade differentiator, and the top teams are already close.

---

### 3.4 SIH26264 — Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases

**Verdict:** `[OPINION]` Strong incumbent, narrower differentiation. Third choice.

**Repo density:** `[FACT]` At least 5 PS-specific repos; one is excellent (`Shash1704/aicte-icms`), one is full-stack but has a broken live link (`Adit-K06`), and the rest are UI/unknown. `[INFERENCE]` Moderate density, but the top incumbent is hard to displace.

**Top competitors**

| Repo | Stack / scale | Live demo | What they have | Where they are weak |
|---|---|---|---|---|
| `Shash1704/aicte-icms` | Node/Express + React + SQLite/sql.js; 18 tests | `https://shash1704.github.io/aicte-icms/` (200) | Centralized institution profile, case tracking, fuzzy matching (ID normalization, abbreviation expansion, IDF-weighted soft token, Jaro-Winkler, acronyms, former names, location cues, confidence bands), overlap engine (active cases, RB/PGRC severity, TF-IDF duplicates, same complainant), coordination workflow, SLA, alerts, auto-assignment, SSE, audit, RBAC, static browser demo | No CPGRAMS integration; complaint-to-regulatory-action link absent; privacy limited; some SLA values are demo assumptions |
| `Adit-K06/SIH26264-Complains-Dashboard` | FastAPI + React + Postgres + RapidFuzz + TF-IDF + APScheduler + Docker; ~22k source lines; 17 tests | Repo homepage `https://frontend-chi-khaki-22.vercel.app` returned **404** on 25 Oct 2026 | Synthetic data, SLA placeholders, overlap detection, roles, audit, analytics | Live demo broken; SLA placeholders; AI module may not be fully integrated; coordination workflow less deep than Shash |
| `mrudhulabikkavolu/SIH26264` | JavaScript | `https://caselink-ai-sih26264.vercel.app` (200) | Live demo | Not deep-dived; likely UI/demo |
| `Yogzzz-code/hacknova-sih26264` | Unknown | None | Unknown | Not deep-dived |
| `nooralam08/Abhigyan` | React/TS + Vite + Tailwind | No backend; no live demo found | Overlap detection rules, configurable SLA (14 days demo), role toggle, audit trail, institution directory, charts | Frontend-only; simulated data; no backend; no real matching engine |

**Common pattern:** `[INFERENCE]` Dashboard + case table + overlap alerts. The strongest team adds deterministic fuzzy entity resolution and a coordination workflow. The gaps are complaint-to-regulatory-action linkage, privacy-preserving cross-bureau sharing, CPGRAMS integration, and outcome consistency.

**How we would beat them (if we chose 26264):**
1. **Complaint-to-action graph:** link complaints to approvals, inspections, show-cause, and FDR release decisions (cross-PS).
2. **Privacy-preserving linkage:** hash/minimize complainant PII; role-based need-to-know.
3. **CPGRAMS adapter:** import/export with a clear contract; label simulated.
4. **Outcome consistency:** compare similar complaints and flag inconsistent disposals.
This is possible, but the incumbent’s matching engine is strong and the demo is live. 26265 has a clearer policy moat.

---

### 3.5 SIH26265 — Streamline of Security Deposit / FDR Portal

**Verdict:** `[OPINION]` Best risk-adjusted choice. One excellent incumbent with a clear policy gap; one over-engineered repo; two non-threats.

**Repo density:** `[FACT]` At least 4 PS-specific repos; only 2 are serious. `[INFERENCE]` Lowest strong-competitor density of the five.

**Top competitors**

| Repo | Stack / scale | Live demo | What they have | Where they are weak |
|---|---|---|---|---|
| `Shash1704/aicte-fdr-portal` | Node 22/Express + React + SQLite/sql.js; 9 e2e scenarios; ~? | `https://shash1704.github.io/aicte-fdr-portal/` (200) | Institution/instrument register, three-way provenance (declared/document/bank), OCR, bank sandbox, discrepancy rules, daily monitoring T-90/60/30/15/7/0, overdue every 7 days, L1/L2/L3 escalation, 30-day bank re-check, renewal lineage, release workflow with maker-checker-approver, ICMS complaint check, release letter PDF, dashboard/reports, hash-chained audit, AES-256-GCM, RBAC, time machine, pre-portal baseline metrics | **Requirement norms are illustrative/editable**; no 2026-27 addendum; no 50% concession; no explicit 10-year hold/interest retention/penalty engine; release checklist is good but not the full 6.46 graph; no maturity cash-flow forecast; no pledge graph visual |
| `MR-JK-37/aicte-fdr-portal` | Python/FastAPI + React + Postgres + Keycloak/MinIO/ClamAV; ~81k source lines; 632 backend tests + 29 web tests | No live demo found | 13-role RBAC/ABAC/RLS, SSE, Ed25519 audit checkpoints, release state machine, DB-leased scheduler, reminders, policy registry, draft Table 1.4, blocked penalties, DPIA, load tests, mobile | No live demo; over-engineered; **Table 1.4 draft and penalties BLOCKED**; BG/e-BG disabled; claims “zero simulation” but bank/e-BG not production-enabled; heavy setup; hard to demo in 7 minutes |
| `AryanRao10/vaultguard-sih26265` | Next.js | None | Next.js boilerplate only | No product; not a threat |
| `subhankar235/SIH26265` | Unknown | None | README-only description | No code; not a threat |

**Common pattern:** `[INFERENCE]` Portal + register + reminders + release checklist. The strongest team adds three-way provenance, bank sandbox, renewal lineage, audit, and a time machine. The over-engineered team adds enterprise security but blocks the policy rules and has no live demo.

**The gap we exploit:**
1. **Exact 2026-27 policy:** the addendum’s 50% concession for NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only institutions; double for leased building/land; RPGF in release. Neither top repo encodes this.
2. **Full 6.46 release eligibility graph:** PGRC, Vigilance, Grants, dues, complaints/disciplinary, progressive closure, merger, financial embezzlement, bank lien, RTGS vs FDR/RPGF. Shash1704 has a good checklist but not the full graph; MR-JK-37 blocks the rules.
3. **Maturity cash-flow forecast:** ₹ maturing by quarter, expected renewals/releases, at-risk amount, staffing load. Neither repo has it.
4. **Pledge graph:** one FDR across institutions, same file hash, branch/IFSC anomalies. Shash1704 has duplicate rules; a visual graph is a stronger demo.
5. **Policy diff screen:** base APH vs 2026-27 addendum, with clause citations. This is a jury “wow” moment.
6. **Honest integration labels:** Shash1704 labels its bank sandbox; MR-JK-37 claims “zero simulation” but disables BG/e-BG. We can be the most credible.

---

## 4. Competitor archetypes

| Archetype | Examples | What they look like | How to beat them |
|---|---|---|---|
| Full product with tests + live demo | `Adi-ctive/pramaan`, `Garv1105` VidyaPramaan, `Soumya-Vinod` APAAR Integrity, `Shash1704` ICMS/FDR | Strong README, roles, audit, tests, live URL, synthetic data labels | Exact domain rules, sharper demo, better evidence, honest integration labels |
| Forensic/AI UI with model claims | `aquasimp/SIH26261`, `sethupathy03` SatyaPramaan, `Purva2907` VIDYA-VERIFY | Flashy UI, ELA/heatmaps/trust scores, “AI-powered” claims | Ask for evaluation; show citations and evidence; avoid black-box scores |
| Enterprise overkill, no live demo | `MR-JK-37/aicte-fdr-portal` | Huge codebase, 632 tests, 13 roles, DPIA, runbooks, but no live demo and policy rules blocked | Demo clarity, policy accuracy, 7-minute story |
| Scaffold / UI-only | `ApproveDesk`, `nooralam08/Abhigyan`, `AryanRao10/vaultguard`, `shettyvaishnavi1406-oss/AICTE-workflow` | Frontend or early backend, simulated data, no real workflow | Substance: rules, audit, roles, tests |
| Empty / placeholder | `Aditya948351/SIH26262`, `subhankar235/SIH26265` | Empty or README-only | Ignore; do not let them set the bar |

---

## 5. What the jury will reward and punish

`[INFERENCE]` based on SIH patterns and the repos:

**Reward**

- A working demo, not slides.
- Exact domain rules with citations (APH clauses, addendum, 6.46, penalties).
- Evidence-linked findings, not a black-box score.
- Human-in-the-loop and maker-checker-approver.
- Measurable impact with a baseline and a target, not invented percentages.
- Honest integration labels: “simulated sandbox” vs. “production-ready.”
- Security/privacy: RBAC, encryption, audit, PII masking.
- A clear 7-minute story with one hero case and one edge case.

**Punish**

- “AI-powered” without evaluation.
- “Blockchain” without a verifiable chain.
- “Integrated with banks/APAAR/DigiLocker” when it is a mock.
- Generic dashboards with synthetic data and no rules.
- Auto-approval or auto-penalty without human review.
- Broken live links.
- Overclaiming “zero simulation” while core features are disabled.
- Walls of text on slides.

---

## 6. LinkedIn and social findings

### 6.1 What we searched

`[FACT]` Searches performed on 25 Oct 2026:

- `"SIH26261" LinkedIn`
- `"SIH26265" OR "SIH26264" OR "SIH26263" LinkedIn`
- `"SatyaPramaan" OR "VidyaPramaan" OR "PRAMAAN" AICTE LinkedIn`
- `"Team Varangians" SIH OR "AICTE ICMS" OR "FDR portal" LinkedIn`

### 6.2 What we found

- `[FACT]` No PS-specific LinkedIn profiles or posts for SIH26261–SIH26265 were found.
- `[FACT]` The “PRAMAAN” search returned unrelated companies/projects (`pramaan.io`, `getpramaan.in`, `pramaan.dev`, a Tracxn company profile) and unrelated LinkedIn profiles. None is verifiably the SIH team.
- `[FACT]` The “Team Varangians” search returned an unrelated European company “Varangians” (`linkedin.com/company/varangians-ai`) and unrelated individuals. `Shash1704/aicte-fdr-portal` says “Team Varangians” in its README, but we did not find a verified LinkedIn company/profile for that team.
- `[FACT]` The DScE SIH portal and Zaid pages appear in search results, but not team LinkedIn profiles.

### 6.3 Public GitHub identities (not LinkedIn)

`[FACT]` GitHub API `/users/{login}` on 25 Oct 2026:

| GitHub login | Public name | Public bio/company | LinkedIn found? |
|---|---|---|---|
| `Adi-ctive` | Aditya Bhaty | Perception & simulation for ADAS; autonomous SAE BAJA; CSE (AI/ML) ’27 | No verified LinkedIn in public profile |
| `aquasimp` | — | “Gravity bends light.” | No |
| `atharva23x` | Atharva | — | No |
| `navyaanubhutii` | — | — | No |
| `sethupathy03` | SETHUPATHY V | “Just an ordinary programmer…” | No |
| `omkardiggi` | omkar | — | No |
| `Garv1105` | Garv Kumar Agarwal | Learning enthusiast; extrovert | No |
| `Soumya-Vinod` | Soumya Vinod | — | No |
| `Purva2907` | Purva Patil | Python learner | No |
| `DeepakUK17` | Deepak U K | Karpagam Academy of Higher Education; `deepakuk.me` | No verified LinkedIn in public profile |
| `Shash1704` | — | — | No |
| `Adit-K06` | Adit Kadagadakai | — | No |
| `MR-JK-37` | Jaikiran E | — | No |
| `abhass450-code` | Abhas | — | No |
| `MahatvaGoell` | Mahatva Goel | — | No |
| `saran612` | saran karthick | `https://saran612.me/` | No verified LinkedIn in public profile |
| `shettyvaishnavi1406-oss` | — | — | No |
| `JAbhishek09` | ABHISHEK JAIN | — | No |
| `Dhapoo06` | — | — | No |
| `AryanRao10` | Aryan R | — | No |

**Rule:** do not guess LinkedIn URLs from names. If we need a profile for outreach, search with the project name + GitHub handle and verify the person matches the repo. Absence of evidence is not proof that no profile exists.

---

## 7. Live demo verification

`[FACT]` HTTP status checks on 25 Oct 2026. A 200 means the page loaded; it does not mean the full product works. We did not manually QA every flow.

| URL | Status | Repo / note |
|---|---:|---|
| `https://pramaan-sih26.vercel.app` | 200 | `Adi-ctive/pramaan` |
| `https://aicte-scrutiny.vercel.app` | 200 | `aquasimp/SIH26261` |
| `https://verigate-app.vercel.app` | 200 | `atharva23x/verigate` (mapping from earlier research; not re-verified) |
| `https://apaar-integrity-platform.vercel.app` | 200 | `Soumya-Vinod/apaar-integrity-platform` |
| `https://vidyapramaan.vercel.app` | 200 | `Garv1105` VidyaPramaan |
| `https://shash1704.github.io/aicte-icms/` | 200 | `Shash1704/aicte-icms` |
| `https://shash1704.github.io/aicte-fdr-portal/` | 200 | `Shash1704/aicte-fdr-portal` |
| `https://sih26261-satyapramaan.vercel.app` | 200 | `sethupathy03/sih26261-satyapramaan` |
| `https://caselink-ai-sih26264.vercel.app` | 200 | `mrudhulabikkavolu/SIH26264` |
| `https://sih-26262.vercel.app` | 200 | `kartikjograna/SIH26262` |
| `https://frontend-chi-khaki-22.vercel.app` | **404** | `Adit-K06/SIH26264-Complains-Dashboard` homepage; broken live link |

`[INFERENCE]` The presence of a live demo is a real advantage in a 7-minute jury round. The broken link is a weakness we can mention indirectly (“a live demo is table stakes; ours will be stable and local-first”). Do not attack a specific team by name.

---

## 8. Full repo inventory

### 8.1 PS-specific repos from the GitHub search (31)

`[FACT]` Search results on 25 Oct 2026, sorted by update. “Deep dive” = README/code inspected. “Not deep-dived” = metadata/README only.

| # | Repo | PS | Primary stack | Live demo | Deep dive | Note |
|---:|---|---|---|---|---|---|
| 1 | `omkardiggi/sih26261-scandoc` | 26261 | Python/FastAPI + React | No | Yes | Strong security/audit; 26 tests; no live demo |
| 2 | `Aditya948351/SIH26262` | 26262 | — | No | No | Empty/placeholder |
| 3 | `Adi-ctive/pramaan` | 26261 | Python/FastAPI + React | 200 | Yes | Strongest 26261 full product |
| 4 | `atharvaiddya/SIH26261` | 26261 | TypeScript | Not verified | No | Unknown depth |
| 5 | `sethupathy03/sih26261-satyapramaan` | 26261 | JS/React + FastAPI | 200 | Yes | Trust score + ELA; mock registries |
| 6 | `abhass450-code/ApproveDesk` | 26262 | Python | No | Yes | Scaffold |
| 7 | `sarthakrajwar06/SIH26261` | 26261 | Python | No | No | Unknown |
| 8 | `Adit-K06/SIH26264-Complains-Dashboard` | 26264 | FastAPI + React + Postgres | 404 | Yes | Full-stack but broken live link |
| 9 | `ShreyashS1107/datasetSIH26261` | 26261 | Python | No | No | Dataset/extraction pipeline |
| 10 | `Shash1704/aicte-fdr-portal` | 26265 | Node/Express + React | 200 | Yes | Strongest 26265 incumbent |
| 11 | `aquasimp/SIH26261` | 26261 | Next.js/React/TS | 200 | Yes | Flashy forensic workstation |
| 12 | `subhankar235/SIH26265` | 26265 | — | No | Yes | README only |
| 13 | `mrudhulakarthikeyan-prog/SIH26261-Evidence-Linked-System` | 26261 | — | No | No | Unknown |
| 14 | `Shash1704/aicte-icms` | 26264 | Node/Express + React | 200 | Yes | Strongest 26264 incumbent |
| 15 | `Mukhesh-san/eduverify-ai` | 26261/26263 | Python | Not verified | No | AI document verification |
| 16 | `INCHANTED/sih26263` | 26263 | HTML | No | No | Tiny/unknown |
| 17 | `SanjayKrshna2006/Doculens_sih26261` | 26261 | — | No | No | Unknown |
| 18 | `saran612/SIH26262` | 26262 | FastAPI + React + Postgres | No | Yes | Strong obligation engine |
| 19 | `navyaanubhutii/AICTE-VERITAS` | 26261 | React/TS + FastAPI | No | Yes | Stage-1 only |
| 20 | `Tharun-Kumaran/SIH26262` | 26262 | TypeScript | No | No | Small |
| 21 | `Dhapoo06/Sih-Team-kratoseyal-prototype-pdkv` | 26261 | — | No | No | Unknown |
| 22 | `Dhapoo06/SIH-Team-kratoseyal-prototype` | 26261 | HTML | No | No | Unknown |
| 23 | `saikoushik2108/sih26261` | 26261 | — | No | No | Unknown |
| 24 | `JAbhishek09/PramaanAI-SIH26261` | 26261 | Python | No | No | Unknown |
| 25 | `Yogzzz-code/hacknova-sih26264` | 26264 | — | No | No | Unknown |
| 26 | `mrudhulabikkavolu/SIH26264` | 26264 | JavaScript | 200 | No | Live demo; likely UI |
| 27 | `MahatvaGoell/aicte-approval-compliance-platform` | 26262 | React/TS + Fastify + Postgres | No | Yes | Strong versioned policy/audit |
| 28 | `kartikjograna/SIH26262` | 26262 | JavaScript | 200 | No | Live frontend |
| 29 | `AryanRao10/vaultguard-sih26265` | 26265 | Next.js | No | Yes | Boilerplate only |
| 30 | `fapieex/sih.2` | 26262 | JavaScript | No | No | Unknown |
| 31 | `vinaysathwik-ai/SIH26261` | 26261 | — | No | No | Unknown |

### 8.2 Broader-search repos inspected

`[FACT]` These came from `APAAR` / `AICTE` / project-name searches and were cloned. They are relevant but may not mention the PS ID in the repo name.

| Repo | Likely PS | Stack | Live demo | Deep dive | Note |
|---|---|---|---|---|---|
| `MR-JK-37/aicte-fdr-portal` | 26265 | FastAPI + React + Postgres | No | Yes | 632 backend tests; policy rules draft/blocked |
| `Garv1105/APAAR-Based-Student-Enrolment-Integrity-Verifiable-Credential-System` | 26263 | FastAPI + React + Postgres | 200 | Yes | VidyaPramaan; national-quality |
| `Soumya-Vinod/apaar-integrity-platform` | 26263 | FastAPI + React + Supabase | 200 | Yes | Blind Match + Isolation Forest |
| `Purva2907/VIDYA-VERIFY` | 26263 | React/TS + backend | Not verified | Yes | 3D UI + collision engine |
| `DeepakUK17/EduTrace` | 26263 | Node/Express + React + Prisma | Not confirmed | Yes | Full-stack; HMAC duplicates |
| `nooralam08/Abhigyan` | 26264 | React/TS + Vite | No | Yes | Frontend-only |
| `shettyvaishnavi1406-oss/AICTE-workflow` | 26262 | Unknown | No | Yes | README empty |
| `atharva23x/verigate` | 26261 | Unknown | 200 (verigate-app) | No | Unknown depth |
| `dipanshu-gupta1/apaar-setu` | 26263 | Unknown | No | No | APAAR-related |
| `sih2026-mitaoe/apaar-student-verification` | 26263 | Unknown | No | No | APAAR-related |
| `russellsahoo21/SIH2026` | 26263 | Unknown | No | No | APAAR-related |

### 8.3 Scale notes

`[INFERENCE]` Approximate source-line counts and test counts from cloned repos on 25 Oct 2026, including generated/vendor files where present. These are **not** quality scores.

| Repo | Approx. source lines | Tests observed | Read |
|---|---:|---:|---|
| `MR-JK-37/aicte-fdr-portal` | ~81,000 | 632 backend + 29 web | Over-engineered; no live demo; policy blocked |
| `Soumya-Vinod/apaar-integrity-platform` | ~43,800 | 49 | Strong privacy/evaluation; complex |
| `Garv1105` VidyaPramaan | ~24,200 | 23 | Strong deterministic validation/credentials |
| `Adit-K06` | ~22,000 | 17 | Full-stack; broken live link |
| `omkardiggi` | ~21,600 | 26 backend + Playwright | Strong security/audit; no live demo |
| `aquasimp` | ~17,300 | Not counted | Flashy UI; depth uncertain |
| `Adi-ctive/pramaan` | ~14,000 | 5 + Playwright e2e | Strong full product; LITE mode |
| `saran612` | Not counted | `make check`/`make e2e` | Strong obligation engine; no live demo |
| `MahatvaGoell` | Not counted | Vitest | Strong versioned policy; no live demo |
| `Shash1704/aicte-fdr-portal` | Not counted | 9 e2e | Strong portal; policy rules illustrative |
| `Shash1704/aicte-icms` | Not counted | 18 | Strong entity resolution; live demo |

`[OPINION]` Do not be intimidated by line counts. Large repos are often over-engineered or AI-generated. Jury demos reward clarity and correctness, not code volume.

---

## 9. Source ledger

| # | Source | URL | Retrieved | Used for |
|---:|---|---|---|---|
| 1 | GitHub search API | `https://api.github.com/search/repositories?q=SIH26261+OR+SIH26262+OR+SIH26263+OR+SIH26264+OR+SIH26265&per_page=100&sort=updated` | 25 Oct 2026 | 31 PS-specific repos, metadata |
| 2 | GitHub API user lookup | `https://api.github.com/users/{login}` | 25 Oct 2026 | Public names/bios; no LinkedIn |
| 3 | GitHub repo pages | Individual repo URLs above | 25 Oct 2026 | READMEs, code, tests, live links |
| 4 | Live demo checks | URLs in §7 | 25 Oct 2026 | HTTP status only |
| 5 | Zaid SIH mirror | `https://zaidsayyed.in/tools/sih-problem-statements/sih26261` … `/sih26265` | 25 Oct 2026 | Official PS text, idea counts |
| 6 | DScE SIH portal | `https://sih.dsce.in/sih/problem-statements` | 25 Oct 2026 | College team-slot counts |
| 7 | Boss image | `Pasted 2026-10-25 at 5.43.42 PM.heic` | 25 Oct 2026 | National idea counts |
| 8 | APH 2024-27 | `https://cdnbbsr.s3waas.gov.in/s35938b4d054136e5d59ada6ec9c295d7a/uploads/2025/03/2025031399.pdf` | 25 Oct 2026 | 26265 rules, clauses, penalties |
| 9 | APH 2026-27 Addendum | `https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52940/AICTE-issued-the-Corrigendum-regarding-the-Approval-Process-2026-27-February202026.pdf` | 25 Oct 2026 | 50% concession, leased multiplier, RPGF |
| 10 | PIB APAAR factsheet | `https://www.pib.gov.in/PressReleasePage.aspx?PRID=2281148` | 25 Oct 2026 | 26.35 crore verified APAAR IDs |
| 11 | APAAR portal | `https://apaar.education.gov.in/` | 25 Oct 2026 | 33.74 crore registered |
| 12 | ABC portal | `https://www.abc.gov.in/` | 25 Oct 2026 | APAAR/ABC/DigiLocker flow |
| 13 | LinkedIn searches | Queries in §6.1 | 25 Oct 2026 | Negative-result search |

**Known limitations**

- GitHub stars/forks are all near zero because the repos are new; do not use popularity as a quality signal.
- Live demo status is a snapshot; a 200 does not prove the demo works.
- We did not inspect every repo line by line. “Not deep-dived” is explicit.
- Idea counts are snapshots and may count different things; do not present them as exact.
- LinkedIn search coverage is incomplete; absence of a profile is not proof.

---

## 10. Implications for our strategy

1. **Do not compete on breadth.** The top repos already have more features than we can build in 36 hours. Compete on **policy accuracy + evidence + demo clarity**.
2. **Do not claim AI magic.** The jury has seen “AI-powered” on every second repo. Use deterministic rules where correctness matters, and label AI as advisory.
3. **Do not claim real integrations.** Label every adapter. The strongest repos already do this; the weakest overclaim. Honesty is a differentiator.
4. **Do not build a generic dashboard.** Build the **release eligibility graph** and the **maturity cash-flow forecast**. These are visual, domain-specific, and hard to copy.
5. **Do not ignore the 2026-27 addendum.** It is the single clearest gap in the 26265 incumbents. Put it on a slide and in the demo.
6. **Do not attack competitors by name.** Say “most portals use illustrative norms” and show the clause. Let the jury infer.
7. **Do not rely on a live cloud demo alone.** Build a local-first demo with seeded data and a recorded fallback video. The broken 404 on a competitor’s homepage is a warning.
8. **Do not overbuild.** The cut list in `context.md` is deliberate. Policy engine, provenance, release graph, time machine, audit. Everything else is optional.
