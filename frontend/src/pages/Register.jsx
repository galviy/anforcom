import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { authAPI, userAPI } from '../api/api';
import Turnstile from '../components/Turnstile';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    no_tlp: '',              // ← Ganti dari no_tel
    tingkat_pendidikan: ''   // ← value: 1 (S1/Sederajat) atau 2 (SMA/Sederajat)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [cfToken, setCfToken] = useState('');
  const resetTurnstile = useRef(null);

  // Kalau cookie session masih valid, jangan tampilkan form register lagi —
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
    setSuccess('');

    if (!cfToken) {
      setError('Selesaikan verifikasi captcha dulu ya.');
      return;
    }

    setLoading(true);
    try {
      // Kirim data dengan field yang sesuai
      const res = await authAPI.register({
        username: form.username,
        password: form.password,
        email: form.email,
        no_tlp: form.no_tlp,           // ← Field ini
        tingkat_pendidikan: parseInt(form.tingkat_pendidikan), // ← Harus angka 1 atau 2
        cf_turnstile_token: cfToken,
      });
      // PENTING: akun BELUM aktif setelah register. Backend hanya menyimpan
      // pendaftaran sementara dan mengirim link verifikasi ke email (berlaku
      // 24 jam). Akun baru benar-benar dibuat setelah link itu diklik, jadi
      // jangan langsung arahkan ke /login karena login akan gagal (akun belum ada).
      setSuccess(res?.message || 'Link verifikasi telah dikirim ke email kamu.');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
      setCfToken('');
      resetTurnstile.current?.(); // token Turnstile sekali pakai, minta yang baru
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
                Daftar <span className="text-[#EAB308]">Akun</span>
              </h1>
              <p className="mt-2 text-sm text-[#F5F5DC]/60">
                Buat akun untuk mulai berkompetisi
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Success alert */}
            {success && (
              <div className="mb-5 rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-4 py-3 text-sm text-[#EAB308]">
                ✅ {success} Cek email kamu (termasuk folder spam) dan klik link verifikasinya sebelum login.
              </div>
            )}

            {/* Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Username */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                    Username
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

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
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

                {/* Nomor Telepon */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="no_tlp"
                    value={form.no_tlp}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
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

                {/* Tingkat Pendidikan */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                    Tingkat Pendidikan
                  </label>
                  <select
                    name="tingkat_pendidikan"
                    value={form.tingkat_pendidikan}
                    onChange={handleChange}
                    required
                    className="
                      w-full rounded-xl border border-white/15
                      bg-white/[0.05] px-4 py-3
                      text-sm text-[#F5F5DC]
                      outline-none transition-all duration-200
                      focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                      [&>option]:bg-[#14532D] [&>option]:text-[#F5F5DC]
                    "
                  >
                    <option value="">Pilih tingkat pendidikan</option>
                    <option value="1">S1/Sederajat</option>
                    <option value="2">SMA/Sederajat</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
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
                  {loading ? 'Memproses...' : 'Daftar Sekarang →'}
                </button>
              </form>
            )}

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-[#F5F5DC]/50">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#EAB308] no-underline transition-colors hover:text-[#FACC15]"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}