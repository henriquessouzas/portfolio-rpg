import { useRef, type KeyboardEvent } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/lib/theme';

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Escuro', Icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = OPTIONS.findIndex((o) => o.value === theme);
    let next = current;
    if (e.key === 'ArrowRight') next = (current + 1) % OPTIONS.length;
    else if (e.key === 'ArrowLeft') next = (current - 1 + OPTIONS.length) % OPTIONS.length;
    else return;
    e.preventDefault();
    const opt = OPTIONS[next];
    if (opt) {
      setTheme(opt.value);
      refs.current[next]?.focus();
    }
  }

  return (
    <div role="radiogroup" aria-label="Tema" className="theme-toggle" onKeyDown={onKeyDown}>
      {OPTIONS.map(({ value, label, Icon }, i) => {
        const checked = theme === value;
        return (
          <button
            key={value}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={`theme-toggle-btn pixel-button${checked ? ' theme-toggle-active' : ''}`}
            onClick={() => setTheme(value)}
            aria-label={label}
          >
            <Icon size={14} aria-hidden="true" />
            <span className="theme-toggle-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
