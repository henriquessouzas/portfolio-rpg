import type { CSSProperties } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/rpg/ui/button";
import type { Artifact, Book } from "@/lib/portfolio-data";

const ROW_SIZE = 4;
const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );

export function ShelfView({
  artifact,
  book,
  onBook,
  onClose,
}: {
  artifact: Artifact;
  book: Book | null;
  onBook: (book: Book | null) => void;
  onClose: () => void;
}) {
  const books = artifact.books ?? [];
  let index = 0;
  return (
    <section className="shelf-view room-B" aria-label={`Estante: ${artifact.name}`}>
      <div className="shelf-head">
        <div>
          <span className="eyebrow">Biblioteca / {artifact.name}</span>
          <h2>{artifact.title}</h2>
          <p>{artifact.description}</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Fechar estante" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="shelf-body">
        <div className="bookcase">
          {chunk(books, ROW_SIZE).map((row, r) => (
            <div className="shelf-row" key={r}>
              {row.map((b) => {
                const i = index++;
                const open = book?.title === b.title;
                const style = { "--h": `${62 + ((i * 37) % 34)}%` } as CSSProperties;
                return (
                  <button
                    type="button"
                    key={b.title}
                    className={`book book-${b.color} ${open ? "book-open" : ""}`}
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
        <article className="book-detail" aria-live="polite">
          {book ? (
            <>
              <span className="eyebrow">{book.subtitle}</span>
              <h3>{book.title}</h3>
              <p>{book.description}</p>
              <div className="tags">
                {book.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">Escolha um livro</span>
              <h3>{books.length} livros nesta estante</h3>
              <p>Clique em uma lombada para abrir o livro e ler os detalhes.</p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
