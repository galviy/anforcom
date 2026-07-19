import { MonitorSmartphone, TerminalSquare, LineChart } from 'lucide-react';

export const COMPETITIONS = [
  {
    code: 'DUC',
    slug: 'duc',
    name: 'Diponegoro UI/UX Competition',
    shortDesc: 'Rancang alur dan tampilan produk digital yang menyelesaikan masalah nyata pengguna — dari riset singkat sampai purwarupa antarmuka yang bisa dicoba langsung.',
    icon: MonitorSmartphone,
    fullDesc:
      'Diponegoro UI/UX Design (DUC) adalah salah satu cabang lomba dari serangkaian kegiatan ANFORCOM 2026 yang dapat diikuti oleh siswa SMA/SMK/MA sederajat dan mahasiswa se-Indonesia. Kegiatan ini berupa kompetisi desain antarmuka pengguna (UI/UX) yang berorientasi pada kenyamanan dan kemudahan pengguna dalam menggunakan sistem/produk tersebut.',
    summary: {
      kategori: 'Tim',
      peserta: 'SMA/SMK & Mahasiswa',
      anggota: '2-3 Orang',
      biaya: 'Rp. 80.000',
      biayaNote: 'per tim',
    },
    timeline: [
      { label: 'Pendaftaran Gelombang 1', window: '15 Jul - 3 Agu 2026' },
      { label: 'Pendaftaran Gelombang 2', window: '10 Agu - 30 Agu 2026' },
      { label: 'Pengumuman Finalis', window: '16 Sep 2026' },
      { label: 'Technical Meeting Finalis', window: '22 Sep 2026' },
      { label: 'Tahap Final & Pengumuman Pemenang', window: '26 Sep 2026' },
    ],
    prizes: [
      { place: '1st', reward: 'Rp 2.500.000', extras: 'Sertifikat Nasional' },
      { place: '2nd', reward: 'Rp 1.500.000', extras: 'Sertifikat Nasional' },
      { place: '3rd', reward: 'Rp 1.000.000', extras: 'Sertifikat Nasional' },
    ],
    batches: [
      { open: '2026-07-15T00:00:00+07:00', close: '2026-08-03T23:59:59+07:00' },
      { open: '2026-08-10T00:00:00+07:00', close: '2026-08-30T23:59:59+07:00' },
    ],
  },
  {
    code: 'DCPC',
    slug: 'dcpc',
    name: 'Diponegoro Competitive Programming Competition',
    shortDesc: 'Kompetisi pemrograman yang berfokus pada kemampuan berpikir logis, analitis, serta pemecahan masalah melalui implementasi algoritma dan struktur data.',
    icon: TerminalSquare,
    fullDesc:
      'Diponegoro Competitive Programming Competition (DCPC) adalah salah satu cabang lomba dari serangkaian kegiatan ANFORCOM 2026 yang dapat diikuti oleh siswa SMA/SMK/MA sederajat se-Indonesia. Kegiatan ini merupakan kompetisi pemrograman yang berfokus pada kemampuan berpikir logis, analitis, serta pemecahan masalah melalui implementasi algoritma dan struktur data secara efisien.',
    summary: {
      kategori: 'Tim',
      peserta: 'SMA/SMK Sederajat',
      anggota: '1-3 Orang',
      biaya: 'Rp. 80.000',
      biayaNote: 'per tim',
    },
    timeline: [
      { label: 'Registration Batch 1', window: '15 Jul - 3 Agu 2026' },
      { label: 'Registration Batch 2', window: '10 Agu - 30 Agu 2026' },
      { label: 'Technical Meeting Penyisihan', window: '9 Sep 2026' },
      { label: 'Warmup & Penyisihan', window: '11 Sep - 12 Sep 2026' },
      { label: 'Pengumuman Finalis', window: '16 Sep 2026' },
      { label: 'Technical Meeting Final', window: '22 Sep 2026' },
      { label: 'Babak Final & Pengumuman Pemenang', window: '26 Sep 2026' },
    ],
    prizes: [
      { place: '1st', reward: 'Rp 2.500.000', extras: 'Sertifikat Nasional' },
      { place: '2nd', reward: 'Rp 1.500.000', extras: 'Sertifikat Nasional' },
      { place: '3rd', reward: 'Rp 1.000.000', extras: 'Sertifikat Nasional' },
    ],
    batches: [
      { open: '2026-07-15T00:00:00+07:00', close: '2026-08-03T23:59:59+07:00' },
      { open: '2026-08-10T00:00:00+07:00', close: '2026-08-30T23:59:59+07:00' },
    ],
  },
  {
    code: 'DDSC',
    slug: 'ddsc',
    name: 'Diponegoro Data Science Competition',
    shortDesc: 'Gali insight dari data dunia nyata — mulai dari eksplorasi dan pembersihan data, penerapan metode analisis, sampai presentasi temuan di depan juri.',
    icon: LineChart,
    fullDesc:
      'DDSC atau Diponegoro Data Science Competition adalah salah satu cabang lomba dari serangkaian kegiatan ANFORCOM 2026 yang dapat diikuti oleh mahasiswa se-Indonesia. Kegiatan ini berupa kompetisi yang berfokus pada penerapan data science dalam memahami dinamika sosial, politik, dan pembangunan nasional melalui pendekatan analisis data berbasis kecerdasan buatan. Peserta diharapkan mampu merancang pendekatan yang tepat dalam memahami dan mengklasifikasikan wacana publik berdasarkan data yang tersedia serta sesuai dengan tema perlombaan DDSC ANFORCOM 2026 yaitu "Digitalisasi untuk Indonesia Maju: Menggali Wacana Publik di X tentang Visi Astacita Prabowo-Gibran Menuju Pembangunan Berkelanjutan".',
    summary: {
      kategori: 'Tim',
      peserta: 'Mahasiswa',
      anggota: '2-3 Orang',
      biaya: 'Rp. 80.000',
      biayaNote: 'per tim',
    },
    timeline: [
      { label: 'Jadwal Lengkap', window: 'Menyusul' },
    ],
    prizes: [
      { place: '1st', reward: 'Rp 2.500.000', extras: 'Sertifikat Nasional' },
      { place: '2nd', reward: 'Rp 1.500.000', extras: 'Sertifikat Nasional' },
      { place: '3rd', reward: 'Rp 1.000.000', extras: 'Sertifikat Nasional' },
    ],
    batches: [],
  },
];

export function getCompetitionBySlug(slug) {
  return COMPETITIONS.find((c) => c.slug === slug) ?? null;
}
