import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  ArrowRight, 
  ShieldCheck, 
  Scale, 
  Lock, 
  Sparkles, 
  UserCheck, 
  Building2, 
  FileCheck, 
  Activity, 
  Layers, 
  ChevronRight,
  BookOpen,
  Cpu
} from 'lucide-react';

import { Breadcrumb } from './components/Breadcrumb';
import { Navbar } from './components/Navbar';
import { VantaGlobe } from './components/VantaGlobe';
import { AnimatedHeading } from './components/AnimatedHeading';
import { CockpitPreview } from './components/CockpitPreview';
import { FeaturesBento } from './components/FeaturesBento';
import { ScrollTrackGSAP } from './components/ScrollTrackGSAP';
import { LifecycleTabs } from './components/LifecycleTabs';
import { AuditTicker } from './components/AuditTicker';
import { FaqSection } from './components/FaqSection';
import { Reviews3DSection } from './components/Reviews3DSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { FdrWizardPage } from './components/pages/FdrWizardPage';
import { ProvenancePage } from './components/pages/ProvenancePage';
import { PolicyTracePage } from './components/pages/PolicyTracePage';
import { ReleaseGraphPage } from './components/pages/ReleaseGraphPage';
import { AuditChainPage } from './components/pages/AuditChainPage';
import { AdminPage } from './components/pages/AdminPage';
import { GuidePage } from './components/pages/GuidePage';
import { HowItWorksPage } from './components/pages/HowItWorksPage';
import { HeroIntroSplash } from './components/HeroIntroSplash';
import { getSavedSession, clearSession, saveSession, UserSession } from './lib/api';
import { AppScreen, getDefaultScreen, isScreenAllowed } from './lib/roleAccess';
import { I18nProvider, useLanguage } from './lib/i18n';

gsap.registerPlugin(ScrollTrigger);

function AppMain() {
  const [userSession, setUserSession] = useState<UserSession | null>(getSavedSession());
  const [currentRole, setCurrentRole] = useState(userSession?.role || 'DEALING_OFFICER');
  const [activeScreen, setActiveScreen] = useState<string>(userSession ? getDefaultScreen(userSession.role) : 'home');
  const [showIntro, setShowIntro] = useState(true);
  const [navigationHistory, setNavigationHistory] = useState<readonly string[]>([]);
  const { language, t } = useLanguage();

  const isAuthenticated = !!userSession;

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setCurrentRole(session.role);
    setActiveScreen(getDefaultScreen(session.role));
  };

  const handleLogout = () => {
    clearSession();
    setUserSession(null);
    setActiveScreen('home');
  };

  const handleDemoRoleChange = (role: string) => {
    setCurrentRole(role);
    setActiveScreen(getDefaultScreen(role));
    if (userSession?.token.startsWith('jwt_synthetic_token_')) {
      const roleNames: Record<string, string> = {
        INSTITUTION_USER: 'College Registrar',
        DEALING_OFFICER: 'Dealing Officer',
        DIRECTOR_RB: 'Regional Director',
        COMPETENT_AUTHORITY: 'Approving Authority',
        ACCOUNTS: 'Accounts',
        AUDITOR: 'Central Auditor',
        ADMIN: 'System Administrator',
      };
      const updatedSession = {
        ...userSession,
        role,
        displayName: roleNames[role] ?? role,
      };
      setUserSession(updatedSession);
      saveSession(updatedSession);
    }
  };

  const navigateToScreen = (screen: string) => {
    if (screen === 'login') {
      setActiveScreen(screen);
      setNavigationHistory((prev) => [...prev, 'home']);
      return;
    }
    if (!isAuthenticated && screen !== 'home' && screen !== 'guide' && screen !== 'howItWorks') {
      setActiveScreen('login');
      setNavigationHistory(['home']);
      return;
    }
    if (screen === 'home' || screen === 'guide' || screen === 'howItWorks' || isScreenAllowed(currentRole, screen)) {
      setNavigationHistory((prev) => {
        const targetIndex = prev.lastIndexOf(screen);
        if (targetIndex >= 0) {
          return prev.slice(0, targetIndex);
        }
        return [...prev, activeScreen as string];
      });
      setActiveScreen(screen);
    }
  };

  const visibleScreen: AppScreen | 'login' = activeScreen === 'login'
    ? 'login'
    : (activeScreen === 'guide' || activeScreen === 'howItWorks' || activeScreen === 'home')
      ? activeScreen as AppScreen
      : isAuthenticated && !isScreenAllowed(currentRole, activeScreen)
        ? getDefaultScreen(currentRole)
        : isAuthenticated ? activeScreen as AppScreen : 'home';

  // Global Lenis Smooth Scroll Setup connected to GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  // Top Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const onScroll = () => {
      const s = window.scrollY || document.documentElement.scrollTop || 0;
      const d = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = d > 0 ? (s / d) * 100 + '%' : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeScreen]);

  // Login View Override
  if (visibleScreen === 'login') {
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onCancel={() => setActiveScreen('home')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] selection:bg-[#444C3D] selection:text-white font-sans relative overflow-x-hidden">
      {/* 4-5s Hero Intro Splash with Skip Option */}
      {showIntro && <HeroIntroSplash onComplete={handleIntroComplete} />}

      {/* Top Scroll Progress Line */}
      <div id="scroll-progress" className="fixed top-0 left-0 h-[2.5px] bg-[#444C3D] z-50 transition-all duration-75" />

      {/* Navbar with Role Switcher & Language Toggle */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleDemoRoleChange}
        activeScreen={visibleScreen}
        onNavigate={navigateToScreen}
        isAuthenticated={isAuthenticated}
        userSession={userSession}
        onLoginClick={() => setActiveScreen('login')}
        onLogoutClick={handleLogout}
      />

      {/* GUIDE SCREEN (Persona Guide for 7 roles) */}
      {visibleScreen === 'guide' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <GuidePage 
            currentRole={currentRole} 
            onRoleChange={handleDemoRoleChange} 
            onNavigate={navigateToScreen} 
          />
          <Footer currentRole={currentRole} />
        </>
      )}

      {/* HOW IT WORKS SCREEN (Architectural Blueprint for all visitors) */}
      {visibleScreen === 'howItWorks' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <HowItWorksPage 
            onNavigate={navigateToScreen} 
            currentRole={currentRole} 
          />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'admin' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <AdminPage onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {/* RENDER DEDICATED SECTIONS */}
      {visibleScreen === 'portfolio' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <PortfolioPage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'wizard' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <FdrWizardPage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'provenance' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <ProvenancePage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'policy' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <PolicyTracePage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'release' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <ReleaseGraphPage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {visibleScreen === 'audit' && (
        <>
          <Breadcrumb
            history={navigationHistory}
            currentScreen={activeScreen as string}
            onGoBack={(screen) => navigateToScreen(screen)}
          />
          <AuditChainPage key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
          <Footer currentRole={currentRole} />
        </>
      )}

      {/* HOMEPAGE VIEW: Differentiates between Logged-in Cockpit vs Public Landing */}
      {visibleScreen === 'home' && (
        <>
          {isAuthenticated ? (
            /* ========================================================
             * LOGGED-IN VIEW: Operational Control Tower Cockpit at the Top
             * ======================================================== */
            <div className="py-8 px-4 sm:px-8 max-w-[1440px] mx-auto text-left">
              {/* Authenticated Executive Welcome Banner */}
              <div className="mb-8 p-6 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFEAE1] border border-[#DDD6C9] text-[#444C3D] text-xs font-mono font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    {t('cockpit.signedInAs')} {t(`role.${currentRole}`, currentRole)}
                  </div>
                  <h2 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] pt-1">
                    {t('cockpit.workspaceTitle')}
                  </h2>
                  <p className="text-xs text-[#55544E] font-mono">
                    {t('cockpit.signedInAs')} <strong className="text-[#1C1D1A]">{userSession?.displayName}</strong> · {t('cockpit.region')}: {userSession?.regionCode || 'WRO'}
                  </p>
                </div>

                {/* Quick Navigation Action Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigateToScreen('guide')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#444C3D]" /> {t('nav.guide')}
                  </button>
                  <button
                    onClick={() => navigateToScreen('howItWorks')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-[#444C3D]" /> {t('nav.howItWorks')}
                  </button>
                  {isScreenAllowed(currentRole, 'portfolio') && <button
                    onClick={() => navigateToScreen('portfolio')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#444C3D]" /> {t('cockpit.portfolioTable')}
                  </button>}
                  {isScreenAllowed(currentRole, 'wizard') && <button
                    onClick={() => navigateToScreen('wizard')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#444C3D]" /> {t('cockpit.submitFdr')}
                  </button>}
                  {isScreenAllowed(currentRole, 'provenance') && <button
                    onClick={() => navigateToScreen('provenance')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#444C3D]" /> {t('cockpit.threeWayProv')}
                  </button>}
                  {isScreenAllowed(currentRole, 'policy') && <button
                    onClick={() => navigateToScreen('policy')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-[#444C3D]" /> {t('cockpit.simulatePolicy')}
                  </button>}
                  {isScreenAllowed(currentRole, 'release') && <button
                    onClick={() => navigateToScreen('release')}
                    className="px-3.5 py-2 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    {currentRole === 'ACCOUNTS' ? t('nav.releaseLetters') : t('cockpit.releaseGraph')} <ChevronRight className="w-3.5 h-3.5" />
                  </button>}
                  {isScreenAllowed(currentRole, 'audit') && <button
                    onClick={() => navigateToScreen('audit')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#444C3D]" /> {t('cockpit.auditChain')}
                  </button>}
                </div>
              </div>

              {/* 1. The Interactive Cockpit */}
              {currentRole !== 'ACCOUNTS' && currentRole !== 'ADMIN' && (
                <div className="mb-12">
                  <CockpitPreview key={currentRole} currentRole={currentRole} onNavigate={navigateToScreen} />
                </div>
              )}

              {/* 2. The Tamper-Evident SHA-256 Ledger */}
              {isScreenAllowed(currentRole, 'audit') && (
                <div className="mb-12">
                  <AuditTicker />
                </div>
              )}

              <Footer currentRole={currentRole} />
            </div>
          ) : (
            /* ========================================================
             * PUBLIC GUEST VIEW: Clean Editorial Landing Presentation
             * ======================================================== */
            <>
              {/* Hero Section Container */}
              <section 
                className="relative overflow-hidden text-left pt-20 px-6 lg:px-16 pb-28 z-10 min-h-[90vh] flex items-center bg-[#F8F5EE]"
              >
                {/* Vanta Globe Background with Interactive Mouse Control */}
                <VantaGlobe />

                {/* Smooth Fade Transition */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#F8F5EE] pointer-events-none z-[2]" />

                {/* Hero Content */}
                <div className="relative z-10 max-w-[1440px] mx-auto w-full pointer-events-none">
                  <div className="max-w-[620px] lg:max-w-[720px] text-left pointer-events-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-8 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#444C3D] animate-pulse" />
                      {t('hero.badge')}
                    </div>

                    <AnimatedHeading
                      as="h1"
                      className="text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.06] tracking-[-0.02em] text-[#1C1D1A] mb-6"
                    >
                      {t('hero.title')}
                    </AnimatedHeading>

                    <p className="text-base sm:text-lg md:text-xl text-[#55544E] max-w-[620px] mb-8 leading-relaxed font-normal">
                      {t('hero.subtitle')}
                    </p>

                    {/* Prominent Action Buttons: Sign In, How It Works */}
                    <div className="flex flex-wrap items-center justify-start gap-3">
                      <button
                        onClick={() => setActiveScreen('login')}
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#444C3D] hover:bg-[#353C2F] text-white rounded-xl font-medium text-sm tracking-[-0.01em] shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        {t('hero.signInBtn')} <span>→</span>
                      </button>

                      <button
                        onClick={() => navigateToScreen('howItWorks')}
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FAF8F5] hover:bg-[#EFEAE1] text-[#1C1D1A] rounded-xl font-medium text-sm border border-[#DDD6C9] transition-all cursor-pointer shadow-2xs"
                      >
                        <Cpu className="w-4 h-4 text-[#444C3D]" />
                        {t('hero.howItWorksBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Three Hub Quick Exploration Banner */}
              <section className="py-8 px-6 bg-white border-y border-[#E5DFD5]">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div 
                    onClick={() => navigateToScreen('home')}
                    className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#444C3D] transition cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#444C3D] uppercase tracking-wider">
                        01 · {language === 'hi' ? 'अवलोकन' : 'Overview'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#706E66] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-['Instrument_Serif'] mt-2 text-[#1C1D1A]">
                      {language === 'hi' ? 'सार्वभौम नियंत्रण टॉवर' : 'Sovereign Control Tower'}
                    </h3>
                    <p className="text-xs text-[#55544E] mt-1.5 leading-relaxed">
                      {language === 'hi'
                        ? 'संपूर्ण संस्थागत संविभाग, लाइव परिपक्वता घड़ियां एवं ऑडिट लेज़र।'
                        : 'Explore portfolio metrics, maturity count-downs, and cryptographic governance.'}
                    </p>
                  </div>

                  <div 
                    onClick={() => navigateToScreen('guide')}
                    className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#444C3D] transition cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#444C3D] uppercase tracking-wider">
                        02 · {language === 'hi' ? 'भूमिका गाइड' : 'Persona Guide'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#706E66] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-['Instrument_Serif'] mt-2 text-[#1C1D1A]">
                      {language === 'hi' ? '7 अधिकृत संवर्ग' : '7 Authorized Personas'}
                    </h3>
                    <p className="text-xs text-[#55544E] mt-1.5 leading-relaxed">
                      {language === 'hi'
                        ? 'कुलसचिव, संवीक्षक, क्षेत्रीय निदेशक, सक्षम प्राधिकारी, लेखा, CAG एवं व्यवस्थापक।'
                        : 'Step-by-step duties and statutory boundaries for each login role.'}
                    </p>
                  </div>

                  <div 
                    onClick={() => navigateToScreen('howItWorks')}
                    className="p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD5] hover:border-[#444C3D] transition cursor-pointer text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#444C3D] uppercase tracking-wider">
                        03 · {language === 'hi' ? 'कार्यप्रणाली' : 'How It Works'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#706E66] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-['Instrument_Serif'] mt-2 text-[#1C1D1A]">
                      {language === 'hi' ? '6 प्रमुख डोमेन वास्तुकला' : '6 Core System Domains'}
                    </h3>
                    <p className="text-xs text-[#55544E] mt-1.5 leading-relaxed">
                      {language === 'hi'
                        ? 'इन-ब्राउज़र OCR, त्रिपक्षीय मिलान, तालिका 1.4 नीति, धारा 6.46 DAG एवं संप्रभु वॉल्ट।'
                        : 'Technical teardown of in-browser OCR, 3-way reconciliation, policy, and release DAG.'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Participating Banks Ticker */}
              <section className="py-10 px-6 bg-[#EFEAE1]/60 relative z-10 border-y border-[#E5DFD5]">
                <div className="text-center text-[11px] font-mono uppercase tracking-[0.15em] mb-5 text-[#706E66]">
                  {t('hero.banksHeader')}
                </div>
                <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-80 hover:opacity-100 transition-opacity">
                  {[
                    language === 'hi' ? 'भारतीय स्टेट बैंक' : 'State Bank of India',
                    language === 'hi' ? 'पंजाब नेशनल बैंक' : 'Punjab National Bank',
                    language === 'hi' ? 'केनरा बैंक' : 'Canara Bank',
                    language === 'hi' ? 'एचडीएफसी बैंक' : 'HDFC Bank',
                    language === 'hi' ? 'आईसीआईसीआई बैंक' : 'ICICI Bank',
                    language === 'hi' ? 'बैंक ऑफ बड़ौदा' : 'Bank of Baroda',
                    language === 'hi' ? 'PGRC छात्र शिकायत सेल' : 'PGRC Student Desk',
                    language === 'hi' ? 'केंद्रीय सतर्कता ब्यूरो (CVO)' : 'Central Vigilance Bureau',
                  ].map((name) => (
                    <span key={name} className="font-semibold text-xs sm:text-sm text-[#444C3D] tracking-tight font-mono">
                      {name}
                    </span>
                  ))}
                </div>
              </section>

              {/* 4 Compliance Pillars Bento Grid */}
              <div id="pillars">
                <FeaturesBento />
              </div>

              {/* GSAP ScrollTrack Animation */}
              <ScrollTrackGSAP />

              {/* Lifecycle Stepper */}
              <LifecycleTabs />

              {/* Regulatory FAQ Accordion */}
              <FaqSection />

              {/* 3D Institutional Reviews Carousel */}
              <Reviews3DSection />

              {/* Official AICTE Footer */}
              <Footer currentRole={currentRole} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppMain />
    </I18nProvider>
  );
}