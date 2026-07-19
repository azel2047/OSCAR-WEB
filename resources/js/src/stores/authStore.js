import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- State ---
      user:  null,
      token: null,
      isLoading: false,
      error: null,

      // --- Getters ---
      isLoggedIn:  () => !!get().token,
      isAdmin:     () => get().user?.role === 'admin',
      isPeserta:   () => get().user?.role === 'peserta',

      // --- Actions ---
      setUser:  (user)  => {
        set({ user });
        if (user) {
          localStorage.setItem('oscar_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('oscar_user');
        }
      },
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),

      /** Register new user */
      register: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/register', payload);
          set({
            user:      data.data.user,
            token:     data.data.token,
            isLoading: false,
          });
          localStorage.setItem('oscar_token', data.data.token);
          localStorage.setItem('oscar_user',  JSON.stringify(data.data.user));
          return { success: true };
        } catch (err) {
          set({ isLoading: false, error: err.userMessage });
          return { success: false, message: err.userMessage };
        }
      },

      /** Login with email + password */
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          set({
            user:      data.data.user,
            token:     data.data.token,
            isLoading: false,
          });
          localStorage.setItem('oscar_token', data.data.token);
          localStorage.setItem('oscar_user',  JSON.stringify(data.data.user));
          return { success: true, role: data.data.user.role };
        } catch (err) {
          set({ isLoading: false, error: err.userMessage });
          return { success: false, message: err.userMessage };
        }
      },

      /** Logout */
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (_) {
          // ignore
        } finally {
          set({ user: null, token: null, error: null });
          localStorage.removeItem('oscar_token');
          localStorage.removeItem('oscar_user');
        }
      },

      /** Forgot password */
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/forgot-password', { email });
          set({ isLoading: false });
          return { success: true, message: data.message };
        } catch (err) {
          set({ isLoading: false, error: err.userMessage });
          return { success: false, message: err.userMessage };
        }
      },

      /** Reset password */
      resetPassword: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await api.post('/auth/reset-password', payload);
          set({ isLoading: false });
          return { success: true, message: data.message };
        } catch (err) {
          set({ isLoading: false, error: err.userMessage });
          return { success: false, message: err.userMessage };
        }
      },

      /** Refresh current user profile from server */
      fetchProfile: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.data });
          localStorage.setItem('oscar_user', JSON.stringify(data.data));
        } catch (_) {
          // token expired
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name:    'oscar-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

// Listen for 401 from Axios interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('oscar:unauthorized', () => {
    useAuthStore.getState().logout();
  });
}

export default useAuthStore;
