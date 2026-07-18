import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, MonitorSmartphone, TerminalSquare, LineChart } from 'lucide-react';

const TITLE_PART_1 = 'Pick Your ';
const TITLE_PART_2 = 'Game!';

const COMPETITIONS = [
  {
    code: 'DUC',
    name: 'Diponegoro UI/UX Competition',
    desc: 'Rancang alur dan tampilan produk digital yang menyelesaikan masalah nyata pengguna — dari riset singkat sampai purwarupa antarmuka yang bisa dicoba langsung.',
    icon: MonitorSmartphone,
  },
  {
    code: 'DCPC',
    name: 'Diponegoro Competitive Programming',
    desc: 'Adu strategi dan logika lewat rangkaian studi kasus pemrograman kompetitif, dari babak penyisihan online sampai final di bawah tekanan waktu.',
    icon: TerminalSquare,
  },
  {
    code: 'DDSC',
    name: 'Diponegoro Data Science Competition',
    desc: 'Gali insight dari data dunia nyata — mulai dari eksplorasi dan pembersihan data, penerapan metode analisis, sampai presentasi temuan di depan juri.',
    icon: LineChart,
  },
];

export default function Kompetisi() {
  const [typedPart1, setTypedPart1] = useState('');
  const [typedPart2, setTypedPart2] = useState('');

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: false },
    [Autoplay({ delay: 3000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onInit = useCallback((emblaApi) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

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
    <section id="kompetisi" className="relative overflow-hidden px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
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

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y pt-4 pb-12 -ml-6">
              {COMPETITIONS.map((comp, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <div
                    key={comp.code}
                    className="relative min-w-0 flex-[0_0_85%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <div
                      className={`
                        h-full flex flex-col items-center rounded-3xl border border-white/20 
                        bg-[#F5F5DC]/10 p-8 text-center backdrop-blur-md transition-all duration-500
                        ${isActive ? 'scale-105 shadow-[0_0_30px_rgba(255,255,255,0.15)] opacity-100' : 'scale-95 opacity-50 hover:opacity-100'}
                      `}
                    >
                      <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/20 shadow-lg rotate-12 transition-transform duration-500 group-hover:rotate-0">
                        <comp.icon className="h-14 w-14 -rotate-12 text-[#EAB308] transition-transform duration-500 group-hover:rotate-0" />
                      </div>
                      
                      <h3 className="mb-4 text-2xl font-bold text-white">{comp.name}</h3>
                      <p className="text-sm leading-relaxed text-white/80">{comp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-3">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === selectedIndex ? 'w-8 bg-white' : 'w-3 bg-white/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
