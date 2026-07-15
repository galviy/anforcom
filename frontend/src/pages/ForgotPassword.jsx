import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Backend selalu balas success:true walau email tidak terdaftar
      // (mencegah enumerasi email), jadi cukup tampilkan pesan generik.
      await authAPI.resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Gagal mengirim permintaan reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Lupa Password</h1>
        <p className="auth-subtitle">Masukkan email akun ANFORCOM Anda, kami akan mengirimkan tautan reset password</p>

        {error && <div className="alert-error">{error}</div>}

        {sent ? (
          <div className="alert-success">
            Jika akun dengan email tersebut terdaftar, kami telah mengirimkan tautan reset password. Silakan cek inbox (dan folder spam) Anda.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login">Kembali ke halaman login</Link>
        </div>
      </div>
    </div>
  );
}
