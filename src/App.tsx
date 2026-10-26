import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { VantaGlobe } from './components/VantaGlobe';
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


  // Letter-by-letter smoke reveal animation on headline
  useEffect(() => {
    const h = document.getElementById('smoke-headline');
    if (!h) return;
    const text = h.textContent?.trim() || '';
    h.innerHTML = '';
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '0.32em';
      for (let j = 0; j < word.length; j++) {
        const ch = document.createElement('span');
        ch.textContent = word[j];
        ch.style.display = 'inline-block';
        ch.style.opacity = '0';
        ch.style.animation = 'smokeIn 0.5s ease-out forwards';
        ch.style.animationDelay = 0.04 * (i * word.length + j) + 's';
        wordSpan.appendChild(ch);
      }
      h.appendChild(wordSpan);
      if (i < words.length - 1) h.appendChild(document.createTextNode(' '));
    }
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
    <div className="min-h-screen bg-[#060812] text-[#f2f4f8] selection:bg-teal-500 selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Top Scroll Progress Line */}
      <div id="scroll-progress" className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-teal-400 via-sky-400 to-[#7a85ff] z-50 transition-all duration-75" />

      {/* Navbar with Role Switcher & Demo Clock */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />

      {/* Hero Section Container with Warm Mocha / Taupe 3D Studio Canvas */}
      <section 
        className="relative overflow-hidden text-left pt-24 px-6 lg:px-16 pb-36 z-10 min-h-[92vh] flex items-center"
        style={{
          backgroundColor: '#786464',
        }}
      >
        {/* Vanta Globe Background with Interactive Mouse Control */}
        <VantaGlobe />


        {/* Smooth Dark Gradient Transition at bottom into Control Tower */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-[#060812]/70 to-[#060812] pointer-events-none z-[2]" />

        {/* Hero Content — Strictly Left-Aligned on Left 50% so Right 50% lets Globe Shine Unobstructed */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full pointer-events-none">
          <div className="max-w-[620px] lg:max-w-[660px] text-left pointer-events-auto">
            {/* Animated Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/30 text-white text-xs font-mono font-medium mb-8 backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SIH26265 · Streamline of Security Deposit / FDR Portal
            </div>

            {/* Heavy, Bold, Crisp White Headline with Smoke Reveal — Left Aligned */}
            <h1
              id="smoke-headline"
              className="text-[clamp(2.5rem,4.8vw,4.5rem)] font-black leading-[1.04] tracking-[-0.04em] text-white mb-6 drop-shadow-md"
              style={{ fontWeight: 900 }}
            >
              AICTE Security Deposit Control Tower — Verifiable, Policy-Native Compliance.
            </h1>

            {/* Subtitle in warm readable tone - Left Aligned */}
            <p className="text-base sm:text-lg md:text-xl text-[#e6dedb] max-w-[580px] mb-10 leading-relaxed font-normal drop-shadow-sm">
              Proving every FDR is <span className="text-white font-bold">real</span> through 3-way reconciliation, <span className="text-white font-bold">correctly sized</span> under APH Table 1.4, <span className="text-white font-bold">continuously pledged</span>, and <span className="text-white font-bold">safe to release</span> under Clause 6.46.
            </p>

            {/* Glowing Purple/Violet CTA Button (Matching Reference) - Left Aligned */}
            <div className="flex flex-wrap items-center justify-start gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('cockpit-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-br from-[#7a85ff] to-[#a07dff] text-white rounded-[12px] font-bold text-[1.05rem] tracking-[-0.01em] shadow-[0_8px_30px_rgba(122,133,255,0.45)] hover:-translate-y-[2px] hover:shadow-[0_14px_40px_rgba(122,133,255,0.6)] transition-all cursor-pointer"
              >
                Launch Control Tower <span>→</span>
              </button>
              <a
                href="#pillars"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black/40 hover:bg-black/60 text-white rounded-[12px] font-semibold text-sm border border-white/25 hover:border-white/50 transition-all backdrop-blur-md"
              >
                Inspect Regulatory DAG <ArrowRight className="w-4 h-4 text-white" />
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
      <section className="py-12 px-6 bg-gradient-to-b from-transparent to-[#0b1220]/60 relative z-10 border-y border-white/5 mt-16">
        <div className="text-center text-[11px] font-mono uppercase tracking-[0.15em] mb-6 text-slate-400">
          Simulated Banking & Statutory Desk Adapters
        </div>
        <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-8 md:gap-14 flex-wrap opacity-65 hover:opacity-100 transition-opacity">
          {['State Bank of India', 'Punjab National Bank', 'Canara Bank', 'HDFC Bank', 'ICICI Bank', 'Bank of Baroda', 'PGRC Student Desk', 'Central Vigilance Bureau'].map((name) => (
            <span key={name} className="font-bold text-xs sm:text-sm text-slate-300 tracking-tight font-mono">
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
