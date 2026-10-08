import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GRID } from './mapData';
import type { Pos } from './mapData';
import { findPath } from './pathfinding';

type UseHeroWalkOptions = {
  pos: Pos;
  onMove: (pos: Pos) => void;
};

type UseHeroWalkResult = {
  walking: boolean;
  walkTo: (goal: Pos, onArrival?: () => void) => void;
};

export function useHeroWalk({ pos, onMove }: UseHeroWalkOptions): UseHeroWalkResult {
  const reduced = useReducedMotion();
  const [walking, setWalking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const posRef = useRef<Pos>(pos);
  const onMoveRef = useRef(onMove);

  useEffect(() => { posRef.current = pos; });
  useEffect(() => { onMoveRef.current = onMove; });

  const walkTo = useCallback(
    (goal: Pos, onArrival?: () => void) => {
      if (walking) return;

      const path = findPath(GRID, posRef.current, goal);
      if (path.length === 0) return;

      if (reduced) {
        onMoveRef.current(goal);
        onArrival?.();
        return;
      }

      const steps = path.slice(1);
      if (steps.length === 0) {
        onArrival?.();
        return;
      }

      setWalking(true);
      let i = 0;

      intervalRef.current = setInterval(() => {
        onMoveRef.current(steps[i]);
        i++;
        if (i >= steps.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setWalking(false);
          onArrival?.();
        }
      }, 120);
    },
    [walking, reduced],
  );

  return { walking, walkTo };
}
