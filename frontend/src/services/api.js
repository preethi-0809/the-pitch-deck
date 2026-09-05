export const API_URL = import.meta.env.VITE_API_URL || 'https://the-pitch-deck.onrender.com';

const getApiBase = () => {
  const raw = (API_URL || '').trim().replace(/\/+$/, '');
  if (!raw) return 'https://the-pitch-deck.onrender.com/api';
  return raw.endsWith('/api') ? raw : `${raw}/api`;
};

export const API_BASE = getApiBase();

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('pitchdeck_token') || localStorage.getItem('prepai_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, config);
  } catch (networkErr) {
    const isLocal = API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1');
    const msg = isLocal
      ? 'Cannot connect to local backend server (http://localhost:5000). Please start it with: npm run server (or npm run dev)'
      : 'Network error: Unable to reach backend server. Please check your internet connection.';
    const error = new Error(msg);
    error.status = 0;
    throw error;
  }

  let data = null;
  let rawText = '';
  try {
    rawText = await response.text();
    if (rawText && rawText.trim() !== '') {
      data = JSON.parse(rawText);
    }
  } catch {
    data = null;
  }

  if (!data) {
    if (response.status === 404) {
      data = { success: false, message: 'Backend endpoint not found (HTTP 404). Please ensure the backend is deployed and reachable.' };
    } else if (response.status >= 500) {
      data = { success: false, message: `Server error (HTTP ${response.status}). The service might be starting up or temporarily offline.` };
    } else {
      data = { success: false, message: rawText ? `Server returned: ${rawText.slice(0, 120)}` : 'Server returned an invalid response' };
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Clear token if expired
      localStorage.removeItem('pitchdeck_token');
      localStorage.removeItem('pitchdeck_user');
      localStorage.removeItem('prepai_token');
      localStorage.removeItem('prepai_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    const error = new Error(data?.message || `API request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
