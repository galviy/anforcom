import { Link } from 'react-router-dom';

export default function CTA() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#1F2937] to-[#14532D] p-10 text-center shadow-2xl sm:p-16">
        <h2 className="mb-4 text-3xl font-bold text-[#F5F5DC] sm:text-4xl">
          Siap unjuk karya di Anforcom 2026?
        </h2>
        <p className="mb-10 text-lg text-[#F5F5DC]/70">
          Bentuk timmu, pilih cabang lomba, dan mulai perjalananmu.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-8 py-4 text-lg font-bold text-[#14532D] transition-all hover:-translate-y-1 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14532D]"
        >
          Daftar Sekarang →
        </Link>
      </div>
    </section>
  );
}
