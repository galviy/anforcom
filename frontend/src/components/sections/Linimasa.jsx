import { useState, useEffect } from 'react';

const TITLE_PART_1 = 'Timeline ';
const TITLE_PART_2 = 'ANFORCOM!';

const TIMELINE = [
  { label: 'Pendaftaran Batch 1', window: '19 Jul - 2 Agu' },
  { label: 'Pendaftaran Batch 2', window: '10 Agu - 24 Agu' },
  { label: 'Babak Penyisihan', window: 'Agu - Sep' },
  { label: 'Final & Awarding', window: '26 Sep' },
];

// Tanggal asli tiap batch pendaftaran, dipakai buat hitung countdown.
// PENTING: kalau tanggal di TIMELINE di atas berubah, sinkronkan juga di sini.
const REGISTRATION_BATCHES = [
  { label: 'Pendaftaran Batch 1', start: new Date(2026, 6, 19, 0, 0, 0), end: new Date(2026, 7, 2, 23, 59, 59) },
  { label: 'Pendaftaran Batch 2', start: new Date(2026, 7, 10, 0, 0, 0), end: new Date(2026, 7, 24, 23, 59, 59) },
];

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function getBatchStatus(batch, now) {
  if (now < batch.start) return 'upcoming';
  if (now > batch.end) return 'closed';
  return 'open';
}

function formatCountdown(targetDate, now) {
  const diffMs = targetDate - now;
  if (diffMs <= 0) return null;
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function RegistrationCountdown() {
  const now = useNow();
  const allClosed = REGISTRATION_BATCHES.every((b) => getBatchStatus(b, now) === 'closed');

  if (allClosed) {
    return (
      <div className="mb-12 sm:mb-16 rounded-3xl border border-white/20 bg-white/[0.04] px-6 py-8 text-center">
        <p className="text-lg font-bold text-white sm:text-xl">Pendaftaran Anforcom 2026 telah selesai</p>
        <p className="mt-1 text-sm text-white/60">Sampai jumpa di babak penyisihan &amp; final!</p>
      </div>
    );
  }

  return (
    <div className="mb-12 sm:mb-16 grid gap-4 sm:grid-cols-2">
      {REGISTRATION_BATCHES.map((batch) => {
        const status = getBatchStatus(batch, now);
        const target = status === 'upcoming' ? batch.start : batch.end;
        const countdown = formatCountdown(target, now);

        return (
          <div
            key={batch.label}
            className={`rounded-3xl border p-6 text-center backdrop-blur-md ${
              status === 'closed'
                ? 'border-white/10 bg-white/[0.03]'
                : 'border-[#EAB308]/30 bg-[#EAB308]/[0.06]'
            }`}
          >
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="text-sm font-semibold text-white">{batch.label}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  status === 'open'
                    ? 'bg-[#EAB308] text-[#14532D]'
                    : status === 'upcoming'
                    ? 'border border-white/30 text-white/70'
                    : 'border border-white/10 text-white/40'
                }`}
              >
                {status === 'open' ? 'Dibuka' : status === 'upcoming' ? 'Segera' : 'Ditutup'}
              </span>
            </div>

            {status === 'closed' || !countdown ? (
              <p className="text-sm text-white/50">Batch ini sudah ditutup</p>
            ) : (
              <>
                <p className="mb-2 text-xs text-white/60">
                  {status === 'upcoming' ? 'Dibuka dalam' : 'Ditutup dalam'}
                </p>
                <div className="flex justify-center gap-3 font-mono">
                  {[
                    ['Hari', countdown.days],
                    ['Jam', countdown.hours],
                    ['Menit', countdown.minutes],
                    ['Detik', countdown.seconds],
                  ].map(([unitLabel, value]) => (
                    <div key={unitLabel} className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-[#EAB308] sm:text-3xl">
                        {String(value).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-white/50">{unitLabel}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

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

          <RegistrationCountdown />

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