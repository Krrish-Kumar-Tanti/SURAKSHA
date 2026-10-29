import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface BreadcrumbProps {
  history: readonly string[];
  currentScreen: string;
  onGoBack: (screen: string) => void;
}

const screenLabels: Record<string, string> = {
  home: 'Overview',
  portfolio: 'Portfolio',
  wizard: 'FDR Submission',
  provenance: 'Provenance',
  policy: 'Policy Trace',
  release: 'Release Graph',
  audit: 'Audit Chain',
  admin: 'Administration',
};

export function Breadcrumb({ history, currentScreen, onGoBack }: BreadcrumbProps) {
  // Determine previous screen
  const prevScreens = history.filter((h) => h !== currentScreen);
  const fallbackPrev = currentScreen === 'portfolio' ? 'home' : 'portfolio';
  const targetBack = prevScreens.length > 0 ? prevScreens[prevScreens.length - 1] : fallbackPrev;

  // Don't show on home
  if (currentScreen === 'home') return null;

  return (
    <div className="px-4 sm:px-8 max-w-[1440px] mx-auto pt-4 pb-2 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 backdrop-blur-sm border border-[#E5DFD5] shadow-xs">
        {/* Back Button - Always visible on every non-home page */}
        <button
          onClick={() => onGoBack(targetBack)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:bg-[#EFEAE1] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium transition-all shadow-xs cursor-pointer group"
          title={`Go back to ${screenLabels[targetBack] || targetBack}`}
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#444C3D] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to {screenLabels[targetBack] || targetBack}</span>
        </button>

        {/* Breadcrumb Trail */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#706E66] overflow-x-auto">
          <button
            onClick={() => onGoBack('home')}
            className="inline-flex items-center gap-1 hover:text-[#1C1D1A] transition-colors cursor-pointer shrink-0"
          >
            <Home className="w-3 h-3" />
            Home
          </button>
          {prevScreens.map((screen) => (
            <span key={screen} className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-[#B5B3AB]" />
              <button
                onClick={() => onGoBack(screen)}
                className="hover:text-[#1C1D1A] transition-colors cursor-pointer"
              >
                {screenLabels[screen] || screen}
              </button>
            </span>
          ))}
          <span className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="w-3 h-3 text-[#B5B3AB]" />
            <span className="text-[#1C1D1A] font-semibold bg-[#EFEAE1] px-2 py-0.5 rounded text-[11px]">
              {screenLabels[currentScreen] || currentScreen}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
