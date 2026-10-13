// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Popup } from './popup';
import { ShelfView } from './shelf-view';
import { rooms } from '@/lib/portfolio-data';

afterEach(() => {
  cleanup();
});

describe('Popup', () => {
  it('renders in a portal and uses role dialog', () => {
    render(
      <Popup title="Detalhes" onClose={() => {}}>
        <p>Conteúdo</p>
      </Popup>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Detalhes' });
    expect(dialog).toBeTruthy();
    expect(document.body.contains(dialog)).toBe(true);
  });

  it('closes on Escape and the close button', () => {
    const onClose = vi.fn();
    render(
      <Popup title="Detalhes" onClose={onClose}>
        <p>Conteúdo</p>
      </Popup>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Detalhes' });
    fireEvent.keyDown(dialog, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('focuses the dialog on open and restores the previous focus on close', () => {
    const opener = document.createElement('button');
    opener.textContent = 'Abrir';
    document.body.appendChild(opener);
    opener.focus();

    const onClose = vi.fn();
    const { unmount } = render(
      <Popup title="Detalhes" onClose={onClose}>
        <p>Conteúdo</p>
      </Popup>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Detalhes' });
    expect(document.activeElement).toBe(dialog);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(document.activeElement).toBe(opener);

    unmount();
    opener.remove();
  });

  it('moves with arrow keys on the title bar', () => {
    render(
      <Popup title="Mover" onClose={() => {}} initialAnchor={{ x: 120, y: 150 }}>
        <p>Conteúdo</p>
      </Popup>,
    );

    const titleBar = document.querySelector('.popup-titlebar') as HTMLElement;
    fireEvent.keyDown(titleBar, { key: 'ArrowRight' });

    const dialog = screen.getByRole('dialog', { name: 'Mover' });
    expect(dialog.style.left).toBe('136px');
    expect(dialog.style.top).toBe('150px');
  });

  it('renders shelf content inside a popup with the shelf title', () => {
    const artifact = rooms[0].objects[0];
    const book = artifact.books?.[0];

    render(
      <Popup title={`Estante: ${artifact.name}`} onClose={() => {}} width={760}>
        <ShelfView artifact={artifact} book={book ?? null} onBook={() => {}} onClose={() => {}} />
      </Popup>,
    );

    const dialog = screen.getByRole('dialog', { name: `Estante: ${artifact.name}` });
    expect(dialog).toBeTruthy();
    expect(screen.getByText(book?.title ?? '')).toBeTruthy();
  });
});
