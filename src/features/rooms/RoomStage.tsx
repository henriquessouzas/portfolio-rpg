import { useCallback, useEffect, useRef, useState } from 'react';
import type { Room, RoomObject } from '@/types/room';
import { DetailPanel } from './DetailPanel';
import styles from './RoomStage.module.css';

type RoomStageProps = {
  room: Room;
  /** Pass true for throne room to auto-select first object */
  autoSelect?: boolean;
};

export function RoomStage({ room, autoSelect = false }: RoomStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [heroLeft, setHeroLeft] = useState<string>('50%');
  const [panelObject, setPanelObject] = useState<RoomObject | null>(null);
  const objectRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const sceneRef = useRef<HTMLDivElement>(null);

  const selectObject = useCallback(
    (obj: RoomObject) => {
      setActiveId(obj.id);
      setPanelObject(null);

      // Calculate hero position as % of scene width
      const btn = objectRefs.current.get(obj.id);
      const scene = sceneRef.current;
      if (btn && scene) {
        const btnRect = btn.getBoundingClientRect();
        const sceneRect = scene.getBoundingClientRect();
        const centerX = btnRect.left + btnRect.width / 2 - sceneRect.left;
        setHeroLeft(`${(centerX / sceneRect.width) * 100}%`);
      }

      setTimeout(() => setPanelObject(obj), 500);
    },
    [],
  );

  // Auto-select first object for throne room
  useEffect(() => {
    if (!autoSelect || room.objects.length === 0) return;
    const timer = setTimeout(() => selectObject(room.objects[0]), 350);
    return () => clearTimeout(timer);
  }, [autoSelect, room.objects, selectObject]);

  return (
    <div
      className={styles.stage}
      style={{ '--room-color': `var(${room.colorToken})` } as React.CSSProperties}
    >
      {/* Scene */}
      <div className={styles.scene} ref={sceneRef} aria-label={`Cenário: ${room.name}`}>
        <div className={styles.wall}>
          <span aria-hidden="true">🔥</span>
          <span aria-hidden="true">🔥</span>
        </div>
        <div className={styles.floor}>
          <div className={styles.carpet} />
          <div
            className={styles.hero}
            style={{ left: heroLeft }}
            role="img"
            aria-label="Herói"
          />
        </div>
      </div>

      {/* Objects */}
      <div className={styles.objects} role="list" aria-label="Objetos da sala">
        {room.objects.map((obj) => (
          <button
            key={obj.id}
            ref={(el) => {
              if (el) objectRefs.current.set(obj.id, el);
              else objectRefs.current.delete(obj.id);
            }}
            className={[styles.objBtn, activeId === obj.id ? styles.active : ''].join(' ').trim()}
            onClick={() => selectObject(obj)}
            aria-label={`${obj.name}: ${obj.subtitle}`}
            aria-pressed={activeId === obj.id}
            role="listitem"
          >
            <span className={styles.objEmoji} aria-hidden="true">
              {obj.emoji ?? '📦'}
            </span>
            <span>{obj.name}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {panelObject && <DetailPanel object={panelObject} />}
    </div>
  );
}
