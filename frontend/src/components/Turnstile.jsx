import { useEffect, useRef, useState } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
const SCRIPT_LOAD_TIMEOUT_MS = 10000; // 10 detik nunggu script api.js siap

// Lazy-load script Cloudflare Turnstile cuma sekali, sekali dibutuhkan.
// Sebelumnya script ini di-load GLOBAL lewat <script> di index.html, jadi
// nyangkut di SETIAP halaman SPA (termasuk /dashboard yang sama sekali gak
// ada widget captcha-nya). Sekarang cuma di-inject kalau ada komponen
// <Turnstile> yang benar-benar mount — dan `turnstileScriptPromise` di sini
// memastikan cuma ada 1 <script> tag walau ada beberapa <Turnstile> yang
// mount bersamaan di halaman yang sama.
let turnstileScriptPromise = null;

function loadTurnstileScript() {
  if (window.turnstile) return Promise.resolve();
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      if (window.turnstile) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Gagal memuat script Turnstile')));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Gagal memuat script Turnstile'));
    document.head.appendChild(script);
  }).catch((err) => {
    // Reset supaya percobaan berikutnya (mis. setelah user klik "Muat Ulang
    // Halaman") tidak nyangkut di promise yang sudah gagal selamanya.
    turnstileScriptPromise = null;
    throw err;
  });

  return turnstileScriptPromise;
}

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

    const timeoutId = setTimeout(() => {
      if (!cancelled) setLoadState('timeout');
    }, SCRIPT_LOAD_TIMEOUT_MS);

    loadTurnstileScript()
      .then(() => {
        clearTimeout(timeoutId);
        renderWidget();
      })
      .catch((err) => {
        console.error(err);
        clearTimeout(timeoutId);
        if (!cancelled) setLoadState('failed');
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
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