// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTypewriter } from './use-typewriter';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const SPEED = 40; // chars/s → 25 ms/char

describe('useTypewriter', () => {
  it('starts empty and advances one char per tick', () => {
    const { result } = renderHook(() => useTypewriter('Hi', SPEED, false));
    expect(result.current.visible).toBe('');

    act(() => { vi.advanceTimersByTime(25); });
    expect(result.current.visible).toBe('H');

    act(() => { vi.advanceTimersByTime(25); });
    expect(result.current.visible).toBe('Hi');
    expect(result.current.done).toBe(true);
  });

  it('skip() shows full text immediately', () => {
    const { result } = renderHook(() => useTypewriter('Hello', SPEED, false));
    expect(result.current.visible).toBe('');

    act(() => { result.current.skip(); });
    expect(result.current.visible).toBe('Hello');
    expect(result.current.done).toBe(true);
  });

  it('shows full text immediately with reducedMotion', () => {
    const { result } = renderHook(() => useTypewriter('Hello', SPEED, true));
    expect(result.current.visible).toBe('Hello');
    expect(result.current.done).toBe(true);
  });

  it('resets and restarts when text changes mid-animation', () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTypewriter(text, SPEED, false),
      { initialProps: { text: 'ABC' } },
    );

    act(() => { vi.advanceTimersByTime(25); });
    expect(result.current.visible).toBe('A');

    rerender({ text: 'XY' });
    expect(result.current.visible).toBe('');

    act(() => { vi.advanceTimersByTime(25); });
    expect(result.current.visible).toBe('X');
  });

  it('does not advance after skip even if timers fire', () => {
    const { result } = renderHook(() => useTypewriter('Test', SPEED, false));
    act(() => { result.current.skip(); });
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current.visible).toBe('Test');
  });
});
