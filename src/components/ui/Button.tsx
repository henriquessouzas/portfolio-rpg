import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[styles.btn, variant === 'secondary' ? styles.secondary : '', className ?? '']
        .join(' ')
        .trim()}
    >
      {children}
    </button>
  );
}
