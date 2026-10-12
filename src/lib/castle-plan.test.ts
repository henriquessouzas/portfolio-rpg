import { describe, expect, it } from 'vitest';
import {
  isWalkable,
  MAP_ENTRANCE,
  moveBy,
  planRoute,
  ROOM_BOUNDS,
  ROOM_STAND,
  roomAt,
  sampleRoute,
  type PlanRoomId,
} from './castle-plan';

const ids = Object.keys(ROOM_BOUNDS) as PlanRoomId[];

describe('castle floor plan', () => {
  it('places the entrance and every stand point on walkable floor of the right room', () => {
    expect(isWalkable(MAP_ENTRANCE)).toBe(true);
    for (const id of ids) {
      expect(isWalkable(ROOM_STAND[id])).toBe(true);
      expect(roomAt(ROOM_STAND[id])).toBe(id);
    }
  });
  it('reaches every room from the entrance without crossing walls', () => {
    for (const id of ids) {
      const route = planRoute(MAP_ENTRANCE, ROOM_STAND[id]);
      expect(route[0]).toEqual(MAP_ENTRANCE);
      expect(route.at(-1)).toEqual(ROOM_STAND[id]);
      for (const p of sampleRoute(route, 4)) expect(isWalkable(p)).toBe(true);
    }
  });
  it('connects any room to any other room', () => {
    for (const a of ids)
      for (const b of ids) {
        const route = planRoute(ROOM_STAND[a], ROOM_STAND[b]);
        expect(route.at(-1)).toEqual(ROOM_STAND[b]);
        for (const p of sampleRoute(route, 4)) expect(isWalkable(p)).toBe(true);
      }
  });
  it('blocks the hero at walls and refuses routes from outside', () => {
    const start = ROOM_STAND.B;
    expect(moveBy(start, 0, -500)).not.toEqual({ x: start.x, y: start.y - 500 });
    expect(isWalkable(moveBy({ x: ROOM_BOUNDS.B[0], y: start.y }, -50, 0))).toBe(true);
    expect(planRoute({ x: 2, y: 2 }, ROOM_STAND.T)).toEqual([]);
  });
  it('samples routes in fixed steps ending exactly at the target', () => {
    const route = planRoute(MAP_ENTRANCE, ROOM_STAND.B);
    const steps = sampleRoute(route, 22);
    expect(steps.at(-1)).toEqual(ROOM_STAND.B);
    expect(steps.length).toBeGreaterThan(10);
  });
});
