import type { SVGProps } from 'react';
import { FileText } from '@phosphor-icons/react';

/** `FileDropper`'s file glyph — real Phosphor `FileText`, Bold (confirmed via Figma). */
export function DocumentIcon(props: SVGProps<SVGSVGElement>) {
  return <FileText weight="bold" aria-hidden="true" {...props} />;
}
