import { forwardRef, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { FilePdf, FileText, Paperclip, PaperPlaneRight, PencilSimple, X } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { HelperText } from '../HelperText';
import { IconButton } from '../IconButton';
import { IconCell } from '../IconCell';
import { Textarea } from '../Textarea';
import styles from './ChatComposer.module.css';

export interface ChatComposerFile {
  id: string;
  name: string;
  type: string;
  /** Pre-formatted ("1.2 MB"). */
  size?: string;
  /** An object URL — pictures show as a thumbnail. */
  preview?: string;
}

export interface ChatComposerProps {
  value: string;
  onChange: (value: string) => void;
  /** Enter, or the send button. */
  onSubmit: () => void;
  placeholder?: string;
  /** `light` (default) in a card on the page; `dark` in the dark app-frame
   * card — the field takes the sidebar's active-tab recipe. */
  surface?: 'light' | 'dark';
  /** Whether Send can fire — default: there's text. */
  canSubmit?: boolean;
  /** Sending or saving: everything waits. */
  busy?: boolean;
  /** The button's name and glyph — "Save" with a check while editing. */
  submitLabel?: string;
  submitIcon?: ReactNode;
  /** Shows the paperclip before the field; picked files come here. */
  onFiles?: (files: File[]) => void;
  /** For the file picker. */
  accept?: string;
  /** Files waiting for Send, in a tray above the field. */
  files?: ChatComposerFile[];
  onRemoveFile?: (id: string) => void;
  /** Editing a sent message: a bar above the field shows what; Esc or ×
   * calls onCancel. */
  editing?: { original: ReactNode; onCancel: () => void };
  /** A line above the field — a file that can't be sent. */
  error?: ReactNode;
  maxLength?: number;
  /** Lines before the field scrolls. Default 8. */
  maxRows?: number;
  'aria-label'?: string;
  className?: string;
}

/**
 * Where a message is written (owner, 2026-10-01; built code-first from the
 * Messages page): the paperclip, then the field — Textarea's message mode,
 * one line tall, growing to `maxRows` with send kept on its last line —
 * and above it, when there are any, the files waiting and the editing bar.
 * Enter sends, Shift+Enter breaks a line, Esc leaves an edit; an IME's
 * Enter picks its word. Fully controlled: the screen owns the text, the
 * files and the sending. The ref is the textarea, for focus.
 */
export const ChatComposer = forwardRef<HTMLTextAreaElement, ChatComposerProps>(function ChatComposer(
  {
    value,
    onChange,
    onSubmit,
    placeholder,
    surface = 'light',
    canSubmit,
    busy,
    submitLabel = 'Send',
    submitIcon,
    onFiles,
    accept,
    files = [],
    onRemoveFile,
    editing,
    error,
    maxLength,
    maxRows = 8,
    'aria-label': ariaLabel = 'Message',
    className,
  },
  ref,
) {
  const picker = useRef<HTMLInputElement>(null);
  const ready = (canSubmit ?? value.trim() !== '') && !busy;

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (ready) onSubmit();
    } else if (e.key === 'Escape' && editing) {
      e.preventDefault();
      editing.onCancel();
    }
  };

  return (
    <form
      className={cn(styles.composer, className)}
      data-on={surface}
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onSubmit();
      }}
    >
      {editing && (
        <div className={styles.editBar}>
          <PencilSimple weight="bold" aria-hidden="true" />
          <span className={styles.editText}>
            <span className={styles.editLabel}>Editing</span>
            <span className={styles.editOriginal}>{editing.original}</span>
          </span>
          <IconButton
            variant="tertiary"
            size="xs"
            aria-label="Cancel editing"
            icon={<X weight="bold" aria-hidden="true" />}
            onClick={editing.onCancel}
          />
        </div>
      )}
      {!editing && files.length > 0 && (
        <ul className={styles.tray} aria-label="Files to send">
          {files.map((f) => (
            <li key={f.id} className={f.preview ? styles.thumb : styles.chip}>
              {f.preview ? (
                <img src={f.preview} alt={f.name} />
              ) : (
                <>
                  <IconCell
                    size="md"
                    icon={f.type === 'application/pdf' ? <FilePdf weight="fill" /> : <FileText weight="fill" />}
                  />
                  <span className={styles.chipText}>
                    <span className={styles.chipName}>{f.name}</span>
                    {f.size && <span className={styles.chipSize}>{f.size}</span>}
                  </span>
                </>
              )}
              {onRemoveFile && (
                <IconButton
                  className={styles.remove}
                  variant="tertiary"
                  size="xs"
                  aria-label={`Remove ${f.name}`}
                  icon={<X weight="bold" aria-hidden="true" />}
                  onClick={() => onRemoveFile(f.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      {error != null && <HelperText tone="error">{error}</HelperText>}
      <div className={styles.row}>
        {onFiles && (
          <span className={styles.attach}>
            <IconButton
              variant="secondary"
              size="lg"
              aria-label="Attach files"
              disabled={busy || editing != null}
              icon={<Paperclip weight="bold" aria-hidden="true" />}
              onClick={() => picker.current?.click()}
            />
            <input
              ref={picker}
              type="file"
              multiple
              accept={accept}
              hidden
              onChange={(e) => {
                onFiles(Array.from(e.target.files ?? []));
                e.target.value = '';
              }}
            />
          </span>
        )}
        <Textarea
          ref={ref}
          autoGrow
          maxRows={maxRows}
          wrapperClassName={styles.field}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel}
          maxLength={maxLength}
          trailingAction={
            <IconButton
              type="submit"
              variant="primary"
              size="md"
              aria-label={submitLabel}
              disabled={!ready}
              icon={submitIcon ?? <PaperPlaneRight weight="bold" aria-hidden="true" />}
            />
          }
        />
      </div>
    </form>
  );
});
