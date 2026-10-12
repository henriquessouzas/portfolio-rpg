import { BOOK_COLORS, CLR } from './palette';

/* Peças reutilizáveis das salas (vista de cima). */

export function Bookshelf({
  x,
  y,
  w,
  h,
  vertical = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  vertical?: boolean;
}) {
  const count = Math.floor((vertical ? h : w) / (vertical ? 9 : 10));
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill={CLR.furnDk} />
      {Array.from({ length: count }, (_, i) =>
        vertical ? (
          <rect
            key={i}
            x={x + 2}
            y={y + 2 + i * 9}
            width={w - 4}
            height={6}
            rx=".5"
            fill={BOOK_COLORS[i % 6]}
            opacity=".7"
          />
        ) : (
          <rect
            key={i}
            x={x + 2 + i * 10}
            y={y + 2}
            width={7}
            height={h - 4}
            rx=".5"
            fill={BOOK_COLORS[i % 6]}
            opacity=".7"
          />
        ),
      )}
    </g>
  );
}

export function Pillar({ cx, cy, r = 8 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 2} fill={CLR.void} opacity=".5" />
      <circle cx={cx} cy={cy} r={r} fill="#2a2418" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.35} fill="#3a3020" opacity=".6" />
    </g>
  );
}

export function TableRect({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x + 3} y={y + 3} width={w} height={h} rx="2" fill={CLR.furnDk} opacity=".5" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={CLR.furn} />
      <rect
        x={x + 3}
        y={y + 3}
        width={w - 6}
        height={h - 6}
        rx="1"
        fill={CLR.furnLt}
        opacity=".15"
      />
    </g>
  );
}

export function Candle({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="7" fill={CLR.torch} opacity=".08" className="anim-flicker" />
      <rect x={cx - 2} y={cy} width="4" height="6" rx="1" fill="#d4c49a" />
      <circle cx={cx} cy={cy} r="2.5" fill={CLR.torch} opacity=".9" />
    </g>
  );
}

export function WallTorch({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g filter="url(#torch-glow)">
      <circle cx={cx} cy={cy} r="14" fill={CLR.torch} opacity=".07" className="anim-flicker" />
      <rect x={cx - 2} y={cy} width="4" height="7" rx="1" fill="#8a6828" />
      <circle cx={cx} cy={cy} r="3.5" fill={CLR.torch} opacity=".85" className="anim-flicker" />
    </g>
  );
}

export function Chest({ x, y, w = 28, h = 18 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x + 2} y={y + 2} width={w} height={h} rx="2" fill={CLR.furnDk} opacity=".5" />
      <rect x={x} y={y} width={w} height={h} rx="2" fill={CLR.furn} />
      <line x1={x} y1={y + h / 3} x2={x + w} y2={y + h / 3} stroke={CLR.furnDk} strokeWidth="1.2" />
      <rect x={x + w / 2 - 3} y={y + h / 3 - 3} width="6" height="5" rx="1" fill={CLR.furnDk} />
      <circle cx={x + w / 2} cy={y + h / 3 - 1} r="1.5" fill={CLR.gold} />
    </g>
  );
}

export function Throne({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <rect
        x={cx - 18}
        y={cy - 18}
        width={36}
        height={36}
        rx="3"
        fill={CLR.furnDk}
        opacity=".4"
        transform="translate(2,3)"
      />
      <rect x={cx - 16} y={cy - 20} width={32} height={10} rx="2" fill={CLR.furnDk} />
      <rect x={cx - 20} y={cy - 10} width={7} height={16} rx="2" fill={CLR.furnDk} />
      <rect x={cx + 13} y={cy - 10} width={7} height={16} rx="2" fill={CLR.furnDk} />
      <rect x={cx - 16} y={cy - 10} width={32} height={22} rx="2" fill={CLR.furn} />
      <rect x={cx - 12} y={cy - 7} width={24} height={16} rx="2" fill={CLR.carpet} opacity=".55" />
      <rect x={cx - 16} y={cy - 20} width={32} height={3} rx="1" fill={CLR.gold} opacity=".6" />
      <rect x={cx - 20} y={cy - 12} width={4} height={2} rx=".5" fill={CLR.gold} opacity=".5" />
      <rect x={cx + 16} y={cy - 12} width={4} height={2} rx=".5" fill={CLR.gold} opacity=".5" />
    </g>
  );
}

export function Bed({ x, y, w = 100, h = 52 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x + 2} y={y + 2} width={w} height={h} rx="4" fill={CLR.furnDk} opacity=".4" />
      <rect x={x} y={y} width={w} height={h} rx="4" fill={CLR.furn} />
      <rect x={x + 5} y={y + 5} width={w - 10} height={h * 0.35} rx="3" fill="#5a5040" />
      <line
        x1={x + 8}
        y1={y + h * 0.55}
        x2={x + w - 8}
        y2={y + h * 0.55}
        stroke={CLR.furnDk}
        strokeWidth="1"
      />
      <line
        x1={x + 8}
        y1={y + h * 0.72}
        x2={x + w - 8}
        y2={y + h * 0.72}
        stroke={CLR.furnDk}
        strokeWidth=".7"
      />
      <rect x={x} y={y} width={12} height={h} rx="2" fill={CLR.furnDk} />
    </g>
  );
}

export function WeaponRack({
  cx,
  cy,
  w = 40,
  h = 16,
}: {
  cx: number;
  cy: number;
  w?: number;
  h?: number;
}) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={CLR.furnDk} />
      <line
        x1={x + 4}
        y1={y + h - 3}
        x2={x + w / 2 - 2}
        y2={y + 3}
        stroke={CLR.ironGray}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={x + w / 2 + 2}
        y1={y + 3}
        x2={x + w - 4}
        y2={y + h - 3}
        stroke={CLR.ironGray}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={x + 9}
        y1={y + h * 0.45}
        x2={x + 17}
        y2={y + h * 0.45}
        stroke={CLR.furn}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1={x + w - 9}
        y1={y + h * 0.45}
        x2={x + w - 17}
        y2={y + h * 0.45}
        stroke={CLR.furn}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

export function Shield({ cx, cy, r = 9 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <ellipse cx={cx + 1} cy={cy + 1} rx={r} ry={r * 1.1} fill={CLR.furnDk} opacity=".4" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.1} fill={CLR.shieldGray} />
      <line
        x1={cx}
        y1={cy - r * 0.9}
        x2={cx}
        y2={cy + r * 0.9}
        stroke={CLR.furnDk}
        strokeWidth="1"
      />
      <line
        x1={cx - r * 0.8}
        y1={cy}
        x2={cx + r * 0.8}
        y2={cy}
        stroke={CLR.furnDk}
        strokeWidth=".7"
      />
    </g>
  );
}

export function Cauldron({ cx, cy, r = 14 }: { cx: number; cy: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy + 2} r={r} fill={CLR.furnDk} opacity=".4" />
      <circle cx={cx} cy={cy} r={r} fill="#1e1e18" />
      <circle cx={cx} cy={cy} r={r - 3} fill="#282818" />
      <circle
        cx={cx - 3}
        cy={cy - 2}
        r="2.5"
        fill={CLR.potionGreen}
        opacity=".6"
        className="map-bubble"
      />
      <circle
        cx={cx + 4}
        cy={cy - 3}
        r="2"
        fill={CLR.potionGreen}
        opacity=".5"
        className="map-bubble"
      />
      <circle cx={cx} cy={cy + 2} r="1.5" fill={CLR.potionGreen} opacity=".4" />
      <path
        d={`M ${cx - r + 1} ${cy - 3} Q ${cx} ${cy - r - 4} ${cx + r - 1} ${cy - 3}`}
        fill="none"
        stroke={CLR.furn}
        strokeWidth="2"
      />
      {[-4, 0, 4].map((dx) => (
        <line
          key={dx}
          x1={cx + dx}
          y1={cy + r}
          x2={cx + dx * 2}
          y2={cy + r + 5}
          stroke={CLR.furnDk}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function Flask({
  cx,
  cy,
  color = CLR.potionBlue,
  size = 1,
}: {
  cx: number;
  cy: number;
  color?: string;
  size?: number;
}) {
  const s = size * 5;
  return (
    <g>
      <ellipse cx={cx} cy={cy + s * 0.6} rx={s * 0.8} ry={s * 0.7} fill={color} opacity=".7" />
      <rect
        x={cx - s * 0.25}
        y={cy - s * 0.3}
        width={s * 0.5}
        height={s * 0.9}
        rx="1"
        fill={color}
        opacity=".5"
      />
      <rect
        x={cx - s * 0.3}
        y={cy - s * 0.5}
        width={s * 0.6}
        height={s * 0.25}
        rx=".5"
        fill={CLR.furn}
      />
    </g>
  );
}

export function Fireplace({ cx, y }: { cx: number; y: number }) {
  return (
    <g>
      <rect x={cx - 26} y={y} width={52} height={22} rx="2" fill={CLR.furnDk} />
      <path
        d={`M ${cx - 18} ${y + 22} L ${cx - 18} ${y + 8} Q ${cx} ${y - 2} ${cx + 18} ${y + 8} L ${cx + 18} ${y + 22} Z`}
        fill="#0e0806"
      />
      <ellipse
        cx={cx}
        cy={y + 18}
        rx={13}
        ry={8}
        fill={CLR.torch}
        opacity=".18"
        className="anim-flicker"
      />
      <path
        d={`M ${cx - 8} ${y + 22} C ${cx - 10} ${y + 8} ${cx - 4} ${y + 4} ${cx} ${y + 12} C ${cx + 4} ${y + 4} ${cx + 10} ${y + 8} ${cx + 8} ${y + 22} Z`}
        fill={CLR.torch}
        opacity=".7"
        className="anim-flicker"
      />
      <path
        d={`M ${cx - 4} ${y + 22} C ${cx - 6} ${y + 12} ${cx} ${y + 7} ${cx + 4} ${y + 15} Z`}
        fill="#ffe090"
        opacity=".6"
      />
    </g>
  );
}

export function OpenBook({
  x,
  y,
  w = 30,
  h = 20,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="1" fill={CLR.paper} opacity=".8" />
      <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={CLR.furnDk} strokeWidth="1.2" />
      {[5, 10, 15].map((dy) => (
        <g key={dy}>
          <line
            x1={x + 3}
            y1={y + dy}
            x2={x + w / 2 - 3}
            y2={y + dy}
            stroke={CLR.furnDk}
            strokeWidth=".6"
            opacity=".5"
          />
          <line
            x1={x + w / 2 + 3}
            y1={y + dy}
            x2={x + w - 3}
            y2={y + dy}
            stroke={CLR.furnDk}
            strokeWidth=".6"
            opacity=".5"
          />
        </g>
      ))}
    </g>
  );
}

export function Carpet({
  x,
  y,
  w,
  h,
  color = CLR.carpet,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={color} opacity=".35" />
      <rect
        x={x + 3}
        y={y + 3}
        width={w - 6}
        height={h - 6}
        rx="1"
        fill="none"
        stroke={CLR.gold}
        strokeWidth=".7"
        opacity=".4"
      />
    </g>
  );
}

export function Banner({ cx, cy, h = 28 }: { cx: number; cy: number; h?: number }) {
  return (
    <g>
      <rect x={cx - 8} y={cy} width={16} height={h} rx="1" fill={CLR.carpet} opacity=".6" />
      <circle cx={cx} cy={cy + h * 0.4} r="4" fill={CLR.gold} opacity=".5" />
      <line
        x1={cx - 5}
        y1={cy + h * 0.4}
        x2={cx + 5}
        y2={cy + h * 0.4}
        stroke={CLR.gold}
        strokeWidth=".8"
        opacity=".5"
      />
      <line
        x1={cx}
        y1={cy + h * 0.25}
        x2={cx}
        y2={cy + h * 0.55}
        stroke={CLR.gold}
        strokeWidth=".8"
        opacity=".5"
      />
    </g>
  );
}

export function ArmorStand({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 18} rx={10} ry={5} fill={CLR.furnDk} opacity=".5" />
      <rect x={cx - 2} y={cy - 8} width={4} height={26} rx="1" fill={CLR.furnDk} />
      <ellipse cx={cx} cy={cy - 5} rx={13} ry={6} fill={CLR.shieldGray} />
      <ellipse cx={cx} cy={cy - 14} rx={7} ry={8} fill={CLR.shieldGray} />
      <ellipse cx={cx} cy={cy - 11} rx={4} ry={3} fill={CLR.furnDk} opacity=".5" />
    </g>
  );
}
