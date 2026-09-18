import type { SVGProps } from 'react';
import { ArrowClockwise } from '@phosphor-icons/react';

/** `FileDropper`'s retry-on-error glyph — real Phosphor `ArrowClockwise`,
 * Bold (confirmed via Figma). */
export function RetryIcon(props: SVGProps<SVGSVGElement>) {
  return <ArrowClockwise weight="bold" aria-hidden="true" {...props} />;
}
