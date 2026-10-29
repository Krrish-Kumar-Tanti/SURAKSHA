import React, { useState, useEffect } from 'react';
import { Shield, Lock, UserCheck, ArrowRight, CheckCircle2, AlertCircle, Building2, Scale, KeyRound, Sparkles, FileText } from 'lucide-react';
import { apiLogin, checkBackendHealth, UserSession } from '../lib/api';
import { AnimatedHeading } from './AnimatedHeading';
import { useLanguage } from '../lib/i18n';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
  onCancel?: () => void;
}

export function LoginPage({ onLoginSuccess, onCancel }: LoginPageProps) {
  const [email, setEmail] = useState('officer@aicte.example.test');
  const [password, setPassword] = useState('demo-password');
  const [selectedRole, setSelectedRole] = useState('DEALING_OFFICER');
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [backendStatus, setBackendStatus] = useState<{ connected: boolean; service?: string }>({ connected: false });
  const { language, setLanguage, t } = useLanguage();

  // Quick Persona Profiles matching SIH26265
  const personas = [
    {
      id: 'INSTITUTION_USER',
      labelEn: 'College Registrar',
      labelHi: 'कॉलेज कुलसचिव',
      orgEn: 'SIT Pune (1-1092847291)',
      orgHi: 'सिम्बायोसिस (SIT) पुणे',
      email: 'registrar@sit.example.test',
      descEn: 'Submit FDR details and review institution deposits',
      descHi: 'FDR जमा करें और संस्थागत संविभाग जांचें',
      icon: Building2,
      password: 'demo-password',
    },
    {
      id: 'DEALING_OFFICER',
      labelEn: 'Dealing Officer',
      labelHi: 'व्यवहार अधिकारी',
      orgEn: 'AICTE Western Regional Office',
      orgHi: 'AICTE पश्चिमी क्षेत्रीय कार्यालय',
      email: 'officer@aicte.example.test',
      descEn: 'Review institutional records and release clearances',
      descHi: 'संस्थागत अभिलेख एवं अनापत्ति संवीक्षा',
      icon: Shield,
      password: 'demo-password',
    },
    {
      id: 'DIRECTOR_RB',
      labelEn: 'Regional Director',
      labelHi: 'क्षेत्रीय निदेशक',
      orgEn: 'AICTE Approval Bureau',
      orgHi: 'AICTE अनुमोदन ब्यूरो',
      email: 'director@aicte.example.test',
      descEn: 'Review regional deposits and significant discrepancies',
      descHi: 'क्षेत्रीय पर्यवेक्षण व विसंगति समाधान',
      icon: Scale,
      password: 'demo-password',
    },
    {
      id: 'COMPETENT_AUTHORITY',
      labelEn: 'Approving Authority',
      labelHi: 'सक्षम अनुमोदन प्राधिकारी',
      orgEn: 'AICTE Headquarters (New Delhi)',
      orgHi: 'AICTE मुख्यालय (नई दिल्ली)',
      email: 'ca@aicte.example.test',
      descEn: 'Review requests and make release decisions',
      descHi: 'धारा 6.46 के अंतर्गत अंतिम विमुक्ति आदेश',
      icon: KeyRound,
      password: 'demo-password',
    },
    {
      id: 'ACCOUNTS',
      labelEn: 'Accounts Officer',
      labelHi: 'लेखा अधिकारी',
      orgEn: 'AICTE Finance Desk',
      orgHi: 'AICTE वित्त एवं लेखा डेस्क',
      email: 'accounts@aicte.example.test',
      descEn: 'Prepare and review release letters and bank NOCs',
      descHi: 'विमुक्ति पत्र एवं बैंक NOC निर्गमन',
      icon: FileText,
      password: 'demo-password',
    },
    {
      id: 'AUDITOR',
      labelEn: 'Central Auditor (CAG)',
      labelHi: 'केंद्रीय लेखापरीक्षक (CAG)',
      orgEn: 'Audit & Compliance',
      orgHi: 'वैधानिक ऑडिट व अनुपालन',
      email: 'auditor@aicte.example.test',
      descEn: 'Inspect SHA-256 cryptographic audit history',
      descHi: 'क्रिप्टोग्राफिक ऑडिट इतिहास का शून्य-विश्वास सत्यापन',
      icon: Shield,
      password: 'demo-password',
    },
    {
      id: 'ADMIN',
      labelEn: 'System Administrator',
      labelHi: 'प्रणाली प्रशासक',
      orgEn: 'AICTE Headquarters',
      orgHi: 'AICTE मुख्यालय आईटी सेल',
      email: 'admin@aicte.example.test',
      descEn: 'Monitor application service status',
      descHi: 'प्रणाली स्वास्थ्य एवं सेवा निगरानी',
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
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const session = await apiLogin(email, password, selectedRole);
      onLoginSuccess(session);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] flex flex-col justify-between p-4 sm:p-8 relative font-sans">
      {/* Top Header / Branding */}
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between py-4 border-b border-[#E5DFD5]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#444C3D] flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-normal text-xl text-[#1C1D1A] font-['Instrument_Serif'] tracking-tight">
              {t('nav.brand', 'SURAKSHA')}
            </span>
            <span className="text-[10px] text-[#444C3D] font-mono ml-2 font-bold bg-[#EFEAE1] border border-[#DDD6C9] px-2 py-0.5 rounded-full">
              SIH26265
            </span>
          </div>
        </div>

        {/* Backend live connection status badge & Language Toggle */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-[#DDD6C9] bg-[#EFEAE1]/60 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'en' ? 'bg-[#444C3D] text-white font-semibold' : 'text-[#55544E]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded-full transition-all text-[11px] cursor-pointer ${
                language === 'hi' ? 'bg-[#444C3D] text-white font-semibold' : 'text-[#55544E]'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs font-mono text-[#55544E]">
              {backendStatus.connected 
                ? (language === 'hi' ? 'बैकएंड कनेक्टेड' : 'Backend online') 
                : (language === 'hi' ? 'डेमो साइन-इन सक्रिय' : 'Demo sign-in available')}
            </span>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-medium text-[#55544E] hover:text-[#1C1D1A] underline cursor-pointer"
            >
              {language === 'hi' ? '← मुख्य पृष्ठ पर वापस जाएं' : 'Back to Overview'}
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
            {language === 'hi' ? 'आगे बढ़ने हेतु भूमिका चुनें' : 'Select a role to continue'}
          </div>

          <AnimatedHeading
            as="h1"
            className="text-4xl sm:text-5xl font-normal text-[#1C1D1A] tracking-[-0.02em] leading-tight"
          >
            {`( ${language === 'hi' ? 'सुरक्षा में' : 'Sign in to'} *SURAKSHA* )`}
          </AnimatedHeading>

          <p className="text-base text-[#55544E] leading-relaxed">
            {language === 'hi' 
              ? 'किसी भी अधिकृत भूमिका का चयन करें और उसके डेमो परिचय-पत्र से प्रवेश करें।' 
              : 'Choose an authorized role and sign in with its verified credentials.'}
          </p>

          {/* Quick Demo Persona Selector Cards */}
          <div className="pt-2 space-y-2.5">
            <div className="text-[11px] font-mono uppercase text-[#706E66] font-bold">
              {language === 'hi' ? 'भूमिका चुनें' : 'Choose your role'}
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
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#ECE7DE] border-[#444C3D] shadow-xs ring-1 ring-[#444C3D]' 
                        : 'bg-white border-[#E5DFD5] hover:border-[#DDD6C9] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-[#444C3D]" />
                      <span className="font-semibold text-xs text-[#1C1D1A]">
                        {language === 'hi' ? p.labelHi : p.labelEn}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#706E66] truncate font-mono">
                      {language === 'hi' ? p.orgHi : p.orgEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Card */}
        <div className="lg:col-span-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm text-left">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-normal text-[#1C1D1A] font-['Instrument_Serif']">
                {language === 'hi' ? 'अधिकृत पोर्टल प्रवेश' : 'Control Tower Access'}
              </h2>
              <p className="text-xs text-[#55544E]">
                {language === 'hi' 
                  ? 'सुरक्षित सत्र क्रेडेंशियल के साथ लॉगिन करें।' 
                  : 'Authenticate your role session credentials.'}
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-[#706E66] mb-1">
                  {language === 'hi' ? 'ईमेल पता / उपयोगकर्ता पहचान' : 'Email Address / User ID'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-mono text-[#1C1D1A] focus:outline-none focus:ring-2 focus:ring-[#444C3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#706E66] mb-1">
                  {language === 'hi' ? 'पासवर्ड / सुरक्षा कुंजी' : 'Password / Passkey'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6C9] bg-[#FAF8F5] text-xs font-mono text-[#1C1D1A] focus:outline-none focus:ring-2 focus:ring-[#444C3D]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center justify-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>{language === 'hi' ? 'प्रमाणीकरण हो रहा है…' : 'Authenticating…'}</span>
                  ) : (
                    <>
                      <span>{language === 'hi' ? 'कार्यक्षेत्र में प्रवेश करें' : 'Enter Workspace'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-[#E5DFD5] text-center">
              <span className="text-[11px] text-[#706E66] font-mono">
                {language === 'hi' ? 'शून्य-विश्वास प्रमाणीकरण (SHA-256)' : 'Zero-Trust Authenticated Gateway (SHA-256)'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal Notice */}
      <div className="max-w-[1200px] mx-auto w-full pt-4 border-t border-[#E5DFD5] text-center text-[11px] text-[#706E66]">
        {t('footer.copyright')}
      </div>
    </div>
  );
}
