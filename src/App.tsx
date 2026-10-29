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
  ChevronRight 
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
import { HeroIntroSplash } from './components/HeroIntroSplash';
import { getSavedSession, clearSession, saveSession, UserSession } from './lib/api';
import { AppScreen, getDefaultScreen, isScreenAllowed } from './lib/roleAccess';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(getSavedSession());
  const [currentRole, setCurrentRole] = useState(userSession?.role || 'DEALING_OFFICER');
  const [activeScreen, setActiveScreen] = useState<string>(userSession ? getDefaultScreen(userSession.role) : 'home');
  const [showIntro, setShowIntro] = useState(true);
  const [navigationHistory, setNavigationHistory] = useState<readonly string[]>([]);

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
    if (!isAuthenticated && screen !== 'home') {
      setActiveScreen('login');
      setNavigationHistory(['home']);
      return;
    }
    if (screen === 'home' || isScreenAllowed(currentRole, screen)) {
      setNavigationHistory((prev) => {
        // If navigating back, trim history up to the target screen
        const targetIndex = prev.lastIndexOf(screen);
        if (targetIndex >= 0) {
          return prev.slice(0, targetIndex);
        }
        // Forward navigation: append current screen to history
        return [...prev, activeScreen as string];
      });
      setActiveScreen(screen);
    }
  };

  const visibleScreen: AppScreen | 'login' = activeScreen === 'login'
    ? 'login'
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

      {/* Navbar with Role Switcher */}
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
                    Signed in as {currentRole}
                  </div>
                  <h2 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] pt-1">
                    Your SURAKSHA workspace
                  </h2>
                  <p className="text-xs text-[#55544E] font-mono">
                    Signed in as <strong className="text-[#1C1D1A]">{userSession?.displayName}</strong> · Region: {userSession?.regionCode || 'WRO'}
                    {isScreenAllowed(currentRole, 'audit') && ' · Sample audit events'}
                  </p>
                </div>

                {/* Quick Navigation Action Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {isScreenAllowed(currentRole, 'portfolio') && <button
                    onClick={() => navigateToScreen('portfolio')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#444C3D]" /> Portfolio Table
                  </button>}
                  {isScreenAllowed(currentRole, 'wizard') && <button
                    onClick={() => navigateToScreen('wizard')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#444C3D]" /> Submit FDR
                  </button>}
                  {isScreenAllowed(currentRole, 'provenance') && <button
                    onClick={() => navigateToScreen('provenance')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#444C3D]" /> 3-Way Provenance
                  </button>}
                  {isScreenAllowed(currentRole, 'policy') && <button
                    onClick={() => navigateToScreen('policy')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Scale className="w-3.5 h-3.5 text-[#444C3D]" /> Simulate APH Calculation
                  </button>}
                  {isScreenAllowed(currentRole, 'release') && <button
                    onClick={() => navigateToScreen('release')}
                    className="px-3.5 py-2 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    {currentRole === 'ACCOUNTS' ? 'Release Letters' : 'Release Graph DAG'} <ChevronRight className="w-3.5 h-3.5" />
                  </button>}
                  {isScreenAllowed(currentRole, 'audit') && <button
                    onClick={() => navigateToScreen('audit')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#444C3D]" /> Audit Chain
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
                  <div className="max-w-[620px] lg:max-w-[680px] text-left pointer-events-auto">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-8 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#444C3D] animate-pulse" />
                      SIH26265 · AICTE Approval Process Handbook (APH 2024–27)
                    </div>

                    <AnimatedHeading
                      as="h1"
                      className="text-[clamp(2.6rem,5.2vw,4.8rem)] font-normal leading-[1.06] tracking-[-0.02em] text-[#1C1D1A] mb-6"
                    >
                      ( AICTE Security Deposit *Control Tower* )
                    </AnimatedHeading>

                    <p className="text-base sm:text-lg md:text-xl text-[#55544E] max-w-[580px] mb-10 leading-relaxed font-normal">
                      Security-deposit workflows for institutions and AICTE staff, including submission, review, policy estimates, and release.
                    </p>

                    <div className="flex flex-wrap items-center justify-start gap-4">
                      <button
                        onClick={() => setActiveScreen('login')}
                        className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#444C3D] hover:bg-[#353C2F] text-white rounded-lg font-medium text-[1rem] tracking-[-0.01em] shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        Sign In to Control Tower <span>→</span>
                      </button>

                      <a
                        href="#pillars"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] rounded-lg font-medium text-sm border border-[#DDD6C9] transition-all cursor-pointer"
                      >
                        Explore Regulatory Pillars <ArrowRight className="w-4 h-4 text-[#444C3D]" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Participating Banks Ticker */}
              <section className="py-10 px-6 bg-[#EFEAE1]/60 relative z-10 border-y border-[#E5DFD5]">
                <div className="text-center text-[11px] font-mono uppercase tracking-[0.15em] mb-5 text-[#706E66]">
                  Simulated Banking & Statutory Desk Adapters
                </div>
                <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-80 hover:opacity-100 transition-opacity">
                  {['State Bank of India', 'Punjab National Bank', 'Canara Bank', 'HDFC Bank', 'ICICI Bank', 'Bank of Baroda', 'PGRC Student Desk', 'Central Vigilance Bureau'].map((name) => (
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
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}