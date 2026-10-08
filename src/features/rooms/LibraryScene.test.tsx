import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LibraryScene } from './LibraryScene';

describe('LibraryScene', () => {
  it('renders all three category shelves', () => {
    render(<LibraryScene />);
    expect(screen.getByText('Cursos')).toBeInTheDocument();
    expect(screen.getByText('Certificados')).toBeInTheDocument();
    expect(screen.getByText('Projetos')).toBeInTheDocument();
  });

  it('shows detail panel with book title after clicking a book', async () => {
    vi.useFakeTimers();
    render(<LibraryScene />);

    const book = screen.getByRole('button', { name: /Estante de Cursos/i });
    await userEvent.click(book);

    // Panel appears after 500ms
    act(() => { vi.advanceTimersByTime(500); });

    expect(screen.getByRole('region', { name: /Detalhes: Estante de Cursos/i })).toBeInTheDocument();
    expect(screen.getByText('Estante de Cursos')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('marks clicked book as active', async () => {
    render(<LibraryScene />);
    const book = screen.getByRole('button', { name: /Estante de Certificados/i });
    await userEvent.click(book);
    expect(book).toHaveAttribute('aria-pressed', 'true');
  });
});
