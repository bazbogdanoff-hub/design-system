import type { SVGProps } from 'react';
import { CaretUpDown } from '@phosphor-icons/react';

/** `TableHeaderCell`'s sortable-column glyph — real Phosphor `CaretUpDown`,
 * Bold (confirmed via Figma's `content=label` variant). */
export function CaretUpDownIcon(props: SVGProps<SVGSVGElement>) {
  return <CaretUpDown weight="bold" aria-hidden="true" {...props} />;
}
