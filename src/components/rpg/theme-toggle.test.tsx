// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeToggle } from './theme-toggle';

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: () => ({
      matches,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  mockMatchMedia(false);
});

describe('ThemeToggle', () => {
  it('renders 3 radio buttons', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const radios = host.querySelectorAll('[role="radio"]');
    expect(radios).toHaveLength(3);
    act(() => root.unmount());
    host.remove();
  });

  it('Sistema starts checked', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const sistema = host.querySelector('[aria-label="Sistema"]');
    expect(sistema?.getAttribute('aria-checked')).toBe('true');
    act(() => root.unmount());
    host.remove();
  });

  it('clicking Escuro adds dark class and stores dark', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const escuro = host.querySelector('[aria-label="Escuro"]') as HTMLButtonElement;
    act(() => escuro.click());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    act(() => root.unmount());
    host.remove();
  });

  it('clicking Claro removes dark class', () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const claro = host.querySelector('[aria-label="Claro"]') as HTMLButtonElement;
    act(() => claro.click());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    act(() => root.unmount());
    host.remove();
  });

  it('ArrowRight moves selection from Sistema to Claro', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const group = host.querySelector('[role="radiogroup"]') as HTMLElement;
    act(() => {
      group.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      );
    });
    const claro = host.querySelector('[aria-label="Claro"]');
    expect(claro?.getAttribute('aria-checked')).toBe('true');
    act(() => root.unmount());
    host.remove();
  });

  it('ArrowLeft wraps from Sistema to Escuro', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = createRoot(host);
    act(() => root.render(<ThemeToggle />));
    const group = host.querySelector('[role="radiogroup"]') as HTMLElement;
    act(() => {
      group.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
      );
    });
    const escuro = host.querySelector('[aria-label="Escuro"]');
    expect(escuro?.getAttribute('aria-checked')).toBe('true');
    act(() => root.unmount());
    host.remove();
  });
});
