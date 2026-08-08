import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// Sistem toast notification GLOBAL — dipasang sekali di App.jsx (di luar
// <Routes>), dipanggil dari mana pun (Dashboard.jsx, CreateTeam.jsx, dst)
// lewat showToast(message).
//
// Kenapa lewat sessionStorage + custom event (bukan React Context biasa)?
// Karena beberapa aksi (mis. buat tim baru) diikuti navigate() ke halaman
// lain SEBELUM toast-nya kelihatan sempat muncul. Kalau cuma pakai state
// React biasa, toast itu bakal ketimpa/ilang pas komponennya di-unmount saat
// pindah halaman. Dengan nulis ke sessionStorage dulu, toast yang "ketunda"
// itu tetap kebaca & ditampilkan begitu halaman baru selesai mount — baik
// itu navigasi client-side (React Router) maupun full page reload.
const TOAST_STORAGE_KEY = 'anforcom_pending_toast';
const TOAST_EVENT = 'anforcom:toast';

/**
 * Panggil ini di mana pun setelah aksi sukses (upload, hapus, buat tim, dst).
 * @param {string} message - Pesan yang mau ditampilkan (biasanya `response.message` dari backend)
 * @param {'success'|'error'} type
 */
export function showToast(message, type = 'success') {
  if (!message) return;
  const payload = { message, type, id: Date.now() };
  try {
    sessionStorage.setItem(TOAST_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // sessionStorage tidak tersedia — toast tetap bisa muncul kalau halaman
    // gak di-reload, lewat event langsung di bawah.
  }
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }));
}

/**
 * Pasang SEKALI di root app (App.jsx), di luar <Routes> supaya toast tetap
 * jalan lintas halaman.
 */
export default function ToastHost() {
  const [toast, setToast] = useState(null);

  // Begitu halaman/komponen ini mount, cek dulu ada toast "ketunda" dari
  // sebelum reload/navigasi.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(TOAST_STORAGE_KEY);
      if (raw) {
        setToast(JSON.parse(raw));
        sessionStorage.removeItem(TOAST_STORAGE_KEY);
      }
    } catch {
      // no-op
    }

    const onToastEvent = (e) => setToast(e.detail);
    window.addEventListener(TOAST_EVENT, onToastEvent);
    return () => window.removeEventListener(TOAST_EVENT, onToastEvent);
  }, []);

  // Auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 20000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed top-4 right-4 z-[200] flex max-w-sm animate-toast-in items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md"
      style={{
        borderColor: isError ? 'rgba(248,113,113,0.35)' : 'rgba(234,179,8,0.35)',
        background: isError ? 'rgba(127,29,29,0.85)' : 'rgba(20,83,45,0.9)',
      }}
      role="status"
    >
      {isError ? (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
      ) : (
        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#EAB308]" />
      )}
      <p className="text-sm font-medium text-[#F5F5DC]">{toast.message}</p>
      <button
        onClick={() => setToast(null)}
        className="ml-auto text-[#F5F5DC]/50 hover:text-[#F5F5DC]"
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
}