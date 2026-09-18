import type { SVGProps } from 'react';
import { UploadSimple } from '@phosphor-icons/react';

/** `FileDropper`'s idle/disabled glyph — real Phosphor `UploadSimple`,
 * Bold (confirmed via Figma). */
export function UploadIcon(props: SVGProps<SVGSVGElement>) {
  return <UploadSimple weight="bold" aria-hidden="true" {...props} />;
}
