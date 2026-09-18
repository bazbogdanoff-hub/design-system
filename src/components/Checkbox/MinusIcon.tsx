import type { SVGProps } from 'react';

/** `Checkbox`'s indeterminate-state glyph — a plain horizontal dash. Mirrors
 * the Figma reference's `_FormControlMinus` shared icon instance as a
 * hand-drawn stand-in, same as `CheckIcon`. */
export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M40 128a8 8 0 0 1 8-8h160a8 8 0 0 1 0 16H48a8 8 0 0 1-8-8Z" />
    </svg>
  );
}
