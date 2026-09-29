import { useEffect, useRef, useState } from 'react';
import { Globe, Package } from 'lucide-react';

/* ── Partner data ── */
const partners = [
  {
    id: 1,
    name: 'Merkle',
    subtitle: 'Official Partner',
    icon: Globe,
    logo: '/partners/Logo_Merkle_1.png',
  },
  {
    id: 2,
    name: 'Monarq',
    subtitle: 'Official Partner',
    icon: Package,
    logo: '/partners/Monarq_Hitam.png',
  },
];

/* ── Partner Card (Static Frosted Liquid Glass Tile) ── */
function PartnerCard({ partner }) {
  const IconComponent = partner.icon;

  return (
    <div
      className="relative flex items-center justify-center rounded-2xl p-8 sm:p-10 h-36 sm:h-44 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.72) 100%)',
        backdropFilter: 'blur(20px) saturate(170%)',
        WebkitBackdropFilter: 'blur(20px) saturate(170%)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 10px 25px -5px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Liquid Glass Sheen */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Sponsor Logo */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {partner.logo ? (
          <img
            src={partner.logo}
            alt={partner.name}
            className="max-h-20 sm:max-h-24 max-w-[80%] sm:max-w-[75%] object-contain"
          />
        ) : (
          <IconComponent className="w-12 h-12 text-[#14532D]" strokeWidth={1.8} />
        )}
      </div>
    </div>
  );
}

export default function Sponsors() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="relative px-6 py-16 sm:py-20 overflow-hidden"
    >
      <div
        className={`relative mx-auto max-w-4xl z-10 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* ── Section Divider Kicker ── */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#EAB308]/60" />
          <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#EAB308] font-mono">
            PARTNERS & SPONSORS
          </span>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#EAB308]/60" />
        </div>

        {/* ── Section Title ── */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Didukung{' '}
            <span className="text-[#EAB308] drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]">
              Oleh
            </span>
          </h2>
        </div>

        {/* ── Partner Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {partners.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
