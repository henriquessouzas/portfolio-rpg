import { Hero } from './art';
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
    </div>
  );
}
