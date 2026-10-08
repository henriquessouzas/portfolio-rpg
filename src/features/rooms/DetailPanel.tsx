import { Tag } from '@/components/ui';
import type { RoomObject } from '@/types/room';
import styles from './DetailPanel.module.css';

type DetailPanelProps = {
  object: RoomObject;
};

export function DetailPanel({ object }: DetailPanelProps) {
  return (
    <div className={styles.panel} role="region" aria-label={`Detalhes: ${object.name}`}>
      <h2 className={styles.title}>
        {object.emoji} {object.name}
      </h2>
      <p className={styles.subtitle}>{object.subtitle}</p>
      <p className={styles.description}>{object.description}</p>
      <div className={styles.tags}>
        {object.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </div>
  );
}
