import type { SVGProps } from 'react';

/** `Checkbox`'s checked-state glyph — a plain checkmark, drawn by hand (the
 * Figma reference nests a shared `_FormControlCheck` icon instance instead;
 * a hand-drawn stand-in is the pattern this system already uses for
 * icons it can't literally import from Figma's own icon set, see
 * `FileDropper.md`). */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  );
}
