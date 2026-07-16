import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  // State untuk form "Edit Anggota"
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editForm, setEditForm] = useState({ nama_lengkap: '', asal_instansi: '', nomor_induk: '', photo: null });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Tab sidebar: 'profile' (info akun) atau 'teams' (daftar tim & anggota)
  const [activeTab, setActiveTab] = useState('profile');

  // Dropdown "Pengaturan" di kartu Profil Saya
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Form ganti password (dibuka dari dropdown Pengaturan)
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ old_pass: '', new_pass: '', confirm_pass: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

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
      console.error('Logout request failed:', err);
    } finally {
      navigate('/login');
    }
  };

  const handleToggleMembers = async (timId) => {
    setActionError('');
    setAddingToTeamId(null);
    setEditingMemberId(null);
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
    setEditingMemberId(null);
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

  const openEditMemberForm = (member) => {
    setEditingMemberId(member.id);
    setEditError('');
    setAddingToTeamId(null);
    setEditForm({
      nama_lengkap: member.nama_lengkap || '',
      asal_instansi: member.asal_instansi || '',
      nomor_induk: member.nomor_induk || '',
      photo: null,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setEditForm((f) => ({ ...f, photo: files?.[0] || null }));
    } else {
      setEditForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleEditMemberSubmit = async (e, timId, member) => {
    e.preventDefault();
    setEditError('');

    if (!editForm.nama_lengkap.trim() || !editForm.asal_instansi.trim() || !editForm.nomor_induk.trim()) {
      setEditError('Semua field wajib diisi.');
      return;
    }

    // editCase di backend hanya mengubah satu field per panggilan, jadi kita
    // panggil endpoint yang sesuai satu per satu, hanya untuk field yang benar-benar berubah.
    const calls = [];
    if (editForm.nama_lengkap.trim() !== member.nama_lengkap) {
      calls.push(() => teamAPI.editUserTeamNama(timId, member.id, editForm.nama_lengkap.trim()));
    }
    if (editForm.asal_instansi.trim() !== member.asal_instansi) {
      calls.push(() => teamAPI.editUserTeamAsalInstansi(timId, member.id, editForm.asal_instansi.trim()));
    }
    if (editForm.nomor_induk.trim() !== member.nomor_induk) {
      calls.push(() => teamAPI.editUserTeamNomorInduk(timId, member.id, editForm.nomor_induk.trim()));
    }
    if (editForm.photo) {
      calls.push(() => teamAPI.editUserTeamFoto(timId, member.id, editForm.photo));
    }

    if (calls.length === 0) {
      setEditingMemberId(null);
      return;
    }

    try {
      setEditLoading(true);
      for (const call of calls) {
        // eslint-disable-next-line no-await-in-loop
        await call();
      }
      setEditingMemberId(null);
      const res = await teamAPI.getTeamMembers(timId);
      setMembers(res?.data || []);
    } catch (err) {
      setEditError(err.message || 'Gagal menyimpan perubahan anggota.');
    } finally {
      setEditLoading(false);
    }
  };

  const openPasswordForm = () => {
    setShowSettingsMenu(false);
    setShowPasswordForm(true);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordForm({ old_pass: '', new_pass: '', confirm_pass: '' });
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((f) => ({ ...f, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.old_pass || !passwordForm.new_pass || !passwordForm.confirm_pass) {
      setPasswordError('Semua field wajib diisi.');
      return;
    }
    if (passwordForm.new_pass !== passwordForm.confirm_pass) {
      setPasswordError('Konfirmasi password baru tidak cocok.');
      return;
    }

    try {
      setPasswordLoading(true);
      // Backend: POST /api/user/edit {password:true, old_pass, new_pass}
      const res = await userAPI.updatePassword(passwordForm.old_pass, passwordForm.new_pass);
      setPasswordSuccess(res?.message || 'Password berhasil diganti.');
      setPasswordForm({ old_pass: '', new_pass: '', confirm_pass: '' });
    } catch (err) {
      // Pesan error persis dari backend, misal "Password anda salah"
      setPasswordError(err.message || 'Gagal mengganti password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const avatarInitial = (user?.username || 'U').trim().charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="app-shell" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: 'var(--app-text-muted)' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell" style={{ padding: '2rem', maxWidth: 480, margin: '0 auto' }}>
        <div className="alert-error">{error}</div>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link to="/" className="app-logo">ANFORCOM<span className="app-logo-year">/26</span></Link>
          <div className="app-nav-user" style={{ cursor: 'default' }}>
            <span className="app-nav-avatar">{avatarInitial}</span>
            {user?.username || 'User'}
          </div>
        </div>
      </nav>

      <div className="dashboard-body">
        <aside className="dashboard-sidebar">
          <div className="sidebar-avatar">{avatarInitial}</div>
          <div>
            <div className="sidebar-username">{user?.username || 'User'}</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
              <span className="sidebar-badge">
                {user?.pendidikan_id === 1 ? 'SARJANA' : user?.pendidikan_id === 2 ? 'SMA/SEDERAJAT' : 'BELUM DIATUR'}
              </span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button
              className={`sidebar-nav-item${activeTab === 'profile' ? ' active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profil Saya
            </button>
            <button
              className={`sidebar-nav-item${activeTab === 'teams' ? ' active' : ''}`}
              onClick={() => setActiveTab('teams')}
            >
              🚩 Tim Saya
            </button>
            <div className="my-2 border-t border-white/10" />
            <button className="sidebar-nav-item" onClick={() => navigate('/create-team')}>➕ Buat Tim Baru</button>
            <button className="sidebar-nav-item danger" onClick={handleLogout}>🚪 Keluar</button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'profile' && (
          <div className="dashboard-card">
            <div className="dashboard-card-head relative">
              <h2>Profil Saya</h2>
              <div className="relative">
                <button
                  className="app-btn app-btn-ghost app-btn-sm"
                  onClick={() => setShowSettingsMenu((v) => !v)}
                >
                  ⚙️ Pengaturan
                </button>

                {showSettingsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSettingsMenu(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#101832] shadow-xl">
                      <button
                        className="block w-full px-4 py-2.5 text-left text-sm text-white/40 cursor-not-allowed"
                        disabled
                        title="Fitur belum tersedia (backend belum diimplementasikan)"
                      >
                        Ganti Username
                      </button>
                      <button
                        className="block w-full px-4 py-2.5 text-left text-sm text-[var(--app-text)] hover:bg-white/5"
                        onClick={openPasswordForm}
                      >
                        Ganti Password
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
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
                <span className="info-value">{user?.no_tlp || 'Belum diatur'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tingkat Pendidikan</span>
                <span className="info-value">{user?.pendidikan_id === 1 ? 'Sarjana' : user?.pendidikan_id === 2 ? 'SMA/Sederajat' : 'Belum diatur'}</span>
              </div>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="member-form">
                <div className="dashboard-card-head" style={{ marginBottom: '1rem' }}>
                  <h3>Ganti Password</h3>
                  <button
                    type="button"
                    className="app-btn app-btn-ghost app-btn-sm"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Tutup
                  </button>
                </div>

                {passwordError && <div className="alert-error">{passwordError}</div>}
                {passwordSuccess && <div className="alert-success">✅ {passwordSuccess}</div>}

                <div className="form-group">
                  <label>Password Lama</label>
                  <input type="password" name="old_pass" value={passwordForm.old_pass} onChange={handlePasswordFormChange} required />
                </div>
                <div className="form-group">
                  <label>Password Baru</label>
                  <input type="password" name="new_pass" value={passwordForm.new_pass} onChange={handlePasswordFormChange} required minLength={6} />
                </div>
                <div className="form-group">
                  <label>Konfirmasi Password Baru</label>
                  <input type="password" name="confirm_pass" value={passwordForm.confirm_pass} onChange={handlePasswordFormChange} required minLength={6} />
                </div>
                <button type="submit" className="app-btn app-btn-solid app-btn-sm" disabled={passwordLoading}>
                  {passwordLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            )}
          </div>
          )}

          {activeTab === 'teams' && (
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <h3>Tim Saya</h3>
            </div>

            {actionError && <div className="alert-error">{actionError}</div>}

            {teams.length === 0 ? (
              <p style={{ color: 'var(--app-text-muted)' }}>Kamu belum punya tim. Yuk buat tim baru!</p>
            ) : (
              <ul className="team-list">
                {teams.map((t) => (
                  <li key={t.id} className="team-row">
                    <div className="team-row-head">
                      <span>
                        <span className="team-name">{t.nama_tim}</span>
                        <span className={`team-status ${t.isVerified ? 'verified' : 'pending'}`}>
                          {t.isVerified ? 'Terverifikasi' : 'Menunggu verifikasi'}
                        </span>
                      </span>
                      <div className="team-row-actions">
                        <button
                          className="app-btn app-btn-ghost app-btn-sm"
                          onClick={() => handleToggleMembers(t.id)}
                        >
                          {expandedTeamId === t.id ? 'Tutup' : 'Lihat Anggota'}
                        </button>
                        <button
                          className="app-btn app-btn-danger app-btn-sm"
                          onClick={() => handleDeleteTeam(t.id)}
                        >
                          Hapus Tim
                        </button>
                      </div>
                    </div>

                    {expandedTeamId === t.id && (
                      <div>
                        {membersLoading ? (
                          <p style={{ color: 'var(--app-text-muted)', marginTop: '0.75rem' }}>Memuat anggota...</p>
                        ) : members.length === 0 ? (
                          <p style={{ color: 'var(--app-text-muted)', marginTop: '0.75rem' }}>Belum ada anggota terdaftar di tim ini.</p>
                        ) : (
                          <ul className="member-list">
                            {members.map((m) => (
                              <li key={m.id} className="member-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                                  <div className="member-row-info">
                                    <img
                                      src={teamAPI.getKtmUrl(m.data_image)}
                                      alt={`KTM ${m.nama_lengkap}`}
                                      className="member-avatar"
                                    />
                                    <span>
                                      {m.nama_lengkap} — {m.asal_instansi} ({m.nomor_induk})
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                    <button
                                      className="app-btn app-btn-ghost app-btn-sm"
                                      onClick={() => (editingMemberId === m.id ? setEditingMemberId(null) : openEditMemberForm(m))}
                                    >
                                      {editingMemberId === m.id ? 'Tutup' : 'Edit'}
                                    </button>
                                    <button
                                      className="app-btn app-btn-danger app-btn-sm"
                                      onClick={() => handleRemoveMember(t.id, m.id)}
                                    >
                                      Keluarkan
                                    </button>
                                  </div>
                                </div>

                                {editingMemberId === m.id && (
                                  <form
                                    onSubmit={(e) => handleEditMemberSubmit(e, t.id, m)}
                                    className="member-form"
                                  >
                                    {editError && <div className="alert-error">{editError}</div>}
                                    <div className="form-group">
                                      <label>Nama Lengkap</label>
                                      <input type="text" name="nama_lengkap" value={editForm.nama_lengkap} onChange={handleEditFormChange} required />
                                    </div>
                                    <div className="form-group">
                                      <label>Asal Instansi</label>
                                      <input type="text" name="asal_instansi" value={editForm.asal_instansi} onChange={handleEditFormChange} required />
                                    </div>
                                    <div className="form-group">
                                      <label>Nomor Induk (NIM/NISN)</label>
                                      <input type="text" name="nomor_induk" value={editForm.nomor_induk} onChange={handleEditFormChange} required />
                                    </div>
                                    <div className="form-group">
                                      <label>Ganti Foto KTM / Kartu Pelajar (opsional)</label>
                                      <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={handleEditFormChange} />
                                      <small>Kosongkan kalau tidak ingin mengganti foto. Format jpg/jpeg/png/webp, maks 10MB.</small>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button type="submit" className="app-btn app-btn-solid app-btn-sm" disabled={editLoading}>
                                        {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                      </button>
                                      <button
                                        type="button"
                                        className="app-btn app-btn-ghost app-btn-sm"
                                        onClick={() => setEditingMemberId(null)}
                                      >
                                        Batal
                                      </button>
                                    </div>
                                  </form>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {members.length < MAX_MEMBERS_PER_TEAM && addingToTeamId !== t.id && (
                          <button
                            className="app-btn app-btn-ghost app-btn-sm"
                            style={{ marginTop: '0.75rem' }}
                            onClick={() => openAddMemberForm(t.id)}
                          >
                            + Tambah Anggota
                          </button>
                        )}
                        {members.length >= MAX_MEMBERS_PER_TEAM && (
                          <small style={{ color: 'var(--app-text-muted)', display: 'block', marginTop: '0.75rem' }}>
                            Tim sudah mencapai maksimal {MAX_MEMBERS_PER_TEAM} anggota.
                          </small>
                        )}

                        {addingToTeamId === t.id && (
                          <form
                            onSubmit={(e) => handleAddMemberSubmit(e, t.id)}
                            className="member-form"
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
                              <button type="submit" className="app-btn app-btn-solid app-btn-sm" disabled={addingLoading}>
                                {addingLoading ? 'Mengupload...' : 'Simpan Anggota'}
                              </button>
                              <button
                                type="button"
                                className="app-btn app-btn-ghost app-btn-sm"
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
          )}
        </main>
      </div>
    </div>
  );
}