import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { CloseIcon } from '../FileDropper/CloseIcon';
import { cn } from '../../lib/cn';
import styles from './Modal.module.css';

export type ModalPadding = 'lg' | 'md' | 'sm' | 'xs';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `lg` (24px, default) · `md` (20px) · `sm` (16px) · `xs` (12px) — its own
   * scale, one notch bigger than `Card`'s at each name (no relation —
   * `Modal` doesn't nest a `Card`, it replicates the same surface fill/radius
   * directly, since the padding numbers don't line up). */
  padding?: ModalPadding;
  heading: ReactNode;
  /** Wired to the header's `IconButton`. Omit to hide the close button. */
  onClose?: () => void;
  children: ReactNode;
  /** Omit entirely to hide the footer row. */
  footer?: ReactNode;
}

/**
 * The modal panel itself — heading + close button, content, an optional
 * footer. Plain and presentational only: no portal, no scrim, no focus trap,
 * no open/close animation — pair this with `Overlay` for all of that
 * (`<Overlay open={...} onClose={...}><Modal ...>...</Modal></Overlay>`).
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { padding = 'lg', heading, onClose, children, footer, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.modal, className)} data-padding={padding} {...rest}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{heading}</h2>
        {onClose != null && (
          <IconButton variant="secondary" size="md" icon={<CloseIcon />} aria-label="Close" onClick={onClose} />
        )}
      </div>
      <div className={styles.content}>{children}</div>
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </div>
  );
});
