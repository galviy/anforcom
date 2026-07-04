import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const EYEBROW_TEXT = 'HMIF UNDIP // ANFORCOM 2026';

const COMPETITIONS = [
  {
    tag: 'DESAIN',
    code: 'DUC',
    name: 'Diponegoro UI/UX Competition',
    audience: 'SMA/Sederajat & Mahasiswa',
    desc: 'Rancang alur dan tampilan produk digital yang menyelesaikan masalah nyata pengguna — dari riset singkat sampai purwarupa antarmuka yang bisa dicoba langsung.',
    accent: 'amber',
  },
  {
    tag: 'TEKNIS',
    code: 'DCPC',
    name: 'Diponegoro Competitive Programming Challenge',
    audience: 'SMA/Sederajat',
    desc: 'Adu strategi dan logika lewat rangkaian studi kasus pemrograman kompetitif, dari babak penyisihan online sampai final di bawah tekanan waktu.',
    accent: 'teal',
  },
];

const TIMELINE = [
  { label: 'Pendaftaran Batch 1', window: 'TBA', desc: 'Slot lebih murah, kuota terbatas per sekolah/kampus.' },
  { label: 'Pendaftaran Batch 2', window: 'TBA', desc: 'Kesempatan terakhir untuk tim yang belum mendaftar.' },
  { label: 'Babak Penyisihan', window: 'TBA', desc: 'Pengerjaan submission/tantangan sesuai cabang lomba.' },
  { label: 'Final & Awarding', window: 'TBA', desc: 'Presentasi tim terbaik dan pengumuman pemenang.' },
];

const PRIZES = [
  { place: 'Juara 2', amount: 'Rp 1.500.000', rank: 2 },
  { place: 'Juara 1', amount: 'Rp 2.500.000', rank: 1 },
  { place: 'Juara 3', amount: 'Rp 1.000.000', rank: 3 },
];

const FAQS = [
  {
    q: 'Bagaimana cara mendaftarkan tim?',
    a: 'Buat akun lewat halaman Daftar, lalu masuk ke dashboard dan buat tim dari sana. Kamu akan memilih cabang lomba sesuai kategori pendidikanmu saat membuat tim.',
  },
  {
    q: 'Apakah satu tim boleh ikut lebih dari satu cabang lomba?',
    a: 'Untuk saat ini, satu akun hanya dapat terdaftar dalam satu tim aktif. Ketentuan lebih detail akan diumumkan lewat guidebook resmi.',
  },
  {
    q: 'Siapa saja yang boleh mengikuti Anforcom?',
    a: 'DUC terbuka untuk siswa SMA/SMK/MA sederajat maupun mahasiswa se-Indonesia. DCPC untuk saat ini terbuka bagi siswa SMA/Sederajat.',
  },
  {
    q: 'Apakah rangkaian acara online atau offline?',
    a: 'Babak penyisihan direncanakan berjalan online, sementara babak final bersifat luring. Jadwal pasti akan diumumkan mendekati hari-H.',
  },
];

export default function Landing() {
  const [typed, setTyped] = useState('');
  const heroRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTyped(EYEBROW_TEXT);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(EYEBROW_TEXT.slice(0, i));
      if (i >= EYEBROW_TEXT.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll('.lp-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('lp-reveal-in');
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lp-root">
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <span className="lp-logo">ANFORCOM<span className="lp-logo-year">/26</span></span>
          <div className="lp-nav-links">
            <a href="#tentang">Tentang</a>
            <a href="#kompetisi">Kompetisi</a>
            <a href="#linimasa">Linimasa</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="lp-nav-cta">
            <Link to="/login" className="lp-btn lp-btn-ghost">Masuk</Link>
            <Link to="/register" className="lp-btn lp-btn-solid">Daftar Tim</Link>
          </div>
        </div>
      </nav>

      <header className="lp-hero" ref={heroRef}>
        <div className="lp-hero-grid" aria-hidden="true" />
        <div className="lp-hero-inner">
          <p className="lp-eyebrow">
            <span className="lp-prompt">$</span> {typed}
            <span className="lp-cursor" aria-hidden="true">▌</span>
          </p>
          <h1 className="lp-h1">
            RANCANG. PECAHKAN.<br />
            <span className="lp-h1-accent">NAIK PAPAN PERINGKAT.</span>
          </h1>
          <p className="lp-hero-sub">
            Anforcom adalah kompetisi informatika nasional oleh HMIF Universitas Diponegoro
            untuk siswa SMA/Sederajat dan mahasiswa se-Indonesia — satu panggung untuk desain
            antarmuka dan pemrograman kompetitif.
          </p>
          <div className="lp-hero-cta">
            <Link to="/register" className="lp-btn lp-btn-solid lp-btn-lg">Daftar Tim →</Link>
            <a href="#kompetisi" className="lp-btn lp-btn-ghost lp-btn-lg">Lihat Kompetisi</a>
          </div>
          <div className="lp-stat-strip">
            <div className="lp-stat"><span className="lp-stat-dot" />2 cabang lomba</div>
            <div className="lp-stat"><span className="lp-stat-dot" />Nasional · SMA &amp; mahasiswa</div>
            <div className="lp-stat"><span className="lp-stat-dot" />Daring &amp; luring</div>
          </div>
        </div>
      </header>

      <section id="tentang" className="lp-section lp-reveal">
        <span className="lp-section-eyebrow">// tentang</span>
        <h2 className="lp-section-title">Satu kompetisi, dua jalur karya</h2>
        <p className="lp-about-copy">
          Diselenggarakan oleh Himpunan Mahasiswa Informatika (HMIF) Universitas Diponegoro,
          Anforcom mempertemukan pelajar dan mahasiswa dari seluruh Indonesia untuk berkompetisi
          sekaligus berkolaborasi di bidang teknologi — mulai dari merancang pengalaman pengguna
          sampai menyelesaikan tantangan pemrograman kompetitif.
        </p>
      </section>

      <section id="kompetisi" className="lp-section lp-reveal">
        <span className="lp-section-eyebrow">// kompetisi</span>
        <h2 className="lp-section-title">Pilih arena kamu</h2>
        <div className="lp-comp-grid">
          {COMPETITIONS.map((c) => (
            <article key={c.code} className={`lp-comp-card lp-accent-${c.accent}`}>
              <div className="lp-comp-head">
                <span className="lp-comp-tag">{c.tag}</span>
                <span className="lp-comp-code">{c.code}</span>
              </div>
              <h3 className="lp-comp-name">{c.name}</h3>
              <p className="lp-comp-audience">{c.audience}</p>
              <p className="lp-comp-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="linimasa" className="lp-section lp-reveal">
        <span className="lp-section-eyebrow">// linimasa</span>
        <h2 className="lp-section-title">Rangkaian acara</h2>
        <ol className="lp-timeline">
          {TIMELINE.map((t, idx) => (
            <li key={t.label} className="lp-timeline-item">
              <span className="lp-timeline-node">{String(idx + 1).padStart(2, '0')}</span>
              <div className="lp-timeline-body">
                <span className="lp-timeline-window">{t.window}</span>
                <h3 className="lp-timeline-label">{t.label}</h3>
                <p className="lp-timeline-desc">{t.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lp-section lp-reveal">
        <span className="lp-section-eyebrow">// hadiah</span>
        <h2 className="lp-section-title">Total hadiah per cabang lomba</h2>
        <div className="lp-podium">
          {PRIZES.map((p) => (
            <div key={p.place} className={`lp-podium-card lp-podium-rank-${p.rank}`}>
              <span className="lp-podium-place">{p.place}</span>
              <span className="lp-podium-amount">{p.amount}</span>
            </div>
          ))}
        </div>
        <p className="lp-note">*Berdasarkan Anforcom tahun sebelumnya, menunggu pengumuman resmi tahun ini.</p>
      </section>

      <section id="faq" className="lp-section lp-reveal">
        <span className="lp-section-eyebrow">// faq</span>
        <h2 className="lp-section-title">Pertanyaan yang sering ditanyakan</h2>
        <div className="lp-faq-list">
          {FAQS.map((f) => (
            <details key={f.q} className="lp-faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lp-cta-band lp-reveal">
        <h2>Siap unjuk karya di Anforcom 2026?</h2>
        <p>Bentuk timmu, pilih cabang lomba, dan mulai perjalananmu.</p>
        <Link to="/register" className="lp-btn lp-btn-solid lp-btn-lg">Daftar Sekarang</Link>
      </section>

      <footer className="lp-footer">
        <span className="lp-logo">ANFORCOM<span className="lp-logo-year">/26</span></span>
        <p>Diselenggarakan oleh Himpunan Mahasiswa Informatika Universitas Diponegoro.</p>
        <div className="lp-footer-links">
          <Link to="/login">Masuk</Link>
          <Link to="/register">Daftar</Link>
        </div>
      </footer>
    </div>
  );
}
