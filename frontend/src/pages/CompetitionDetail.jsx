import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getCompetitionBySlug } from '../data/competitions';
import { ArrowLeft, Download, Trophy, Users, Wallet, ChevronRight, Medal, Award, Clock, MessageCircle, Code2, TerminalSquare, Database, Cpu, Binary, BrainCircuit, BarChart3, Layers, Layout, Component, PenTool, Sparkles, Variable, Network, LineChart, FileSpreadsheet, MonitorSmartphone } from 'lucide-react';
import heroBg from '../../assets/HERO_bg.jpg';
import Footer from '../components/sections/Footer';

const INDO_MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
function formatDeadlineDate(date) {
  const d = new Date(date);
  return `${d.getDate()} ${INDO_MONTHS[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
}

export default function CompetitionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const comp = getCompetitionBySlug(slug);
  const heroRef = useRef(null);

  /* ── Typing animation ── */
  const [typedName, setTypedName] = useState('');

  /* ── Countdown (batch-aware) ── */
  const [countdownState, setCountdownState] = useState({ status: 'loading' });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  // Countdown (batch-aware)
  useEffect(() => {
    if (!comp?.batches?.length) {
      setCountdownState({ status: 'tba' });
      return;
    }
    function tick() {
      const now = new Date();
      for (let i = 0; i < comp.batches.length; i++) {
        const batch = comp.batches[i];
        const open = new Date(batch.open);
        const close = new Date(batch.close);
        if (now < open) {
          setCountdownState(i === 0
            ? { status: 'not_open', batch: 1, openDate: open }
            : { status: 'between_batches', prevBatch: i, nextBatch: i + 1, nextOpenDate: open });
          return;
        }
        if (now <= close) {
          const diffMs = Math.max(0, close.getTime() - now.getTime());
          const ts = Math.floor(diffMs / 1000);
          setTimeLeft({
            days: Math.floor(ts / 86400),
            hours: Math.floor((ts % 86400) / 3600),
            minutes: Math.floor((ts % 3600) / 60),
            seconds: ts % 60,
          });
          setCountdownState({ status: 'countdown', batch: i + 1, closeDate: close });
          return;
        }
        if (i < comp.batches.length - 1) {
          const nextOpen = new Date(comp.batches[i + 1].open);
          if (now < nextOpen) {
            setCountdownState({ status: 'between_batches', prevBatch: i + 1, nextBatch: i + 2, nextOpenDate: nextOpen });
            return;
          }
        }
      }
      setCountdownState({ status: 'closed' });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [comp]);

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


  /* ── ANFORCOM Signature: Ultra-Fast Zero-Re-render 3D Vortex Scroll Parallax (Desktop PC Only) ── */
  const badgeContainerRef = useRef(null);
  const svgLinesRef = useRef([]);

  useEffect(() => {
    let ticking = false;
    let currentScrollY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const updateTransforms = () => {
      if (window.innerWidth < 1024) return;

      const scrollY = currentScrollY;
      const opacity = Math.max(0, 1 - scrollY / 280);

      if (badgeContainerRef.current) {
        const container = badgeContainerRef.current;
        const children = container.children;

        // Skip computation if scrolled completely out of view
        if (scrollY > 320) {
          if (container.style.display !== 'none') container.style.display = 'none';
          ticking = false;
          return;
        } else {
          if (container.style.display !== 'block') container.style.display = 'block';
        }

        const currentBadges = competitionBadges[slug] || competitionBadges.duc;

        // Update badge cards transform directly via DOM
        currentBadges.forEach((b, idx) => {
          const el = children[idx + 1]; // +1 because index 0 is SVG line overlay
          const lineEl = svgLinesRef.current[idx];

          if (el) {
            const baseAngle = Math.atan2(b.dirY, b.dirX);
            const spiralAngle = baseAngle + (scrollY * 0.0025 * (b.dirX > 0 ? 1 : -1));
            const dist = Math.hypot(b.dirX, b.dirY) * (scrollY * 1.05);

            const tx = Math.cos(spiralAngle) * dist + (mouseX * 20 * b.depth);
            const ty = Math.sin(spiralAngle) * dist + (mouseY * 16 * b.depth);

            const rotY = (mouseX * 16 * b.depth) + (scrollY * 0.1 * (b.dirX > 0 ? 1 : -1));
            const rotX = (-mouseY * 12 * b.depth) + (scrollY * 0.07);
            const rotZ = b.rot + (scrollY * 0.04 * (b.dirX > 0 ? 1 : -1));
            const scale = Math.max(0.4, 1 - (scrollY * 0.0016));

            el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
            el.style.opacity = opacity.toString();
          }

          if (lineEl) {
            lineEl.style.opacity = (opacity * 0.45).toString();
          }
        });
      }

      ticking = false;
    };

    const handleScroll = () => {
      currentScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateTransforms);
        ticking = true;
      }
    };

    const handleMouseMove = (e) => {
      // Only track mouse when near top of page
      if (window.innerWidth < 1024 || window.scrollY > 300) return;
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      mouseY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      if (!ticking) {
        window.requestAnimationFrame(updateTransforms);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [slug]);

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

  /* ── Badges per competition with 3D Depth & Orbit trajectories ── */
  const competitionBadges = {
    duc: [
      { id: 1, image: '/badges/figma.png', text: 'Figma', color: 'from-[#F24E1E]/25 to-[#A259FF]/25', border: 'border-[#F24E1E]/50', top: '14%', left: '7%', dirX: -1.3, dirY: -0.8, rot: -10, depth: 1.2, floatDelay: '0s' },
      { id: 2, image: '/badges/prototype.png', text: 'Prototype', color: 'from-[#0ACF83]/25 to-[#1ABCFE]/25', border: 'border-[#0ACF83]/50', top: '48%', left: '8%', dirX: -1.6, dirY: 0.4, rot: 8, depth: 0.9, floatDelay: '1.5s' },
      { id: 3, image: '/badges/user-research.png', text: 'User Research', color: 'from-[#3B82F6]/25 to-[#6366F1]/25', border: 'border-[#3B82F6]/50', top: '15%', right: '7%', dirX: 1.4, dirY: -0.7, rot: 12, depth: 1.1, floatDelay: '1s' },
      { id: 4, icon: PenTool, text: 'Design System', color: 'from-[#EC4899]/25 to-[#8B5CF6]/25', border: 'border-[#EC4899]/50', top: '50%', right: '8%', dirX: 1.6, dirY: 0.5, rot: -8, depth: 0.8, floatDelay: '2s' },
    ],
    dcpc: [
      { id: 1, image: '/badges/cpp.png', text: 'C++', color: 'from-[#00599C]/25 to-[#283593]/25', border: 'border-[#00599C]/50', top: '14%', left: '7%', dirX: -1.3, dirY: -0.8, rot: -10, depth: 1.2, floatDelay: '0s' },
      { id: 2, image: '/badges/python.png', text: 'Python', color: 'from-[#3776AB]/25 to-[#FFD43B]/25', border: 'border-[#3776AB]/50', top: '48%', left: '8%', dirX: -1.6, dirY: 0.4, rot: 8, depth: 0.9, floatDelay: '1.5s' },
      { id: 3, image: '/badges/java.png', text: 'Java 21', color: 'from-[#EA2D2E]/25 to-[#F89820]/25', border: 'border-[#EA2D2E]/50', top: '15%', right: '7%', dirX: 1.4, dirY: -0.7, rot: 12, depth: 1.1, floatDelay: '1s' },
      { id: 4, icon: Binary, text: 'Dynamic Prog', color: 'from-[#8B5CF6]/25 to-[#6366F1]/25', border: 'border-[#8B5CF6]/50', top: '50%', right: '8%', dirX: 1.6, dirY: 0.5, rot: -8, depth: 0.8, floatDelay: '2s' },
    ],
    dsdc: [
      { id: 1, image: '/badges/figma.png', text: 'Figma', color: 'from-[#F24E1E]/25 to-[#A259FF]/25', border: 'border-[#F24E1E]/50', top: '14%', left: '7%', dirX: -1.3, dirY: -0.8, rot: -10, depth: 1.2, floatDelay: '0s' },
      { id: 2, image: '/badges/github.svg', text: 'GitHub', color: 'from-[#6e5494]/25 to-[#24292e]/25', border: 'border-[#6e5494]/50', top: '48%', left: '8%', dirX: -1.6, dirY: 0.3, rot: 8, depth: 0.9, floatDelay: '1.5s' },
      { id: 3, icon: MonitorSmartphone, text: 'Mobile App', color: 'from-[#10B981]/25 to-[#059669]/25', border: 'border-[#10B981]/50', top: '15%', right: '7%', dirX: 1.4, dirY: -0.7, rot: 12, depth: 1.1, floatDelay: '1s' },
      { id: 4, image: '/badges/db.png', text: 'Database', color: 'from-[#336791]/25 to-[#EAB308]/25', border: 'border-[#336791]/50', top: '50%', right: '8%', dirX: 1.6, dirY: 0.5, rot: -8, depth: 0.8, floatDelay: '2s' },
    ],
  };

  const badges = competitionBadges[slug] || competitionBadges.duc;

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
          HERO SECTION — ANFORCOM Signature 3D Vortex & Orbit Hero
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-36 pb-20 text-center [perspective:1000px]"
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
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'grid-drift 20s linear infinite',
          }}
        />

        {/* Ambient lighting glows */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EAB308]/10 rounded-full blur-[160px]" />
        <div className="pointer-events-none absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#166534]/50 rounded-full blur-[140px]" />
        <div className="pointer-events-none absolute top-20 right-10 w-[400px] h-[400px] bg-[#EAB308]/8 rounded-full blur-[140px]" />

        {/* ══════════════════════════════════════════
            ANFORCOM SIGNATURE 3D VORTEX BADGES & CONSTELLATION SVG (Desktop PC Only)
        ══════════════════════════════════════════ */}
        <div
          ref={badgeContainerRef}
          className="pointer-events-none absolute inset-0 z-10 hidden lg:block overflow-hidden"
        >
          {/* SVG Constellation Laser Lines */}
          <svg className="absolute inset-0 h-full w-full opacity-40">
            <defs>
              <linearGradient id="anforGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EAB308" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {badges.map((b, idx) => {
              const isLeft = !!b.left;
              const startX = '50%';
              const startY = '40%';
              const endX = isLeft ? b.left : `calc(100% - ${b.right})`;
              const endY = b.top;

              return (
                <line
                  key={`line-${idx}`}
                  ref={(el) => (svgLinesRef.current[idx] = el)}
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke="url(#anforGlow)"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                  style={{ opacity: 0.45 }}
                />
              );
            })}
          </svg>

          {/* Floating 3D Vortex Badges */}
          {badges.map((b) => {
            const BadgeIcon = b.icon || Icon;

            return (
              <div
                key={b.id}
                className="absolute transition-transform duration-75 ease-out [transform-style:preserve-3d] [will-change:transform,opacity]"
                style={{
                  top: b.top,
                  left: b.left,
                  right: b.right,
                  transform: `translate3d(0px, 0px, 0) rotate(${b.rot}deg)`,
                }}
              >
                <div
                  className="group flex items-center gap-3.5 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/[0.04] px-5.5 py-4 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.45),0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-[bounce_5s_easeInOut_infinite] hover:from-white/30 hover:to-white/15 hover:shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),0_25px_50px_-10px_rgba(234,179,8,0.3)] hover:scale-105 transition-all duration-500"
                  style={{ animationDelay: b.floatDelay }}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-[#EAB308] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.35)] backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                    {b.image ? (
                      <img src={b.image} alt={b.text} className="h-7.5 w-7.5 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                    ) : (
                      <BadgeIcon className="h-6 w-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                    )}
                  </div>
                  <p className="text-sm font-extrabold text-white tracking-wide pr-1 sm:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">{b.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════
            HERO MAIN CONTENT
        ══════════════════════════════════════════ */}
        <div className="relative z-20 mx-auto max-w-4xl w-full flex flex-col items-center">

          {/* Main Title (Structured 2 Lines with Division Highlight) */}
          <h1 className="mb-6 text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.18)] leading-[1.08] max-w-5xl text-center">
            {slug === 'dcpc' ? (
              <>
                <span className="block text-white/90 text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1">Diponegoro</span>
                <span className="block text-white">
                  <span className="text-[#EAB308]">Competitive Programming</span> Competition
                </span>
              </>
            ) : slug === 'duc' ? (
              <>
                <span className="block text-white/90 text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1">Diponegoro</span>
                <span className="block text-white">
                  <span className="text-[#EAB308]">UI/UX Design</span> Competition
                </span>
              </>
            ) : slug === 'dsdc' ? (
              <>
                <span className="block text-white/90 text-2xl sm:text-4xl lg:text-5xl font-semibold mb-1">Diponegoro</span>
                <span className="block text-white">
                  <span className="text-[#EAB308]">Software Development</span> Competition
                </span>
              </>
            ) : (
              typedName
            )}
          </h1>

          {/* Description */}
          <p className="mb-10 text-base leading-relaxed text-white/70 sm:text-lg max-w-2xl text-center">
            {comp.fullDesc}
          </p>

          {/* Action Buttons */}
          <div className="mb-14 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#EAB308] px-9 py-4 text-base font-bold text-[#14532D] shadow-xl shadow-[#EAB308]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FACC15] hover:shadow-2xl hover:shadow-[#EAB308]/40"
            >
              Daftar Sekarang
              <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {comp.guidebookFile && (
              <a
                href={comp.guidebookFile}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:shadow-xl hover:shadow-white/10"
              >
                <Download className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Rulebook
              </a>
            )}
          </div>

          {/* Countdown Section — Minimal Horizontal Banner Format */}
          <div className="w-full max-w-2xl py-6 px-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl">
            {countdownState.status === 'countdown' ? (
              <div className="flex flex-col items-center justify-center text-center">
                {/* Top Label */}
                <p className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-[#EAB308] mb-3">
                  BATCH {countdownState.batch} — DITUTUP DALAM
                </p>

                {/* Inline Numbers & Colons */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 my-1">
                  <div className="flex items-baseline justify-center min-w-[2.5rem] sm:min-w-[4rem]">
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {pad(timeLeft.days)}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-4xl font-black text-[#EAB308] animate-pulse">:</span>

                  <div className="flex items-baseline justify-center min-w-[2.5rem] sm:min-w-[4rem]">
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {pad(timeLeft.hours)}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-4xl font-black text-[#EAB308] animate-pulse">:</span>

                  <div className="flex items-baseline justify-center min-w-[2.5rem] sm:min-w-[4rem]">
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {pad(timeLeft.minutes)}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-4xl font-black text-[#EAB308] animate-pulse">:</span>

                  <div className="flex items-baseline justify-center min-w-[2.5rem] sm:min-w-[4rem]">
                    <span className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight tabular-nums text-[#EAB308] drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                      {pad(timeLeft.seconds)}
                    </span>
                  </div>
                </div>

                {/* Bottom Unit Labels */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2">
                  <span className="min-w-[2.5rem] sm:min-w-[4rem] text-center text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
                    HARI
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-transparent">:</span>
                  <span className="min-w-[2.5rem] sm:min-w-[4rem] text-center text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
                    JAM
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-transparent">:</span>
                  <span className="min-w-[2.5rem] sm:min-w-[4rem] text-center text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white/50 uppercase">
                    MENIT
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-transparent">:</span>
                  <span className="min-w-[2.5rem] sm:min-w-[4rem] text-center text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#EAB308]/70 uppercase">
                    DETIK
                  </span>
                </div>
              </div>
            ) : countdownState.status === 'not_open' ? (
              <div className="text-center py-2">
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#EAB308] mb-2">
                  ⏳ Pendaftaran Belum Dibuka
                </p>
                <div className="flex items-center justify-center gap-1.5 text-white/60 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Dibuka {formatDeadlineDate(countdownState.openDate)}</span>
                </div>
              </div>
            ) : countdownState.status === 'between_batches' ? (
              <div className="text-center py-2">
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#EAB308] mb-2">
                  Batch {countdownState.prevBatch} Telah Ditutup
                </p>
                <div className="flex items-center justify-center gap-1.5 text-white/60 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Batch {countdownState.nextBatch} dibuka {formatDeadlineDate(countdownState.nextOpenDate)}</span>
                </div>
              </div>
            ) : countdownState.status === 'closed' ? (
              <div className="text-center py-2">
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white/60">
                  🔒 Pendaftaran Ditutup
                </p>
              </div>
            ) : countdownState.status === 'tba' ? (
              <div className="text-center py-2">
                <p className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-[#EAB308] mb-1">
                  📅 Jadwal Menyusul
                </p>
                <p className="text-xs text-white/50 font-medium">Soon to be announced!</p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Bottom gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#14532D] to-transparent pointer-events-none" />
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
                  <h3 className="text-lg font-bold tracking-[0.2em] text-[#EAB308] uppercase mb-2">Penghargaan</h3>
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
        className={`relative px-6 pb-20 sm:pb-28 transition-all duration-1000 ${visibleSections.has('section-timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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

              <div className="flex flex-col gap-6 w-full md:w-auto md:max-w-2xl shrink-0">
                {comp.contacts?.length > 0 ? (
                  <div className="flex flex-col gap-3 w-full">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 text-center md:text-left">Narahubung {comp.code}</p>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 w-full">
                      {comp.contacts.map((c) => (
                        <a
                          key={c.phone}
                          href={`https://wa.me/${c.phone}?text=Halo%20kak%2C%20saya%20ingin%20bertanya%20tentang%20${comp.code}%20ANFORCOM%202026`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/10 px-5 py-3.5 text-left transition-all hover:bg-[#25D366]/10 hover:border-[#25D366]/30 hover:shadow-lg hover:shadow-[#25D366]/5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 transition-colors group-hover:bg-[#25D366]/20">
                            <MessageCircle className="h-4 w-4 text-[#25D366]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{c.name}</p>
                            <p className="text-xs text-white/40 group-hover:text-[#25D366]/70">WhatsApp</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-end">
                    <a
                      href="https://instagram.com/anforcom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] border border-white/10 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/[0.08] hover:border-white/20 shadow-lg"
                    >
                      Hubungi Kami
                    </a>
                  </div>
                )}
                <Link
                  to="/register"
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FACC15] to-[#EAB308] px-10 py-4 text-sm font-bold tracking-widest text-[#14532D] shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(234,179,8,0.6)]"
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
