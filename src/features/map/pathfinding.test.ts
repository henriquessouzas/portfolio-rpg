import { describe, expect, it } from 'vitest';
import { GRID, HERO_START, LETTER_TO_ROOM, getRoomCenter } from './mapData';
import { findPath } from './pathfinding';

describe('findPath', () => {
  it('returns [start] when start equals goal', () => {
    const path = findPath(GRID, HERO_START, HERO_START);
    expect(path).toEqual([HERO_START]);
  });

  it('returns [] when goal is unreachable (inside a wall)', () => {
    const wall = { x: 0, y: 0 };
    const path = findPath(GRID, HERO_START, wall);
    expect(path).toEqual([]);
  });

  it('returns [] when goal is a wall tile', () => {
    const path = findPath(GRID, HERO_START, { x: 4, y: 0 });
    expect(path).toEqual([]);
  });

  it('path never steps on a wall tile', () => {
    for (const roomKey of Object.values(LETTER_TO_ROOM)) {
      const goal = getRoomCenter(roomKey);
      const path = findPath(GRID, HERO_START, goal);
      expect(path.length, `no path to ${roomKey}`).toBeGreaterThan(0);
      for (const pos of path) {
        expect(GRID[pos.y][pos.x], `wall at ${pos.x},${pos.y} in path to ${roomKey}`).not.toBe('#');
      }
    }
  });

  it('finds a path from entrance to every room', () => {
    for (const roomKey of Object.values(LETTER_TO_ROOM)) {
      const goal = getRoomCenter(roomKey);
      const path = findPath(GRID, HERO_START, goal);
      expect(path.length, `path to ${roomKey} is empty`).toBeGreaterThan(0);
      expect(path[0]).toEqual(HERO_START);
      expect(path[path.length - 1]).toEqual(goal);
    }
  });

  it('path is contiguous — each step is exactly 1 tile away', () => {
    const goal = getRoomCenter('throne');
    const path = findPath(GRID, HERO_START, goal);
    for (let i = 1; i < path.length; i++) {
      const dx = Math.abs(path[i].x - path[i - 1].x);
      const dy = Math.abs(path[i].y - path[i - 1].y);
      expect(dx + dy).toBe(1);
    }
  });
});
