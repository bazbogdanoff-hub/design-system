import { useEffect, type ReactNode } from 'react';
import { CaretLeft, CaretRight, DownloadSimple, X } from '@phosphor-icons/react';
import { Card } from '../Card';
import { IconButton } from '../IconButton';
import { Overlay } from '../Overlay';
import styles from './MediaViewer.module.css';

export interface MediaViewerItem {
  /** Absent while it loads. */
  src?: string;
  name: string;
  /** Under the name — when it was sent, pre-formatted. */
  detail?: ReactNode;
}

export interface MediaViewerProps {
  items: MediaViewerItem[];
  /** The one showing; `null` is closed. */
  index: number | null;
  onIndex: (index: number) => void;
  onClose: () => void;
  /** Shows a download button when given. */
  onDownload?: (item: MediaViewerItem, index: number) => void;
}

/**
 * Full-screen pictures (owner, 2026-10-01; built code-first from the Messages
 * page): the picture as large as the screen allows, never cropped, on
 * Overlay's strong scrim; its name, detail and position on a Card bar with
 * download and close; ← → through `items`. Escape or a click on the dark
 * closes it.
 */
export function MediaViewer({ items, index, onIndex, onClose, onDownload }: MediaViewerProps) {
  const current = index != null ? items[index] : undefined;
  const hasPrev = index != null && index > 0;
  const hasNext = index != null && index < items.length - 1;

  useEffect(() => {
    if (index == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && index > 0) onIndex(index - 1);
      if (e.key === 'ArrowRight' && index < items.length - 1) onIndex(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onIndex]);

  return (
    <Overlay open={current != null} onClose={onClose} scrim="strong">
      {current && (
        <div className={styles.viewer} role="dialog" aria-modal="true" aria-label={`Picture: ${current.name}`}>
          <Card padding="xs" className={styles.bar}>
            <span className={styles.title}>
              <span className={styles.name}>{current.name}</span>
              <span className={styles.detail}>
                {current.detail}
                {items.length > 1 && `${current.detail != null ? ' · ' : ''}${index! + 1} of ${items.length}`}
              </span>
            </span>
            {onDownload && (
              <IconButton
                variant="secondary"
                size="lg"
                aria-label="Download"
                icon={<DownloadSimple weight="bold" aria-hidden="true" />}
                onClick={() => onDownload(current, index!)}
              />
            )}
            <IconButton
              variant="secondary"
              size="lg"
              aria-label="Close"
              icon={<X weight="bold" aria-hidden="true" />}
              onClick={onClose}
            />
          </Card>
          <div className={styles.stage}>
            <IconButton
              variant="secondary"
              size="lg"
              aria-label="Previous picture"
              disabled={!hasPrev}
              icon={<CaretLeft weight="bold" aria-hidden="true" />}
              onClick={() => hasPrev && onIndex(index! - 1)}
            />
            {current.src && <img className={styles.image} src={current.src} alt={current.name} />}
            <IconButton
              variant="secondary"
              size="lg"
              aria-label="Next picture"
              disabled={!hasNext}
              icon={<CaretRight weight="bold" aria-hidden="true" />}
              onClick={() => hasNext && onIndex(index! + 1)}
            />
          </div>
        </div>
      )}
    </Overlay>
  );
}
