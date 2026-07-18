import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, CheckCircle, Mail } from 'lucide-react';
import { authAPI } from '../api/api';
import Turnstile from '../components/Turnstile';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [cfToken, setCfToken] = useState('');
  const resetTurnstile = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cfToken) {
      setError('Selesaikan verifikasi captcha dulu ya.');
      return;
    }

    setLoading(true);
    try {
      // Backend selalu balas success:true walau email tidak terdaftar
      // (mencegah enumerasi email), jadi cukup tampilkan pesan generik.
      await authAPI.resetPassword(email, cfToken);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Gagal mengirim permintaan reset password.');
      setCfToken('');
      resetTurnstile.current?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14532D] relative overflow-hidden">

      {/* ── Decorative background blobs ── */}
      <div
        className="pointer-events-none absolute -top-40 -right-32"
        aria-hidden="true"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-40"
        aria-hidden="true"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(0,128,128,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Top navigation bar ── */}
      <div className="fixed top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-5">
        <nav className="relative mx-auto max-w-6xl rounded-[32px] border-l-4 border-[#EAB308] bg-[#14532D]/60 backdrop-blur-md shadow-lg shadow-black/15 transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-3.5">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 text-[#F5F5DC] no-underline rounded-lg"
            >
              <span className="text-lg font-bold tracking-wide sm:text-xl">
                ANFORCOM <span className="font-semibold text-[#EAB308]">2026</span>
              </span>
            </Link>
            <Link
              to="/login"
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/20 bg-white/[0.06] backdrop-blur-sm
                px-5 py-2 text-sm font-semibold text-[#F5F5DC]/90
                transition-all duration-200
                hover:border-[#EAB308]/50 hover:text-[#EAB308]
              "
            >
              <LogIn className="h-4 w-4" />
              <span>Masuk</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24 pb-10">
        <div
          className="
            w-full max-w-md
            rounded-[28px] border border-white/15
            bg-[#F5F5DC]/[0.06] backdrop-blur-md
            p-8 sm:p-10
            shadow-2xl shadow-black/20
          "
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
              <Mail className="h-7 w-7 text-[#EAB308]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F5F5DC] sm:text-4xl">
              Lupa <span className="text-[#EAB308]">Password?</span>
            </h1>
            <p className="mt-2 text-sm text-[#F5F5DC]/60">
              Masukkan email akun ANFORCOM Anda, kami akan mengirimkan tautan reset password
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success state */}
          {sent ? (
            <div className="rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-5 py-5 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-[#EAB308]" />
              <p className="text-sm leading-relaxed text-[#EAB308]">
                Jika akun dengan email tersebut terdaftar, kami telah mengirimkan tautan reset password. Silakan cek inbox (dan folder spam) Anda.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="contoh@email.com"
                  className="
                    w-full rounded-xl border border-white/15
                    bg-white/[0.05] px-4 py-3
                    text-sm text-[#F5F5DC] placeholder-white/25
                    outline-none transition-all duration-200
                    focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                  "
                />
              </div>

              {/* Verifikasi captcha */}
              <div className="flex justify-center">
                <Turnstile
                  onVerify={setCfToken}
                  onExpire={() => setCfToken('')}
                  resetRef={resetTurnstile}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2 w-full rounded-full bg-[#EAB308] py-3.5
                  text-sm font-bold text-[#14532D]
                  shadow-lg shadow-[#EAB308]/20
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                "
              >
                {loading ? 'Mengirim...' : 'Kirim Tautan Reset →'}
              </button>
            </form>
          )}

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-[#F5F5DC]/50">
            Ingat password Anda?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#EAB308] no-underline transition-colors hover:text-[#FACC15]"
            >
              Kembali ke login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}