import { useState } from 'react';
import { CastleScreen } from '@/screens/CastleScreen';
import { MapScreen } from '@/screens/MapScreen';
import { HERO_START } from '@/features/map/mapData';
import type { Pos } from '@/features/map/mapData';

type Screen = 'castle' | 'map';

export default function App() {
  const [screen, setScreen] = useState<Screen>('castle');
  const [heroPos, setHeroPos] = useState<Pos>(HERO_START);

  if (screen === 'map') {
    return (
      <MapScreen
        heroPos={heroPos}
        onHeroMove={setHeroPos}
        onSelectRoom={() => {
          // Room screen — next step
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
