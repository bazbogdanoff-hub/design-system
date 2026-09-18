import type { SVGProps } from 'react';
import { Warning } from '@phosphor-icons/react';

/** `HelperText`'s `error` tone glyph — real Phosphor `Warning`, Bold
 * (confirmed via Figma; also reused by `FileDropper`'s error status and
 * `TableCell`'s `hasAlert` flag). */
export function WarningIcon(props: SVGProps<SVGSVGElement>) {
  return <Warning weight="bold" aria-hidden="true" {...props} />;
}
