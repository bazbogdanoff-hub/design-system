import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Headercard.module.css';

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  heading: ReactNode;
  /** Right-side slot — whatever mix of a "Back" `Button`, a
   * `SegmentedControl`, a settings `IconButton`, etc. is relevant for the
   * page. Freeform; Headercard doesn't construct this itself. */
  actions?: ReactNode;
};

/**
 * Under the heading goes **either** a stat `labelGroup` **or** `controls` —
 * never both, which the type enforces.
 */
export type HeadercardProps = Base &
  (
    | {
        /** Usually a `<LabelGroup>` of stat `Label`s (e.g. "86 total | 75
         * active | 11 inactive"). Omit entirely to show heading-only —
         * mirrors the Figma reference's own `hasLabelGroup` boolean. Sits
         * `space/2` under the heading, as in the Figma reference. */
        labelGroup?: ReactNode;
        controls?: never;
      }
    | {
        labelGroup?: never;
        /** Controls under the heading in place of a label group — e.g. a
         * severity `Badge` beside an `IconButton`. These are ~32px tall, so
         * they sit `space/10` under the heading rather than the label
         * group's `space/2`, and `actions` align to the top of the card
         * instead of its middle, level with the heading. */
        controls: ReactNode;
      }
  );

/**
 * The page-header card most pages use — a `Card`-replica surface (same
 * fill/radius as `Table`'s own root) holding a fixed left side (heading +
 * an optional stat `LabelGroup` **or** a row of `controls`) and a free
 * right-side slot for page actions.
 */
export const Headercard = forwardRef<HTMLDivElement, HeadercardProps>(function Headercard(
  { heading, labelGroup, controls, actions, className, ...rest },
  ref,
) {
  const hasControls = controls != null;
  return (
    <div ref={ref} className={cn(styles.card, className)} data-has-controls={hasControls || undefined} {...rest}>
      <div className={styles.left}>
        <h1 className={styles.heading}>{heading}</h1>
        {hasControls ? <div className={styles.controls}>{controls}</div> : labelGroup}
      </div>
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
});
