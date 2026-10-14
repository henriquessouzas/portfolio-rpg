import { createContext, useContext, useState, type ReactNode } from 'react';
import { dict, type Lang, type Dict } from '@/lib/i18n';

type LangContextValue = {
  lang: Lang;
  t: Dict;
  toggleLang: () => void;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem('lang');
      if (stored === 'pt' || stored === 'en') return stored;
    } catch { /* ignore */ }
    return 'pt';
  });

  function toggleLang() {
    const next: Lang = lang === 'pt' ? 'en' : 'pt';
    setLang(next);
    try { localStorage.setItem('lang', next); } catch { /* ignore */ }
  }

  return (
    <LangContext.Provider value={{ lang, t: dict[lang] as Dict, toggleLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}
