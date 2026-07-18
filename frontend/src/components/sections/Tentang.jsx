import { useState, useEffect } from 'react';
import mascot from '../../../assets/HERO_mascot.PNG';

const TITLE_PART_1 = 'What Is ';
const TITLE_PART_2 = 'ANFORCOM?';

export default function Tentang() {
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
    <section id="tentang" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 sm:mb-16 text-center text-4xl font-bold tracking-tight text-[#F5F5DC] sm:text-5xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
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

        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5 flex justify-center">
            <img
              src={mascot}
              alt="Anforcom Mascot"
              className="w-full max-w-md drop-shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-[float_6s_ease-in-out_infinite]"
              style={{
                animation: 'float 6s ease-in-out infinite'
              }}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-3xl border border-[#F5F5DC]/20 bg-[#F5F5DC]/10 p-8 backdrop-blur-md sm:p-10 shadow-xl shadow-black/20">
              <h3 className="mb-4 text-xl font-bold text-[#F5F5DC] sm:text-2xl">
                Perlombaan Teknologi Tahunan <span className="text-[#EAB308]">HMIF</span> Undip
              </h3>
              <p className="text-base leading-relaxed text-[#F5F5DC]/90 sm:text-lg">
                Anforcom adalah kompetisi informatika nasional oleh HMIF Universitas Diponegoro
                untuk siswa SMA/Sederajat dan mahasiswa se-Indonesia — satu panggung untuk desain
                antarmuka, pemrograman kompetitif, dan data science.
              </p>
            </div>

            <div className="rounded-3xl border border-[#F5F5DC]/20 bg-[#F5F5DC]/10 p-8 backdrop-blur-md sm:p-10 shadow-xl shadow-black/20">
              <p className="text-base leading-relaxed text-[#F5F5DC]/90 sm:text-lg">
                Anforcom mempertemukan pelajar dan mahasiswa dari seluruh Indonesia untuk
                berkompetisi sekaligus berkolaborasi di bidang teknologi — mulai dari merancang
                pengalaman pengguna, menyelesaikan tantangan pemrograman kompetitif, sampai
                membangun solusi data science dari studi kasus nyata.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
}
