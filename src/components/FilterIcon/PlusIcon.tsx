import type { SVGProps } from 'react';
import { Plus } from '@phosphor-icons/react';

/** `FilterIcon`'s hover/active glyph — real Phosphor `Plus`, Bold (confirmed
 * via Figma's `Filter — icon` component). */
export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return <Plus weight="bold" aria-hidden="true" {...props} />;
}
