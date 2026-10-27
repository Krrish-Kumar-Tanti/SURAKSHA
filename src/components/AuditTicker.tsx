import React from 'react';
import { Hash, Lock } from 'lucide-react';
import { AnimatedHeading } from './AnimatedHeading';

export function AuditTicker() {
  const events = [
    { seq: 142, event: 'RELEASE_APPROVED', actor: 'Dr. V. K. Sharma (Approver)', entity: 'REL-2026-009', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { seq: 141, event: 'CLEARANCE_GRANTED', actor: 'PGRC Desk Officer (AICTE)', entity: 'REL-2026-009', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { seq: 140, event: 'FINDING_WAIVED', actor: 'Regional Director (WRO)', entity: 'FDR-SIT-2016-001', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    { seq: 139, event: 'BANK_SANDBOX_RECON', actor: 'SBI CBS Gateway (Adapter)', entity: 'FDR-SIT-2016-001', hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' },
  ];

  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1376px] mx-auto relative z-10">
      <div className="rounded-3xl bg-white border border-[#E5DFD5] p-8 lg:p-10 shadow-[0_15px_45px_rgba(28,29,26,0.06)] relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-[#E5DFD5]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-3">
              <Hash className="w-3.5 h-3.5 text-[#444C3D]" />
              Sample audit events
            </div>
            <AnimatedHeading
              as="h3"
              className="text-2xl sm:text-3xl font-normal text-[#1C1D1A] tracking-[-0.02em]"
            >
              Example event history
            </AnimatedHeading>
            <p className="text-[#55544E] text-xs sm:text-sm mt-1 max-w-xl">
              Review recent audit event examples.
            </p>
          </div>

          <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900">
            Audit history
          </div>
        </div>

        {/* Audit event list */}
        <div className="pt-6 space-y-3">
          <div className="text-[11px] font-mono uppercase text-[#706E66] font-bold">Recent events</div>
          <div className="space-y-2">
            {events.map((e) => (
              <div
                key={e.seq}
                className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD5] flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono hover:border-[#DDD6C9] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[#444C3D] font-bold">#{e.seq}</span>
                  <span className="px-2 py-0.5 rounded bg-[#ECE7DE] text-[#1C1D1A] font-medium">{e.event}</span>
                  <span className="text-[#55544E] hidden sm:inline">{e.actor}</span>
                  <span className="text-[#706E66]">[{e.entity}]</span>
                </div>
                <div className="text-[#706E66] truncate max-w-xs md:max-w-sm flex items-center gap-1.5">
                  <Hash className="w-3 h-3 text-[#444C3D] shrink-0" />
                  <span className="text-[10px] text-[#444C3D] truncate">{e.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
