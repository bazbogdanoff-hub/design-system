import type { SVGProps } from 'react';
import { Info } from '@phosphor-icons/react';

/** `HelperText`'s `primary` tone glyph — real Phosphor `Info`, Bold
 * (confirmed via Figma). */
export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return <Info weight="bold" aria-hidden="true" {...props} />;
}
