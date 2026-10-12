import { describe, it, expect } from 'vitest';
import { findPath, rooms } from './portfolio-data';
import { roomEntrance, roomGrid, roomLayouts } from './room-layouts';
describe('furnished room exploration', () => {
  it('reaches every object and every object pair without crossing furniture', () => {
    for (const room of rooms) {
      const grid = roomGrid(room.id);
      const destinations = roomLayouts[room.id].flatMap((f) => (f.approach ? [f.approach] : []));
      for (const start of [roomEntrance, ...destinations])
        for (const destination of destinations) {
          const path = findPath(start, destination, grid);
          expect(path.at(-1)).toEqual(destination);
          for (const tile of path) expect(grid[tile.y]?.[tile.x]).not.toBe('#');
        }
      expect(destinations.length).toBe(room.objects.length);
    }
  });
});
