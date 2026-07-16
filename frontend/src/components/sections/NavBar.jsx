import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Kompetisi', href: '#kompetisi' },
  { label: 'Linimasa', href: '#linimasa' },
  { label: 'FAQ', href: '#faq' },
];

export default function NavBar({ user, checkingSession }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <div className="fixed top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-5">
      <nav
        className={`
          relative mx-auto max-w-6xl overflow-hidden rounded-[32px]
          border-l-4 border-[#EAB308] bg-[#14532D]/60 backdrop-blur-md
          transition-all duration-300 ease-in-out
          ${scrolled ? 'shadow-xl shadow-black/30' : 'shadow-lg shadow-black/15'}
        `}
      >
        <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-3.5">
          {/* Logo */}
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

          {/* Desktop nav links — centered */}
          <div className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
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
            ))}
          </div>

          {/* Desktop CTA */}
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

          {/* Mobile hamburger */}
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

        {/* Mobile menu */}
        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out md:hidden bg-black/10
            ${mobileOpen ? 'max-h-96 border-t border-white/10 opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
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
            ))}

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
