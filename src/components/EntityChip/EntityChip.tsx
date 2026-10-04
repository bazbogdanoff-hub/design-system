import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '../../lib/cn';
import styles from './EntityChip.module.css';

export interface EntityChipProps
  extends Omit<ButtonHTMLAttributes<HTMLElement>, 'children'> {
  /** The glyph that stands for the thing - a truck, a trailer, a person. */
  icon: ReactNode;
  /**
   * Which one it is: a fleet code, a surname. Hidden at rest and revealed on
   * hover or focus, but always present for assistive technology - this is the
   * chip's accessible name, not decoration.
   */
  label: string;
  /** Keeps the label open regardless of hover - for a chip that is the subject
   * of the view rather than one of a row. */
  open?: boolean;
  /** Render as the child element, e.g. an `<a>` for a real link. */
  asChild?: boolean;
}

/**
 * One related entity, compressed to a chip: its icon at rest, its identity on
 * hover. Built for a heading row - a rig's truck, trailer and driver beside
 * its name - where three full labels would out-weigh the heading they belong
 * to but three anonymous icons would say nothing.
 *
 * **Not a `Badge`, though it wears Badge's glass.** Two of Badge's rules are
 * deliberately broken here: Badge is presentational with no interaction
 * states, and Badge capsules its left corners (32px) whenever it carries an
 * icon. This is interactive by definition - the label only exists on hover -
 * and keeps a uniform 6px radius, because an icon-only chip with one round
 * end reads as a fragment of a pill rather than a square.
 *
 * Renders a `<button>` when given `onClick`, a `<span>` otherwise, and
 * whatever you pass under `asChild`. See docs/components/EntityChip.md.
 */
export const EntityChip = forwardRef<HTMLElement, EntityChipProps>(
  function EntityChip(
    { icon, label, open = false, asChild = false, className, onClick, ...rest },
    ref,
  ) {
    const interactive = asChild || onClick != null;
    const Comp = asChild ? Slot : interactive ? 'button' : 'span';

    return (
      <Comp
        // The union of span/button refs is wider than either; the cast keeps
        // the public type honest without three overloads.
        ref={ref as never}
        className={cn(styles.chip, className)}
        data-interactive={interactive || undefined}
        data-open={open || undefined}
        onClick={onClick}
        {...(Comp === 'button' ? { type: 'button' as const } : null)}
        {...rest}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
        {/* Two spans: the outer is the collapsing grid column, the inner is
            what gets clipped. One element can't do both. */}
        <span className={styles.label}>
          <span>{label}</span>
        </span>
      </Comp>
    );
  },
);
