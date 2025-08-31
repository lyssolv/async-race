import styles from './colorPicker11.module.css';

type Props = {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
};

export default function ColorPicker({
  value,
  onChange,
  disabled,
  className = '',
  ariaLabel = 'Choose color',
}: Props) {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[styles.root, className].join(' ').trim()}
    />
  );
}
