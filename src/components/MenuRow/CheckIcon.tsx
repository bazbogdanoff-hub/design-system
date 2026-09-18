import type { SVGProps } from 'react';
import { Check } from '@phosphor-icons/react';

/** `MenuRow`'s selected-state checkmark — real Phosphor `Check`, Bold
 * (confirmed via Figma's `state=selected` variant). */
export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return <Check weight="bold" aria-hidden="true" {...props} />;
}
