import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { CategoryIcon } from '../CategoryIcon';
import type { TagColor } from '../Tag';
import buttonStyles from '../Button/Button.module.css';
import styles from './SettingsNavItem.module.css';

export interface SettingsNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  icon: ReactNode;
  /** One of the 10 validated `color.category.*` hues — same palette `Tag`/`CategoryIcon` use. */
  color: TagColor;
  label: ReactNode;
  /** Is this the current settings section — shows the elevated `Button`
   * secondary surface, same elevation trick `SegmentedControlItem` uses for
   * its own `selected` state. `hover` needs no prop — a real `<button>` gets
   * `:hover` for free (a plain light-gray wash, not button-like). */
  active?: boolean;
  /** A small unread-style indicator dot, independent of `active` — they
   * coincide in the reference mockup but aren't the same concept. */
  badge?: boolean;
}

/**
 * One row in a settings-style sidebar nav — a colored `CategoryIcon` tile +
 * label, with a full elevated-surface `active` state (reusing `Button`'s own
 * secondary surface directly, not a hand-copied fill/border/shadow) and an
 * optional trailing notification dot.
 */
export const SettingsNavItem = forwardRef<HTMLButtonElement, SettingsNavItemProps>(function SettingsNavItem(
  { icon, color, label, active, badge, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.item, active && buttonStyles.surface, className)}
      data-variant={active ? 'secondary' : undefined}
      aria-current={active || undefined}
      {...rest}
    >
      <CategoryIcon icon={icon} color={color} size="md" emphasis="strong" />
      <span className={styles.label}>{label}</span>
      {badge && <span className={styles.badge} aria-hidden="true" />}
    </button>
  );
});
