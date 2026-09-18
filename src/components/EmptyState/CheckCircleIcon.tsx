import type { SVGProps } from 'react';

/** `EmptyState`'s default icon — a filled circle with a checkmark punched
 * out (`fill-rule: evenodd`, same technique as `WarningIcon`/`InfoIcon`).
 * Only shown when no `icon` prop is given. */
export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm45.66 85.66-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 11.32Z"
      />
    </svg>
  );
}
