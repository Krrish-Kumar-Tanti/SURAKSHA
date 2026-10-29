import React, { useState } from 'react';
import { 
  Shield, 
  Clock, 
  UserCheck, 
  ChevronDown, 
  CheckCircle2, 
  Lock, 
  LogOut, 
  Globe, 
  BookOpen, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { UserSession } from '../lib/api';
import { isScreenAllowed } from '../lib/roleAccess';
import { useLanguage } from '../lib/i18n';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
  isAuthenticated: boolean;
  userSession: UserSession | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Navbar({ 
  currentRole, 
  onRoleChange, 
  activeScreen, 
  onNavigate,
  isAuthenticated,
  userSession,
  onLoginClick,
  onLogoutClick
}: NavbarProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const roles = [
    { id: 'INSTITUTION_USER', labelKey: 'role.INSTITUTION_USER', descKey: 'role.INSTITUTION_USER.desc' },
    { id: 'DEALING_OFFICER', labelKey: 'role.DEALING_OFFICER', descKey: 'role.DEALING_OFFICER.desc' },
    { id: 'DIRECTOR_RB', labelKey: 'role.DIRECTOR_RB', descKey: 'role.DIRECTOR_RB.desc' },
    { id: 'COMPETENT_AUTHORITY', labelKey: 'role.COMPETENT_AUTHORITY', descKey: 'role.COMPETENT_AUTHORITY.desc' },
    { id: 'ACCOUNTS', labelKey: 'role.ACCOUNTS', descKey: 'role.ACCOUNTS.desc' },
    { id: 'AUDITOR', labelKey: 'role.AUDITOR', descKey: 'role.AUDITOR.desc' },
    { id: 'ADMIN', labelKey: 'role.ADMIN', descKey: 'role.ADMIN.desc' },
  ];

  const canSwitchDemoRole = userSession?.token.startsWith('jwt_synthetic_token_') ?? false;

  const handleNavClick = (screen: string) => {
    if (!isAuthenticated && screen !== 'home' && screen !== 'guide' && screen !== 'howItWorks') {
      onLoginClick();
      return;
    }
    if (isAuthenticated && !isScreenAllowed(currentRole, screen)) return;
    onNavigate(screen);
  };

  const navItems = [
    { screen: 'home', label: t('nav.overview', 'Overview') },
    { screen: 'guide', label: t('nav.guide', 'Guide') },
    { screen: 'howItWorks', label: t('nav.howItWorks', 'How It Works') },
    { screen: 'portfolio', label: t('nav.portfolio', 'Portfolio') },
    { screen: 'wizard', label: t('nav.wizard', 'FDR Submission') },
    { screen: 'provenance', label: t('nav.provenance', 'Provenance') },
    { screen: 'policy', label: t('nav.policy', 'Policy Trace') },
    { 
      screen: 'release', 
      label: currentRole === 'ACCOUNTS' 
        ? t('nav.releaseLetters', 'Release Letters') 
        : t('nav.release', 'Release Graph') 
    },
    { screen: 'audit', label: t('nav.audit', 'Audit Chain') },
    { screen: 'admin', label: t('nav.admin', 'Administration') },
  ];

  const visibleNavItems = navItems.filter(({ screen }) => {
    if (!isAuthenticated) {
      return screen === 'home' || screen === 'guide' || screen === 'howItWorks';
    }
    return isScreenAllowed(currentRole, screen);
  });

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#F8F5EE]/80 border-b border-[#E5DFD5]/80 px-4 sm:px-6 py-3.5 transition-all shadow-[0_8px_30px_-15px_rgba(28,29,26,0.06)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#444C3D] shadow-md hover:scale-105 transition-transform flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#F8F5EE]" />
          </div>
          <div className="hidden sm:block text-left leading-none">
            <span className="font-extrabold text-[1.1rem] tracking-tight text-[#1C1D1A] font-['Instrument_Serif'] block">
              {t('nav.brand', 'SURAKSHA')}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.1em] text-[#706E66]">
              {language === 'hi' ? 'AICTE निक्षेप कोष' : 'AICTE Sovereign Vault'}
            </span>
          </div>
        </div>

        {/* Glass Bubble Nav — Horizontal */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[12px] font-medium text-[#55544E] overflow-x-auto py-1 scrollbar-none">
          {visibleNavItems.map(({ screen, label }) => {
            const isActive = activeScreen === screen;
            return (
              <button
                key={screen}
                onClick={() => handleNavClick(screen)}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap text-xs ${
                  isActive 
                    ? 'text-[#1C1D1A] font-bold bg-[#EFEAE1] border-[#DDD6C9] shadow-xs' 
                    : 'bg-[#FAF8F5]/60 border-transparent hover:bg-[#EFEAE1]/70 hover:border-[#DDD6C9]/60 text-[#55544E]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* Right Tools (Language Switcher + Clock + Auth) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Language Switcher Pill */}
          <div className="inline-flex items-center rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/60 p-0.5 text-xs font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'en'
                  ? 'bg-[#444C3D] text-white shadow-xs font-semibold'
                  : 'text-[#55544E] hover:text-[#1C1D1A]'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#444C3D] text-white shadow-xs font-semibold'
                  : 'text-[#55544E] hover:text-[#1C1D1A]'
              }`}
              title="हिन्दी (Hindi)"
            >
              हिन्दी
            </button>
          </div>

          {/* Clock */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/40 text-[#444C3D] text-[11px] font-mono font-medium backdrop-blur-sm">
            <Clock className="w-3 h-3 text-[#444C3D]" />
            <span>
              {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          {!isAuthenticated ? (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium transition shadow-sm cursor-pointer hover:scale-[1.04]"
            >
              <Lock className="w-3.5 h-3.5 text-white/90" />
              <span>{t('nav.signIn', 'Sign In')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {canSwitchDemoRole && (
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium transition shadow-sm cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-white/90" />
                    <span className="hidden sm:inline font-mono text-[11px] text-white/90">
                      {t(`role.${currentRole}`, currentRole)}
                    </span>
                    <ChevronDown className="w-3 h-3 text-white/70" />
                  </button>
                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#F8F5EE] border border-[#DDD6C9] shadow-2xl p-2 z-50 text-left">
                      <div className="text-[10px] font-mono uppercase text-[#706E66] px-3 py-1 font-bold">
                        {t('nav.switchRole', 'Switch Demo Role')}
                      </div>
                      {roles.map((r) => {
                        const isCurrent = currentRole === r.id;
                        return (
                          <button
                            key={r.id}
                            onClick={() => { onRoleChange(r.id); setRoleMenuOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between transition-colors cursor-pointer ${
                              isCurrent ? 'bg-[#ECE7DE] text-[#444C3D] font-bold' : 'text-[#444C3D] hover:bg-[#EFEAE1]'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-[#1C1D1A]">{t(r.labelKey, r.id)}</div>
                              <div className="text-[10px] text-[#706E66]">{t(r.descKey, '')}</div>
                            </div>
                            {isCurrent && <CheckCircle2 className="w-4 h-4 text-[#444C3D] shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={onLogoutClick}
                title={t('nav.signOut', 'Sign Out')}
                className="p-2 rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/50 hover:bg-[#E3DDCF] text-[#55544E] hover:text-[#1C1D1A] transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
