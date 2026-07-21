import { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_LOAD_TIMEOUT_MS = 10000; // 10 detik nunggu script api.js siap

/**
 * Widget Cloudflare Turnstile. Panggil onVerify(token) tiap kali dapat token
 * baru, dan onExpire() kalau token-nya kadaluarsa (harus checked ulang).
 *
 * Simpan token itu di state form induk, kirim sebagai `cf_turnstile_token`
 * ke backend. Reset widget (lewat resetRef) setelah submit gagal, karena
 * token Turnstile cuma sekali pakai.
 *
 * CATATAN: `retry: 'never'` sengaja dipasang di render() supaya kalau
 * challenge-nya gagal/network ke Cloudflare kurang stabil, widget TIDAK
 * diam-diam nge-retry berkali-kali di background (itu yang sebelumnya
 * kerasa seperti "buffering lama" ke user tanpa pesan apa pun) — kita
 * tangkap kegagalannya lewat `onFail` dan tunjukkan tombol "Coba lagi"
 * secara eksplisit.
 */
export default function Turnstile({ onVerify, onExpire, onFail, resetRef, theme = 'dark' }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'ready' | 'timeout' | 'failed'

  useEffect(() => {
    if (!SITE_KEY) {
      console.error('VITE_TURNSTILE_SITE_KEY belum di-set di frontend/.env');
      setLoadState('failed');
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      setLoadState('ready');
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme,
        retry: 'never', // jangan auto-retry diam-diam, biar kegagalan kelihatan jelas
        callback: (token) => onVerify?.(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => {
          onFail?.();
          onExpire?.();
        },
        'timeout-callback': () => {
          onFail?.();
          onExpire?.();
        },
      });
    };

    // Script Turnstile dimuat async di index.html, mungkin belum siap saat
    // komponen ini mount. Tunggu sampai window.turnstile benar-benar ada,
    // TAPI dibatasi SCRIPT_LOAD_TIMEOUT_MS — jangan poll selamanya kalau
    // script-nya gagal/lambat kebuka (koneksi ke Cloudflare kurang stabil).
    if (window.turnstile) {
      renderWidget();
    } else {
      const startedAt = Date.now();
      const interval = setInterval(() => {
        if (cancelled) return;
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
          return;
        }
        if (Date.now() - startedAt > SCRIPT_LOAD_TIMEOUT_MS) {
          clearInterval(interval);
          setLoadState('timeout');
        }
      }, 100);
      return () => clearInterval(interval);
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Biar form induk bisa minta reset widget (dapat token baru) tanpa remount
  if (resetRef) {
    resetRef.current = () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.reset(widgetId.current);
      }
    };
  }

  if (loadState === 'timeout' || loadState === 'failed') {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-xs text-red-300">
          Verifikasi keamanan gagal dimuat. Cek koneksi internet kamu ke Cloudflare, lalu coba lagi.
        </p>
        <button
          type="button"
          onClick={() => {
            setLoadState('loading');
            window.location.reload();
          }}
          className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-[#F5F5DC]/80 hover:border-[#EAB308]/40 hover:text-[#EAB308]"
        >
          Muat Ulang Halaman
        </button>
      </div>
    );
  }

  return <div ref={containerRef} />;
}