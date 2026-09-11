import type { SVGProps } from 'react';

/** `FilterIcon`'s rest glyph — matches Figma's `Filter — icon`, which shows the
 * funnel in `default`/`disabled` and swaps to `PlusIcon` on `hover`/`active`.
 * Not consumer-configurable. */
export function FunnelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M230 56.7A8 8 0 00224 48H32a8 8 0 00-6 13.3l73.6 82.7v56.2a8 8 0 003.6 6.7l32 21.3a8 8 0 0012.4-6.7v-77.5L228 61.3a8 8 0 002-4.6z" />
    </svg>
  );
}
