import {
  Children,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Card } from '../Card';
import { useRemScale } from '../../lib/rem';
import styles from './Table.module.css';

/** Hard cap for body row / cell height — fill can be smaller, never larger.
 * Authored at the 16px root (4.25rem) and scaled with it. */
const TABLE_ROW_MAX_HEIGHT_PX = 68;

/** Width roles with a set width — never measured, never grown. */
const FIXED_WIDTHS = new Set(['checkbox', 'radio', 'icon', 'action', 'timestamp']);

export interface TableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Left-aligned in the header row. Omit along with `actions` to hide the header entirely. */
  filters?: ReactNode;
  /** Right-aligned in the header row — 0 to N buttons. Just compose them; there's no per-button prop, an empty/omitted slot simply takes no space. */
  actions?: ReactNode;
  /** The header row — a `<TableRow>` of `<TableHeaderCell>`s. */
  header: ReactNode;
  /** Body rows — `<TableRow>`s of `<TableCell>`s. */
  children: ReactNode;
  /** How many rows are currently selected. The footer's left side (and the footer itself, if `pagination` is also absent) only appears once this is truthy. */
  selectedCount?: number;
  /** Shown next to the selection count — e.g. a "Delete" button. Only rendered when `selectedCount` is truthy. */
  selectionActions?: ReactNode;
  /** The `<Pagination>` element, right-aligned in the footer. */
  pagination?: ReactNode;
}

/**
 * Card surface + header (filters/actions) + a real `<table>` + footer
 * (selection/pagination) — the same 3-region shape built in Figma, ported
 * with one structural difference: `hasHeader`/`hasFooter`/`hasFilters`/
 * `hasSelection`/`hasPagination` were real exposed booleans there because
 * Figma has no way to compute "is this content present" — here they're just
 * `filters/actions/selectedCount/pagination` being truthy or not, plain
 * conditional rendering.
 *
 * Wraps the real `Card` (`padding="none"`) rather than replicating its
 * fill/radius/shadow — Figma couldn't nest a live `Card` **instance** without
 * hitting a real Slot-insertion depth limit, but that restriction doesn't
 * exist in React, so this is the one place code and the Figma reference
 * deliberately diverge in how they reach the identical visual result. `Card`
 * itself gained `overflow: hidden` under `padding="none"` for this — the
 * header/rows/footer all sit flush against its rounded corners.
 *
 * Body row height is measured (content area minus thead, divided by row
 * count) and published as `--table-row-height`. CSS tables otherwise refuse
 * to size rows below their cell content, which is why percentage fill alone
 * still scrolled.
 */
export const Table = forwardRef<HTMLDivElement, TableProps>(function Table(
  { filters, actions, header, children, selectedCount, selectionActions, pagination, className, ...rest },
  ref,
) {
  const hasHeader = filters != null || actions != null;
  const hasFooter = Boolean(selectedCount) || pagination != null;
  const bodyRowCount = Math.max(1, Children.toArray(children).length);

  const contentRef = useRef<HTMLDivElement>(null);
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const [rowHeightPx, setRowHeightPx] = useState<number | null>(null);
  const rowMaxPx = TABLE_ROW_MAX_HEIGHT_PX * useRemScale();

  useLayoutEffect(() => {
    const content = contentRef.current;
    const thead = theadRef.current;
    if (!content || !thead) return;

    const update = () => {
      const available = content.clientHeight - thead.offsetHeight;
      const next = Math.min(available / bodyRowCount, rowMaxPx);
      setRowHeightPx(Number.isFinite(next) && next > 0 ? next : null);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(content);
    return () => ro.disconnect();
  }, [bodyRowCount, hasHeader, hasFooter, rowMaxPx]);

  // Columns as wide as their content, pinned columns stuck (2026-10-01).
  // The locked row fill takes cell content out of flow, so a column was
  // sized by its header and anything wider was cut mid-value. Each column's
  // widest content is measured — the extent of what's in it, not the cell,
  // so columns shrink back as well as grow — and set as its header's
  // min-width; past the card's width, `.content` scrolls sideways. Pinned
  // columns (`pin` on the cells) get their sticky offsets here, and the
  // scroll position marks which edges have more beyond them.
  const tableRef = useRef<HTMLTableElement>(null);
  useLayoutEffect(() => {
    const table = tableRef.current;
    const content = contentRef.current;
    if (!table || !content) return;
    const headRow = table.tHead?.rows[0];
    if (!headRow) return;

    const edges = () => {
      const more = content.scrollWidth - content.clientWidth;
      if (content.scrollLeft > 1) content.dataset.scrolledStart = '';
      else delete content.dataset.scrolledStart;
      if (content.scrollLeft < more - 1) content.dataset.moreEnd = '';
      else delete content.dataset.moreEnd;
    };

    const fit = () => {
      const heads = Array.from(headRow.cells);
      const natural = heads.map(() => 0);
      const range = document.createRange();
      for (const body of Array.from(table.tBodies)) {
        for (const row of Array.from(body.rows)) {
          Array.from(row.cells).forEach((cell, i) => {
            const fill = cell.firstElementChild as HTMLElement | null;
            if (!fill || FIXED_WIDTHS.has(cell.dataset.width ?? '')) return;
            range.selectNodeContents(fill);
            const cs = getComputedStyle(fill);
            const w = range.getBoundingClientRect().width + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
            natural[i] = Math.max(natural[i] ?? 0, w);
          });
        }
      }
      heads.forEach((th, i) => {
        if (FIXED_WIDTHS.has(th.dataset.width ?? '')) return;
        // The role's own minimum (wide 12rem, value 7rem), read once.
        if (th.dataset.roleMin == null) th.dataset.roleMin = String(parseFloat(getComputedStyle(th).minWidth) || 0);
        const min = Math.max(Number(th.dataset.roleMin), Math.ceil(natural[i] ?? 0));
        th.style.minWidth = min > 0 ? `${min}px` : '';
      });

      // Sticky offsets: each pinned column sits after the pinned ones
      // before it (start) or after it (end); the innermost carries the edge.
      const pins = heads.map((th) => th.dataset.pin as 'start' | 'end' | undefined);
      const offsets = heads.map(() => 0);
      let acc = 0;
      pins.forEach((p, i) => {
        if (p === 'start') {
          offsets[i] = acc;
          acc += heads[i]!.offsetWidth;
        }
      });
      acc = 0;
      for (let i = pins.length - 1; i >= 0; i--) {
        if (pins[i] === 'end') {
          offsets[i] = acc;
          acc += heads[i]!.offsetWidth;
        }
      }
      const lastStart = pins.lastIndexOf('start');
      const firstEnd = pins.indexOf('end');
      for (const row of Array.from(table.rows)) {
        Array.from(row.cells).forEach((cell, i) => {
          if (!pins[i]) return;
          cell.style.setProperty('--pin-offset', `${offsets[i]}px`);
          if (i === lastStart) cell.dataset.pinEdge = 'start';
          else if (i === firstEnd) cell.dataset.pinEdge = 'end';
          else delete cell.dataset.pinEdge;
        });
      }
      edges();
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(content);
    content.addEventListener('scroll', edges, { passive: true });
    return () => {
      ro.disconnect();
      content.removeEventListener('scroll', edges);
    };
  });

  return (
    <Card ref={ref} padding="none" className={cn(styles.table, className)} {...rest}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.filters}>{filters}</div>
          <div className={styles.actions}>{actions}</div>
        </div>
      )}
      <div className={styles.content} ref={contentRef}>
        <table
          ref={tableRef}
          className={styles.grid}
          data-row-fill=""
          style={
            {
              '--table-body-rows': bodyRowCount,
              '--table-row-height': `${rowHeightPx ?? rowMaxPx}px`,
            } as CSSProperties
          }
        >
          <thead ref={theadRef}>{header}</thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {hasFooter && (
        <div className={styles.footer}>
          <div className={styles.selection}>
            {Boolean(selectedCount) && (
              <>
                <span className={styles.selectionCount}>{selectedCount} selected</span>
                {selectionActions}
              </>
            )}
          </div>
          <div className={styles.pagination}>{pagination}</div>
        </div>
      )}
    </Card>
  );
});
