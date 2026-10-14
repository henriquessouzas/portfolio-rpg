import { Hero } from './art';
import { ThemeToggle } from './theme-toggle';

export function Hud({ visited }: { visited: number }) {
  return (
    <div className="hud-bar">
      <div className="hud-bar-left">
        <Hero walking={false} />
        <span
          className="hud-bar-visited"
          aria-live="polite"
          style={{ minWidth: '11ch' }}
        >
          Salas visitadas: {visited}/5
        </span>
      </div>
      <ThemeToggle />
    </div>
  );
}
