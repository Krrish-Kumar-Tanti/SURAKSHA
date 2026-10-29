import React from 'react';
import { Shield } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface FooterProps {
  currentRole?: string;
}

export function Footer({ currentRole }: FooterProps) {
  const { language, t } = useLanguage();

  return (
    <footer className="border-t border-[#DFD8CB] bg-[#EFEAE1] pt-16 pb-12 px-6 lg:px-10 text-xs text-[#706E66] relative z-10">
      <div className="max-w-[1376px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#DFD8CB] text-left">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#444C3D] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-normal text-[#1C1D1A] text-xl font-['Instrument_Serif'] tracking-tight">
                {t('nav.brand', 'SURAKSHA')}
              </span>
              <span className="text-[10px] text-[#444C3D] font-mono ml-2 font-bold bg-[#E5DFD5] px-2 py-0.5 rounded-full">
                SIH26265
              </span>
            </div>
          </div>
          <p className="text-[#55544E] text-xs max-w-md leading-relaxed">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Regulatory Anchors */}
        <div>
          <div className="font-bold text-[#1C1D1A] uppercase text-[11px] font-mono tracking-wider mb-3">
            {language === 'hi' ? 'वैधानिक संदर्भ (Legal Citations)' : 'Regulatory Legal Citations'}
          </div>
          <ul className="space-y-2 text-[#55544E] text-[11px] font-mono">
            <li>APH 2024–27 Clause 1.12 (Table 1.4)</li>
            <li>APH 2024–27 Clause 1.12(iv) (Interest)</li>
            <li>APH 2024–27 Clause 6.46 (Release DAG)</li>
            <li>Addendum 2026–27 Item 10 (Concessions)</li>
            <li>Addendum 2026–27 Item 11 (Leased ×2.0)</li>
          </ul>
        </div>

        {/* Core Pillars */}
        <div>
          <div className="font-bold text-[#1C1D1A] uppercase text-[11px] font-mono tracking-wider mb-3">
            {language === 'hi' ? 'संरचनात्मक मॉड्यूल' : 'System Modules'}
          </div>
          <ul className="space-y-2 text-[#55544E] text-[11px]">
            <li>{t('nav.overview', 'Overview')}</li>
            <li>{t('nav.guide', 'Guide (7 Roles)')}</li>
            <li>{t('nav.howItWorks', 'How It Works (6 Domains)')}</li>
            <li>{t('nav.wizard', 'FDR In-Browser OCR')}</li>
            <li>{t('nav.provenance', '3-Way Reconciliation')}</li>
            <li>{t('nav.release', 'APH 6.46 DAG')}</li>
            <li>{t('nav.audit', 'SHA-256 Audit Chain')}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1376px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
        <div>{t('footer.copyright')}</div>
        <div className="font-mono text-[#444C3D]">
          {language === 'hi' ? 'स्मार्ट इंडिया हैकाथॉन 2026 · दल SURAKSHA' : 'Smart India Hackathon 2026 · Team SURAKSHA'}
        </div>
      </div>
    </footer>
  );
}
