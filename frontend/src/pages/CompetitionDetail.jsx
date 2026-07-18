import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getCompetitionBySlug } from '../data/competitions';
import { ArrowLeft, Download, Trophy, Users, Wallet, ChevronRight, Medal, Award } from 'lucide-react';
import heroBg from '../../assets/HERO_bg.jpg';
import Footer from '../components/sections/Footer';

export default function CompetitionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const comp = getCompetitionBySlug(slug);
  const heroRef = useRef(null);

  /* ── Typing animation ── */
  const [typedName, setTypedName] = useState('');

  /* ── Countdown ── */
  const DEADLINE = new Date('2026-08-30T23:59:59');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  /* ── Scroll-triggered fade-in ── */
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
    setTypedName('');
  }, [slug]);

  // Typing effect
  useEffect(() => {
    if (!comp) return;
    const name = comp.name;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTypedName(name.slice(0, i));
      if (i >= name.length) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [comp, slug]);

  // Countdown
  useEffect(() => {
    function calc() {
      const diff = DEADLINE - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      };
    }
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(id);
  }, []);

  // Intersection Observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [comp]);

  const registrationOpen = DEADLINE - Date.now() > 0;
  const pad = (n) => String(n).padStart(2, '0');

  if (!comp) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#14532D] text-white">
        <h1 className="mb-4 text-6xl font-black text-[#EAB308]">404</h1>
        <p className="mb-8 text-white/70">Kompetisi tidak ditemukan.</p>
        <Link to="/" className="rounded-full bg-[#EAB308] px-6 py-3 font-semibold text-[#14532D] transition hover:bg-[#FACC15]">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const Icon = comp.icon;

  return (
    <div className="min-h-screen bg-[#14532D] text-white select-none overflow-x-hidden">

      {/* ─── Floating Back Button ─── */}
      <div className="fixed top-5 left-5 z-50 sm:top-7 sm:left-7">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 rounded-full border border-white/15 bg-[#14532D]/70 px-5 py-2.5 text-sm font-medium text-white/80 backdrop-blur-xl transition-all duration-300 hover:border-[#EAB308]/40 hover:bg-[#14532D] hover:text-[#EAB308] hover:shadow-lg hover:shadow-[#EAB308]/10 hover:-translate-x-0.5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Kembali
        </button>
      </div>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-16"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#14532D]/85" />

        {/* Animated grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'grid-drift 20s linear infinite',
          }}
        />

        {/* Gold glow top-left */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#EAB308]/8 rounded-full blur-[150px]" />
        {/* Green glow bottom-right */}
        <div className="pointer-events-none absolute -bottom-32 -right-20 w-[600px] h-[600px] bg-[#166534]/30 rounded-full blur-[150px]" />
        {/* Accent glow center */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#EAB308]/5 rounded-full blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-6xl w-full">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Title + Description */}
            <div className="max-w-2xl">
              {/* Typed title */}
              <h1 className="mb-8 text-4xl font-extrabold uppercase tracking-wide text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.12)] sm:text-5xl lg:text-6xl leading-[1.1]">
                {typedName}
                <span className="ml-1 inline-block animate-[blink_1s_step-end_infinite] text-[#EAB308]">▌</span>
              </h1>

              <p className="text-base leading-relaxed text-white/65 sm:text-lg max-w-xl">{comp.fullDesc}</p>

              {/* Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={`/guidebook-${comp.slug}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5"
                >
                  <Download className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                  Guidebook
                </a>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-8 py-3.5 text-sm font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30"
                >
                  Daftar Sekarang
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right: Countdown */}
            <div className="flex flex-col items-center gap-8">
              {/* Countdown box */}
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-8 backdrop-blur-xl shadow-2xl shadow-black/30 sm:px-10">
                <p className="mb-5 text-center text-xs font-bold tracking-[0.25em] uppercase text-[#EAB308]">
                  {registrationOpen ? '⏳ Pendaftaran Dibuka' : '🔒 Pendaftaran Ditutup'}
                </p>
                <div className="flex items-center gap-3 sm:gap-4">
                  {[
                    { value: timeLeft.days, label: 'Hari' },
                    { value: timeLeft.hours, label: 'Jam' },
                    { value: timeLeft.minutes, label: 'Menit' },
                  ].map((unit, i) => (
                    <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] sm:h-[88px] sm:w-[88px]">
                          <span className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] sm:text-4xl">{pad(unit.value)}</span>
                        </div>
                        <span className="mt-2.5 text-[10px] font-semibold tracking-[0.15em] text-white/40 uppercase">{unit.label}</span>
                      </div>
                      {i < 2 && <span className="mb-6 text-2xl font-black text-[#EAB308]/40">:</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#14532D] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          SUMMARY & PRIZES (Bento Layout)
      ══════════════════════════════════════════ */}
      <section
        id="section-summary-prizes"
        data-animate
        className={`relative px-6 py-16 transition-all duration-1000 ${visibleSections.has('section-summary-prizes') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="relative mx-auto max-w-5xl">
          {/* Heading */}
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] sm:text-5xl">
              Ringkasan <span className="text-[#EAB308]">Kompetisi</span>
            </h2>
            <p className="mt-4 text-white/50 text-sm">Prepare for the ultimate challenge. Review the operational parameters before engagement.</p>
          </div>

          {/* Bento Grid */}
          <div className="flex flex-col gap-6">

            {/* Top Row: Kategori & Biaya */}
            <div className="grid gap-6 md:grid-cols-5">

              {/* Kategori Card (col-span-3) */}
              <div className="md:col-span-3 relative overflow-hidden rounded-2xl bg-white/[0.05] border border-white/10 border-l-[4px] border-l-[#EAB308] p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
                {/* Faded Background Icon */}
                <Users className="absolute -right-6 -bottom-6 h-56 w-56 text-[#14532D] opacity-40 pointer-events-none" />

                <div className="relative z-10">
                  <h3 className="text-xs font-bold tracking-[0.2em] text-[#EAB308] uppercase mb-3">Kategori Peserta</h3>
                  <p className="text-3xl font-black text-white sm:text-4xl">{comp.summary.peserta}</p>

                  <div className="mt-12 flex items-center gap-3 text-white/70">
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-medium">{comp.summary.anggota}</span>
                  </div>
                </div>
              </div>

              {/* Biaya Card (col-span-2) */}
              <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-white/[0.05] border border-white/10 border-l-[4px] border-l-[#EAB308] p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
                {/* Faded Background Icon */}
                <Wallet className="absolute -right-6 -bottom-6 h-48 w-48 text-[#14532D] opacity-40 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xs font-bold tracking-[0.2em] text-[#EAB308] uppercase">Biaya Pendaftaran</h3>
                    <Wallet className="h-6 w-6 text-[#EAB308]" />
                  </div>


                  <p className="text-xs text-white/40 mb-1 font-bold">IDR</p>
                  <p className="text-4xl font-black text-white">{comp.summary.biaya.replace('Rp. ', '').replace('Rp ', '')}</p>
                  <p className="text-[10px] text-white/40 mt-1 uppercase font-bold">/ {comp.summary.biayaNote}</p>
                </div>
              </div>
            </div>

            {/* Bottom Row: Penghargaan */}
            <div className="relative overflow-hidden rounded-2xl bg-white/[0.05] border border-white/10 border-l-[4px] border-l-[#EAB308] p-8 sm:p-10 shadow-2xl shadow-black/40 backdrop-blur-sm transition-colors hover:bg-white/[0.07]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xs font-bold tracking-[0.2em] text-[#EAB308] uppercase mb-2">Penghargaan & Prestise</h3>
                  <p className="text-sm text-white/50">Hadiah bagi para penakluk arena.</p>
                </div>
                <Trophy className="h-10 w-10 text-[#EAB308]" />
              </div>

              {/* Inner Cards for Juara */}
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { title: 'JUARA 1', reward: comp.prizes[0].reward, extras: comp.prizes[0].extras, color: 'text-[#EAB308]' },
                  { title: 'JUARA 2', reward: comp.prizes[1].reward, extras: comp.prizes[1].extras, color: 'text-gray-300' },
                  { title: 'JUARA 3', reward: comp.prizes[2].reward, extras: comp.prizes[2].extras, color: 'text-amber-500' }
                ].map((juara) => (
                  <div key={juara.title} className="rounded-xl bg-black/25 border border-white/10 p-6 flex flex-col gap-4 shadow-inner transition-colors hover:bg-black/40">
                    <div className="flex items-center gap-3">
                      <Trophy className={`h-5 w-5 ${juara.color}`} />
                      <h4 className={`text-lg font-bold tracking-widest ${juara.color}`}>{juara.title}</h4>
                    </div>
                    <div className="flex flex-col gap-3 mt-2">
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <Wallet className="h-4 w-4 text-[#EAB308]/70" />
                        <span>Uang Pembinaan</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-white/80">
                        <Award className="h-4 w-4 text-[#EAB308]/70" />
                        <span>{juara.extras}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TIMELINE (identical style to Landing Linimasa)
      ══════════════════════════════════════════ */}
      <section
        id="section-timeline"
        data-animate
        className={`relative px-6 pb-20 sm:pb-28 transition-all duration-1000 ${
          visibleSections.has('section-timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[40px] border border-white/20 bg-[#F5F5DC]/10 p-8 sm:p-16 backdrop-blur-md shadow-2xl shadow-black/20">

            <div className="mb-12 sm:mb-16 text-center">
              <h2 className="text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] sm:text-5xl">
                Timeline <span className="text-[#EAB308]">{comp.code}!</span>
              </h2>
              {comp.timeline.length > 5 && (
                <p className="hidden md:block mt-4 text-sm text-white/40">← Geser untuk melihat selengkapnya →</p>
              )}
            </div>

            {/* Desktop timeline — scrollable with drag */}
            <div
              className="hidden md:block overflow-x-auto cursor-grab active:cursor-grabbing select-none"
              onMouseDown={(e) => {
                const el = e.currentTarget;
                el.dataset.dragging = 'true';
                el.dataset.startX = String(e.pageX);
                el.dataset.scrollLeft = String(el.scrollLeft);
              }}
              onMouseMove={(e) => {
                const el = e.currentTarget;
                if (el.dataset.dragging !== 'true') return;
                e.preventDefault();
                const walk = (e.pageX - Number(el.dataset.startX)) * 1.5;
                el.scrollLeft = Number(el.dataset.scrollLeft) - walk;
              }}
              onMouseUp={(e) => { e.currentTarget.dataset.dragging = 'false'; }}
              onMouseLeave={(e) => { e.currentTarget.dataset.dragging = 'false'; }}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div style={{ minWidth: `${Math.max(comp.timeline.length * 170, 800)}px` }}>
                {/* Top labels (odd indices) */}
                <div className="flex h-20 mb-4">
                  {comp.timeline.map((t, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end" style={{ minWidth: '170px' }}>
                      {idx % 2 === 1 && (
                        <div className="text-center px-2">
                          <h3 className="text-base font-bold text-white drop-shadow-md leading-tight">{t.window}</h3>
                          <p className="text-xs text-white/90 font-medium drop-shadow-md mt-1">{t.label}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Diamond line */}
                <div className="relative h-10">
                  <div className="absolute top-1/2 left-[85px] right-[85px] h-[2px] bg-white/40 -translate-y-1/2" />
                  <div className="flex h-full relative z-10">
                    {comp.timeline.map((t, idx) => {
                      const isYellow = idx % 2 === 0;
                      return (
                        <div key={idx} className="flex-1 flex items-center justify-center" style={{ minWidth: '170px' }}>
                          <div
                            className={`
                              w-8 h-8 rotate-45 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.2)]
                              ${isYellow ? 'bg-gradient-to-br from-[#FDE047] via-[#EAB308] to-[#854d0e]' : 'bg-gradient-to-br from-white via-gray-300 to-gray-500'}
                            `}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom labels (even indices) */}
                <div className="flex mt-4 h-20">
                  {comp.timeline.map((t, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-start" style={{ minWidth: '170px' }}>
                      {idx % 2 === 0 && (
                        <div className="text-center px-2">
                          <h3 className="text-base font-bold text-white drop-shadow-md leading-tight">{t.window}</h3>
                          <p className="text-xs text-white/90 font-medium drop-shadow-md mt-1">{t.label}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile timeline — diamond markers (vertical) */}
            <div className="md:hidden relative border-l-2 border-white/30 ml-4 py-4">
              {comp.timeline.map((t, idx) => {
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
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA - Grand Glassmorphism (Rectangular)
      ══════════════════════════════════════════ */}
      <section className="relative px-6 pb-24 sm:pb-32 mt-10">
        {/* Glow Effects Behind the Card */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] max-w-full h-[300px] bg-gradient-to-t from-[#EAB308]/20 to-transparent rounded-[100%] blur-[100px]" />
        
        <div className="relative mx-auto max-w-6xl">
          <div className="rounded-[32px] border border-white/20 bg-[#14532D]/40 backdrop-blur-2xl py-12 px-8 sm:py-14 sm:px-16 shadow-2xl shadow-black/40 text-center relative overflow-hidden">
            
            {/* Pattern overlay from Hero */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            {/* Inner subtle glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-40" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 text-left">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black drop-shadow-[0_0_25px_rgba(234,179,8,0.3)] leading-[1.1] tracking-wide uppercase">
                  <span className="text-[#EAB308] block mb-1">BUKTIKAN</span>
                  <span className="text-white block">POTENSIMU<br className="hidden md:block" /> SEKARANG!</span>
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-5 w-full md:w-auto shrink-0">
                <a
                  href="https://instagram.com/anforcom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-black/40 border border-white/20 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-black/60 hover:border-white/40 shadow-lg"
                >
                  Hubungi Kami
                </a>
                <Link
                  to="/register"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] px-10 py-4 text-sm font-bold tracking-widest text-[#14532D] shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(234,179,8,0.6)]"
                >
                  DAFTAR SEKARANG
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer (same as landing page) ─── */}
      <Footer />

      {/* ─── Inline keyframes ─── */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
