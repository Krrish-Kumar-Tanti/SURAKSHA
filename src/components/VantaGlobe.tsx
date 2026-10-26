import React, { useEffect, useRef } from 'react';

export function VantaGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    let timer: any = null;

    const initVanta = () => {
      const VANTA = (window as any).VANTA;
      const THREE = (window as any).THREE;
      if (VANTA && VANTA.GLOBE && THREE && containerRef.current && !vantaEffectRef.current) {
        try {
          vantaEffectRef.current = VANTA.GLOBE({
            el: containerRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x444c3d,
            color2: 0x8a9482,
            size: 1.05,
            backgroundColor: 0xf8f5ee,
          });
        } catch (err) {
          console.error('Vanta Globe init error:', err);
        }
      }
    };

    if ((window as any).VANTA && (window as any).THREE) {
      initVanta();
    } else {
      let attempts = 0;
      timer = setInterval(() => {
        attempts++;
        if ((window as any).VANTA && (window as any).THREE) {
          initVanta();
          clearInterval(timer);
        } else if (attempts > 60) {
          clearInterval(timer);
        }
      }, 50);
    }

    const handleResize = () => {
      if (vantaEffectRef.current && vantaEffectRef.current.resize) {
        vantaEffectRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener('resize', handleResize);
      if (vantaEffectRef.current && vantaEffectRef.current.destroy) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="vanta-globe-container"
      className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      style={{
        backgroundColor: '#786464',
      }}
    />
  );
}
