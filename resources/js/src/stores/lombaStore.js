import { create } from 'zustand';
import api from '@/api/axios';

const useLombaStore = create((set, get) => ({
  // --- State ---
  lombaList:   [],
  lombaDetail: null,
  faq:         [],
  timeline:    [],
  isLoading:   false,
  error:       null,
  pagination:  { current_page: 1, last_page: 1, total: 0 },

  // --- Filters ---
  filters: {
    search:   '',
    kategori: '',
    status:   '',
    page:     1,
    per_page: 12,
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters, page: 1 } })),

  // --- Actions ---
  fetchLomba: async () => {
    const { filters } = get();
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/lomba?${params.toString()}`);
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      set({
        lombaList:  list,
        pagination: {
          current_page: data?.current_page || 1,
          last_page:    data?.last_page    || 1,
          total:        data?.total        || list.length,
        },
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false, error: err.userMessage });
    }
  },

  fetchLombaDetail: async (slug) => {
    set({ isLoading: true, error: null, lombaDetail: null });
    try {
      const { data } = await api.get(`/lomba/${slug}`);
      set({ lombaDetail: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.userMessage });
    }
  },

  fetchFaq: async (lombaId) => {
    try {
      const { data } = await api.get(`/lomba/${lombaId}/faq`);
      set({ faq: Array.isArray(data) ? data : (data?.data ?? []) });
    } catch (_) {}
  },

  fetchTimeline: async (lombaId) => {
    try {
      const { data } = await api.get(`/lomba/${lombaId}/timeline`);
      set({ timeline: Array.isArray(data) ? data : (data?.data ?? []) });
    } catch (_) {}
  },

  nextPage: () => {
    const { pagination, filters } = get();
    if (filters.page < pagination.last_page) {
      set((state) => ({ filters: { ...state.filters, page: state.filters.page + 1 } }));
      get().fetchLomba();
    }
  },

  prevPage: () => {
    const { filters } = get();
    if (filters.page > 1) {
      set((state) => ({ filters: { ...state.filters, page: state.filters.page - 1 } }));
      get().fetchLomba();
    }
  },

  clearDetail: () => set({ lombaDetail: null, faq: [], timeline: [] }),
  clearError:  () => set({ error: null }),
}));

export default useLombaStore;
