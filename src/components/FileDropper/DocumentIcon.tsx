import type { SVGProps } from 'react';

/** `FileDropper`'s neutral file glyph — a page with 3 punched-out text
 * lines (`fill-rule: evenodd`, same technique as `CheckCircleIcon`). Shown
 * while `uploading`; swapped for a status glyph on `success`/`error`. Fixed,
 * not consumer-configurable. */
export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M56 24a16 16 0 0 0-16 16v176a16 16 0 0 0 16 16h144a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16H56Zm24 68a8 8 0 0 1 8-8h80a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8Zm8 40a8 8 0 0 1 0-16h80a8 8 0 0 1 0 16H88Zm-8 32a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8Z"
      />
    </svg>
  );
}
