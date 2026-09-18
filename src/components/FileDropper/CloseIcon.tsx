import type { SVGProps } from 'react';
import { X } from '@phosphor-icons/react';

/** `FileDropper`'s cancel/remove glyph — real Phosphor `X`, Bold (confirmed via Figma). */
export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return <X weight="bold" aria-hidden="true" {...props} />;
}
