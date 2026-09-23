import type { SVGProps } from 'react';
import { SidebarSimple } from '@phosphor-icons/react';

/** Temporary collapse/expand glyph — Phosphor `SidebarSimple`, Fill. */
export function SidebarSimpleIcon(props: SVGProps<SVGSVGElement>) {
  return <SidebarSimple weight="fill" aria-hidden="true" {...props} />;
}
