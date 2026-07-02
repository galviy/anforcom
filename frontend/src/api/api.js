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

  // GET daftar tim milik user yang login -> { success, data: [{id, nama_tim}] }
  getMyTeams: () => {
    return fetch(`${API_BASE}/teams/show_team`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse);
  },

  // POST daftar anggota dari sebuah tim -> { success, data: [{id, nama_lengkap, asal_instansi, nomor_induk}] }
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

  // POST hapus satu anggota dari sebuah tim
  deleteUserTeam: (timId, userId) => {
    return fetch(`${API_BASE}/teams/delete_user_team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tim_id: timId, user_id: userId }),
    }).then(handleResponse);
  },
};