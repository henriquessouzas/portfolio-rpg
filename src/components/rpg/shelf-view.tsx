import type { CSSProperties } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/rpg/ui/button';
import type { Artifact, Book } from '@/lib/portfolio-data';

const ROW_SIZE = 4;
const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );

function formatBookDate(value?: string): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('pt-BR');
}

export function ShelfView({
  artifact,
  book,
  onBook,
  onClose,
  showClose = true,
  books: booksOverride,
  status = 'ready',
  githubUser,
}: {
  artifact: Artifact;
  book: Book | null;
  onBook: (book: Book | null) => void;
  onClose: () => void;
  showClose?: boolean;
  books?: Book[];
  status?: 'loading' | 'ready' | 'error';
  githubUser?: string;
}) {
  const books = booksOverride ?? artifact.books ?? [];
  let index = 0;

  const renderState = () => {
    if (status === 'loading') {
      return (
        <div className="book-detail empty" aria-live="polite">
          <span className="eyebrow">Projetos</span>
          <h3>Buscando seus projetos no GitHub…</h3>
        </div>
      );
    }

    if (status === 'error' && books.length === 0) {
      return (
        <div className="book-detail empty" aria-live="polite">
          <span className="eyebrow">Projetos</span>
          <h3>Não consegui carregar os projetos agora.</h3>
          {githubUser ? (
            <p>
              <a href={`https://github.com/${githubUser}`} target="_blank" rel="noreferrer noopener">
                github.com/{githubUser}
              </a>
            </p>
          ) : null}
        </div>
      );
    }

    if (books.length === 0) {
      return (
        <div className="book-detail empty" aria-live="polite">
          <span className="eyebrow">Projetos</span>
          <h3>Nenhum projeto para mostrar por enquanto.</h3>
        </div>
      );
    }

    if (book) {
      return (
        <>
          <span className="eyebrow">{book.subtitle}</span>
          <h3>{book.title}</h3>
          <p>{book.description}</p>
          <div className="book-meta">
            <span className="book-stat">
              <Star size={14} /> {book.stars ?? 0}
            </span>
            <span className="book-stat">Atualizado em {formatBookDate(book.updatedAt)}</span>
          </div>
          <div className="tags">
            {book.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          {book.url ? (
            <a className="book-link" href={book.url} target="_blank" rel="noopener noreferrer">
              Ver no GitHub
            </a>
          ) : null}
        </>
      );
    }

    return (
      <>
        <span className="eyebrow">Escolha um livro</span>
        <h3>{books.length} projetos nesta estante</h3>
        <p>Clique em uma lombada para abrir o projeto e ler os detalhes.</p>
      </>
    );
  };

  return (
    <section className="shelf-view room-B" aria-label={`Estante: ${artifact.name}`}>
      <div className="shelf-head">
        <div>
          <span className="eyebrow">Biblioteca / {artifact.name}</span>
          <h2>{artifact.title}</h2>
          <p>{artifact.description}</p>
        </div>
        {showClose ? (
          <Button variant="ghost" size="icon" aria-label="Fechar estante" onClick={onClose}>
            <X />
          </Button>
        ) : null}
      </div>
      <div className="shelf-body">
        {status === 'loading' || status === 'error' || books.length === 0 ? (
          <div className="bookcase bookcase-empty">{status === 'loading' ? '…' : null}</div>
        ) : (
          <div className="bookcase">
            {chunk(books, ROW_SIZE).map((row, r) => (
              <div className="shelf-row" key={r}>
                {row.map((b) => {
                  const i = index++;
                  const open = book?.title === b.title;
                  const style = { '--h': `${62 + ((i * 37) % 34)}%` } as CSSProperties;
                  return (
                    <button
                      type="button"
                      key={b.title}
                      className={`book book-${b.color} ${open ? 'book-open' : ''}`}
                      style={style}
                      aria-pressed={open}
                      aria-label={`${b.title}, ${b.subtitle}`}
                      onClick={() => onBook(open ? null : b)}
                    >
                      <span>{b.title}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        <article className="book-detail" aria-live="polite">
          {renderState()}
        </article>
      </div>
    </section>
  );
}
