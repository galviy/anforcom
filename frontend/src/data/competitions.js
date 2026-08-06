import { MonitorSmartphone, TerminalSquare, Code2 } from 'lucide-react';

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
      biayaNote: 'per tim (Batch 1)',
    },
    guidebookFile: '/Rulebook-duc-final.pdf',
    timeline: [
      { label: 'Pendaftaran Gelombang 1', window: '19 Jul - 2 Agu 2026' },
      { label: 'Pendaftaran Gelombang 2', window: '10 Agu - 24 Agu 2026' },
      { label: 'Batas Akhir Pengumpulan Proposal', window: '31 Agu 2026' },
      { label: 'Pengumuman Finalis', window: '16 Sep 2026' },
      { label: 'Technical Meeting Finalis', window: '22 Sep 2026' },
      { label: 'Tahap Final & Pengumuman Pemenang', window: '26 Sep 2026' },
    ],
    prizes: [
      { place: '1st', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '2nd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '3rd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
    ],
    batches: [
      { open: '2026-07-19T00:00:00+07:00', close: '2026-08-10T00:00:00+07:00' },
      { open: '2026-08-10T00:00:00+07:00', close: '2026-08-24T23:59:59+07:00' },
    ],
    contacts: [
      { name: 'Ruth Septriana Sipangkar', phone: '6285261971077' },
      { name: 'Nouvella Rahma Fitrah Legarsi', phone: '6282224002103' },
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
      biayaNote: 'per tim (Batch 1)',
    },
    guidebookFile: '/Rulebook-dcpc-final.pdf',
    timeline: [
      { label: 'Open Registration Batch 1', window: '19 Jul - 2 Agu 2026' },
      { label: 'Open Registration Batch 2', window: '10 Agu - 24 Agu 2026' },
      { label: 'Technical Meeting Penyisihan', window: '9 Sep 2026' },
      { label: 'Warmup Babak Penyisihan', window: '11 Sep 2026' },
      { label: 'Penyisihan', window: '12 Sep 2026' },
      { label: 'Pengumuman Finalis', window: '16 Sep 2026' },
      { label: 'Technical Meeting Final', window: '22 Sep 2026' },
      { label: 'Babak Final & Pengumuman Pemenang', window: '26 Sep 2026' },
    ],
    prizes: [
      { place: '1st', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '2nd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '3rd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
    ],
    batches: [
      { open: '2026-07-19T00:00:00+07:00', close: '2026-08-10T00:00:00+07:00' },
      { open: '2026-08-10T00:00:00+07:00', close: '2026-08-24T23:59:59+07:00' },
    ],
    contacts: [
      { name: 'Izzat', phone: '62895388522598' },
      { name: 'Jordan', phone: '6281213498313' },
    ],
  },
  {
    code: 'DSDC',
    slug: 'dsdc',
    name: 'Diponegoro Software Development Competition',
    shortDesc: 'Bangun perangkat lunak inovatif berbasis website atau mobile yang menjawab tantangan nyata kota berkelanjutan — dari pengelolaan sampah, mobilitas hijau, hingga kesehatan lingkungan.',
    icon: Code2,
    fullDesc:
      'Diponegoro Software Development Competition (DSDC) adalah salah satu cabang lomba dari serangkaian kegiatan ANFORCOM 2026 yang dapat diikuti oleh siswa/i SMA/SMK/MA sederajat dan mahasiswa/i se-Indonesia. Kegiatan ini berupa kompetisi pengembangan perangkat lunak berbasis website maupun mobile yang menekankan pada fungsionalitas, performa, serta kemampuan solusi dalam menjawab permasalahan nyata secara terukur dan dapat diimplementasikan. Peserta diharapkan mampu merancang dan membangun perangkat lunak yang inovatif dan fungsional sesuai tema \'Engineering the Circular City: Software Solutions for a Sustainable and Healthy Urban Future\'.',
    summary: {
      kategori: 'Tim',
      peserta: 'SMA/SMK & Mahasiswa',
      anggota: '2-3 Orang',
      biaya: 'Rp. 80.000',
      biayaNote: 'per tim (Batch 1)',
    },
    guidebookFile: '/Rulebook-dsdc-final.pdf',
    timeline: [
      { label: 'Pendaftaran Gelombang 1', window: '19 Jul - 2 Agu 2026' },
      { label: 'Pendaftaran Gelombang 2', window: '10 Agu - 24 Agu 2026' },
      { label: 'Batas Akhir Pengumpulan Proposal', window: '31 Agu 2026' },
      { label: 'Pengumuman Finalis', window: '16 Sep 2026' },
      { label: 'Technical Meeting Finalis', window: '22 Sep 2026' },
      { label: 'Tahap Final & Pengumuman Pemenang', window: '26 Sep 2026' },
    ],
    prizes: [
      { place: '1st', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '2nd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
      { place: '3rd', reward: 'Uang Pembinaan', extras: 'Sertifikat + Piala' },
    ],
    batches: [
      { open: '2026-07-19T00:00:00+07:00', close: '2026-08-10T00:00:00+07:00' },
      { open: '2026-08-10T00:00:00+07:00', close: '2026-08-24T23:59:59+07:00' },
    ],
    contacts: [
      { name: 'Arya Fathdillah Adi Saputra', phone: '6281469735184' },
      { name: 'Akbar Mukti Wibowo', phone: '6288215110873' },
    ],
  },
];

export function getCompetitionBySlug(slug) {
  return COMPETITIONS.find((c) => c.slug === slug) ?? null;
}
