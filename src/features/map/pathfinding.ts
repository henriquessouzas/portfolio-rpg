import type { Pos } from './mapData';

const DIRS: Pos[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

function key(p: Pos): string {
  return `${p.x},${p.y}`;
}

function isWalkable(grid: readonly string[], p: Pos): boolean {
  const row = grid[p.y];
  return row !== undefined && row[p.x] !== '#';
}

/**
 * BFS from start to goal on the given grid.
 * Every tile except '#' is walkable.
 * Returns the path from start to goal (inclusive), or [] if unreachable.
 */
export function findPath(grid: readonly string[], start: Pos, goal: Pos): Pos[] {
  if (key(start) === key(goal)) return [start];

  const visited = new Set<string>([key(start)]);
  const prev = new Map<string, Pos>();
  const queue: Pos[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const dir of DIRS) {
      const next: Pos = { x: current.x + dir.x, y: current.y + dir.y };
      const nk = key(next);

      if (visited.has(nk) || !isWalkable(grid, next)) continue;

      visited.add(nk);
      prev.set(nk, current);

      if (key(next) === key(goal)) {
        // Reconstruct path
        const path: Pos[] = [next];
        let cur = next;
        while (key(cur) !== key(start)) {
          cur = prev.get(key(cur))!;
          path.unshift(cur);
        }
        return path;
      }

      queue.push(next);
    }
  }

  return [];
}
