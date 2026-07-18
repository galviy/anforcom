import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../../assets/HERO_bg.jpg';
import RegistrationCountdown from '../RegistrationCountdown';

const HEADING_LINE_1 = 'RANCANG. PECAHKAN.';
const HEADING_LINE_2 = 'NAIK PAPAN PERINGKAT.';

export default function Hero() {
  const heroRef = useRef(null);
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTypedLine1(HEADING_LINE_1);
      setTypedLine2(HEADING_LINE_2);
      return;
    }
    let i = 0;
    const totalLength = HEADING_LINE_1.length + HEADING_LINE_2.length;

    const id = setInterval(() => {
      i += 1;
      if (i <= HEADING_LINE_1.length) {
        setTypedLine1(HEADING_LINE_1.slice(0, i));
      } else {
        setTypedLine2(HEADING_LINE_2.slice(0, i - HEADING_LINE_1.length));
      }

      if (i >= totalLength) clearInterval(id);
    }, 50);

    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen items-center justify-center overflow-hidden px-6 py-24"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >

      <div className="absolute inset-0 bg-[#14532D]/80" />

      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0"
        aria-hidden="true"
        style={{
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at bottom left, rgba(0,128,128,0.06) 0%, transparent 70%)',
        }}
      />
      
      {/* Seamless transition gradient to match next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#14532D] to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">

        <h1 className="mb-10 min-h-[80px] sm:min-h-[110px] md:min-h-[140px] lg:min-h-[160px] text-4xl font-bold leading-[1.08] tracking-tight text-[#F5F5DC] sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          {typedLine1}
          {typedLine1.length < HEADING_LINE_1.length && (
            <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
          )}
          {typedLine1.length === HEADING_LINE_1.length && <br />}
          {typedLine1.length === HEADING_LINE_1.length && (
            <span className="text-[#EAB308]">
              {typedLine2}
              <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
            </span>
          )}
        </h1>

        <RegistrationCountdown />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              const target = document.querySelector('#tentang');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="
              inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-8 py-3.5
              text-base font-semibold text-[#14532D]
              shadow-lg shadow-[#EAB308]/20
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30
            "
          >
            Jelajahi ANFORCOM
          </button>
        </div>
      </div>
    </section>
  );
}