import React, { useState } from 'react';
import { Shield, Clock, UserCheck, ChevronDown, CheckCircle2, Lock } from 'lucide-react';

interface NavbarProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export function Navbar({ currentRole, onRoleChange, activeScreen, onNavigate }: NavbarProps) {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { id: 'INSTITUTION_USER', label: 'College Registrar', desc: 'SIT Pune / Submit FDR' },
    { id: 'DEALING_OFFICER', label: 'Dealing Officer', desc: 'Regional Office Verification' },
    { id: 'DIRECTOR_RB', label: 'Regional Director', desc: 'Waive & Portfolio Risk' },
    { id: 'COMPETENT_AUTHORITY', label: 'Approving Authority', desc: 'Release Final Sanction' },
    { id: 'AUDITOR', label: 'Central Auditor', desc: 'Cryptographic Hash Verification' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b1220]/80 border-b border-white/10 px-6 lg:px-10 py-3.5 transition-all">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Brand & Emblem */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1fb6a6] via-[#2463eb] to-[#7cc7ff] p-[1.5px] shadow-lg shadow-teal-500/15 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0b1220] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-400 group-hover:text-teal-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[1.15rem] tracking-tight text-white group-hover:text-teal-300 transition-colors">SURAKSHA</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/15 border border-teal-500/30 text-teal-300 font-semibold">SIH26265</span>
            </div>
            <span className="block text-[11px] text-slate-400 font-medium">AICTE Security Deposit Control Tower</span>
          </div>
        </div>

        {/* Central Nav Links */}
        <nav className="hidden xl:flex items-center gap-6 text-[13px] font-medium text-slate-300">
          <button 
            onClick={() => onNavigate('home')} 
            className={`hover:text-white transition-colors ${activeScreen === 'home' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Overview
          </button>
          <button 
            onClick={() => onNavigate('portfolio')} 
            className={`hover:text-white transition-colors ${activeScreen === 'portfolio' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Portfolio
          </button>
          <button 
            onClick={() => onNavigate('wizard')} 
            className={`hover:text-white transition-colors ${activeScreen === 'wizard' ? 'text-teal-400 font-semibold' : ''}`}
          >
            FDR Submission
          </button>
          <button 
            onClick={() => onNavigate('provenance')} 
            className={`hover:text-white transition-colors ${activeScreen === 'provenance' ? 'text-teal-400 font-semibold' : ''}`}
          >
            3-Way Provenance
          </button>
          <button 
            onClick={() => onNavigate('policy')} 
            className={`hover:text-white transition-colors ${activeScreen === 'policy' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Policy Trace
          </button>
          <button 
            onClick={() => onNavigate('release')} 
            className={`hover:text-white transition-colors ${activeScreen === 'release' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Release Graph
          </button>
          <button 
            onClick={() => onNavigate('audit')} 
            className={`hover:text-white transition-colors ${activeScreen === 'audit' ? 'text-teal-400 font-semibold' : ''}`}
          >
            Audit Chain
          </button>
        </nav>

        {/* Right Tools: Demo Clock + Role Switcher */}
        <div className="flex items-center gap-3">
          {/* Demo Clock Pill */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Clock: 25 Oct 2026</span>
          </div>

          {/* Persona Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#172338] hover:bg-[#1f2f4a] text-white text-xs font-medium border border-white/10 transition shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline font-mono text-[11px] text-slate-300">Role:</span>
              <span className="font-semibold">{roles.find(r => r.id === currentRole)?.label || currentRole}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#111a2b] border border-[#26364f] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="text-[10px] font-mono uppercase text-slate-400 px-3 py-1.5 font-bold">
                  Demo Persona Switcher
                </div>
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onRoleChange(r.id);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-start justify-between transition-colors ${
                      currentRole === r.id ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30' : 'text-slate-300 hover:bg-[#172338]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.desc}</div>
                    </div>
                    {currentRole === r.id && <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
