import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // 1. Validasi: Kalo ga ada token, balikin ke halaman login
    if (!token) {
      navigate('/login');
      return;
    }

    // 2. Fetch data user
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getMe();
        setUser(response); // Asumsi response langsung object user
        setError('');
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError('Gagal memuat data pengguna. Pastikan backend berjalan.');
        // Jika token tidak valid (401), lempar ke login
        if (err.message.includes('401') || err.message.includes('403')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
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
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <h1 className="dashboard-logo">ANFORCOM</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </nav>

      {/* Main Content */}
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
              <span className="info-value">{user?.tingkat_pendidikan || '-'}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
              + Buat Tim Baru
            </button>
            <button className="btn-secondary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>
              Lihat Tim Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}