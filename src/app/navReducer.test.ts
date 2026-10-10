import { describe, expect, it } from 'vitest';
import { HERO_START } from '@/features/map/mapData';
import { initialState, navReducer } from './navReducer';

describe('navReducer', () => {
  it('enterMap: castle → map', () => {
    const s = navReducer(initialState, { type: 'enterMap' });
    expect(s.screen).toBe('map');
    expect(s.heroPos).toEqual(HERO_START);
  });

  it('selectRoom: map → room with roomKey', () => {
    const map = navReducer(initialState, { type: 'enterMap' });
    const s = navReducer(map, { type: 'selectRoom', room: 'armory' });
    expect(s.screen).toBe('room');
    expect(s.room).toBe('armory');
  });

  it('backToMap: room → map', () => {
    const room = navReducer(initialState, { type: 'selectRoom', room: 'lab' });
    const s = navReducer(room, { type: 'backToMap' });
    expect(s.screen).toBe('map');
  });

  it('exitToCastle: map → castle', () => {
    const map = navReducer(initialState, { type: 'enterMap' });
    const s = navReducer(map, { type: 'exitToCastle' });
    expect(s.screen).toBe('castle');
  });

  it('openSimple: castle → simple', () => {
    const s = navReducer(initialState, { type: 'openSimple' });
    expect(s.screen).toBe('simple');
  });

  it('closeSimple: simple → castle', () => {
    const simple = navReducer(initialState, { type: 'openSimple' });
    const s = navReducer(simple, { type: 'closeSimple' });
    expect(s.screen).toBe('castle');
  });

  it('moveHero: updates heroPos', () => {
    const s = navReducer(initialState, { type: 'moveHero', pos: { x: 3, y: 5 } });
    expect(s.heroPos).toEqual({ x: 3, y: 5 });
  });

  it('preserves heroPos across screen transitions', () => {
    const moved = navReducer(initialState, { type: 'moveHero', pos: { x: 4, y: 7 } });
    const map = navReducer(moved, { type: 'enterMap' });
    const room = navReducer(map, { type: 'selectRoom', room: 'throne' });
    const back = navReducer(room, { type: 'backToMap' });
    expect(back.heroPos).toEqual({ x: 4, y: 7 });
  });

  it('unknown action returns state unchanged', () => {
    // @ts-expect-error testing unknown action
    const s = navReducer(initialState, { type: 'unknown' });
    expect(s).toEqual(initialState);
  });
});
