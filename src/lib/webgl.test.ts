import { afterEach, describe, expect, it, vi } from 'vitest';
import { canUse3D } from './webgl';

describe('canUse3D', () => {
  const originalMatchMedia = window.matchMedia;
  const originalConnection = navigator.connection;

  afterEach(() => {
    window.history.pushState({}, '', '/');
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: originalConnection,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({})),
    });
  });

  it('returns false when the query string disables WebGL', () => {
    window.history.pushState({}, '', '/?3d=0');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: false },
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({})),
    });

    expect(canUse3D()).toBe(false);
  });

  it('forces true only when the query string requests it and WebGL2 is available', () => {
    window.history.pushState({}, '', '/?3d=1');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: false },
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({ getParameter: vi.fn() })),
    });

    expect(canUse3D()).toBe(true);
  });

  it('returns false when reduced-motion preference is enabled', () => {
    window.history.pushState({}, '', '/');
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: false },
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({ getParameter: vi.fn() })),
    });

    expect(canUse3D()).toBe(false);
  });

  it('returns false when saveData is enabled', () => {
    window.history.pushState({}, '', '/');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => ({ getParameter: vi.fn() })),
    });

    expect(canUse3D()).toBe(false);
  });

  it('returns false when WebGL2 context creation fails', () => {
    window.history.pushState({}, '', '/');
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: false },
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => null),
    });

    expect(canUse3D()).toBe(false);
  });
});
