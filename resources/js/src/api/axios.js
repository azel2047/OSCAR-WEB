import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept:         'application/json',
  },
  withCredentials: true,
});

// --- Request interceptor: inject Bearer token ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('oscar_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.config?.url &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/logout')
    ) {
      // Clear auth state and redirect to login
      localStorage.removeItem('oscar_token');
      localStorage.removeItem('oscar_user');
      // Avoid circular import — dispatch custom event
      window.dispatchEvent(new CustomEvent('oscar:unauthorized'));
    }

    // Normalize error message
    let message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Terjadi kesalahan. Silakan coba lagi.';

    // Extract detailed validation errors if they exist
    if (error.response?.data?.errors) {
      const details = Object.values(error.response.data.errors).flat().join(' ');
      if (details) {
        message = `${details}`;
      }
    }

    return Promise.reject({ ...error, userMessage: message });
  }
);

export default api;
