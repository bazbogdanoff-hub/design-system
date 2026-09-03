import { forwardRef, type HTMLAttributes } from 'react';
import { Badge, type BadgeSize, type BadgeTone } from '../Badge';
import { cn } from '../../lib/cn';
import { SeverityIcon, type SeverityIconSize } from './SeverityIcon';
import styles from './SeverityBadge.module.css';

export type SeverityLevel = 'low' | 'attention' | 'warning' | 'critical';
export type SeverityBadgeSize = BadgeSize;
export type SeverityBadgeFormat = 'pill' | 'icon';

/** level → Badge tone. Names describe colour, not rank: attention=amber, warning=orange. */
const TONE: Record<SeverityLevel, BadgeTone> = {
  low: 'success',
  attention: 'warning',
  warning: 'warning-strong',
  critical: 'danger',
};

const LABEL: Record<SeverityLevel, string> = {
  low: 'Low',
  attention: 'Attention',
  warning: 'Warning',
  critical: 'Critical',
};

const ICON_SIZE: Record<SeverityBadgeSize, SeverityIconSize> = { sm: 16, md: 20, lg: 24 };

export interface SeverityBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Severity level — the component's whole content. Escalates low → attention → warning → critical. */
  level: SeverityLevel;
  /** `sm` · `md` (default) · `lg`. */
  size?: SeverityBadgeSize;
  /** `pill` (coloured text chip, default) or `icon` (bare triangle, for tight spaces). */
  format?: SeverityBadgeFormat;
}

/**
 * A fixed 4-level severity indicator (L2). `pill` is a `Badge` in the level's
 * tone with the level name; `icon` is just the alert-triangle in the level
 * colour. No free text, no custom icon. See docs/architecture.md.
 */
export const SeverityBadge = forwardRef<HTMLSpanElement, SeverityBadgeProps>(function SeverityBadge(
  { level, size = 'md', format = 'pill', className, ...rest },
  ref,
) {
  if (format === 'icon') {
    return (
      <span
        ref={ref}
        className={cn(styles.icon, className)}
        data-level={level}
        role="img"
        aria-label={LABEL[level]}
        {...rest}
      >
        <SeverityIcon size={ICON_SIZE[size]} />
      </span>
    );
  }

  return (
    <Badge ref={ref} tone={TONE[level]} size={size} className={className} {...rest}>
      {LABEL[level]}
    </Badge>
  );
});
