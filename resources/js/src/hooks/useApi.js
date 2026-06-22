import { useState, useCallback } from 'react';
import api from '@/api/axios';

/**
 * Generic API hook — handles loading, error, and data state.
 *
 * @example
 * const { data, isLoading, error, request } = useApi();
 * const result = await request(() => api.get('/lomba'));
 */
export function useApi() {
  const [data,      setData]      = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);

  const request = useCallback(async (apiFn, { onSuccess, onError } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      const result = res.data;
      setData(result);
      if (typeof onSuccess === 'function') onSuccess(result);
      return { success: true, data: result };
    } catch (err) {
      const msg = err.userMessage || 'Terjadi kesalahan.';
      setError(msg);
      if (typeof onError === 'function') onError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, request, reset };
}

export default useApi;
