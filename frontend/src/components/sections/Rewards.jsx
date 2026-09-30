import { useState, useEffect, useRef } from 'react';
import heroFly from '../../../assets/HERO_fly.PNG';

const TITLE_PART_1 = 'Total ';
const TITLE_PART_2 = 'Hadiah ';
const TITLE_PART_3 = 'Hingga:';
const TARGET_PRIZE = 15000000;

export default function Rewards() {
  const [typedPart1, setTypedPart1] = useState('');
  const [typedPart2, setTypedPart2] = useState('');
  const [typedPart3, setTypedPart3] = useState('');
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);

  // Typewriter effect for section title
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTypedPart1(TITLE_PART_1);
      setTypedPart2(TITLE_PART_2);
      setTypedPart3(TITLE_PART_3);
      return;
    }
    let i = 0;
    const totalLength = TITLE_PART_1.length + TITLE_PART_2.length + TITLE_PART_3.length;

    const id = setInterval(() => {
      i += 1;
      if (i <= TITLE_PART_1.length) {
        setTypedPart1(TITLE_PART_1.slice(0, i));
      } else if (i <= TITLE_PART_1.length + TITLE_PART_2.length) {
        setTypedPart2(TITLE_PART_2.slice(0, i - TITLE_PART_1.length));
      } else {
        setTypedPart3(TITLE_PART_3.slice(0, i - TITLE_PART_1.length - TITLE_PART_2.length));
      }

      if (i >= totalLength) clearInterval(id);
    }, 70);

    return () => clearInterval(id);
  }, []);

  // Trigger count-up animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Smooth Count-Up Animation with easeOutExpo
  useEffect(() => {
    if (!hasStarted) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(TARGET_PRIZE);
      return;
    }

    const duration = 2200; // 2.2 seconds
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo for dramatic deceleration at the end
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * TARGET_PRIZE);

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(TARGET_PRIZE);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted]);

  return (
    <section ref={sectionRef} id="rewards" className="relative px-6 py-24 sm:py-32 overflow-hidden">
      {/* ── Localized Center Halo (Seamless with parent page #14532D) ── */}

      {/* 1. Warm Golden Spotlight Aura directly behind prize */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[280px] sm:h-[360px] bg-gradient-to-r from-amber-500/15 via-[#EAB308]/25 to-yellow-300/15 rounded-full blur-[110px] pointer-events-none" />

      {/* 2. Soft Concentric Stage Halo */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[220px] sm:h-[300px] border border-[#EAB308]/15 rounded-full pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_65%,transparent_90%)] animate-[pulse_5s_ease-in-out_infinite]" />

      {/* 3. Subtle Celebratory Sparkles near the prize */}
      <div className="absolute top-[35%] left-[26%] w-1.5 h-1.5 rounded-full bg-[#EAB308] opacity-70 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
      <div className="absolute top-[32%] right-[22%] w-2 h-2 rounded-full bg-yellow-200 opacity-75 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[36%] left-[30%] w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60 animate-ping pointer-events-none" style={{ animationDuration: '3.5s' }} />
      <div className="absolute bottom-[34%] right-[25%] w-2 h-2 rounded-full bg-[#EAB308] opacity-70 animate-ping pointer-events-none" style={{ animationDuration: '4.5s' }} />

      <div className="relative mx-auto max-w-6xl text-center z-10">

        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] sm:text-5xl">
            {typedPart1}
            {typedPart1.length < TITLE_PART_1.length && (
              <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
            )}
            {typedPart1.length === TITLE_PART_1.length && (
              <span className="text-[#EAB308]">
                {typedPart2}
                {typedPart2.length < TITLE_PART_2.length && (
                  <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
                )}
              </span>
            )}
            {typedPart2.length === TITLE_PART_2.length && (
              <span>
                {typedPart3}
                <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
              </span>
            )}
          </h2>
        </div>

        {/* Big Prize Display without card box, HERO on the right */}
        <div className="relative inline-flex flex-col items-center justify-center my-4 sm:my-6">
          <p className="mb-2 sm:mb-4 text-xs sm:text-sm md:text-base font-bold tracking-[0.25em] text-[#EAB308] uppercase drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            Total Prize Pool
          </p>

          <div className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter sm:tracking-tight bg-gradient-to-r from-yellow-100 via-[#FACC15] to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(234,179,8,0.55)] tabular-nums select-none leading-none py-2">
            IDR {count.toLocaleString('id-ID')}
          </div>

          {/* HERO Mascot on the right side (only visible on desktop / large screens, hidden on smartphones) */}
          <div className="hidden lg:block absolute left-full ml-4 xl:ml-8 top-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={heroFly}
              alt="Anforcom Hero Fly Mascot"
              className="w-56 lg:w-72 xl:w-80 max-w-none drop-shadow-[0_0_40px_rgba(234,179,8,0.4)] animate-[float_6s_ease-in-out_infinite]"
              style={{
                animation: 'float 6s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        <p className="mt-12 sm:mt-16 text-sm text-[#F5F5DC]/60 font-medium tracking-wide max-w-xl mx-auto leading-relaxed">
          *Total Prize Pool IDR 15.000.000 adalah gabungan hadiah dari ketiga cabang perlombaan (DCPC, DUC, dan DSDC).
        </p>

      </div>
    </section>
  );
}
