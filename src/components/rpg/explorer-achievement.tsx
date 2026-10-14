import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'achievement:explorer';

function hasSeenAchievement(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markAchievementSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    // storage unavailable — show once per session only
  }
}

export function ExplorerAchievement({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const timer = setTimeout(onClose, 8000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="achievement-toast" role="status" aria-live="polite">
      <div className="achievement-icon">✦</div>
      <div className="achievement-body">
        <strong className="achievement-title">Explorador do castelo</strong>
        <p className="achievement-text">Você visitou as cinco salas. Obrigado pela visita!</p>
      </div>
      <button
        ref={closeRef}
        type="button"
        className="achievement-close"
        aria-label="Fechar conquista"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}

export { hasSeenAchievement, markAchievementSeen };
