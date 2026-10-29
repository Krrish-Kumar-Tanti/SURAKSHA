import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  Download, 
  Clock, 
  Check, 
  Lock,
  ArrowLeft,
  QrCode,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { canIssueReleaseSanction, canSetReleaseClearances } from '../../lib/roleAccess';
import { getSharedClearances, saveSharedClearances, ClearanceState } from '../../lib/clearanceState';

interface ReleaseGraphPageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function ReleaseGraphPage({ onNavigate, currentRole = 'COMPETENT_AUTHORITY' }: ReleaseGraphPageProps) {
  const canEditClearances = canSetReleaseClearances(currentRole);
  const canApproveSanction = canIssueReleaseSanction(currentRole);
  
  // Shared persistent clearance state across roles
  const [clearanceState, setClearanceState] = useState<ClearanceState>(getSharedClearances());
  const [showNocModal, setShowNocModal] = useState(false);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<ClearanceState>;
      if (custom.detail) {
        setClearanceState(custom.detail);
      } else {
        setClearanceState(getSharedClearances());
      }
    };
    window.addEventListener('suraksha_clearance_changed', handleUpdate);
    return () => window.removeEventListener('suraksha_clearance_changed', handleUpdate);
  }, []);

  const updateNode = (field: keyof ClearanceState) => {
    if (!canEditClearances) return;
    const next = {
      ...clearanceState,
      [field]: !clearanceState[field],
      // If any clearance is revoked, revoke sanction as well
      sanctionIssued: field !== 'sanctionIssued' && clearanceState[field] ? false : clearanceState.sanctionIssued,
    };
    setClearanceState(next);
    saveSharedClearances(next);
  };

  const executeSanction = () => {
    if (!canApproveSanction) return;
    const next = {
      ...clearanceState,
      sanctionIssued: true,
    };
    setClearanceState(next);
    saveSharedClearances(next);
    setShowNocModal(true);
  };

  const { pgrcCleared, vigilanceCleared, grantsCleared, termServed, courtInjunctionClear, sanctionIssued } = clearanceState;

  // All 4 mandatory statutory nodes + legal check must be green
  const allClear = pgrcCleared && vigilanceCleared && grantsCleared && termServed && courtInjunctionClear;

  // Count red nodes
  const redNodeNames: string[] = [];
  if (!pgrcCleared) redNodeNames.push('Node 1 (Student Grievance Redressal PGRC)');
  if (!vigilanceCleared) redNodeNames.push('Node 2 (Central Vigilance Bureau)');
  if (!grantsCleared) redNodeNames.push('Node 3 (AICTE Grants Refund)');
  if (!termServed) redNodeNames.push('Node 4 (10-Year Lock-in Tenor)');
  if (!courtInjunctionClear) redNodeNames.push('Node 5 (Judicial Restraint / Stay Check)');

  if (currentRole === 'ACCOUNTS') {
    return (
      <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-8 px-4 sm:px-8 max-w-[1100px] mx-auto text-left">
        <div className="mb-4">
          <button
            onClick={() => onNavigate('portfolio')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
          </button>
        </div>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
            Clause 6.46 Release Documentation
          </div>
          <AnimatedHeading
            as="h1"
            className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
          >
            Dual-Signed Release Letters & NOC
          </AnimatedHeading>
          <p className="text-sm sm:text-base text-[#55544E] mt-2">
            Disbursement orders and dual-signed NOCs sanctioned by the Competent Authority.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
            <div>
              <h3 className="font-bold text-sm text-[#1C1D1A]">Sanctioned Release Orders (Ready for RTGS / PFMS)</h3>
              <p className="text-xs text-[#706E66]">AICTE Approval Process Handbook (APH 2024–27 Clause 6.46)</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
              sanctionIssued 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {sanctionIssued ? '1 Sanction Approved by Approving Authority' : 'Awaiting Member Secretary Sanction'}
            </span>
          </div>

          {sanctionIssued ? (
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-sm text-[#1C1D1A]">Symbiosis Institute of Technology (SIT), Pune</div>
                <div className="text-xs font-mono text-[#55544E] mt-1">FDR: SBI/PUN/2024/998214 · Principal: ₹70,00,000</div>
                <div className="text-[11px] text-emerald-700 font-mono mt-1">Dual-Signed NOC #AICTE/WRO/NOC/2026/0891 Validated</div>
              </div>
              <button
                onClick={() => setShowNocModal(true)}
                className="px-4 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5" /> View Dual-Signed NOC
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] text-center text-xs text-[#706E66]">
              No release order has been sanctioned yet. The Competent Authority (Member Secretary) must approve the 4-node clearance DAG before disbursements can be executed.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-8 px-4 sm:px-8 max-w-[1340px] mx-auto text-left">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate('portfolio')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Portfolio
        </button>
      </div>

      {/* Top Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Clause 6.46 Directed Acyclic Graph (DAG) Engine
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *10-Year Statutory Release Graph* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Under AICTE APH Clause 6.46, releasing a matured security deposit requires complete clearance across all statutory desks.
          <strong> Until all 4 clearance nodes turn green, the "Execute Dual-Signed NOC" button is strictly locked and disabled for the Approving Authority.</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: 4-Node Clearance DAG */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
                  Clause 6.46 Prerequisites
                </span>
                <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Statutory Clearance Nodes
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                allClear ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {allClear ? 'ALL 4 NODES VERIFIED ✓' : `${redNodeNames.length} NODE(S) BLOCKED ✗`}
              </span>
            </div>

            {/* Clearance Nodes */}
            <div className="space-y-4">
              
              {/* Node 1: PGRC Clearance */}
              <div className={`p-4 rounded-2xl border transition-all ${
                pgrcCleared ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200 ring-1 ring-red-300'
              } flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1D1A]">Node 1: Student Grievance Redressal (PGRC)</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      pgrcCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pgrcCleared ? 'CLEAR' : 'PENDING GRIEVANCE'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#706E66] mt-0.5">
                    {pgrcCleared 
                      ? 'No unresolved student/faculty grievances (capitation fees, withheld marksheets)'
                      : 'Active grievance pending in PGRC portal — release prohibited under Clause 6.46(b)'}
                  </div>
                </div>
                {canEditClearances ? (
                  <button
                    onClick={() => updateNode('pgrcCleared')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      pgrcCleared ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Click to toggle clearance state"
                  >
                    {pgrcCleared ? '✓ Node Green' : '✗ Node Red'}
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    pgrcCleared ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {pgrcCleared ? '✓ Green' : '✗ Red'}
                  </span>
                )}
              </div>

              {/* Node 2: Central Vigilance clearance */}
              <div className={`p-4 rounded-2xl border transition-all ${
                vigilanceCleared ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200 ring-1 ring-red-300'
              } flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1D1A]">Node 2: Central Vigilance (CVO) Clearance</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      vigilanceCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {vigilanceCleared ? 'CLEAR' : 'UNDER INQUIRY'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#706E66] mt-0.5">
                    {vigilanceCleared 
                      ? 'No active disciplinary probe, document forgery inquiry, or ghost-faculty investigation'
                      : 'Active vigilance probe under CVC jurisdiction — release blocked'}
                  </div>
                </div>
                {canEditClearances ? (
                  <button
                    onClick={() => updateNode('vigilanceCleared')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      vigilanceCleared ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Click to toggle clearance state"
                  >
                    {vigilanceCleared ? '✓ Node Green' : '✗ Node Red'}
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    vigilanceCleared ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {vigilanceCleared ? '✓ Green' : '✗ Red'}
                  </span>
                )}
              </div>

              {/* Node 3: AICTE Grants refund clearance */}
              <div className={`p-4 rounded-2xl border transition-all ${
                grantsCleared ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200 ring-1 ring-red-300'
              } flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1D1A]">Node 3: AICTE Grants Refund & Scheme Clearance</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      grantsCleared ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {grantsCleared ? 'CLEAR' : 'UNSPENT DUES'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#706E66] mt-0.5">
                    {grantsCleared 
                      ? 'All research and development grant funds (MODROBS, RPS, PMKVY) reconciled'
                      : 'Unspent government grant funds pending recovery — release withheld'}
                  </div>
                </div>
                {canEditClearances ? (
                  <button
                    onClick={() => updateNode('grantsCleared')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      grantsCleared ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Click to toggle clearance state"
                  >
                    {grantsCleared ? '✓ Node Green' : '✗ Node Red'}
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    grantsCleared ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {grantsCleared ? '✓ Green' : '✗ Red'}
                  </span>
                )}
              </div>

              {/* Node 4: 10-Year Statutory Lock-in verification */}
              <div className={`p-4 rounded-2xl border transition-all ${
                termServed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200 ring-1 ring-red-300'
              } flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1D1A]">Node 4: 10-Year Statutory Lock-in Verification</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      termServed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {termServed ? 'TENOR MATURED' : 'LOCK-IN ACTIVE'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#706E66] mt-0.5">
                    {termServed 
                      ? '10-Year mandatory statutory custody completed (Clause 1.12iv). Principal eligible for return.'
                      : 'Premature encashment penalty (Clause 7.7 10% deduction) applies if released early'}
                  </div>
                </div>
                {canEditClearances ? (
                  <button
                    onClick={() => updateNode('termServed')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      termServed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Click to toggle clearance state"
                  >
                    {termServed ? '✓ Node Green' : '✗ Node Red'}
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    termServed ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {termServed ? '✓ Green' : '✗ Red'}
                  </span>
                )}
              </div>

              {/* Node 5: Legal Injunction Check */}
              <div className={`p-4 rounded-2xl border transition-all ${
                courtInjunctionClear ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50/50 border-red-200 ring-1 ring-red-300'
              } flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1D1A]">Node 5: High Court / Stay Restraint Check</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      courtInjunctionClear ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {courtInjunctionClear ? 'NO RESTRAINT' : 'STAY ACTIVE'}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#706E66] mt-0.5">
                    {courtInjunctionClear 
                      ? 'No judicial restraint or stay order from High Court or Supreme Court on encashment'
                      : 'Court stay order active on FDR encashment — statutory release prohibited'}
                  </div>
                </div>
                {canEditClearances ? (
                  <button
                    onClick={() => updateNode('courtInjunctionClear')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition shrink-0 cursor-pointer ${
                      courtInjunctionClear ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    title="Click to toggle clearance state"
                  >
                    {courtInjunctionClear ? '✓ Node Green' : '✗ Node Red'}
                  </button>
                ) : (
                  <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    courtInjunctionClear ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {courtInjunctionClear ? '✓ Green' : '✗ Red'}
                  </span>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Multi-Signatory Sign-Off & Sanction Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
                Dual-Signed Authority Gate
              </span>
              <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                Multi-Signatory Hierarchy
              </h3>
              <p className="text-xs text-[#55544E] mt-1">
                No single officer can release funds independently. Full four-tier cryptographic verification required.
              </p>
            </div>

            {/* Approval Hierarchy Steps */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">1. Dealing Officer (Maker)</span>
                  <span className="font-bold text-[#1C1D1A]">
                    {allClear ? 'Verification Checklist Endorsed' : 'Checklist Blocked by Red Node(s)'}
                  </span>
                </div>
                {allClear ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">2. Regional Director (Checker)</span>
                  <span className="font-bold text-[#1C1D1A]">
                    {allClear ? 'Regional Audit Review Signed' : 'Regional Review Pending Clearances'}
                  </span>
                </div>
                {allClear ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[#706E66]">Awaiting Green Nodes</span>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">3. Approving Authority (Member Secretary HQ)</span>
                  <span className="font-bold text-[#1C1D1A]">
                    {sanctionIssued ? 'Dual-Signed Sanction Executed' : allClear ? 'Awaiting Sanction Order' : 'Release Execution Locked'}
                  </span>
                </div>
                {sanctionIssued ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : allClear ? (
                  <span className="text-amber-600 font-bold">Ready to Sign</span>
                ) : (
                  <Lock className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {/* Action Button: Execute Dual-Signed NOC */}
            {canApproveSanction && !sanctionIssued ? (
              <div className="space-y-2">
                <button
                  onClick={executeSanction}
                  disabled={!allClear}
                  className={`w-full py-3.5 px-6 rounded-lg text-white font-medium text-xs transition shadow-sm flex items-center justify-center gap-2 ${
                    allClear
                      ? 'bg-[#444C3D] hover:bg-[#353C2F] cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  Execute Dual-Signed NOC
                </button>
                {!allClear ? (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-left space-y-1">
                    <p className="text-[11px] text-red-700 font-mono font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Locked: {redNodeNames.length} Clearance Node(s) Red!
                    </p>
                    <p className="text-[10px] text-red-600 font-mono">
                      {redNodeNames.join('; ')}
                    </p>
                    <p className="text-[10px] text-[#55544E] mt-1">
                      Dealing Officer or Regional Director must investigate and turn all nodes green before Member Secretary can execute NOC.
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-emerald-700 font-mono text-center">
                    ✓ All 4 statutory clearance nodes are green. You may now execute the dual-signed release NOC.
                  </p>
                )}
              </div>
            ) : sanctionIssued ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dual-Signed Release NOC Executed!
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed font-mono">
                  Sanction Order #AICTE/HQ/REL/2026/0491 generated with dual cryptographic signature (AICTE Member Secretary + Bank Manager).
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowNocModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-[#444C3D] text-white text-[11px] font-medium cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                  >
                    <FileCheck className="w-3.5 h-3.5" /> View Certificate
                  </button>
                  <button
                    onClick={() => onNavigate('audit')}
                    className="px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white text-[#1C1D1A] text-[11px] font-mono font-medium cursor-pointer"
                  >
                    View in Audit Chain →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] text-xs text-[#706E66] space-y-1">
                {currentRole === 'DEALING_OFFICER' && (
                  <p>
                    <strong>Dealing Officer (Maker):</strong> Toggle nodes 1–4 based on bureau reports. When you mark a node Red, it reflects across all profiles and disables release approval.
                  </p>
                )}
                {currentRole === 'DIRECTOR_RB' && (
                  <p>
                    <strong>Regional Director (Checker):</strong> Scrutinize and endorse clearance nodes. Adverse findings will block the Competent Authority from releasing funds.
                  </p>
                )}
                {!['DEALING_OFFICER', 'DIRECTOR_RB', 'COMPETENT_AUTHORITY'].includes(currentRole) && (
                  <p>Final release sanction is restricted to the Approving Authority (Member Secretary).</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dual-Signed NOC Modal */}
      {showNocModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E5DFD5] shadow-2xl relative text-left space-y-4">
            <div className="flex items-start justify-between border-b border-[#E5DFD5] pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] px-2.5 py-1 rounded-full">
                  FORMAL STATUTORY RELEASE PASSPORT
                </span>
                <h3 className="text-xl font-bold text-[#1C1D1A] font-['Instrument_Serif'] mt-2">
                  Official AICTE Dual-Signed Release NOC (Clause 6.46)
                </h3>
              </div>
              <button
                onClick={() => setShowNocModal(false)}
                className="w-8 h-8 rounded-full bg-[#ECE7DE] flex items-center justify-center text-sm font-bold text-[#55544E] hover:text-[#1C1D1A] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#DDD6C9] pb-2">
                <span className="text-[#706E66]">Sanction Reference:</span>
                <span className="font-bold text-[#1C1D1A]">AICTE/WRO/RELEASE/2026/0891</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C9] pb-2">
                <span className="text-[#706E66]">Institution Name:</span>
                <span className="font-bold text-[#1C1D1A]">Symbiosis Institute of Technology (1-1092847291)</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C9] pb-2">
                <span className="text-[#706E66]">Instrument Number:</span>
                <span className="font-bold text-[#1C1D1A]">SBI/PUN/2024/998214</span>
              </div>
              <div className="flex justify-between border-b border-[#DDD6C9] pb-2">
                <span className="text-[#706E66]">Principal Release Amount:</span>
                <span className="font-bold text-emerald-700 text-sm">₹70,00,000 (Rupees Seventy Lakhs)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#706E66]">Accrued Interest Treatment:</span>
                <span className="font-bold text-[#444C3D]">100% Retained by AICTE Council (Clause 1.12iv)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white border border-[#E5DFD5] text-xs font-mono">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Signatory 1 (AICTE HQ)</div>
                <div className="font-bold text-[#1C1D1A] mt-1">Dr. V. K. Sharma</div>
                <div className="text-[10px] text-[#55544E]">Member Secretary & Approving Authority</div>
                <div className="text-[9px] text-emerald-700 mt-1">Ed25519 Signed: 0x8f2a...c0d9</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Signatory 2 (Bank Co-Signer)</div>
                <div className="font-bold text-[#1C1D1A] mt-1">Branch Manager</div>
                <div className="text-[10px] text-[#55544E]">State Bank of India, Pune Main</div>
                <div className="text-[9px] text-emerald-700 mt-1">CBS Lien Released: LIEN_CLEARED</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5DFD5]">
              <button
                onClick={() => setShowNocModal(false)}
                className="px-4 py-2 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowNocModal(false);
                  onNavigate('audit');
                }}
                className="px-5 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                Inspect Ledger Entry →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
