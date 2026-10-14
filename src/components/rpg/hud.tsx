import { Hero } from './art';
import { ThemeToggle } from './theme-toggle';
import { LangToggle } from './lang-toggle';
import { useLang } from '@/hooks/use-lang';

export function Hud({ visited }: { visited: number }) {
  const { t } = useLang();
  return (
    <div className="hud-bar">
      <div className="hud-bar-left">
        <Hero walking={false} />
        <span
          className="hud-bar-visited"
          aria-live="polite"
          style={{ minWidth: '11ch' }}
        >
          {t.roomsVisited(visited)}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <LangToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
