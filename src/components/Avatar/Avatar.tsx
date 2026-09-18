import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { PlusIcon } from './PlusIcon';
import { TrashIcon } from './TrashIcon';
import styles from './Avatar.module.css';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline';
export type AvatarAction = 'add' | 'delete';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** `xs` (24px) · `sm` (28px) · `md` (32px, default) · `lg` (40px) · `xl` (44px). */
  size?: AvatarSize;
  /** Bottom-right status dot. Omit for none. */
  status?: AvatarStatus;
  /** Top-right action badge (add/delete), independent of `status` — they
   * coincide in some references but aren't the same concept. Omit for none. */
  action?: AvatarAction;
  /** The initials. No image-upload story exists yet — this is the
   * fallback-state reference, always initials/text, never a photo. */
  children: ReactNode;
}

/**
 * A circular avatar — initials on a neutral fill, an optional status dot
 * (bottom-right) and an optional action badge (top-right, add/delete) each
 * on their own white ring so they read as cutouts over the avatar underneath.
 * Both badges sit flush at the avatar's own corner (not overlapping past its
 * edge) — a deliberate v1 choice, matching the Figma reference exactly.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { size = 'md', status, action, children, className, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cn(styles.avatar, className)} data-size={size} {...rest}>
      <span className={styles.base}>{children}</span>
      {status != null && (
        <span className={styles.statusRing}>
          <span className={styles.statusDot} data-status={status} />
        </span>
      )}
      {action != null && (
        <span className={styles.actionRing}>
          <span className={styles.actionBadge} data-action={action}>
            {action === 'add' ? <PlusIcon className={styles.actionIcon} /> : <TrashIcon className={styles.actionIcon} />}
          </span>
        </span>
      )}
    </span>
  );
});
