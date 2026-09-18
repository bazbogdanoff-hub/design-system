import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import styles from './Headercard.module.css';

export interface HeadercardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  heading: ReactNode;
  /** Usually a `<LabelGroup>` of stat `Label`s (e.g. "86 total | 75 active |
   * 11 inactive"). Omit entirely to show heading-only — mirrors the Figma
   * reference's own `hasLabelGroup` boolean (default visible). */
  labelGroup?: ReactNode;
  /** Right-side slot — whatever mix of a "Back" `Button`, a
   * `SegmentedControl`, a settings `IconButton`, etc. is relevant for the
   * page. Freeform; Headercard doesn't construct this itself. */
  actions?: ReactNode;
}

/**
 * The page-header card most pages use — a `Card`-replica surface (same
 * fill/radius as `Table`'s own root) holding a fixed left side
 * (heading + optional stat `LabelGroup`) and a free right-side slot for
 * page actions.
 */
export const Headercard = forwardRef<HTMLDivElement, HeadercardProps>(function Headercard(
  { heading, labelGroup, actions, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.card, className)} {...rest}>
      <div className={styles.left}>
        <h1 className={styles.heading}>{heading}</h1>
        {labelGroup}
      </div>
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
});
