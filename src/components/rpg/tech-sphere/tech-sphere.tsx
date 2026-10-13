import { Suspense, lazy, useEffect, useState } from 'react';
import { TechSearch } from '../arsenal/tech-search';
import { canUse3D } from '@/lib/webgl';

const LazyGlobe = lazy(() => import('./SkillsGlobeAdapter'));

export type TechSphereItem = {
  name: string;
  category: string;
  level: number;
};

export type TechSphereProps = {
  items: TechSphereItem[];
  onSelect?: (name: string) => void;
  selectedName?: string;
  reducedMotion: boolean;
  className?: string;
};

// Color palette mapped to CSS tokens (resolved at render time)
const CATEGORY_COLORS: Record<string, string> = {
  Linguagens: 'var(--ember)',
  'Front-end': 'var(--mana)',
  'Back-end': 'var(--forest)',
  Dados: 'var(--royal)',
  Ferramentas: 'var(--gold)',
};

function toGlobeSkills(items: TechSphereItem[]) {
  return items.map((item) => ({
    name: item.name,
    color: CATEGORY_COLORS[item.category] ?? 'var(--primary)',
    link: '#',
    // Single uppercase letter as the "icon" component
    icon: item.name.slice(0, 1).toUpperCase(),
  }));
}

export default function TechSphere({
  items,
  onSelect,
  selectedName,
  reducedMotion,
  className,
}: TechSphereProps) {
  const [sphereAvailable, setSphereAvailable] = useState(false);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    setSphereAvailable(!reducedMotion && items.length > 0 && canUse3D());
  }, [reducedMotion, items.length]);

  const listItems = items.map(({ name, category, level }) => ({
    name,
    category,
    years: Math.max(1, Math.round(level)),
  }));

  const shouldShowList = !sphereAvailable || showList;

  const fallback = (
    <TechSearch
      items={listItems}
      selectedName={selectedName}
      onSelect={onSelect}
    />
  );

  return (
    <div className={className ?? 'tech-sphere-shell'} style={{ width: '100%', display: 'grid', gap: 12 }}>
      {/* Screen-reader always gets the list */}
      <div className="sr-only" aria-live="polite">
        <TechSearch
          items={listItems}
          selectedName={selectedName}
          onSelect={onSelect}
        />
      </div>

      {!shouldShowList && (
        <div className="tech-sphere-toolbar">
          <button type="button" className="tech-sphere-toggle" onClick={() => setShowList(true)}>
            Ver como lista
          </button>
        </div>
      )}

      {shouldShowList ? (
        <div style={{ width: '100%' }}>
          {sphereAvailable && (
            <div className="tech-sphere-toolbar" style={{ marginBottom: 12 }}>
              <button type="button" className="tech-sphere-toggle" onClick={() => setShowList(false)}>
                Ver como esfera
              </button>
            </div>
          )}
          <TechSearch
            items={listItems}
            selectedName={selectedName}
            onSelect={onSelect}
          />
        </div>
      ) : (
        <div aria-hidden="true" className="tech-sphere-surface" style={{ width: '100%', maxWidth: 420, margin: '0 auto' }}>
          <Suspense fallback={fallback}>
            <LazyGlobe skills={toGlobeSkills(items)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
