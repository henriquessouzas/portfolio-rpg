import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useDraggable } from '@/hooks/use-draggable';

const POPUP_MEMORY = new Map<string, { x: number; y: number }>();

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export type PopupProps = {
  title: string;
  onClose: () => void;
  width?: number;
  initialAnchor?: { x: number; y: number } | null;
  storageKey?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function Popup({
  title,
  onClose,
  width = 560,
  initialAnchor = null,
  storageKey,
  footer,
  children,
}: PopupProps) {
  const titleId = useId();
  const descriptionId = useId();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const compact = typeof window !== 'undefined' && window.innerWidth < 640;

  const getBounds = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = compact ? Math.min(viewportWidth * 0.92, width) : width;
    const popupHeight = compact ? Math.min(viewportHeight * 0.85, 680) : Math.min(viewportHeight * 0.8, 680);

    return {
      width: popupWidth,
      height: popupHeight,
    };
  };

  const defaultPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { width: popupWidth, height: popupHeight } = getBounds();

    if (initialAnchor) {
      return { x: initialAnchor.x, y: initialAnchor.y };
    }

    return {
      x: clamp((viewportWidth - popupWidth) / 2, 8, Math.max(8, viewportWidth - popupWidth - 8)),
      y: clamp((viewportHeight - popupHeight) / 2, 8, Math.max(8, viewportHeight - popupHeight - 8)),
    };
  };

  const [initialPosition] = useState(() => {
    if (storageKey) {
      const stored = POPUP_MEMORY.get(storageKey);
      if (stored) return stored;
    }
    return defaultPosition();
  });

  const { position, handlePointerDown, handlePointerMove, handlePointerUp, setPosition } = useDraggable({
    initialPosition,
    bounds: getBounds(),
    disabled: compact,
    onChange: (next) => {
      if (storageKey) {
        POPUP_MEMORY.set(storageKey, next);
      }
    },
  });

  useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    containerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (storageKey) {
      POPUP_MEMORY.set(storageKey, position);
    }
  }, [position, storageKey]);

  const handleClose = () => {
    openerRef.current?.focus();
    onClose();
  };

  useEffect(() => {
    const handleResize = () => {
      const next = defaultPosition();
      setPosition(next);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, setPosition]);

  useEffect(() => {
    return () => {
      const restoreTarget = openerRef.current;
      if (restoreTarget) {
        requestAnimationFrame(() => restoreTarget.focus());
      }
    };
  }, []);

  const handleTitleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      handleClose();
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const step = event.shiftKey ? 64 : 16;
      const delta = {
        ArrowRight: { x: step, y: 0 },
        ArrowLeft: { x: -step, y: 0 },
        ArrowDown: { x: 0, y: step },
        ArrowUp: { x: 0, y: -step },
      }[event.key];

      setPosition((prev) => {
        const next = {
          x: prev.x + delta.x,
          y: prev.y + delta.y,
        };

        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          next.y = prev.y;
        }

        return next;
      });
    }
  };

  const handleTitlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (compact) return;
    if ((event.target as HTMLElement | null)?.closest('.popup-close')) return;
    handlePointerDown({
      clientX: event.clientX,
      clientY: event.clientY,
      pointerId: event.pointerId,
      preventDefault: () => event.preventDefault(),
      currentTarget: event.currentTarget,
    });
  };

  const handleTitlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (compact) return;
    handlePointerMove({ clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId });
  };

  const handleTitlePointerUp = () => {
    if (compact) return;
    handlePointerUp();
  };

  const dialog = (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="popup-shell"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: compact ? '92vw' : `${width}px`,
        maxWidth: compact ? '92vw' : `${width}px`,
        maxHeight: compact ? '85dvh' : '80dvh',
      }}
      tabIndex={-1}
    >
      <div
        ref={titleRef}
        className="popup-titlebar"
        tabIndex={0}
        onKeyDown={handleTitleKeyDown}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerLeave={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
      >
        <h2 id={titleId}>{title}</h2>
        <button
          type="button"
          className="popup-close"
          aria-label="Fechar"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            handleClose();
          }}
        >
          ×
        </button>
      </div>
      <div className="popup-body" aria-live="polite">
        {children}
      </div>
      {footer ? <div className="popup-footer">{footer}</div> : null}
      <span id={descriptionId} className="sr-only">
        Use as setas para mover a janela.
      </span>
    </div>
  );

  return createPortal(dialog, document.body);
}
