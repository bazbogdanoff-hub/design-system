import type { SVGProps } from 'react';
import { GearSix } from '@phosphor-icons/react';

/** `Sidebar`'s settings glyph — real Phosphor `GearSix`, **Fill** weight
 * (confirmed via Figma, `4009:2670`) — the one confirmed exception to the
 * rest of the system, which uses Bold throughout. Originally hand-copied
 * as a raw path before `@phosphor-icons/react` was adopted system-wide;
 * now a thin wrapper like every other icon, for consistency. */
export function GearSixIcon(props: SVGProps<SVGSVGElement>) {
  return <GearSix weight="fill" aria-hidden="true" {...props} />;
}
