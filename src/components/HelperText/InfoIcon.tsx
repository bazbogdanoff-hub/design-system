import type { SVGProps } from 'react';

/** `HelperText`'s `primary` glyph — a filled circle with the "i" punched out
 * (`fill-rule: evenodd`, same technique as `WarningIcon`). Fixed, not
 * consumer-configurable. */
export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm-8 56a8 8 0 1 1 8 8 8 8 0 0 1-8-8Zm20 88h-24a8 8 0 0 1 0-16h4v-40h-4a8 8 0 0 1 0-16h12a8 8 0 0 1 8 8v48h4a8 8 0 0 1 0 16Z"
      />
    </svg>
  );
}
