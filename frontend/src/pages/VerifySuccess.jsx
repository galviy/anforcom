import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Check, X, Loader2 } from 'lucide-react';
import { authAPI } from '../api/api';

export default function VerifySuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Link verifikasi tidak valid — token tidak ditemukan di URL.');
      return;
    }

    authAPI
      .verifyEmail(token)
      .then((res) => {
        setStatus('success');
        setMessage(res?.message || 'Akun kamu sudah aktif.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Gagal memverifikasi email.');
      });
  }, [token]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#14532D] px-6 py-24">
      {/* Aksen visual, senada dengan Hero */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
        style={{
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.08) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0"
        aria-hidden="true"
        style={{
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at bottom left, rgba(0,128,128,0.06) 0%, transparent 70%)',
        }}
      />

      <Link
        to="/"
        className="absolute left-6 top-6 text-lg font-bold tracking-wide text-[#F5F5DC] no-underline sm:left-7 sm:top-7 sm:text-xl"
      >
        ANFORCOM <span className="font-semibold text-[#EAB308]">2026</span>
      </Link>

      <div className="relative z-10 mx-auto max-w-xl text-center">
        {status === 'loading' && (
          <>
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/20 shadow-lg">
              <Loader2 className="h-14 w-14 animate-spin text-[#EAB308]" />
            </div>
            <p className="text-lg font-medium text-[#F5F5DC]/80">Memverifikasi email kamu...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/20 shadow-lg">
              <Check className="h-14 w-14 text-[#EAB308]" strokeWidth={2.5} />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#EAB308]">
              Verifikasi Berhasil
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-[#F5F5DC] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:text-5xl">
              Email Berhasil Diverifikasi
            </h1>
            <p className="mb-10 text-base leading-relaxed text-[#F5F5DC]/80 sm:text-lg">
              {message} Silakan masuk untuk mulai menjelajahi dashboard, event, dan kompetisi.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-8 py-3.5 text-base font-semibold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30"
              >
                Lanjut ke Login →
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#F5F5DC]/30 px-8 py-3.5 text-base font-semibold text-[#F5F5DC] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F5F5DC]/60 hover:bg-[#F5F5DC]/5"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-white/20 shadow-lg">
              <X className="h-14 w-14 text-red-300" strokeWidth={2.5} />
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-red-300">
              Verifikasi Gagal
            </p>
            <h1 className="mb-6 text-4xl font-bold leading-[1.08] tracking-tight text-[#F5F5DC] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] sm:text-5xl">
              Email Gagal Diverifikasi
            </h1>
            <p className="mb-10 text-base leading-relaxed text-[#F5F5DC]/80 sm:text-lg">
              {message}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#EAB308] px-8 py-3.5 text-base font-semibold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30"
              >
                Daftar Ulang
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#F5F5DC]/30 px-8 py-3.5 text-base font-semibold text-[#F5F5DC] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#F5F5DC]/60 hover:bg-[#F5F5DC]/5"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}