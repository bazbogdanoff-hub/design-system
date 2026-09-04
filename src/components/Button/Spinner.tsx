import type { SVGProps } from 'react';
import styles from './Button.module.css';

/**
 * The button loading spinner — a 3/4 arc rotating via CSS. Colour = `currentColor`,
 * size = `1em` (the button sets font-size, so it tracks the label). Internal to
 * Button / IconButton.
 */
export function Spinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={styles.spinner}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="42 14"
      />
    </svg>
  );
}
