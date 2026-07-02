import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, teamAPI } from '../api/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk panel "Lihat Anggota"
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    // Sesi login dicek lewat cookie (HttpOnly), bukan localStorage.
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getMe();
        setUser(response);
        setError('');
        await refreshTeams();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const refreshTeams = async () => {
    try {
      const teamRes = await teamAPI.getMyTeams();
      setTeams(teamRes?.data || []);
    } catch (teamErr) {
      console.error('Failed to fetch teams:', teamErr);
    }
  };

  const handleLogout = () => {
    // TODO: backend belum punya endpoint logout untuk menghapus cookie session
    navigate('/login');
  };

  const handleToggleMembers = async (timId) => {
    setActionError('');
    if (expandedTeamId === timId) {
      setExpandedTeamId(null);
      setMembers([]);
      return;
    }
    try {
      setMembersLoading(true);
      setExpandedTeamId(timId);
      const res = await teamAPI.getTeamMembers(timId);
      setMembers(res?.data || []);
    } catch (err) {
      setActionError(err.message || 'Gagal memuat anggota tim.');
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  };

  const handleDeleteTeam = async (timId) => {
    if (!window.confirm('Yakin ingin menghapus tim ini? Semua anggota juga akan dihapus.')) return;
    setActionError('');
    try {
      await teamAPI.deleteTeam(timId);
      if (expandedTeamId === timId) {
        setExpandedTeamId(null);
        setMembers([]);
      }
      await refreshTeams();
    } catch (err) {
      setActionError(err.message || 'Gagal menghapus tim.');
    }
  };

  const handleRemoveMember = async (timId, userId) => {
    if (!window.confirm('Yakin ingin mengeluarkan anggota ini dari tim?')) return;
    setActionError('');
    try {
      await teamAPI.deleteUserTeam(timId, userId);
      const res = await teamAPI.getTeamMembers(timId);
      setMembers(res?.data || []);
    } catch (err) {
      setActionError(err.message || 'Gagal mengeluarkan anggota.');
    }
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
          {actionError && <div className="alert-error">{actionError}</div>}

          {teams.length === 0 ? (
            <p>Kamu belum punya tim. Yuk buat tim baru!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {teams.map((t) => (
                <li key={t.id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{t.nama_tim}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary"
                        style={{ width: 'auto', padding: '0.4rem 1rem' }}
                        onClick={() => handleToggleMembers(t.id)}
                      >
                        {expandedTeamId === t.id ? 'Tutup' : 'Lihat Anggota'}
                      </button>
                      <button
                        style={{ width: 'auto', padding: '0.4rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        onClick={() => handleDeleteTeam(t.id)}
                      >
                        Hapus Tim
                      </button>
                    </div>
                  </div>

                  {expandedTeamId === t.id && (
                    <div style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                      {membersLoading ? (
                        <p>Memuat anggota...</p>
                      ) : members.length === 0 ? (
                        <p>Belum ada anggota terdaftar di tim ini.</p>
                      ) : (
                        <ul>
                          {members.map((m) => (
                            <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span>
                                {m.nama_lengkap} — {m.asal_instansi} ({m.nomor_induk})
                              </span>
                              <button
                                style={{ width: 'auto', padding: '0.25rem 0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                onClick={() => handleRemoveMember(t.id, m.id)}
                              >
                                Keluarkan
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}