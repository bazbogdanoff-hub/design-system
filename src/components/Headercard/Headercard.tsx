import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import styles from './Headercard.module.css';

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  heading: ReactNode;
  /** Beside the heading, and deliberately **outside** the `<h1>` - related
   * entities as `EntityChip`s, a status `Badge`, a count. Anything put in
   * `heading` itself becomes part of the page's accessible name, so a rig
   * titled "RIG-01" with three member chips would announce as
   * "RIG-01 TK-001 TR-004 Wójcik". This slot exists so that does not happen.
   *
   * Laid out as a row with `space/4` between children and `space/8` from the
   * heading - the chip-group spacing from Figma. */
  aside?: ReactNode;
  /** Right-side slot - whatever mix of a "Back" `Button`, a
   * `SegmentedControl`, a settings `IconButton`, etc. is relevant for the
   * page. Freeform; Headercard doesn't construct this itself. */
  actions?: ReactNode;
  /** A ← at the start of the heading's line (owner, 2026-10-06: the phone
   * back button). The heading starts after it and ellipsises before the
   * actions; the stat line or controls keep the full width under both, so
   * nothing below moves. Pass it only when there is somewhere to go back to. */
  onBack?: () => void;
};

/**
 * Under the heading goes **either** a stat `labelGroup` **or** `controls` -
 * never both, which the type enforces.
 */
export type HeadercardProps = Base &
  (
    | {
        /** Usually a `<LabelGroup>` of stat `Label`s (e.g. "86 total | 75
         * active | 11 inactive"). Omit entirely to show heading-only -
         * mirrors the Figma reference's own `hasLabelGroup` boolean. Sits
         * `space/2` under the heading, as in the Figma reference. */
        labelGroup?: ReactNode;
        controls?: never;
      }
    | {
        labelGroup?: never;
        /** Controls under the heading in place of a label group - e.g. a
         * severity `Badge` beside an `IconButton`. These are ~32px tall, so
         * they sit `space/10` under the heading rather than the label
         * group's `space/2`, and `actions` align to the top of the card
         * instead of its middle, level with the heading. */
        controls: ReactNode;
      }
  );

/**
 * The page-header card most pages use - a `Card`-replica surface (same
 * fill/radius as `Table`'s own root) holding a fixed left side (heading +
 * an optional `aside` beside it, and an optional stat `LabelGroup` **or** a
 * row of `controls`) and a free
 * right-side slot for page actions.
 */
export const Headercard = forwardRef<HTMLDivElement, HeadercardProps>(function Headercard(
  { heading, aside, labelGroup, controls, actions, onBack, className, ...rest },
  ref,
) {
  const hasControls = controls != null;
  return (
    <div ref={ref} className={cn(styles.card, className)} data-has-controls={hasControls || undefined} data-back={onBack != null || undefined} data-surface="" {...rest}>
      {onBack != null && (
        <div className={styles.back}>
          <IconButton
            variant="secondary"
            size="md"
            aria-label="Back"
            icon={<ArrowLeft weight="bold" aria-hidden="true" />}
            onClick={onBack}
          />
        </div>
      )}
      <div className={styles.left}>
        {aside != null ? (
          <div className={styles.headingRow}>
            <h1 className={styles.heading}>{heading}</h1>
            <div className={styles.aside}>{aside}</div>
          </div>
        ) : (
          <h1 className={styles.heading}>{heading}</h1>
        )}
        {hasControls ? <div className={styles.controls}>{controls}</div> : labelGroup}
      </div>
      {actions != null && <div className={styles.actions}>{actions}</div>}
    </div>
  );
});
