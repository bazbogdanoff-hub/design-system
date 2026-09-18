import type { SVGProps } from 'react';
import { Minus } from '@phosphor-icons/react';

/** `Checkbox`'s indeterminate glyph — real Phosphor `Minus`, Bold. Same
 * caveat as `CheckIcon`: Figma's own master uses a legacy hand-drawn
 * vector, not a real Phosphor instance, to verify against. */
export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return <Minus weight="bold" aria-hidden="true" {...props} />;
}
