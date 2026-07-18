import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { authAPI, userAPI } from '../api/api';
import Turnstile from '../components/Turnstile';
import PasswordInput from '../components/PasswordInput';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [cfToken, setCfToken] = useState('');
  const resetTurnstile = useRef(null);

  // Form "lupa password" (inline, toggle di bawah form login)
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotCfToken, setForgotCfToken] = useState('');
  const resetForgotTurnstile = useRef(null);

  // Kalau cookie session masih valid, jangan tampilkan form login lagi —
  // langsung lempar ke dashboard.
  useEffect(() => {
    userAPI.getMe()
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => setCheckingSession(false));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cfToken) {
      setError('Selesaikan verifikasi captcha dulu ya.');
      return;
    }

    setLoading(true);
    try {
      // Login berhasil -> backend set-cookie session (HttpOnly), tidak ada token di body
      await authAPI.login({ ...form, cf_turnstile_token: cfToken });

      // Redirect ke dashboard seperti yang diminta Galvin
      window.location.href = '/dashboard'; // Hard redirect biar state reset
    } catch (err) {
      setError(err.message || 'Username atau password salah');
      setCfToken('');
      resetTurnstile.current?.();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage('');

    if (!forgotCfToken) {
      setForgotMessage('Selesaikan verifikasi captcha dulu ya.');
      return;
    }

    setForgotLoading(true);
    try {
      await authAPI.resetPassword(forgotEmail, forgotCfToken);
      // Backend selalu balas success:true walau email tidak terdaftar (anti email-enumeration)
      setForgotMessage('Jika email terdaftar, link reset password sudah dikirim. Cek inbox/spam kamu.');
    } catch (err) {
      setForgotMessage(err.message || 'Gagal mengirim link reset. Coba lagi.');
    } finally {
      setForgotCfToken('');
      resetForgotTurnstile.current?.();
      setForgotLoading(false);
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
              to="/register"
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/20 bg-white/[0.06] backdrop-blur-sm
                px-5 py-2 text-sm font-semibold text-[#F5F5DC]/90
                transition-all duration-200
                hover:border-[#EAB308]/50 hover:text-[#EAB308]
              "
            >
              <UserPlus className="h-4 w-4" />
              <span>Daftar Tim</span>
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 pt-24 pb-10">
        {checkingSession ? (
          <p className="text-[#F5F5DC]/60 text-sm">Memuat...</p>
        ) : (
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
              <h1 className="text-3xl font-bold tracking-tight text-[#F5F5DC] sm:text-4xl">
                Selamat <span className="text-[#EAB308]">Datang</span>
              </h1>
              <p className="mt-2 text-sm text-[#F5F5DC]/60">
                Masuk ke akun ANFORCOM Anda
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username / Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                  Username atau Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="
                    w-full rounded-xl border border-white/15
                    bg-white/[0.05] px-4 py-3
                    text-sm text-[#F5F5DC] placeholder-white/25
                    outline-none transition-all duration-200
                    focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                  "
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                  Password
                </label>
                <PasswordInput
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full rounded-xl border border-white/15
                    bg-white/[0.05] px-4 py-3
                    text-sm text-[#F5F5DC] placeholder-white/25
                    outline-none transition-all duration-200
                    focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                  "
                />
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={() => { setShowForgot((v) => !v); setForgotMessage(''); }}
                    className="text-xs font-medium text-[#EAB308]/70 transition-colors hover:text-[#EAB308] bg-transparent border-none cursor-pointer p-0"
                  >
                    Lupa password?
                  </button>
                </div>
              </div>

              {/* Forgot password inline panel */}
              {showForgot && (
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  {forgotMessage ? (
                    <p className="text-sm text-[#F5F5DC]/60">{forgotMessage}</p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                          Email akun kamu
                        </label>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                          className="
                            w-full rounded-xl border border-white/15
                            bg-white/[0.05] px-4 py-3
                            text-sm text-[#F5F5DC] placeholder-white/25
                            outline-none transition-all duration-200
                            focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                          "
                        />
                      </div>
                      <div className="mb-3 flex justify-center">
                        <Turnstile
                          onVerify={setForgotCfToken}
                          onExpire={() => setForgotCfToken('')}
                          resetRef={resetForgotTurnstile}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleForgotSubmit}
                        disabled={forgotLoading || !forgotEmail || !forgotCfToken}
                        className="
                          w-full rounded-full bg-[#EAB308]/20 border border-[#EAB308]/30
                          py-2.5 text-sm font-semibold text-[#EAB308]
                          transition-all duration-200
                          hover:bg-[#EAB308]/30
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {forgotLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                      </button>
                    </>
                  )}
                </div>
              )}

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
                disabled={loading || !cfToken}
                className="
                  mt-2 w-full rounded-full bg-[#EAB308] py-3.5
                  text-sm font-bold text-[#14532D]
                  shadow-lg shadow-[#EAB308]/20
                  transition-all duration-200
                  hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                "
              >
                {loading ? 'Memproses...' : 'Masuk →'}
              </button>
            </form>

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-[#F5F5DC]/50">
              Belum punya akun?{' '}
              <Link
                to="/register"
                className="font-semibold text-[#EAB308] no-underline transition-colors hover:text-[#FACC15]"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}