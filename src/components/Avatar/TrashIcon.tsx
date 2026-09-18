import type { SVGProps } from 'react';
import { TrashSimple } from '@phosphor-icons/react';

/** `Avatar`'s delete-action badge glyph — real Phosphor `TrashSimple`, Bold
 * (confirmed via Figma — not the fuller `Trash` glyph). */
export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return <TrashSimple weight="bold" aria-hidden="true" {...props} />;
}
