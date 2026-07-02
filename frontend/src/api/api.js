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

export const teamAPI = {
  getLombaList: () => {
    return fetch(`${API_BASE}/teams/lomba_list`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse);
  },

  createTeam: (teamData) => {
    return fetch(`${API_BASE}/teams/create_team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamData),
    }).then(handleResponse);
  },

  getMyTeams: () => {
    return fetch(`${API_BASE}/teams/show_team`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(handleResponse);
  },

  getTeamMembers: (timId) => {
    return fetch(`${API_BASE}/teams/show_member_teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tim_id: timId }),
    }).then(handleResponse);
  },
};