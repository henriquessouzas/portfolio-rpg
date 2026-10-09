import { Button } from './Button';
import styles from './Hud.module.css';

type HudProps = {
  label: string;
  onBack?: () => void;
  focusRef?: React.RefObject<HTMLElement | null>;
};

export function Hud({ label, onBack, focusRef }: HudProps) {
  return (
    <nav
      className={styles.hud}
      aria-label="Navegação da sala"
      tabIndex={-1}
      ref={(el) => { if (focusRef) focusRef.current = el; }}
    >
      <span className={styles.label}>{label}</span>
      {onBack && (
        <Button variant="secondary" onClick={onBack} aria-label="Voltar">
          ← Voltar
        </Button>
      )}
    </nav>
  );
}
