import type { RoomKey } from '@/types/room';

export type Pos = { x: number; y: number };

export type Decoration = { emoji: string; pos: Pos; label: string };

/** 13 cols × 11 rows. */
export const GRID: readonly string[] = [
  '#############',
  '#BBB#TTT#AAA#',
  '#BBB#TTT#AAA#',
  '#BBB#TTT#AAA#',
  '##D###D###D##',
  '#...........#',
  '##D###D###D##',
  '#RRR#PPP#LLL#',
  '#RRR#PPP#LLL#',
  '#RRR#PPP#LLL#',
  '######E######',
];

export const COLS = GRID[0].length; // 13
export const ROWS = GRID.length;    // 11

/** Tile letters that belong to a room. */
export const LETTER_TO_ROOM: Readonly<Record<string, RoomKey>> = {
  B: 'library',
  T: 'throne',
  A: 'quarters',
  R: 'armory',
  L: 'lab',
};

/** Hero starting position (entrance tile). */
export const HERO_START: Pos = { x: 6, y: 10 };

/** Decorative props scattered on floor tiles. */
export const DECORATIONS: readonly Decoration[] = [
  { emoji: '🪨', pos: { x: 1, y: 5 }, label: 'Pedra' },
  { emoji: '🪨', pos: { x: 3, y: 5 }, label: 'Pedra' },
  { emoji: '🕯️', pos: { x: 5, y: 5 }, label: 'Vela' },
  { emoji: '🕯️', pos: { x: 7, y: 5 }, label: 'Vela' },
  { emoji: '🪨', pos: { x: 9, y: 5 }, label: 'Pedra' },
  { emoji: '🪨', pos: { x: 11, y: 5 }, label: 'Pedra' },
];

/**
 * Returns the center tile of a room by scanning the grid for its letter.
 * Falls back to the first matching tile if the grid count is even.
 */
export function getRoomCenter(roomKey: RoomKey): Pos {
  const letter = Object.entries(LETTER_TO_ROOM).find(([, v]) => v === roomKey)?.[0];
  if (!letter) throw new Error(`No letter mapped for room: ${roomKey}`);

  const tiles: Pos[] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (GRID[y][x] === letter) tiles.push({ x, y });
    }
  }
  if (tiles.length === 0) throw new Error(`Letter "${letter}" not found in grid`);

  const mid = Math.floor(tiles.length / 2);
  return tiles[mid];
}
