// const API_BASE = import.meta.env.VITE_API_URL;
const API_BASE = '/api'; // atau tetap pakai import.meta.env.VITE_API_URL, asalkan .env diubah jadi '/api'
console.log('API_BASE:', API_BASE); // <- tambahkan log untuk debug

// Helper untuk menangani response
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }
  return data;
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