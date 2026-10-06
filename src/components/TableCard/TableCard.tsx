import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Tile } from '../Tile';
import styles from './TableCard.module.css';

export interface TableCardField {
  /** The column's header. */
  label: ReactNode;
  /** The cell's content, as the table draws it. */
  value: ReactNode;
}

export interface TableCardFact {
  /** A 14 Phosphor glyph (1em of label/md, as Button and Badge), `weight="bold"`, standing in for the label. */
  icon: ReactNode;
  value: ReactNode;
  /** What the fact is ("ETA"), for screen readers: the icon carries it on
   * screen. */
  label: string;
  /** `danger` - late, overdue, expiring: the value turns red. */
  tone?: 'danger';
}

export interface TableCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The row's identity - the table's primary cell, or what the row is
   * about when its code moves to `eyebrow`. */
  title: ReactNode;
  /** Small, above the title: the row's code ("SH-1046") or date. */
  eyebrow?: ReactNode;
  /** One line of context under the title. */
  subtitle?: ReactNode;
  /** Top right: the row's one state, a `Badge`. */
  badge?: ReactNode;
  /** Icon + value lines under the title, no labels. */
  facts?: TableCardFact[];
  /** Bottom right: the row's key figure - money, a score, stock on hand. */
  figure?: ReactNode;
  /** Before the eyebrow or title - a selection `Checkbox`. */
  leading?: ReactNode;
  /** Top right, after the badge - the row's actions. */
  trailing?: ReactNode;
  /** The older anatomy: other cells as label over value, two to a line.
   * For a table that has no `facts` mapping yet. */
  fields?: TableCardField[];
  /** A real fact about the row, as `TableRow`'s `status`. */
  status?: 'danger' | 'success';
  selected?: boolean;
  /** The whole card opens the row. */
  interactive?: boolean;
}

/**
 * One table row on the phone tier (owner, 2026-10-05; scannable anatomy
 * 2026-10-06), inside `Table cards`:
 *
 *   eyebrow (code)                   [badge] [⋮]
 *   title, two lines at most
 *   subtitle, one line
 *   (icon) fact   (icon) fact             figure
 *
 * Every card in a table puts the same kind of thing in the same place, so
 * the eye runs down the badges or the figures instead of reading each card.
 * A `Tile`, so it sits on the table's card like the task tiles.
 */
export const TableCard = forwardRef<HTMLElement, TableCardProps>(function TableCard(
  {
    title,
    eyebrow,
    subtitle,
    badge,
    facts = [],
    figure,
    leading,
    trailing,
    fields = [],
    status,
    selected = false,
    interactive = false,
    className,
    ...rest
  },
  ref,
) {
  const head = (
    <div className={styles.head}>
      <div className={styles.title}>{title}</div>
      {subtitle != null && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
  return (
    <Tile
      as="article"
      ref={ref}
      interactive={interactive}
      padding="md"
      className={cn(styles.card, className)}
      data-status={status}
      data-selected={selected || undefined}
      {...rest}
    >
      <div className={styles.top} data-eyebrow={eyebrow != null || undefined}>
        {leading != null && <div className={styles.leading}>{leading}</div>}
        {eyebrow != null ? <div className={styles.eyebrow}>{eyebrow}</div> : head}
        {badge != null && <div className={styles.badge}>{badge}</div>}
        {trailing != null && <div className={styles.trailing}>{trailing}</div>}
      </div>
      {eyebrow != null && head}
      {(facts.length > 0 || figure != null) && (
        <div className={styles.bottom}>
          <ul className={styles.facts}>
            {facts.map((fact, i) => (
              <li key={i} className={styles.fact} data-tone={fact.tone}>
                <span className={styles.factIcon} aria-hidden="true">
                  {fact.icon}
                </span>
                <span className={styles.srOnly}>{fact.label}: </span>
                <span className={styles.factValue}>{fact.value}</span>
              </li>
            ))}
          </ul>
          {figure != null && <div className={styles.figure}>{figure}</div>}
        </div>
      )}
      {fields.length > 0 && (
        <dl className={styles.fields}>
          {fields.map((field, i) => (
            <div key={i} className={styles.field}>
              <dt className={styles.label}>{field.label}</dt>
              <dd className={styles.value}>{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </Tile>
  );
});
