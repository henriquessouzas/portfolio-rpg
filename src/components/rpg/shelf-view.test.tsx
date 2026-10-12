import { act } from 'react';
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
  it('gives each library shelf its own books with unique titles', () => {
    expect(shelves).toHaveLength(3);
    for (const shelf of shelves) {
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

  it('shows the description of the selected book', () => {
    const shelf = shelves[2];
    const book = shelf?.books?.[0];
    if (!shelf || !book) throw new Error('missing shelf data');
    const { host, unmount } = mount(shelf, book, () => {});
    expect(host.textContent).toContain(book.description);
    expect(host.querySelector('.book-open')).not.toBeNull();
    unmount();
  });
});
