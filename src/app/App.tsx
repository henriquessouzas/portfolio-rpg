import { useState } from 'react';
import { CastleScreen } from '@/screens/CastleScreen';
import { MapScreen } from '@/screens/MapScreen';
import { RoomScreen } from '@/screens/RoomScreen';
import { HERO_START } from '@/features/map/mapData';
import type { Pos } from '@/features/map/mapData';
import type { RoomKey } from '@/types/room';

type Screen = 'castle' | 'map' | 'room';

export default function App() {
  const [screen, setScreen] = useState<Screen>('castle');
  const [heroPos, setHeroPos] = useState<Pos>(HERO_START);
  const [activeRoom, setActiveRoom] = useState<RoomKey | null>(null);

  if (screen === 'room' && activeRoom) {
    return (
      <RoomScreen
        roomKey={activeRoom}
        onBack={() => setScreen('map')}
      />
    );
  }

  if (screen === 'map') {
    return (
      <MapScreen
        heroPos={heroPos}
        onHeroMove={setHeroPos}
        onSelectRoom={(room: RoomKey) => {
          setActiveRoom(room);
          setScreen('room');
        }}
        onExit={() => setScreen('castle')}
      />
    );
  }

  return (
    <CastleScreen
      onEnter={() => setScreen('map')}
      onSkip={() => {
        // Simple screen — next step
      }}
    />
  );
}
