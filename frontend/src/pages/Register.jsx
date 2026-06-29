import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    no_tlp: '',              // ← Ganti dari no_tel
    tingkat_pendidikan: ''   // ← Tambah ini (value: 0,1,2)
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Kirim data dengan field yang sesuai
      await authAPI.register({
        username: form.username,
        password: form.password,
        email: form.email,
        no_tlp: form.no_tlp,           // ← Field ini
        tingkat_pendidikan: parseInt(form.tingkat_pendidikan) // ← Harus angka 0/1/2
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Daftar Akun</h1>
        <p className="auth-subtitle">Buat akun untuk mulai berkompetisi</p>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">✅ Pendaftaran berhasil! Mengalihkan ke Login...</div>}

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

          {/* ↓↓↓ TAMBAHKAN INI ↓↓↓ */}
          <div className="form-group">
            <label>Tingkat Pendidikan</label>
            <select name="tingkat_pendidikan" value={form.tingkat_pendidikan} onChange={handleChange} required>
              <option value="">Pilih tingkat pendidikan</option>
              <option value="0">SMA/SMK</option>
              <option value="1">D3</option>
              <option value="2">S1</option>
            </select>
          </div>
          {/* ↑↑↑ TAMBAHKAN INI ↑↑↑ */}

          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="auth-footer">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}