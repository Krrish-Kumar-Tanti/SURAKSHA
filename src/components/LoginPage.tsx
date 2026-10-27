import React, { useState, useEffect } from 'react';
import { Shield, Lock, UserCheck, ArrowRight, CheckCircle2, AlertCircle, Building2, Scale, KeyRound, Sparkles, FileText } from 'lucide-react';
import { apiLogin, checkBackendHealth, UserSession } from '../lib/api';
import { AnimatedHeading } from './AnimatedHeading';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onCancel?: () => void;
}

export function LoginPage({ onLoginSuccess, onCancel }: LoginPageProps) {
  const [email, setEmail] = useState('officer@aicte.example.test');
  const [password, setPassword] = useState('demo-password');
  const [selectedRole, setSelectedRole] = useState('DEALING_OFFICER');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; service?: string }>({ connected: false });

  // Quick Persona Profiles matching SIH26265
  const personas = [
    {
      id: 'INSTITUTION_USER',
      label: 'College Registrar',
      org: 'SIT Pune (1-1092847291)',
      email: 'registrar@sit.example.test',
      desc: 'Submit FDR, track 3-way match, request release',
      icon: Building2,
      password: 'demo-password',
    },
    {
      id: 'DEALING_OFFICER',
      label: 'Dealing Officer',
      org: 'AICTE Western Regional Office',
      email: 'officer@aicte.example.test',
      desc: 'Verify OCR vs CBS, check Table 1.4 norms',
      icon: Shield,
      password: 'demo-password',
    },
    {
      id: 'DIRECTOR_RB',
      label: 'Regional Director',
      org: 'AICTE Approval Bureau',
      email: 'director@aicte.example.test',
      desc: 'Waive minor discrepancies, portfolio risk oversight',
      icon: Scale,
      password: 'demo-password',
    },
    {
      id: 'COMPETENT_AUTHORITY',
      label: 'Approving Authority',
      org: 'AICTE Headquarters (New Delhi)',
      email: 'ca@aicte.example.test',
      desc: 'Final Clause 6.46 release sanction order & NOC',
      icon: KeyRound,
      password: 'demo-password',
    },
    {
      id: 'ACCOUNTS',
      label: 'Accounts',
      org: 'AICTE Finance Desk',
      email: 'accounts@aicte.example.test',
      desc: 'Release letters, NOC and sanction documents',
      icon: FileText,
      password: 'demo-password',
    },
    {
      id: 'AUDITOR',
      label: 'Central Auditor',
      org: 'Audit & Compliance',
      email: 'auditor@aicte.example.test',
      desc: 'Read-only portfolio, pledge and audit review',
      icon: Shield,
      password: 'demo-password',
    },
    {
      id: 'ADMIN',
      label: 'System Administrator',
      org: 'AICTE Headquarters',
      email: 'admin@aicte.example.test',
      desc: 'User management, configuration and demo reset',
      icon: KeyRound,
      password: 'demo-password',
    },
  ];

  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus({ connected: res.connected, service: res.service });
    });
  }, []);

  const handleSelectPersona = (p: typeof personas[0]) => {
    setSelectedRole(p.id);
    setEmail(p.email);
    setPassword(p.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const session = await apiLogin(email, password, selectedRole);
      onLoginSuccess(session);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] flex flex-col justify-between p-4 sm:p-8 relative">
      {/* Top Header / Branding */}
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between py-4 border-b border-[#E5DFD5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#444C3D] flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-normal text-xl text-[#1C1D1A] font-['Instrument_Serif'] tracking-tight">SURAKSHA</span>
            <span className="text-[10px] text-[#444C3D] font-mono ml-2 font-bold bg-[#EFEAE1] border border-[#DDD6C9] px-2 py-0.5 rounded-full">
              SIH26265
            </span>
          </div>
        </div>

        {/* Backend live connection status badge */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs font-mono text-[#55544E]">
            {backendStatus.connected ? 'FastAPI Backend Online (Port 8000)' : 'Simulated Adapter Fallback Ready'}
          </span>
          {onCancel && (
            <button
              onClick={onCancel}
              className="ml-4 text-xs font-medium text-[#55544E] hover:text-[#1C1D1A] underline cursor-pointer"
            >
              Back to Overview
            </button>
          )}
        </div>
      </div>

      {/* Main Login Presentation Container */}
      <div className="max-w-[1080px] mx-auto w-full py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Editorial Headline & Persona Switcher */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#444C3D]" />
            Regulatory Compliance Gateway
          </div>

          <AnimatedHeading
            as="h1"
            className="text-4xl sm:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] leading-tight"
          >
            ( Sign in to *Control Tower* )
          </AnimatedHeading>

          <p className="text-base text-[#55544E] leading-relaxed">
            AICTE Security Deposit & FDR Management System. Select your statutory role or use one of the quick demo credentials below.
          </p>

          {/* Quick Demo Persona Selector Cards */}
          <div className="pt-2 space-y-2.5">
            <div className="text-[11px] font-mono uppercase text-[#706E66] font-bold">
              Select Demo Persona (One-Click Setup)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {personas.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedRole === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#444C3D] shadow-sm ring-1 ring-[#444C3D]'
                        : 'bg-[#FAF8F5] border-[#E5DFD5] hover:border-[#DDD6C9]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-[#444C3D]' : 'text-[#706E66]'}`} />
                      <span className="font-bold text-xs text-[#1C1D1A]">{p.label}</span>
                    </div>
                    <div className="text-[11px] text-[#444C3D] font-mono font-medium truncate">{p.org}</div>
                    <div className="text-[10px] text-[#706E66] mt-1 line-clamp-1">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Crisp White Form Card */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-white border border-[#E5DFD5] p-8 sm:p-10 shadow-[0_15px_45px_rgba(28,29,26,0.06)] text-left">
            <div className="mb-6">
              <h3 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] tracking-tight">
                Authentication Credentials
              </h3>
              <p className="text-xs text-[#706E66] mt-1 font-mono">
                Active role: <span className="font-bold text-[#444C3D]">{selectedRole}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#55544E] mb-1.5">Official Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#444C3D] transition"
                  placeholder="officer@aicte.gov.in"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#55544E] mb-1.5">Security Passcode / Token</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#DDD6C9] text-sm text-[#1C1D1A] focus:outline-none focus:border-[#444C3D] transition"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-lg bg-[#444C3D] hover:bg-[#353C2F] text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    'Signing in to Control Tower...'
                  ) : (
                    <>
                      Enter Control Tower Cockpit <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E5DFD5] text-[11px] text-[#706E66] flex items-center justify-between">
              <span>Prototype environment</span>
              <span className="font-mono">Audit Log: SHA-256 Enabled</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-[1200px] mx-auto w-full py-4 text-center text-xs text-[#706E66] border-t border-[#E5DFD5]">
        © 2026 SURAKSHA Control Tower · Built for Smart India Hackathon (SIH26265) · AICTE Theme
      </div>
    </div>
  );
}
