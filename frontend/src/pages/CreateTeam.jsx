import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, MonitorSmartphone, TerminalSquare, LineChart } from 'lucide-react';
import { userAPI, teamAPI } from '../api/api';

// Backend TIDAK punya endpoint untuk mengambil daftar lomba, jadi daftar ini
// didefinisikan statis di sini. Harus selalu sinkron dengan:
// - data tabel `lomba` (lihat anforcom_dummy.sql)
// - validasi di backend/handlers/routes/teams/create_team.ts
//     pendidikan 1 (Sarjana)       -> lomba 2 DITOLAK (khusus SMA). Lomba 1 & 3 boleh.
//     pendidikan 2 (SMA/Sederajat) -> lomba 3 DITOLAK (khusus Sarjana). Lomba 1 & 2 boleh.
const ALL_LOMBA = [
  { id: 1, nama_lomba: 'DUC', label: 'Diponegoro UI/UX Competition', icon: MonitorSmartphone, untuk_pendidikan: [1, 2] },
  { id: 2, nama_lomba: 'DCPC', label: 'Diponegoro Competitive Programming Challenge', icon: TerminalSquare, untuk_pendidikan: [2] },
  { id: 3, nama_lomba: 'DDSC', label: 'Diponegoro Data Science Competition', icon: LineChart, untuk_pendidikan: [1] },
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
        navigate('/dashboard?tab=teams');
      }, 1500);
    } catch (err) {
      // Ini menangkap error validasi (HTTP 401/400), pesannya datang dari field `error`
      setError(err.message || 'Gagal membuat tim. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

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
            <button
              onClick={() => navigate('/dashboard')}
              className="
                inline-flex items-center gap-1.5 rounded-full
                border border-white/20 bg-white/[0.06] backdrop-blur-sm
                px-5 py-2 text-sm font-semibold text-[#F5F5DC]/90
                transition-all duration-200
                hover:border-[#EAB308]/50 hover:text-[#EAB308]
              "
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </div>
        </nav>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
            <Users className="h-7 w-7 text-[#EAB308]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5DC] sm:text-4xl">
            Buat Tim <span className="text-[#EAB308]">Baru</span>
          </h1>
          <p className="mt-2 text-sm text-[#F5F5DC]/60 max-w-lg mx-auto">
            Isi nama tim, pilih cabang lomba yang sesuai kategori pendidikanmu, lalu tambahkan anggota dari dashboard.
          </p>
        </div>

        {/* Card */}
        <div
          className="
            rounded-[28px] border border-white/15
            bg-[#F5F5DC]/[0.06] backdrop-blur-md
            p-6 sm:p-8
            shadow-2xl shadow-black/20
          "
        >
          {/* Error alert */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success alert */}
          {success && (
            <div className="mb-5 rounded-xl border border-[#EAB308]/30 bg-[#EAB308]/10 px-5 py-5 text-center">
              <CheckCircle className="mx-auto mb-3 h-10 w-10 text-[#EAB308]" />
              <p className="text-sm leading-relaxed text-[#EAB308]">
                Tim berhasil dibuat! Mengalihkan ke Dashboard untuk menambahkan anggota...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Team name input */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                Nama Tim
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Contoh: Tim Keren 2026"
                required
                className="
                  w-full rounded-xl border border-white/15
                  bg-white/[0.05] px-4 py-3
                  text-sm text-[#F5F5DC] placeholder-white/25
                  outline-none transition-all duration-200
                  focus:border-[#EAB308]/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#EAB308]/30
                "
              />
            </div>

            {/* Competition picker */}
            <div>
              <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-[#F5F5DC]/50">
                Pilih Cabang Lomba
              </label>

              {loadingUser ? (
                <p className="text-center text-sm text-[#F5F5DC]/50 py-6">Memuat pilihan lomba...</p>
              ) : lombaOptions.length === 0 ? (
                <p className="text-center text-sm text-[#F5F5DC]/50 py-6">
                  Tidak ada lomba yang tersedia untuk kategori kamu saat ini.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {lombaOptions.map((l) => {
                    const isSelected = lombaId === String(l.id);
                    const Icon = l.icon;
                    return (
                      <button
                        type="button"
                        key={l.id}
                        className={`
                          group relative flex flex-col items-center gap-3 rounded-2xl border p-6
                          text-center transition-all duration-300 cursor-pointer
                          ${isSelected
                            ? 'border-[#EAB308]/50 bg-[#EAB308]/10 shadow-lg shadow-[#EAB308]/10'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                          }
                        `}
                        onClick={() => setLombaId(String(l.id))}
                      >
                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle className="h-5 w-5 text-[#EAB308]" />
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`
                          flex h-14 w-14 items-center justify-center rounded-xl border transition-all duration-300
                          ${isSelected
                            ? 'border-[#EAB308]/30 bg-[#EAB308]/15'
                            : 'border-white/10 bg-white/[0.06] group-hover:border-[#EAB308]/25 group-hover:bg-[#EAB308]/10'
                          }
                        `}>
                          <Icon className={`
                            h-6 w-6 transition-colors duration-300
                            ${isSelected ? 'text-[#EAB308]' : 'text-[#EAB308]/60 group-hover:text-[#EAB308]'}
                          `} />
                        </div>

                        {/* Text */}
                        <div>
                          <div className={`
                            text-base font-bold transition-colors duration-300
                            ${isSelected ? 'text-[#EAB308]' : 'text-[#F5F5DC] group-hover:text-white'}
                          `}>
                            {l.nama_lomba}
                          </div>
                          <div className="mt-1 text-xs leading-relaxed text-[#F5F5DC]/40">
                            {l.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || loadingUser || !lombaId}
              className="
                w-full rounded-full bg-[#EAB308] py-3.5
                text-sm font-bold text-[#14532D]
                shadow-lg shadow-[#EAB308]/20
                transition-all duration-200
                hover:-translate-y-0.5 hover:bg-[#FACC15] hover:shadow-xl hover:shadow-[#EAB308]/30
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
              "
            >
              {loading ? 'Memproses...' : 'Buat Tim →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}