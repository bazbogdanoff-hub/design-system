import type { SVGProps } from 'react';

/** `HelperText`'s `error` glyph — a filled triangle with the exclamation mark
 * punched out (`fill-rule: evenodd`, same technique as `SeverityIcon`'s
 * triangle). Fixed, not consumer-configurable. */
export function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M142.5 34.7c-6.4-11.6-22.6-11.6-29 0L18.9 210.3c-6.2 11.2 1.9 24.9 14.5 24.9h189.2c12.6 0 20.7-13.7 14.5-24.9L142.5 34.7ZM118 104a10 10 0 0 1 20 0v56a10 10 0 0 1-20 0v-56Zm10 100a12 12 0 1 1 0-24 12 12 0 0 1 0 24Z"
      />
    </svg>
  );
}
