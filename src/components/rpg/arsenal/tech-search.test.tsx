// @vitest-environment jsdom
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TechSearch } from './tech-search';

afterEach(() => {
  cleanup();
});

const techItems = [
  { name: 'React', category: 'Front-end', years: 4, tags: ['ui', 'spa'] },
  { name: 'Docker', category: 'Ferramentas', years: 2, tags: ['containers'] },
  { name: 'SQL Server', category: 'Dados', years: 5, tags: ['banco'] },
  { name: 'Java', category: 'Linguagens', years: 3, tags: ['backend'] },
];

describe('TechSearch', () => {
  it('filters results as the user types', async () => {
    render(<TechSearch items={techItems} />);
    const input = screen.getByLabelText('Buscar tecnologia');

    fireEvent.change(input, { target: { value: 'react' } });

    await waitFor(() => {
      const names = Array.from(document.querySelectorAll('.tech-search-item strong')).map((node) => node.textContent);
      expect(names).toEqual(['React']);
    }, { timeout: 500 });
  });

  it('filters by category chips combinatorially', () => {
    render(<TechSearch items={techItems} />);
    fireEvent.click(screen.getByRole('button', { name: 'Dados' }));

    expect(screen.getByText('SQL Server')).toBeInTheDocument();
    expect(screen.queryByText('React')).toBeNull();
  });

  it('focuses the search input when pressing /', () => {
    render(<TechSearch items={techItems} />);
    const input = screen.getByLabelText('Buscar tecnologia');

    fireEvent.keyDown(document.body, { key: '/' });

    expect(document.activeElement).toBe(input);
  });

  it('clears the query on Escape and calls onClose when the field is empty', () => {
    const closePopup = vi.fn();
    render(<TechSearch items={techItems} onClose={closePopup} />);

    const input = screen.getByLabelText('Buscar tecnologia');
    fireEvent.change(input, { target: { value: 'react' } });
    fireEvent.keyDown(window, { key: 'Escape' });
    expect((input as HTMLInputElement).value).toBe('');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(closePopup).toHaveBeenCalledTimes(1);
  });
});
