import { Button, Panel, Tag } from '@/components/ui';
import { profile } from '@/content/profile';
import { rooms } from '@/content/rooms';
import styles from './SimpleScreen.module.css';

type SimpleScreenProps = {
  onBack: () => void;
};

export function SimpleScreen({ onBack }: SimpleScreenProps) {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{profile.name}</h1>
        <Button variant="secondary" onClick={onBack} aria-label="Voltar ao jogo">
          Voltar ao jogo
        </Button>
      </header>

      <main className={styles.main}>
        {rooms.map((room) => (
          <section key={room.key} className={styles.section}>
            <h2 className={styles.roomTitle}>{room.name}</h2>
            {room.objects.map((obj) => (
              <Panel key={obj.id} className={styles.item}>
                <p className={styles.objName}>
                  {obj.emoji} {obj.name}
                </p>
                <p className={styles.objSubtitle}>{obj.subtitle}</p>
                <p className={styles.objDesc}>{obj.description}</p>
                <div className={styles.tags}>
                  {obj.tags.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </div>
              </Panel>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
