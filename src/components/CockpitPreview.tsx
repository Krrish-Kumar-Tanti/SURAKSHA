import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Upload
} from 'lucide-react';
import { canIssueReleaseSanction, canResolveDiscrepancies, canSetReleaseClearances, getCockpitTabs, CockpitTab } from '../lib/roleAccess';

interface CockpitPreviewProps {
  currentRole?: string;
  onNavigate?: (screen: string) => void;
}

export function CockpitPreview({ currentRole = 'DEALING_OFFICER', onNavigate }: CockpitPreviewProps) {
  const allowedTabs = getCockpitTabs(currentRole);
  const isRegionScoped = ['INSTITUTION_USER', 'DEALING_OFFICER', 'DIRECTOR_RB'].includes(currentRole);
  const [activeTab, setActiveTab] = useState<CockpitTab>('portfolio');
  const visibleTab = allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0] ?? 'portfolio';

  useEffect(() => {
    const preferredTab: Record<string, CockpitTab> = {
      INSTITUTION_USER: 'calculator',
      DEALING_OFFICER: 'portfolio',
      DIRECTOR_RB: 'provenance',
      COMPETENT_AUTHORITY: 'graph',
      AUDITOR: 'provenance',
    };
    const preferred = preferredTab[currentRole];
    setActiveTab(preferred && allowedTabs.includes(preferred) ? preferred : allowedTabs[0] ?? 'portfolio');
  }, [currentRole, allowedTabs]);

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

  // Role Display Label Helper
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'INSTITUTION_USER': return 'College Registrar (SIT Pune)';
      case 'DEALING_OFFICER': return 'Regional Dealing Officer (WRO)';
      case 'DIRECTOR_RB': return 'Regional Director Desk';
      case 'COMPETENT_AUTHORITY': return 'Approving Authority (Member Secretary)';
      case 'AUDITOR': return 'Central Vigilance Auditor';
      default: return role;
    }
  };

  return (
    <div className="relative mx-auto max-w-[1340px] px-4 sm:px-6 z-10 -mt-6">
      {/* Soft Sky-Blue / Pastel Wash Frame Container */}
      <div className="rounded-[32px] bg-gradient-to-b from-[#D6E6ED] to-[#E4EEF2] p-4 sm:p-8 border border-[#CADBE2] shadow-sm">
        
        {/* Main Application Window */}
        <div className="relative rounded-2xl bg-white border border-[#E5DFD5] shadow-[0_15px_45px_rgba(28,29,26,0.06)] overflow-hidden">
          
          {/* Card Header & Tabs */}
          <div className="px-6 py-4 border-b border-[#E5DFD5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#444C3D] animate-ping" />
                <span>Active Role: <strong className="font-mono text-[#1C1D1A]">{getRoleLabel(currentRole)}</strong></span>
              </div>
              <span className="text-xs text-[#706E66] hidden sm:inline font-mono">
                Demonstration preview
              </span>
            </div>

            {/* Interactive Mode Tabs */}
            <div className="flex items-center gap-1 bg-[#ECE7DE] p-1 rounded-xl border border-[#DDD6C9]">
              {allowedTabs.includes('portfolio') && <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visibleTab === 'portfolio' ? 'bg-[#444C3D] text-white shadow-sm font-semibold' : 'text-[#55544E] hover:text-[#1C1D1A]'
                }`}
              >
                1. Portfolio examples
              </button>}
              {allowedTabs.includes('provenance') && <button
                onClick={() => setActiveTab('provenance')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visibleTab === 'provenance' ? 'bg-[#444C3D] text-white shadow-sm font-semibold' : 'text-[#55544E] hover:text-[#1C1D1A]'
                }`}
              >
                2. Bank record examples
              </button>}
              {allowedTabs.includes('calculator') && <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visibleTab === 'calculator' ? 'bg-[#444C3D] text-white shadow-sm font-semibold' : 'text-[#55544E] hover:text-[#1C1D1A]'
                }`}
              >
                3. Policy estimate
              </button>}
              {allowedTabs.includes('graph') && <button
                onClick={() => setActiveTab('graph')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  visibleTab === 'graph' ? 'bg-[#444C3D] text-white shadow-sm font-semibold' : 'text-[#55544E] hover:text-[#1C1D1A]'
                }`}
              >
                4. Release workflow
              </button>}
            </div>
          </div>

          {/* Tab 1: Executive Portfolio */}
          {visibleTab === 'portfolio' && (
            <div className="p-6 lg:p-8 space-y-6 bg-white">
              <p className="text-xs text-[#706E66]">Portfolio overview</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[11px] font-mono uppercase text-[#706E66]">Total ₹ Held</div>
                  <div className="text-2xl font-black text-[#1C1D1A] mt-1 font-['Instrument_Serif'] text-3xl">{isRegionScoped ? '₹70 Lakhs' : '₹24.85 Cr'}</div>
                  <div className="text-[11px] text-[#444C3D] flex items-center gap-1 mt-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> {isRegionScoped ? '1 Active Deposit' : '142 Active Deposits'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#F5C2C2]">
                  <div className="text-[11px] font-mono uppercase text-[#991B1B]">₹ at Risk</div>
                  <div className="text-2xl font-black text-[#B91C1C] mt-1 font-['Instrument_Serif'] text-3xl">{isRegionScoped ? '₹35,00,000' : '₹70,00,000'}</div>
                  <div className="text-[11px] text-[#DC2626] flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3" /> 1 Critical Discrepancy
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[11px] font-mono uppercase text-[#706E66]">Expiring in 90 Days</div>
                  <div className="text-2xl font-black text-[#B45309] mt-1 font-['Instrument_Serif'] text-3xl">{isRegionScoped ? '1 FDR' : '12 FDRs'}</div>
                  <div className="text-[11px] text-[#706E66] mt-1">Example count; alerts are not sent</div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                  <div className="text-[11px] font-mono uppercase text-[#706E66]">Pending Clearances</div>
                  <div className="text-2xl font-black text-[#444C3D] mt-1 font-['Instrument_Serif'] text-3xl">{isRegionScoped ? '1 Release' : '8 Releases'}</div>
                  <div className="text-[11px] text-[#706E66] mt-1">Under Clause 6.46 DAG</div>
                </div>
              </div>

              {/* Critical At-Risk Deposit Highlight */}
              <div className="rounded-xl border border-[#F5C2C2] bg-[#FDF2F2] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-[#FEE2E2] text-[#B91C1C] shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1C1D1A] text-sm">SIT Pune (1-1092847291)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FEE2E2] text-[#B91C1C] font-bold">
                        Sample discrepancy
                      </span>
                    </div>
                    <p className="text-xs text-[#55544E] mt-1">
                      Example declared amount ₹70,00,000 vs bank record ₹35,00,000.
                    </p>
                  </div>
                </div>
                {allowedTabs.includes('provenance') && <button
                  onClick={() => setActiveTab('provenance')}
                  className="px-4 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white font-semibold text-xs flex items-center gap-2 transition shrink-0 shadow-sm cursor-pointer"
                >
                  Inspect 3-Way Match <ChevronRight className="w-3.5 h-3.5" />
                </button>}
              </div>
            </div>
          )}

          {/* Tab 2: 3-Way Provenance Scanner */}
          {visibleTab === 'provenance' && (
            <div className="p-6 lg:p-8 space-y-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1C1D1A] font-['Instrument_Serif'] text-xl">Example record comparison</h4>
                  <p className="text-xs text-[#706E66]">Sample instrument: FDR-SIT-2016-001 · State Bank of India</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    dispositionWaived ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
                  }`}>
                    {dispositionWaived ? 'SAMPLE WAIVER PREVIEW' : 'SAMPLE DIFFERENCE'}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#E5DFD5]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-[#706E66] border-b border-[#E5DFD5] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Field</th>
                      <th className="py-3 px-4">1. Declared (College)</th>
                      <th className="py-3 px-4">2. Example receipt value</th>
                      <th className="py-3 px-4">3. Example bank value</th>
                      <th className="py-3 px-4">Example comparison</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD5] font-mono">
                    <tr className="bg-[#FDF2F2]">
                      <td className="py-3 px-4 font-bold text-[#1C1D1A]">Amount (₹)</td>
                      <td className="py-3 px-4 text-[#55544E]">₹70,00,000</td>
                      <td className="py-3 px-4 text-[#55544E]">₹70,00,000 (example receipt value)</td>
                      <td className="py-3 px-4 text-[#B91C1C] font-bold">₹35,00,000</td>
                      <td className="py-3 px-4 text-[#B91C1C] font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Example difference
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#1C1D1A]">FDR Number</td>
                      <td className="py-3 px-4 text-[#55544E]">FDR-SIT-2016-001</td>
                      <td className="py-3 px-4 text-[#55544E]">FDR-SIT-2016-001</td>
                      <td className="py-3 px-4 text-[#55544E]">FDR-SIT-2016-001</td>
                      <td className="py-3 px-4 text-[#444C3D] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Example match
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#1C1D1A]">Lien Marked</td>
                      <td className="py-3 px-4 text-[#55544E]">Jointly to AICTE</td>
                      <td className="py-3 px-4 text-[#55544E]">Jointly to AICTE</td>
                      <td className="py-3 px-4 text-[#55544E]">Confirmed (Lien-AICTE-10Y)</td>
                      <td className="py-3 px-4 text-[#444C3D] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Example match
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-[#1C1D1A]">Maturity Date</td>
                      <td className="py-3 px-4 text-[#55544E]">01-Nov-2026</td>
                      <td className="py-3 px-4 text-[#55544E]">01-Nov-2026</td>
                      <td className="py-3 px-4 text-[#55544E]">01-Nov-2026</td>
                      <td className="py-3 px-4 text-[#444C3D] font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Example match
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Control */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="text-xs text-[#706E66]">
                  Current role: <strong className="text-[#1C1D1A]">{getRoleLabel(currentRole)}</strong>.
                </div>
                <div className="flex items-center gap-3">
                  {canResolveDiscrepancies(currentRole) && <button
                    onClick={() => setDispositionWaived(!dispositionWaived)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      dispositionWaived 
                        ? 'bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] border border-[#DDD6C9]' 
                        : 'bg-[#B45309] hover:bg-[#92400E] text-white shadow-sm'
                    }`}
                  >
                    {dispositionWaived ? 'Reset sample waiver' : 'Preview waiver label'}
                  </button>}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Policy estimate */}
          {visibleTab === 'calculator' && (
            <div className="p-6 lg:p-8 space-y-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-[#1C1D1A] font-['Instrument_Serif'] text-xl">AICTE Approval Process Handbook (APH 2026–27)</h4>
                    <p className="text-xs text-[#706E66]">Clause 1.12 Table 1.4 + Regional & Land Multipliers</p>
                  </div>

                  {/* Programme Selection */}
                  <div>
                    <label className="text-xs font-mono text-[#55544E] block mb-1.5">Academic Programme</label>
                    <select
                      value={programme}
                      onChange={(e) => setProgramme(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#DDD6C9] rounded-lg px-3.5 py-2.5 text-xs text-[#1C1D1A] focus:outline-none focus:border-[#444C3D]"
                    >
                      <option value="Engineering UG">Engineering & Technology (UG) — Base ₹35L</option>
                      <option value="Management">Management (MBA/PGDM) — Base ₹15L</option>
                      <option value="Computer Applications">Computer Applications (MCA) — Base ₹15L</option>
                    </select>
                  </div>

                  {/* Multiplier Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] cursor-pointer hover:border-[#444C3D] transition">
                      <div>
                        <div className="text-xs font-semibold text-[#1C1D1A]">Leased Building / Land</div>
                        <div className="text-[11px] text-[#706E66]">Addendum Item 11: 2.0× mandatory multiplier</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isLeased}
                        onChange={(e) => setIsLeased(e.target.checked)}
                        className="w-4 h-4 accent-[#444C3D]"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-[#FAF8F5] border border-[#E5DFD5] cursor-pointer hover:border-[#444C3D] transition">
                      <div>
                        <div className="text-xs font-semibold text-[#1C1D1A]">Special Concession Zone</div>
                        <div className="text-[11px] text-[#706E66]">Addendum Item 10: 50% concession (NE, J&K, Ladakh, Women-only)</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isConcession}
                        onChange={(e) => setIsConcession(e.target.checked)}
                        className="w-4 h-4 accent-[#444C3D]"
                      />
                    </label>
                  </div>
                </div>

                {/* Live Waterfall Result Card */}
                <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#DDD6C9] space-y-4 shadow-sm">
                  <div className="text-xs font-mono uppercase text-[#444C3D] font-bold tracking-wider">Policy Calculation Waterfall</div>
                  
                  <div className="space-y-2 text-xs divide-y divide-[#E5DFD5] font-mono">
                    <div className="flex justify-between py-1.5 text-[#55544E]">
                      <span>Base APH Table 1.4:</span>
                      <span className="font-bold text-[#1C1D1A]">₹{baseAmount},00,000</span>
                    </div>
                    <div className="flex justify-between py-1.5 text-[#55544E]">
                      <span>Regional Concession:</span>
                      <span className={isConcession ? 'text-[#444C3D] font-bold' : 'text-[#706E66]'}>
                        {isConcession ? '— 50% Concession' : 'None (1.0×)'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 text-[#55544E]">
                      <span>Leased Land Multiplier:</span>
                      <span className={isLeased ? 'text-[#B45309] font-bold' : 'text-[#706E66]'}>
                        {isLeased ? '× 2.0 Multiplier' : 'Owned (1.0×)'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-3 text-sm font-bold text-[#1C1D1A]">
                      <span>Statutory Required Deposit:</span>
                      <span className="text-3xl text-[#444C3D] font-black font-['Instrument_Serif']">₹{requiredAmount},00,000</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#706E66] bg-white border border-[#E5DFD5] p-3 rounded-lg flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#444C3D] shrink-0 mt-0.5" />
                    <span>
                      Deterministic rule evaluation: Clause citations APH 1.12, 1.12(iv), and 2026–27 Addendum Items 10 & 11 attached to decision certificate.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Clause 6.46 Release Eligibility Graph */}
          {visibleTab === 'graph' && (
            <div className="p-6 lg:p-8 space-y-6 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#1C1D1A] font-['Instrument_Serif'] text-xl">Example release prerequisites</h4>
                  <p className="text-xs text-[#706E66]">Review the listed clearance statuses for this release request.</p>
                </div>

                <div className="text-xs font-mono">
                  Sample state:{' '}
                  <span className={`px-2.5 py-1 rounded-full font-bold ${
                    pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived
                      ? 'bg-[#EAF3E7] text-[#2D5A27] border border-[#BBD7B5]'
                      : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'
                  }`}>
                    {pgrcCleared && vigilanceCleared && grantsCleared && dispositionWaived ? 'SAMPLE ITEMS CLEAR' : 'SAMPLE ITEM PENDING'}
                  </span>
                </div>
              </div>

              {/* Node Graph Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={canSetReleaseClearances(currentRole) ? () => setPgrcCleared(!pgrcCleared) : undefined}
                  className={`p-4 rounded-xl border transition-all ${canSetReleaseClearances(currentRole) ? 'cursor-pointer' : ''} ${
                    pgrcCleared ? 'bg-[#F2F7F0] border-[#BBD7B5] text-[#2D5A27]' : 'bg-[#FDF2F2] border-[#F5C2C2] text-[#991B1B] hover:border-[#DC2626]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase">Statutory Desk 1</span>
                    {pgrcCleared ? <CheckCircle className="w-4 h-4 text-[#2D5A27]" /> : <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />}
                  </div>
                  <div className="font-bold text-sm text-[#1C1D1A]">PGRC Student Desk</div>
                  <div className="text-[11px] text-[#706E66] mt-1">
                    {pgrcCleared ? 'No complaints pending' : 'Active complaint flagged'}
                  </div>
                  {canSetReleaseClearances(currentRole) && <div className="text-[10px] text-[#8C8A82] mt-2 font-mono">Click to toggle clearance</div>}
                </div>

                <div 
                  onClick={canSetReleaseClearances(currentRole) ? () => setVigilanceCleared(!vigilanceCleared) : undefined}
                  className={`p-4 rounded-xl border transition-all ${canSetReleaseClearances(currentRole) ? 'cursor-pointer' : ''} ${
                    vigilanceCleared ? 'bg-[#F2F7F0] border-[#BBD7B5] text-[#2D5A27]' : 'bg-[#FDF2F2] border-[#F5C2C2] text-[#991B1B] hover:border-[#DC2626]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase">Statutory Desk 2</span>
                    {vigilanceCleared ? <CheckCircle className="w-4 h-4 text-[#2D5A27]" /> : <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />}
                  </div>
                  <div className="font-bold text-sm text-[#1C1D1A]">Vigilance Bureau</div>
                  <div className="text-[11px] text-[#706E66] mt-1">
                    {vigilanceCleared ? 'No vigilance inquiry' : 'Pending vigilance check'}
                  </div>
                  {canSetReleaseClearances(currentRole) && <div className="text-[10px] text-[#8C8A82] mt-2 font-mono">Click to toggle clearance</div>}
                </div>

                <div 
                  onClick={canSetReleaseClearances(currentRole) ? () => setGrantsCleared(!grantsCleared) : undefined}
                  className={`p-4 rounded-xl border transition-all ${canSetReleaseClearances(currentRole) ? 'cursor-pointer' : ''} ${
                    grantsCleared ? 'bg-[#F2F7F0] border-[#BBD7B5] text-[#2D5A27]' : 'bg-[#FDF2F2] border-[#F5C2C2] text-[#991B1B] hover:border-[#DC2626]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase">Statutory Desk 3</span>
                    {grantsCleared ? <CheckCircle className="w-4 h-4 text-[#2D5A27]" /> : <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />}
                  </div>
                  <div className="font-bold text-sm text-[#1C1D1A]">Grants Cell Dues</div>
                  <div className="text-[11px] text-[#706E66] mt-1">
                    {grantsCleared ? 'All grants reconciled' : 'Unspent grant balance'}
                  </div>
                  {canSetReleaseClearances(currentRole) && <div className="text-[10px] text-[#8C8A82] mt-2 font-mono">Click to toggle clearance</div>}
                </div>

                <div className="p-4 rounded-xl border bg-[#F2F7F0] border-[#BBD7B5] text-[#2D5A27]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase">Statutory Period</span>
                    <CheckCircle className="w-4 h-4 text-[#2D5A27]" />
                  </div>
                  <div className="font-bold text-sm text-[#1C1D1A]">10-Year Hold Complete</div>
                  <div className="text-[11px] text-[#706E66] mt-1">Maturity date 01-Nov-2026 reached</div>
                  <div className="text-[10px] text-[#55544E] mt-2 font-mono font-semibold">Tenor status</div>
                </div>
              </div>

              {/* Approval Execution Action */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#706E66]">
                  Review each clearance before the final decision.
                </div>
                {canIssueReleaseSanction(currentRole) && <button
                  disabled
                  className="px-6 py-2.5 rounded-lg text-xs font-bold bg-[#E5DFD5] text-[#8C8A82] cursor-not-allowed"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Release approval unavailable in demo
                </button>}
                {!canIssueReleaseSanction(currentRole) && (
                  <span className="text-xs text-[#706E66]">Final sanction is restricted to the Competent Authority.</span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Bottom Action Banner */}
        {currentRole === 'INSTITUTION_USER' && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-2 text-left">
            <div>
              <div className="font-semibold text-sm text-[#1C1D1A]">Want to test your own deposit?</div>
              <div className="text-xs text-[#55544E]">
                Enter FDR details and review the submission steps.
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setActiveTab('provenance')}
                className="px-5 py-2.5 bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium rounded-lg shadow-sm transition-all cursor-pointer"
              >
                View bank record examples
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className="px-5 py-2.5 bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] text-xs font-medium rounded-lg border border-[#DDD6C9] transition-all cursor-pointer"
              >
                Simulate APH Calculation
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}