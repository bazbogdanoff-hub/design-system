import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import { CaretLeftIcon } from './CaretLeftIcon';
import { CaretRightIcon } from './CaretRightIcon';
import styles from './Pagination.module.css';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 1-indexed current page. */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * "Page X of Y" + a prev/next control — the minimal pagination this system
 * needs so far (no page-number buttons). Boundaries disable themselves
 * (`page <= 1` / `page >= totalPages`) rather than requiring the caller to
 * compute that — same "the component knows its own edge cases" reasoning
 * `Slider`'s min/max clamping uses.
 */
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(function Pagination(
  { page, totalPages, onPageChange, className, ...rest },
  ref,
) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);

  return (
    <div ref={ref} className={cn(styles.pagination, className)} {...rest}>
      <span className={styles.label}>
        Page {safePage} of {safeTotal}
      </span>
      <span className={styles.buttons}>
        <IconButton
          variant="secondary"
          size="md"
          icon={<CaretLeftIcon />}
          aria-label="Previous page"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        />
        <IconButton
          variant="secondary"
          size="md"
          icon={<CaretRightIcon />}
          aria-label="Next page"
          disabled={safePage >= safeTotal}
          onClick={() => onPageChange(safePage + 1)}
        />
      </span>
    </div>
  );
});
