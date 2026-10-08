# TabBar

The `phone` tier's navigation, in `AppShell`'s `bottomBar` slot. **L2.**
Built in code from the owner's mock (2026-10-05); no Figma frame yet, this
page is its spec.

```
[ ☰ ]  [ (▣ Dashboard)  ☐  ☐  ☐ ]
[ ☰ ]  [ ☐  ☐  ☐  ☐ ]  [ ▣ ]        a page that is none of the tabs
```

```tsx
<TabBar menuOpen={menuOpen} onMenuToggle={() => setMenuOpen((v) => !v)}>
  <SidebarNavItem icon={<SquaresFour weight="fill" />} label="Dashboard" aria-label="Dashboard" active />
  <SidebarNavItem icon={<ClipboardText weight="fill" />} aria-label="Tasks" />
  {/* up to 4 */}
</TabBar>
```

In the app it is wired once, in `AppLayout`, from each module's
`phoneTabs` (`src/lib/nav.ts`). Every page is also in the menu
(`NavSheet`), which the menu button opens over the page card.

## Anatomy

- **Panels:** the sidebar's dark panel, rounded 12 (`radius-xl`; set here,
  since AppShell's phone `--radius-card` doesn't reach outside the page
  card), 10 apart. The bar is 48 tall.
- **Menu button:** a square 48 panel on the left, a `SidebarNavItem` in
  brand tone; ☰ when closed, × when the menu is open (`menuOpen`).
- **Tabs:** one panel taking the rest, inset 4 on every side and between
  tabs. Inactive tabs are their 40 frame, icon only, each with an
  `aria-label`. The **current tab** (`active`) shows its name and fills what
  is left. The current tab's glass travels between tabs
  (`useSlidingHighlight`), as in the sidebar.
- **Third panel** (`current`): on Messages, Aegis, Profile or Settings,
  that page's item, highlighted and icon only, in a square 48 panel on the
  right; the tabs then spread evenly. A name there was cut at 92-122 wide,
  so it is icon only (owner, 2026-10-05).
- **A module page off the tabs** (reached through the menu) takes the last
  tab's place, named and highlighted as any current tab, until a tab is
  picked (owner, 2026-10-08). The app does the swap (`AppLayout`); the bar
  just shows the 4 items it is given.
- **Touch:** each tab's whole cell is its target, so every target meets 44
  to 48 without a hidden hitbox.
- The tab keeps its highlight while the menu is open.

## Props

| prop | type | |
|---|---|---|
| `menuOpen` | `boolean` | flips the menu button to a close |
| `onMenuToggle` | `() => void` | |
| `children` | `ReactNode` | up to 4 `SidebarNavItem`s |
| `current` | `ReactNode` | one active `SidebarNavItem`, for a page that is none of the tabs |

## Open (owner)

- Inactive tabs are 40 wide (48 tall); 44 is possible at 16 less for the
  current tab.
- An unread signal in the bar: a dot on the menu button and/or a permanent
  Messages square.
- Tab widths change at once when switching; animate if it reads as a jump.
