import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Scale, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

export function CockpitPreview() {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'provenance' | 'calculator' | 'graph'>('portfolio');

  // Policy calculator states
  const [programme, setProgramme] = useState('Engineering UG');
  const [isLeased, setIsLeased] = useState(true);
  const [isConcession, setIsConcession] = useState(false);

  // Provenance states
  const [dispositionWaived, setDispositionWaived] = useState(false);

  // Release graph states
  const [pgrcCleared, setPgrcCleared] = useState(false);
  const [vigilanceCleared, setVigilanceCleared] = useState(false);
  const [grantsCleared, setGrantsCleared] = useState(true);

  // Calculate live amount
  const baseAmount = programme === 'Engineering UG' ? 35 : programme === 'Management' ? 15 : 15;
  const concessionFactor = isConcession ? 0.5 : 1.0;
  const leasedFactor = isLeased ? 2.0 : 1.0;
  const requiredAmount = baseAmount * concessionFactor * leasedFactor;

  return (
    <div className="relative mx-auto max-w-[1300px] px-4 sm:px-6 z-10 -mt-6">
      {/* Underlying Neon Backdrop Blur Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[320px] bg-gradient-to-r from-teal-500/20 via-blue-600/25 to-purple-600/20 blur-[90px] pointer-events-none rounded-3xl" />

      {/* Main Cockpit Card with Framer Glass & Inset Border */}
      <div className="relative rounded-2xl bg-[#0f172a]/90 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
        
        {/* Cockpit Card Header Tabs */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#111a2b]/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Live Control Tower Cockpit
            </div>
            <span className="text-xs text-slate-400 hidden sm:inline font-mono">
              Synthetic data · Simulated sandbox
            </span>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#0b1220] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'portfolio' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Executive Portfolio
            </button>
            <button
              onClick={() => setActiveTab('provenance')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'provenance' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. 3-Way Provenance
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'calculator' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Policy Engine
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'graph' ? 'bg-[#1e293b] text-white shadow-sm font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Clause 6.46 Graph
            </button>
          </div>
        </div>

        {/* Tab 1: Executive Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="p-6 lg:p-8 space-y-6">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#172338]/80 border border-white/5">
                <div className="text-[11px] font-mono uppercase text-slate-400">Total ₹ Held</div>
                <div className="text-2xl font-black text-white mt-1">₹24.85 Cr</div>
                <div className="text-[11px] text-teal-400 flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> 142 Active Deposits
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                <div className="text-[11px] font-mono uppercase text-red-300">₹ at Risk</div>
                <div className="text-2xl font-black text-red-400 mt-1">₹70,00,000</div>
                <div className="text-[11px] text-red-400/80 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> 1 Critical Discrepancy
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#172338]/80 border border-white/5">
                <div className="text-[11px] font-mono uppercase text-slate-400">Expiring in 90 Days</div>
                <div className="text-2xl font-black text-amber-300 mt-1">12 FDRs</div>
                <div className="text-[11px] text-slate-400 mt-1">T-Minus Automated Alerts</div>
              </div>

              <div className="p-4 rounded-xl bg-[#172338]/80 border border-white/5">
                <div className="text-[11px] font-mono uppercase text-slate-400">Pending Clearances</div>
                <div className="text-2xl font-black text-teal-300 mt-1">8 Releases</div>
                <div className="text-[11px] text-slate-400 mt-1">Under Clause 6.46 DAG</div>
              </div>
            </div>

            {/* Critical At-Risk Deposit Highlight */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">SIT Pune (1-1092847291)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 font-bold">
                      CRITICAL_AMOUNT_MISMATCH
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Declared ₹70,00,000 vs Bank Sandbox confirmed balance of ₹35,00,000. Release is blocked.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('provenance')}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold text-xs flex items-center gap-2 transition shrink-0 shadow-lg shadow-red-500/20"
              >
                Inspect 3-Way Match <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: 3-Way Provenance Scanner */}
        {activeTab === 'provenance' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">Three-Way Provenance Reconciliation</h4>
                <p className="text-xs text-slate-400">Instrument: FDR-SIT-2016-001 · State Bank of India</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  dispositionWaived ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-red-500/15 text-red-300 border border-red-500/30'
                }`}>
                  {dispositionWaived ? 'WAIVED_BY_DIRECTOR' : 'CRITICAL_DISCREPANT'}
                </span>
              </div>
            </div>

            {/* 3-Way Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#172338] text-slate-300 border-b border-white/10 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Field</th>
                    <th className="py-3 px-4">1. Declared (College)</th>
                    <th className="py-3 px-4">2. Document (OCR Evidence)</th>
                    <th className="py-3 px-4">3. Bank Sandbox (Simulated)</th>
                    <th className="py-3 px-4">Match Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  <tr className="bg-red-950/20">
                    <td className="py-3 px-4 font-bold text-white">Amount (₹)</td>
                    <td className="py-3 px-4 text-slate-300">₹70,00,000</td>
                    <td className="py-3 px-4 text-slate-300">₹70,00,000 (Conf: 99.1%)</td>
                    <td className="py-3 px-4 text-red-400 font-bold">₹35,00,000</td>
                    <td className="py-3 px-4 text-red-400 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> MISMATCH (-₹35L)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">FDR Number</td>
                    <td className="py-3 px-4 text-slate-300">FDR-SIT-2016-001</td>
                    <td className="py-3 px-4 text-slate-300">FDR-SIT-2016-001</td>
                    <td className="py-3 px-4 text-slate-300">FDR-SIT-2016-001</td>
                    <td className="py-3 px-4 text-teal-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> EXACT_MATCH
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Lien Marked</td>
                    <td className="py-3 px-4 text-slate-300">Jointly to AICTE</td>
                    <td className="py-3 px-4 text-slate-300">Jointly to AICTE</td>
                    <td className="py-3 px-4 text-slate-300">Confirmed (Lien-AICTE-10Y)</td>
                    <td className="py-3 px-4 text-teal-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> EXACT_MATCH
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-white">Maturity Date</td>
                    <td className="py-3 px-4 text-slate-300">01-Nov-2026</td>
                    <td className="py-3 px-4 text-slate-300">01-Nov-2026</td>
                    <td className="py-3 px-4 text-slate-300">01-Nov-2026</td>
                    <td className="py-3 px-4 text-teal-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> EXACT_MATCH
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Officer / Director Action Control */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-400">
                Action requires Regional Director role. Every waiver is recorded in the SHA-256 audit ledger.
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDispositionWaived(!dispositionWaived)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    dispositionWaived 
                      ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
                  }`}
                >
                  {dispositionWaived ? 'Undo Waiver (Reset to Blocked)' : 'Director: Waive with Audit Note'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Policy Engine Live Calculator */}
        {activeTab === 'calculator' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div>
                  <h4 className="font-bold text-white text-base">AICTE Approval Process Handbook (APH 2026–27)</h4>
                  <p className="text-xs text-slate-400">Clause 1.12 Table 1.4 + Regional & Land Multipliers</p>
                </div>

                {/* Programme Selection */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5">Academic Programme</label>
                  <select
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    className="w-full bg-[#172338] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Engineering UG">Engineering & Technology (UG) — Base ₹35L</option>
                    <option value="Management">Management (MBA/PGDM) — Base ₹15L</option>
                    <option value="Computer Applications">Computer Applications (MCA) — Base ₹15L</option>
                  </select>
                </div>

                {/* Multiplier Toggles */}
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg bg-[#172338]/60 border border-white/5 cursor-pointer hover:border-white/20 transition">
                    <div>
                      <div className="text-xs font-semibold text-white">Leased Building / Land</div>
                      <div className="text-[11px] text-slate-400">Addendum Item 11: 2.0× mandatory multiplier</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isLeased}
                      onChange={(e) => setIsLeased(e.target.checked)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg bg-[#172338]/60 border border-white/5 cursor-pointer hover:border-white/20 transition">
                    <div>
                      <div className="text-xs font-semibold text-white">Special Concession Zone</div>
                      <div className="text-[11px] text-slate-400">Addendum Item 10: 50% concession (NE, J&K, Ladakh, Women-only)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={isConcession}
                      onChange={(e) => setIsConcession(e.target.checked)}
                      className="w-4 h-4 accent-teal-500"
                    />
                  </label>
                </div>
              </div>

              {/* Live Waterfall Result Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#172338] to-[#0f172a] border border-teal-500/30 space-y-4 shadow-xl">
                <div className="text-xs font-mono uppercase text-teal-400 tracking-wider">Policy Calculation Waterfall</div>
                
                <div className="space-y-2 text-xs divide-y divide-white/5 font-mono">
                  <div className="flex justify-between py-1.5 text-slate-300">
                    <span>Base APH Table 1.4:</span>
                    <span className="font-bold text-white">₹{baseAmount},00,000</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-300">
                    <span>Regional Concession:</span>
                    <span className={isConcession ? 'text-teal-400 font-bold' : 'text-slate-400'}>
                      {isConcession ? '— 50% Concession' : 'None (1.0×)'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-300">
                    <span>Leased Land Multiplier:</span>
                    <span className={isLeased ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {isLeased ? '× 2.0 Multiplier' : 'Owned (1.0×)'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 text-sm font-bold text-white">
                    <span>Statutory Required Deposit:</span>
                    <span className="text-2xl text-teal-300 font-black">₹{requiredAmount},00,000</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-lg flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    Deterministic rule evaluation: Clause citations APH 1.12, 1.12(iv), and 2026–27 Addendum Items 10 & 11 attached to decision certificate.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Clause 6.46 Release Eligibility Graph */}
        {activeTab === 'graph' && (
          <div className="p-6 lg:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">Clause 6.46 Multi-Clearance Release Graph</h4>
                <p className="text-xs text-slate-400">Release cannot execute until every required clearance node resolves green</p>
              </div>

              <div className="text-xs font-mono">
                Overall State: {' '}
                <span className={`px-2.5 py-1 rounded-full font-bold ${
                  pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  {pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived ? 'ELIGIBLE_FOR_RELEASE' : 'BLOCKED_BY_POLICY'}
                </span>
              </div>
            </div>

            {/* Interactive Node Graph Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Node 1: PGRC */}
              <div 
                onClick={() => setPgrcCleared(!pgrcCleared)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  pgrcCleared ? 'bg-teal-950/20 border-teal-500/40 text-teal-300' : 'bg-red-950/20 border-red-500/30 text-red-300 hover:border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase">Statutory Desk 1</span>
                  {pgrcCleared ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="font-bold text-sm text-white">PGRC Student Desk</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {pgrcCleared ? 'No complaints pending' : 'Active complaint flagged'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">Click to toggle clearance</div>
              </div>

              {/* Node 2: Vigilance */}
              <div 
                onClick={() => setVigilanceCleared(!vigilanceCleared)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  vigilanceCleared ? 'bg-teal-950/20 border-teal-500/40 text-teal-300' : 'bg-red-950/20 border-red-500/30 text-red-300 hover:border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase">Statutory Desk 2</span>
                  {vigilanceCleared ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="font-bold text-sm text-white">Vigilance Bureau</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {vigilanceCleared ? 'No vigilance inquiry' : 'Pending vigilance check'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">Click to toggle clearance</div>
              </div>

              {/* Node 3: Grants Cell */}
              <div 
                onClick={() => setGrantsCleared(!grantsCleared)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  grantsCleared ? 'bg-teal-950/20 border-teal-500/40 text-teal-300' : 'bg-red-950/20 border-red-500/30 text-red-300 hover:border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase">Statutory Desk 3</span>
                  {grantsCleared ? <CheckCircle className="w-4 h-4 text-teal-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
                </div>
                <div className="font-bold text-sm text-white">Grants Cell Dues</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {grantsCleared ? 'All grants reconciled' : 'Unspent grant balance'}
                </div>
                <div className="text-[10px] text-slate-500 mt-2 font-mono">Click to toggle clearance</div>
              </div>

              {/* Node 4: 10-Yr Term */}
              <div className="p-4 rounded-xl border bg-teal-950/20 border-teal-500/40 text-teal-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase">Statutory Period</span>
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                </div>
                <div className="font-bold text-sm text-white">10-Year Hold Complete</div>
                <div className="text-[11px] text-slate-400 mt-1">Maturity date 01-Nov-2026 reached</div>
                <div className="text-[10px] text-teal-400/80 mt-2 font-mono">Verified via Time Machine</div>
              </div>
            </div>

            {/* Approval Execution Action */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Backend guard clause rejects with HTTP 422 if any node is blocked. Maker-checker segregated.
              </div>
              <button
                disabled={!(pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived)}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                  pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived
                    ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/25 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Execute Release Sanction Order (Clause 6.46)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
