import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, teamAPI } from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Sesi login dicek lewat cookie (HttpOnly), bukan localStorage.
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getMe();
        setUser(response);
        setError('');

        try {
          const teamRes = await teamAPI.getMyTeams();
          setTeams(teamRes?.data || []);
        } catch (teamErr) {
          console.error('Failed to fetch teams:', teamErr);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        if (err.message.includes('401') || err.message.includes('403')) {
          navigate('/login');
          return;
        }
        setError('Gagal memuat data pengguna. Pastikan backend berjalan.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    // TODO: backend belum punya endpoint logout untuk menghapus cookie session
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ padding: '2rem' }}>
        <div className="alert-error">{error}</div>
        <button onClick={handleLogout} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 2rem' }}>
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <h1 className="dashboard-logo">ANFORCOM</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </nav>

      <div className="dashboard-main">
        <div className="dashboard-card">
          <h2>Selamat Datang, {user?.username || 'User'}! 👋</h2>
          <hr />
          <div className="user-info-grid">
            <div className="info-item">
              <span className="info-label">Username</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">No. Telepon</span>
              <span className="info-value">{user?.no_tlp || '-'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tingkat Pendidikan</span>
              <span className="info-value">{user?.pendidikan_id === 1 ? 'Sarjana' : user?.pendidikan_id === 2 ? 'SMA/Sederajat' : '-'}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '0.75rem 2rem' }}
              onClick={() => navigate('/create-team')}
            >
              + Buat Tim Baru
            </button>
          </div>
        </div>

        <div className="dashboard-card" style={{ marginTop: '1.5rem' }}>
          <h3>Tim Saya</h3>
          <hr />
          {teams.length === 0 ? (
            <p>Kamu belum punya tim. Yuk buat tim baru!</p>
          ) : (
            <ul>
              {teams.map((t) => (
                <li key={t.id}>{t.nama_tim}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}