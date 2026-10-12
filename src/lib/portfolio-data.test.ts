import { describe, expect, it } from 'vitest';
import {
  castleMap,
  castleNavigationGrid,
  castleObstacles,
  entrance,
  findPath,
  rooms,
} from './portfolio-data';

describe('castle pathfinding', () => {
  it('reaches every room from the entrance without crossing walls', () => {
    for (const room of rooms) {
      const path = findPath(entrance, room.destination);
      expect(path[0]).toEqual(entrance);
      expect(path.at(-1)).toEqual(room.destination);
      path.forEach((tile, i) => {
        expect(castleMap[tile.y]?.[tile.x]).not.toBe('#');
        const previous = path[i - 1];
        if (previous) expect(Math.abs(previous.x - tile.x) + Math.abs(previous.y - tile.y)).toBe(1);
      });
    }
  });
  it('connects every pair of rooms', () => {
    rooms.forEach((a) =>
      rooms.forEach((b) =>
        expect(findPath(a.destination, b.destination).at(-1)).toEqual(b.destination),
      ),
    );
  });
  it('walks around the courtyard fountain on every route', () => {
    for (const start of [entrance, ...rooms.map((room) => room.destination)]) {
      for (const room of rooms) {
        const path = findPath(start, room.destination);
        expect(path.at(-1)).toEqual(room.destination);
        path.forEach((tile) => expect(castleNavigationGrid[tile.y]?.[tile.x]).not.toBe('#'));
        expect(
          path.some((tile) => castleObstacles.some((p) => p.x === tile.x && p.y === tile.y)),
        ).toBe(false);
      }
    }
  });
  it('rejects walls, out of bounds, and unreachable targets', () => {
    expect(findPath(entrance, { x: 0, y: 0 })).toEqual([]);
    expect(findPath(entrance, { x: -1, y: 0 })).toEqual([]);
    expect(findPath({ x: 0, y: 0 }, { x: 2, y: 0 }, ['.#.'])).toEqual([]);
  });
  it('handles the current position as a destination', () => {
    expect(findPath(entrance, entrance)).toEqual([entrance]);
  });
});
