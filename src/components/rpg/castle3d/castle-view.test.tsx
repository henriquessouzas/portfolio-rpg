// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { CastleView } from './castle-view';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(props: Partial<Parameters<typeof CastleView>[0]> = {}) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  const onEnter = vi.fn();
  const onModeChange = vi.fn();
  act(() => root.render(<CastleView reducedMotion={false} entering={false} onEnter={onEnter} onModeChange={onModeChange} {...props} />));
  return { host, onEnter, onModeChange, unmount: () => act(() => root.unmount()) };
}

describe('CastleView without WebGL (fallback)', () => {
  it('shows the pixel art scene and the enter button, and reports image mode', () => {
    const { host, onModeChange, unmount } = mount();
    expect(host.querySelector('.wind-scene')).not.toBeNull();
    expect(host.querySelector('button.castle-cta')?.textContent).toContain('Entrar no castelo');
    expect(onModeChange).toHaveBeenCalledWith('image');
    expect(host.querySelector('canvas.r3f, .castle-tools')).toBeNull();
    unmount();
  });
  it('calls onEnter when the button is clicked', () => {
    const { host, onEnter, unmount } = mount();
    act(() => host.querySelector<HTMLButtonElement>('button.castle-cta')?.click());
    expect(onEnter).toHaveBeenCalledTimes(1);
    unmount();
  });
  it('disables the button and zooms the scene while entering', () => {
    const { host, unmount } = mount({ entering: true });
    const button = host.querySelector<HTMLButtonElement>('button.castle-cta');
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain('Abrindo os portões');
    expect(host.querySelector('.castle-stage')?.classList.contains('castle-entering')).toBe(true);
    unmount();
  });
});
