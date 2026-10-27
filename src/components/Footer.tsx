import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  currentRole?: string;
}

const roleCapabilities: Record<string, string[]> = {
  INSTITUTION_USER: ['Portfolio', 'FDR submission', 'Bank records', 'Policy estimate', 'Release workflow'],
  DEALING_OFFICER: ['Portfolio', 'Bank records', 'Policy estimate', 'Release workflow'],
  DIRECTOR_RB: ['Portfolio', 'Bank records', 'Release workflow'],
  COMPETENT_AUTHORITY: ['Portfolio', 'Release workflow', 'Audit'],
  ACCOUNTS: ['Release letters'],
  AUDITOR: ['Portfolio', 'Bank records', 'Audit'],
  ADMIN: ['Service reachability check', 'Administration feature availability'],
};

const publicCapabilities = [
  'Role-specific workspaces',
  'Portfolio and policy tools',
  'FDR submission',
  'Bank record review',
  'Release workflow',
  'Audit history',
  'System administration',
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
            Security-deposit submission, review, and release workflows for institutions and AICTE staff.
          </p>
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
            {currentRole ? 'Your workspace' : 'Platform features'}
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
        {currentRole === 'ADMIN' && (
          <div className="flex items-center gap-6">
            <span>API: FastAPI</span>
            <span>Data store: PostgreSQL</span>
            <span>Web client: React + TypeScript</span>
          </div>
        )}
      </div>
      <div className="max-w-[1376px] mx-auto mt-6 border-t border-[#DFD8CB] pt-4 text-[10px] text-[#706E66]">
        Demonstration build · Dashboard records and workflow outcomes are illustrative.
      </div>
    </footer>
  );
}
