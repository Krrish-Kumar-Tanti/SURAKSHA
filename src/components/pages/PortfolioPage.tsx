import React, { useEffect, useState } from 'react';
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
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import {
  downloadStoredDocument,
  getSavedSession,
  getStoredFdrRecords,
  INITIAL_INSTITUTIONS,
  InstitutionItem,
  StoredInstrumentRecord,
} from '../../lib/api';
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
  const [storedRecords, setStoredRecords] = useState<StoredInstrumentRecord[]>([]);
  const [recordsError, setRecordsError] = useState('');
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [documentError, setDocumentError] = useState('');

  const session = getSavedSession();

  useEffect(() => {
    let active = true;
    setIsLoadingRecords(true);

    const loadRecords = () => {
      getStoredFdrRecords()
        .then((records) => {
          if (active) setStoredRecords(records);
        })
        .catch((error: unknown) => {
          if (active) {
            setRecordsError(error instanceof Error ? error.message : 'Submitted records could not be loaded.');
          }
        })
        .finally(() => {
          if (active) setIsLoadingRecords(false);
        });
    };

    loadRecords();

    const handleRecordAdded = () => {
      loadRecords();
    };

    window.addEventListener('suraksha_record_added', handleRecordAdded);
    return () => {
      active = false;
      window.removeEventListener('suraksha_record_added', handleRecordAdded);
    };
  }, [currentRole]);

  const isInstitutionUser = currentRole === 'INSTITUTION_USER';

  // Convert real stored records into InstitutionItem if available
  const realItems: InstitutionItem[] = storedRecords.map((r) => ({
    id: r.id,
    aicteId: session?.institutionId || '1-1092847291',
    name: r.institution_name,
    state: 'Maharashtra',
    region: 'Western (WRO)',
    programme: r.programme || 'Engineering UG',
    requiredAmountLakhs: 70,
    pledgedAmountLakhs: Math.round(r.amount_paise / 100000) / 10,
    status: r.verification_status === 'VERIFIED' ? 'COMPLIANT' : (r.verification_status === 'REJECTED' ? 'DEFICIT' : 'FLAGGED'),
    riskScore: r.verification_status === 'VERIFIED' ? 10 : 75,
    fdrReceipt: r.instrument_number,
    bankName: r.bank_name,
    maturityDate: r.maturity_date,
  }));

  const baseInstitutions = isInstitutionUser
    ? (realItems.length > 0 ? realItems : INITIAL_INSTITUTIONS.filter((inst) => inst.id === 'inst-1'))
    : ['DEALING_OFFICER', 'DIRECTOR_RB'].includes(currentRole)
      ? [...realItems, ...INITIAL_INSTITUTIONS.filter((inst) => inst.region.includes('Western') || inst.region.includes('(WRO)'))]
      : [...realItems, ...INITIAL_INSTITUTIONS];

  // Deduplicate by instrument number or id
  const visibleInstitutions = Array.from(new Map(baseInstitutions.map((i) => [i.fdrReceipt || i.id, i])).values());

  const totalPledgedLakhs = visibleInstitutions.reduce((total, inst) => total + inst.pledgedAmountLakhs, 0);
  const compliantCount = visibleInstitutions.filter((inst) => inst.status === 'COMPLIANT').length;
  const flaggedCount = visibleInstitutions.filter((inst) => inst.status === 'FLAGGED').length;
  const maturityDueCount = visibleInstitutions.filter((inst) => inst.status === 'RENEWAL_DUE').length;
  const blockedCount = visibleInstitutions.filter((inst) => inst.status === 'DEFICIT').length;

  const portfolioTitle = isInstitutionUser ? '( My Deposit Portfolio )' : '( Regional FDR Portfolio & Ledger )';
  const formatAmount = (amountLakhs: number) => amountLakhs >= 100
    ? `₹${(amountLakhs / 100).toFixed(2)} Cr`
    : `₹${amountLakhs.toFixed(1)} Lakhs`;

  const statusLabels: Record<string, string> = {
    ALL: 'All Records',
    COMPLIANT: 'Active',
    DEFICIT: 'Blocked',
    FLAGGED: 'Discrepant',
    RENEWAL_DUE: 'Maturing',
  };

  const statusFilterMap: Record<string, string> = {
    ALL: 'ALL',
    DISCREPANT: 'FLAGGED',
    ACTIVE: 'COMPLIANT',
    MATURING: 'RENEWAL_DUE',
    BLOCKED: 'DEFICIT',
  };

  const filtered = visibleInstitutions.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.aicteId.includes(search) ||
      inst.bankName.toLowerCase().includes(search.toLowerCase());
    const targetStatus = statusFilterMap[filterStatus] ?? filterStatus;
    const matchesStatus = filterStatus === 'ALL' || inst.status === targetStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-8 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#444C3D] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
        </button>
      </div>

      {/* Top Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          {isInstitutionUser ? 'Institution Security Deposit Custody' : 'Regional AICTE Security Deposit Repository'}
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          {portfolioTitle}
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          {isInstitutionUser
            ? 'Track your institution’s pledged FDRs, maturity schedules, bank lien status, and statutory compliance.'
            : 'Searchable digital ledger of all college FDRs across the region. Replaces physical paper registers with real-time status and discrepancy red-flags.'}
        </p>
      </div>

      {/* Red-Flag Banner for Director / Auditor */}
      {(currentRole === 'DIRECTOR_RB' || currentRole === 'AUDITOR') && flaggedCount > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                Suspicious Colleges Red-Flagged ({flaggedCount} Discrepant FDR)
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                One or more colleges have reported declared deposits that differ from bank CBS live records. Immediate audit review recommended.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('DISCREPANT')}
            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium cursor-pointer shrink-0"
          >
            Filter Discrepant
          </button>
        </div>
      )}

      {/* Real Submissions Section for Real Users */}
      {storedRecords.length > 0 && (
        <section className="mb-8 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5DFD5] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1C1D1A]">
                {isInstitutionUser ? 'Your Live Stored Submissions' : 'Recent Encrypted Submissions'}
              </h2>
              <p className="text-xs text-[#706E66] mt-0.5 font-mono">
                Real records submitted to AICTE backend database
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
              {storedRecords.length} Active Records
            </span>
          </div>

          <div className="divide-y divide-[#E5DFD5]">
            {storedRecords.map((record) => (
              <article key={record.id} className="px-5 py-4 hover:bg-[#FAF8F5]/60 transition">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-[#1C1D1A]">
                      {record.instrument_number} · {record.institution_name}
                    </h3>
                    <p className="mt-1 text-xs text-[#55544E]">
                      {record.bank_name} · {record.branch} · IFSC {record.ifsc}
                    </p>
                    <p className="mt-1 text-xs text-[#706E66] font-mono">
                      Amount ₹{(record.amount_paise / 100).toLocaleString('en-IN')} · Matures {record.maturity_date} · Status: {record.status}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-mono font-bold ${
                    record.verification_status === 'VERIFIED'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {record.verification_status.replace(/_/g, ' ')}
                  </span>
                </div>
                {record.documents.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {record.documents.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => {
                          setDocumentError('');
                          void downloadStoredDocument(doc).catch((error: unknown) => {
                            setDocumentError(error instanceof Error ? error.message : 'Receipt download failed.');
                          });
                        }}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#DDD6C9] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#444C3D] hover:bg-[#EFEAE1]"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Encrypted Receipt: {doc.file_name}
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          {documentError && <p role="alert" className="px-5 pb-4 text-sm text-red-800">{documentError}</p>}
        </section>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Total Value Pledged</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{formatAmount(totalPledgedLakhs)}</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">{visibleInstitutions.length} {visibleInstitutions.length === 1 ? 'institution' : 'institutions'}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Active & Clear</span>
            <span className="text-xs font-bold text-[#444C3D]">{compliantCount} Active</span>
          </div>
          <div className="text-3xl font-normal text-emerald-800 font-['Instrument_Serif']">{compliantCount} Cleared</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">
            {compliantCount} compliant with Table 1.4
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>Discrepant / Flagged</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-3xl font-normal text-amber-700 font-['Instrument_Serif']">{flaggedCount} Flagged</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">
            {flaggedCount ? 'Requires Director/Auditor scrutiny' : 'No discrepancies detected'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E5DFD5] shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-[#706E66] mb-2">
            <span>10-Year Maturing</span>
            <span className="text-xs text-[#444C3D] font-mono">Clause 6.46</span>
          </div>
          <div className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">{maturityDueCount} Due</div>
          <div className="text-xs text-[#55544E] mt-1 font-mono">
            {maturityDueCount ? 'Eligible for release DAG' : 'All lock-in active'}
          </div>
        </div>
      </div>

      {/* Search & 1-Click Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD5] mb-6 shadow-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#706E66]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search institution name, AICTE ID, or bank name..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-none focus:border-[#444C3D] text-[#1C1D1A]"
          />
        </div>

        {/* 1-Click Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-mono text-[#706E66] mr-1 hidden sm:inline">Filter:</span>
          {['ALL', 'DISCREPANT', 'ACTIVE', 'MATURING', 'BLOCKED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#444C3D] text-white font-bold shadow-xs'
                  : 'bg-[#ECE7DE] text-[#55544E] hover:text-[#1C1D1A]'
              }`}
            >
              {st}
            </button>
          ))}
          {isScreenAllowed(currentRole, 'wizard') && (
            <button
              onClick={() => onNavigate('wizard')}
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium cursor-pointer shadow-sm"
            >
              + Submit New FDR
            </button>
          )}
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
                <th className="py-3.5 px-4">Deposit (Pledged / Req)</th>
                <th className="py-3.5 px-4">Bank & Instrument</th>
                <th className="py-3.5 px-4">Ledger Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD5]">
              {filtered.map((inst) => (
                <tr 
                  key={inst.id} 
                  className={`hover:bg-[#F8F5EE]/60 transition-colors cursor-pointer group ${
                    inst.status === 'FLAGGED' ? 'bg-amber-50/20' : ''
                  }`}
                  onClick={() => setSelectedInst(inst)}
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-sm text-[#1C1D1A] group-hover:text-[#444C3D] transition-colors flex items-center gap-2">
                      {inst.name}
                      {inst.status === 'FLAGGED' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
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
                      inst.status === 'FLAGGED' ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold' :
                      inst.status === 'DEFICIT' ? 'bg-red-50 text-red-800 border border-red-200' :
                      'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        inst.status === 'COMPLIANT' ? 'bg-emerald-600' :
                        inst.status === 'FLAGGED' ? 'bg-amber-600' : 'bg-red-600'
                      }`} />
                      {statusLabels[inst.status] ?? inst.status}
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
                      {isScreenAllowed(currentRole, 'provenance') ? '3-Way Match' : 'Release DAG'} <ChevronRight className="w-3.5 h-3.5" />
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
                className="w-8 h-8 rounded-full bg-[#ECE7DE] flex items-center justify-center text-sm font-bold text-[#55544E] hover:text-[#1C1D1A] cursor-pointer"
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
                <span className="text-[#706E66] font-mono block">Bank & Instrument Particulars</span>
                <div className="font-semibold text-sm text-[#1C1D1A]">{selectedInst.bankName}</div>
                <div className="text-[11px] font-mono text-[#55544E]">Receipt Number: {selectedInst.fdrReceipt}</div>
                <div className="text-[11px] font-mono text-[#55544E]">Maturity Date: {selectedInst.maturityDate}</div>
              </div>

              {/* Document Sovereign Storage & Access */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#706E66] font-mono block">Encrypted Sovereign Document Storage</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    AES-256 GCM SECURED
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#55544E] space-y-0.5">
                  <div><strong>Storage Engine:</strong> PostgreSQL Sovereign Vault (/vault/fdr_records/)</div>
                  <div><strong>Receipt Copy:</strong> {storedRecords.find((r) => r.instrument_number === selectedInst.fdrReceipt)?.documents?.[0]?.file_name || `${selectedInst.fdrReceipt.replace(/\//g, '_')}_Certificate.pdf`}</div>
                  <div className="truncate"><strong>SHA-256:</strong> {storedRecords.find((r) => r.instrument_number === selectedInst.fdrReceipt)?.documents?.[0]?.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}</div>
                </div>
                <button
                  onClick={() => {
                    const matched = storedRecords.find((r) => r.instrument_number === selectedInst.fdrReceipt);
                    const docToDownload = matched?.documents?.[0] || {
                      id: 'doc_preview',
                      file_name: `${selectedInst.fdrReceipt.replace(/\//g, '_')}_Certificate.pdf`,
                      mime_type: 'application/pdf',
                      size_bytes: 482910,
                      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
                      ocr_status: 'OCR_VERIFIED',
                      uploaded_at: new Date().toISOString(),
                      download_url: '#',
                    };
                    downloadStoredDocument(docToDownload);
                  }}
                  className="w-full mt-1 py-1.5 px-3 rounded-lg border border-[#DDD6C9] bg-white hover:bg-[#F2EFE9] text-[#1C1D1A] text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer transition shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-[#444C3D]" /> Download / View Stored Receipt
                </button>
              </div>

              {selectedInst.status === 'FLAGGED' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4" /> Discrepancy Flagged
                  </div>
                  <p>
                    Certificate amount does not match core banking ledger balance. Inspect via 3-Way Matcher.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#E5DFD5]">
              <button
                onClick={() => setSelectedInst(null)}
                className="px-4 py-2 rounded-lg border border-[#DDD6C9] text-xs font-medium text-[#55544E] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Close
              </button>
              {isScreenAllowed(currentRole, 'provenance') && (
                <button
                  onClick={() => {
                    setSelectedInst(null);
                    onNavigate('provenance');
                  }}
                  className="px-5 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  Inspect 3-Way Match <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
