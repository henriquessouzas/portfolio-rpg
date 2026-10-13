import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  applyTheme,
  prefersDark,
  readStoredTheme,
  storeTheme,
  type Theme,
} from '@/lib/theme';

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((l) => l());
}

function getSnapshot(): Theme {
  return readStoredTheme();
}

export function useTheme(): {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
} {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const setTheme = useCallback((next: Theme) => {
    storeTheme(next);
    applyTheme(next);
    notify();
  }, []);

  // When theme is 'system', re-apply whenever the OS preference changes.
  useEffect(() => {
    if (theme !== 'system') return;
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const handler = () => {
      applyTheme('system');
      notify();
    };
    mq.addEventListener('change', handler);
    return () => mq?.removeEventListener('change', handler);
  }, [theme]);

  const resolved: 'light' | 'dark' =
    theme === 'system' ? (prefersDark() ? 'dark' : 'light') : theme;

  return { theme, resolved, setTheme };
}
