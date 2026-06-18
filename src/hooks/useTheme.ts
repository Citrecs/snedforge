import { useCallback, useState } from 'react';

type Theme = 'light' | 'dark';

const KEY = 'learncard.theme';

function current(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Light/dark theme toggle. The initial class is applied by an inline script in
 * index.html (before paint, defaulting to dark); this hook reads and flips it,
 * persisting the choice to localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => current());

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // ignore storage failures
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
