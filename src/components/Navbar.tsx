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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#F8F5EE]/90 border-b border-[#E5DFD5] px-4 sm:px-8 lg:px-10 py-3.5 transition-all">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Brand & Emblem */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#444C3D] p-[1.5px] shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#F8F5EE]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[1.15rem] tracking-tight text-[#1C1D1A] font-['Instrument_Serif']">SURAKSHA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] font-semibold">SIH26265</span>
            </div>
            <span className="block text-[11px] text-[#706E66] font-medium">AICTE Security Deposit Control Tower</span>
          </div>
        </div>

        {/* Central Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-[13px] font-medium text-[#55544E]">
          <button 
            onClick={() => handleNavClick('home')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'home' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            Overview
          </button>
          <button 
            onClick={() => handleNavClick('portfolio')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'portfolio' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => handleNavClick('wizard')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'wizard' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            FDR Submission
          </button>
          <button 
            onClick={() => handleNavClick('provenance')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'provenance' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            3-Way Provenance
          </button>
          <button 
            onClick={() => handleNavClick('policy')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'policy' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            Policy Trace
          </button>
          <button 
            onClick={() => handleNavClick('release')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'release' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            Release Graph
          </button>
          <button 
            onClick={() => handleNavClick('audit')} 
            className={`hover:text-[#1C1D1A] transition-colors cursor-pointer ${activeScreen === 'audit' ? 'text-[#444C3D] font-bold' : ''}`}
          >
            Audit Chain
          </button>
        </nav>

        {/* Right Tools: Status / Sign In / Role Selector */}
        <div className="flex items-center gap-3">
          {/* Demo Clock Pill */}
          <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-[#444C3D]" />
            <span>Clock: 25 Oct 2026</span>
          </div>

          {!isAuthenticated ? (
            /* Sign In Button for Guests */
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs sm:text-sm font-medium transition shadow-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-white/90" />
              <span>Sign In</span>
            </button>
          ) : (
            /* Authenticated User Menu */
            <div className="flex items-center gap-2">
              {/* Persona Role Switcher */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium transition shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-white/90" />
                  <span className="hidden md:inline font-mono text-[11px] text-white/80">Role:</span>
                  <span className="font-semibold">{roles.find(r => r.id === currentRole)?.label || currentRole}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E5DFD5] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                    <div className="text-[10px] font-mono uppercase text-[#706E66] px-3 py-1.5 font-bold">
                      Switch Statutory Role
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          onRoleChange(r.id);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start justify-between transition-colors cursor-pointer ${
                          currentRole === r.id ? 'bg-[#ECE7DE] text-[#444C3D] font-bold' : 'text-[#444C3D] hover:bg-[#F8F5EE]'
                        }`}
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

              {/* Logout Button */}
              <button
                onClick={onLogoutClick}
                title="Sign Out"
                className="p-2 rounded-lg border border-[#DDD6C9] bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#55544E] hover:text-[#1C1D1A] transition cursor-pointer"
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
