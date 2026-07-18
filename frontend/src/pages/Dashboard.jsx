import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Users, Plus, LogOut, Settings, FileText, Trash2, Edit, X, AlertCircle, CheckCircle } from 'lucide-react';
import { userAPI, teamAPI, authAPI } from '../api/api';
import PasswordInput from '../components/PasswordInput';

const MAX_MEMBERS_PER_TEAM = 3;

// tipe_lomba (kolom `tim_lomba` di DB) -> emoji & nama singkat, biar user
// langsung tau tim itu ikut bidang apa cuma dari sekilas lihat daftar tim.
// Harus sinkron sama ALL_LOMBA di CreateTeam.jsx (id 1=DUC, 2=DCPC, 3=DDSC).
const LOMBA_INFO = {
  1: { emoji: '🎨', label: 'DUC — UI/UX' },
  2: { emoji: '💻', label: 'DCPC — Competitive Programming' },
  3: { emoji: '📊', label: 'DDSC — Data Science' },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Selamat pagi';
  if (hour >= 11 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  // Tab sidebar: 'profile' (info akun) atau 'teams' (daftar tim & anggota).
  // Default ke 'teams' kalau datang dari redirect setelah membuat tim baru
  // (CreateTeam.jsx -> navigate('/dashboard?tab=teams')).
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'teams' ? 'teams' : 'profile');

  // State untuk upload/preview proposal PDF tim.
  // Backend sekarang mengembalikan field `proposal` & `tipe_lomba` langsung dari
  // getMyTeams() (lihat show_team.ts), jadi tidak perlu state terpisah untuk
  // "mengingat" nama file — cukup refresh daftar tim setelah upload berhasil.
  const [proposalOpenTeamId, setProposalOpenTeamId] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);
  const [proposalUploading, setProposalUploading] = useState(false);
  const [proposalError, setProposalError] = useState('');
  const [viewingProposalTeamId, setViewingProposalTeamId] = useState(null);

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
        // refreshTeams() menelan errornya sendiri, jadi kalau sampai ke sini
        // pasti getMe() yang gagal (belum login / sesi habis) -> landing page.
        navigate('/', { replace: true });
        return;
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
    setProposalOpenTeamId(null);
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
      if (proposalOpenTeamId === timId) setProposalOpenTeamId(null);
      if (viewingProposalTeamId === timId) setViewingProposalTeamId(null);
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

  const openProposalForm = (timId) => {
    setProposalOpenTeamId(timId);
    setProposalError('');
    setProposalFile(null);
    setViewingProposalTeamId(null);
  };

  const handleProposalSubmit = async (e, timId) => {
    e.preventDefault();
    setProposalError('');

    if (!proposalFile) {
      setProposalError('Pilih file PDF terlebih dahulu.');
      return;
    }
    if (proposalFile.type !== 'application/pdf') {
      setProposalError('File harus berformat PDF.');
      return;
    }

    try {
      setProposalUploading(true);
      await teamAPI.addProposal(timId, proposalFile);
      await refreshTeams();
      setProposalOpenTeamId(null);
      setProposalFile(null);
      setViewingProposalTeamId(timId);
    } catch (err) {
      // Pesan persis dari backend, mis. alasan tim tidak eligible upload proposal
      setProposalError(err.message || 'Gagal upload proposal.');
    } finally {
      setProposalUploading(false);
    }
  };

  const avatarInitial = (user?.username || 'U').trim().charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14532D] flex items-center justify-center">
        <p className="text-[#F5F5DC]/60 text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#14532D] flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[28px] border border-white/15 bg-[#F5F5DC]/[0.06] backdrop-blur-md p-8 text-center shadow-2xl shadow-black/20">
          <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-full bg-[#EAB308] py-3.5 text-sm font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14532D] relative overflow-hidden">

      {/* ── Decorative background blobs ── */}
      <div
        className="pointer-events-none absolute -top-40 -right-32"
        aria-hidden="true"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(234,179,8,0.05) 0%, transparent 70%)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-40"
        aria-hidden="true"
        style={{
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(0,128,128,0.04) 0%, transparent 70%)',
        }}
      />

      {/* ── Top navigation bar ── */}
      <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-5 pb-2">
        <nav className="relative mx-auto max-w-6xl rounded-[32px] border-l-4 border-[#EAB308] bg-[#14532D]/60 backdrop-blur-md shadow-lg shadow-black/15 transition-all duration-300">
          <div className="flex items-center justify-between px-5 py-3 sm:px-7 sm:py-3.5">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 text-[#F5F5DC] no-underline rounded-lg"
            >
              <span className="text-lg font-bold tracking-wide sm:text-xl">
                ANFORCOM <span className="font-semibold text-[#EAB308]">2026</span>
              </span>
            </Link>
            <div
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-sm text-[#F5F5DC]/90"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#EAB308] to-[#65A30D] text-xs font-bold text-[#14532D]">
                {avatarInitial}
              </span>
              {user?.username || 'User'}
            </div>
          </div>
        </nav>
      </div>

      {/* ── Dashboard body ── */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-6 lg:items-start">

        {/* ── Sidebar ── */}
        <aside className="mb-6 lg:mb-0 lg:sticky lg:top-[80px] rounded-[24px] border border-white/15 bg-[#F5F5DC]/[0.06] backdrop-blur-md p-6 flex flex-col items-center gap-5 shadow-xl shadow-black/10">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#EAB308] to-[#65A30D] text-3xl font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20">
            {avatarInitial}
          </div>
          {/* Username */}
          <div className="text-center">
            <div className="text-lg font-bold text-[#F5F5DC]">{user?.username || 'User'}</div>
            <div className="mt-1.5 flex justify-center">
              <span className="rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#EAB308]">
                {user?.pendidikan_id === 1 ? 'SARJANA' : user?.pendidikan_id === 2 ? 'SMA/SEDERAJAT' : 'BELUM DIATUR'}
              </span>
            </div>
          </div>
          {/* Nav items */}
          <nav className="w-full flex flex-col gap-1">
            <button
              className={`w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-left ${
                activeTab === 'profile'
                  ? 'bg-[#EAB308]/15 text-[#EAB308] font-semibold'
                  : 'text-[#F5F5DC]/60 hover:text-[#F5F5DC] hover:bg-white/[0.05]'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4" />
              <span>Profil Saya</span>
            </button>
            <button
              className={`w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 text-left ${
                activeTab === 'teams'
                  ? 'bg-[#EAB308]/15 text-[#EAB308] font-semibold'
                  : 'text-[#F5F5DC]/60 hover:text-[#F5F5DC] hover:bg-white/[0.05]'
              }`}
              onClick={() => setActiveTab('teams')}
            >
              <Users className="h-4 w-4" />
              <span>Tim Saya</span>
            </button>
            <div className="my-2 border-t border-white/10" />
            <button
              className="w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-[#F5F5DC]/60 hover:text-[#F5F5DC] hover:bg-white/[0.05] transition-all duration-200 text-left"
              onClick={() => navigate('/create-team')}
            >
              <Plus className="h-4 w-4" />
              <span>Buat Tim Baru</span>
            </button>
            <button
              className="w-full flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-left"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex flex-col gap-6">

          {/* ── Welcome message ── */}
          <div className="px-1">
            <h1 className="text-2xl font-bold text-[#F5F5DC] sm:text-3xl">
              {getGreeting()}, <span className="text-[#EAB308]">{user?.username || 'Sobat Anforcom'}</span> 👋
            </h1>
            <p className="mt-1 text-sm text-[#F5F5DC]/50">
              {teams.length === 0
                ? 'Kamu belum tergabung di tim manapun — yuk buat tim untuk mulai ikut kompetisi.'
                : `Kamu tergabung di ${teams.length} tim. Semoga sukses di Anforcom 2026!`}
            </p>
          </div>

          {/* ====== PROFILE TAB ====== */}
          {activeTab === 'profile' && (
          <div className="rounded-[24px] border border-white/15 bg-[#F5F5DC]/[0.06] backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <h2 className="text-xl font-bold text-[#F5F5DC] sm:text-2xl">Profil Saya</h2>
              <div className="relative">
                <button
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#F5F5DC]/80 transition-all duration-200 hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                  onClick={() => setShowSettingsMenu((v) => !v)}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Pengaturan</span>
                </button>

                {showSettingsMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSettingsMenu(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/15 bg-[#14532D]/95 backdrop-blur-md shadow-2xl shadow-black/30">
                      <button
                        className="block w-full px-4 py-2.5 text-left text-sm text-white/30 cursor-not-allowed"
                        disabled
                        title="Fitur belum tersedia (backend belum diimplementasikan)"
                      >
                        Ganti Username
                      </button>
                      <button
                        className="block w-full px-4 py-2.5 text-left text-sm text-[#F5F5DC]/80 hover:bg-white/[0.06] hover:text-[#EAB308] transition-colors"
                        onClick={openPasswordForm}
                      >
                        Ganti Password
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5F5DC]/40">Username</span>
                <span className="text-sm font-medium text-[#F5F5DC]">{user?.username}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5F5DC]/40">Email</span>
                <span className="text-sm font-medium text-[#F5F5DC]">{user?.email}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5F5DC]/40">No. Telepon</span>
                <span className="text-sm font-medium text-[#F5F5DC]">{user?.no_tlp || 'Belum diatur'}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#F5F5DC]/40">Tingkat Pendidikan</span>
                <span className="text-sm font-medium text-[#F5F5DC]">{user?.pendidikan_id === 1 ? 'Sarjana' : user?.pendidikan_id === 2 ? 'SMA/Sederajat' : 'Belum diatur'}</span>
              </div>
            </div>

            {/* Change password form */}
            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="mt-6 rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <h3 className="text-base font-bold text-[#F5F5DC]">Ganti Password</h3>
                  <button
                    type="button"
                    className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-[#F5F5DC]/70 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Tutup
                  </button>
                </div>

                {passwordError && <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{passwordError}</div>}
                {passwordSuccess && <div className="mb-4 rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-4 py-3 text-sm text-[#EAB308]">✅ {passwordSuccess}</div>}

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Password Lama</label>
                    <PasswordInput name="old_pass" value={passwordForm.old_pass} onChange={handlePasswordFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Password Baru</label>
                    <PasswordInput name="new_pass" value={passwordForm.new_pass} onChange={handlePasswordFormChange} required minLength={6} className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Konfirmasi Password Baru</label>
                    <PasswordInput name="confirm_pass" value={passwordForm.confirm_pass} onChange={handlePasswordFormChange} required minLength={6} className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                  </div>
                </div>
                <button type="submit" className="mt-4 rounded-full bg-[#EAB308] px-6 py-2.5 text-sm font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" disabled={passwordLoading}>
                  {passwordLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </form>
            )}
          </div>
          )}

          {/* ====== TEAMS TAB ====== */}
          {activeTab === 'teams' && (
          <div className="rounded-[24px] border border-white/15 bg-[#F5F5DC]/[0.06] backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/10">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <h3 className="text-xl font-bold text-[#F5F5DC] sm:text-2xl">Tim Saya</h3>
            </div>

            {actionError && <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{actionError}</div>}

            {teams.length === 0 ? (
              <p className="text-sm text-[#F5F5DC]/50">Kamu belum punya tim. Yuk buat tim baru!</p>
            ) : (
              <ul className="list-none flex flex-col gap-4">
                {teams.map((t) => (
                  <li key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <span className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-lg leading-none"
                          title={LOMBA_INFO[t.tipe_lomba]?.label || 'Cabang lomba tidak diketahui'}
                          aria-label={LOMBA_INFO[t.tipe_lomba]?.label || 'Cabang lomba tidak diketahui'}
                        >
                          {LOMBA_INFO[t.tipe_lomba]?.emoji || '🏆'}
                        </span>
                        <span className="font-semibold text-[#F5F5DC]">{t.nama_tim}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          t.isVerified
                            ? 'bg-[#EAB308]/15 text-[#EAB308] border border-[#EAB308]/25'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-400/25'
                        }`}>
                          {t.isVerified ? 'Terverifikasi' : 'Menunggu verifikasi'}
                        </span>
                      </span>
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold text-[#F5F5DC]/80 transition-all duration-200 hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                          onClick={() => handleToggleMembers(t.id)}
                        >
                          {expandedTeamId === t.id ? 'Tutup' : 'Lihat Anggota'}
                        </button>
                        {t.tipe_lomba === 1 && (
                          <button
                            className="app-btn app-btn-ghost app-btn-sm"
                            onClick={() => (proposalOpenTeamId === t.id ? setProposalOpenTeamId(null) : openProposalForm(t.id))}
                          >
                            📄 Proposal
                          </button>
                        )}
                        <button
                          className="inline-flex items-center gap-1 rounded-full border border-red-400/25 bg-red-500/10 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/20"
                          onClick={() => handleDeleteTeam(t.id)}
                        >
                          Hapus Tim
                        </button>
                      </div>
                    </div>

                    {/* ── Proposal form ── */}
                    {proposalOpenTeamId === t.id && (
                      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                          <h3 className="text-sm font-bold text-[#F5F5DC]">Proposal Tim (PDF)</h3>
                          <button
                            type="button"
                            className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-[#F5F5DC]/70 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                            onClick={() => setProposalOpenTeamId(null)}
                          >
                            Tutup
                          </button>
                        </div>

                        {proposalError && <div className="alert-error">{proposalError}</div>}
                        {t.proposal && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--app-text-muted)', marginBottom: '0.75rem' }}>
                            Proposal sudah pernah diupload. Upload file baru untuk menggantinya.
                          </p>
                        )}

                        <form onSubmit={(e) => handleProposalSubmit(e, t.id)}>
                          <div className="mb-3">
                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">File Proposal</label>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => setProposalFile(e.target.files?.[0] || null)}
                              required
                              className="w-full text-sm text-[#F5F5DC]/70 file:mr-3 file:rounded-full file:border file:border-white/15 file:bg-white/[0.06] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F5F5DC]/80 file:transition-all hover:file:border-[#EAB308]/40 hover:file:text-[#EAB308] file:cursor-pointer"
                            />
                            <small className="text-xs text-[#F5F5DC]/40 mt-1 block">Format PDF, maks 50MB.</small>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <button type="submit" className="rounded-full bg-[#EAB308] px-5 py-2 text-xs font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" disabled={proposalUploading}>
                              {proposalUploading ? 'Mengupload...' : 'Upload Proposal'}
                            </button>
                            {t.proposal && (
                              <button
                                type="button"
                                className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#F5F5DC]/80 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                                onClick={() => setViewingProposalTeamId(viewingProposalTeamId === t.id ? null : t.id)}
                              >
                                {viewingProposalTeamId === t.id ? 'Sembunyikan Preview' : 'Lihat Proposal'}
                              </button>
                            )}
                          </div>
                        </form>

                        {viewingProposalTeamId === t.id && t.proposal && (
                          <embed
                            src={teamAPI.getProposalUrl(t.proposal)}
                            type="application/pdf"
                            style={{ width: '100%', height: '480px', marginTop: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                        )}
                      </div>
                    )}

                    {/* ── Members panel ── */}
                    {expandedTeamId === t.id && (
                      <div className="mt-4">
                        {membersLoading ? (
                          <p className="text-sm text-[#F5F5DC]/50">Memuat anggota...</p>
                        ) : members.length === 0 ? (
                          <p className="text-sm text-[#F5F5DC]/50">Belum ada anggota terdaftar di tim ini.</p>
                        ) : (
                          <ul className="list-none flex flex-col gap-3">
                            {members.map((m) => (
                              <li key={m.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex flex-col gap-3">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <div className="flex items-center gap-3 text-sm">
                                    <img
                                      src={teamAPI.getKtmUrl(m.data_image)}
                                      alt={`KTM ${m.nama_lengkap}`}
                                      className="h-11 w-11 rounded-lg object-cover border border-white/10"
                                    />
                                    <span className="text-[#F5F5DC]">
                                      {m.nama_lengkap} — {m.asal_instansi} ({m.nomor_induk})
                                    </span>
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-[#F5F5DC]/80 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                                      onClick={() => (editingMemberId === m.id ? setEditingMemberId(null) : openEditMemberForm(m))}
                                    >
                                      {editingMemberId === m.id ? <X className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
                                      <span>{editingMemberId === m.id ? 'Tutup' : 'Edit'}</span>
                                    </button>
                                    <button
                                      className="inline-flex items-center gap-1 rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/20"
                                      onClick={() => handleRemoveMember(t.id, m.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>Keluarkan</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Edit member form */}
                                {editingMemberId === m.id && (
                                  <form
                                    onSubmit={(e) => handleEditMemberSubmit(e, t.id, m)}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
                                  >
                                    {editError && <div className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{editError}</div>}
                                    <div className="space-y-3">
                                      <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Nama Lengkap</label>
                                        <input type="text" name="nama_lengkap" value={editForm.nama_lengkap} onChange={handleEditFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                                      </div>
                                      <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Asal Instansi</label>
                                        <input type="text" name="asal_instansi" value={editForm.asal_instansi} onChange={handleEditFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                                      </div>
                                      <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Nomor Induk (NIM/NISN)</label>
                                        <input type="text" name="nomor_induk" value={editForm.nomor_induk} onChange={handleEditFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                                      </div>
                                      <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Ganti Foto KTM / Kartu Pelajar (opsional)</label>
                                        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={handleEditFormChange} className="w-full text-sm text-[#F5F5DC]/70 file:mr-3 file:rounded-full file:border file:border-white/15 file:bg-white/[0.06] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F5F5DC]/80 file:transition-all hover:file:border-[#EAB308]/40 hover:file:text-[#EAB308] file:cursor-pointer" />
                                        <small className="text-xs text-[#F5F5DC]/40 mt-1 block">Kosongkan kalau tidak ingin mengganti foto. Format jpg/jpeg/png/webp, maks 10MB.</small>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                      <button type="submit" className="rounded-full bg-[#EAB308] px-5 py-2 text-xs font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" disabled={editLoading}>
                                        {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                      </button>
                                      <button
                                        type="button"
                                        className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#F5F5DC]/70 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
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

                        {/* Add member button */}
                        {members.length < MAX_MEMBERS_PER_TEAM && addingToTeamId !== t.id && (
                          <button
                            className="inline-flex items-center gap-1.5 mt-4 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#F5F5DC]/80 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
                            onClick={() => openAddMemberForm(t.id)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Tambah Anggota</span>
                          </button>
                        )}
                        {members.length >= MAX_MEMBERS_PER_TEAM && (
                          <small className="block mt-4 text-xs text-[#F5F5DC]/40">
                            Tim sudah mencapai maksimal {MAX_MEMBERS_PER_TEAM} anggota.
                          </small>
                        )}

                        {/* Add member form */}
                        {addingToTeamId === t.id && (
                          <form
                            onSubmit={(e) => handleAddMemberSubmit(e, t.id)}
                            className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
                          >
                            {addingError && <div className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{addingError}</div>}
                            <div className="space-y-3">
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Nama Lengkap</label>
                                <input type="text" name="nama_lengkap" value={memberForm.nama_lengkap} onChange={handleMemberFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Asal Instansi</label>
                                <input type="text" name="asal_instansi" value={memberForm.asal_instansi} onChange={handleMemberFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Nomor Induk (NIM/NISN)</label>
                                <input type="text" name="nomor_induk" value={memberForm.nomor_induk} onChange={handleMemberFormChange} required className="w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-3 text-sm text-[#F5F5DC] outline-none transition-all duration-200 focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30" />
                              </div>
                              <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">Foto KTM / Kartu Pelajar</label>
                                <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={handleMemberFormChange} required className="w-full text-sm text-[#F5F5DC]/70 file:mr-3 file:rounded-full file:border file:border-white/15 file:bg-white/[0.06] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#F5F5DC]/80 file:transition-all hover:file:border-[#EAB308]/40 hover:file:text-[#EAB308] file:cursor-pointer" />
                                <small className="text-xs text-[#F5F5DC]/40 mt-1 block">Format jpg/jpeg/png/webp, maks 10MB.</small>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4 flex-wrap">
                              <button type="submit" className="rounded-full bg-[#EAB308] px-5 py-2 text-xs font-bold text-[#14532D] shadow-lg shadow-[#EAB308]/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#FACC15] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" disabled={addingLoading}>
                                {addingLoading ? 'Mengupload...' : 'Simpan Anggota'}
                              </button>
                              <button
                                type="button"
                                className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-[#F5F5DC]/70 transition-all hover:border-[#EAB308]/40 hover:text-[#EAB308]"
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