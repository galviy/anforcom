import { useState, useEffect } from 'react';

const TITLE_PART_1 = 'Total ';
const TITLE_PART_2 = 'Hadiah ';
const TITLE_PART_3 = 'Hingga:';

export default function Rewards() {
  const [typedPart1, setTypedPart1] = useState('');
  const [typedPart2, setTypedPart2] = useState('');
  const [typedPart3, setTypedPart3] = useState('');

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

  return (
    <section id="rewards" className="relative px-6 py-24 sm:py-32 overflow-hidden">
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#EAB308]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative mx-auto max-w-5xl text-center z-10">

        <div className="mb-10 sm:mb-16 text-center">
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

        <div className="inline-block rounded-[32px] border border-white/20 bg-[#F5F5DC]/10 px-10 py-8 backdrop-blur-lg shadow-2xl shadow-black/30">
          <p className="mb-3 text-sm font-bold tracking-widest text-white/80 uppercase">Total Prize Pool</p>
          <div className="text-5xl font-black tracking-tight sm:text-7xl bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            IDR 15.000.000
          </div>
        </div>

        <p className="mt-16 text-sm text-[#F5F5DC]/60 font-medium tracking-wide">
          *Total Prize Pool IDR 15.000.000 adalah gabungan hadiah dari ketiga cabang perlombaan.
        </p>
      </div>
    </section>
  );
}
