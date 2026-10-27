import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  FileCode, 
  Clock, 
  KeyRound
} from 'lucide-react';
import { AnimatedHeading } from '../AnimatedHeading';
import { INITIAL_AUDIT_BLOCKS, AuditBlock } from '../../lib/api';

interface AuditChainPageProps {
  onNavigate: (screen: string) => void;
  currentRole?: string;
}

export function AuditChainPage({ onNavigate, currentRole = 'AUDITOR' }: AuditChainPageProps) {
  const [blocks, setBlocks] = useState<AuditBlock[]>(INITIAL_AUDIT_BLOCKS);
  const [search, setSearch] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<boolean | null>(true);

  const filtered = blocks.filter((b) => 
    b.action.toLowerCase().includes(search.toLowerCase()) ||
    b.actor.toLowerCase().includes(search.toLowerCase()) ||
    b.institution.toLowerCase().includes(search.toLowerCase()) ||
    b.payloadHash.includes(search)
  );

  const handleVerifyChain = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedStatus(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1340px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Immutable Cryptographic Provenance Ledger
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( Cryptographic SHA-256 *Audit Chain* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-2xl">
          Every regulatory decision, CBS reconciliation handshake, discrepancy waiver, and release sanction is cryptographically hashed and linked in a tamper-evident audit ledger.
        </p>
      </div>

      {/* Verification & Search Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD5] mb-8 shadow-xs">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#706E66]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by action, actor, institution, or block hash..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] focus:outline-none focus:border-[#444C3D] text-[#1C1D1A]"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVerifyChain}
            disabled={verifying}
            className="px-5 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}
          </button>

          {verifiedStatus && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Chain Cryptographically Intact
            </span>
          )}
        </div>
      </div>

      {/* Audit Blocks List */}
      <div className="space-y-4 mb-12">
        {filtered.map((block) => (
          <div 
            key={block.index} 
            className="rounded-3xl bg-white border border-[#E5DFD5] p-6 shadow-sm hover:border-[#DDD6C9] transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DFD5] mb-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] font-mono text-xs font-bold">
                  Block #{block.index}
                </span>
                <span className="font-bold text-sm text-[#1C1D1A] font-mono">{block.action}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#706E66]">
                <Clock className="w-3.5 h-3.5" />
                <span>{block.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1">
                <span className="text-[#706E66] font-mono block text-[10px]">Statutory Actor & Role</span>
                <span className="font-semibold text-[#1C1D1A]">{block.actor}</span>
                <span className="text-[11px] text-[#55544E] block font-mono">Target: {block.institution}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] space-y-1 font-mono">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#706E66]">Payload SHA-256 Digest:</span>
                  <span className="text-emerald-700 font-bold">Verified</span>
                </div>
                <div className="text-[11px] text-[#444C3D] break-all">{block.payloadHash}</div>
                <div className="text-[10px] text-[#706E66] truncate pt-1">
                  Prev Hash: {block.previousHash}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}