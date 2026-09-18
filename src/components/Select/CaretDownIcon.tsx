import type { SVGProps } from 'react';
import { CaretDown } from '@phosphor-icons/react';

/** `Select`'s dropdown-open glyph — real Phosphor `CaretDown`, Bold.
 * `Select` deliberately has no Figma component to verify against (see
 * Select.md); matched to `Filter`'s own confirmed `CaretDown`/Bold usage
 * for the same "opens a dropdown" meaning. */
export function CaretDownIcon(props: SVGProps<SVGSVGElement>) {
  return <CaretDown weight="bold" aria-hidden="true" {...props} />;
}
