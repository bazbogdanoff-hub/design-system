import type { SVGProps } from 'react';

/** `FileDropper`'s `idle` glyph — an upward arrow into a tray. Fixed, not
 * consumer-configurable. */
export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M128 28a12 12 0 0 1 8.49 3.51l48 48a12 12 0 0 1-16.98 16.98L140 68.97V156a12 12 0 0 1-24 0V68.97l-27.51 27.52a12 12 0 0 1-16.98-16.98l48-48A12 12 0 0 1 128 28Z" />
      <path d="M48 156a12 12 0 0 1 12 12v28a12 12 0 0 0 12 12h112a12 12 0 0 0 12-12v-28a12 12 0 0 1 24 0v28a36 36 0 0 1-36 36H72a36 36 0 0 1-36-36v-28a12 12 0 0 1 12-12Z" />
    </svg>
  );
}
