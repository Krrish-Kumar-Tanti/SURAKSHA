import React from 'react';
import { Shield, ExternalLink, CheckCircle } from 'lucide-react';

interface FooterProps {
  currentRole?: string;
}

const roleCapabilities: Record<string, string[]> = {
  INSTITUTION_USER: ['My deposit portfolio', 'FDR submission', 'Own-deposit provenance', 'Policy information', 'Own release requests'],
  DEALING_OFFICER: ['Regional portfolio', 'FDR provenance verification', 'Policy trace', 'Release processing'],
  DIRECTOR_RB: ['Regional portfolio', 'Pledge and risk oversight', 'Release review', 'Forecast and time machine'],
  COMPETENT_AUTHORITY: ['Portfolio', 'Final release approval', 'Forecast', 'Audit read'],
  ACCOUNTS: ['Release letters', 'NOC and sanction documents', 'Reports'],
  AUDITOR: ['Portfolio read', 'Audit read and export', 'Pledge graph read'],
  ADMIN: ['User management', 'System configuration', 'Demo reset', 'Time machine'],
};

const publicCapabilities = [
  '1. Login & Persona Switcher',
  '2. Executive Portfolio Dashboard',
  '3. FDR Submission Wizard',
  '4. Three-Way Provenance Scanner',
  '5. Policy Trace & APH Calculator',
  '6. Clause 6.46 Release DAG',
  '7. Time Machine & Countdown',
  '8. Cryptographic Audit Verifier',
  '9. Cross-Institution Pledge Radar',
  '10. Maturity Cash-Flow Forecast',
];

export function Footer({ currentRole }: FooterProps) {
  const capabilities = currentRole ? roleCapabilities[currentRole] ?? [] : publicCapabilities;

  return (
    <footer className="border-t border-[#DFD8CB] bg-[#EFEAE1] pt-16 pb-12 px-6 lg:px-10 text-xs text-[#706E66] relative z-10">
      <div className="max-w-[1376px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#DFD8CB]">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#444C3D] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-normal text-[#1C1D1A] text-xl font-['Instrument_Serif'] tracking-tight">SURAKSHA</span>
              <span className="text-[10px] text-[#444C3D] font-mono ml-2 font-bold bg-[#E5DFD5] px-2 py-0.5 rounded-full">SIH26265</span>
            </div>
          </div>
          <p className="text-[#55544E] text-xs max-w-md leading-relaxed">
            Policy-native Security Deposit & FDR Control Tower for the All India Council for Technical Education (AICTE). Defending statutory compliance across every college deposit.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD6C9] text-[11px] text-[#444C3D] font-mono">
            <CheckCircle className="w-3.5 h-3.5 text-[#444C3D]" />
            <span>Prototype Environment · All Data Synthetic</span>
          </div>
        </div>

        {/* Regulatory Anchors */}
        <div>
          <div className="font-bold text-[#1C1D1A] uppercase text-[11px] font-mono tracking-wider mb-3">Legal Citations</div>
          <ul className="space-y-2 text-[#55544E] text-[11px]">
            <li>APH 2024–27 Clause 1.12 (Table 1.4)</li>
            <li>APH 2024–27 Clause 1.12(iv) (Interest)</li>
            <li>APH 2024–27 Clause 6.46 (Release DAG)</li>
            <li>Addendum 2026–27 Item 10 (Concessions)</li>
            <li>Addendum 2026–27 Item 11 (Leased ×2.0)</li>
          </ul>
        </div>

        {/* System Capabilities */}
        <div>
          <div className="font-bold text-[#1C1D1A] uppercase text-[11px] font-mono tracking-wider mb-3">
            {currentRole ? 'Your Workspace' : '10 Platform Screens'}
          </div>
          <ul className="space-y-2 text-[#55544E] text-[11px]">
            {capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
        </div>
      </div>

      <div className="max-w-[1376px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>
          © 2026 SURAKSHA Control Tower · Built for Smart India Hackathon (SIH26265) · AICTE Theme
        </div>
        <div className="flex items-center gap-6">
          <span className="hover:text-[#1C1D1A] transition">FastAPI + PostgreSQL</span>
          <span className="hover:text-[#1C1D1A] transition">React + Vite + TypeScript</span>
          <span className="hover:text-[#1C1D1A] transition">GSAP + Lenis Engine</span>
        </div>
      </div>
    </footer>
  );
}
