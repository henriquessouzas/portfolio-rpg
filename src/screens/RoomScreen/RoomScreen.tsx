import { useEffect } from 'react';
import { Hud } from '@/components/ui';
import { rooms } from '@/content/rooms';
import { RoomStage } from '@/features/rooms/RoomStage';
import type { RoomKey } from '@/types/room';
import styles from './RoomScreen.module.css';

type RoomScreenProps = {
  roomKey: RoomKey;
  onBack: () => void;
};

export function RoomScreen({ roomKey, onBack }: RoomScreenProps) {
  const room = rooms.find((r) => r.key === roomKey)!;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  return (
    <div className={styles.screen}>
      <Hud label={`Mapa ▸ ${room.name}`} onBack={onBack} />
      <RoomStage room={room} autoSelect={roomKey === 'throne'} />
    </div>
  );
}
