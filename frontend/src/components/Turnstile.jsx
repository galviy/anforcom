import { useEffect, useRef } from 'react';

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

/**
 * Widget Cloudflare Turnstile. Panggil onVerify(token) tiap kali dapat token
 * baru, dan onExpire() kalau token-nya kadaluarsa (harus checked ulang).
 *
 * Simpan token itu di state form induk, kirim sebagai `cf_turnstile_token`
 * ke backend. Reset widget (lewat resetRef) setelah submit gagal, karena
 * token Turnstile cuma sekali pakai.
 */
export default function Turnstile({ onVerify, onExpire, resetRef, theme = 'dark' }) {
  const containerRef = useRef(null);
  const widgetId = useRef(null);

  useEffect(() => {
    if (!SITE_KEY) {
      console.error('VITE_TURNSTILE_SITE_KEY belum di-set di frontend/.env');
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme,
        callback: (token) => onVerify?.(token),
        'expired-callback': () => onExpire?.(),
        'error-callback': () => onExpire?.(),
      });
    };

    // Script Turnstile dimuat async di index.html, mungkin belum siap saat
    // komponen ini mount. Tunggu sampai window.turnstile benar-benar ada.
    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
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

  return <div ref={containerRef} />;
}