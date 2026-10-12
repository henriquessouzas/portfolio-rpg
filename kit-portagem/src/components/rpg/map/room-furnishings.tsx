import { ROOM_BOUNDS } from "@/lib/castle-plan";
import {
  ArmorStand,
  Banner,
  Bed,
  Bookshelf,
  Candle,
  Carpet,
  Cauldron,
  Chest,
  Fireplace,
  Flask,
  OpenBook,
  Pillar,
  Shield,
  TableRect,
  Throne,
  WallTorch,
  WeaponRack,
} from "./furniture";
import { CLR } from "./palette";

/* Uma peça de componente por sala: cada uma recebe só a posição da sala. */

export function LibraryFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.B;
  return (
    <g data-room="B">
      <Bookshelf x={x + 6} y={y + 6} w={w - 12} h={15} />
      <Bookshelf x={x + 6} y={y + 24} w={14} h={h - 55} vertical />
      <TableRect x={x + 50} y={y + 75} w={82} h={50} />
      <OpenBook x={x + 58} y={y + 82} w={36} h={22} />
      <rect x={x + 105} y={y + 80} width={18} height={12} rx="1" fill={CLR.bookRed} opacity=".7" />
      <rect x={x + 105} y={y + 72} width={18} height={9} rx="1" fill={CLR.bookBlue} opacity=".7" />
      <rect x={x + 68} y={y + 132} width={28} height={24} rx="3" fill={CLR.furnDk} />
      <rect x={x + 71} y={y + 135} width={22} height={18} rx="2" fill={CLR.furn} opacity=".7" />
      <Candle cx={x + 125} cy={y + 92} />
      <rect x={x + 130} y={y + 140} width={26} height={22} rx="3" fill={CLR.furnDk} opacity=".8" />
      <WallTorch cx={x + w - 8} cy={y + 55} />
      <WallTorch cx={x + w - 8} cy={y + 145} />
    </g>
  );
}

export function ThroneFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.T;
  const mid = x + w / 2;
  return (
    <g data-room="T">
      <Carpet x={mid - 18} y={y + 10} w={36} h={h - 30} />
      <Throne cx={mid} cy={y + 38} />
      <Pillar cx={x + 22} cy={y + 28} r={9} />
      <Pillar cx={x + w - 22} cy={y + 28} r={9} />
      <Pillar cx={x + 22} cy={y + h - 22} r={9} />
      <Pillar cx={x + w - 22} cy={y + h - 22} r={9} />
      <WallTorch cx={x + 22} cy={y + 70} />
      <WallTorch cx={x + w - 22} cy={y + 70} />
      <rect x={x + 8} y={y + 90} width={14} height={80} rx="2" fill={CLR.furnDk} opacity=".7" />
      <rect
        x={x + w - 22}
        y={y + 90}
        width={14}
        height={80}
        rx="2"
        fill={CLR.furnDk}
        opacity=".7"
      />
      <Banner cx={x + 22} cy={y + 8} h={30} />
      <Banner cx={x + w - 22} cy={y + 8} h={30} />
    </g>
  );
}

export function LabFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.L;
  const flasks = [CLR.potionBlue, CLR.potionGreen, CLR.potionRed, CLR.potionPurp];
  return (
    <g data-room="L">
      <TableRect x={x + 6} y={y + 6} w={w - 12} h={18} />
      {Array.from({ length: 8 }, (_, i) => (
        <Flask
          key={i}
          cx={x + 20 + i * 15}
          cy={y + 14}
          color={flasks[i % 4] ?? CLR.potionBlue}
          size={0.8 + (i % 4) * 0.1}
        />
      ))}
      <Cauldron cx={x + w / 2} cy={y + h - 44} r={16} />
      <Bookshelf x={x + w - 18} y={y + 30} w={12} h={h - 60} vertical />
      <TableRect x={x + 18} y={y + 80} w={84} h={44} />
      <rect x={x + 24} y={y + 86} width={28} height={18} rx="2" fill={CLR.paper} opacity=".5" />
      <rect x={x + 60} y={y + 90} width={20} height={14} rx="2" fill={CLR.paper} opacity=".4" />
      <Candle cx={x + w - 30} cy={y + 55} />
      <Candle cx={x + 28} cy={y + h - 22} />
    </g>
  );
}

export function ArsenalFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.R;
  return (
    <g data-room="R">
      <WeaponRack cx={x + 28} cy={y + 40} w={44} h={18} />
      <WeaponRack cx={x + 28} cy={y + 72} w={44} h={18} />
      <rect x={x + 6} y={y + 100} width={14} height={80} rx="2" fill={CLR.furnDk} opacity=".7" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={x + 8 + i * 2.5}
          y1={y + 102}
          x2={x + 8 + i * 2.5}
          y2={y + 178}
          stroke={CLR.ironGray}
          strokeWidth="1.2"
        />
      ))}
      <Shield cx={x + w - 20} cy={y + 38} r={10} />
      <Shield cx={x + w - 20} cy={y + 68} r={10} />
      <Shield cx={x + w - 20} cy={y + 98} r={10} />
      <ArmorStand cx={x + w / 2 + 10} cy={y + h / 2 - 10} />
      <Chest x={x + 50} y={y + h - 40} w={70} h={25} />
      <WallTorch cx={x + w - 8} cy={y + 150} />
      <WallTorch cx={x + 8} cy={y + 200} />
    </g>
  );
}

export function HallFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.H;
  const mid = x + w / 2;
  return (
    <g data-room="H">
      <Carpet x={mid - 68} y={y + 40} w={136} h={h - 100} />
      <TableRect x={mid - 74} y={y + 75} w={148} h={52} />
      <rect x={mid - 68} y={y + 60} width={136} height={12} rx="2" fill={CLR.furnDk} opacity=".8" />
      <rect
        x={mid - 68}
        y={y + 130}
        width={136}
        height={12}
        rx="2"
        fill={CLR.furnDk}
        opacity=".8"
      />
      {[-40, -15, 15, 40].map((dx) => (
        <circle key={dx} cx={mid + dx} cy={y + 100} r={6} fill={CLR.furnDk} opacity=".6" />
      ))}
      <Fireplace cx={mid} y={y + h - 32} />
      <Pillar cx={x + 30} cy={y + 22} r={10} />
      <Pillar cx={x + w - 30} cy={y + 22} r={10} />
      <Banner cx={x + 16} cy={y + 45} h={36} />
      <Banner cx={x + w - 16} cy={y + 45} h={36} />
      <WallTorch cx={x + 16} cy={y + 155} />
      <WallTorch cx={x + w - 16} cy={y + 155} />
    </g>
  );
}

export function QuartersFurnishings() {
  const [x, y, w, h] = ROOM_BOUNDS.A;
  return (
    <g data-room="A">
      <Bed x={x + 8} y={y + 8} w={w - 16} h={55} />
      <rect x={x + 6} y={y + 78} width={18} height={72} rx="2" fill={CLR.furnDk} />
      <line x1={x + 15} y1={y + 82} x2={x + 15} y2={y + 146} stroke={CLR.wall} strokeWidth="1" />
      <circle cx={x + 12} cy={y + 114} r="2" fill={CLR.furn} />
      <circle cx={x + 18} cy={y + 114} r="2" fill={CLR.furn} />
      <TableRect x={x + 30} y={y + 100} w={60} h={38} />
      <OpenBook x={x + 36} y={y + 107} w={28} h={18} />
      <Candle cx={x + 78} cy={y + 112} />
      <rect x={x + 50} y={y + 144} width={24} height={22} rx="3" fill={CLR.furnDk} opacity=".8" />
      <rect x={x + 53} y={y + 147} width={18} height={16} rx="2" fill={CLR.furn} opacity=".6" />
      <rect x={x + w - 10} y={y + 30} width={6} height={20} rx="1" fill={CLR.water} opacity=".8" />
      <rect x={x + w - 10} y={y + 160} width={6} height={20} rx="1" fill={CLR.water} opacity=".8" />
      <Chest x={x + 30} y={y + h - 38} w={55} h={22} />
      <WallTorch cx={x + w - 10} cy={y + h / 2} />
    </g>
  );
}
