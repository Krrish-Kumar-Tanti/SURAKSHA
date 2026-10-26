import React from 'react';
import { Shield, ExternalLink, CheckCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060812] pt-16 pb-12 px-6 lg:px-10 text-xs text-slate-400 relative z-10">
      <div className="max-w-[1376px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">SURAKSHA</span>
              <span className="text-[10px] text-teal-400 font-mono ml-2">SIH26265</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs max-w-md leading-relaxed">
            Policy-native Security Deposit & FDR Control Tower for the All India Council for Technical Education (AICTE). Defending statutory compliance across every college deposit.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Prototype Environment · All Data Synthetic</span>
          </div>
        </div>

        {/* Regulatory Anchors */}
        <div>
          <div className="font-bold text-white uppercase text-[11px] font-mono tracking-wider mb-3">Legal Citations</div>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li>APH 2024–27 Clause 1.12 (Table 1.4)</li>
            <li>APH 2024–27 Clause 1.12(iv) (Interest)</li>
            <li>APH 2024–27 Clause 6.46 (Release DAG)</li>
            <li>Addendum 2026–27 Item 10 (Concessions)</li>
            <li>Addendum 2026–27 Item 11 (Leased ×2.0)</li>
          </ul>
        </div>

        {/* System Capabilities */}
        <div>
          <div className="font-bold text-white uppercase text-[11px] font-mono tracking-wider mb-3">10 Platform Screens</div>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li>1. Login & Persona Switcher</li>
            <li>2. Executive Portfolio Dashboard</li>
            <li>3. FDR Submission Wizard</li>
            <li>4. Three-Way Provenance Scanner</li>
            <li>5. Policy Trace & APH Calculator</li>
            <li>6. Clause 6.46 Release DAG</li>
            <li>7. Time Machine & Countdown</li>
            <li>8. Cryptographic Audit Verifier</li>
            <li>9. Cross-Institution Pledge Radar</li>
            <li>10. Maturity Cash-Flow Forecast</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1376px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          © 2026 SURAKSHA Control Tower · Built for Smart India Hackathon (SIH26265) · AICTE Theme
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-white transition">FastAPI + PostgreSQL</span>
          <span className="hover:text-white transition">React + Vite + TypeScript</span>
          <span className="hover:text-white transition">GSAP + Lenis Engine</span>
        </div>
      </div>
    </footer>
  );
}
