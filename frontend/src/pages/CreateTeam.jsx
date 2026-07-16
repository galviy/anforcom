import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI, teamAPI } from '../api/api';

// Backend TIDAK punya endpoint untuk mengambil daftar lomba, jadi daftar ini
// didefinisikan statis di sini. Harus selalu sinkron dengan:
// - data tabel `lomba` (lihat anforcom_dummy.sql)
// - validasi di backend/handlers/routes/teams/create_team.ts
//     pendidikan 1 (Sarjana)       -> lomba 2 DITOLAK (khusus SMA). Lomba 1 & 3 boleh.
//     pendidikan 2 (SMA/Sederajat) -> lomba 3 DITOLAK (khusus Sarjana). Lomba 1 & 2 boleh.
const ALL_LOMBA = [
  { id: 1, nama_lomba: 'DUC', label: 'Diponegoro UI/UX Competition', icon: '🎨', untuk_pendidikan: [1, 2] },
  { id: 2, nama_lomba: 'DCPC', label: 'Diponegoro Competitive Programming Challenge', icon: '💻', untuk_pendidikan: [2] },
  { id: 3, nama_lomba: 'DDSC', label: 'Diponegoro Data Science Competition', icon: '📊', untuk_pendidikan: [1] },
];

export default function CreateTeam() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [lombaId, setLombaId] = useState('');
  const [lombaOptions, setLombaOptions] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ambil kategori pendidikan user yang login, lalu filter lomba yang relevan
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const me = await userAPI.getMe();
        const options = ALL_LOMBA.filter((l) => l.untuk_pendidikan.includes(me.pendidikan_id));
        setLombaOptions(options);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Gagal memuat data pengguna. Pastikan kamu sudah login.');
        if (err.message.includes('401')) {
          navigate('/login');
        }
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!teamName.trim()) {
      setError('Nama tim wajib diisi');
      setLoading(false);
      return;
    }
    if (!lombaId) {
      setError('Pilih lomba terlebih dahulu');
      setLoading(false);
      return;
    }

    try {
      const response = await teamAPI.createTeam({
        team_name: teamName,
        lomba_id: parseInt(lombaId),
      });

      // PENTING: create_team bisa balas HTTP 200 tapi { error: true, message }
      // untuk kegagalan bisnis (misal: user sudah punya tim)
      if (response?.error) {
        setError(response.message || 'Gagal membuat tim.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      // Ini menangkap error validasi (HTTP 401/400), pesannya datang dari field `error`
      setError(err.message || 'Gagal membuat tim. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link to="/" className="app-logo">ANFORCOM<span className="app-logo-year">/26</span></Link>
        </div>
      </nav>

      <div className="app-page-head">
        <button className="app-back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </div>

      <h1 className="app-page-title">Buat Tim Baru</h1>
      <p className="app-page-subtitle">Isi nama tim, pilih cabang lomba yang sesuai kategori pendidikanmu, lalu tambahkan anggota dari dashboard.</p>

      {error && (
        <div style={{ maxWidth: 480, margin: '0 auto 1rem' }}>
          <div className="alert-error">{error}</div>
        </div>
      )}
      {success && (
        <div style={{ maxWidth: 480, margin: '0 auto 1rem' }}>
          <div className="alert-success">✅ Tim berhasil dibuat! Mengalihkan ke Dashboard untuk menambahkan anggota...</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ maxWidth: 480, margin: '0 auto 1.5rem' }}>
          <label>Nama Tim</label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Contoh: Tim Keren 2026"
            required
          />
        </div>

        {loadingUser ? (
          <p style={{ textAlign: 'center', color: 'var(--app-text-muted)' }}>Memuat pilihan lomba...</p>
        ) : lombaOptions.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--app-text-muted)' }}>Tidak ada lomba yang tersedia untuk kategori kamu saat ini.</p>
        ) : (
          <div className="comp-grid">
            {lombaOptions.map((l) => (
              <button
                type="button"
                key={l.id}
                className={`comp-pick-card${lombaId === String(l.id) ? ' selected' : ''}`}
                onClick={() => setLombaId(String(l.id))}
              >
                <div className="comp-pick-icon">{l.icon}</div>
                <div className="comp-pick-name">{l.nama_lomba}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--app-text-muted)', marginTop: '0.35rem' }}>{l.label}</div>
              </button>
            ))}
          </div>
        )}

        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <button type="submit" className="btn-primary" disabled={loading || loadingUser || !lombaId}>
            {loading ? 'Memproses...' : 'Buat Tim'}
          </button>
        </div>
      </form>
    </div>
  );
}