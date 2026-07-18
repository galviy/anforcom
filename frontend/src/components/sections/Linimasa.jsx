import { useState, useEffect } from 'react';

const TITLE_PART_1 = 'Timeline ';
const TITLE_PART_2 = 'ANFORCOM!';

const TIMELINE = [
  { label: 'Pendaftaran Batch 1', window: '9 Feb - 10 Mar' },
  { label: 'Pendaftaran Batch 2', window: '11 Mar - 30 Mar' },
  { label: 'Babak Penyisihan', window: 'April - Mei' },
  { label: 'Final & Awarding', window: '16 Mei' },
];

export default function Linimasa() {
  const [typedPart1, setTypedPart1] = useState('');
  const [typedPart2, setTypedPart2] = useState('');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTypedPart1(TITLE_PART_1);
      setTypedPart2(TITLE_PART_2);
      return;
    }
    let i = 0;
    const totalLength = TITLE_PART_1.length + TITLE_PART_2.length;
    
    const id = setInterval(() => {
      i += 1;
      if (i <= TITLE_PART_1.length) {
        setTypedPart1(TITLE_PART_1.slice(0, i));
      } else {
        setTypedPart2(TITLE_PART_2.slice(0, i - TITLE_PART_1.length));
      }
      
      if (i >= totalLength) clearInterval(id);
    }, 70);
    
    return () => clearInterval(id);
  }, []);

  return (
    <section id="linimasa" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[40px] border border-white/20 bg-[#F5F5DC]/10 p-8 sm:p-16 backdrop-blur-md shadow-2xl shadow-black/20">

          <div className="mb-12 sm:mb-24 md:mb-32 text-center">
            <h2 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] sm:text-5xl">
              {typedPart1}
              {typedPart1.length < TITLE_PART_1.length && (
                <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
              )}
              {typedPart1.length === TITLE_PART_1.length && (
                <span className="text-[#EAB308]">
                  {typedPart2}
                  <span className="ml-0.5 inline-block animate-[blink_1s_step-end_infinite]">▌</span>
                </span>
              )}
            </h2>
          </div>

          <div className="hidden md:block relative pb-16">

            <div className="absolute top-1/2 left-[5%] w-[90%] h-[2px] bg-white/40 -translate-y-1/2" />
            
            <div className="flex justify-between relative z-10 w-full px-4">
              {TIMELINE.map((t, idx) => {
                const isTop = idx % 2 === 1; // alternate selang seling bahasa indo nya
                const isYellow = idx % 2 === 0;
                
                return (
                  <div key={idx} className="relative flex flex-col items-center flex-1">

                    <div 
                      className={`
                        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rotate-45 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]
                        ${isYellow ? 'bg-gradient-to-br from-[#FDE047] via-[#EAB308] to-[#854d0e]' : 'bg-gradient-to-br from-white via-gray-300 to-gray-500'}
                      `}
                    />

                    <div className={`absolute w-48 text-center ${isTop ? 'bottom-12' : 'top-12'} left-1/2 -translate-x-1/2`}>
                      <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">{t.window}</h3>
                      <p className="text-sm text-white/90 font-medium drop-shadow-md">{t.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/**BUAT MOBILE */}
          <div className="md:hidden relative border-l-2 border-white/30 ml-4 py-4">
            {TIMELINE.map((t, idx) => {
              const isYellow = idx % 2 === 0;
              return (
                <div key={idx} className="mb-12 pl-10 relative last:mb-0">

                  <div 
                    className={`
                      absolute -left-[17px] top-1 w-8 h-8 rotate-45 border border-white/20 shadow-md
                      ${isYellow ? 'bg-gradient-to-br from-[#FDE047] via-[#EAB308] to-[#854d0e]' : 'bg-gradient-to-br from-white via-gray-300 to-gray-500'}
                    `}
                  />
                  
                  <h3 className="text-lg font-bold text-white mb-1">{t.window}</h3>
                  <p className="text-sm text-white/80">{t.label}</p>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
