import { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { rooms, type Artifact, type Book } from '@/lib/portfolio-data';
import { ShelfView } from './shelf-view';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const shelves: Artifact[] = rooms[0].objects;

function mount(artifact: Artifact, book: Book | null, onBook: (b: Book | null) => void) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  act(() =>
    root.render(<ShelfView artifact={artifact} book={book} onBook={onBook} onClose={() => {}} />),
  );
  return { host, unmount: () => act(() => root.unmount()) };
}

describe('library shelves', () => {
  it('keeps the static library shelves populated with unique titles', () => {
    const staticShelves = shelves.filter((shelf) => shelf.name !== 'Projetos');
    expect(staticShelves).toHaveLength(2);
    for (const shelf of staticShelves) {
      const titles = shelf.books?.map((b) => b.title) ?? [];
      expect(titles.length).toBeGreaterThan(0);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it('renders one button per book and reports the clicked book', () => {
    const shelf = shelves[0];
    const first = shelf?.books?.[0];
    if (!shelf || !first) throw new Error('missing shelf data');
    const onBook = vi.fn();
    const { host, unmount } = mount(shelf, null, onBook);
    const buttons = host.querySelectorAll<HTMLButtonElement>('button.book');
    expect(buttons).toHaveLength(shelf.books?.length ?? 0);
    act(() => buttons[0]?.click());
    expect(onBook).toHaveBeenCalledWith(first);
    unmount();
  });

  it('shows the description of the selected static book', () => {
    const shelf = shelves[0];
    const book = shelf?.books?.[0];
    if (!shelf || !book) throw new Error('missing shelf data');
    const { host, unmount } = mount(shelf, book, () => {});
    expect(host.textContent).toContain(book.description);
    expect(host.querySelector('.book-open')).not.toBeNull();
    unmount();
  });

  it('renders the loading state with the GitHub status message', () => {
    const projectsShelf = rooms[0].objects[2];
    render(
      <ShelfView
        artifact={projectsShelf}
        book={null}
        onBook={() => {}}
        onClose={() => {}}
        books={[]}
        status="loading"
        githubUser="henriquessouzas"
      />,
    );

    expect(screen.getByText('Buscando seus projetos no GitHub…')).toBeInTheDocument();
  });

  it('shows the error state with GitHub profile link when no snapshot is available', () => {
    const projectsShelf = rooms[0].objects[2];
    render(
      <ShelfView
        artifact={projectsShelf}
        book={null}
        onBook={() => {}}
        onClose={() => {}}
        books={[]}
        status="error"
        githubUser="henriquessouzas"
      />,
    );

    expect(screen.getByText('Não consegui carregar os projetos agora.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'github.com/henriquessouzas' })).toHaveAttribute(
      'href',
      'https://github.com/henriquessouzas',
    );
  });

  it('shows GitHub metadata and the direct repo link on the selected project', async () => {
    const projectsShelf = rooms[0].objects[2];
    const githubBook: Book = {
      title: 'Portfolio RPG',
      subtitle: 'TypeScript',
      description: 'Meu portfólio interativo em formato de RPG.',
      tags: ['react', 'typescript'],
      color: 'mana',
      url: 'https://github.com/henriquessouzas/portfolio-rpg',
      stars: 12,
      updatedAt: '2026-10-13T18:02:01Z',
    };

    const README_TEXT = '## Projeto\n\nEste é um README de teste para validar o scroll.\n\n- item 1\n- item 2';
    const encodedReadme = btoa(String.fromCharCode(...new TextEncoder().encode(README_TEXT)));

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: encodedReadme,
        }),
      }),
    );

    render(
      <ShelfView
        artifact={projectsShelf}
        book={githubBook}
        onBook={() => {}}
        onClose={() => {}}
        books={[githubBook]}
        status="ready"
        githubUser="henriquessouzas"
      />,
    );

    const readmeButton = await screen.findByRole('button', { name: /abrir readme/i });
    expect(readmeButton).toBeInTheDocument();

    await act(async () => {
      readmeButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText(/Este é um README de teste/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Ver no GitHub')).toHaveAttribute(
      'href',
      'https://github.com/henriquessouzas/portfolio-rpg',
    );
    expect(screen.getByText(/Atualizado em/i)).toBeInTheDocument();
  });
});
