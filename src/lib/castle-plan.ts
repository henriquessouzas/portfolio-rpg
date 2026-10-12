import type { Point, RoomId } from "./portfolio-data";

/** Planta do castelo (coordenadas do SVG 640x520). Hall = entrada. */
export type PlanRoomId = RoomId | "H";
type Rect = readonly [x: number, y: number, w: number, h: number];

export const MAP_WIDTH = 640;
export const MAP_HEIGHT = 520;
export const CX0 = 16;
export const CY0 = 16;
export const WALL = 13;
const COL1 = 170;
const COL2 = 216;
const ROW1 = 185;
const ROW2 = 264;
export const CASTLE_W = WALL * 4 + COL1 * 2 + COL2;
export const CASTLE_H = WALL * 3 + ROW1 + ROW2;

const x1 = CX0 + WALL;
const x2 = x1 + COL1 + WALL;
const x3 = x2 + COL2 + WALL;
const y1 = CY0 + WALL;
const y2 = y1 + ROW1 + WALL;

/** B biblioteca, T sala do trono, L laboratório, R arsenal, A aposentos, H entrada. */
export const ROOM_BOUNDS: Record<PlanRoomId, Rect> = {
  B: [x1, y1, COL1, ROW1],
  T: [x2, y1, COL2, ROW1],
  L: [x3, y1, COL1, ROW1],
  R: [x1, y2, COL1, ROW2],
  H: [x2, y2, COL2, ROW2],
  A: [x3, y2, COL1, ROW2],
};

/** Passagens que abrem as paredes entre os cômodos. */
export const DOORS: Record<string, Rect> = {
  BT: [x1 + COL1, y1 + 70, WALL, 32],
  TL: [x2 + COL2, y1 + 70, WALL, 32],
  BR: [x1 + 56, y1 + ROW1, 32, WALL],
  TH: [x2 + 88, y1 + ROW1, 32, WALL],
  LA: [x3 + 56, y1 + ROW1, 32, WALL],
  RH: [x1 + COL1, y2 + 112, WALL, 32],
  HA: [x2 + COL2, y2 + 112, WALL, 32],
  GATE: [x2 + 88, y2 + ROW2, 40, WALL],
};

const center = ([x, y, w, h]: Rect): Point => ({ x: x + w / 2, y: y + h / 2 });

export const MAP_ENTRANCE: Point = { x: 320, y: y2 + ROW2 + WALL / 2 };
/** Onde o herói para em cada sala (livre de móveis). */
export const ROOM_STAND: Record<PlanRoomId, Point> = {
  B: { x: x1 + 82, y: y1 + 148 },
  T: { x: x2 + 108, y: y1 + 44 },
  L: { x: x3 + 130, y: y1 + 100 },
  R: { x: x1 + 95, y: y2 + 160 },
  A: { x: x3 + 120, y: y2 + 100 },
  H: { x: x2 + 108, y: y2 + 190 },
};

const inside = (p: Point, [x, y, w, h]: Rect) =>
  p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;
export const isWalkable = (p: Point) =>
  [...Object.values(ROOM_BOUNDS), ...Object.values(DOORS)].some((r) => inside(p, r));
export function roomAt(p: Point): PlanRoomId | null {
  return (
    (Object.keys(ROOM_BOUNDS) as PlanRoomId[]).find((id) => inside(p, ROOM_BOUNDS[id])) ?? null
  );
}

/** Move o herói e desliza pelas paredes quando bate nelas. */
export function moveBy(p: Point, dx: number, dy: number): Point {
  for (const next of [
    { x: p.x + dx, y: p.y + dy },
    { x: p.x + dx, y: p.y },
    { x: p.x, y: p.y + dy },
  ])
    if (isWalkable(next)) return next;
  return p;
}

const nodes: Record<string, Point> = {
  ...Object.fromEntries(Object.entries(ROOM_BOUNDS).map(([id, r]) => [id, center(r)])),
  ...Object.fromEntries(Object.entries(DOORS).map(([id, r]) => [`d${id}`, center(r)])),
};
const edges: [string, string][] = [
  ["B", "dBT"],
  ["dBT", "T"],
  ["T", "dTL"],
  ["dTL", "L"],
  ["B", "dBR"],
  ["dBR", "R"],
  ["T", "dTH"],
  ["dTH", "H"],
  ["L", "dLA"],
  ["dLA", "A"],
  ["R", "dRH"],
  ["dRH", "H"],
  ["H", "dHA"],
  ["dHA", "A"],
  ["H", "dGATE"],
];
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function locate(p: Point): string | null {
  const door = Object.entries(DOORS).find(([, r]) => inside(p, r));
  return door ? `d${door[0]}` : roomAt(p);
}

function nodePath(from: string, to: string): string[] {
  const best = new Map<string, number>([[from, 0]]);
  const prev = new Map<string, string>();
  const open = new Set([from]);
  while (open.size) {
    const current = [...open].reduce((a, b) =>
      (best.get(a) ?? Infinity) <= (best.get(b) ?? Infinity) ? a : b,
    );
    open.delete(current);
    if (current === to) break;
    for (const [a, b] of edges) {
      const next = a === current ? b : b === current ? a : null;
      const here = nodes[current];
      const there = next ? nodes[next] : undefined;
      if (!next || !here || !there) continue;
      const cost = (best.get(current) ?? Infinity) + dist(here, there);
      if (cost < (best.get(next) ?? Infinity)) {
        best.set(next, cost);
        prev.set(next, current);
        open.add(next);
      }
    }
  }
  const path = [to];
  while (path[0] !== from) {
    const before = prev.get(path[0] ?? "");
    if (!before) return [];
    path.unshift(before);
  }
  return path;
}

/** Rota com linhas retas entre centros de salas e portas. Vazia se não houver caminho. */
export function planRoute(from: Point, to: Point): Point[] {
  const start = locate(from);
  const goal = locate(to);
  if (!start || !goal) return [];
  const via = nodePath(start, goal).flatMap((id) => (nodes[id] ? [nodes[id]] : []));
  return [from, ...via, to];
}

/** Divide a rota em passos de tamanho fixo para animar o herói. */
export function sampleRoute(route: Point[], step: number): Point[] {
  const out: Point[] = [];
  route.slice(1).forEach((end, i) => {
    const begin = route[i];
    if (!begin) return;
    const count = Math.max(1, Math.ceil(dist(begin, end) / step));
    for (let k = 1; k <= count; k++)
      out.push({
        x: begin.x + ((end.x - begin.x) * k) / count,
        y: begin.y + ((end.y - begin.y) * k) / count,
      });
  });
  return out;
}
