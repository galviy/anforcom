import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Form "lupa password" (inline, toggle di bawah form login)
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

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
    setLoading(true);
    setError('');

    try {
      // Login berhasil -> backend set-cookie session (HttpOnly), tidak ada token di body
      await authAPI.login(form);

      // Redirect ke dashboard seperti yang diminta Galvin
      window.location.href = '/dashboard'; // Hard redirect biar state reset
    } catch (err) {
      setError(err.message || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');
    try {
      await authAPI.resetPassword(forgotEmail);
      // Backend selalu balas success:true walau email tidak terdaftar (anti email-enumeration)
      setForgotMessage('Jika email terdaftar, link reset password sudah dikirim. Cek inbox/spam kamu.');
    } catch (err) {
      setForgotMessage(err.message || 'Gagal mengirim link reset. Coba lagi.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link to="/" className="app-logo">ANFORCOM<span className="app-logo-year">/26</span></Link>
          <div className="app-nav-cta">
            <Link to="/register" className="app-btn app-btn-ghost app-btn-sm">Daftar Tim</Link>
          </div>
        </div>
      </nav>

      {checkingSession ? (
        <div className="auth-container">
          <p style={{ color: 'var(--app-text-muted)' }}>Memuat...</p>
        </div>
      ) : (
        <div className="auth-container">
          <div className="auth-card">
            <h1 className="auth-title">Selamat Datang</h1>
            <p className="auth-subtitle">Masuk ke akun ANFORCOM Anda</p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username atau Email</label>
                <input type="text" name="username" value={form.username} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
                <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => { setShowForgot((v) => !v); setForgotMessage(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--app-teal)', fontSize: '0.82rem', cursor: 'pointer', padding: 0 }}
                  >
                    Lupa password?
                  </button>
                </div>
              </div>

              {showForgot && (
                <div className="member-form" style={{ marginBottom: '1.15rem' }}>
                  {forgotMessage ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--app-text-muted)' }}>{forgotMessage}</p>
                  ) : (
                    <>
                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label>Email akun kamu</label>
                        <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
                      </div>
                      <button type="button" className="app-btn app-btn-solid app-btn-sm app-btn-block" onClick={handleForgotSubmit} disabled={forgotLoading || !forgotEmail}>
                        {forgotLoading ? 'Mengirim...' : 'Kirim Link Reset Password'}
                      </button>
                    </>
                  )}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="auth-footer">
              Belum punya akun? <Link to="/register">Daftar sekarang</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}