import { useCallback, useRef, useState } from 'react';
import { Tag } from '@/components/ui';
import { rooms } from '@/content/rooms';
import type { RoomObject } from '@/types/room';
import styles from './LibraryScene.module.css';

/** Fixed palette of 5 book spine colours */
const BOOK_COLORS = ['#b5451b', '#1b5e8c', '#2e7d32', '#6a1b9a', '#e65100'];

/** Deterministic height % (62–95) based on object id */
function bookHeight(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  return `${62 + (hash % 34)}%`;
}

/** Category label → shelf index */
const CATEGORIES = ['Cursos', 'Certificados', 'Projetos'] as const;
type Category = (typeof CATEGORIES)[number];

function categoryOf(obj: RoomObject): Category {
  const s = obj.subtitle as Category;
  return CATEGORIES.includes(s) ? s : 'Cursos';
}

export function LibraryScene() {
  const library = rooms.find((r) => r.key === 'library')!;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [heroLeft, setHeroLeft] = useState('50%');
  const [panelObject, setPanelObject] = useState<RoomObject | null>(null);
  const bookRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const shelfRef = useRef<HTMLDivElement>(null);

  const selectBook = useCallback((obj: RoomObject) => {
    setActiveId(obj.id);
    setPanelObject(null);

    const btn = bookRefs.current.get(obj.id);
    const shelf = shelfRef.current;
    if (btn && shelf) {
      const btnRect = btn.getBoundingClientRect();
      const shelfRect = shelf.getBoundingClientRect();
      const cx = btnRect.left + btnRect.width / 2 - shelfRect.left;
      setHeroLeft(`${(cx / shelfRect.width) * 100}%`);
    }

    setTimeout(() => setPanelObject(obj), 500);
  }, []);

  const panelObj: RoomObject | null = panelObject
    ? { ...panelObject, emoji: '📖', name: panelObject.name, subtitle: panelObject.subtitle }
    : null;

  return (
    <div className={styles.scene}>
      {/* Bookshelf */}
      <div className={styles.shelf} ref={shelfRef} aria-label="Estante da biblioteca">
        {CATEGORIES.map((cat) => {
          const books = library.objects.filter((o) => categoryOf(o) === cat);
          return (
            <div key={cat} className={styles.row}>
              <span className={styles.rowLabel}>{cat}</span>
              <div className={styles.books}>
                {books.map((obj, idx) => (
                  <button
                    key={obj.id}
                    ref={(el) => {
                      if (el) bookRefs.current.set(obj.id, el);
                      else bookRefs.current.delete(obj.id);
                    }}
                    className={[styles.book, activeId === obj.id ? styles.active : '']
                      .join(' ')
                      .trim()}
                    style={{
                      background: BOOK_COLORS[idx % BOOK_COLORS.length],
                      height: bookHeight(obj.id),
                    }}
                    onClick={() => selectBook(obj)}
                    aria-label={`${obj.name}: ${obj.subtitle}`}
                    aria-pressed={activeId === obj.id}
                  >
                    {obj.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floor with hero */}
      <div className={styles.floor}>
        <div
          className={styles.hero}
          style={{ left: heroLeft }}
          role="img"
          aria-label="Herói"
        />
      </div>

      {/* Detail panel */}
      {panelObj && (
        <div className={styles.panel}>
          <div
            style={{
              background: 'var(--surface)',
              border: 'var(--border) solid var(--line)',
              boxShadow: 'var(--shadow)',
              padding: 'var(--space-3)',
            }}
            role="region"
            aria-label={`Detalhes: ${panelObj.name}`}
          >
            <h2
              style={{
                font: '400 0.7rem var(--px)',
                color: 'var(--gold)',
                margin: '0 0 8px',
                lineHeight: 1.5,
              }}
            >
              📖 {panelObj.name}
            </h2>
            <p
              style={{
                font: '400 0.6rem var(--px)',
                color: 'var(--mute)',
                margin: '0 0 8px',
                lineHeight: 1.5,
              }}
            >
              {panelObj.subtitle}
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.6, margin: '0 0 8px' }}>
              {panelObj.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {panelObj.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
