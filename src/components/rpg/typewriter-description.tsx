import { useTypewriter } from '@/hooks/use-typewriter';
import { useLang } from '@/hooks/use-lang';

const SPEED = 40; // chars/s

export function TypewriterDescription({
  text,
  reducedMotion,
}: {
  text: string;
  reducedMotion: boolean;
}) {
  const { visible, done, skip } = useTypewriter(text, SPEED, reducedMotion);
  const { t } = useLang();

  return (
    <div
      className="typewriter-wrap"
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') skip();
      }}
      role="presentation"
    >
      {/* Screen reader always gets the full text announced once */}
      <span className="sr-only" aria-live="polite">
        {text}
      </span>

      {/* Animated text hidden from screen readers */}
      <p className="typewriter-text" aria-hidden="true">
        {visible}
        {!done && <span className="typewriter-cursor" aria-hidden="true" />}
      </p>

      {!done && (
        <span className="typewriter-hint" aria-hidden="true">
          {t.clickToSkip}
        </span>
      )}
    </div>
  );
}
