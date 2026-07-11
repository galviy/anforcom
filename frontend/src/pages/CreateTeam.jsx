import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, teamAPI } from '../api/api';

// Backend TIDAK punya endpoint untuk mengambil daftar lomba, jadi daftar ini
// didefinisikan statis di sini. Harus selalu sinkron dengan:
// - data tabel `lomba` (lihat anforcom_dummy.sql)
// - validasi di backend/handlers/routes/teams/create_team.ts
//     pendidikan 1 (Sarjana)       -> lomba 2 DITOLAK (khusus SMA). Lomba 1 & 3 boleh.
//     pendidikan 2 (SMA/Sederajat) -> lomba 3 DITOLAK (khusus Sarjana). Lomba 1 & 2 boleh.
const ALL_LOMBA = [
  { id: 1, nama_lomba: 'DUC (SMA/Sarjana)', untuk_pendidikan: [1, 2] },
  { id: 2, nama_lomba: 'DCPC (SMA/Sederajat)', untuk_pendidikan: [2] },
  { id: 3, nama_lomba: 'DDSC (Sarjana)', untuk_pendidikan: [1] },
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
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Buat Tim</h1>
        <p className="auth-subtitle">Isi data tim untuk mengikuti lomba</p>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">✅ Tim berhasil dibuat! Mengalihkan ke Dashboard untuk menambahkan anggota...</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Tim</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Contoh: Tim Keren 2026"
              required
            />
          </div>

          <div className="form-group">
            <label>Pilih Lomba</label>
            <select
              value={lombaId}
              onChange={(e) => setLombaId(e.target.value)}
              required
              disabled={loadingUser}
            >
              <option value="">
                {loadingUser ? 'Memuat...' : '-- Pilih Lomba --'}
              </option>
              {lombaOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nama_lomba}
                </option>
              ))}
            </select>
            {!loadingUser && lombaOptions.length === 0 && (
              <small>Tidak ada lomba yang tersedia untuk kategori kamu saat ini.</small>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading || loadingUser}>
            {loading ? 'Memproses...' : 'Buat Tim'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}