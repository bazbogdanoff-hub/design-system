import type { SVGProps } from 'react';
import { ArrowUpRight } from '@phosphor-icons/react';

/** `NextTask`'s "open" action glyph — real Phosphor `ArrowUpRight`, Bold
 * (confirmed via Figma). */
export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return <ArrowUpRight weight="bold" aria-hidden="true" {...props} />;
}
