import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
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
  return (
    <div ref={ref} className={cn(styles.section, className)} data-content={content} {...rest}>
      {children}
    </div>
  );
});
