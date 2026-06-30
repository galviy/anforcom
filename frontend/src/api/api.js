// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = '/api'; // atau tetap pakai import.meta.env.VITE_API_URL, asalkan .env diubah jadi '/api'
console.log('API_BASE:', API_BASE); // <- tambahkan log untuk debug

// Helper untuk menangani response (aman untuk response kosong / non-JSON)
const handleResponse = async (response) => {
  const contentLength = response.headers.get('content-length');
  if (contentLength === '0' || !response.headers.get('content-type')?.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return {}; // response kosong tapi sukses
  }

  try {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }
    return data;
  } catch (err) {
    throw new Error(`Gagal parsing response: ${err.message}`);
  }
};

// Helper untuk mengambil token dari localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authAPI = {
  // REGISTER
  register: (userData) => {
    return fetch(`${API_BASE}/auth/create_account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(handleResponse);
  },

  // LOGIN (Asumsi endpoint-nya /auth/login, sesuaikan jika beda)
  login: (credentials) => {
    return fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(handleResponse);
  },
};

// API khusus untuk user yang sudah login (membutuhkan token)
export const userAPI = {
  // GET /api/user/me
  getMe: () => {
    return fetch(`${API_BASE}/user/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(), // <-- Kirim token di header Authorization
      },
    }).then(handleResponse);
  },
};