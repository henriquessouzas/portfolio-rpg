import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock useReducedMotion to always return true — skips all animations/timers
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => true,
}));

describe('App navigation flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts on castle screen', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /entrar no castelo/i })).toBeInTheDocument();
  });

  it('castle → map: clicking the castle enters the map', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /entrar no castelo/i }));
    expect(screen.getByText('Castelo ▸ Mapa')).toBeInTheDocument();
  });

  it('map → room: clicking a room enters it', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /entrar no castelo/i }));
    await userEvent.click(screen.getByRole('button', { name: /ir para arsenal/i }));
    expect(screen.getByText(/Mapa ▸ Arsenal/i)).toBeInTheDocument();
  });

  it('room → map: clicking back returns to map', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /entrar no castelo/i }));
    await userEvent.click(screen.getByRole('button', { name: /ir para arsenal/i }));
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(screen.getByText('Castelo ▸ Mapa')).toBeInTheDocument();
  });

  it('map → castle: clicking exit returns to castle', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /entrar no castelo/i }));
    await userEvent.click(screen.getByRole('button', { name: /voltar/i }));
    expect(screen.getByRole('button', { name: /entrar no castelo/i })).toBeInTheDocument();
  });

  it('castle → simple: clicking skip opens simple screen stub', async () => {
    render(<App />);
    await userEvent.click(screen.getByRole('button', { name: /pular o jogo/i }));
    // simple screen not yet implemented — App stays on castle (openSimple dispatched)
    // just verify no crash and skip button was clickable
    expect(screen.queryByRole('button', { name: /entrar no castelo/i })).not.toBeInTheDocument();
  });
});
