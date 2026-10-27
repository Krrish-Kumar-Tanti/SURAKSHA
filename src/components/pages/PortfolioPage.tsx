import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { INITIAL_INSTITUTIONS, InstitutionItem } from '../../lib/api';
import { AnimatedHeading } from '../AnimatedHeading';
import { isScreenAllowed } from '../../lib/roleAccess';

interface PortfolioPageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function PortfolioPage({ onNavigate, currentRole = 'DEALING_OFFICER' }: PortfolioPageProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedInst, setSelectedInst] = useState<InstitutionItem | null>(null);

  const isInstitutionUser = currentRole === 'INSTITUTION_USER';
  const visibleInstitutions = isInstitutionUser
    ? INITIAL_INSTITUTIONS.filter((inst) => inst.id === 'inst-1')
    : ['DEALING_OFFICER', 'DIRECTOR_RB'].includes(currentRole)
      ? INITIAL_INSTITUTIONS.filter((inst) => inst.region.includes('Western') || inst.region.includes('(WRO)'))
      : INITIAL_INSTITUTIONS;
  const totalPledgedLakhs = visibleInstitutions.reduce((total, inst) => total + inst.pledgedAmountLakhs, 0);
  const compliantCount = visibleInstitutions.filter((inst) => inst.status === 'COMPLIANT').length;
  const flaggedCount = visibleInstitutions.filter((inst) => inst.status === 'FLAGGED').length;
  const maturityDueCount = visibleInstitutions.filter((inst) => inst.status === 'RENEWAL_DUE').length;
  const portfolioTitle = isInstitutionUser ? '( My Deposit Portfolio )' : '( Institutional Deposit Portfolio )';
  const formatAmount = (amountLakhs: number) => amountLakhs >= 100
    ? `₹${(amountLakhs / 100).toFixed(2)} Cr`
    : `₹${amountLakhs} Lakhs`;

  const filtered = visibleInstitutions.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.aicteId.includes(search) ||
      inst.bankName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || inst.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          {isInstitutionUser ? 'Institution Deposit Workspace' : 'Regional Bureau Executive Portfolio'}
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          {portfolioTitle}
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-2xl">
          {isInstitutionUser
            ? 'Your institution’s security deposit, verification status, and maturity information.'
            : 'Live monitoring of regional security deposits under APH Table 1.4 mandates.'}
        </p>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>{isInstitutionUser ? 'Your Deposit Pledged' : 'Total Value Pledged'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{formatAmount(totalPledgedLakhs)}</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">{visibleInstitutions.length} {visibleInstitutions.length === 1 ? 'institution' : 'institutions'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Active Instruments</span>
            <span className="text-xs font-bold text-[#444C3D]">{visibleInstitutions.length} Total</span>
          </div>
          <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{compliantCount} Compliant</div>
          <div className="text-xs text-emerald-700 mt-1 font-mono">
            {visibleInstitutions.length ? Math.round((compliantCount / visibleInstitutions.length) * 100) : 0}% Clean Provenance
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Discrepancies Flagged</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-3xl font-normal text-amber-700 font-['Instrument_Serif']">{flaggedCount} Flagged</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">
            {flaggedCount ? 'Requires Officer Resolution' : 'No flagged deposits'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Maturity &lt; 90 Days</span>
            <span className="text-xs text-[#444C3D] font-mono">Clause 6.46</span>
          </div>
          <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{maturityDueCount} Due</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">
            {maturityDueCount ? 'Maturity follow-up required' : 'No upcoming maturity flags'}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD5] mb-6">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#706E66]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Institution Name, AICTE ID, or Bank IFSC..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-none focus:border-[#444C3D] text-[#1C1D1A]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'COMPLIANT', 'DEFICIT', 'FLAGGED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#444C3D] text-white font-bold'
                  : 'bg-[#ECE7DE] text-[#55544E] hover:text-[#1C1D1A]'
              }`}
            >
              {st}
            </button>
          ))}
          {isScreenAllowed(currentRole, 'wizard') && <button
            onClick={() => onNavigate('wizard')}
            className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium cursor-pointer shadow-sm"
          >
            + Submit New FDR
          </button>}
        </div>
      </div>

      {/* Institution Table View */}
      <div className="rounded-2xl bg-white border border-[#E5DFD5] shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E5DFD5] text-[#706E66] font-mono uppercase text-[11px]">
                <th className="py-3.5 px-4">Institution & AICTE ID</th>
                <th className="py-3.5 px-4">Programme & Tenure</th>
                <th className="py-3.5 px-4">Deposit (Req / Pledged)</th>
                <th className="py-3.5 px-4">Bank & Instrument</th>
                <th className="py-3.5 px-4">Compliance Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {filtered.map((inst) => (
                <tr 
                  key={inst.id} 
                  className="hover:bg-[#F8F5EE]/60 transition-colors cursor-pointer group"
                  onClick={() => setSelectedInst(inst)}
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-sm text-[#1C1D1A] group-hover:text-[#444C3D] transition-colors">
                      {inst.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#706E66] flex items-center gap-2 mt-0.5">
                      <span>ID: {inst.aicteId}</span>
                      <span>•</span>
                      <span>{inst.state} ({inst.region})</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#55544E]">
                    <div className="font-medium text-[#1C1D1A]">{inst.programme}</div>
                    <div className="text-[11px] font-mono text-[#706E66]">Maturity: {inst.maturityDate}</div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <div className="font-bold text-[#1C1D1A]">₹{inst.pledgedAmountLakhs}L / ₹{inst.requiredAmountLakhs}L</div>
                    <div className="w-24 bg-[#ECE7DE] h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          inst.pledgedAmountLakhs >= inst.requiredAmountLakhs ? 'bg-emerald-600' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (inst.pledgedAmountLakhs / inst.requiredAmountLakhs) * 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#1C1D1A]">{inst.bankName}</div>
                    <div className="text-[11px] font-mono text-[#706E66] truncate max-w-[150px]">{inst.fdrReceipt}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                      inst.status === 'COMPLIANT' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      inst.status === 'FLAGGED' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        inst.status === 'COMPLIANT' ? 'bg-emerald-600' :
                        inst.status === 'FLAGGED' ? 'bg-amber-600' : 'bg-red-600'
                      }`} />
                      {inst.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(isScreenAllowed(currentRole, 'provenance') ? 'provenance' : 'release');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#444C3D] font-medium text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isScreenAllowed(currentRole, 'provenance') ? 'Inspect' : 'Release'} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Institution Inspector Modal */}
      {selectedInst && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#E5DFD5] shadow-2xl relative text-left">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] px-2.5 py-1 rounded-full">
                  AICTE ID: {selectedInst.aicteId}
                </span>
                <h3 className="text-xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] mt-2">
                  {selectedInst.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInst(null)}
                className="w-8 h-8 rounded-full bg-[#ECE7DE] flex items-center justify-center text-sm font-bold text-[#55544E] hover:text-[#1C1D1A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5]">
                <div>
                  <span className="text-[#706E66] font-mono block">Required Security Deposit</span>
                  <span className="text-base font-bold text-[#1C1D1A]">₹{selectedInst.requiredAmountLakhs} Lakhs</span>
                </div>
                <div>
                  <span className="text-[#706E66] font-mono block">Total Pledged Deposit</span>
                  <span className="text-base font-bold text-emerald-700">₹{selectedInst.pledgedAmountLakhs} Lakhs</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1">
                <span className="text-[#706E66] font-mono block">Bank Verification Status</span>
                <div className="font-semibold text-sm text-[#1C1D1A]">{selectedInst.bankName}</div>
                <div className="text-[11px] font-mono text-[#55544E]">Receipt: {selectedInst.fdrReceipt}</div>
                <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Core Banking Joint Account Lien Pledged to AICTE
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5DFD5]">
              <button
                onClick={() => setSelectedInst(null)}
                className="px-4 py-2 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E] hover:bg-[#FAF8F5]"
              >
                Close
              </button>
              {isScreenAllowed(currentRole, 'provenance') && <button
                onClick={() => {
                  setSelectedInst(null);
                  onNavigate('provenance');
                }}
                className="px-5 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                Verify 3-Way Provenance <ArrowRight className="w-3.5 h-3.5" />
              </button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
