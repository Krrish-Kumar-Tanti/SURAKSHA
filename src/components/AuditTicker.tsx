import React, { useState } from 'react';
import { ShieldCheck, Hash, CheckCircle2, Lock, ArrowRight, Download, RefreshCw } from 'lucide-react';

export function AuditTicker() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const events = [
    { seq: 142, event: 'RELEASE_APPROVED', actor: 'Dr. V. K. Sharma (Approver)', entity: 'REL-2026-009', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { seq: 141, event: 'CLEARANCE_GRANTED', actor: 'PGRC Desk Officer (AICTE)', entity: 'REL-2026-009', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4' },
    { seq: 140, event: 'FINDING_WAIVED', actor: 'Regional Director (WRO)', entity: 'FDR-SIT-2016-001', hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb' },
    { seq: 139, event: 'BANK_SANDBOX_RECON', actor: 'SBI CBS Gateway (Adapter)', entity: 'FDR-SIT-2016-001', hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a' },
  ];

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <section className="py-20 px-6 lg:px-10 max-w-[1376px] mx-auto relative z-10">
      <div className="rounded-3xl bg-gradient-to-b from-[#111a2b] to-[#0b1220] border border-white/10 p-8 lg:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-mono font-medium mb-3">
              <Hash className="w-3.5 h-3.5" />
              Cryptographic Audit Chain (M9)
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tamper-Evident SHA-256 Ledger
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Every deposit creation, three-way verification, director waiver, and release clearance is sealed in a continuous hash chain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="px-5 py-2.5 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-teal-500/20 cursor-pointer disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Chain...
                </>
              ) : verified ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" /> 142 Events Verified (0 Discrepancies)
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Verify Hash Chain
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Event Ticker Feed */}
        <div className="pt-6 space-y-3">
          <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">Latest Immutable Ledger Blocks</div>
          <div className="space-y-2">
            {events.map((e) => (
              <div
                key={e.seq}
                className="p-3.5 rounded-xl bg-[#172338]/60 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono hover:border-white/20 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-teal-400 font-bold">#{e.seq}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-200 font-semibold">{e.event}</span>
                  <span className="text-slate-400 hidden sm:inline">{e.actor}</span>
                  <span className="text-slate-500">[{e.entity}]</span>
                </div>
                <div className="text-slate-400 truncate max-w-xs md:max-w-sm flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-teal-400 shrink-0" />
                  <span className="text-[10px] text-teal-300/80 truncate">{e.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
