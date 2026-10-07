import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Hud } from './Hud';

describe('Hud', () => {
  it('renders the nav label', () => {
    render(<Hud label="Mapa ▸ Arsenal" />);
    expect(screen.getByText('Mapa ▸ Arsenal')).toBeInTheDocument();
  });

  it('renders back button when onBack is provided', () => {
    render(<Hud label="Mapa ▸ Arsenal" onBack={() => {}} />);
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
  });

  it('does not render back button when onBack is absent', () => {
    render(<Hud label="Mapa ▸ Arsenal" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', async () => {
    const onBack = vi.fn();
    render(<Hud label="Mapa ▸ Arsenal" onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(onBack).toHaveBeenCalledOnce();
  });
});
