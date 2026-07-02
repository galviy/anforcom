import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamAPI } from '../api/api';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [lombaId, setLombaId] = useState('');
  const [lombaOptions, setLombaOptions] = useState([]);
  const [loadingLomba, setLoadingLomba] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchLomba = async () => {
      try {
        setLoadingLomba(true);
        const res = await teamAPI.getLombaList();
        setLombaOptions(res?.data || []);
      } catch (err) {
        console.error('Failed to fetch lomba list:', err);
        setError('Gagal memuat daftar lomba. Pastikan kamu sudah login.');
        if (err.message.includes('401')) {
          navigate('/login');
        }
      } finally {
        setLoadingLomba(false);
      }
    };
    fetchLomba();
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
        {success && <div className="alert-success">✅ Tim berhasil dibuat! Mengalihkan ke Dashboard...</div>}

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
              disabled={loadingLomba}
            >
              <option value="">
                {loadingLomba ? 'Memuat daftar lomba...' : '-- Pilih Lomba --'}
              </option>
              {lombaOptions.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nama_lomba}
                </option>
              ))}
            </select>
            {!loadingLomba && lombaOptions.length === 0 && (
              <small>Tidak ada lomba yang tersedia untuk kategori kamu saat ini.</small>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading || loadingLomba}>
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