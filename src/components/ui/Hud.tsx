import { Button } from './Button';
import styles from './Hud.module.css';

type HudProps = {
  label: string;
  onBack?: () => void;
};

export function Hud({ label, onBack }: HudProps) {
  return (
    <nav className={styles.hud} aria-label="Navegação da sala">
      <span className={styles.label}>{label}</span>
      {onBack && (
        <Button variant="secondary" onClick={onBack} aria-label="Voltar">
          ← Voltar
        </Button>
      )}
    </nav>
  );
}
