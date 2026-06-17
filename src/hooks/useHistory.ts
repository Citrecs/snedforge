import { useCallback, useState } from 'react';
import type { QuizAttempt } from '../types/session';
import { getAttempts, addAttempt as persistAttempt, clearHistory } from '../lib/storage/historyRepo';

/**
 * Reads persisted quiz history. History lives outside React state (localStorage),
 * so call `refresh()` after writing, or use `record()` which writes + refreshes.
 */
export function useHistory() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() => getAttempts());

  const refresh = useCallback(() => setAttempts(getAttempts()), []);

  const record = useCallback((attempt: QuizAttempt) => {
    persistAttempt(attempt);
    setAttempts(getAttempts());
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setAttempts([]);
  }, []);

  return { attempts, refresh, record, clear };
}
