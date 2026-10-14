import { useLang } from '@/hooks/use-lang';

export function LangToggle() {
  const { t, toggleLang } = useLang();
  return (
    <button
      type="button"
      className="lang-toggle-btn pixel-button"
      onClick={toggleLang}
      aria-label={t.langLabel}
      title={t.langLabel}
    >
      {t.langToggle}
    </button>
  );
}
