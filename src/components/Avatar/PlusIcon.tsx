import type { SVGProps } from 'react';
import { Plus } from '@phosphor-icons/react';

/** `Avatar`'s add-action badge glyph — real Phosphor `Plus`, Bold (confirmed via Figma). */
export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return <Plus weight="bold" aria-hidden="true" {...props} />;
}
