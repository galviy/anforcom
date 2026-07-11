import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, userAPI } from '../api/api';

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
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Kirim data dengan field yang sesuai
      const res = await authAPI.register({
        username: form.username,
        password: form.password,
        email: form.email,
        no_tlp: form.no_tlp,           // ← Field ini
        tingkat_pendidikan: parseInt(form.tingkat_pendidikan) // ← Harus angka 1 atau 2
      });
      // PENTING: akun BELUM aktif setelah register. Backend hanya menyimpan
      // pendaftaran sementara dan mengirim link verifikasi ke email (berlaku
      // 24 jam). Akun baru benar-benar dibuat setelah link itu diklik, jadi
      // jangan langsung arahkan ke /login karena login akan gagal (akun belum ada).
      setSuccess(res?.message || 'Link verifikasi telah dikirim ke email kamu.');
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Memuat...</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Daftar Akun</h1>
        <p className="auth-subtitle">Buat akun untuk mulai berkompetisi</p>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">✅ {success} Cek email kamu (termasuk folder spam) dan klik link verifikasinya sebelum login.</div>}

        {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Nomor Telepon</label>
            <input type="tel" name="no_tlp" value={form.no_tlp} onChange={handleChange} placeholder="08xxxxxxxxxx" required />
          </div>

          <div className="form-group">
            <label>Tingkat Pendidikan</label>
            <select name="tingkat_pendidikan" value={form.tingkat_pendidikan} onChange={handleChange} required>
              <option value="">Pilih tingkat pendidikan</option>
              <option value="1">S1/Sederajat</option>
              <option value="2">SMA/Sederajat</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>
        )}

        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}