import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, teamAPI, authAPI } from '../api/api';

const MAX_MEMBERS_PER_TEAM = 3;

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

  // State untuk form "Tambah Anggota"
  const [addingToTeamId, setAddingToTeamId] = useState(null);
  const [memberForm, setMemberForm] = useState({ nama_lengkap: '', asal_instansi: '', nomor_induk: '', photo: null });
  const [addingLoading, setAddingLoading] = useState(false);
  const [addingError, setAddingError] = useState('');

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
        if (err.status === 401 || err.status === 403) {
          navigate('/login', { replace: true });
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

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Endpoint logout tetap dipanggil walau gagal, supaya user tidak "terjebak" —
      // tapi kalau backend belum memperbaiki bug nama cookie (lihat api.js), sesi
      // di server mungkin masih aktif meski UI sudah kembali ke halaman login.
      console.error('Logout request failed:', err);
    } finally {
      navigate('/login');
    }
  };

  const handleToggleMembers = async (timId) => {
    setActionError('');
    setAddingToTeamId(null);
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

  const handleRemoveMember = async (timId, memberId) => {
    if (!window.confirm('Yakin ingin mengeluarkan anggota ini dari tim?')) return;
    setActionError('');
    try {
      await teamAPI.deleteUserTeam(timId, memberId);
      const res = await teamAPI.getTeamMembers(timId);
      setMembers(res?.data || []);
    } catch (err) {
      setActionError(err.message || 'Gagal mengeluarkan anggota.');
    }
  };

  const openAddMemberForm = (timId) => {
    setAddingToTeamId(timId);
    setAddingError('');
    setMemberForm({ nama_lengkap: '', asal_instansi: '', nomor_induk: '', photo: null });
  };

  const handleMemberFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setMemberForm((f) => ({ ...f, photo: files?.[0] || null }));
    } else {
      setMemberForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleAddMemberSubmit = async (e, timId) => {
    e.preventDefault();
    setAddingError('');

    if (!memberForm.nama_lengkap.trim() || !memberForm.asal_instansi.trim() || !memberForm.nomor_induk.trim()) {
      setAddingError('Semua field wajib diisi.');
      return;
    }
    if (!memberForm.photo) {
      setAddingError('Upload foto KTM/kartu pelajar terlebih dahulu.');
      return;
    }

    try {
      setAddingLoading(true);
      await teamAPI.addUserTeam({
        timId,
        namaLengkap: memberForm.nama_lengkap,
        asalInstansi: memberForm.asal_instansi,
        nomorInduk: memberForm.nomor_induk,
        photoFile: memberForm.photo,
      });
      setAddingToTeamId(null);
      const res = await teamAPI.getTeamMembers(timId);
      setMembers(res?.data || []);
    } catch (err) {
      setAddingError(err.message || 'Gagal menambahkan anggota.');
    } finally {
      setAddingLoading(false);
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
        <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 2rem' }}>
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
                    <span>
                      {t.nama_tim}{' '}
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '999px',
                          marginLeft: '0.5rem',
                          background: t.isVerified ? '#dcfce7' : '#fef9c3',
                          color: t.isVerified ? '#166534' : '#854d0e',
                        }}
                      >
                        {t.isVerified ? 'Terverifikasi' : 'Menunggu verifikasi'}
                      </span>
                    </span>
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
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                          {members.map((m) => (
                            <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.75rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={teamAPI.getKtmUrl(m.data_image)}
                                  alt={`KTM ${m.nama_lengkap}`}
                                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }}
                                />
                                <span>
                                  {m.nama_lengkap} — {m.asal_instansi} ({m.nomor_induk})
                                </span>
                              </div>
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

                      {members.length < MAX_MEMBERS_PER_TEAM && addingToTeamId !== t.id && (
                        <button
                          className="btn-secondary"
                          style={{ width: 'auto', padding: '0.4rem 1rem', marginTop: '0.5rem' }}
                          onClick={() => openAddMemberForm(t.id)}
                        >
                          + Tambah Anggota
                        </button>
                      )}
                      {members.length >= MAX_MEMBERS_PER_TEAM && (
                        <small>Tim sudah mencapai maksimal {MAX_MEMBERS_PER_TEAM} anggota.</small>
                      )}

                      {addingToTeamId === t.id && (
                        <form
                          onSubmit={(e) => handleAddMemberSubmit(e, t.id)}
                          style={{ marginTop: '0.75rem', padding: '0.75rem', border: '1px solid #eee', borderRadius: 8 }}
                        >
                          {addingError && <div className="alert-error">{addingError}</div>}
                          <div className="form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" name="nama_lengkap" value={memberForm.nama_lengkap} onChange={handleMemberFormChange} required />
                          </div>
                          <div className="form-group">
                            <label>Asal Instansi</label>
                            <input type="text" name="asal_instansi" value={memberForm.asal_instansi} onChange={handleMemberFormChange} required />
                          </div>
                          <div className="form-group">
                            <label>Nomor Induk (NIM/NISN)</label>
                            <input type="text" name="nomor_induk" value={memberForm.nomor_induk} onChange={handleMemberFormChange} required />
                          </div>
                          <div className="form-group">
                            <label>Foto KTM / Kartu Pelajar</label>
                            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={handleMemberFormChange} required />
                            <small>Format jpg/jpeg/png/webp, maks 10MB.</small>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }} disabled={addingLoading}>
                              {addingLoading ? 'Mengupload...' : 'Simpan Anggota'}
                            </button>
                            <button
                              type="button"
                              style={{ width: 'auto', padding: '0.5rem 1.5rem', background: '#f3f4f6', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                              onClick={() => setAddingToTeamId(null)}
                            >
                              Batal
                            </button>
                          </div>
                        </form>
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