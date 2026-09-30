import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-900/60 relative z-10" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* ── Column 1: Brand Info (spans 2 cols on md+) ── */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/anfor_icon.png"
                alt="Logo Anforcom"
                className="w-7 h-7 object-contain"
              />
              <span className="text-white font-extrabold tracking-tight text-lg">
                ANFORCOM <span className="text-[#EAB308] font-mono text-base">2026</span>
              </span>
            </div>
            <p className="text-sm text-[#F5F5DC]/50 max-w-sm leading-relaxed">
              Annual Informatics Competition — Gelaran festival teknologi dan kompetisi informatika berskala nasional oleh HMIF Universitas Diponegoro untuk mengasah inovasi dan potensi talenta masa depan Indonesia.
            </p>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-sm text-[#F5F5DC]/50">
              <li>
                <Link to="/" className="hover:text-[#EAB308] transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#kompetisi" className="hover:text-[#EAB308] transition-colors duration-200">
                  Kategori Lomba
                </a>
              </li>
              <li>
                <a href="/#linimasa" className="hover:text-[#EAB308] transition-colors duration-200">
                  Linimasa
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#EAB308] transition-colors duration-200">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-[#EAB308] transition-colors duration-200">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* ── Column 3: Find us on! & Location ── */}
          <div className="space-y-5">
            {/* Find us on! */}
            <div>
              <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-3">
                Find us on!
              </h5>
              <ul className="space-y-2.5 text-sm text-[#F5F5DC]/60">
                <li>
                  <a
                    href="https://instagram.com/anforcom"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 hover:text-[#EAB308] transition-colors duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#EAB308]/40 group-hover:bg-[#EAB308]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#EAB308]">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </div>
                    <span>Instagram (@anforcom)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/anforcom"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 hover:text-[#EAB308] transition-colors duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#EAB308]/40 group-hover:bg-[#EAB308]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#EAB308]">
                        <path d="M18.244 2H21.5l-7.29 8.33L22.5 22h-6.938l-5.43-7.11L4.5 22H1.24l7.79-8.9L1.5 2h7.06l4.91 6.49L18.244 2zm-2.44 18h1.94L8.26 4H6.2l9.604 16z" />
                      </svg>
                    </div>
                    <span>X / Twitter (@anforcom)</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com/@anforcom"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 hover:text-[#EAB308] transition-colors duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#EAB308]/40 group-hover:bg-[#EAB308]/10 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#EAB308]">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.49a8.24 8.24 0 004.78 1.53V7.57a4.85 4.85 0 01-1.02-.88z" />
                      </svg>
                    </div>
                    <span>TikTok (@anforcom)</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Location */}
            <div>
              <h5 className="text-sm font-semibold text-white tracking-wider uppercase mb-2">
                Lokasi
              </h5>
              <div className="flex gap-2 text-sm text-[#F5F5DC]/40">
                <MapPin className="w-4 h-4 text-[#EAB308]/60 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Departemen Ilmu Komputer / Informatika,<br />
                  Fakultas Sains dan Matematika,<br />
                  Universitas Diponegoro, Semarang
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── Copyright Bottom Bar ── */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5F5DC]/30 gap-4">
          <div>
            © 2026 ANFORCOM. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>by</span>
            <span className="font-semibold text-[#F5F5DC]/50">HMIF Undip</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
