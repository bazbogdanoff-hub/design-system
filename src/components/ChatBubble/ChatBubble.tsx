import { forwardRef, useLayoutEffect, type HTMLAttributes, type ReactNode } from 'react';
import { FilePdf, FileText } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { ChannelLogo, type ChannelLogoChannel } from '../ChannelLogo';
import { IconCell } from '../IconCell';
import { ensureBubbleFilters } from './filters';
import styles from './ChatBubble.module.css';

export type ChatBubbleSide = 'in' | 'out';
export type ChatBubbleSurface = 'light' | 'dark';
export type ChatBubbleSize = 'sm' | 'lg';

export interface ChatBubblePhoto {
  /** Absent while a signed URL loads - the picture keeps its space. */
  src?: string;
  alt: string;
  /** Pixels; the bubble reserves this shape before the picture arrives. */
  width?: number;
  height?: number;
  /** Opens it full screen (MediaViewer). */
  onOpen?: () => void;
}

export interface ChatBubbleFile {
  name: string;
  /** Kind · size, pre-formatted ("PDF · 1 KB"). */
  detail?: ReactNode;
  /** Picks the file tile's glyph. */
  type?: string;
  /** Downloads or opens it. */
  onOpen?: () => void;
}

export interface ChatBubbleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `in` - someone else's, on the left; `out` - yours, on the right. */
  side: ChatBubbleSide;
  /** `light` (default) - on the page: white Tile in, brand glass out.
   * `dark` - inside the dark app-frame card: the sidebar panel in, the
   * sidebar's brand pair out. */
  surface?: ChatBubbleSurface;
  /** Text: `lg` (15, default) for a conversation page, `sm` (13) for a
   * compact one (the Aegis page, the dashboard card). */
  size?: ChatBubbleSize;
  /** The first bubble of a run from one sender: square top corner toward
   * them, and a tail growing out of it. The rest of the run is round. */
  tail?: boolean;
  /** A small line over the text - "Aegis · draft". Not for names in a
   * one-to-one conversation: the header says who. */
  label?: ReactNode;
  /** A picture: fills the bubble bar a 4 frame and sets its width, the
   * caption (children) wrapping to it. */
  photo?: ChatBubblePhoto;
  /** A document: a row that opens it; it sets the width, as a photo does. */
  file?: ChatBubbleFile;
  /** The text - or a photo's / file's caption. Line breaks are kept. */
  children?: ReactNode;
  /** Under the text, right-aligned: the channel's mark, "edited", the time
   * (24-hour, pre-formatted). Omit all three for no line. */
  time?: ReactNode;
  channel?: ChannelLogoChannel;
  edited?: boolean;
  /** Below everything - sources, a Copy button. */
  footer?: ReactNode;
  /** Quieter - the message being edited. */
  dimmed?: boolean;
}

/**
 * One message in a conversation (owner, 2026-10-01; built code-first from
 * the Messages page). Its edge light is an SVG filter on the painted shape,
 * so a tail is lit with the body as one piece - see `filters.ts`, and
 * docs/components/ChatBubble.md for the why. Right-click and other events
 * pass through to the bubble.
 */
export const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(function ChatBubble(
  {
    side,
    surface = 'light',
    size = 'lg',
    tail = false,
    label,
    photo,
    file,
    children,
    time,
    channel,
    edited,
    footer,
    dimmed,
    className,
    ...rest
  },
  ref,
) {
  useLayoutEffect(ensureBubbleFilters, []);

  const w = photo?.width ?? 4;
  const h = photo?.height ?? 3;
  const hasMeta = time != null || channel != null || edited;
  const hasText = children != null && children !== '' && children !== false;

  return (
    <div
      ref={ref}
      className={cn(styles.bubble, className)}
      data-side={side}
      data-on={surface}
      data-size={size}
      data-tail={tail || undefined}
      data-media={photo ? '' : undefined}
      data-attached={photo || file ? '' : undefined}
      data-dimmed={dimmed || undefined}
      {...rest}
    >
      {label != null && <span className={styles.label}>{label}</span>}
      {photo && (
        <button
          type="button"
          className={styles.photo}
          // A definite width (20rem on the long side): a percentage can't
          // size a shrink-to-fit bubble. max-width keeps it inside.
          style={{ aspectRatio: `${w} / ${h}`, width: `${(20 * w) / Math.max(w, h)}rem` }}
          onClick={photo.onOpen}
          aria-label={`Open ${photo.alt}`}
        >
          {photo.src && <img src={photo.src} alt={photo.alt} width={w} height={h} />}
        </button>
      )}
      {file && (
        <button type="button" className={styles.file} onClick={file.onOpen} title={file.name}>
          <IconCell
            size="lg"
            icon={file.type === 'application/pdf' ? <FilePdf weight="fill" /> : <FileText weight="fill" />}
          />
          <span className={styles.fileText}>
            <span className={styles.fileName}>{file.name}</span>
            {file.detail != null && <span className={styles.fileDetail}>{file.detail}</span>}
          </span>
        </button>
      )}
      {hasText && <span className={styles.text}>{children}</span>}
      {hasMeta && (
        <span className={styles.meta}>
          {channel && <ChannelLogo channel={channel} size="xs" tile={false} />}
          {edited && <span>edited</span>}
          {time}
        </span>
      )}
      {footer != null && <div className={styles.footer}>{footer}</div>}
    </div>
  );
});
