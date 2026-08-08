import { useEffect, useState } from 'react';

// Semua boundary pakai WIB (+07:00) biar konsisten siapapun yang buka & di manapun dia berada.
const REG_OPEN_BATCH1 = new Date('2026-07-19T00:00:00+07:00');
const REG_CLOSE_BATCH1 = new Date('2026-08-02T23:59:59+07:00');
// Extended Batch 1: perpanjangan pendaftaran Batch 1, mengisi jeda yang
// sebelumnya kosong (3-9 Agustus) sebelum Batch 2 dibuka.
const REG_OPEN_EXT_BATCH1 = new Date('2026-08-03T00:00:00+07:00');
const REG_CLOSE_EXT_BATCH1 = new Date('2026-08-09T23:59:59+07:00');
const REG_OPEN_BATCH2 = new Date('2026-08-10T00:00:00+07:00');
const REG_CLOSE_BATCH2 = new Date('2026-08-24T23:59:59+07:00');

function getRegistrationState(now) {
  if (now < REG_OPEN_BATCH1) {
    return { status: 'not_open' };
  }
  if (now <= REG_CLOSE_BATCH1) {
    return { status: 'countdown', batchLabel: 'Batch 1', target: REG_CLOSE_BATCH1 };
  }
  if (now < REG_OPEN_EXT_BATCH1) {
    // Jeda sangat singkat antara 23:59:59 Batch 1 dan 00:00:00 Extended Batch 1
    // (seharusnya cuma sepersekian detik, tapi tetap ditangani biar aman).
    return { status: 'between_batches', message: 'Pendaftaran Batch 1 telah ditutup — Extended Batch 1 dibuka 3 Agustus 2026' };
  }
  if (now <= REG_CLOSE_EXT_BATCH1) {
    return { status: 'countdown', batchLabel: 'Extended Batch 1', target: REG_CLOSE_EXT_BATCH1 };
  }
  if (now < REG_OPEN_BATCH2) {
    return { status: 'between_batches', message: 'Extended Batch 1 telah ditutup — Batch 2 dibuka 10 Agustus 2026' };
  }
  if (now <= REG_CLOSE_BATCH2) {
    return { status: 'countdown', batchLabel: 'Batch 2', target: REG_CLOSE_BATCH2 };
  }
  return { status: 'closed' };
}

function getTimeLeft(target, now) {
  const diffMs = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="min-w-[3.25rem] rounded-lg bg-[#F5F5DC]/10 px-2.5 py-1.5 text-2xl font-bold tabular-nums text-[#F5F5DC] backdrop-blur-sm sm:text-3xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-[#F5F5DC]/70 sm:text-xs">{label}</span>
    </div>
  );
}

export default function RegistrationCountdown() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const state = getRegistrationState(now);

  if (state.status === 'not_open') {
    return (
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 px-5 py-2.5 text-sm font-medium text-[#F5F5DC]/90 backdrop-blur-sm sm:text-base">
        <span className="h-2 w-2 rounded-full bg-[#EAB308]" />
        Pendaftaran belum dibuka
      </div>
    );
  }

  if (state.status === 'between_batches') {
    return (
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 px-5 py-2.5 text-sm font-medium text-[#F5F5DC]/90 backdrop-blur-sm sm:text-base">
        <span className="h-2 w-2 rounded-full bg-[#EAB308]" />
        {state.message}
      </div>
    );
  }

  if (state.status === 'closed') {
    return (
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#F5F5DC]/20 bg-[#F5F5DC]/5 px-5 py-2.5 text-sm font-medium text-[#F5F5DC]/90 backdrop-blur-sm sm:text-base">
        <span className="h-2 w-2 rounded-full bg-white/40" />
        Pendaftaran telah ditutup
      </div>
    );
  }

  // status === 'countdown'
  const { days, hours, minutes, seconds } = getTimeLeft(state.target, now);

  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <span className="text-sm font-medium uppercase tracking-wide text-[#EAB308] sm:text-base">
        {state.batchLabel} — Ditutup dalam
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <TimeBox value={days} label="Hari" />
        <span className="pb-4 text-xl font-bold text-[#F5F5DC]/50">:</span>
        <TimeBox value={hours} label="Jam" />
        <span className="pb-4 text-xl font-bold text-[#F5F5DC]/50">:</span>
        <TimeBox value={minutes} label="Menit" />
        <span className="pb-4 text-xl font-bold text-[#F5F5DC]/50">:</span>
        <TimeBox value={seconds} label="Detik" />
      </div>
    </div>
  );
}