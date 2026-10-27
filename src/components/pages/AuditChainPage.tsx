import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Lock, 
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

  const filtered = blocks.filter((b) => 
    b.action.toLowerCase().includes(search.toLowerCase()) ||
    b.actor.toLowerCase().includes(search.toLowerCase()) ||
    b.institution.toLowerCase().includes(search.toLowerCase()) ||
    b.payloadHash.includes(search)
  );

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] py-10 px-4 sm:px-8 max-w-[1340px] mx-auto text-left">
      {/* Top Breadcrumb & Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
          Sample audit events
        </div>
        <AnimatedHeading
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] font-['Instrument_Serif']"
        >
          ( *Audit history* )
        </AnimatedHeading>
        <p className="text-sm sm:text-base text-[#55544E] mt-2 max-w-2xl">
          Review recorded events, actors, timestamps, and record fingerprints.
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
          <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
            Audit events
          </span>
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
                  <span className="text-amber-800 font-bold">Event fingerprint</span>
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