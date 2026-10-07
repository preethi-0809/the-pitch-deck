/**
 * Centralized API Configuration
 *
 * Environment variable: VITE_API_URL
 *   - Development (.env.development): http://localhost:5000
 *   - Production  (.env.production):  https://the-pitch-deck.onrender.com
 *
 * In development (localhost), requests use the Vite dev proxy (/api/...).
 * In production, requests go directly to the full backend URL.
 */

const PRODUCTION_BACKEND = 'https://the-pitch-deck.onrender.com';

export const getApiBase = () => {
  // In development (localhost), use relative /api path — Vite proxy handles it
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '/api';
    }
  }

  // In production, construct full backend URL from env var or fallback
  const raw = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

  // If VITE_API_URL is missing or points to localhost (shouldn't happen in prod build), use hardcoded production URL
  if (!raw || raw.includes('localhost') || raw.includes('127.0.0.1')) {
    return `${PRODUCTION_BACKEND}/api`;
  }

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

  const base = getApiBase();
  const url = `${base}${endpoint}`;
  let response;

  try {
    response = await fetch(url, config);
  } catch (networkErr) {
    // In development, try direct localhost fallback if proxy fails
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && base === '/api') {
      try {
        response = await fetch(`http://localhost:5000/api${endpoint}`, config);
      } catch (fallbackErr) {
        const error = new Error('Cannot connect to local backend server (http://localhost:5000). Please start it with: npm run server (or npm run dev)');
        error.status = 0;
        throw error;
      }
    } else {
      const isLocal = base.includes('localhost') || base.includes('127.0.0.1') || base === '/api';
      const msg = isLocal
        ? 'Cannot connect to local backend server (http://localhost:5000). Please start it with: npm run server (or npm run dev)'
        : 'Network error: Unable to reach the backend server. Please check your internet connection or try again shortly.';
      const error = new Error(msg);
      error.status = 0;
      throw error;
    }
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

  // If JSON parsing failed, generate a helpful error based on HTTP status
  if (!data) {
    if (response.status === 404) {
      data = { success: false, message: 'The requested resource was not found. The backend may still be starting up — please try again in a moment.' };
    } else if (response.status === 502 || response.status === 503 || response.status === 504) {
      data = { success: false, message: 'The server is temporarily unavailable. It may be waking up from idle — please try again in 30-60 seconds.' };
    } else if (response.status >= 500) {
      data = { success: false, message: `Server error (HTTP ${response.status}). Please try again later.` };
    } else if (rawText && (rawText.trim().startsWith('<!') || rawText.trim().startsWith('<html'))) {
      // Received HTML instead of JSON — likely a proxy/CDN error page
      data = { success: false, message: 'Received an unexpected response from the server. The backend may be starting up — please try again shortly.' };
    } else {
      data = { success: false, message: rawText ? `Unexpected server response: ${rawText.slice(0, 200)}` : 'Server returned an empty response.' };
    }
  }

  if (!response.ok || (data && data.success === false)) {
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

    // Map common status codes to user-friendly messages if the backend didn't provide one
    let message = data?.message;
    if (!message || message === 'undefined') {
      switch (response.status) {
        case 400: message = 'Invalid request. Please check your input and try again.'; break;
        case 401: message = 'Invalid email or password.'; break;
        case 403: message = 'You do not have permission to perform this action.'; break;
        case 404: message = 'The requested resource was not found.'; break;
        case 409: message = 'A conflict occurred. This resource may already exist.'; break;
        case 429: message = 'Too many requests. Please wait a moment and try again.'; break;
        default: message = `Request failed (HTTP ${response.status}). Please try again.`;
      }
    }

    const error = new Error(message);
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
