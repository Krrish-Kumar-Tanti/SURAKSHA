import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { VantaGlobe } from './components/VantaGlobe';
import { AnimatedHeading } from './components/AnimatedHeading';
import { CockpitPreview } from './components/CockpitPreview';
import { FeaturesBento } from './components/FeaturesBento';
import { ScrollTrackGSAP } from './components/ScrollTrackGSAP';
import { LifecycleTabs } from './components/LifecycleTabs';
import { AuditTicker } from './components/AuditTicker';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { FdrWizardPage } from './components/pages/FdrWizardPage';
import { ProvenancePage } from './components/pages/ProvenancePage';
import { PolicyTracePage } from './components/pages/PolicyTracePage';
import { ReleaseGraphPage } from './components/pages/ReleaseGraphPage';
import { AuditChainPage } from './components/pages/AuditChainPage';
import { HeroIntroSplash } from './components/HeroIntroSplash';
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
import { getSavedSession, clearSession, UserSession } from './lib/api';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(getSavedSession());
  const [currentRole, setCurrentRole] = useState(userSession?.role || 'DEALING_OFFICER');
  const [activeScreen, setActiveScreen] = useState('home');
  const [showIntro, setShowIntro] = useState(true);

  const isAuthenticated = !!userSession;

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleLoginSuccess = (session: UserSession) => {
    setUserSession(session);
    setCurrentRole(session.role);
    setActiveScreen('home');
  };

  const handleLogout = () => {
    clearSession();
    setUserSession(null);
    setActiveScreen('home');
  };

  // Lenis Smooth Scroll initialization
  useEffect(() => {
    const lenis = (window as any).Lenis
      ? new (window as any).Lenis({
          autoRaf: true,
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          autoToggle: true,
          anchors: true,
          smoothWheel: true,
          wrapper: window,
          content: document.body,
        })
      : null;

    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      if (lenis && lenis.destroy) lenis.destroy();
    };
  }, []);

  // Scroll progress bar
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

  // If user opened login screen
  if (activeScreen === 'login') {
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

      {/* Navbar with Role Switcher, Sign In Button & Section Navigation */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        isAuthenticated={isAuthenticated}
        userSession={userSession}
        onLoginClick={() => setActiveScreen('login')}
        onLogoutClick={handleLogout}
      />

      {/* RENDER DEDICATED SECTIONS */}
      {activeScreen === 'portfolio' && (
        <>
          <PortfolioPage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {activeScreen === 'wizard' && (
        <>
          <FdrWizardPage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {activeScreen === 'provenance' && (
        <>
          <ProvenancePage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {activeScreen === 'policy' && (
        <>
          <PolicyTracePage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {activeScreen === 'release' && (
        <>
          <ReleaseGraphPage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {activeScreen === 'audit' && (
        <>
          <AuditChainPage onNavigate={setActiveScreen} />
          <Footer />
        </>
      )}

      {/* HOMEPAGE VIEW: Differentiates between Logged-in Cockpit vs Public Landing */}
      {activeScreen === 'home' && (
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
                    Active Statutory Session: {userSession?.role}
                  </div>
                  <h2 className="text-3xl font-normal text-[#1C1D1A] font-['Instrument_Serif'] pt-1">
                    Control Tower Operational Command
                  </h2>
                  <p className="text-xs text-[#55544E] font-mono">
                    Signed in as <strong className="text-[#1C1D1A]">{userSession?.displayName}</strong> · Region: {userSession?.regionCode || 'WRO'} · SHA-256 Audit Anchored
                  </p>
                </div>

                {/* Quick Navigation Action Pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveScreen('portfolio')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#444C3D]" /> Portfolio Table
                  </button>
                  <button
                    onClick={() => setActiveScreen('wizard')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#444C3D]" /> Submit FDR
                  </button>
                  <button
                    onClick={() => setActiveScreen('provenance')}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#DDD6C9] hover:border-[#444C3D] text-[#1C1D1A] text-xs font-medium inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#444C3D]" /> 3-Way Provenance
                  </button>
                  <button
                    onClick={() => setActiveScreen('release')}
                    className="px-3.5 py-2 rounded-xl bg-[#444C3D] hover:bg-[#353C2F] text-white text-xs font-medium inline-flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                  >
                    Release DAG <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. The Interactive Cockpit (Right at the Top after login) */}
              <div className="mb-12">
                <CockpitPreview />
              </div>

              {/* 2. The Tamper-Evident SHA-256 Ledger (Right below Cockpit) */}
              <div className="mb-12">
                <AuditTicker />
              </div>

              <Footer />
            </div>
          ) : (
            /* ========================================================
             * PUBLIC GUEST VIEW: Clean Editorial Landing Presentation
             * (Cockpit and Internal Audit are moved inside after login)
             * ======================================================== */
            <>
              {/* Hero Section Container with Warm Linen / Vestris Aesthetic */}
              <section 
                className="relative overflow-hidden text-left pt-20 px-6 lg:px-16 pb-28 z-10 min-h-[90vh] flex items-center bg-[#F8F5EE]"
              >
                {/* Vanta Globe Background with Interactive Mouse Control */}
                <VantaGlobe />

                {/* Smooth Subtle Fade Transition at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#F8F5EE] pointer-events-none z-[2]" />

                {/* Hero Content — Strictly Left-Aligned on Left 50% so Right 50% lets Globe Shine */}
                <div className="relative z-10 max-w-[1440px] mx-auto w-full pointer-events-none">
                  <div className="max-w-[620px] lg:max-w-[680px] text-left pointer-events-auto">
                    {/* Animated Hero Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DDD6C9] bg-[#EFEAE1] text-[#444C3D] text-xs font-mono font-medium mb-8 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#444C3D] animate-pulse" />
                      SIH26265 · AICTE Approval Process Handbook (APH 2024–27)
                    </div>

                    {/* Vestris Style Editorial Headline with Instrument Serif & Italic flourish */}
                    <AnimatedHeading
                      as="h1"
                      className="text-[clamp(2.6rem,5.2vw,4.8rem)] font-normal leading-[1.06] tracking-[-0.02em] text-[#1C1D1A] mb-6"
                    >
                      ( AICTE Security Deposit *Control Tower* )
                    </AnimatedHeading>

                    {/* Subtitle in warm editorial graphite */}
                    <p className="text-base sm:text-lg md:text-xl text-[#55544E] max-w-[580px] mb-10 leading-relaxed font-normal">
                      Autonomous compliance proving every FDR is <span className="text-[#1C1D1A] font-semibold">real</span> through 3-way reconciliation, <span className="text-[#1C1D1A] font-semibold">correctly sized</span> under APH Table 1.4, <span className="text-[#1C1D1A] font-semibold">continuously pledged</span>, and <span className="text-[#1C1D1A] font-semibold">safe to release</span> under Clause 6.46.
                    </p>

                    {/* Vestris Olive Green & Cream Action Buttons */}
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

              {/* Participating Banks Marquee Ticker */}
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

              {/* The 4 Compliance Pillars Bento Grid */}
              <div id="pillars">
                <FeaturesBento />
              </div>

              {/* The Working GSAP ScrollTrack Animation */}
              <ScrollTrackGSAP />

              {/* The 4-Phase Interactive Lifecycle Stepper */}
              <LifecycleTabs />

              {/* Regulatory FAQ Accordion */}
              <FaqSection />

              {/* Official AICTE Footer */}
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}
