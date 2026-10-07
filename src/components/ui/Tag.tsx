import styles from './Tag.module.css';

type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return <span className={styles.tag}>{label}</span>;
}
