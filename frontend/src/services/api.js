const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.trim() === '') {
    return '/api';
  }
  const clean = envUrl.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
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

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json().catch(() => ({ success: false, message: 'Server returned an invalid response' }));

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
    const error = new Error(data.message || 'An error occurred during the API request');
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
