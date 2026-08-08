import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { userAPI } from '../api/api';

/**
 * Route guard buat halaman yang wajib login (dashboard, create-team, dst).
 * Dipasang di App.jsx sebagai parent route lewat <Outlet/>, jadi nambah
 * halaman protected baru tinggal taruh di bawah <Route element={<RequireAuth />}>,
 * gak perlu tulis ulang logic cek sesi di tiap halaman.
 *
 * Alurnya:
 * - 'checking' -> lagi nge-cek cookie sesi ke /user/me, tampilkan "Memuat..."
 * - 'guest'    -> sesi tidak valid -> redirect ke landing page ("/")
 * - 'authed'   -> render halaman aslinya lewat <Outlet/>
 *
 * NOTE: heartbeat ping buat perpanjang sesi SEKARANG global, bukan di sini
 * lagi — lihat components/SessionHeartbeat.jsx yang dipasang di App.jsx.
 * Alasannya: kalau cuma di RequireAuth, user yang login tapi lagi di
 * halaman publik (landing page, dst) gak ikut ke-ping sama sekali, jadi
 * sesinya tetap jalan ke arah expired walau tab-nya masih terbuka.
 */
export default function RequireAuth() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    userAPI.getMe()
      .then(() => {
        if (!cancelled) setStatus('authed');
      })
      .catch(() => {
        if (!cancelled) setStatus('guest');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14532D]">
        <p className="text-sm text-[#F5F5DC]/60">Memuat...</p>
      </div>
    );
  }

  if (status === 'guest') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}