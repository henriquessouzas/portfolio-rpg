import { useCallback, useRef, useState } from 'react';
import { Hud } from '@/components/ui';
import { rooms } from '@/content/rooms';
import type { RoomKey } from '@/types/room';
import {
  COLS,
  DECORATIONS,
  GRID,
  ROWS,
  getRoomCenter,
} from '@/features/map/mapData';
import type { Pos } from '@/features/map/mapData';
import { useHeroWalk } from '@/features/map/useHeroWalk';
import styles from './MapScreen.module.css';

type MapScreenProps = {
  heroPos: Pos;
  onHeroMove: (pos: Pos) => void;
  onSelectRoom: (room: RoomKey) => void;
  onExit: () => void;
};

/** Map tile letter → CSS module class */
function tileClass(ch: string): string {
  switch (ch) {
    case '#': return styles.tileWall;
    case '.': return styles.tileFloor;
    case 'D': return styles.tileDoor;
    case 'E': return styles.tileEntrance;
    case 'P': return styles.tilePatio;
    case 'B': return styles.tileLibrary;
    case 'T': return styles.tileThrone;
    case 'A': return styles.tileQuarters;
    case 'R': return styles.tileArmory;
    case 'L': return styles.tileLab;
    default:  return styles.tileFloor;
  }
}

/** Top-left tile of each 3×3 room block */
const ROOM_ORIGINS: Record<RoomKey, Pos> = {
  library:  { x: 1, y: 1 },
  throne:   { x: 5, y: 1 },
  quarters: { x: 9, y: 1 },
  armory:   { x: 1, y: 7 },
  lab:      { x: 9, y: 7 },
};

export function MapScreen({ heroPos, onHeroMove, onSelectRoom, onExit }: MapScreenProps) {
  const { walking, walkTo } = useHeroWalk({ pos: heroPos, onMove: onHeroMove });
  const [zoomedRoom, setZoomedRoom] = useState<RoomKey | null>(null);
  const zoomRef = useRef<HTMLDivElement>(null);

  const handleRoomClick = useCallback(
    (roomKey: RoomKey) => {
      if (walking || zoomedRoom) return;
      const goal = getRoomCenter(roomKey);
      walkTo(goal, () => {
        setZoomedRoom(roomKey);
        setTimeout(() => {
          setZoomedRoom(null);
          onSelectRoom(roomKey);
        }, 450);
      });
    },
    [walking, zoomedRoom, walkTo, onSelectRoom],
  );

  /** Zoom transform-origin: center of the destination room in px */
  const zoomOrigin = zoomedRoom
    ? (() => {
        const c = getRoomCenter(zoomedRoom);
        const tileSize = 32; // matches --tile token
        return `${(c.x + 0.5) * tileSize}px ${(c.y + 0.5) * tileSize}px`;
      })()
    : '50% 50%';

  return (
    <div className={styles.screen}>
      <Hud label="Castelo ▸ Mapa" onBack={onExit} />

      <div className={styles.mapWrapper}>
        <div
          ref={zoomRef}
          className={[styles.mapZoom, zoomedRoom ? styles.zoomed : ''].join(' ').trim()}
          style={{ transformOrigin: zoomOrigin }}
        >
          <div
            className={styles.grid}
            style={{ width: `calc(var(--tile) * ${COLS})`, height: `calc(var(--tile) * ${ROWS})` }}
          >
            {/* Tiles */}
            {Array.from({ length: ROWS }, (_, y) =>
              Array.from({ length: COLS }, (_, x) => (
                <div
                  key={`${x}-${y}`}
                  className={[styles.tile, tileClass(GRID[y][x])].join(' ')}
                />
              )),
            )}

            {/* Room buttons */}
            {rooms.map((room) => {
              const origin = ROOM_ORIGINS[room.key];
              return (
                <button
                  key={room.key}
                  className={styles.roomBtn}
                  style={{
                    left: `calc(var(--tile) * ${origin.x})`,
                    top: `calc(var(--tile) * ${origin.y})`,
                  }}
                  onClick={() => handleRoomClick(room.key)}
                  disabled={walking || zoomedRoom !== null}
                  aria-label={`Ir para ${room.name}`}
                >
                  {room.name}
                </button>
              );
            })}

            {/* Decorations */}
            {DECORATIONS.map((d) => (
              <div
                key={`${d.pos.x}-${d.pos.y}`}
                className={styles.decoration}
                style={{
                  left: `calc(var(--tile) * ${d.pos.x})`,
                  top: `calc(var(--tile) * ${d.pos.y})`,
                }}
                aria-label={d.label}
              >
                {d.emoji}
              </div>
            ))}

            {/* Hero */}
            <div
              className={styles.hero}
              style={{
                left: `calc(var(--tile) * ${heroPos.x})`,
                top: `calc(var(--tile) * ${heroPos.y})`,
              }}
              aria-label="Herói"
              role="img"
            >
              🧙
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
