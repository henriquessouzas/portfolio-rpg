// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readStoredTheme,
  storeTheme,
  resolveTheme,
  applyTheme,
} from './theme';

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(e: { matches: boolean }) => void>();
  const mq = {
    matches,
    addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (e: { matches: boolean }) => void) => listeners.delete(fn),
    dispatchChange: (m: boolean) => listeners.forEach((fn) => fn({ matches: m })),
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => mq,
  });
  return mq;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  // reset matchMedia to default (light)
  mockMatchMedia(false);
});

describe('readStoredTheme', () => {
  it('returns system when nothing is stored', () => {
    expect(readStoredTheme()).toBe('system');
  });

  it('returns system for an invalid stored value', () => {
    localStorage.setItem('theme', 'invalid');
    expect(readStoredTheme()).toBe('system');
  });

  it('returns dark when dark is stored', () => {
    localStorage.setItem('theme', 'dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('returns light when light is stored', () => {
    localStorage.setItem('theme', 'light');
    expect(readStoredTheme()).toBe('light');
  });

  it('returns system when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('unavailable');
    });
    expect(readStoredTheme()).toBe('system');
    spy.mockRestore();
  });
});

describe('storeTheme', () => {
  it('persists light and dark', () => {
    storeTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
    storeTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('removes the key for system', () => {
    localStorage.setItem('theme', 'dark');
    storeTheme('system');
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('does not throw when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('unavailable');
    });
    expect(() => storeTheme('dark')).not.toThrow();
    spy.mockRestore();
  });
});

describe('resolveTheme', () => {
  it('resolves light directly', () => {
    expect(resolveTheme('light')).toBe('light');
  });

  it('resolves dark directly', () => {
    expect(resolveTheme('dark')).toBe('dark');
  });

  it('resolves system to light when matchMedia is light', () => {
    mockMatchMedia(false);
    expect(resolveTheme('system')).toBe('light');
  });

  it('resolves system to dark when matchMedia is dark', () => {
    mockMatchMedia(true);
    expect(resolveTheme('system')).toBe('dark');
  });
});

describe('applyTheme', () => {
  it('adds dark class for dark theme', () => {
    applyTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class for light theme', () => {
    document.documentElement.classList.add('dark');
    applyTheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('adds dark class for system when OS is dark', () => {
    mockMatchMedia(true);
    applyTheme('system');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class for system when OS is light', () => {
    document.documentElement.classList.add('dark');
    mockMatchMedia(false);
    applyTheme('system');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('updates meta theme-color when the meta tag exists', () => {
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);

    applyTheme('dark');
    expect(meta.content).toBe('#1a1426');

    applyTheme('light');
    expect(meta.content).toBe('#faf1dc');

    meta.remove();
  });
});
