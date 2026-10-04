import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconButton } from '../IconButton';
import { CloseIcon } from '../FileDropper/CloseIcon';
import { cn } from '../../lib/cn';
import styles from './Modal.module.css';

export type ModalPadding = 'xl' | 'lg' | 'md' | 'sm';
export type ModalWidth = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `xl` (24px, default) · `lg` (20px) · `md` (16px) · `sm` (12px) - the
   * same names and sizes as `Card`'s (owner, 2026-10-04; Modal's names used
   * to sit one notch bigger, so `sm` meant 16 here and 12 on a Card). */
  padding?: ModalPadding;
  heading: ReactNode;
  /** Wired to the header's `IconButton`. Omit to hide the close button. */
  onClose?: () => void;
  children: ReactNode;
  /** Omit entirely to hide the footer row. */
  footer?: ReactNode;
  /** `sm` 24rem · `md` 30rem · `lg` 36rem - never wider than the screen
   * less a margin. Omit to size to the content (owner, 2026-10-03: a
   * one-field dialog sized to its content was unusably narrow). */
  width?: ModalWidth;
}

/**
 * The modal panel itself - heading + close button, content, an optional
 * footer. Plain and presentational only: no portal, no scrim, no focus trap,
 * no open/close animation - pair this with `Overlay` for all of that
 * (`<Overlay open={...} onClose={...}><Modal ...>...</Modal></Overlay>`).
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { padding = 'xl', heading, onClose, children, footer, width, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={cn(styles.modal, className)} data-padding={padding} data-width={width} {...rest}>
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
