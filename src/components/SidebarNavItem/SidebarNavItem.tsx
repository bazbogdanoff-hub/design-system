import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './SidebarNavItem.module.css';

export type SidebarNavItemTone = 'brand' | 'success' | 'danger';

export interface SidebarNavItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'color'> {
  /** A bare monochrome icon. Mutually exclusive with `avatar` — pass
   * whichever the row actually needs, never both. */
  icon?: ReactNode;
  /** An `<Avatar>` instance for a Profile-style row. Kept as its own slot
   * rather than swapped into the `icon` slot: Avatar has its own natural
   * size and internal layout that doesn't scale like a plain icon does —
   * the same "two anatomies, two slots" split `CategoryIcon`/`IconCell`
   * already document. */
  avatar?: ReactNode;
  /** Omit for the collapsed sidebar's icon-only row. */
  label?: ReactNode;
  /** Is this the current page within the active module — shows a neutral
   * glass highlight (matching the module switcher's own unselected-segment
   * look) and recolors the icon/label to the active module's `tone`. */
  active?: boolean;
  /** `brand` (default, Operations) · `success` (Assets) · `danger` (Alerts)
   * — matches whichever module this row belongs to. Ignored when `active`
   * is false; an inactive row is always the same quiet neutral regardless
   * of tone, only the active one carries the module's color. */
  tone?: SidebarNavItemTone;
  /** Settings-row-only: deepen the frame's bottom-right radius to 16px so it
   * nests inside SidebarSection's 24px deep corner. Do not use elsewhere. */
  settingsCorner?: boolean;
}

/**
 * One row in the sidebar's nav list — a bare monochrome icon (no colored
 * tile), the module-toned label, with a neutral glass highlight on the
 * active row. A deliberate sibling to `SettingsNavItem`, not a variant of
 * it: that component's whole anatomy is a colored `CategoryIcon` tile, and
 * this one has no tile at all — same split reasoning `CategoryIcon`/
 * `IconCell` already document.
 */
export const SidebarNavItem = forwardRef<HTMLButtonElement, SidebarNavItemProps>(function SidebarNavItem(
  { icon, avatar, label, active, tone = 'brand', settingsCorner, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(styles.item, className)}
      data-active={active || undefined}
      data-tone={active ? tone : undefined}
      data-settings-corner={settingsCorner || undefined}
      aria-current={active || undefined}
      {...rest}
    >
      {/* Highlight/hover live on `.frame` (40px fill), not the padded outer
          hit target — so 4px vertical padding sits outside the active chrome. */}
      <span className={styles.frame}>
        <span className={styles.leading} aria-hidden="true">
          {avatar ?? (icon != null && <span className={styles.icon}>{icon}</span>)}
        </span>
        {label != null && <span className={styles.label}>{label}</span>}
      </span>
    </button>
  );
});
