import React, { useState } from 'react';
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
  Printer
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';

interface ReleaseGraphPageProps {
  onNavigate: (screen: string) => void;
}

export function ReleaseGraphPage({ onNavigate }: ReleaseGraphPageProps) {
  const [pgrcCleared, setPgrcCleared] = useState(true);
  const [vigilanceCleared, setVigilanceCleared] = useState(true);
  const [grantsCleared, setGrantsCleared] = useState(true);
  const [courtInjunctionClear, setCourtInjunctionClear] = useState(true);
  const [termServed, setTermServed] = useState(true);
  const [sanctionIssued, setSanctionIssued] = useState(false);

  const allClear = pgrcCleared && vigilanceCleared && grantsCleared && courtInjunctionClear && termServed;

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1340px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Clause 6.46 Directed Acyclic Graph (DAG)
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( Clause 6.46 *Release & Sanction Workflow* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Multi-desk statutory clearance pipeline before releasing joint FDR liens. Verifies PGRC, Vigilance, Financial Grants, and Tenor Served under AICTE regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: 13-Desk Clearance DAG */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD5] mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
                  Mandatory Prerequisites
                </span>
                <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                  Statutory Clearance Desks
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                allClear ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {allClear ? 'ELIGIBLE FOR RELEASE' : 'BLOCKED PENDING CLEARANCE'}
              </span>
            </div>

            {/* Clearance Nodes */}
            <div className="space-y-3.5">
              
              {/* Node 1: Term Served */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">1. Tenor Served (10-Year Minimum)</div>
                  <div className="text-[11px] font-mono text-[#706E66]">Maturity: 15-Aug-2034 · Clause 6.46(a)</div>
                </div>
                <button
                  onClick={() => setTermServed(!termServed)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    termServed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {termServed ? '✓ 10-Yr Served' : '✗ Premature'}
                </button>
              </div>

              {/* Node 2: PGRC Grievance */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">2. Student Grievance Portal (PGRC)</div>
                  <div className="text-[11px] font-mono text-[#706E66]">No pending student fee refund complaints</div>
                </div>
                <button
                  onClick={() => setPgrcCleared(!pgrcCleared)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    pgrcCleared ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {pgrcCleared ? '✓ Clear (0 Complaints)' : '✗ Pending Grievance'}
                </button>
              </div>

              {/* Node 3: Vigilance */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">3. Central Vigilance Bureau Clearance</div>
                  <div className="text-[11px] font-mono text-[#706E66]">No active inquiry or disciplinary embargo</div>
                </div>
                <button
                  onClick={() => setVigilanceCleared(!vigilanceCleared)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    vigilanceCleared ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {vigilanceCleared ? '✓ Vigilance Clear' : '✗ Inquiry Active'}
                </button>
              </div>

              {/* Node 4: Grants Recovery */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">4. AICTE Grants & Scheme Recovery</div>
                  <div className="text-[11px] font-mono text-[#706E66]">MODROBS, RPS, Margdarshan utilization certificates submitted</div>
                </div>
                <button
                  onClick={() => setGrantsCleared(!grantsCleared)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    grantsCleared ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {grantsCleared ? '✓ Dues Clear' : '✗ Audit Objection'}
                </button>
              </div>

              {/* Node 5: Court Injunction */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#1C1D1A]">5. High Court / Supreme Court Stay Check</div>
                  <div className="text-[11px] font-mono text-[#706E66]">No judicial restraint on encashment / release</div>
                </div>
                <button
                  onClick={() => setCourtInjunctionClear(!courtInjunctionClear)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    courtInjunctionClear ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {courtInjunctionClear ? '✓ No Restraint' : '✗ Stay Order'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Multi-Signatory Sign-Off & Sanction Order */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#706E66] block">
                Statutory Execution
              </span>
              <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                Multi-Signatory Hierarchy
              </h3>
            </div>

            {/* Approval Hierarchy Steps */}
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">1. Dealing Officer (Maker)</span>
                  <span className="font-bold text-[#1C1D1A]">Scrutinized & Recommended</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">2. Regional Director (Checker)</span>
                  <span className="font-bold text-[#1C1D1A]">Portfolio Health Attested</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex items-center justify-between">
                <div>
                  <span className="text-[#706E66] block text-[10px]">3. Approving Authority (HQ)</span>
                  <span className="font-bold text-[#1C1D1A]">Clause 6.46 Final Sanction</span>
                </div>
                {sanctionIssued ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-amber-600 font-bold">Pending Sign-off</span>
                )}
              </div>
            </div>

            {/* Action Button */}
            {!sanctionIssued ? (
              <button
                onClick={() => setSanctionIssued(true)}
                disabled={!allClear}
                className="w-full py-3.5 px-6 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white font-medium text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                Approve & Issue Sanction Order (Clause 6.46) <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official Release Order #RO-AICTE-2026-081 Generated
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed font-mono">
                  State Bank of India is authorized to release lien on FDR #SBI/PUN/2024/998214 in favour of Symbiosis Institute of Technology.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-lg bg-[#444C3D] text-white text-[11px] font-mono font-medium flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Sanction Order
                  </button>
                  <button
                    onClick={() => onNavigate('audit')}
                    className="px-3.5 py-1.5 rounded-lg border border-[#DDD6C9] bg-white text-[#1C1D1A] text-[11px] font-mono font-medium cursor-pointer"
                  >
                    View in Audit Chain →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
