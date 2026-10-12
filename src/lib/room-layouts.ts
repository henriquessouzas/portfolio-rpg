import type { Point, RoomId } from './portfolio-data';
export type Fixture = {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: string;
  object?: number;
  approach?: Point;
};
export const roomLayouts: Record<RoomId, Fixture[]> = {
  B: [
    { x: 2, y: 2, w: 4, h: 3, kind: 'shelf', object: 0, approach: { x: 4, y: 5 } },
    { x: 8, y: 2, w: 4, h: 3, kind: 'shelf', object: 1, approach: { x: 10, y: 5 } },
    { x: 14, y: 2, w: 4, h: 3, kind: 'shelf', object: 2, approach: { x: 16, y: 5 } },
    { x: 3, y: 8, w: 4, h: 2, kind: 'reading' },
    { x: 13, y: 8, w: 4, h: 2, kind: 'reading' },
    { x: 1, y: 11, w: 2, h: 2, kind: 'plant' },
    { x: 17, y: 11, w: 2, h: 2, kind: 'plant' },
  ],
  T: [
    { x: 8, y: 2, w: 4, h: 3, kind: 'royal-throne', object: 0, approach: { x: 10, y: 5 } },
    { x: 2, y: 5, w: 3, h: 2, kind: 'writing', object: 1, approach: { x: 4, y: 7 } },
    { x: 15, y: 3, w: 3, h: 3, kind: 'trophy-case', object: 2, approach: { x: 16, y: 6 } },
    { x: 15, y: 10, w: 3, h: 2, kind: 'mail', object: 3, approach: { x: 14, y: 11 } },
    { x: 2, y: 2, w: 2, h: 2, kind: 'plant' },
    { x: 2, y: 10, w: 2, h: 2, kind: 'plant' },
  ],
  A: [
    { x: 2, y: 2, w: 5, h: 5, kind: 'large-bed', object: 0, approach: { x: 7, y: 6 } },
    { x: 12, y: 3, w: 5, h: 2, kind: 'work-desk', object: 1, approach: { x: 14, y: 5 } },
    { x: 9, y: 1, w: 2, h: 2, kind: 'wall-poster', object: 2, approach: { x: 10, y: 3 } },
    { x: 14, y: 10, w: 3, h: 2, kind: 'treasure', object: 3, approach: { x: 13, y: 11 } },
    { x: 2, y: 10, w: 3, h: 2, kind: 'reading' },
    { x: 17, y: 6, w: 2, h: 2, kind: 'plant' },
  ],
  R: [
    { x: 2, y: 2, w: 3, h: 3, kind: 'weapon-rack', object: 0, approach: { x: 4, y: 5 } },
    { x: 7, y: 2, w: 3, h: 3, kind: 'bow-rack', object: 1, approach: { x: 8, y: 5 } },
    { x: 13, y: 2, w: 3, h: 3, kind: 'shield-rack', object: 2, approach: { x: 14, y: 5 } },
    { x: 14, y: 9, w: 3, h: 3, kind: 'forge', object: 3, approach: { x: 13, y: 10 } },
    { x: 2, y: 9, w: 3, h: 2, kind: 'crates' },
    { x: 7, y: 8, w: 3, h: 2, kind: 'training' },
  ],
  L: [
    { x: 2, y: 3, w: 5, h: 2, kind: 'blue-workbench', object: 0, approach: { x: 5, y: 5 } },
    { x: 12, y: 3, w: 5, h: 2, kind: 'green-workbench', object: 1, approach: { x: 14, y: 5 } },
    { x: 8, y: 8, w: 4, h: 3, kind: 'alchemy', object: 2, approach: { x: 10, y: 11 } },
    { x: 8, y: 1, w: 3, h: 2, kind: 'cabinet' },
    { x: 2, y: 10, w: 2, h: 2, kind: 'crates' },
    { x: 16, y: 10, w: 2, h: 2, kind: 'plant' },
  ],
};
export const roomEntrance: Point = { x: 10, y: 12 };
export function roomGrid(id: RoomId): string[] {
  const grid = Array.from({ length: 14 }, (_, y) =>
    Array.from({ length: 20 }, (_, x) => (x === 0 || x === 19 || y === 0 || y === 13 ? '#' : '.')),
  );
  for (const f of roomLayouts[id])
    for (let y = f.y; y < f.y + f.h; y++)
      for (let x = f.x; x < f.x + f.w; x++) {
        const row = grid[y];
        if (row) row[x] = '#';
      }
  return grid.map((row) => row.join(''));
}
