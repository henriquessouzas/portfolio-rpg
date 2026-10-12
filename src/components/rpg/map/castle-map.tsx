import { useState } from 'react';
import {
  CASTLE_H,
  CASTLE_W,
  CX0,
  CY0,
  DOORS,
  MAP_HEIGHT,
  MAP_WIDTH,
  ROOM_BOUNDS,
  WALL,
  type PlanRoomId,
} from '@/lib/castle-plan';
import {
  ArsenalFurnishings,
  HallFurnishings,
  LabFurnishings,
  LibraryFurnishings,
  QuartersFurnishings,
  ThroneFurnishings,
} from './room-furnishings';
import { CLR } from './palette';

const ROOM_IDS = Object.keys(ROOM_BOUNDS) as PlanRoomId[];
type FloorTileId = 'floor-tile' | 'floor-hover' | 'floor-active';
const TILE = (id: FloorTileId, fill: string, line: string, edge: string) => (
  <pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <rect width="20" height="20" fill={fill} />
    <rect x=".5" y=".5" width="9" height="9" fill={fill} stroke={line} strokeWidth=".6" />
    <rect x="10.5" y="10.5" width="9" height="9" fill={fill} stroke={line} strokeWidth=".6" />
    <rect
      x="10.5"
      y=".5"
      width="9"
      height="9"
      fill={fill}
      stroke={edge}
      strokeWidth=".5"
      opacity=".7"
    />
    <rect
      x=".5"
      y="10.5"
      width="9"
      height="9"
      fill={fill}
      stroke={edge}
      strokeWidth=".5"
      opacity=".7"
    />
  </pattern>
);

function RoomLabel({
  id,
  name,
  active,
  hovered,
  visited,
}: {
  id: PlanRoomId;
  name: string;
  active: boolean;
  hovered: boolean;
  visited: boolean;
}) {
  const [x, y, w, h] = ROOM_BOUNDS[id];
  const cx = x + w / 2;
  const cy = y + h * 0.88 - 2;
  return (
    <g transform={`translate(${cx}, ${cy})`} pointerEvents="none">
      <rect
        x={-46}
        y={-11}
        width={92}
        height={22}
        rx="2"
        fill={active ? '#1e1a0e' : '#14110a'}
        stroke={active ? CLR.gold : hovered ? CLR.goldDim : '#2a2010'}
        strokeWidth={active ? 1.2 : 0.7}
        opacity=".92"
      />
      {visited && <path d="M-38 0l3 3 6-7" fill="none" stroke={CLR.gold} strokeWidth="1.6" />}
      <text
        textAnchor="middle"
        x={visited ? 4 : 0}
        y={3}
        fontSize="6.5"
        style={{ fontFamily: 'var(--font-pixel), serif' }}
        fill={active ? CLR.gold : hovered ? CLR.goldDim : '#9a8a6a'}
      >
        {name.toUpperCase()}
      </text>
    </g>
  );
}

export type CastleMapProps = {
  names: Record<PlanRoomId, string>;
  activeRoom: PlanRoomId | null;
  focusRoom?: PlanRoomId | null;
  visited?: readonly string[];
  onSelectRoom?: (id: PlanRoomId) => void;
};

/** Planta do castelo em SVG. Cada sala é um componente em ./room-furnishings. */
export function CastleMap({
  names,
  activeRoom,
  focusRoom = null,
  visited = [],
  onSelectRoom,
}: CastleMapProps) {
  const [hovered, setHovered] = useState<PlanRoomId | null>(null);
  const highlight = hovered ?? focusRoom;
  const floorFor = (id: PlanRoomId) =>
    activeRoom === id
      ? 'url(#floor-active)'
      : highlight === id
        ? 'url(#floor-hover)'
        : 'url(#floor-tile)';
  const [gx, gy, gw] = DOORS['GATE'] ?? [0, 0, 0];
  const towers = [
    [CX0 - 6, CY0 - 6],
    [CX0 + CASTLE_W - 20, CY0 - 6],
    [CX0 - 6, CY0 + CASTLE_H - 20],
    [CX0 + CASTLE_W - 20, CY0 + CASTLE_H - 20],
  ] as const;
  return (
    <svg
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className="map-art"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="wall-stone" x="0" y="0" width="24" height="14" patternUnits="userSpaceOnUse">
          <rect width="24" height="14" fill={CLR.wall} />
          <path
            d="M1 1h10v5H1zM13 1h10v5H13zM1 8h5v5H1zM8 8h8v5H8zM18 8h5v5h-5z"
            fill={CLR.wallLine}
            opacity=".6"
          />
        </pattern>
        {TILE('floor-tile', CLR.floor, CLR.floorLine, CLR.floorLine)}
        {TILE('floor-hover', CLR.floorHover, '#312818', '#2d2514')}
        {TILE('floor-active', CLR.floorActive, '#3a2e18', '#342a16')}
        <radialGradient id="void-fade" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d0a08" stopOpacity="0" />
          <stop offset="100%" stopColor="#060402" stopOpacity=".38" />
        </radialGradient>
        <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor={CLR.gold} floodOpacity=".45" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="torch-glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={CLR.void} />
      <rect x={CX0} y={CY0} width={CASTLE_W} height={CASTLE_H} fill="url(#wall-stone)" rx="4" />
      <rect
        x={CX0 - 6}
        y={CY0 - 6}
        width={CASTLE_W + 12}
        height={CASTLE_H + 12}
        fill="none"
        stroke="#2a2018"
        strokeWidth="6"
        rx="8"
      />
      {towers.map(([tx, ty]) => (
        <rect
          key={`${tx}-${ty}`}
          x={tx}
          y={ty}
          width={26}
          height={26}
          fill="url(#wall-stone)"
          stroke="#2a2018"
          strokeWidth="1"
          rx="3"
        />
      ))}

      {ROOM_IDS.map((id) => {
        const [x, y, w, h] = ROOM_BOUNDS[id];
        return (
          <rect
            key={id}
            x={x}
            y={y}
            width={w}
            height={h}
            fill={floorFor(id)}
            style={{ cursor: id === 'H' ? 'default' : 'pointer', transition: 'fill .25s ease' }}
            onMouseEnter={() => id !== 'H' && setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => id !== 'H' && onSelectRoom?.(id)}
          />
        );
      })}
      {Object.entries(DOORS).map(([id, [x, y, w, h]]) => (
        <rect key={id} x={x} y={y} width={w} height={h} fill={CLR.floor} opacity=".9" />
      ))}

      <LibraryFurnishings />
      <ThroneFurnishings />
      <LabFurnishings />
      <ArsenalFurnishings />
      <HallFurnishings />
      <QuartersFurnishings />

      {ROOM_IDS.filter((id) => id !== 'H' && (activeRoom === id || highlight === id)).map((id) => {
        const [x, y, w, h] = ROOM_BOUNDS[id];
        return (
          <rect
            key={`b${id}`}
            x={x - 1}
            y={y - 1}
            width={w + 2}
            height={h + 2}
            fill="none"
            stroke={activeRoom === id ? CLR.gold : '#5a4a28'}
            strokeWidth={activeRoom === id ? 1.8 : 0.8}
            opacity={activeRoom === id ? 0.7 : 0.5}
            filter={activeRoom === id ? 'url(#glow-gold)' : undefined}
            pointerEvents="none"
          />
        );
      })}
      {ROOM_IDS.map((id) => (
        <RoomLabel
          key={id}
          id={id}
          name={names[id]}
          active={activeRoom === id}
          hovered={highlight === id}
          visited={visited.includes(id)}
        />
      ))}

      <path
        d={`M ${gx} ${gy + WALL + 8} V ${gy} Q ${gx + gw / 2} ${gy - 14} ${gx + gw} ${gy} V ${gy + WALL + 8}`}
        fill={CLR.void}
        stroke="#2a2018"
        strokeWidth="1"
      />
      <text
        x={CX0 + 8}
        y={MAP_HEIGHT - 6}
        fontSize="6"
        style={{ fontFamily: 'var(--font-pixel), serif' }}
        fill="#6a5a3a"
        opacity=".6"
      >
        MAPA DA FORTALEZA
      </text>
      <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#void-fade)" pointerEvents="none" />
    </svg>
  );
}
