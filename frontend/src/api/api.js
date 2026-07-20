// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = '/api';

// --- CSRF token ---
// Backend hanya menerbitkan csrf_token sekali, di response body /auth/login
// (lihat login.ts: `Response.json({ success: true, csrf_token: token })`).
// Endpoint lain TIDAK ada yang menerbitkan ulang token ini. Makanya token
// disimpan di localStorage (bukan cuma React state) supaya tetap ada walau
// halaman di-refresh atau tab ditutup-buka lagi selama cookie session masih
// hidup (Max-Age 86400 / 24 jam) — cocok dengan siklus hidup cookie sesinya.
//
// CATATAN: kalau nanti localStorage kosong tapi cookie session masih valid
// (misal: buka tab baru di browser lain, atau localStorage ke-clear), semua
// request ke endpoint yang protected CSRF (termasuk GET /user/me) akan
// dibalas 403 "Invalid CSRF token" walau sesi login-nya sendiri valid. Ini
// keterbatasan dari kontrak backend saat ini karena tidak ada endpoint untuk
// menerbitkan ulang csrf_token untuk sesi yang sudah ada — satu-satunya jalan
// keluar saat ini adalah login ulang. Kalau mau UX yang lebih baik, backend
// perlu endpoint tambahan (mis. GET /auth/csrf yang men-generate token baru
// untuk siapa pun yang cookie session-nya masih valid).
const CSRF_STORAGE_KEY = 'anforcom_csrf_token';

function getCsrfToken() {
  try {
    return localStorage.getItem(CSRF_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function setCsrfToken(token) {
  try {
    if (token) localStorage.setItem(CSRF_STORAGE_KEY, token);
  } catch {
    // localStorage tidak tersedia (mis. private mode) — CSRF-protected request
    // akan gagal, tapi biarkan gagal secara natural lewat 403 dari backend
    // daripada dari sini.
  }
}

function clearCsrfToken() {
  try {
    localStorage.removeItem(CSRF_STORAGE_KEY);
  } catch {
    // no-op
  }
}

// Helper buat gabungin header lain dengan X-CSRF-Token. Dipakai di SEMUA
// endpoint yang ada di daftar CSRF-protected pada backend/handlers/router.ts:
// /user/me, /user/edit, /teams/create_team, /teams/delete_team,
// /teams/delete_user_team, /teams/add_user_team, /teams/edit_user_team,
// /teams/add_proposal, /teams/delete_proposal.
function withCsrf(extraHeaders = {}) {
  return { ...extraHeaders, 'X-CSRF-Token': getCsrfToken() };
}

const handleResponse = async (response) => {
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || !response.headers.get('content-type')?.includes('application/json')) {
    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
      err.status = response.status;
      throw err;
    }
    return {};
  }

  try {
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.error || data.message || `HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return data;
  } catch (err) {
    if (err.status) throw err; // sudah di-throw di atas, jangan dibungkus lagi
    throw new Error(`Gagal parsing response: ${err.message}`);
  }
};

// NOTE: Auth backend ini berbasis session cookie (HttpOnly), BUKAN Bearer token.
// Cookie otomatis terkirim oleh browser untuk request same-origin.

export const authAPI = {
  register: (userData) => {
    return fetch(`${API_BASE}/auth/create_account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse);
  },

  login: (credentials) => {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse).then((data) => {
      // Simpan csrf_token yang dikembalikan login untuk dipakai di request
      // berikutnya ke endpoint yang CSRF-protected.
      if (data?.csrf_token) setCsrfToken(data.csrf_token);
      return data;
    });
  },

  // GET /api/user/me/logout -> backend balas 302 redirect + Set-Cookie penghapus cookie.
  // Sudah diperbaiki di backend: logout.ts sekarang menghapus cookie "session"
  // (sesuai nama cookie sesi yang dipakai login.ts), jadi logout benar-benar
  // mengakhiri sesi di server.
  logout: () => {
    clearCsrfToken();
    return fetch(`${API_BASE}/user/me/logout`, {
      method: 'GET',
      redirect: 'follow',
    });
  },

  // POST minta link reset password. Selalu balas success:true walau email
  // tidak terdaftar (mencegah enumerasi email).
  resetPassword: (email, cfToken) => {
    return fetch(`${API_BASE}/auth/reset_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cf_turnstile_token: cfToken }),
    }).then(handleResponse);
  },

  // POST minta kirim ulang link verifikasi email (kalau email pertama hilang/
  // kedaluwarsa). Sama seperti resetPassword, selalu balas success:true walau
  // emailnya tidak ada pendaftaran pending (mencegah enumerasi email).
  resendVerification: (email, cfToken) => {
    return fetch(`${API_BASE}/auth/resend_verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cf_turnstile_token: cfToken }),
    }).then(handleResponse);
  },

  // Kirim ulang link verifikasi pakai token LAMA (dari link email yang sudah
  // kedaluwarsa/invalid) — dipakai tombol "kirim ulang" di halaman hasil
  // verifikasi gagal, jadi user tidak perlu ngetik ulang emailnya.
  resendVerificationByToken: (token) => {
    return fetch(`${API_BASE}/auth/resend_verification_by_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }).then(handleResponse);
  },

  // POST konfirmasi reset password pakai token dari link email.
  // token dikirim lewat query string, bukan body.
  resetConfirmation: (token, newPassword1, newPassword2) => {
    return fetch(`${API_BASE}/auth/reset_confirmation?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ new_password1: newPassword1, new_password2: newPassword2 }),
    }).then(handleResponse);
  },

  // GET verifikasi email dari link yang dikirim saat registrasi (create_account).
  // Dipanggil dari halaman /verify-success.
  //
  // PENTING (kuirk backend): verification.ts TIDAK konsisten soal di mana pesan
  // errornya ditaruh — kadang di top-level (`data.error`), kadang dibungkus di
  // `data.validasi.message` (lihat cek_dummy_user di repositories.ts). Makanya
  // endpoint ini tidak pakai handleResponse generik, biar pesan aslinya selalu
  // kebaca di UI, bukan cuma "HTTP 403".
  verifyEmail: async (token) => {
    const response = await fetch(`${API_BASE}/auth/verification?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: gagal membaca response`);
    }

    if (!response.ok) {
      const message = data?.error || data?.message || data?.validasi?.message || `HTTP ${response.status}`;
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }

    // Sukses: { validasi: { success:true, message } }
    return data?.validasi ?? data;
  },
};

export const userAPI = {
  getMe: () => {
    return fetch(`${API_BASE}/user/me`, {
      method: 'GET',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
    }).then(handleResponse);
  },

  // POST ganti password user yang sedang login.
  // NOTE: baru bisa dipakai sekarang, sebelumnya handler-nya (/user/edit) belum
  // didaftarkan di backend router jadi selalu 404.
  updatePassword: (oldPassword, newPassword) => {
    return fetch(`${API_BASE}/user/edit`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ password: true, old_pass: oldPassword, new_pass: newPassword }),
    }).then(handleResponse);
  },
  // NOTE: ganti email & no_tlp masih 501 Not Implemented di backend, belum ada wrapper-nya di sini.
};

// API untuk fitur tim
// NOTE: backend TIDAK punya endpoint /teams/lomba_list, jadi daftar lomba
// didefinisikan statis di frontend (lihat CreateTeam.jsx) dan disesuaikan
// dengan validasi lomba_id yang ada di backend/handlers/routes/teams/create_team.ts
export const teamAPI = {
  // POST buat tim baru. Perhatian: response sukses (HTTP 200) bisa tetap
  // berisi { error: true, message: "..." } untuk kegagalan bisnis
  // (misal: user sudah punya tim), jadi selalu cek field `error` juga.
  createTeam: (teamData) => {
    return fetch(`${API_BASE}/teams/create_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(teamData),
    }).then(handleResponse);
  },

  // GET daftar tim milik user yang login -> { success, data: [{id, nama_tim, isVerified}] }
  getMyTeams: () => {
    return fetch(`${API_BASE}/teams/show_team`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse);
  },

  // POST daftar anggota dari sebuah tim
  // -> { success, data: [{id, nama_lengkap, asal_instansi, nomor_induk, data_image}] }
  getTeamMembers: (timId) => {
    return fetch(`${API_BASE}/teams/show_member_teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tim_id: timId }),
    }).then(handleResponse);
  },

  // POST hapus tim (beserta seluruh anggotanya)
  deleteTeam: (timId) => {
    return fetch(`${API_BASE}/teams/delete_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId }),
    }).then(handleResponse);
  },

  // POST hapus satu anggota dari sebuah tim.
  // `memberId` di sini adalah field `id` dari hasil getTeamMembers (id baris di
  // tabel isi_tim), BUKAN id user asli — backend memang menamainya "user_id" di
  // body request tapi memvalidasinya sebagai id anggota tim.
  deleteUserTeam: (timId, memberId) => {
    return fetch(`${API_BASE}/teams/delete_user_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId, user_id: memberId }),
    }).then(handleResponse);
  },

  // POST tambah anggota tim + upload foto KTM (multipart/form-data).
  // Maks 3 anggota per tim (divalidasi backend). Tipe file: jpg/jpeg/png/webp, maks ~10MB.
  addUserTeam: ({ timId, namaLengkap, asalInstansi, nomorInduk, photoFile }) => {
    const formData = new FormData();
    formData.append('tim_id', timId);
    formData.append('nama_lengkap', namaLengkap);
    formData.append('asal_instansi', asalInstansi);
    formData.append('nomor_induk', nomorInduk);
    formData.append('data_photo', photoFile);

    return fetch(`${API_BASE}/teams/add_user_team`, {
      method: 'POST',
      headers: withCsrf(), // JANGAN tambah Content-Type manual, browser yang isi boundary-nya
      body: formData,
    }).then(handleResponse);
  },

  // URL untuk menampilkan foto KTM anggota (dipakai langsung sebagai <img src=...>,
  // cookie sesi otomatis terkirim karena same-origin)
  getKtmUrl: (filename) => `${API_BASE}/teams/view_ktm?id=${encodeURIComponent(filename)}`,

  // Upload/ganti proposal PDF tim. Backend HANYA menerima ekstensi + MIME
  // application/pdf, maks 50MB, dan cuma boleh untuk tim yang lolos cek
  // `bisaUpProposal` di server (mis. kategori lomba tertentu) — pesan errornya
  // ditampilkan apa adanya dari backend.
  //
  // PENTING (kuirk backend): beberapa kegagalan (tim tidak eligible / upload
  // gagal / file >=50MB) dibalas dengan HTTP 200 tapi body-nya `success:false`
  // (kadang di top-level, kadang dibungkus di `apakahbisaup`). Makanya endpoint
  // ini TIDAK pakai handleResponse generik, body-nya dicek manual.
  addProposal: async (timId, pdfFile) => {
    const formData = new FormData();
    formData.append('tim_id', timId);
    formData.append('data_proposal', pdfFile);

    const response = await fetch(`${API_BASE}/teams/add_proposal`, {
      method: 'POST',
      headers: withCsrf(), // JANGAN tambah Content-Type manual, browser yang isi boundary-nya
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: gagal membaca response`);
    }

    // Status HTTP non-2xx (401/400/403/dst) -> pesan error ada di data.error
    if (!response.ok) {
      const err = new Error(data?.error || data?.message || `HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }

    // Kegagalan bisnis yang tetap dibalas 200 OK, dibungkus di `apakahbisaup`
    if (data?.apakahbisaup && data.apakahbisaup.success === false) {
      throw new Error(data.apakahbisaup.message || 'Tim kamu tidak bisa upload proposal.');
    }

    // Kegagalan bisnis lain (mis. file kegedean, gagal simpan) balas 200 tapi success:false
    if (data?.success === false) {
      throw new Error(data.error || data.message || 'Gagal upload proposal.');
    }

    return data; // { success:true, message, nama_file }
  },

  // URL PDF proposal tim, langsung dipakai sebagai src <embed>/<iframe> untuk preview.
  getProposalUrl: (filename) => `${API_BASE}/teams/view_proposal?id=${encodeURIComponent(filename)}`,

  // Hapus proposal tim yang sudah diupload. Backend cuma izinin 1 proposal aktif
  // per tim (addProposal akan nolak upload baru kalau masih ada yang lama), jadi
  // ini jalan satu-satunya buat bisa upload ulang.
  deleteProposal: (timId) => {
    return fetch(`${API_BASE}/teams/delete_proposal`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId }),
    }).then(handleResponse);
  },

  // POST edit data anggota tim (nama_lengkap/asal_instansi/nomor_induk/foto), satu
  // panggilan mengubah satu field lewat parameter editCase. `memberId` sama seperti
  // di deleteUserTeam (id baris di tabel isi_tim).
  editUserTeamNama: (timId, memberId, namaBaru) => {
    return fetch(`${API_BASE}/teams/edit_user_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId, user_id: memberId, editCase: 'editNama', nama_baru: namaBaru }),
    }).then(handleResponse);
  },

  editUserTeamAsalInstansi: (timId, memberId, asalInstansiBaru) => {
    return fetch(`${API_BASE}/teams/edit_user_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId, user_id: memberId, editCase: 'asal_instansi', asal_instansi_baru: asalInstansiBaru }),
    }).then(handleResponse);
  },

  editUserTeamNomorInduk: (timId, memberId, nomorIndukBaru) => {
    return fetch(`${API_BASE}/teams/edit_user_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ tim_id: timId, user_id: memberId, editCase: 'nomor_induk', nomor_induk_baru: nomorIndukBaru }),
    }).then(handleResponse);
  },

  // Ganti foto KTM anggota. Endpoint ini JSON (bukan multipart seperti addUserTeam),
  // jadi file di-encode ke base64 dulu. Tipe file: jpg/jpeg/png/webp, maks ~10MB.
  // Response berisi `nama_file` baru, pakai getKtmUrl(nama_file) untuk tampilkan ulang.
  editUserTeamFoto: async (timId, memberId, photoFile) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(photoFile);
    });

    return fetch(`${API_BASE}/teams/edit_user_team`, {
      method: 'POST',
      headers: withCsrf({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        tim_id: timId,
        user_id: memberId,
        editCase: 'foto_baru',
        file_name: photoFile.name,
        foto_base64: base64,
      }),
    }).then(handleResponse);
  },
};