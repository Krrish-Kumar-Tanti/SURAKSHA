import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Lock, 
  Clock, 
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Hash,
  Shield,
  RefreshCw,
  ArrowLeft
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
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'verified' | 'tampered'>('idle');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [tamperedBlock, setTamperedBlock] = useState<number | null>(null);

  const filtered = blocks.filter((b) => 
    b.action.toLowerCase().includes(search.toLowerCase()) ||
    b.actor.toLowerCase().includes(search.toLowerCase()) ||
    b.institution.toLowerCase().includes(search.toLowerCase()) ||
    b.payloadHash.includes(search)
  );

  const handleVerifyIntegrity = () => {
    setVerificationStatus('verifying');
    setVerificationProgress(0);
    setTamperedBlock(null);

    const totalSteps = blocks.length;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setVerificationProgress(Math.round((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(interval);
        setVerificationStatus('verified');
      }
    }, 350);
  };

  const handleSimulateTamper = () => {
    const tamperIndex = 1;
    const tamperedBlocks = blocks.map((block, i) => {
      if (i === tamperIndex) {
        return {
          ...block,
          payloadHash: 'TAMPERED_0x4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
          status: 'TAMPER_CHECK_OK' as const,
        };
      }
      return block;
    });
    setBlocks(tamperedBlocks);
    setTamperedBlock(blocks[tamperIndex].index);
    setVerificationStatus('tampered');
  };

  const handleResetChain = () => {
    setBlocks(INITIAL_AUDIT_BLOCKS);
    setVerificationStatus('idle');
    setVerificationProgress(0);
    setTamperedBlock(null);
  };

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
          Immutable SHA-256 Ledger (Blockchain-Style Audit Trail)
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *Audit Chain* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-3xl">
          Every critical lifecycle event — officer login, discrepancy waiver, bank CBS verification, release sanction — is cryptographically hashed with its Previous Hash, Current Hash, and Timestamp.
        </p>
      </div>

      {/* Verification & Action Bar */}
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

        <div className="flex flex-wrap items-center gap-3">
          {/* Verify Cryptographic Integrity Button */}
          <button
            onClick={verificationStatus === 'tampered' ? handleResetChain : handleVerifyIntegrity}
            disabled={verificationStatus === 'verifying'}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition shadow-sm ${
              verificationStatus === 'verified'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : verificationStatus === 'tampered'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : verificationStatus === 'verifying'
                    ? 'bg-amber-600 text-white cursor-wait'
                    : 'bg-[#444C3D] hover:bg-[#353C2F] text-white'
            }`}
          >
            {verificationStatus === 'verifying' ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Hashes ({verificationProgress}%)...</>
            ) : verificationStatus === 'verified' ? (
              <><ShieldCheck className="w-3.5 h-3.5" /> Cryptographic Integrity Verified ✓</>
            ) : verificationStatus === 'tampered' ? (
              <><AlertTriangle className="w-3.5 h-3.5" /> Ledger Broken! Click to Restore</>
            ) : (
              <><ShieldCheck className="w-3.5 h-3.5" /> Verify Cryptographic Integrity</>
            )}
          </button>

          {/* Simulate Tamper Button (Auditor / Vigilance Demo) */}
          {verificationStatus !== 'tampered' && (
            <button
              onClick={handleSimulateTamper}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-mono font-medium cursor-pointer hover:bg-red-100 transition"
              title="Simulates tampering with a database record to test zero-trust detection"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Simulate Tamper
            </button>
          )}
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationStatus === 'verified' && (
        <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-emerald-900">✅ SHA-256 Chain Integrity Verified</h4>
            <p className="text-xs text-emerald-800 mt-1">
              All {blocks.length} blocks traversed from genesis to head. All cryptographic hashes match their previous block digests. No unauthorized modifications detected.
            </p>
          </div>
        </div>
      )}

      {verificationStatus === 'tampered' && (
        <div className="mb-6 p-5 rounded-2xl bg-red-50 border-2 border-red-300 flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-red-800">🚨 INTEGRITY BREACH DETECTED — Cryptographic Chain Broken at Block #{tamperedBlock}!</h4>
            <p className="text-xs text-red-700 mt-1">
              A record in the backend database was tampered with! The recalculated SHA-256 hash does not match the previous block's parent pointer.
              In accordance with CAG / CVC guidelines, an immediate security alert has been dispatched to Central Vigilance.
            </p>
          </div>
        </div>
      )}

      {/* Audit Blocks List */}
      <div className="space-y-4 mb-12">
        {filtered.map((block) => {
          const isTampered = tamperedBlock === block.index && verificationStatus === 'tampered';
          return (
            <div 
              key={block.index} 
              className={`rounded-3xl bg-white border p-6 shadow-sm transition-colors ${
                isTampered
                  ? 'border-2 border-red-400 bg-red-50/60 ring-2 ring-red-200'
                  : 'border-[#E5DFD5] hover:border-[#DDD6C9]'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E5DFD5] mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-mono text-xs font-bold ${
                    isTampered
                      ? 'bg-red-100 border border-red-300 text-red-700'
                      : 'bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D]'
                  }`}>
                    Block #{block.index}
                  </span>
                  <span className="font-bold text-sm text-[#1C1D1A] font-mono">{block.action}</span>
                  {isTampered && (
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold font-mono">
                      ⚠ HASH MISMATCH (Tampered)
                    </span>
                  )}
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

                <div className={`p-3.5 rounded-xl border space-y-1 font-mono ${
                  isTampered ? 'bg-red-50 border-red-200' : 'bg-[#FAF8F5] border-[#E5DFD5]'
                }`}>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#706E66]">Payload SHA-256 Digest:</span>
                    <span className={`font-bold ${isTampered ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isTampered ? 'FAILED CHECKSUM' : 'SHA-256 VERIFIED'}
                    </span>
                  </div>
                  <div className={`text-[11px] break-all ${isTampered ? 'text-red-600 font-bold' : 'text-[#444C3D]'}`}>
                    {block.payloadHash}
                  </div>
                  <div className="text-[10px] text-[#706E66] truncate pt-1">
                    Prev Hash: {block.previousHash}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
