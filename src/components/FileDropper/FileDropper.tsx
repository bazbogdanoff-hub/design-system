import {
  forwardRef,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type LabelHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import { ProgressBar } from '../ProgressBar';
import { HelperText } from '../HelperText';
import { CheckCircleIcon } from '../EmptyState/CheckCircleIcon';
import { WarningIcon } from '../HelperText/WarningIcon';
import { UploadIcon } from './UploadIcon';
import { DocumentIcon } from './DocumentIcon';
import { CloseIcon } from './CloseIcon';
import { RetryIcon } from './RetryIcon';
import styles from './FileDropper.module.css';

export type FileDropperStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileDropperFile {
  /** The file's display name — shown once `status` leaves `idle`. */
  name: string;
  /** A pre-formatted size string (e.g. `"2.4 MB"`) — shown on `success`. Not computed from a `File` object; pass what you want displayed. */
  size?: string;
}

export interface FileDropperProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'onDrop'> {
  /** `idle` (default) · `uploading` · `success` · `error`. */
  status?: FileDropperStatus;
  /** The idle-state title (e.g. "Upload renewed document"). */
  heading: ReactNode;
  /** The idle-state subtext. Defaults to the standard "click or drag" instruction. */
  description?: ReactNode;
  /** The current/last-picked file — required once `status` leaves `idle`. */
  file?: FileDropperFile;
  /** `0`–`100`. Only read while `status="uploading"`. */
  progress?: number;
  /** Shown as a `HelperText` under the filename while `status="error"`. */
  errorMessage?: ReactNode;
  /** Forwarded to the native file input. */
  accept?: string;
  /** Forwarded to the native file input. */
  multiple?: boolean;
  /** Disables the dropzone and the native input — no click, drag, or actions. */
  disabled?: boolean;
  /** Fires with the picked/dropped `FileList` — from a click, or a drop, in any status (dropping again replaces the current file). */
  onFilesSelected: (files: FileList) => void;
  /** Trailing action while `status="uploading"`. Omit to hide the action. */
  onCancel?: () => void;
  /** Trailing action while `status="success"`. Omit to hide the action. */
  onRemove?: () => void;
  /** Trailing action while `status="error"`. Omit to hide the action. */
  onRetry?: () => void;
}

/**
 * A drag-and-drop file upload zone. `idle` is a big centered "click or drag"
 * placeholder; `uploading`/`success`/`error` switch to a compact file row
 * (icon + name + status) once a file is picked. The whole box is a real
 * `<label>` around a visually-hidden `<input type="file">`, so click-to-browse
 * and the native file picker's own a11y come for free — drag-and-drop is
 * layered on top via manual handlers.
 *
 * State is fully controlled: picking/dropping a file only calls
 * `onFilesSelected` (or the matching action), it never updates `status`
 * itself. The caller owns the upload (progress, success, failure) and drives
 * `status`/`file`/`progress`/`errorMessage` accordingly — same "presentational,
 * not stateful" split `ProgressBar` uses for `value`.
 *
 * Only the border communicates state color (default/danger) — the leading
 * icon otherwise stays neutral (`DocumentIcon`) and only swaps to a colored
 * status glyph on `success`/`error` — same restraint `Input` uses (icon/affix
 * never react to state, only the border does).
 */
export const FileDropper = forwardRef<HTMLLabelElement, FileDropperProps>(function FileDropper(
  {
    status = 'idle',
    heading,
    description = 'Click to upload, or drag a file here',
    file,
    progress = 0,
    errorMessage,
    accept,
    multiple,
    disabled,
    onFilesSelected,
    onCancel,
    onRemove,
    onRetry,
    className,
    ...rest
  },
  ref,
) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragCounter.current += 1;
    setIsDragOver(true);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    if (disabled) return;
    if (event.dataTransfer.files.length > 0) onFilesSelected(event.dataTransfer.files);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) onFilesSelected(event.target.files);
    event.target.value = '';
  };

  const stopAnd = (fn?: () => void) => (event: { preventDefault: () => void; stopPropagation: () => void }) => {
    event.preventDefault();
    event.stopPropagation();
    fn?.();
  };

  const inputLabel = typeof heading === 'string' ? heading : 'Upload file';

  return (
    <label
      ref={ref}
      className={cn(styles.root, className)}
      data-status={status}
      data-drag-over={isDragOver || undefined}
      data-disabled={disabled || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...rest}
    >
      <input
        type="file"
        className={styles.hiddenInput}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={inputLabel}
        onChange={handleInputChange}
      />
      {status === 'idle' ? (
        <div className={styles.idle}>
          <span className={styles.badge} aria-hidden="true">
            <UploadIcon />
          </span>
          <p className={styles.heading}>{heading}</p>
          {description != null && <p className={styles.description}>{description}</p>}
        </div>
      ) : (
        <div className={styles.row}>
          <span className={styles.statusIcon} data-status={status} aria-hidden="true">
            {status === 'success' ? <CheckCircleIcon /> : status === 'error' ? <WarningIcon /> : <DocumentIcon />}
          </span>
          <div className={styles.info}>
            <p className={styles.fileName}>{file?.name}</p>
            {status === 'uploading' && (
              <ProgressBar value={progress} size="sm" aria-label={`Uploading ${file?.name ?? 'file'}`} />
            )}
            {status === 'success' && file?.size != null && <p className={styles.fileMeta}>{file.size}</p>}
            {status === 'error' && errorMessage != null && (
              <HelperText tone="error" size="sm">
                {errorMessage}
              </HelperText>
            )}
          </div>
          {status === 'uploading' && onCancel && (
            <IconButton
              variant="tertiary"
              size="sm"
              icon={<CloseIcon />}
              aria-label="Cancel upload"
              disabled={disabled}
              onClick={stopAnd(onCancel)}
            />
          )}
          {status === 'success' && onRemove && (
            <IconButton
              variant="tertiary"
              size="sm"
              icon={<CloseIcon />}
              aria-label="Remove file"
              disabled={disabled}
              onClick={stopAnd(onRemove)}
            />
          )}
          {status === 'error' && onRetry && (
            <IconButton
              variant="tertiary"
              size="sm"
              icon={<RetryIcon />}
              aria-label="Retry upload"
              disabled={disabled}
              onClick={stopAnd(onRetry)}
            />
          )}
        </div>
      )}
    </label>
  );
});
