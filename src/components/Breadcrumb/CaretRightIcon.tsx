import type { SVGProps } from 'react';
import { CaretRight } from '@phosphor-icons/react';

/** `Breadcrumb`'s separator glyph — the real Phosphor `CaretRight`, Bold
 * weight (confirmed via Figma — every caret/icon in this system uses Bold). */
export function CaretRightIcon(props: SVGProps<SVGSVGElement>) {
  return <CaretRight weight="bold" aria-hidden="true" {...props} />;
}
