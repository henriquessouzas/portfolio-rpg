import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/rpg/ui/button';
import { fetchReadmeForRepo } from '@/lib/github';
import type { Artifact, Book } from '@/lib/portfolio-data';
import { useLang } from '@/hooks/use-lang';
import { Popup } from './popup';

const ROW_SIZE = 4;
const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size),
  );

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatInlineMarkdown(value: string): string {
  const escaped = escapeHtml(value);

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>');
}

function renderMarkdown(value: string): string {
  const source = value.replace(/\r\n/g, '\n').trim();
  if (!source) return '';

  const lines = source.split('\n');
  const blocks: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let quoteLines: string[] = [];
  let codeLines: string[] = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push(`<p>${formatInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(`<ul>${listItems.map((item) => `<li>${formatInlineMarkdown(item)}</li>`).join('')}</ul>`);
      listItems = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length > 0) {
      blocks.push(`<blockquote>${formatInlineMarkdown(quoteLines.join(' '))}</blockquote>`);
      quoteLines = [];
    }
  };

  const flushCode = () => {
    if (codeLines.length > 0) {
      blocks.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      codeLines = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      flushQuote();
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(rawLine);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();
      blocks.push(`<h${level}>${formatInlineMarkdown(content)}</h${level}>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph();
      flushList();
      quoteLines.push(line.replace(/^>\s?/, '').trim());
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      flushParagraph();
      flushQuote();
      listItems.push(line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim());
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushQuote();
  if (inCodeBlock) {
    flushCode();
  }

  return blocks.join('\n');
}

function formatBookDate(value?: string): string {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('pt-BR');
}

function isGitHubUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.hostname === 'github.com' || parsed.hostname.endsWith('.github.com');
  } catch {
    return false;
  }
}

function isDocumentUrl(value: string): boolean {
  return /\.(pdf|doc|docx|ppt|pptx|png|jpg|jpeg|webp)(?:[?#].*)?$/i.test(value);
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
  const { t } = useLang();
  const books = booksOverride ?? artifact.books ?? [];
  const [readme, setReadme] = useState('');
  const [readmeOpen, setReadmeOpen] = useState(false);
  const [readmeState, setReadmeState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  let index = 0;

  useEffect(() => {
    let active = true;

    if (!book?.url || !isGitHubUrl(book.url)) {
      setReadme('');
      setReadmeState('idle');
      setReadmeOpen(false);
      return () => {
        active = false;
      };
    }

    setReadmeOpen(false);
    setReadmeState('loading');

    void fetchReadmeForRepo(book.url).then((nextReadme) => {
      if (!active) return;
      setReadme(nextReadme.trim());
      setReadmeState(nextReadme ? 'ready' : 'error');
    });

    return () => {
      active = false;
    };
  }, [book?.url]);

  const renderState = () => {
    if (status === 'loading') {
      return (
        <div className="book-detail empty" aria-live="polite">
          <span className="eyebrow">{t.projects}</span>
          <h3>{t.loadingProjects}</h3>
        </div>
      );
    }

    if (status === 'error' && books.length === 0) {
      return (
        <div className="book-detail empty" aria-live="polite">
          <span className="eyebrow">{t.projects}</span>
          <h3>{t.errorProjects}</h3>
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
          <span className="eyebrow">{t.projects}</span>
          <h3>{t.emptyProjects}</h3>
        </div>
      );
    }

    if (book) {
      const readmeButtonLabel =
        readmeState === 'loading' ? t.loadingReadme : readmeState === 'error' ? t.readmeUnavailable : t.openReadme;

      return (
        <div className="book-detail-layout">
          <div className="book-detail-summary">
            <span className="eyebrow">{book.subtitle}</span>
            <h3>{book.title}</h3>
            <p>{book.description}</p>
            <div className="book-meta">
              <span className="book-stat">
                <Star size={14} /> {book.stars ?? 0}
              </span>
              <span className="book-stat">{t.updatedAt(formatBookDate(book.updatedAt))}</span>
            </div>
            <div className="tags">
              {book.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="book-actions">
              {book.url ? (
                <a className="book-link" href={book.url} target="_blank" rel="noopener noreferrer">
                  {isDocumentUrl(book.url) ? (book.subtitle === 'Certificado' ? t.openCertificate : t.openDocument) : t.viewOnGitHub}
                </a>
              ) : null}
              {!isDocumentUrl(book.url ?? '') && isGitHubUrl(book.url ?? '') ? (
                <button
                  type="button"
                  className="book-link"
                  aria-label={t.openReadme}
                  disabled={readmeState === 'loading' || readmeState === 'error'}
                  onClick={() => setReadmeOpen(true)}
                >
                  {readmeButtonLabel}
                </button>
              ) : null}
            </div>
          </div>
          {readmeOpen && readme ? (
            <Popup title={`${book.title} — README`} onClose={() => setReadmeOpen(false)} width={640} storageKey={`readme:${book.title}`}>
              <div className="book-readme-popup">
                <div className="book-readme-shell">
                  <div className="royal-seal" aria-hidden="true">
                    <span>H</span>
                  </div>
                  <div
                    className="book-readme-content book-readme-markdown"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(readme) }}
                  />
                </div>
              </div>
            </Popup>
          ) : null}
        </div>
      );
    }

    return (
      <>
        <span className="eyebrow">{t.chooseBook}</span>
        <h3>{t.projectsOnShelf(books.length)}</h3>
        <p>{t.clickSpine}</p>
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
          <Button variant="ghost" size="icon" aria-label={t.closeShelf} onClick={onClose}>
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
                  const shortTitle = b.title.split(/\s+/).slice(0, 2).join(' ');
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
                      <span>{shortTitle}</span>
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
