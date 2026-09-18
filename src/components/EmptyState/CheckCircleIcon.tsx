import type { SVGProps } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

/** `EmptyState`'s default icon — real Phosphor `CheckCircle`, Bold
 * (confirmed via Figma; also reused by `FileDropper`'s success status). */
export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return <CheckCircle weight="bold" aria-hidden="true" {...props} />;
}
