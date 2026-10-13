import { useCallback, useEffect, useRef, useState } from 'react';

export type DraggablePosition = {
  x: number;
  y: number;
};

export type UseDraggableOptions = {
  initialPosition?: DraggablePosition;
  bounds?: {
    width: number;
    height: number;
  };
  disabled?: boolean;
  onChange?: (position: DraggablePosition) => void;
};

type PointerLike = {
  clientX: number;
  clientY: number;
  pointerId?: number;
  preventDefault?: () => void;
  currentTarget?: {
    setPointerCapture?: (pointerId: number) => void;
    releasePointerCapture?: (pointerId: number) => void;
  };
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const snap = (value: number) => Math.round(value);

export function useDraggable({
  initialPosition = { x: 0, y: 0 },
  bounds = { width: 0, height: 0 },
  disabled = false,
  onChange,
}: UseDraggableOptions = {}) {
  const [position, setPositionState] = useState<DraggablePosition>(initialPosition);
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    originX: initialPosition.x,
    originY: initialPosition.y,
  });

  const clampPosition = useCallback(
    (next: DraggablePosition): DraggablePosition => {
      const width = Math.max(bounds.width, 0);
      const height = Math.max(bounds.height, 0);
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);

      return {
        x: snap(clamp(next.x, 8, maxX)),
        y: snap(clamp(next.y, 8, maxY)),
      };
    },
    [bounds.height, bounds.width],
  );

  const setPosition = useCallback(
    (next: DraggablePosition | ((prev: DraggablePosition) => DraggablePosition)) => {
      setPositionState((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        const clamped = clampPosition(resolved);
        onChange?.(clamped);
        return clamped;
      });
    },
    [clampPosition, onChange],
  );

  useEffect(() => {
    if (disabled) return;
    setPositionState((current) => clampPosition(current));
  }, [bounds.height, bounds.width, clampPosition, disabled]);

  const handlePointerDown = useCallback(
    (event: PointerLike) => {
      if (disabled || window.innerWidth < 640) return;
      event.preventDefault?.();
      dragRef.current = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };

      event.currentTarget?.setPointerCapture?.(event.pointerId ?? 1);
    },
    [disabled, position.x, position.y],
  );

  const handlePointerMove = useCallback(
    (event: PointerLike) => {
      if (!dragRef.current.active) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      setPosition((prev) => ({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      }));
    },
    [setPosition],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  useEffect(() => {
    if (disabled || window.innerWidth < 640) return;

    const onMove = (event: PointerEvent) => {
      if (!dragRef.current.active) return;
      handlePointerMove(event);
    };

    const onUp = () => {
      handlePointerUp();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [disabled, handlePointerMove, handlePointerUp]);

  return {
    position,
    setPosition,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
