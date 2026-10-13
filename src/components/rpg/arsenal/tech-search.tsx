import { useEffect, useRef, useState } from 'react';
import { searchTechs, type TechSearchItem } from '@/lib/tech-search';

const categories = ['Todas', 'Linguagens', 'Front-end', 'Back-end', 'Dados', 'Ferramentas'] as const;

export function TechSearch({
  items,
  onClose,
  selectedName,
  onSelect,
}: {
  items: TechSearchItem[];
  onClose?: () => void;
  selectedName?: string;
  onSelect?: (name: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('Todas');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 150);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTextField = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;

      if (event.key === '/' && !isTextField) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        if (query.length > 0) {
          event.preventDefault();
          setQuery('');
          setDebouncedQuery('');
          return;
        }

        if (inputRef.current && document.activeElement === inputRef.current) {
          inputRef.current.blur();
        }

        onClose?.();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [query, onClose]);

  const results = searchTechs(items, debouncedQuery, category);
  const total = results.length;

  return (
    <div className="tech-search-panel">
      <label htmlFor="tech-search" className="tech-search-label">
        Buscar tecnologia
      </label>
      <input
        id="tech-search"
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ex.: React, Docker"
        className="tech-search-input"
        aria-label="Buscar tecnologia"
      />

      <div className="tech-search-chips" role="group" aria-label="Filtrar por categoria">
        {categories.map((chip) => (
          <button
            key={chip}
            type="button"
            className="tech-search-chip"
            aria-pressed={category === chip}
            onClick={() => setCategory(chip)}
          >
            {chip}
          </button>
        ))}
      </div>

      <div className="tech-search-header" aria-live="polite">
        <strong>{total} tecnologias</strong>
      </div>

      {results.length === 0 ? (
        <div className="tech-search-empty" role="status">
          <span>Nenhuma tecnologia encontrada.</span>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setDebouncedQuery('');
              setCategory('Todas');
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <ul className="tech-search-results">
          {results.map((tech) => {
            const value = Math.min(100, Math.max(20, (tech.years ?? 1) * 22));
            const isSelected = selectedName === tech.name;
            return (
              <li
                key={`${tech.category}-${tech.name}`}
                className={`tech-search-item ${isSelected ? 'is-selected' : ''}`}
              >
                <button
                  type="button"
                  className="tech-search-item-button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect?.(tech.name)}
                >
                  <div className="tech-search-item-header">
                    <strong>{tech.name}</strong>
                    <span>{tech.category}</span>
                  </div>
                  <div
                    className="tech-search-progress"
                    role="progressbar"
                    aria-label={`${tech.name}: ${value}% de domínio`}
                    aria-valuenow={value}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${value}%` }} />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
