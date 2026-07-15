import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Reset Password</h1>
          <div className="alert-error">
            Tautan reset password tidak valid. Silakan minta tautan baru.
          </div>
          <div className="auth-footer">
            <Link to="/forgot-password">Minta tautan reset password</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Masukkan password baru untuk akun ANFORCOM Anda</p>

        {error && <div className="alert-error">{error}</div>}

        {success ? (
          <div className="alert-success">
            Password berhasil direset! Mengalihkan ke halaman login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Password Baru</label>
              <input
                type="password"
                name="new_password1"
                value={form.new_password1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Konfirmasi Password Baru</label>
              <input
                type="password"
                name="new_password2"
                value={form.new_password2}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Memproses...' : 'Reset Password'}
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
