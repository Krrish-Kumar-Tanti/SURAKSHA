# SURAKSHA — AICTE Security Deposit Control Tower (SIH26265)

> **SIH 2026 problem statement:** SIH26265 — Streamline of Security Deposit / FDR Portal.  
> **Scope:** Full-stack operational prototype with FastAPI backend, Core Banking adapters, and React/Tailwind/GSAP control tower cockpit.

---

## 🚀 Quick Start for Team Members

Follow these two simple steps to run the complete system locally:

### 1. Start the React Frontend (Port 3000)
```bash
# From repository root:
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Start the FastAPI Backend (Port 8000)
```bash
# In a second terminal window:
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Live Backend Health: **[http://localhost:8000/health](http://localhost:8000/health)**
- Interactive OpenAPI Docs: **[http://localhost:8000/docs](http://localhost:8000/docs)**

---

## What it is

SURAKSHA is a policy-native security-deposit control tower for AICTE. It is not only an FDR upload portal. It proves that every deposit is:

- **real** — declared vs document vs bank, field by field;
- **correctly sized** — APH Table 1.4, 2026-27 concessions, leased multiplier, exemptions;
- **continuously pledged** — duplicate instrument/file, lien, maturity and renewal lineage;
- **safe to release** — Clause 6.46 eligibility graph, clearances, no open critical discrepancy, maker-checker-approver, NOC/sanction;
- **auditable** — hash-chained events and evidence-linked decisions.

**Working thesis:** most teams build a portal that stores FDRs. SURAKSHA builds the compliance brain that can defend a release.

---

## Build pack — read all four

| File | Owns |
|---|---|
| [01_BACKEND.md](build/01_BACKEND.md) | Policy, schema, API, workflows, audit, integrations |
| [02_FRONTEND.md](build/02_FRONTEND.md) | UX, routes, screens, components, client state |
| [03_DATA_QA.md](build/03_DATA_QA.md) | Seed fixtures, tests, acceptance, QA gate |
| [04_DELIVERY.md](build/04_DELIVERY.md) | Pack index, PPT, demo, claims, ownership, runbook |

All four files are shared with every teammate. Each person owns one domain but must read the other three as contracts. Do not distribute one file per person.

---

## Policy truth

- **APH 2024-27 + Addendum/Corrigendum 2026-27**, not illustrative norms.
- Table 1.4: Engineering 15/35/15; Management —/5/15; Computer Applications —/5/15 ₹ lakh.
- 10-year hold; AICTE retains interest; only principal is refundable.
- 50% concession for NE/J&K/Ladakh/Aspirational Districts/A&N/Lakshadweep/women-only/PwD-only institutions.
- Leased building/land: ×2.
- Penalties: 10%/20% late; 10% early/non-deposit; 10%/50% closure.
- Clause 6.46 release nodes: documents; PGRC; Vigilance; Grants/other cells; conditional embezzlement, converted-university, progressive-closure and merger checks; RTGS routing.
- Joint FDR wording: Secretary of the Trust/Society/Company **and AICTE**.

Source of truth: [`context.md`](context.md) §4 and [`26265.md`](26265.md) §4. If a claim is not in the claim registry in `build/04_DELIVERY.md` §3, it is not approved for the PPT. Where `26265.md`'s earlier demo sequence differs from the pack, `build/03_DATA_QA.md` and `build/04_DELIVERY.md` control.

---

## Repository map

| Path | Purpose |
|---|---|
| [`context.md`](context.md) | Domain facts, PS briefs, decision matrix, winning plan |
| [`26265.md`](26265.md) | Product/build brief and policy detail |
| [`opponent.md`](opponent.md) | Competitor inventory and differentiation |
| [`enhancement.md`](enhancement.md) | Audited reuse plan; ideas only, not policy truth |
| [`existing-official-sites.md`](existing-official-sites.md) | As-is AICTE/system research |
| [`architecture.md`](architecture.md) | As-is architecture research; unverified estimates are quarantined |
| [`build/`](build/) | Four implementation/delivery contracts |
| `agent_talking.md` | Local agent handoff; keep out of the public repo |
| `competitor/` | Local partial clones; untracked and not for commit |

---

## Prototype boundary

- Synthetic institutions, instruments, documents, complaints and bank sandbox.
- Bank, AICTE, PGRC, Vigilance, Grants, DigiLocker/eSign, payments and notifications are **MOCK/SANDBOX/SIMULATED**.
- The policy engine, workflow, release graph, audit chain and UI will be real code; the prototype is not built yet.
- Production access requires AICTE sign-off, bank/API agreements, security review and legal review.
- No real institutional or financial data in the repo.

---

## Team

- **Lead architect / owner:** Krrish Kumar Tanti
- **Build owners:** Backend Lead, Frontend Lead, Data/QA Lead, Presenter/Integrator
- **Recommended shape:** 5 tech + 1 presenter/QA; if 4 tech, one owner per file; if 5 tech, one shadows backend/frontend; never split a file.

---

## Immediate next step

1. Read all four build files.
2. Freeze the shared contracts.
3. Build in the order: schema + policy → provenance → release graph → time machine → pledge/forecast → audit.
4. Run the 7-minute demo twice.
5. Submit the six-slide idea PPT by **28 October 2026**.
