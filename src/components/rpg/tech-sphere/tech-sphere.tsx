import { useEffect, useMemo, useRef, useState } from 'react';
import { TechSearch } from '../arsenal/tech-search';

export type TechSphereItem = {
  name: string;
  category: string;
  level: number;
};

export type TechSphereProps = {
  items: TechSphereItem[];
  onSelect?: (name: string) => void;
  reducedMotion: boolean;
  className?: string;
};

const palette = ['var(--primary)', 'var(--mana)', 'var(--forest)', 'var(--ember)', 'var(--royal)'];

function toOriginalSkillShape(items: TechSphereItem[]) {
  return items.map((item, index) => ({
    name: item.name,
    category: item.category,
    color: palette[index % palette.length],
    link: '#',
    icon: item.name.slice(0, 1).toUpperCase(),
  }));
}

export default function TechSphere({ items, onSelect, reducedMotion, className }: TechSphereProps) {
  const [showList, setShowList] = useState(false);
  const [sphereAvailable, setSphereAvailable] = useState<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  const normalizedItems = useMemo(() => toOriginalSkillShape(items), [items]);
  const listItems = useMemo(
    () =>
      items.map(({ name, category, level }) => ({
        name,
        category,
        years: Math.max(1, Math.round(level)),
      })),
    [items],
  );

  useEffect(() => {
    setSphereAvailable(!reducedMotion && items.length > 0);
  }, [items.length, reducedMotion]);

  useEffect(() => {
    if (!sphereAvailable) {
      return undefined;
    }

    const onResize = () => {
      setShowList(false);
    };

    animationFrameRef.current = window.requestAnimationFrame(() => undefined);
    window.addEventListener('resize', onResize);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', onResize);
    };
  }, [sphereAvailable]);

  const shellStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 420,
    aspectRatio: '1 / 1',
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    margin: '0 auto',
    borderRadius: 24,
    background: 'radial-gradient(circle at center, color-mix(in srgb, var(--primary) 18%, transparent), transparent 64%), linear-gradient(135deg, color-mix(in srgb, var(--background) 74%, var(--primary) 26%), color-mix(in srgb, var(--surface) 60%, var(--primary) 40%))',
    color: 'var(--foreground)',
    overflow: 'hidden',
    border: '1px solid color-mix(in srgb, var(--primary) 28%, transparent)',
    boxShadow: '0 18px 40px color-mix(in srgb, var(--outline) 20%, transparent), inset 0 0 26px color-mix(in srgb, var(--primary) 14%, transparent)',
    zIndex: 1,
  };

  const shouldShowList = !sphereAvailable || showList;
  const maxLevel = Math.max(1, ...items.map((item) => item.level));

  return (
    <div className={className ?? 'tech-sphere-shell'} style={{ width: '100%', display: 'grid', gap: 12 }}>
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
          <TechSearch items={listItems} />
        </div>
      ) : (
        <div aria-hidden="true" className="tech-sphere-surface" style={shellStyle}>
          {normalizedItems.map((item, index) => {
            const angle = (index / Math.max(normalizedItems.length, 1)) * Math.PI * 2;
            const radiusX = 33 + ((items[index].level ?? 1) / maxLevel) * 14;
            const radiusY = 28 + ((items[index].level ?? 1) / maxLevel) * 12;
            const x = 50 + Math.cos(angle) * radiusX;
            const y = 50 + Math.sin(angle) * radiusY;

            return (
              <button
                key={`${item.name}-${index}`}
                type="button"
                aria-label={item.name}
                onClick={() => onSelect?.(item.name)}
                className="tech-sphere-node"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  '--tech-sphere-color': item.color,
                }}
              >
                <span className="tech-sphere-node-mark" style={{ color: item.color }}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}

          <div className="tech-sphere-core" />
        </div>
      )}
    </div>
  );
}
