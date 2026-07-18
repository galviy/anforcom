import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { authAPI } from '../api/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ new_password1: '', new_password2: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.new_password1 !== form.new_password2) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetConfirmation(token, form.new_password1, form.new_password2);
      if (res?.success === false) {
        setError(res.error || 'Gagal mereset password.');
        return;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.message || 'Tautan reset password tidak valid atau sudah kedaluwarsa.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Shared page shell ── */
  const Shell = ({ children }) => (
    <div className="min-h-screen bg-[#14532D] relative overflow-hidden">

      {/* Decorative background blobs */}
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

      {/* Top navigation bar */}
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

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24 pb-10">
        {children}
      </div>
    </div>
  );

  /* ── Invalid / missing token state ── */
  if (!token) {
    return (
      <Shell>
        <div
          className="
            w-full max-w-md
            rounded-[28px] border border-white/15
            bg-[#F5F5DC]/[0.06] backdrop-blur-md
            p-8 sm:p-10
            shadow-2xl shadow-black/20
          "
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F5F5DC] sm:text-4xl">
              Reset <span className="text-[#EAB308]">Password</span>
            </h1>
          </div>

          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Tautan reset password tidak valid. Silakan minta tautan baru.
          </div>

          <p className="text-center text-sm text-[#F5F5DC]/50">
            <Link
              to="/forgot-password"
              className="font-semibold text-[#EAB308] no-underline transition-colors hover:text-[#FACC15]"
            >
              Minta tautan reset password
            </Link>
          </p>
        </div>
      </Shell>
    );
  }

  /* ── Main reset form ── */
  return (
    <Shell>
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
            <ShieldCheck className="h-7 w-7 text-[#EAB308]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5DC] sm:text-4xl">
            Reset <span className="text-[#EAB308]">Password</span>
          </h1>
          <p className="mt-2 text-sm text-[#F5F5DC]/60">
            Masukkan password baru untuk akun ANFORCOM Anda
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Success state */}
        {success ? (
          <div className="rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-5 py-5 text-center">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-[#EAB308]" />
            <p className="text-sm leading-relaxed text-[#EAB308]">
              Password berhasil direset! Mengalihkan ke halaman login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                Password Baru
              </label>
              <input
                type="password"
                name="new_password1"
                value={form.new_password1}
                onChange={handleChange}
                required
                minLength={6}
                className="
                  w-full rounded-xl border border-white/15
                  bg-white/[0.05] px-4 py-3
                  text-sm text-[#F5F5DC] placeholder-white/25
                  outline-none transition-all duration-200
                  focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                "
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                name="new_password2"
                value={form.new_password2}
                onChange={handleChange}
                required
                minLength={6}
                className="
                  w-full rounded-xl border border-white/15
                  bg-white/[0.05] px-4 py-3
                  text-sm text-[#F5F5DC] placeholder-white/25
                  outline-none transition-all duration-200
                  focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                "
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
              {loading ? 'Memproses...' : 'Reset Password →'}
            </button>
          </form>
        )}

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-[#F5F5DC]/50">
          <Link
            to="/login"
            className="font-semibold text-[#EAB308] no-underline transition-colors hover:text-[#FACC15]"
          >
            Kembali ke halaman login
          </Link>
        </p>
      </div>
    </Shell>
  );
}

