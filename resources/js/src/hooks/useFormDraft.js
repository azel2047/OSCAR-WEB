import { useState, useEffect, useCallback } from 'react';

/**
 * Persists multi-step form state to localStorage to survive page refresh.
 *
 * @param {string} storageKey   - unique key per form (e.g., 'oscar-form-draft-lomba-5')
 * @param {object} initialState - initial form values
 *
 * @example
 * const { draft, setDraft, clearDraft } = useFormDraft('oscar-reg-123', { nama_tim: '' });
 */
export function useFormDraft(storageKey, initialState = {}) {
  const [draft, _setDraft] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
    } catch {
      return initialState;
    }
  });

  // Persist on every change (excluding non-serializable files)
  useEffect(() => {
    try {
      const cleanDraft = { ...draft };
      if (cleanDraft.berkas) {
        cleanDraft.berkas = {};
      }
      localStorage.setItem(storageKey, JSON.stringify(cleanDraft));
    } catch {
      // quota exceeded — ignore
    }
  }, [storageKey, draft]);

  const setDraft = useCallback((partial) => {
    _setDraft((prev) =>
      typeof partial === 'function' ? partial(prev) : { ...prev, ...partial }
    );
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    _setDraft(initialState);
  }, [storageKey]);

  return { draft, setDraft, clearDraft };
}

export default useFormDraft;
