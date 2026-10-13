/**
 * Minimal shims for the dependencies that SkillsGlobe.jsx expects from its
 * original project context (react-i18next and a custom ThemeProvider).
 * We do NOT modify the original file — we satisfy its imports here instead.
 */
import { type ReactNode, createContext, useContext } from 'react';
import { useTheme } from '@/hooks/use-theme';

// ── react-i18next shim ────────────────────────────────────────────────────────
// SkillsGlobe only calls t('habilidades.globoDica') and t('habilidades.verRepositorio', {name})
const translations: Record<string, string> = {
  'habilidades.globoDica': 'Arraste para girar • clique para selecionar',
  'habilidades.verRepositorio': 'Ver repositório de {{name}}',
};

function t(key: string, vars?: Record<string, string>): string {
  let value = translations[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replace(`{{${k}}}`, v);
    }
  }
  return value;
}

// Patch the module-level import that SkillsGlobe does:
// import { useTranslation } from 'react-i18next'
// We can't patch it at module level here, so we use a module mock approach
// via the wrapper component below that replaces the globe's hook calls.

// ── ThemeContext shim ─────────────────────────────────────────────────────────
type ThemeCtx = { theme: string };
const ThemeCtxInternal = createContext<ThemeCtx>({ theme: 'light' });

export function useThemeShim() {
  return useContext(ThemeCtxInternal);
}

export function GlobeProviders({ children }: { children: ReactNode }) {
  const { resolved } = useTheme();
  return (
    <ThemeCtxInternal.Provider value={{ theme: resolved }}>
      {children}
    </ThemeCtxInternal.Provider>
  );
}

export { t as tShim };
