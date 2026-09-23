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
import { SidebarSimpleIcon } from './SidebarSimpleIcon';
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
  /** Optional photo for the Profile row — when set, replaces the initials `Avatar`. */
  userAvatar?: ReactNode;
  /** `MenuRow`s for the profile dropdown when Profile opens a menu
   * (legacy). Omit / unused when `onProfileClick` navigates to a profile page. */
  profileMenu?: ReactNode;
  onSettingsClick?: () => void;
  /** Highlight the Settings row (e.g. when `/settings` is the current route). */
  settingsActive?: boolean;
  /** Navigate to the profile screen — when set, Profile no longer toggles the menu. */
  onProfileClick?: () => void;
  /** Highlight the Profile row (e.g. when `/profile` is the current route). */
  profileActive?: boolean;
  /** The wordmark text next to the brand mark — ignored when collapsed. */
  name: ReactNode;
  /** Temporary: toggles collapsed ↔ expanded (icon under logo + divider). */
  onModeToggle?: () => void;
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
    userAvatar,
    profileMenu,
    onSettingsClick,
    settingsActive = false,
    onProfileClick,
    profileActive = false,
    name,
    onModeToggle,
    className,
    ...rest
  },
  ref,
) {
  const [profileOpen, setProfileOpen] = useState(false);
  const collapsed = mode === 'collapsed';

  function handleProfileClick() {
    if (onProfileClick) {
      onProfileClick();
      return;
    }
    setProfileOpen((isOpen) => !isOpen);
  }

  return (
    <nav ref={ref} className={cn(styles.sidebar, className)} data-mode={mode} {...rest}>
      <div className={styles.header}>
        <Logo collapsed={collapsed} name={name} />
      </div>

      <div className={styles.divider} />

      {onModeToggle != null && (
        <SidebarNavItem
          icon={<SidebarSimpleIcon />}
          label={!collapsed ? 'Collapse' : undefined}
          tone="brand"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onModeToggle}
        />
      )}

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
            avatar={userAvatar ?? <Avatar size="sm">{userInitials}</Avatar>}
            label={!collapsed ? userName : undefined}
            active={profileActive || profileOpen}
            tone="brand"
            aria-haspopup={onProfileClick ? undefined : 'menu'}
            aria-expanded={onProfileClick ? undefined : profileOpen}
            onClick={handleProfileClick}
          />
          {!onProfileClick && profileMenu != null && (
            <Menu open={profileOpen} onClose={() => setProfileOpen(false)} className={styles.profileMenu}>
              {profileMenu}
            </Menu>
          )}
        </span>

        <SidebarNavItem
          icon={<GearSixIcon />}
          label={!collapsed ? 'Settings' : undefined}
          active={settingsActive}
          tone="brand"
          settingsCorner
          onClick={onSettingsClick}
        />
      </SidebarSection>
    </nav>
  );
});
