// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = '/api';

const handleResponse = async (response) => {
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || !response.headers.get('content-type')?.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return {};
  }

  try {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }
    return data;
  } catch (err) {
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
    }).then(handleResponse);
  },

  // GET /api/user/me/logout -> backend balas 302 redirect + Set-Cookie penghapus cookie.
  // PERHATIAN (bug backend): logout.ts menghapus cookie bernama "token", padahal
  // cookie sesi yang sebenarnya dipakai bernama "session" (lihat login.ts).
  // Akibatnya cookie "session" TIDAK terhapus oleh endpoint ini. Selama backend
  // belum diperbaiki, logout di frontend tidak akan benar-benar mengakhiri sesi
  // di server (walau UI akan tetap kembali ke halaman login).
  logout: () => {
    return fetch(`${API_BASE}/user/me/logout`, {
      method: 'GET',
      redirect: 'follow',
    });
  },
};

export const userAPI = {
  getMe: () => {
    return fetch(`${API_BASE}/user/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse);
  },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      body: formData, // JANGAN set Content-Type manual, browser yang isi boundary-nya
    }).then(handleResponse);
  },

  // URL untuk menampilkan foto KTM anggota (dipakai langsung sebagai <img src=...>,
  // cookie sesi otomatis terkirim karena same-origin)
  getKtmUrl: (filename) => `${API_BASE}/teams/view_ktm?id=${encodeURIComponent(filename)}`,
};