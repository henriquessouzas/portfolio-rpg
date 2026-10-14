import { useCallback, useSyncExternalStore } from 'react';
import { applyTheme, readStoredTheme, resolveTheme, storeTheme, type Theme } from '@/lib/theme';

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

  return { theme, resolved: resolveTheme(theme), setTheme };
}
