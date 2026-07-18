import { TerminalSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between mb-8">

          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-widest text-white uppercase">
              ANFORCOM 2026
            </span>
          </div>

          {/* Right: Social Media */}
          <div className="flex flex-col gap-4">
            <p className="text-sm font-semibold text-white leading-relaxed">
              For more information, check out<br />our other social media!
            </p>
            <div className="flex items-center gap-5">
              <a
                href="https://instagram.com/anforcom"
                target="_blank"
                rel="noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom: Copyright */}
        <div className="border-t border-white pt-6">
          <p className="text-sm font-medium text-white">
            © 2026 ANFORCOM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
