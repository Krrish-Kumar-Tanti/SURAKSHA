import React, { useState } from 'react';
import { Shield, Clock, UserCheck, ChevronDown, CheckCircle2, Lock, LogOut, ArrowRight, User } from 'lucide-react';
import { UserSession } from '../lib/api';

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

  const roles = [
    { id: 'INSTITUTION_USER', label: 'College Registrar', desc: 'SIT Pune / Submit FDR' },
    { id: 'DEALING_OFFICER', label: 'Dealing Officer', desc: 'Regional Office Verification' },
    { id: 'DIRECTOR_RB', label: 'Regional Director', desc: 'Waive & Portfolio Risk' },
    { id: 'COMPETENT_AUTHORITY', label: 'Approving Authority', desc: 'Release Final Sanction' },
    { id: 'AUDITOR', label: 'Central Auditor', desc: 'Cryptographic Hash Verification' },
  ];

  const handleNavClick = (screen: string) => {
    if (!isAuthenticated && screen !== 'home') {
      // If user tries to open an internal cockpit tool while logged out, take to login
      onLoginClick();
      return;
    }
    onNavigate(screen);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#F8F5EE]/50 border-b border-[#E5DFD5]/60 px-6 py-4 transition-all shadow-[0_8px_30px_-15px_rgba(28,29,26,0.06)]">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-full bg-[#444C3D] shadow-md hover:scale-105 transition-transform flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#F8F5EE]" />
          </div>
          <span className="font-extrabold text-[1.05rem] tracking-tight text-[#1C1D1A] font-['Instrument_Serif'] hidden sm:block">SURAKSHA</span>
        </div>

        {/* Glass Bubble Nav — Horizontal */}
        <nav className="flex items-center gap-2.5 text-[12px] font-medium text-[#55544E] overflow-x-auto">
          {[
            { screen: 'home', label: 'Overview' },
            { screen: 'portfolio', label: 'Portfolio' },
            { screen: 'wizard', label: 'FDR Submission' },
            { screen: 'provenance', label: 'Provenance' },
            { screen: 'policy', label: 'Policy' },
            { screen: 'release', label: 'Release' },
            { screen: 'audit', label: 'Audit' },
          ].map(({ screen, label }) => (
            <button
              key={screen}
              onClick={() => handleNavClick(screen)}
              className={`px-4 py-2 rounded-full bg-[#EFEAE1]/30 backdrop-blur-md border border-[#DDD6C9]/30 hover:bg-[#EFEAE1]/60 hover:scale-[1.1] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap ${activeScreen === screen ? 'text-[#1C1D1A] font-bold bg-[#EFEAE1]/80 border-[#DDD6C9]/60' : 'text-[#55544E]'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right Tools */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/40 text-[#444C3D] text-[11px] font-mono font-medium backdrop-blur-sm">
            <Clock className="w-3 h-3 text-[#444C3D]" />
            <span>25 Oct 2026</span>
          </div>
          {!isAuthenticated ? (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium transition shadow-sm cursor-pointer hover:scale-[1.08] hover:-translate-y-0.5 duration-200"
            >
              <Lock className="w-3.5 h-3.5 text-white/90" />
              <span>Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium transition shadow-sm cursor-pointer hover:scale-[1.05] duration-200"
                >
                  <UserCheck className="w-3.5 h-3.5 text-white/90" />
                  <span className="hidden sm:inline font-mono text-[11px] text-white/80">{currentRole}</span>
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>
                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#F8F5EE]/90 backdrop-blur-xl border border-[#DDD6C9] shadow-2xl p-2 z-50 text-left">
                    <div className="text-[10px] font-mono uppercase text-[#706E66] px-3 py-1 font-bold">Switch Role</div>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => { onRoleChange(r.id); setRoleMenuOpen(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between transition-colors cursor-pointer hover:scale-[1.03] duration-150 ${currentRole === r.id ? 'bg-[#ECE7DE] text-[#444C3D] font-bold' : 'text-[#444C3D] hover:bg-[#EFEAE1]'}`}
                      >
                        <div>
                          <div className="font-semibold text-[#1C1D1A]">{r.label}</div>
                          <div className="text-[10px] text-[#706E66]">{r.desc}</div>
                        </div>
                        {currentRole === r.id && <CheckCircle2 className="w-4 h-4 text-[#444C3D] shrink-0 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={onLogoutClick}
                title="Sign Out"
                className="p-2 rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/40 hover:bg-[#E3DDCF] text-[#55544E] hover:text-[#1C1D1A] transition cursor-pointer hover:scale-[1.08] duration-200"
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
