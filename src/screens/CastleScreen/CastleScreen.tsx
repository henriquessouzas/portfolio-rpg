import { useCallback, useState } from 'react';
import { Button } from '@/components/ui';
import { profile } from '@/content/profile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './CastleScreen.module.css';
import { CastleSvg } from './CastleSvg';

type CastleScreenProps = {
  onEnter: () => void;
  onSkip: () => void;
};

type Phase = 'idle' | 'zooming' | 'opening' | 'done';

export function CastleScreen({ onEnter, onSkip }: CastleScreenProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('idle');

  const handleEnter = useCallback(() => {
    if (phase !== 'idle') return;

    if (reduced) {
      onEnter();
      return;
    }

    setPhase('zooming');

    // 650ms: começa a abrir a ponte
    setTimeout(() => setPhase('opening'), 650);

    // 1550ms: chama onEnter
    setTimeout(() => {
      setPhase('done');
      onEnter();
    }, 1550);
  }, [phase, reduced, onEnter]);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.name}>{profile.name}</h1>
        <Button variant="secondary" onClick={onSkip} aria-label="Pular o jogo e ver versão simples">
          Pular o jogo
        </Button>
      </header>

      <button
        className={[styles.castleWrapper, phase === 'zooming' || phase === 'opening' || phase === 'done' ? styles.zoomed : ''].join(' ').trim()}
        onClick={handleEnter}
        aria-label="Entrar no castelo"
        disabled={phase !== 'idle'}
      >
        <CastleSvg drawbridgeOpen={phase === 'opening' || phase === 'done'} />
      </button>

      <p className={styles.hint}>Clique no castelo para entrar</p>
    </div>
  );
}
