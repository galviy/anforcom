import { useState, useEffect } from 'react';

const TITLE_PART_1 = 'Frequently Asked ';
const TITLE_PART_2 = 'Questions';

const FAQS = [
  {
    q: 'Bagaimana cara mendaftarkan tim?',
    a: 'Buat akun lewat halaman Daftar, lalu masuk ke dashboard dan buat tim dari sana. Kamu akan memilih cabang lomba sesuai kategori pendidikanmu saat membuat tim.',
  },
  {
    q: 'Apakah satu tim boleh ikut lebih dari satu cabang lomba?',
    a: 'Untuk saat ini, satu akun hanya dapat terdaftar dalam satu tim aktif. Ketentuan lebih detail akan diumumkan lewat guidebook resmi.',
  },
  {
    q: 'Siapa saja yang boleh mengikuti Anforcom?',
    a: 'DUC terbuka untuk siswa SMA/SMK/MA sederajat maupun mahasiswa se-Indonesia. DCPC untuk saat ini terbuka bagi siswa SMA/Sederajat, sedangkan DDSC khusus untuk mahasiswa S1/D4.',
  },
  {
    q: 'Apakah rangkaian acara online atau offline?',
    a: 'Babak penyisihan direncanakan berjalan online, sementara babak final bersifat luring. Jadwal pasti akan diumumkan mendekati hari-H.',
  },
];

export default function FAQ() {
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
    <section id="faq" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 sm:mb-16 text-center">
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

        <div className="space-y-4">
          {FAQS.map((f, idx) => (
            <details
              key={idx}
              className="group rounded-[24px] border border-white/20 bg-[#F5F5DC]/10 p-6 backdrop-blur-md transition-all hover:bg-[#F5F5DC]/20 hover:border-white/40 shadow-xl shadow-black/10 open:bg-[#F5F5DC]/20"
            >
              <summary className="flex cursor-pointer items-center justify-between font-bold text-white text-lg outline-none">
                {f.q}
                <span className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/30 text-[#EAB308] transition-transform group-open:rotate-45 group-hover:border-[#EAB308]">
                  +
                </span>
              </summary>
              <p className="mt-4 text-base leading-relaxed text-white/80 border-t border-white/10 pt-4">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
