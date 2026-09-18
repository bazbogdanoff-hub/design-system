import type { SVGProps } from 'react';

/** `TableHeaderCell`'s sort indicator — an up/down caret pair. Fixed, not
 * consumer-configurable. */
export function CaretUpDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M181.66 165.66l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 196.69l42.34-42.35a8 8 0 0 1 11.32 11.32Zm-96-75.32L128 48l42.34 42.34a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32Z" />
    </svg>
  );
}
