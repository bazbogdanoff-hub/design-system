import type { SVGProps } from 'react';
import { CaretLeft } from '@phosphor-icons/react';

/** `Pagination`'s previous-page glyph — real Phosphor `CaretLeft`, Bold
 * (confirmed via Figma). */
export function CaretLeftIcon(props: SVGProps<SVGSVGElement>) {
  return <CaretLeft weight="bold" aria-hidden="true" {...props} />;
}
