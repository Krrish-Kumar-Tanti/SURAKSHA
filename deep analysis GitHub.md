# Deep Analysis — GitHub Landscape for SIH26265

**Problem statement:** SIH26265 — Streamline of Security Deposit / FDR Portal (AICTE, Smart Automation, Software)  
**Analysis date:** 28 October 2026  
**Scope:** GitHub repositories, live prototype links, feature/policy audit, and implications for SURAKSHA  
**Repos found:** 78 (about 71 distinct projects after mirrors/duplicates)  
**Live deployments verified:** 25 URLs returned HTTP 200 at check time (24 map cleanly to a repo; one is ambiguous); 5 source-backed prototype URLs were dead or timed out; 14 GitHub Pages links returned 404.

> **Read this first:** the 25 October audit in `opponent.md` is obsolete for SIH26265. It found four PS-specific repos and concluded there were only two serious competitors. The field now has at least seven serious builds and twenty-plus live demos. The policy moat is still real, but it is narrower than the original plan assumed. Section 9 explains exactly what SURAKSHA can still own.

---

## 0. Executive summary

1. **The field is much larger than the 25 October snapshot.** We found 78 repos, including 40+ first created on or after 26 October. The prior search did not surface several strong repos created on 23–24 October (`Panbhuarasane-A/aicte_sih_fdr`, `Retesh-Pandey/AICTE-FDR-VAULT`, `codecruncher0723/aicte-fdr-portal`, `BBhargavKasiRam/TrustLedger`).
2. **Seven Tier 1 threats:** `Shash1704/aicte-fdr-portal` (live incumbent), `kumudranjan6127-debug/fdr-intelligence-hub` (live, closest policy competitor), `Panbhuarasane-A/aicte_sih_fdr` (real 50% concession, but static demo), `MR-JK-37/aicte-fdr-portal` (deep release/RPGF code, no demo), `harsha05-ui/AICTE-FDR-Portal-SIH-26265` (5-office release graph, no demo), `Rohith-Kumar-SS/nidhi-kavach` (live, strong generic + signed QR), and `Retesh-Pandey/AICTE-FDR-VAULT` (live, strong generic).
3. **No single repo combines the full moat.** The closest are:
   - `Panbhu` — 2026-27 50% concession + lease multiplier + penalties, but flat ₹35L base and a non-working backend.
   - `kumudranjan` — full APH Table 1.4, lease multiplier, penalty engine, interest retention, 6.46 citations, but no 50% concession and only a partial clearance graph.
   - `MR-JK` — deepest release/RPGF/PGRC code and tests, but no 2026-27 addendum and no live demo.
   - `harsha05` — real five-office release consensus, but almost no policy-amount logic.
4. **The “only we read the APH” claim is no longer safe.** `kumudranjan` has Table 1.4 and penalties with clause/page citations; `Panbhu` has the 50% concession; `MR-JK` and `harsha05` have deeper release workflows than most portals. The remaining differentiator is **integration**: one trace from the 50% concession → Table 1.4 → leased multiplier → 10-year/interest → 6.46 release graph → RPGF → maturity forecast, with a time machine and audit proof.
5. **Live demos are not proof of depth.** `Shash1704` and `Panbhu` are browser-only/static demos. `Rohith` is frontend + a Render API with cold starts. Several Vercel demos are frontend-only with seeded data. We verified HTTP status and page title, not every workflow.
6. **Recommendation:** keep SIH26265. Do not change PS. Adjust the pitch from “we are the only policy-aware team” to “we are the only team that connects the 2026-27 policy to the full release decision and the portfolio forecast in one defensible demo.” Prioritise the policy trace, the release graph, the forecast/time machine, and the audit verify.

---

## 1. Search method and confidence

### 1.1 Queries run

| Query | Result count | Notes |
|---|---:|---|
| `SIH26265` | 25 | Core PS ID |
| `26265 AICTE` | 8 | Variant |
| `AICTE FDR` | 48 | Broadest useful query |
| `AICTE "security deposit"` | 26 | Policy wording |
| `SIH 2026 FDR` | 8 | Season wording |
| `FDR portal SIH` | 19 | Generic wording |
| `security deposit portal` | 42 | Generic wording; noisy |
| Additional README/code searches | — | 50%, addendum, 6.46, PGRC, vigilance, RPGF, penalty, forecast, pledge |

After deduplication: **78 repos**. We shallow-cloned all 78, read READMEs, counted source lines and test files (excluding `node_modules`, `dist`, `build`, `.git`, `__pycache__`), and scanned for policy and workflow keywords. GitHub API metadata was fetched for 58 repos; the remaining 20 were assessed from local clones and READMEs.

### 1.2 Live URL verification

- HTTP status and page title checked on 28 October 2026.
- `200` means the page loaded; it does **not** mean login, upload, bank verification, or release workflows work.
- Known static/browser-only demos: `Shash1704` (GitHub Pages build), `Panbhu` (GitHub Pages static; backend 404), `joel` (GitHub Pages frontend).
- Known full-stack live demo: `kumudranjan` (Vercel + Neon/Postgres; demo accounts).
- Known frontend + API: `Rohith` (GitHub Pages + `nidhi-kavach.onrender.com`; cold starts).
- Several Vercel demos may be frontend-only with seeded/local data; we did not audit every backend.

### 1.3 Confidence labels

- **High** — README + code + live page inspected.
- **Medium** — README + code or live page, not both fully exercised.
- **Low** — README/metadata only, or clone incomplete.

---

## 2. Landscape at a glance

| Metric | 25 Oct 2026 (prior audit) | 28 Oct 2026 (this audit) |
|---|---:|---:|
| PS-specific repos | 4 | 78 |
| Distinct projects/teams | ~4 | ~71 |
| Repos first created 26–28 Oct | 0 known | 40+ |
| Live deployments returning 200 | 2 known | 24 clean (+1 ambiguous) |
| Serious/Tier 1 builds | 2 | 7 |
| Repos with real 50% concession | 0 | 1 (`Panbhu`) |
| Repos with APH Table 1.4 matrix | 0 | 1–2 (`kumudranjan`; `Panbhu` flat base) |
| Repos with a full 6.46-style release graph | 0 | 2–3 partial (`MR-JK`, `harsha05`, `varshukarthik`) |
| Repos with RPGF modeled | 0 | 1 (`MR-JK` code) |
| Repos with maturity cash-flow forecast | 0 | 2–3 (`MR-JK`, `Rohith`, `coderkartik7`) |

**Interpretation:** the field formed late and fast. Most teams built a generic FDR lifecycle portal. A small number built real policy or release depth. Nobody packaged the complete policy-to-release-to-forecast story.

---

## 3. Threat tiers

### Tier 1 — must-watch

| Rank | Repo / team | Live prototype | Why they are dangerous | Their gap |
|---:|---|---|---|---|
| 1 | [`Shash1704/aicte-fdr-portal`](https://github.com/Shash1704/aicte-fdr-portal) | [shash1704.github.io/aicte-fdr-portal](https://shash1704.github.io/aicte-fdr-portal/) | Most polished live demo; three-way provenance, bank sandbox, release checklist, maker-checker-approver, reminder ladder, time machine, hash audit; 9 e2e scenarios | Requirement norms are **illustrative and editable**; no 2026-27 addendum/50%; no full 6.46 graph/RPGF/interest/forecast/pledge graph |
| 2 | [`kumudranjan6127-debug/fdr-intelligence-hub`](https://github.com/kumudranjan6127-debug/fdr-intelligence-hub) | [fdr-intelligence-hub.vercel.app](https://fdr-intelligence-hub.vercel.app) | Closest policy competitor: APH Table 1.4, lease ×2, 10/20% penalty tiers, 10% early encashment, 50%/10% release deductions, interest retention, 6.46 citations, duplicate detection, NOC QR, demo clock, eval (110/110 defects, 0/70 false positives) | No 50% concession; no RPGF; clearance graph uses Finance/Legal/Grievance rather than PGRC/Vigilance/Grants; no full cash-flow forecast; rule amounts still illustrative in places |
| 3 | [`Panbhuarasane-A/aicte_sih_fdr`](https://github.com/Panbhuarasane-A/aicte_sih_fdr) | [panbhuarasane-a.github.io/aicte_sih_fdr](https://panbhuarasane-a.github.io/aicte_sih_fdr/) (static only; API 404) | Only repo with a real 2026-27 50% concession in code (`CONCESSION_MULTIPLIER=0.5`), lease ×2, 15-day grace, 10/20% penalties, OCR/gate, release workflow, audit, 9 test files | Flat ₹35L base, not Table 1.4 matrix; backend down; static demo; sign-in disabled; no full 6.46/PGRC/Vigilance/RPGF/forecast |
| 4 | [`MR-JK-37/aicte-fdr-portal`](https://github.com/MR-JK-37/aicte-fdr-portal) | None found | Deepest codebase: ~72k LOC, 80 test files, 13-role RBAC/ABAC/RLS, release graph, RPGF/PGRC/vigilance, 10-year lineage, Ed25519 checkpoints, hash audit | No live demo; README overclaims “zero simulation”; Table 1.4/penalties were draft/blocked in prior audit; no 50% addendum |
| 5 | [`harsha05-ui/AICTE-FDR-Portal-SIH-26265`](https://github.com/harsha05-ui/AICTE-FDR-Portal-SIH-26265) | None found (GitHub Pages 404) | Real five-office release consensus: Regional Office → Approval Bureau → Grievance Cell → Vigilance Cell → Competent Authority; regulatory holds; lien states; trust levels; encrypted docs; NOC PDF; 3 test files | Almost no policy-amount logic; no 50%, penalties, RPGF, or forecast; no live demo |
| 6 | [`Rohith-Kumar-SS/nidhi-kavach`](https://github.com/Rohith-Kumar-SS/nidhi-kavach) | [rohith-kumar-ss.github.io/nidhi-kavach](https://rohith-kumar-ss.github.io/nidhi-kavach/) + [Render API](https://nidhi-kavach.onrender.com/api/docs) | Strong live generic product: bank-signed QR receipts, smart extraction, trust ladder, duplicate detection, protection gap + 12-month heatmap, nightly bank rechecks, release SLA, signed NOC, hash audit, bilingual; ~62k LOC, 19 test files | No APH amounts/50%/penalties/RPGF/full 6.46; Render cold starts |
| 7 | [`Retesh-Pandey/AICTE-FDR-VAULT`](https://github.com/Retesh-Pandey/AICTE-FDR-VAULT) | [aicte-fdr-valut.vercel.app](https://aicte-fdr-valut.vercel.app) | Strong live generic lifecycle: OCR, simulated bank adapter, maturity scheduler, renewal chain, release state machine, encrypted docs, hash audit, 7-strike intake; ~26k LOC, 21 test files | No policy amounts/50%/6.46/RPGF/forecast |

### Tier 2 — strong but narrower

| Repo | Live | What they built | Gap |
|---|---|---|---|
| [`varshukarthik/nidhisetu`](https://github.com/varshukarthik/nidhisetu) | None | PGRC/Vigilance/Finance release checklist, smart action queue, QR/signature checks, hash audit, 69 tests | No policy/50%/RPGF/forecast; README says checklist is “not a statement of currently effective policy” |
| [`shree180/SIH26265`](https://github.com/shree180/SIH26265) | None | 96 backend tests, maker-checker release, five role dashboards, private documents, hash audit, CSV | No policy/50%/6.46; no demo |
| [`NemisysT/SIH26265`](https://github.com/NemisysT/SIH26265) | None | Next.js/Prisma, versioned documents, discrepancy engine, release workflow, DB-trigger audit, Playwright | No policy/50%/6.46; no demo |
| [`Bkjoy/TRUST360`](https://github.com/Bkjoy/TRUST360) | [trust-360-tan.vercel.app](https://trust-360-tan.vercel.app) | Live OCR, duplicate detection, maturity tracking, three-tier release, audit | No policy/50%/6.46 |
| [`BBhargavKasiRam/TrustLedger`](https://github.com/BBhargavKasiRam/TrustLedger) | [trust-ledger-indol.vercel.app](https://trust-ledger-indol.vercel.app) | Live forensics (ELA/pHash/Gemini), three-tier bank verification, DAG lineage, four-gate release, time travel | No tests; simulated; no policy |
| [`BhaskarShah05/Fintrack`](https://github.com/BhaskarShah05/Fintrack) | [fintrack-mu-bay.vercel.app](https://fintrack-mu-bay.vercel.app) | Live dual-truth model, NeSL/e-BG, APH 6.46 release gate, WORM audit | JSON DB, 0 tests, no 50%; claims exceed implementation |
| [`codecruncher0723/aicte-fdr-portal`](https://github.com/codecruncher0723/aicte-fdr-portal) | None | ~37k LOC, 28 tests: strong RBAC/IDOR, provenance, versioning, renewal, release | No README/demo/policy |
| [`coderkartik7/SIH26265_FDR-Sentinel`](https://github.com/coderkartik7/SIH26265_FDR-Sentinel) | None | PDF signature/QR/ELA, ML risk, liability forecast, hash audit, 27 tests | No demo/policy |
| [`Sanjeev-Sivakumar/AetherVault`](https://github.com/Sanjeev-Sivakumar/AetherVault) | None | Three-way CBS/SFMS, trust score, maker-checker, 10-year lineage, self-healing Merkle audit | No demo/policy; “self-heal” questionable |
| [`marizxy/KOSH-RAKSHAK`](https://github.com/marizxy/KOSH-RAKSHAK) | None | Four-persona UI, bank node, five-gate release, ELA/CBS stubs | Wrong 8-year lock-in (APH is 10); mostly frontend; no live |
| [`dipesh4000/KoshSetu-SIH`](https://github.com/dipesh4000/KoshSetu-SIH) / [`nishikadhankhar/koshsetu-sih`](https://github.com/nishikadhankhar/koshsetu-sih) (mirror) | [koshsetu-sih.vercel.app](https://koshsetu-sih.vercel.app) | Live FastAPI/React, OCR, AES-GCM, CSV import, audit, 10 tests | No policy/50%/6.46 |
| [`rigs29/NidhiSync-AICTE`](https://github.com/rigs29/NidhiSync-AICTE) | [nidhi-sync.vercel.app](https://nidhi-sync.vercel.app) | Live AWS-native portal: maturity, renewal, release, RBAC, audit | No policy/50%/6.46 |
| [`deepmaha2006/fd-portal`](https://github.com/deepmaha2006/fd-portal) | [fd-portal-kohl.vercel.app](https://fd-portal-kohl.vercel.app) | Live Next.js/MongoDB, seven roles, audit, reminders | No policy/50%/6.46 |
| [`adityakumargupta27/sih-project-265`](https://github.com/adityakumargupta27/sih-project-265) | [sih-project-1-zeta.vercel.app](https://sih-project-1-zeta.vercel.app) → [aictefdr.vercel.app](https://aictefdr.vercel.app/) | Live TanStack portal: repository, verification, maturity radar, three-stage release, analytics | No policy/50%/6.46 |
| [`Aashirwadaanand/fdr`](https://github.com/Aashirwadaanand/fdr) | [fdr-ruddy.vercel.app](https://fdr-ruddy.vercel.app) | Live Express/React, 25 tests, RBAC, hash audit, time machine, release | No policy/50%/6.46 |
| [`eags-aayush/SIH26265`](https://github.com/eags-aayush/SIH26265) | [sih2626501.vercel.app](https://sih2626501.vercel.app) | Live Next/Supabase: dual-source badges, discrepancy, cron simulator, release, audit | No policy |
| [`ammuelsa17-ui/kosh-pramaan`](https://github.com/ammuelsa17-ui/kosh-pramaan) | [kosh-pramaan.vercel.app](https://kosh-pramaan.vercel.app) | Live small Express/Postgres lifecycle portal, 7 tests | No policy |
| [`chatgptofficial03/deposit-flow`](https://github.com/chatgptofficial03/deposit-flow) | [deposit-flow-five.vercel.app](https://deposit-flow-five.vercel.app) | Live six-stage submission, OCR/SFMS mock, maturity/time machine, release | No policy |
| [`krsahilara-png/AICTE-FDR-Management-Portal`](https://github.com/krsahilara-png/AICTE-FDR-Management-Portal) | [aicte-fdr-management-portal.vercel.app](https://aicte-fdr-management-portal.vercel.app) | Live generic lifecycle portal | No tests/policy |
| [`seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal`](https://github.com/seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal) | [sih-26265-aicte-fdr-portal.vercel.app](https://sih-26265-aicte-fdr-portal.vercel.app) | Live generic portal | No tests/policy |
| [`shampatil23/ZeroDrop_SIH26265`](https://github.com/shampatil23/ZeroDrop_SIH26265) | [zerodropsih.vercel.app](https://zerodropsih.vercel.app) | Live polished generic portal | No tests/policy |
| [`ayushmahadik1256-max/TrackTitans`](https://github.com/ayushmahadik1256-max/TrackTitans) | [track-titans-gules.vercel.app](https://track-titans-gules.vercel.app) | Live three-party escrow, Firebase/S3/Neon, cron alerts | No tests/policy |
| [`ayus0109/AICTE-FDR-portal`](https://github.com/ayus0109/AICTE-FDR-portal) | [aicte-fdr-portal.vercel.app](https://aicte-fdr-portal.vercel.app) | Live FastAPI/React generic portal; README copied | 1 test; no policy |
| [`joelbinoy2021-sketch/fdrflow-sih`](https://github.com/joelbinoy2021-sketch/fdrflow-sih) | [joelbinoy2021-sketch.github.io/fdrflow-sih](https://joelbinoy2021-sketch.github.io/fdrflow-sih/) | Live GitHub Pages React/Django generic portal | No tests/policy |
| [`aisheechowdhury19801977-create/SecureFDR`](https://github.com/aisheechowdhury19801977-create/SecureFDR) | [secure-fdr.vercel.app](https://secure-fdr.vercel.app) | Live small SecureFDR lifecycle portal | No tests/policy |
| [`Rao-dev1/aicte-fdr`](https://github.com/Rao-dev1/aicte-fdr) | [aicte-fdr.vercel.app](https://aicte-fdr.vercel.app) | Live Next/FastAPI generic portal, 3 test files | No policy |
| [`Aviral-P/fdr-sentinel`](https://github.com/Aviral-P/fdr-sentinel) | None | ~12k LOC, 21 test files: provenance, integrity, release eligibility, audit | Local only; no policy |

### Tier 3 — weak, early, or overclaimed

`Vishal4536/aicte-fdr-portal` (13k LOC single-file React, localStorage, no backend), `PRAVEEN200624/FDR-GUARDIAN-SIH-2026-` (live demo 500), `rupesh0411/Sanjievani-SECUREFLOW-SIH26265` (frontend mock, conflicting team IDs), `YuveshxD/Fidara-Fibot-SIH` (409 LOC), `darsh1m5/FDR-PORTAL-SIH-26265` (zip only), `jer27ush-del/sih26265` (no verified demo), `Thatchu-yazh/aicte-centralised-fdr-portal`, `abiappar27/NidhiSetu`, `Mahith269/SIH26265`, `Soniya561/SIH26265`, `VINIYOJAN/VINIYOJAN-SIH-2026`, `karthikeyar85-netizen/fdr-management-portal`, `Rocky132123/AICTE-FDR-Management-Portal`, `devanshgupta52120-jpg/AICTE-FDR-PORTAL`, `dhina-514/aicte-fdr`, `AryanRao10/vaultguard-sih26265`, `ankit-kuntal/AICTE-FDR-Management-Portal`, `Juzt-nik/Project-BluePrint`, `ruck-syu/aicte-fdr-portal`, `vedipanj115/fdr-portal`, `knrcreddy25/aicte-fdr-portal`.

### Tier 4 — empty, README-only, or duplicate

`dharshan188/NIDHIVEDA-SIH26265-AICTE-FDR-Management` (empty), `Sampada-06/AICTE-FDR-portal` (empty), `dj7455230/AICTE-FDR-PORTAL` (empty), `knrcreddy25/depositdesk-sih` (empty), `subhankar235/SIH26265` (README only), `vaibhav94571/aicte-fdr-portal` (README only), `arun-vishal/SIH-Security-Deposit-FDR-Portal` (zip only), `PRAVEEN200624/SIH-2026-FDR-GUARDIAN-PORTAL-` (duplicate), `PRAVEEN200624/SIH-2026-FDR-GUARDIAN-` (duplicate), `VINIYOJAN/viniyojan` (empty), `neerajsongade25-ops/AICTE-FDR-Management-Portal` (copy of `krsahilara`).

---

## 4. New and newly surfaced teams (26–28 Oct, plus missed 23–25 Oct)

These repos were first created on or after 26 October (GitHub metadata where available; last-commit date otherwise), plus strong repos from 23–25 October that the prior audit missed. The table is ordered by threat.

| Repo | Created | Live prototype | What they built | Verdict |
|---|---|---|---|---|
| [`kumudranjan6127-debug/fdr-intelligence-hub`](https://github.com/kumudranjan6127-debug/fdr-intelligence-hub) | 26 Oct | [fdr-intelligence-hub.vercel.app](https://fdr-intelligence-hub.vercel.app) | Full-stack verification-first portal; Table 1.4, lease ×2, penalty engine, interest retention, NOC QR, duplicate detection, eval | **Tier 1; closest policy competitor** |
| [`Panbhuarasane-A/aicte_sih_fdr`](https://github.com/Panbhuarasane-A/aicte_sih_fdr) | 24 Oct (missed) | [static GitHub Pages](https://panbhuarasane-a.github.io/aicte_sih_fdr/) | Real 50% concession, lease ×2, penalty tiers, OCR/gate, release, audit | **Tier 1; policy lead, broken demo** |
| [`harsha05-ui/AICTE-FDR-Portal-SIH-26265`](https://github.com/harsha05-ui/AICTE-FDR-Portal-SIH-26265) | 28 Oct | None | Five-office release consensus, holds, lien states, trust levels, NOC PDF, 3 test files | **Tier 1; release depth** |
| [`Rohith-Kumar-SS/nidhi-kavach`](https://github.com/Rohith-Kumar-SS/nidhi-kavach) | 27 Oct | [GitHub Pages](https://rohith-kumar-ss.github.io/nidhi-kavach/) + [API](https://nidhi-kavach.onrender.com/api/docs) | Signed QR receipts, smart extraction, trust ladder, duplicate detection, protection gap/heatmap, release SLA, audit | **Tier 1; live generic** |
| [`varshukarthik/nidhisetu`](https://github.com/varshukarthik/nidhisetu) | 27 Oct | None | PGRC/Vigilance/Finance release checklist, smart queue, QR, audit, 69 tests | Tier 2 |
| [`shree180/SIH26265`](https://github.com/shree180/SIH26265) | 26 Oct | None | 96 tests, maker-checker release, five role dashboards, private docs, audit | Tier 2 |
| [`NemisysT/SIH26265`](https://github.com/NemisysT/SIH26265) | 26 Oct | None | Next.js/Prisma, versioned docs, discrepancy engine, release, audit, Playwright | Tier 2 |
| [`Bkjoy/TRUST360`](https://github.com/Bkjoy/TRUST360) | 26 Oct | [trust-360-tan.vercel.app](https://trust-360-tan.vercel.app) | OCR, duplicate, maturity, three-tier release, audit | Tier 2 |
| [`BhaskarShah05/Fintrack`](https://github.com/BhaskarShah05/Fintrack) | 27 Oct | [fintrack-mu-bay.vercel.app](https://fintrack-mu-bay.vercel.app) | Dual truth, NeSL/e-BG, 6.46 release gate, WORM audit | Tier 2; overclaimed |
| [`Sanjeev-Sivakumar/AetherVault`](https://github.com/Sanjeev-Sivakumar/AetherVault) | 27 Oct | None | Three-way CBS/SFMS, trust score, maker-checker, lineage, Merkle audit | Tier 2; no demo |
| [`marizxy/KOSH-RAKSHAK`](https://github.com/marizxy/KOSH-RAKSHAK) | 28 Oct | None | Four personas, bank node, five-gate release, ELA/CBS stubs | Tier 2; wrong 10-year rule |
| [`deepmaha2006/fd-portal`](https://github.com/deepmaha2006/fd-portal) | 27 Oct | [fd-portal-kohl.vercel.app](https://fd-portal-kohl.vercel.app) | Next.js/MongoDB, seven roles, audit, reminders | Tier 2 |
| [`adityakumargupta27/sih-project-265`](https://github.com/adityakumargupta27/sih-project-265) | 27 Oct | [aictefdr.vercel.app](https://aictefdr.vercel.app/) | TanStack repository, verification, maturity radar, three-stage release | Tier 2 |
| [`Aashirwadaanand/fdr`](https://github.com/Aashirwadaanand/fdr) | 27 Oct | [fdr-ruddy.vercel.app](https://fdr-ruddy.vercel.app) | Express/React, 25 tests, RBAC, hash audit, time machine, release | Tier 2 |
| [`eags-aayush/SIH26265`](https://github.com/eags-aayush/SIH26265) | 27 Oct | [sih2626501.vercel.app](https://sih2626501.vercel.app) | Next/Supabase, dual-source badges, discrepancy, cron simulator, release | Tier 2 |
| [`ammuelsa17-ui/kosh-pramaan`](https://github.com/ammuelsa17-ui/kosh-pramaan) | 28 Oct | [kosh-pramaan.vercel.app](https://kosh-pramaan.vercel.app) | Small Express/Postgres lifecycle portal, 7 tests | Tier 2 |
| [`chatgptofficial03/deposit-flow`](https://github.com/chatgptofficial03/deposit-flow) | 27 Oct | [deposit-flow-five.vercel.app](https://deposit-flow-five.vercel.app) | Six-stage submission, OCR/SFMS mock, maturity/time machine, release | Tier 2 |
| [`krsahilara-png/AICTE-FDR-Management-Portal`](https://github.com/krsahilara-png/AICTE-FDR-Management-Portal) | 27 Oct | [aicte-fdr-management-portal.vercel.app](https://aicte-fdr-management-portal.vercel.app) | Generic lifecycle portal | Tier 2 |
| [`seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal`](https://github.com/seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal) | 25 Oct | [sih-26265-aicte-fdr-portal.vercel.app](https://sih-26265-aicte-fdr-portal.vercel.app) | Generic portal | Tier 2 |
| [`shampatil23/ZeroDrop_SIH26265`](https://github.com/shampatil23/ZeroDrop_SIH26265) | 27 Oct | [zerodropsih.vercel.app](https://zerodropsih.vercel.app) | Polished generic portal | Tier 2 |
| [`ayushmahadik1256-max/TrackTitans`](https://github.com/ayushmahadik1256-max/TrackTitans) | 24 Oct (missed) | [track-titans-gules.vercel.app](https://track-titans-gules.vercel.app) | Three-party escrow, Firebase/S3/Neon, cron alerts | Tier 2 |
| [`Rao-dev1/aicte-fdr`](https://github.com/Rao-dev1/aicte-fdr) | 27 Oct | [aicte-fdr.vercel.app](https://aicte-fdr.vercel.app) | Next/FastAPI generic portal, 3 test files | Tier 2 |
| [`Vishal4536/aicte-fdr-portal`](https://github.com/Vishal4536/aicte-fdr-portal) | 27 Oct | None | 13k LOC single-file React frontend, localStorage | Tier 3; no backend |
| [`Aviral-P/fdr-sentinel`](https://github.com/Aviral-P/fdr-sentinel) | 28 Oct | None | Provenance, integrity, release eligibility, audit, 21 test files | Tier 2; local only |
| [`PRAVEEN200624/FDR-GUARDIAN-SIH-2026-`](https://github.com/PRAVEEN200624/FDR-GUARDIAN-SIH-2026-) | 27 Oct | [fdr-guardian-sih-2026.vercel.app](https://fdr-guardian-sih-2026.vercel.app) (500) | Generic portal, 17.5k LOC | Tier 3; broken demo |
| [`rupesh0411/Sanjievani-SECUREFLOW-SIH26265`](https://github.com/rupesh0411/Sanjievani-SECUREFLOW-SIH26265) | 28 Oct | None | Frontend mock, generic PSU branding | Tier 3 |
| [`YuveshxD/Fidara-Fibot-SIH`](https://github.com/YuveshxD/Fidara-Fibot-SIH) | 28 Oct | None | 409 LOC | Tier 3 |
| [`jer27ush-del/sih26265`](https://github.com/jer27ush-del/sih26265) | 27 Oct | None | 3.3k LOC | Tier 3 |
| [`darsh1m5/FDR-PORTAL-SIH-26265`](https://github.com/darsh1m5/FDR-PORTAL-SIH-26265) | 28 Oct | None | Zip only | Tier 4 |
| [`ridamgupta79-dev/fdr-sentinel`](https://github.com/ridamgupta79-dev/fdr-sentinel) | 28 Oct | None | ~8.2k LOC, 4 tests | Tier 3 |
| [`zaaramariyam441-gif/fdr-smart-track`](https://github.com/zaaramariyam441-gif/fdr-smart-track) | 27 Oct | None | ~1.4k LOC | Tier 3 |
| [`Soniya561/SIH26265`](https://github.com/Soniya561/SIH26265) | 28 Oct | None | ~1.8k LOC frontend | Tier 3 |
| [`Mahith269/SIH26265`](https://github.com/Mahith269/SIH26265) | 27 Oct | None | 237 LOC | Tier 4 |
| [`abiappar27/NidhiSetu`](https://github.com/abiappar27/NidhiSetu) | 26 Oct | None | 582 LOC Flask | Tier 4 |
| [`Thatchu-yazh/aicte-centralised-fdr-portal`](https://github.com/Thatchu-yazh/aicte-centralised-fdr-portal) | 27 Oct | None | 1.6k LOC Flask/SQLite | Tier 4 |
| [`sanjushreeg/aicte-fdr-portal`](https://github.com/sanjushreeg/aicte-fdr-portal) | 27 Oct | None | ~9k LOC, 8 test files | Tier 3 |
| [`PORSELVI04/aicte-fdr-guardian`](https://github.com/PORSELVI04/aicte-fdr-guardian) | 26 Oct | None | ~6.5k LOC | Tier 3 |
| [`karthikeyar85-netizen/fdr-management-portal`](https://github.com/karthikeyar85-netizen/fdr-management-portal) | 27 Oct | None | ~1.3k LOC | Tier 3 |
| [`devanshgupta52120-jpg/AICTE-FDR-PORTAL`](https://github.com/devanshgupta52120-jpg/AICTE-FDR-PORTAL) | 26 Oct | None | ~9.5k LOC | Tier 3 |
| [`Rocky132123/AICTE-FDR-Management-Portal`](https://github.com/Rocky132123/AICTE-FDR-Management-Portal) | 27 Oct | None | ~9.6k LOC, 4 tests | Tier 3 |
| [`dhina-514/aicte-fdr`](https://github.com/dhina-514/aicte-fdr) | 26 Oct | None | ~10.1k LOC | Tier 3 |
| [`SaiGadwe/NIDHIVA-Institutional-Security-Deposit-Management-Portal`](https://github.com/SaiGadwe/NIDHIVA-Institutional-Security-Deposit-Management-Portal) | 26 Oct | None | ~3.4k LOC | Tier 3 |
| [`arun-vishal/SIH-Security-Deposit-FDR-Portal`](https://github.com/arun-vishal/SIH-Security-Deposit-FDR-Portal) | 27 Oct | None | Zip only | Tier 4 |
| [`VINIYOJAN/VINIYOJAN-SIH-2026`](https://github.com/VINIYOJAN/VINIYOJAN-SIH-2026) | 24 Oct | None | 639 LOC | Tier 4 |
| [`darsh1m5`](https://github.com/darsh1m5/FDR-PORTAL-SIH-26265) | 28 Oct | None | Zip only | Tier 4 |
| [`dharshan188/NIDHIVEDA-SIH26265-AICTE-FDR-Management`](https://github.com/dharshan188/NIDHIVEDA-SIH26265-AICTE-FDR-Management) | — | None | Empty | Tier 4 |
| [`Sampada-06/AICTE-FDR-portal`](https://github.com/Sampada-06/AICTE-FDR-portal) | — | None | Empty | Tier 4 |
| [`dj7455230/AICTE-FDR-PORTAL`](https://github.com/dj7455230/AICTE-FDR-PORTAL) | — | None | Empty | Tier 4 |

---

## 5. Previously missed strong teams (created before 26 October)

These matter because the 25 October audit missed them; they are not “new” but they change the competitive picture.

| Repo | Created | Live | What they built | Why missed |
|---|---|---|---|---|
| [`Panbhuarasane-A/aicte_sih_fdr`](https://github.com/Panbhuarasane-A/aicte_sih_fdr) | 24 Oct | Static | 50% concession, lease ×2, penalties, OCR/gate, release | Query did not surface; README not PS-tagged consistently |
| [`Retesh-Pandey/AICTE-FDR-VAULT`](https://github.com/Retesh-Pandey/AICTE-FDR-VAULT) | 23 Oct | [aicte-fdr-valut.vercel.app](https://aicte-fdr-valut.vercel.app) | OCR, bank adapter, maturity, renewal, release, audit | Query did not surface |
| [`codecruncher0723/aicte-fdr-portal`](https://github.com/codecruncher0723/aicte-fdr-portal) | 23 Oct | None | 37k LOC, 28 tests, RBAC/IDOR, provenance, release | Query did not surface |
| [`BBhargavKasiRam/TrustLedger`](https://github.com/BBhargavKasiRam/TrustLedger) | 24 Oct | [trust-ledger-indol.vercel.app](https://trust-ledger-indol.vercel.app) | Forensics, bank verification, DAG lineage, release | Query did not surface |
| [`ayus0109/AICTE-FDR-portal`](https://github.com/ayus0109/AICTE-FDR-portal) | 21 Oct | [aicte-fdr-portal.vercel.app](https://aicte-fdr-portal.vercel.app) | Generic FastAPI/React portal | Prior audit missed |
| [`ayushmahadik1256-max/TrackTitans`](https://github.com/ayushmahadik1256-max/TrackTitans) | 24 Oct | [track-titans-gules.vercel.app](https://track-titans-gules.vercel.app) | Three-party escrow, cron alerts | Prior audit missed |
| [`joelbinoy2021-sketch/fdrflow-sih`](https://github.com/joelbinoy2021-sketch/fdrflow-sih) | 24 Oct | [GitHub Pages](https://joelbinoy2021-sketch.github.io/fdrflow-sih/) | Generic React/Django portal | Prior audit missed |
| [`Juzt-nik/Project-BluePrint`](https://github.com/Juzt-nik/Project-BluePrint) | 22 Oct | None | 2.4k LOC | Prior audit missed |
| [`ankit-kuntal/AICTE-FDR-Management-Portal`](https://github.com/ankit-kuntal/AICTE-FDR-Management-Portal) | 22 Oct | None | 576 LOC | Prior audit missed |

---

## 6. Exact prototype links — verification status

### 6.1 Live and returning HTTP 200 (28 Oct 2026)

| Repo | Exact prototype URL | Page title / note |
|---|---|---|
| `kumudranjan6127-debug/fdr-intelligence-hub` | https://fdr-intelligence-hub.vercel.app | FDR Intelligence Hub; full-stack demo |
| `ammuelsa17-ui/kosh-pramaan` | https://kosh-pramaan.vercel.app | KOSH-PRAMAAN |
| `Rohith-Kumar-SS/nidhi-kavach` | https://rohith-kumar-ss.github.io/nidhi-kavach/ | Nidhi Kavach; frontend + Render API |
| `shampatil23/ZeroDrop_SIH26265` | https://zerodropsih.vercel.app | Zero Drop |
| `chatgptofficial03/deposit-flow` | https://deposit-flow-five.vercel.app | DepositFlow |
| `eags-aayush/SIH26265` | https://sih2626501.vercel.app | AICTE FDR & Security Deposit Management Portal |
| `Aashirwadaanand/fdr` | https://fdr-ruddy.vercel.app | AICTE FDR-Sentinel |
| `Shash1704/aicte-fdr-portal` | https://shash1704.github.io/aicte-fdr-portal/ | AICTE SD/FDR Portal; browser-only demo |
| `dipesh4000/KoshSetu-SIH` | https://koshsetu-sih.vercel.app | KoshSetu |
| `seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal` | https://sih-26265-aicte-fdr-portal.vercel.app | AICTE FDR Management Portal |
| `aisheechowdhury19801977-create/SecureFDR` | https://secure-fdr.vercel.app | SecureFDR |
| `adityakumargupta27/sih-project-265` | https://sih-project-1-zeta.vercel.app → https://aictefdr.vercel.app/ | AICTE FDR Portal |
| `Rao-dev1/aicte-fdr` | https://aicte-fdr.vercel.app | AICTE FDR Portal |
| `krsahilara-png/AICTE-FDR-Management-Portal` | https://aicte-fdr-management-portal.vercel.app | AICTE FDR Management Portal |
| `rigs29/NidhiSync-AICTE` | https://nidhi-sync.vercel.app | NidhiSync |
| `Bkjoy/TRUST360` | https://trust-360-tan.vercel.app | TRUST |
| `ayushmahadik1256-max/TrackTitans` | https://track-titans-gules.vercel.app | TrackTitans |
| `Retesh-Pandey/AICTE-FDR-VAULT` | https://aicte-fdr-valut.vercel.app | AICTE FDR VAULT |
| `BBhargavKasiRam/TrustLedger` | https://trust-ledger-indol.vercel.app | VidyaKosh |
| `deepmaha2006/fd-portal` | https://fd-portal-kohl.vercel.app | FD Portal |
| `BhaskarShah05/Fintrack` | https://fintrack-mu-bay.vercel.app | FinTrack |
| `Panbhuarasane-A/aicte_sih_fdr` | https://panbhuarasane-a.github.io/aicte_sih_fdr/ | Static only; backend 404 |
| `ayus0109/AICTE-FDR-portal` | https://aicte-fdr-portal.vercel.app | AICTE Security Deposit / FDR Portal |
| `joelbinoy2021-sketch/fdrflow-sih` | https://joelbinoy2021-sketch.github.io/fdrflow-sih/ | FDR Management Portal |
| `aicte-fdr-frontend.onrender.com` | https://aicte-fdr-frontend.onrender.com | 200; attribution ambiguous between `ayus0109` and `rigs29`; do not cite as a specific team |

### 6.2 Dead, broken, or timed out

| Repo | URL | Status |
|---|---|---|
| `PRAVEEN200624/FDR-GUARDIAN-SIH-2026-` | https://fdr-guardian-sih-2026.vercel.app | 500 (repo homepage) |
| `Panbhuarasane-A/aicte_sih_fdr` | https://aicte-fdr-api.onrender.com | 404/timeout (backend) |
| `rigs29`, `ayus0109`, `BBhargavKasiRam` configs | https://aicte-fdr-backend.onrender.com | Timeout (shared candidate URL) |
| `seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal` | https://sih26265-aicte-fdr-portal.onrender.com | Timeout (backend) |
| `Bkjoy/TRUST360` | https://trust360.onrender.com | Timeout (backend) |

### 6.3 GitHub Pages 404 (no deployment)

`harsha05-ui`, `marizxy`, `rupesh0411`, `Thatchu-yazh`, `devanshgupta52120-jpg`, `Vishal4536`, `tarun-agdi`, `ayushmahadik1256-max`, `BhaskarShah05`, `ishigami077-ui`, `Jayashree1627`, `abiappar27`, `dhina-514`, `Rocky132123`.

> **Do not cite a 404 URL in the PPT.** If a team has no live prototype, cite its GitHub repo only.

---

## 7. Policy and workflow audit

### 7.1 The seven capabilities that matter

1. **Table 1.4 matrix** — programme × level amounts, not a flat base.
2. **2026-27 addendum 50% concession** — NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only.
3. **Leased building/land ×2** — addendum wording.
4. **10-year hold + interest retained by AICTE** — principal vs. interest separation.
5. **Penalty engine** — 10%/20% late, 10% early/non-deposit, 10%/50% closure.
6. **Clause 6.46 release graph** — documents, PGRC, Vigilance, Grants/other cells, embezzlement NOC, converted-university complaints, progressive-closure/merger certificates, RTGS vs. FDR/RPGF routing, RPGF.
7. **Portfolio control** — maturity cash-flow forecast, ₹ at risk, pledge/duplicate graph, time machine, hash-chained audit.

### 7.2 Matrix

Legend: **Y** = implemented and visible; **P** = partial/illustrative; **N** = absent; **—** = not applicable.

| Capability | Shash | Kumudranjan | Panbhu | MR-JK | Harsha | Rohith | Retesh | SURAKSHA target |
|---|---|---|---|---|---|---|---|---|
| APH Table 1.4 matrix | P (editable norms) | **Y** | N (flat ₹35L) | P (draft) | N | N | N | **Y** |
| 2026-27 50% concession | N | N | **Y** | N | N | N | N | **Y** |
| Leased ×2 | P | **Y** | **Y** | P | N | N | N | **Y** |
| 10-year hold / interest retention | P | **Y** | P | **Y** | P | P | P | **Y** |
| Penalty engine | P | **Y** | **Y** | P | N | N | N | **Y** |
| 6.46 document set | P | P | P | **Y** | P | P | P | **Y** |
| PGRC / Vigilance / Grants | P (ICMS check) | P (Finance/Legal/Grievance) | P | **Y** | **Y** (5 offices) | P | P | **Y** |
| RPGF | N | N | N | **Y** | N | N | N | **Y** |
| Release eligibility graph | P (checklist) | P | P | **Y** | **Y** | P | P | **Y** |
| Maturity cash-flow forecast | N | P (calendar/protection gap) | N | **Y** | N | **Y** (heatmap) | P | **Y** |
| Pledge / duplicate graph | P (duplicate rule) | P (duplicate rule) | P | **Y** | P (lien) | **Y** (duplicate/reuse) | P | **Y** |
| Time machine | **Y** | **Y** | P | **Y** | P | **Y** | P | **Y** |
| Hash-chained audit | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** | **Y** |
| Live demo | **Y** | **Y** | Static | N | N | **Y** | **Y** | **Y** |
| Tests | 9 e2e | Eval + tests | 9 files | 80 files | 3 files | 19 files | 21 files | Focused policy + edge tests |

> **SURAKSHA column:** this is the required target, not a claim that it is already built. The repo currently contains the build pack and partial implementation; the prototype is not complete.

### 7.3 What this means

- **Table 1.4 is no longer unique.** `kumudranjan` has the full matrix. We must show the matrix *and* the 50% concession *and* the leased multiplier in one trace.
- **The 50% concession is unique to `Panbhu`** — but its base is flat and its backend is down. A working 50% trace on the correct matrix is still a real differentiator.
- **Release depth is contested.** `MR-JK` and `harsha05` have deeper release code than `Shash`; `varshukarthik` has PGRC/Vigilance/Finance. Our edge must be the *full 6.46 graph including RPGF and RTGS routing*, not “we have clearances.”
- **Forecast is contested.** `MR-JK` and `Rohith` already show forecast/heatmap views. Our edge is connecting the forecast to the policy requirement and the release pipeline, not a standalone chart.
- **Time machine and hash audit are table stakes.** `Shash`, `kumudranjan`, `MR-JK`, `Rohith`, and `Aashirwadaanand` already have them. Do not pitch them as unique.
- **Live polish matters.** `Shash` and `kumudranjan` have working demos. A deep but undemoable build (`MR-JK`, `harsha05`) loses to a working story. We must deploy early.

---

## 8. What each serious team built

### 8.1 `Shash1704/aicte-fdr-portal` — Team Varangians (live incumbent)

- Centralised SD/FDR/BG register keyed by AICTE Permanent ID.
- Three-way provenance per field: declared, document (PDF text layer/OCR), bank sandbox.
- Bank verification sandbox; accept-without-bank requires a written reason and is labelled officer-verified.
- Requirement norms are editable in Administration; README explicitly says amounts/periods are illustrative.
- Release: auto-checked conditions, officer → Director → Competent Authority → Accounts, release letter PDF, maker-checker-approver.
- Reminder ladder T-90/60/30/15/7/0, overdue notices, 3-level escalation, e-mail/SMS log.
- Maturity calendar, 10 reports, hash-chained audit with one-click integrity check, time machine.
- ICMS (PS SIH26264) complaint check before release.
- 9 e2e scenarios; browser-only GitHub Pages demo with seeded data.
- **Gap:** no 2026-27 addendum/50%, no full 6.46 graph/RPGF/interest/forecast/pledge graph.

### 8.2 `kumudranjan6127-debug/fdr-intelligence-hub` — closest policy competitor

- Verification-first portal: Claimed / Extracted / Confirmed tiers, always labelled.
- Renewal-chain X-ray: coverage gaps, amount drops, missing liens.
- Mock Account Aggregator bank sandbox with a TERM_DEPOSIT shape; Setu/Finvu planned.
- Verifiable NOC: SHA-256 anchored, QR, public `/verify/:code`, revocation, tamper check.
- APH rules + penalty engine: Table 1.4 by programme/level, lease doubling, government/aided exemption, 15-day Affidavit 3 with 10%/20% tiers, release deductions 50% (six-year no-EoA) or 10% (late closure/early encashment), 10-year term, interest to AICTE.
- Duplicate FDR detection: same file hash, same bank + FDR number, near-duplicate; renewal-chain members excluded.
- Protection gap, 12-month maturity calendar, institution risk score, unclaimed matured deposits finder, demo clock, hash-chained audit.
- Eval: 210 seeded cases, 110/110 planted defects caught, 0/70 false positives, 30/30 workflows.
- **Gap:** no 50% concession; no RPGF; clearance graph uses Finance/Legal/Grievance, not PGRC/Vigilance/Grants; no full cash-flow forecast; some rule amounts illustrative; NOC not digitally signed.

### 8.3 `Panbhuarasane-A/aicte_sih_fdr` — policy lead, broken demo

- Backend `rules_engine.py` + `config.py`: `DEFAULT_BASE_DEPOSIT=3500000.0`, `CONCESSION_MULTIPLIER=0.5`, `LEASED_LAND_MULTIPLIER=2.0`, `GRACE_DAYS=15`, `PENALTY_TIER_1_PCT=10.0`, `PENALTY_TIER_2_PCT=20.0`.
- Applies 50% for NE/J&K/Ladakh/A&N/Lakshadweep and women/PwD categories; lease ×2; late-deposit tiers.
- OCR/gate/screening, release workflow, deductions, audit, RBAC, RapidFuzz UTR matching.
- 27.3k LOC, 9 test files.
- **Gap:** flat ₹35L base, not Table 1.4; static frontend; backend 404/timeout; sign-in disabled; no full 6.46/PGRC/Vigilance/RPGF/forecast.

### 8.4 `MR-JK-37/aicte-fdr-portal` — deepest code, no demo

- ~72k LOC, 80 test files (632 backend tests claimed).
- 13-role RBAC + ABAC + Postgres RLS; separation of duties; SSE inbox; Ed25519 checkpoints; hash audit.
- Release graph, RPGF/PGRC/vigilance, 10-year lineage, bank/BG support.
- **Gap:** no live demo; README overclaims “zero simulation”; Table 1.4/penalties were draft/blocked in prior audit; no 50% addendum.

### 8.5 `harsha05-ui/AICTE-FDR-Portal-SIH-26265` — release depth, no demo

- Five-office release consensus: Regional Office → Approval Bureau → Grievance Cell → Vigilance Cell → Competent Authority.
- Regulatory holds (CBI/court/vigilance) block release; lien states; trust levels; encrypted documents; NOC PDF; bulk CSV.
- 29.8k LOC, 36 backend tests.
- **Gap:** almost no policy-amount logic; no 50%/penalties/RPGF/forecast; GitHub Pages 404.

### 8.6 `Rohith-Kumar-SS/nidhi-kavach` — strongest live generic

- Bank-signed QR receipts (Ed25519), smart receipt reading (PDF text + QR + OCR), trust ladder.
- Risk queue, protection gap, 12-month heatmap, duplicate/reuse detection.
- Bank verification API + nightly rechecks, release SLA, signed NOC, hash audit, demo clock, bilingual.
- ~62k LOC, 19 test files; live frontend + Render API (cold starts).
- **Gap:** no APH amounts/50%/penalties/RPGF/full 6.46.

### 8.7 `Retesh-Pandey/AICTE-FDR-VAULT` — strong live generic

- OCR of nine fields, simulated bank adapter, rule-based validation, duplicate checks.
- Maturity scheduler (30/15/7 days), renewal chain, release state machine, officer dashboard, Excel export.
- Fernet encryption, signed download URLs, 7-strike intake classification, hash audit, bilingual.
- ~26k LOC, 21 test files; live Vercel deployment.
- **Gap:** no policy amounts/50%/6.46/RPGF/forecast.

### 8.8 Tier 2 quick notes

- **`varshukarthik/nidhisetu`** — PGRC/Vigilance/Finance clearances, smart action queue, QR/signature checks, 69 tests. Its own README says the release checklist is not current policy. No demo.
- **`shree180/SIH26265`** — 96 tests, maker-checker release, five role dashboards, private documents, hash audit, CSV. No policy/demo.
- **`NemisysT/SIH26265`** — Next.js/Prisma, versioned docs, discrepancy engine, release, DB-trigger audit, Playwright. No policy/demo.
- **`Bkjoy/TRUST360`** — live OCR, duplicate, maturity, three-tier release, audit. No policy.
- **`BBhargavKasiRam/TrustLedger`** — live ELA/pHash/Gemini forensics, three-tier bank verification, DAG lineage, four-gate release, time travel. No tests/policy.
- **`BhaskarShah05/Fintrack`** — live dual-truth, NeSL/e-BG, 6.46 release gate, WORM audit; JSON DB, 0 tests, no 50%.
- **`codecruncher0723`** — 37k LOC, 28 tests, strong RBAC/IDOR/provenance/versioning/release. No README/demo/policy.
- **`coderkartik7`** — PDF signature/QR/ELA, ML risk, liability forecast, hash audit, 27 tests. No demo/policy.
- **`Sanjeev-Sivakumar/AetherVault`** — three-way CBS/SFMS, trust score, maker-checker, 10-year lineage, self-healing Merkle audit. No demo/policy.
- **`marizxy/KOSH-RAKSHAK`** — four personas, bank node, five-gate release, ELA/CBS stubs; wrong 8-year lock-in; no live.
- **`dipesh4000/KoshSetu-SIH`** — live FastAPI/React, OCR, AES-GCM, CSV import, audit, 10 tests. No policy.
- **`rigs29/NidhiSync-AICTE`** — live AWS-native maturity/renewal/release/RBAC/audit. No policy.
- **`deepmaha2006/fd-portal`** — live Next.js/MongoDB, seven roles, audit, reminders. No policy.
- **`adityakumargupta27/sih-project-265`** — live TanStack repository/verification/maturity radar/three-stage release. No policy.
- **`Aashirwadaanand/fdr`** — live Express/React, 25 tests, RBAC, hash audit, time machine, release. No policy.
- **`eags-aayush/SIH26265`** — live Next/Supabase, dual-source badges, discrepancy, cron simulator, release. No policy.
- **`ammuelsa17-ui/kosh-pramaan`** — live small Express/Postgres lifecycle, 7 tests. No policy.
- **`chatgptofficial03/deposit-flow`** — live six-stage submission, OCR/SFMS mock, maturity/time machine, release. No policy.
- **`krsahilara`, `seetha`, `shampatil`, `ayushmahadik`, `ayus0109`, `joel`, `aishee`, `Rao`** — live generic portals; no meaningful policy depth.

---

## 9. Implications for SURAKSHA

### 9.1 The moat is real but narrower

The original thesis was: “most teams use illustrative norms; we encode the actual APH and 2026-27 addendum.” That is still true for most teams, but not for all.

- **`kumudranjan`** already encodes Table 1.4, lease ×2, penalties, interest retention, and 6.46 citations.
- **`Panbhu`** already encodes the 50% concession.
- **`MR-JK`** and **`harsha05`** already encode deep release workflows.
- **`Rohith`** and **`MR-JK`** already show forecast/heatmap views.

The remaining white space is **the integrated trace**:

> 2026-27 50% concession → Table 1.4 matrix → leased ×2 → 10-year/interest → penalty exposure → 6.46 release graph including RPGF → maturity cash-flow forecast → time machine → hash-chained audit.

No repo shows that entire chain in one demo. That is the product thesis to defend.

### 9.2 Claims we can still own

Use these, with evidence, as of 28 October 2026:

1. **“The only working demo that shows the 2026-27 50% concession on the correct Table 1.4 matrix, with the lease multiplier and the clause citation in one trace.”** `Panbhu` has the concession but flat base and a broken backend; `kumudranjan` has the matrix but no concession.
2. **“The only working demo whose release graph models RPGF alongside FDR/RTGS and routes NOC vs. sanction order under 6.46.”** `MR-JK` has RPGF code but no demo; `harsha05` has five offices but no RPGF.
3. **“The only working demo that connects the policy requirement, the release blockers, and the ₹ maturity forecast in one portfolio view.”** `Rohith` has a heatmap but no policy; `MR-JK` has forecast but no demo.
4. **“The only demo with a base-vs-addendum policy diff screen.”** We did not find a competitor that shows a versioned policy diff with clause citations.
5. **“The only demo that lets the jury advance the clock and watch maturity, escalation, renewal, and release eligibility change together.”** Time machines exist, but not tied to the full policy/release/forecast chain.

### 9.3 Claims to stop using

- “Only we read the APH.” — False; `kumudranjan` and `Panbhu` read it.
- “Only we have Table 1.4.” — False; `kumudranjan` has it.
- “Only we have the 50% concession.” — False; `Panbhu` has it.
- “Only we have a release graph.” — False; `MR-JK`, `harsha05`, `varshukarthik` have variants.
- “Only we have a forecast.” — False; `Rohith`, `MR-JK`, `coderkartik7` have variants.
- “Only we have duplicate detection.” — False; `Shash`, `kumudranjan`, `Rohith`, `Panbhu` have it.
- “Only we have a hash-chained audit.” — False; many have it.
- “No one else has a live demo.” — False; 25 live URLs (24 clean, 1 ambiguous).

### 9.4 Demo priorities (in order)

1. **Policy trace:** institution is an Engineering UG in a NE state with leased land. Show base ₹35L → 50% concession ₹17.5L → leased ×2 ₹35L, with clause citations; switch to owned land to show ₹17.5L; switch to non-NE to show ₹70L. This is the single strongest 60 seconds.
2. **Release graph:** matured deposit, release blocked by PGRC complaint + missing Vigilance clearance + RPGF proof missing. Show the graph, the blocker owners, the clause citations. Clear them; maker-checker-approver; generate NOC vs. RTGS sanction order.
3. **Forecast + time machine:** advance 90 days; show maturity, renewal reminders, escalation, ₹ at risk, and the effect on the release queue.
4. **Pledge graph:** one FDR pledged to two institutions; show duplicate instrument number/file hash and block acceptance.
5. **Audit verify:** click verify; show hash chain; export.

If time is short, cut the pledge graph and eSign, not the policy trace or release graph.

### 9.5 Competitive risks

- **`kumudranjan` is one feature away from closing the policy gap.** If they add the 50% concession and RPGF, their live demo + eval + policy depth becomes the strongest overall. We must ship the integrated trace before they do.
- **`Shash1704` has the distribution advantage.** Polished live demo, clear narrative, 9 e2e scenarios. If the jury values polish over policy depth, they win. We need a working deploy early, not a last-night build.
- **`Panbhu` has the policy headline but a broken demo.** If they fix the backend and add Table 1.4, they become a direct threat. Do not assume they stay broken.
- **`MR-JK` and `harsha05` have depth but no demo.** If either deploys, they become Tier 1.5. Our advantage is demoability; protect it.
- **`Rohith` and `Retesh` have strong live generic products.** If the jury does not care about policy, they are dangerous. Our story must make policy feel like money, not compliance trivia.

### 9.6 What to put in the PPT (one line each)

- **Problem:** ₹35L–₹70L per institution, 10-year hold, interest retained, release blocked by multiple clearances, penalties up to 50%.
- **Gap:** portals store FDRs; they do not prove the amount, the lien, the release eligibility, or the portfolio risk.
- **Solution:** policy-native control tower; 50% concession on Table 1.4; full 6.46 release graph; RPGF; forecast; time machine; audit.
- **Proof:** one trace from policy to release; one blocked release; one forecast; one audit verify.
- **Honesty:** bank/AICTE/complaint integrations are labelled sandbox/mock; production needs MoUs.
- **Moat:** the integrated policy-to-release-to-forecast chain, not a feature checklist.

---

## 10. Full inventory (78 repos)

Legend: **T1** Tier 1, **T2** Tier 2, **T3** Tier 3, **T4** Tier 4/empty/duplicate. “Created” is GitHub creation date where known; “last push” is the latest commit date. LOC excludes dependencies/build output.

| # | Repo | Created | Live | LOC / tests | Tier | Note |
|---:|---|---|---|---:|---|---|
| 1 | [`Shash1704/aicte-fdr-portal`](https://github.com/Shash1704/aicte-fdr-portal) | 24 Oct | [demo](https://shash1704.github.io/aicte-fdr-portal/) | 8,118 / 1 file (9 e2e) | T1 | Live incumbent; editable norms; no addendum |
| 2 | [`MR-JK-37/aicte-fdr-portal`](https://github.com/MR-JK-37/aicte-fdr-portal) | 25 Oct | None | 71,869 / 80 | T1 | Deepest code; no demo; draft policy |
| 3 | [`kumudranjan6127-debug/fdr-intelligence-hub`](https://github.com/kumudranjan6127-debug/fdr-intelligence-hub) | 26 Oct | [demo](https://fdr-intelligence-hub.vercel.app) | 14,656 / 6 | T1 | Closest policy competitor; live |
| 4 | [`Panbhuarasane-A/aicte_sih_fdr`](https://github.com/Panbhuarasane-A/aicte_sih_fdr) | 24 Oct | [static](https://panbhuarasane-a.github.io/aicte_sih_fdr/) | 27,293 / 9 | T1 | Real 50%; flat base; backend down |
| 5 | [`harsha05-ui/AICTE-FDR-Portal-SIH-26265`](https://github.com/harsha05-ui/AICTE-FDR-Portal-SIH-26265) | 28 Oct | None | 29,785 / 3 test files | T1 | Five-office release; no policy |
| 6 | [`Rohith-Kumar-SS/nidhi-kavach`](https://github.com/Rohith-Kumar-SS/nidhi-kavach) | 27 Oct | [demo](https://rohith-kumar-ss.github.io/nidhi-kavach/) | 21,809 site + 40,140 server / 19 | T1 | Live generic; signed QR; forecast |
| 7 | [`Retesh-Pandey/AICTE-FDR-VAULT`](https://github.com/Retesh-Pandey/AICTE-FDR-VAULT) | 23 Oct | [demo](https://aicte-fdr-valut.vercel.app) | 26,128 / 21 | T1 | Live generic; OCR/bank/release |
| 8 | [`varshukarthik/nidhisetu`](https://github.com/varshukarthik/nidhisetu) | 27 Oct | None | 21,358 / 6 (69 tests) | T2 | PGRC/Vigilance/Finance checklist |
| 9 | [`shree180/SIH26265`](https://github.com/shree180/SIH26265) | 26 Oct | None | 19,382 / 12 (96 tests) | T2 | Maker-checker; five dashboards |
| 10 | [`NemisysT/SIH26265`](https://github.com/NemisysT/SIH26265) | 26 Oct | None | 11,150 / 7 | T2 | Next/Prisma; discrepancy; audit |
| 11 | [`Bkjoy/TRUST360`](https://github.com/Bkjoy/TRUST360) | 26 Oct | [demo](https://trust-360-tan.vercel.app) | 15,208 / 3 (8 tests) | T2 | Live OCR/duplicate/release |
| 12 | [`BBhargavKasiRam/TrustLedger`](https://github.com/BBhargavKasiRam/TrustLedger) | 24 Oct | [demo](https://trust-ledger-indol.vercel.app) | 21,697 / 0 | T2 | Live forensics/4-gate release |
| 13 | [`BhaskarShah05/Fintrack`](https://github.com/BhaskarShah05/Fintrack) | 27 Oct | [demo](https://fintrack-mu-bay.vercel.app) | 14,151 / 0 | T2 | 6.46 gate; JSON DB; no tests |
| 14 | [`codecruncher0723/aicte-fdr-portal`](https://github.com/codecruncher0723/aicte-fdr-portal) | 23 Oct | None | 36,862 / 28 | T2 | Strong RBAC/provenance; no demo |
| 15 | [`coderkartik7/SIH26265_FDR-Sentinel`](https://github.com/coderkartik7/SIH26265_FDR-Sentinel) | 26 Oct | None | 11,896 / 8 (27 tests) | T2 | Forensics/ML/forecast |
| 16 | [`Sanjeev-Sivakumar/AetherVault`](https://github.com/Sanjeev-Sivakumar/AetherVault) | 27 Oct | None | 12,857 / 0 | T2 | CBS/SFMS; Merkle audit |
| 17 | [`marizxy/KOSH-RAKSHAK`](https://github.com/marizxy/KOSH-RAKSHAK) | 28 Oct | None | 19,865 / 6 | T2 | Wrong 8-year lock-in; frontend-heavy |
| 18 | [`dipesh4000/KoshSetu-SIH`](https://github.com/dipesh4000/KoshSetu-SIH) | 27 Aug | [demo](https://koshsetu-sih.vercel.app) | 20,767 / 10 | T2 | Live FastAPI/React |
| 19 | [`nishikadhankhar/koshsetu-sih`](https://github.com/nishikadhankhar/koshsetu-sih) | 26 Oct | [demo](https://koshsetu-sih.vercel.app) | 17,614 / 5 | T2 | Mirror of KoshSetu |
| 20 | [`rigs29/NidhiSync-AICTE`](https://github.com/rigs29/NidhiSync-AICTE) | 27 Oct | [demo](https://nidhi-sync.vercel.app) | 15,870 / 2 | T2 | Live AWS-native |
| 21 | [`deepmaha2006/fd-portal`](https://github.com/deepmaha2006/fd-portal) | 27 Oct | [demo](https://fd-portal-kohl.vercel.app) | 12,781 / 9 | T2 | Live Next/MongoDB |
| 22 | [`adityakumargupta27/sih-project-265`](https://github.com/adityakumargupta27/sih-project-265) | 27 Oct | [demo](https://aictefdr.vercel.app/) | 8,982 / 1 | T2 | Live TanStack |
| 23 | [`Aashirwadaanand/fdr`](https://github.com/Aashirwadaanand/fdr) | 27 Oct | [demo](https://fdr-ruddy.vercel.app) | 13,935 / 4 (25 tests) | T2 | Live Express/React |
| 24 | [`eags-aayush/SIH26265`](https://github.com/eags-aayush/SIH26265) | 27 Oct | [demo](https://sih2626501.vercel.app) | 7,000 / 0 | T2 | Live Next/Supabase |
| 25 | [`ammuelsa17-ui/kosh-pramaan`](https://github.com/ammuelsa17-ui/kosh-pramaan) | 28 Oct | [demo](https://kosh-pramaan.vercel.app) | 6,096 / 7 | T2 | Live small Express/Postgres |
| 26 | [`chatgptofficial03/deposit-flow`](https://github.com/chatgptofficial03/deposit-flow) | 27 Oct | [demo](https://deposit-flow-five.vercel.app) | 8,337 / 0 | T2 | Live six-stage |
| 27 | [`krsahilara-png/AICTE-FDR-Management-Portal`](https://github.com/krsahilara-png/AICTE-FDR-Management-Portal) | 27 Oct | [demo](https://aicte-fdr-management-portal.vercel.app) | 5,698 / 0 | T2 | Live generic |
| 28 | [`seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal`](https://github.com/seethareddysathi9-ui/SIH26265-AICTE-FDR-Portal) | 25 Oct | [demo](https://sih-26265-aicte-fdr-portal.vercel.app) | 4,701 / 0 | T2 | Live generic |
| 29 | [`shampatil23/ZeroDrop_SIH26265`](https://github.com/shampatil23/ZeroDrop_SIH26265) | 27 Oct | [demo](https://zerodropsih.vercel.app) | 9,203 / 0 | T2 | Live generic |
| 30 | [`ayushmahadik1256-max/TrackTitans`](https://github.com/ayushmahadik1256-max/TrackTitans) | 24 Oct | [demo](https://track-titans-gules.vercel.app) | 9,944 / 0 | T2 | Live escrow/Firebase |
| 31 | [`ayus0109/AICTE-FDR-portal`](https://github.com/ayus0109/AICTE-FDR-portal) | 21 Oct | [demo](https://aicte-fdr-portal.vercel.app) | 9,145 / 1 | T2 | Live generic; copied README |
| 32 | [`joelbinoy2021-sketch/fdrflow-sih`](https://github.com/joelbinoy2021-sketch/fdrflow-sih) | 24 Oct | [demo](https://joelbinoy2021-sketch.github.io/fdrflow-sih/) | 5,177 / 0 | T2 | Live GitHub Pages |
| 33 | [`aisheechowdhury19801977-create/SecureFDR`](https://github.com/aisheechowdhury19801977-create/SecureFDR) | 20 Oct | [demo](https://secure-fdr.vercel.app) | 2,302 / 0 | T2 | Live small |
| 34 | [`Rao-dev1/aicte-fdr`](https://github.com/Rao-dev1/aicte-fdr) | 27 Oct | [demo](https://aicte-fdr.vercel.app) | 4,203 / 3 | T2 | Live Next/FastAPI |
| 35 | [`Aviral-P/fdr-sentinel`](https://github.com/Aviral-P/fdr-sentinel) | 28 Oct | None | 12,052 / 21 | T2 | Local; 21 test files |
| 36 | [`Vishal4536/aicte-fdr-portal`](https://github.com/Vishal4536/aicte-fdr-portal) | 27 Oct | None | 13,314 / 1 | T3 | Single-file React; localStorage |
| 37 | [`PRAVEEN200624/FDR-GUARDIAN-SIH-2026-`](https://github.com/PRAVEEN200624/FDR-GUARDIAN-SIH-2026-) | 27 Oct | [500](https://fdr-guardian-sih-2026.vercel.app) | 17,539 / 1 | T3 | Broken demo |
| 38 | [`rupesh0411/Sanjievani-SECUREFLOW-SIH26265`](https://github.com/rupesh0411/Sanjievani-SECUREFLOW-SIH26265) | 28 Oct | None | 11,380 / 0 | T3 | Frontend mock |
| 39 | [`YuveshxD/Fidara-Fibot-SIH`](https://github.com/YuveshxD/Fidara-Fibot-SIH) | 28 Oct | None | 409 / 0 | T3 | Very small |
| 40 | [`jer27ush-del/sih26265`](https://github.com/jer27ush-del/sih26265) | 27 Oct | None | 3,334 / 6 | T3 | No verified demo |
| 41 | [`Thatchu-yazh/aicte-centralised-fdr-portal`](https://github.com/Thatchu-yazh/aicte-centralised-fdr-portal) | 27 Oct | None | 1,606 / 0 | T4 | Small Flask |
| 42 | [`abiappar27/NidhiSetu`](https://github.com/abiappar27/NidhiSetu) | 26 Oct | None | 582 / 1 | T4 | Small Flask |
| 43 | [`Mahith269/SIH26265`](https://github.com/Mahith269/SIH26265) | 27 Oct | None | 237 / 0 | T4 | Tiny |
| 44 | [`Soniya561/SIH26265`](https://github.com/Soniya561/SIH26265) | 28 Oct | None | 1,858 / 0 | T3 | Frontend |
| 45 | [`VINIYOJAN/VINIYOJAN-SIH-2026`](https://github.com/VINIYOJAN/VINIYOJAN-SIH-2026) | 24 Oct | None | 639 / 2 | T4 | Tiny |
| 46 | [`karthikeyar85-netizen/fdr-management-portal`](https://github.com/karthikeyar85-netizen/fdr-management-portal) | 27 Oct | None | 1,287 / 0 | T4 | Tiny |
| 47 | [`Rocky132123/AICTE-FDR-Management-Portal`](https://github.com/Rocky132123/AICTE-FDR-Management-Portal) | 27 Oct | None | 9,624 / 4 | T3 | No demo |
| 48 | [`devanshgupta52120-jpg/AICTE-FDR-PORTAL`](https://github.com/devanshgupta52120-jpg/AICTE-FDR-PORTAL) | 26 Oct | None | 9,555 / 0 | T3 | No demo |
| 49 | [`dhina-514/aicte-fdr`](https://github.com/dhina-514/aicte-fdr) | 26 Oct | None | 10,098 / 0 | T3 | No demo |
| 50 | [`AryanRao10/vaultguard-sih26265`](https://github.com/AryanRao10/vaultguard-sih26265) | 21 Oct | None | 499 / 0 | T4 | Boilerplate |
| 51 | [`ankit-kuntal/AICTE-FDR-Management-Portal`](https://github.com/ankit-kuntal/AICTE-FDR-Management-Portal) | 22 Oct | None | 576 / 0 | T4 | Tiny |
| 52 | [`Juzt-nik/Project-BluePrint`](https://github.com/Juzt-nik/Project-BluePrint) | 22 Oct | None | 2,395 / 6 | T4 | Small |
| 53 | [`ruck-syu/aicte-fdr-portal`](https://github.com/ruck-syu/aicte-fdr-portal) | 23 Oct | None | 13,146 / 5 | T3 | No demo |
| 54 | [`vedipanj115/fdr-portal`](https://github.com/vedipanj115/fdr-portal) | 24 Oct | None | 2,056 / 0 | T4 | Tiny |
| 55 | [`knrcreddy25/aicte-fdr-portal`](https://github.com/knrcreddy25/aicte-fdr-portal) | 25 Oct | None | 2,965 / 1 | T4 | Small |
| 56 | [`subhankar235/SIH26265`](https://github.com/subhankar235/SIH26265) | 24 Oct | None | README | T4 | README only |
| 57 | [`vaibhav94571/aicte-fdr-portal`](https://github.com/vaibhav94571/aicte-fdr-portal) | 25 Oct | None | README | T4 | README only |
| 58 | [`arun-vishal/SIH-Security-Deposit-FDR-Portal`](https://github.com/arun-vishal/SIH-Security-Deposit-FDR-Portal) | 27 Oct | None | Zip | T4 | Zip only |
| 59 | [`darsh1m5/FDR-PORTAL-SIH-26265`](https://github.com/darsh1m5/FDR-PORTAL-SIH-26265) | 28 Oct | None | Zip | T4 | Zip only |
| 60 | [`ridamgupta79-dev/fdr-sentinel`](https://github.com/ridamgupta79-dev/fdr-sentinel) | 28 Oct | None | 8,181 / 4 | T3 | No demo |
| 61 | [`zaaramariyam441-gif/fdr-smart-track`](https://github.com/zaaramariyam441-gif/fdr-smart-track) | 27 Oct | None | 1,441 / 1 | T4 | Small |
| 62 | [`sanjushreeg/aicte-fdr-portal`](https://github.com/sanjushreeg/aicte-fdr-portal) | 27 Oct | None | 8,979 / 8 | T3 | No demo |
| 63 | [`PORSELVI04/aicte-fdr-guardian`](https://github.com/PORSELVI04/aicte-fdr-guardian) | 26 Oct | None | 6,539 / 0 | T3 | No demo |
| 64 | [`ishigami077-ui/FDRFlow`](https://github.com/ishigami077-ui/FDRFlow) | 27 Oct | None | 5,813 / 0 | T3 | No demo |
| 65 | [`Jayashree1627/AICTE-FDR-Management-Portal`](https://github.com/Jayashree1627/AICTE-FDR-Management-Portal) | 24 Oct | None | 3,596 / 0 | T4 | No demo |
| 66 | [`neerajsongade25-ops/AICTE-FDR-Management-Portal`](https://github.com/neerajsongade25-ops/AICTE-FDR-Management-Portal) | 24 Oct | None | 5,698 / 0 | T4 | Copy of krsahilara |
| 67 | [`tarun-agdi/smartfdr-ai`](https://github.com/tarun-agdi/smartfdr-ai) | 25 Oct | None | 5,185 / 0 | T4 | No demo |
| 68 | [`allenthavar7/aicte-fdr-portal`](https://github.com/allenthavar7/aicte-fdr-portal) | 25 Oct | None | 19,327 / 2 | T3 | No demo |
| 69 | [`Sanjana-2508/SecureFDR`](https://github.com/Sanjana-2508/SecureFDR) | 25 Oct | None | 1,297 / 0 | T4 | Tiny |
| 70 | [`SaiGadwe/NIDHIVA-Institutional-Security-Deposit-Management-Portal`](https://github.com/SaiGadwe/NIDHIVA-Institutional-Security-Deposit-Management-Portal) | 26 Oct | None | 3,422 / 0 | T3 | No demo |
| 71 | [`PRAVEEN200624/SIH-2026-FDR-GUARDIAN-PORTAL-`](https://github.com/PRAVEEN200624/SIH-2026-FDR-GUARDIAN-PORTAL-) | 27 Oct | None | 118 / 0 | T4 | Duplicate |
| 72 | [`PRAVEEN200624/SIH-2026-FDR-GUARDIAN-`](https://github.com/PRAVEEN200624/SIH-2026-FDR-GUARDIAN-) | 27 Oct | None | 0 | T4 | Duplicate/empty |
| 73 | [`VINIYOJAN/viniyojan`](https://github.com/VINIYOJAN/viniyojan) | 25 Oct | None | 0 | T4 | Empty |
| 74 | [`knrcreddy25/depositdesk-sih`](https://github.com/knrcreddy25/depositdesk-sih) | — | None | 0 | T4 | Empty |
| 75 | [`dharshan188/NIDHIVEDA-SIH26265-AICTE-FDR-Management`](https://github.com/dharshan188/NIDHIVEDA-SIH26265-AICTE-FDR-Management) | — | None | 0 | T4 | Empty |
| 76 | [`Sampada-06/AICTE-FDR-portal`](https://github.com/Sampada-06/AICTE-FDR-portal) | — | None | 0 | T4 | Empty |
| 77 | [`dj7455230/AICTE-FDR-PORTAL`](https://github.com/dj7455230/AICTE-FDR-PORTAL) | — | None | 0 | T4 | Empty |
| 78 | [`Rohith-Kumar-SS/nidhi-kavach-server`](https://github.com/Rohith-Kumar-SS/nidhi-kavach-server) | 27 Oct | [API](https://nidhi-kavach.onrender.com/api/docs) | 40,140 / 19 | T1 | Backend of Nidhi Kavach |

---

## 11. Caveats

1. **HTTP 200 is not functional proof.** We did not log into every demo or complete every workflow. Some Vercel deployments are frontend-only with seeded data.
2. **LOC and test-file counts are approximate.** They exclude dependencies/build output but include committed vendored assets in some repos. Test files are not test cases.
3. **GitHub metadata is incomplete for 20 repos.** Creation dates for those come from clone/last-commit dates and may be later than actual creation.
4. **Some repos are mirrors or copies.** `nishikadhankhar/koshsetu-sih` mirrors `dipesh4000/KoshSetu-SIH`; `neerajsongade25-ops` copies `krsahilara`; `PRAVEEN200624` has duplicate repos; `Rohith` has site + server.
5. **Attribution of `aicte-fdr-frontend.onrender.com` is ambiguous.** READMEs for `ayus0109` and `rigs29` are identical/copied; do not cite it as a specific team.
6. **Policy claims are from code/README inspection, not legal review.** The APH and 2026-27 addendum remain the source of truth; our own `context.md` §4 and `26265.md` §4 govern SURAKSHA’s claims.
7. **The field is moving daily.** New repos appeared on 28 October. Re-run the search before the final PPT if time permits; do not rely on this snapshot for live counts.
8. **The 25 October idea count (13/500) is stale.** Do not present it as current. Use “double-digit ideas and rising” unless a fresher official screenshot is available.

---

## 12. Bottom line

- The SIH26265 field is real, crowded, and technically stronger than the 25 October audit suggested.
- `Shash1704` is still the strongest *demo*; `kumudranjan` is the strongest *policy* competitor; `Panbhu` has the 50% headline but a broken demo; `MR-JK` and `harsha05` have the deepest *release* code but no demo.
- SURAKSHA’s win condition is not “more features.” It is **one coherent, working, evidence-linked trace from the 2026-27 policy to a release decision and a portfolio forecast**.
- Build the policy trace and release graph first. Deploy early. Label every simulation. Do not claim a moat that a competitor already has.
