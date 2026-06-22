import { create } from 'zustand';
import api from '@/api/axios';
import useAuthStore from '@/stores/authStore';

const useNotifStore = create((set, get) => ({
  // --- State ---
  notifications: [],
  unreadCount:   0,
  isLoading:     false,

  // --- Actions ---
  fetchNotifications: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;

    set({ isLoading: true });
    try {
      const { data } = await api.get('/notifikasi');
      const list   = Array.isArray(data) ? data : (data?.data ?? []);
      const unread = list.filter((n) => !n.read_at).length;
      set({ notifications: list, unreadCount: unread, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        // Clear notifications and count
        set({ notifications: [], unreadCount: 0 });
        // Stop polling to prevent loop warnings
        const { _pollId } = get();
        if (_pollId) {
          clearInterval(_pollId);
          set({ _pollId: null });
        }
        // Dispatch unauthorized event if 401
        if (status === 401) {
          window.dispatchEvent(new Event('oscar:unauthorized'));
        }
      }
    }
  },


  markAsRead: async (id) => {
    try {
      await api.patch(`/notifikasi/${id}/baca`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (_) {}
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifikasi/baca-semua');
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          read_at: n.read_at || new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (_) {}
  },

  /** Poll every N seconds — call from App on login */
  startPolling: (intervalMs = 30000) => {
    const id = setInterval(() => get().fetchNotifications(), intervalMs);
    set({ _pollId: id });
  },

  stopPolling: () => {
    const { _pollId } = get();
    if (_pollId) {
      clearInterval(_pollId);
      set({ _pollId: null });
    }
  },

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
}));

export default useNotifStore;
