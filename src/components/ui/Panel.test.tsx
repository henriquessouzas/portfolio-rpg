import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders children', () => {
    render(<Panel>Conteúdo</Panel>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Panel title="Espada: TypeScript">Conteúdo</Panel>);
    expect(screen.getByText('Espada: TypeScript')).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(<Panel>Sem título</Panel>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
