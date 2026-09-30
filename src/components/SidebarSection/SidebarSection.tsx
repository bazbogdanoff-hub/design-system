import { forwardRef, useCallback, useRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { useSlidingHighlight } from '../../lib/slidingHighlight';
import styles from './SidebarSection.module.css';

export type SidebarSectionContent = 'module' | 'settings';

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** `module` — the active module's nav list, small top corners (it sits
   * right under the module switcher). `settings` — the Profile/Settings
   * block, a full corner radius plus one deliberately deeper bottom-right
   * corner (a one-off flourish, see `radius.sidebar.section.deep`). */
  content: SidebarSectionContent;
}

/**
 * The sidebar's own rounded content card — same dark panel background and
 * inner-shadow edge in both variants; corner treatment and inline/top
 * padding both change per `content` (module gets a top inset for the
 * switcher above it, settings doesn't).
 */
export const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(function SidebarSection(
  { content, className, children, ...rest },
  ref,
) {
  // The current row's glass is one element that travels between rows
  // (lib/slidingHighlight.ts); rows mark their frame with `data-highlight`.
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  useSlidingHighlight(sectionRef, highlightRef, '[data-highlight]');
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      sectionRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <div
      ref={setRef}
      className={cn(styles.section, className)}
      data-content={content}
      data-sliding=""
      {...rest}
    >
      <span ref={highlightRef} aria-hidden="true" className={styles.highlight} />
      {children}
    </div>
  );
});
