import styles from './Panel.module.css';

type PanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, children, className }: PanelProps) {
  return (
    <div className={[styles.panel, className ?? ''].join(' ').trim()}>
      {title && <h4 className={styles.title}>{title}</h4>}
      {children}
    </div>
  );
}
