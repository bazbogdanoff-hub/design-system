import type { SVGProps } from 'react';
import { CaretRight } from '@phosphor-icons/react';

/** `Pagination`'s next-page glyph — real Phosphor `CaretRight`, Bold
 * (confirmed via Figma). */
export function CaretRightIcon(props: SVGProps<SVGSVGElement>) {
  return <CaretRight weight="bold" aria-hidden="true" {...props} />;
}
