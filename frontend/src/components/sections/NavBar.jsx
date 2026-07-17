import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { COMPETITIONS } from '../../data/competitions';

const NAV_LINKS = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Kompetisi', href: '#kompetisi', hasDropdown: true },
  { label: 'Linimasa', href: '#linimasa' },
  { label: 'FAQ', href: '#faq' },
];

export default function NavBar({ user, checkingSession }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileKompetisiOpen, setMobileKompetisiOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
    setDropdownOpen(false);
  };

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 200);
  };

  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-5">
      <nav
        className={`
          relative mx-auto max-w-6xl rounded-[32px]
          border-l-4 border-[#EAB308] bg-[#14532D]/60 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${scrolled ? 'shadow-xl shadow-black/30' : 'shadow-lg shadow-black/15'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-3.5">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex shrink-0 items-center gap-2 text-[#F5F5DC] no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D] rounded-lg"
          >
            <span className="text-lg font-bold tracking-wide sm:text-xl">
              ANFORCOM <span className="font-semibold text-[#EAB308]">2026</span>
            </span>
          </a>

          {/* ─── Desktop Nav Links ─── */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                /* Kompetisi with dropdown */
                <div
                  key={link.href}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="
                      inline-flex items-center gap-1 text-sm font-medium text-[#F5F5DC]/80
                      transition-colors duration-200
                      hover:text-[#EAB308]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D] rounded-md px-2 py-1
                    "
                  >
                    {link.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </a>

                  {/* Dropdown panel */}
                  <div
                    className={`
                      absolute left-1/2 -translate-x-1/2 top-full pt-3
                      transition-all duration-300 ease-out
                      ${dropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}
                    `}
                  >
                    <div className="w-64 rounded-2xl border border-white/15 bg-[#14532D]/90 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 pt-4 pb-2">
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#EAB308]/60 uppercase">Cabang Lomba</p>
                      </div>

                      {/* Competition links */}
                      <div className="px-2 pb-3">
                        {COMPETITIONS.map((comp) => (
                          <Link
                            key={comp.slug}
                            to={`/competition/${comp.slug}`}
                            className="
                              group flex items-center gap-3 rounded-xl px-3 py-2.5
                              text-[#F5F5DC]/80 no-underline
                              transition-all duration-200
                              hover:bg-white/8 hover:text-white
                            "
                            onClick={() => setDropdownOpen(false)}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10 transition-all duration-200 group-hover:bg-[#EAB308]/15 group-hover:border-[#EAB308]/25">
                              <comp.icon className="h-4 w-4 text-[#EAB308]/70 transition-colors duration-200 group-hover:text-[#EAB308]" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold leading-tight">{comp.code}</p>
                              <p className="text-[11px] text-white/40 leading-tight mt-0.5 group-hover:text-white/50 transition-colors">{comp.name.replace('Diponegoro ', '')}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="border-t border-white/10 px-4 py-3">
                        <a
                          href="#kompetisi"
                          onClick={(e) => handleNavClick(e, '#kompetisi')}
                          className="text-xs font-medium text-[#EAB308]/70 hover:text-[#EAB308] transition-colors no-underline"
                        >
                          Lihat semua kompetisi →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="
                    text-sm font-medium text-[#F5F5DC]/80
                    transition-colors duration-200
                    hover:text-[#EAB308]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D] rounded-md px-2 py-1
                  "
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* ─── Desktop CTA ─── */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {checkingSession ? null : user ? (
              <Link
                to="/dashboard"
                className="
                  inline-flex items-center gap-2 rounded-full
                  bg-[#EAB308] px-5 py-2 text-sm font-semibold text-[#14532D]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-lg hover:shadow-[#EAB308]/25
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]
                "
              >
                <span className="h-2 w-2 rounded-full bg-[#65A30D]" />
                {user.username}
                <span>→</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="
                  inline-flex items-center gap-1.5 rounded-full
                  bg-[#EAB308] px-6 py-2 text-sm font-semibold text-[#14532D]
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-lg hover:shadow-[#EAB308]/25
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]
                "
              >
                Daftar Sekarang
                <span className="text-base">→</span>
              </Link>
            )}
          </div>

          {/* ─── Mobile hamburger ─── */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="
              relative z-50 flex h-10 w-10 items-center justify-center
              rounded-lg text-[#F5F5DC] transition-colors
              hover:bg-white/10 md:hidden
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]
            "
            aria-label="Toggle menu"
          >
            <div className="flex w-5 flex-col gap-[5px]">
              <span
                className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* ─── Mobile menu ─── */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out md:hidden bg-black/10
            ${mobileOpen ? 'max-h-[600px] border-t border-white/10 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.href}>
                  {/* Kompetisi toggle */}
                  <button
                    onClick={() => setMobileKompetisiOpen((prev) => !prev)}
                    className="
                      w-full flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-[#F5F5DC]/80
                      transition-colors duration-200
                      hover:bg-white/10 hover:text-[#EAB308]
                      focus:outline-none
                    "
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${mobileKompetisiOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Sub-items */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileKompetisiOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-4 flex flex-col gap-1 border-l border-white/10 pl-3 py-1">
                      {COMPETITIONS.map((comp) => (
                        <Link
                          key={comp.slug}
                          to={`/competition/${comp.slug}`}
                          className="
                            flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#F5F5DC]/70 no-underline
                            transition-colors duration-200 hover:bg-white/8 hover:text-[#EAB308]
                          "
                          onClick={() => setMobileOpen(false)}
                        >
                          <comp.icon className="h-4 w-4 text-[#EAB308]/60" />
                          {comp.code}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="
                    rounded-lg px-4 py-3 text-sm font-medium text-[#F5F5DC]/80
                    transition-colors duration-200
                    hover:bg-white/10 hover:text-[#EAB308]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308]
                  "
                >
                  {link.label}
                </a>
              )
            )}

            <div className="mt-3 border-t border-white/10 pt-4">
              {checkingSession ? null : user ? (
                <Link
                  to="/dashboard"
                  className="
                    flex items-center justify-center gap-2 rounded-full
                    bg-[#EAB308] px-4 py-3 text-sm font-semibold text-[#14532D]
                    transition-all duration-200 hover:bg-[#FACC15]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]
                  "
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="h-2 w-2 rounded-full bg-[#65A30D]" />
                  {user.username} → Dashboard
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="
                    flex items-center justify-center gap-1.5 rounded-full
                    bg-[#EAB308] px-4 py-3 text-sm font-semibold text-[#14532D]
                    transition-all duration-200 hover:bg-[#FACC15]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]
                  "
                  onClick={() => setMobileOpen(false)}
                >
                  Daftar Sekarang
                  <span className="text-base">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
