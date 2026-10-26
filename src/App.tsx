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
import { ArrowRight, ShieldCheck, Scale, Lock, FileSearch, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [currentRole, setCurrentRole] = useState('DEALING_OFFICER');
  const [activeScreen, setActiveScreen] = useState('home');

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
      // Sync Lenis with GSAP ScrollTrigger
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
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#1C1D1A] selection:bg-[#444C3D] selection:text-white font-sans relative overflow-x-hidden">
      {/* Top Scroll Progress Line */}
      <div id="scroll-progress" className="fixed top-0 left-0 h-[2.5px] bg-[#444C3D] z-50 transition-all duration-75" />

      {/* Navbar with Role Switcher & Demo Clock */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      {/* Hero Section Container with Warm Linen / Vestris Aesthetic */}
      <section 
        className="relative overflow-hidden text-left pt-20 px-6 lg:px-16 pb-28 z-10 min-h-[90vh] flex items-center bg-[#F8F5EE]"
      >
        {/* Vanta Globe Background with Interactive Mouse Control */}
        <VantaGlobe />

        {/* Smooth Subtle Fade Transition at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-b from-transparent to-[#F8F5EE] pointer-events-none z-[2]" />

        {/* Hero Content — Strictly Left-Aligned on Left 50% so Right 50% lets Globe Shine Unobstructed */}
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

            {/* Subtitle in warm editorial graphite - Left Aligned */}
            <p className="text-base sm:text-lg md:text-xl text-[#55544E] max-w-[580px] mb-10 leading-relaxed font-normal">
              Autonomous compliance proving every FDR is <span className="text-[#1C1D1A] font-semibold">real</span> through 3-way reconciliation, <span className="text-[#1C1D1A] font-semibold">correctly sized</span> under APH Table 1.4, <span className="text-[#1C1D1A] font-semibold">continuously pledged</span>, and <span className="text-[#1C1D1A] font-semibold">safe to release</span> under Clause 6.46.
            </p>

            {/* Vestris Olive Green & Cream Action Buttons */}
            <div className="flex flex-wrap items-center justify-start gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('cockpit-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#444C3D] hover:bg-[#353C2F] text-white rounded-lg font-medium text-[1rem] tracking-[-0.01em] shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                Launch Control Tower <span>→</span>
              </button>
              <a
                href="#pillars"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#ECE7DE] hover:bg-[#E3DDCF] text-[#1C1D1A] rounded-lg font-medium text-sm border border-[#DDD6C9] transition-all"
              >
                Inspect Regulatory DAG <ArrowRight className="w-4 h-4 text-[#444C3D]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Interactive Cockpit Card (The Framer Perspective Dashboard) */}
      <div id="cockpit-section">
        <CockpitPreview />
      </div>

      {/* Participating Banks Marquee Ticker */}
      <section className="py-10 px-6 bg-[#EFEAE1]/60 relative z-10 border-y border-[#E5DFD5] mt-16">
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

      {/* Cryptographic SHA-256 Audit Chain */}
      <AuditTicker />

      {/* Regulatory FAQ Accordion */}
      <FaqSection />

      {/* Official AICTE Footer */}
      <Footer />
    </div>
  );
}
