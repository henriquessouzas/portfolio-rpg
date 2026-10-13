export type Theme = 'system' | 'light' | 'dark';

const THEME_KEY = 'theme';

const THEME_COLOR_LIGHT = '#faf1dc';
const THEME_COLOR_DARK = '#1a1426';

export function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(THEME_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    // localStorage unavailable
  }
  return 'system';
}

export function storeTheme(theme: Theme): void {
  try {
    if (theme === 'system') {
      localStorage.removeItem(THEME_KEY);
    } else {
      localStorage.setItem(THEME_KEY, theme);
    }
  } catch {
    // localStorage unavailable
  }
}

export function prefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? (prefersDark() ? 'dark' : 'light') : theme;
}

export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) {
    meta.content = resolved === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  }
}
