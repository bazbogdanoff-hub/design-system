import type { SVGProps } from 'react';
import { Check } from '@phosphor-icons/react';

/** `Checkbox`'s checked glyph — real Phosphor `Check`, Bold. No exact match
 * exists in Figma to verify against: the live master's own glyph is a
 * legacy hand-drawn vector (`_FormControlCheck`), not a real Phosphor
 * instance — using the genuine icon here regardless, per the system-wide
 * move off hand-drawn approximations. */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return <Check weight="bold" aria-hidden="true" {...props} />;
}
