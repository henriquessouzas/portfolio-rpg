import { describe, expect, it } from 'vitest';
import { rooms } from '@/content/rooms';

describe('rooms data', () => {
  it('has exactly 5 rooms', () => {
    expect(rooms).toHaveLength(5);
  });

  it('every room has at least one object', () => {
    for (const room of rooms) {
      expect(room.objects.length, `${room.key} has no objects`).toBeGreaterThan(0);
    }
  });

  it('all object ids are unique across all rooms', () => {
    const ids = rooms.flatMap((r) => r.objects.map((o) => o.id));
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every room has a colorToken', () => {
    for (const room of rooms) {
      expect(room.colorToken, `${room.key} missing colorToken`).toBeTruthy();
    }
  });
});
