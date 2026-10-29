import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

interface BreadcrumbProps {
  history: readonly string[];
  currentScreen: string;
  onGoBack: (screen: string) => void;
}

export function Breadcrumb({ history, currentScreen, onGoBack }: BreadcrumbProps) {
  const { language, t } = useLanguage();

  const getScreenLabel = (screen: string): string => {
    switch (screen) {
      case 'home':
        return t('nav.overview', 'Overview');
      case 'guide':
        return t('nav.guide', 'Guide');
      case 'howItWorks':
        return t('nav.howItWorks', 'How It Works');
      case 'contact':
        return t('nav.contact', 'Contact Us');
      case 'portfolio':
        return t('nav.portfolio', 'Portfolio');
      case 'wizard':
        return t('nav.wizard', 'FDR Submission');
      case 'provenance':
        return t('nav.provenance', 'Provenance');
      case 'policy':
        return t('nav.policy', 'Policy Trace');
      case 'release':
        return t('nav.release', 'Release Graph');
      case 'audit':
        return t('nav.audit', 'Audit Chain');
      case 'admin':
        return t('nav.admin', 'Administration');
      default:
        return screen;
    }
  };

  // Determine previous screen
  const prevScreens = history.filter((h) => h !== currentScreen);
  const fallbackPrev = currentScreen === 'portfolio' ? 'home' : 'portfolio';
  const targetBack = prevScreens.length > 0 ? prevScreens[prevScreens.length - 1] : fallbackPrev;

  // Don't show on home
  if (currentScreen === 'home') return null;

  const targetLabel = getScreenLabel(targetBack);

  return (
    <div className="px-4 sm:px-8 max-w-[1440px] mx-auto pt-4 pb-2 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E5DFD5] shadow-xs">
        {/* Back Button - Always visible on every non-home page */}
        <button
          onClick={() => onGoBack(targetBack)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-[#EFEAE1] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium transition-all shadow-xs cursor-pointer group"
          title={`${language === 'hi' ? 'वापस जाएं:' : 'Go back to'} ${targetLabel}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#444C3D] group-hover:-translate-x-0.5 transition-transform" />
          <span>
            {language === 'hi' ? `${targetLabel} पर वापस जाएं` : `Back to ${targetLabel}`}
          </span>
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#706E66] overflow-x-auto">
          <button
            onClick={() => onGoBack('home')}
            className="inline-flex items-center gap-1 hover:text-[#1C1D1A] transition-colors cursor-pointer shrink-0"
          >
            <Home className="w-3 h-3" />
            {t('nav.overview', 'Overview')}
          </button>
          {prevScreens.map((screen) => (
            <span key={screen} className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-[#B5B3AB]" />
              <button
                onClick={() => onGoBack(screen)}
                className="hover:text-[#1C1D1A] transition-colors cursor-pointer"
              >
                {getScreenLabel(screen)}
              </button>
            </span>
          ))}
          <span className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-[#B5B3AB]" />
            <span className="text-[#1C1D1A] font-semibold">
              {getScreenLabel(currentScreen)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
