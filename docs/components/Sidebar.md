# Sidebar

The app's left rail — the brand mark up top, a module switcher, the active
module's nav list in its own rounded section, and a fixed bottom section
for Profile → Settings. **L2** — Figma + React, rebuilt this pass from an
earlier `CategoryIcon`-rail structure that predated the module switcher.

```tsx
const modules = [
  { id: 'operations', tone: 'brand', label: 'Operations' },
  { id: 'alerts', tone: 'danger', label: 'Alerts' },
  { id: 'assets', tone: 'success', label: 'Assets' },
];

<Sidebar
  mode="expanded"
  modules={modules}
  activeModule={activeModule}
  onModuleChange={setActiveModule}
  userName="Bogdan"
  userInitials="B"
  name="Acme"
  onProfileClick={() => navigate('/profile')}
  profileActive={pathname.startsWith('/profile')}
  onSettingsClick={() => navigate('/settings')}
  settingsActive={pathname.startsWith('/settings')}
>
  {navItems /* SidebarNavItem[] for the active module */}
</Sidebar>
```

| prop | type | default | notes |
|---|---|---|---|
| `mode` | `'collapsed'` \| `'expanded'` | `'collapsed'` | pass the same value given to the parent `AppShell`'s `sidebarMode` |
| `modules` | `SidebarModule[]` — required | | the 3 fixed modules for the top switcher, in display order |
| `activeModule` | `string` — required | | |
| `onModuleChange` | `(id: string) => void` — required | | |
| `children` | `ReactNode` — required | | the active module's own nav items — `SidebarNavItem`s |
| `userName` | `ReactNode` — required | | |
| `userInitials` | `ReactNode` — required | | used when `userAvatar` is omitted |
| `userAvatar` | `ReactNode` | | photo (or other node) for the Profile row — replaces the initials `Avatar` |
| `profileMenu` | `ReactNode` | | legacy — `MenuRow`s when Profile opens a dropdown (omit when using `onProfileClick`) |
| `onProfileClick` | `() => void` | | navigate to a profile page — when set, Profile no longer toggles the menu |
| `profileActive` | `boolean` | `false` | brand-active highlight on the Profile row |
| `onSettingsClick` | `() => void` | | |
| `settingsActive` | `boolean` | `false` | brand-active highlight on the Settings row |
| `name` | `ReactNode` — required | | the wordmark text next to the brand mark |

`SidebarModule` is `{ id: string; tone: 'brand' \| 'success' \| 'danger'; label: string }`
— `tone` is the module's fixed color identity, `label` is visible only to
assistive tech (the switcher segments are bare color pills with no visible
text, matching Figma). A module's position in the switcher is purely
`modules`' own array order — position and tone are independent, so
reordering the array never implies recoloring anything.

## Structure

```
Sidebar
├─ Logo (collapsed-aware — mark only vs. mark + wordmark)
├─ divider
├─ SegmentedControl (size="xs", collapsed-aware) — the module switcher
├─ SidebarSection (content="module") — the active module's nav list
│    (margin-top: -space/6 so the switcher overlaps it by 6px; switcher z-index above)
└─ SidebarSection (content="settings")
   ├─ SidebarNavItem (avatar — `onProfileClick` or opens profileMenu)
   └─ SidebarNavItem (icon={GearSixIcon}, onSettingsClick)
```

Not a single flat list — the switcher and the nav section share a `flex: 1`
group so the nav list is what scrolls when it overflows; the settings
section stays fixed at the bottom regardless. `AppShell` owns the rail's
own width/background (`180px` expanded, `64px` collapsed — see
[AppShell.md](./AppShell.md)); `Sidebar` only owns what's inside it,
including the rail inset (`space/10` left · `space/6` right) so
`SidebarSection` panels fill the remaining width instead of sitting flush
against the viewport edge.

## Why `modules` dropped `icon`/`color: TagColor`

The earlier rail-based `Sidebar` rendered each module as a `CategoryIcon`
tile with a generic `TagColor` (any of 10 validated hues) and its own icon.
The real, finalized switcher is 3 bare color pills with no icon and no
visible label at all — `tone` is deliberately narrowed to the 3 values that
actually exist (`brand`/`success`/`danger`, matching Operations/Alerts/
Assets 1:1), and `icon` was dropped since nothing renders it.

## Figma

`sidebar` (`10577:30220`) — 2 variants (`Property 1`: `Default`/`Variant2`,
64px/180px). Every child — the switcher, both `SidebarSection`s, every nav
row, the Profile/Settings rows — is a real component instance; there are no
remaining loose frames anywhere in the tree.
