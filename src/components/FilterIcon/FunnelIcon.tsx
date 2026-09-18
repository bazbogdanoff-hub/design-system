import type { SVGProps } from 'react';
import { Funnel } from '@phosphor-icons/react';

/** `FilterIcon`'s at-rest glyph — real Phosphor `Funnel`, Bold (confirmed
 * via Figma's `Filter — icon` component). */
export function FunnelIcon(props: SVGProps<SVGSVGElement>) {
  return <Funnel weight="bold" aria-hidden="true" {...props} />;
}
