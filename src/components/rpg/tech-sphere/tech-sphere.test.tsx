// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TechSphere from './tech-sphere';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('TechSphere', () => {
  it('renders with items', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as any);
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      })),
      configurable: true,
    });

    render(
      <TechSphere
        items={[
          { name: 'React', category: 'Front-end', level: 95 },
          { name: 'Docker', category: 'Ferramentas', level: 80 },
        ]}
        reducedMotion={false}
      />,
    );

    expect(screen.getByRole('button', { name: 'Ver como lista' })).toBeInTheDocument();
    expect(screen.getByLabelText('React')).toBeInTheDocument();
  });

  it('shows the accessible list when the sphere is unavailable', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    })));

    render(
      <TechSphere
        items={[
          { name: 'React', category: 'Front-end', level: 95 },
          { name: 'Docker', category: 'Ferramentas', level: 80 },
        ]}
        reducedMotion={true}
      />,
    );

    expect(screen.getByLabelText('Buscar tecnologia')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('calls onSelect when a sphere item is clicked', () => {
    const onSelect = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as any);

    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      })),
      configurable: true,
    });

    render(
      <TechSphere
        items={[
          { name: 'React', category: 'Front-end', level: 95 },
          { name: 'Docker', category: 'Ferramentas', level: 80 },
        ]}
        onSelect={onSelect}
        reducedMotion={false}
      />,
    );

    fireEvent.click(screen.getByLabelText('React'));
    expect(onSelect).toHaveBeenCalledWith('React');
  });
});
