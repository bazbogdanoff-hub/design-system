import { forwardRef, type ComponentType, type HTMLAttributes, type ReactNode, type SVGProps } from 'react';
import { cn } from '../../lib/cn';
import { InfoIcon } from './InfoIcon';
import { WarningIcon } from './WarningIcon';
import styles from './HelperText.module.css';

export type HelperTextTone = 'primary' | 'error';
export type HelperTextSize = 'sm' | 'md' | 'lg';

export interface HelperTextProps extends HTMLAttributes<HTMLDivElement> {
  /** `primary` (an informational note, brand-colored) or `error` (a validation failure, danger-colored). No `default` — this component only ever renders in one of these two tones. */
  tone: HelperTextTone;
  /** `sm` · `md` (default) · `lg` — matches the `Input`/`FormField` it sits under. */
  size?: HelperTextSize;
  children: ReactNode;
}

const ICON: Record<HelperTextTone, ComponentType<SVGProps<SVGSVGElement>>> = {
  primary: InfoIcon,
  error: WarningIcon,
};

/**
 * A fixed icon + message row — `FormField`'s helper text below a control in
 * a non-default state. Icon and message are always the same tone color (a
 * red message with a gray icon would read as inconsistent), and the icon is
 * fixed per tone, not a prop — same "no free icon" rule as `SeverityBadge`.
 */
export const HelperText = forwardRef<HTMLDivElement, HelperTextProps>(function HelperText(
  { tone, size = 'md', children, className, ...rest },
  ref,
) {
  const Icon = ICON[tone];
  return (
    <div
      ref={ref}
      className={cn(styles.helper, className)}
      data-tone={tone}
      data-size={size}
      role={tone === 'error' ? 'alert' : undefined}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        <Icon />
      </span>
      <span className={styles.message}>{children}</span>
    </div>
  );
});
