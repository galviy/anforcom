import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../api/api';

const PING_INTERVAL_MS = 15 * 60 * 1000; // 15 menit

// Prefix path yang wajib login (samain dengan yang dibungkus <RequireAuth />
// di App.jsx). Dipakai buat mutusin apakah perlu redirect paksa ke landing
// page saat ping gagal, atau cukup didiamkan (halaman publik).
const PROTECTED_PREFIXES = ['/dashboard', '/create-team'];

/**
 * Heartbeat sesi GLOBAL — dipasang sekali di App.jsx (di luar <Routes>),
 * jalan di SEMUA halaman (termasuk landing page, competition detail, dll),
 * bukan cuma halaman protected.
 *
 * Kenapa perlu global, bukan cuma di RequireAuth.jsx?
 * User yang sudah login tapi lagi browsing halaman publik (mis. landing
 * page) sebelumnya TIDAK ikut ke-ping sama sekali, karena heartbeat lama
 * cuma jalan di dalam RequireAuth (yang hanya membungkus /dashboard,
 * /create-team). Akibatnya sesi tetap berjalan ke arah expired walau
 * tab-nya masih terbuka & user login, cuma karena dia gak sedang di
 * halaman dashboard.
 *
 * Kalau ping gagal (sesi habis/AFK) SELAGI user ada di halaman protected,
 * langsung redirect ke landing page — sama seperti perilaku lama. Kalau
 * gagal selagi di halaman publik, didiamkan saja (gak ada akses yang perlu
 * diamankan di sana).
 */
export default function SessionHeartbeat() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      userAPI.ping().catch(() => {
        const isOnProtectedPage = PROTECTED_PREFIXES.some((p) => window.location.pathname.startsWith(p));
        if (isOnProtectedPage) {
          navigate('/', { replace: true });
        }
      });
    }, PING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}