import { create } from 'zustand';
import api from '@/api/axios';

const usePendaftaranStore = create((set, get) => ({
  // --- State ---
  daftarList:  [],
  detail:      null,
  isLoading:   false,
  isSubmitting: false,
  error:       null,
  submitError: null,
  pagination:  { current_page: 1, last_page: 1, total: 0 },

  // --- Form draft (multi-step) ---
  formDraft: {
    step:         1,
    lomba_id:     null,
    data_tim:     {},
    anggota:      [],
    berkas:       {},
  },

  setFormDraft: (partial) =>
    set((state) => ({ formDraft: { ...state.formDraft, ...partial } })),

  nextStep: () =>
    set((state) => ({ formDraft: { ...state.formDraft, step: state.formDraft.step + 1 } })),

  prevStep: () =>
    set((state) => ({ formDraft: { ...state.formDraft, step: Math.max(1, state.formDraft.step - 1) } })),

  resetForm: () =>
    set({ formDraft: { step: 1, lomba_id: null, data_tim: {}, anggota: [], berkas: {} } }),

  // --- Actions ---
  fetchMyPendaftaran: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/pendaftaran/saya');
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      set({
        daftarList:  list,
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

  fetchDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/pendaftaran/saya/${id}`);
      set({ detail: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.userMessage });
    }
  },

  submitPendaftaran: async (formData) => {
    set({ isSubmitting: true, submitError: null });
    try {
      const { data } = await api.post('/pendaftaran', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ isSubmitting: false });
      return { success: true, data };
    } catch (err) {
      set({ isSubmitting: false, submitError: err.userMessage });
      return { success: false, message: err.userMessage };
    }
  },

  clearDetail:     () => set({ detail: null }),
  clearError:      () => set({ error: null, submitError: null }),
}));

export default usePendaftaranStore;
