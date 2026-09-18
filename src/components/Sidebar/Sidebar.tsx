import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { SegmentedControl } from '../SegmentedControl';
import { SegmentedControlItem, type SegmentedControlItemPosition } from '../SegmentedControlItem';
import { SidebarSection } from '../SidebarSection';
import { SidebarNavItem, type SidebarNavItemTone } from '../SidebarNavItem';
import { Avatar } from '../Avatar';
import { Logo } from '../Logo';
import { Menu } from '../Menu';
import { GearSixIcon } from './GearSixIcon';
import styles from './Sidebar.module.css';

export type SidebarMode = 'collapsed' | 'expanded';

export interface SidebarModule {
  id: string;
  /** `brand` (Operations) · `success` (Assets) · `danger` (Alerts) — the
   * module's fixed color identity. Position in the switcher is purely
   * `modules`' own array order; color and position are independent, so
   * reordering modules never implies recoloring them. */
  tone: SidebarNavItemTone;
  /** Visible only to assistive tech — the switcher segments themselves are
   * bare color pills with no visible label, matching the Figma component. */
  label: string;
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Pass the same value given to the parent `AppShell`'s own `sidebarMode`
   * — labels stay in sync with the rail's actual width. */
  mode?: SidebarMode;
  /** The 3 fixed modules for the top switcher, in display order. */
  modules: SidebarModule[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  /** The active module's own nav items — a list of `SidebarNavItem`s. */
  children: ReactNode;
  userName: ReactNode;
  userInitials: ReactNode;
  /** `MenuRow`s for the profile dropdown. Include an Admin row here only
   * when the current user actually has rights — Admin isn't a module, it's
   * a separate top-bar shell the consumer opens from this menu. */
  profileMenu: ReactNode;
  onSettingsClick?: () => void;
  /** The wordmark text next to the brand mark — ignored when collapsed. */
  name: ReactNode;
}

/**
 * The app's left rail — the brand mark up top, a module switcher (picking
 * one swaps `children` to that module's own nav), the active module's nav
 * list in its own rounded section, and a fixed bottom section for
 * Profile → Settings. `AppShell` still owns the rail's width/background,
 * this only owns what's inside it.
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  {
    mode = 'collapsed',
    modules,
    activeModule,
    onModuleChange,
    children,
    userName,
    userInitials,
    profileMenu,
    onSettingsClick,
    name,
    className,
    ...rest
  },
  ref,
) {
  const [profileOpen, setProfileOpen] = useState(false);
  const collapsed = mode === 'collapsed';

  return (
    <nav ref={ref} className={cn(styles.sidebar, className)} data-mode={mode} {...rest}>
      <div className={styles.header}>
        <Logo collapsed={collapsed} name={name} />
      </div>

      <div className={styles.divider} />

      <div className={styles.switcherGroup}>
        <SegmentedControl size="xs" collapsed={collapsed} className={styles.switcher} aria-label="Modules">
          {modules.map((mod, index) => {
            const position: SegmentedControlItemPosition =
              index === 0 ? 'start' : index === modules.length - 1 ? 'end' : 'middle';
            return (
              <SegmentedControlItem
                key={mod.id}
                tone={mod.tone}
                position={position}
                selected={mod.id === activeModule}
                onClick={() => onModuleChange(mod.id)}
                aria-label={mod.label}
              />
            );
          })}
        </SegmentedControl>

        <SidebarSection content="module" className={styles.nav}>
          {children}
        </SidebarSection>
      </div>

      <SidebarSection content="settings" className={styles.bottomSection}>
        <span className={styles.profileWrapper}>
          <SidebarNavItem
            avatar={<Avatar size="sm">{userInitials}</Avatar>}
            label={!collapsed ? userName : undefined}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((isOpen) => !isOpen)}
          />
          <Menu open={profileOpen} onClose={() => setProfileOpen(false)} className={styles.profileMenu}>
            {profileMenu}
          </Menu>
        </span>

        <SidebarNavItem icon={<GearSixIcon />} label={!collapsed ? 'Settings' : undefined} onClick={onSettingsClick} />
      </SidebarSection>
    </nav>
  );
});
