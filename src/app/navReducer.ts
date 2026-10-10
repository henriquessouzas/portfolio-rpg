import { HERO_START } from '@/features/map/mapData';
import type { Pos } from '@/features/map/mapData';
import type { RoomKey } from '@/types/room';

export type AppScreen = 'castle' | 'map' | 'room' | 'simple';

export type NavState = {
  screen: AppScreen;
  room: RoomKey | null;
  heroPos: Pos;
};

export type NavAction =
  | { type: 'enterMap' }
  | { type: 'selectRoom'; room: RoomKey }
  | { type: 'backToMap' }
  | { type: 'exitToCastle' }
  | { type: 'openSimple' }
  | { type: 'closeSimple' }
  | { type: 'moveHero'; pos: Pos };

export const initialState: NavState = {
  screen: 'castle',
  room: null,
  heroPos: HERO_START,
};

export function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'enterMap':
      return { ...state, screen: 'map' };

    case 'selectRoom':
      return { ...state, screen: 'room', room: action.room };

    case 'backToMap':
      return { ...state, screen: 'map' };

    case 'exitToCastle':
      return { ...state, screen: 'castle' };

    case 'openSimple':
      return { ...state, screen: 'simple' };

    case 'closeSimple':
      return { ...state, screen: 'castle' };

    case 'moveHero':
      return { ...state, heroPos: action.pos };

    default:
      return state;
  }
}
