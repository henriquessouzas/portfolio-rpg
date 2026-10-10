import { useEffect, useReducer, useRef } from 'react';
import { CastleScreen } from '@/screens/CastleScreen';
import { MapScreen } from '@/screens/MapScreen';
import { RoomScreen } from '@/screens/RoomScreen';
import { initialState, navReducer } from './navReducer';

export default function App() {
  const [state, dispatch] = useReducer(navReducer, initialState);
  const focusTargetRef = useRef<HTMLElement | null>(null);

  // Move focus to the new screen's heading/hud on every screen change
  useEffect(() => {
    focusTargetRef.current?.focus();
  }, [state.screen]);

  if (state.screen === 'room' && state.room) {
    return (
      <RoomScreen
        roomKey={state.room}
        onBack={() => dispatch({ type: 'backToMap' })}
        focusRef={focusTargetRef}
      />
    );
  }

  if (state.screen === 'map') {
    return (
      <MapScreen
        heroPos={state.heroPos}
        onHeroMove={(pos) => dispatch({ type: 'moveHero', pos })}
        onSelectRoom={(room) => dispatch({ type: 'selectRoom', room })}
        onExit={() => dispatch({ type: 'exitToCastle' })}
        focusRef={focusTargetRef}
      />
    );
  }

  return (
    <CastleScreen
      onEnter={() => dispatch({ type: 'enterMap' })}
      onSkip={() => dispatch({ type: 'openSimple' })}
      focusRef={focusTargetRef}
    />
  );
}
