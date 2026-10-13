// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDraggable } from './use-draggable';

describe('useDraggable', () => {
  it('moves with pointer drag and clamps to the window bounds', () => {
    const onChange = vi.fn();
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 700, writable: true });

    const { result } = renderHook(() =>
      useDraggable({
        initialPosition: { x: 40, y: 50 },
        bounds: { width: 300, height: 220 },
        onChange,
      }),
    );

    act(() => {
      result.current.handlePointerDown({
        clientX: 100,
        clientY: 80,
        pointerId: 1,
        preventDefault: () => {},
        currentTarget: document.createElement('div'),
      } as any);
    });

    act(() => {
      result.current.handlePointerMove({
        clientX: 180,
        clientY: 210,
        pointerId: 1,
      } as any);
    });

    expect(result.current.position).toEqual({ x: 120, y: 180 });
    expect(onChange).toHaveBeenCalled();

    act(() => {
      result.current.handlePointerMove({
        clientX: 2000,
        clientY: 3000,
        pointerId: 1,
      } as any);
    });

    expect(result.current.position.x).toBeLessThanOrEqual(1200 - 300 - 8);
    expect(result.current.position.y).toBeLessThanOrEqual(700 - 220 - 8);
  });

  it('does not drag on small screens', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 700, writable: true });

    const { result } = renderHook(() =>
      useDraggable({
        initialPosition: { x: 10, y: 20 },
        bounds: { width: 300, height: 200 },
      }),
    );

    act(() => {
      result.current.handlePointerDown({
        clientX: 100,
        clientY: 80,
        pointerId: 1,
        preventDefault: () => {},
        currentTarget: document.createElement('div'),
      } as any);
    });

    expect(result.current.position).toEqual({ x: 10, y: 20 });
  });
});
