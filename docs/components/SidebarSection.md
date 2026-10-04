# SidebarSection

The sidebar's own rounded content card - the dark panel wrapping either the
active module's nav list or the Profile/Settings block. **L1** - Figma +
React, both built this session.

```tsx
<SidebarSection content="module">
  {navItems}
</SidebarSection>

<SidebarSection content="settings">
  {profileRow}
  {settingsRow}
</SidebarSection>
```

| prop | type | notes |
|---|---|---|
| `content` | `'module'` \| `'settings'` - required | which corner treatment + top padding this instance gets |

Every other native `<div>` prop passes through (`className`, `onClick`, …).

## Same panel, two corner recipes

Both variants share one dark background (`color.sidebar.panel.background`)
and one inset-edge tint (`color.sidebar.panel.innerShadow`) - only the
corner radius (and top padding) differ per `content`:

- **`module`** - small top corners (`radius.sidebar.section.top`, 4px; it
  sits right under the module switcher, not against the sidebar's own outer
  edge there) and a full `radius.panel` (12px) on the bottom. Vertical
  padding `space/16` top · `space/4` bottom.
- **`settings`** - `radius.panel` on three corners, and one deliberately
  deeper bottom-right corner (`radius.sidebar.section.deep`, 24px) - a
  one-off flourish, not a page-viewport radius reused by coincidence.
  Vertical padding `space/4` top and bottom.

`radius.sidebar.section.top`/`.deep` are deliberate primitive-alias
exceptions (same pattern as the rest of `component.color.json`'s `sidebar`
block) - neither value has a matching semantic step.

## Figma

`SidebarSection` (`10603:32642`) - 4 variants: `content`(module/settings) ×
`collapsed`(true/false). Built by cloning the sidebar's own live containers
(with their real content already inside - nav rows for `module`, Profile/
Settings rows for `settings`) rather than reconstructing them, so every
variant's baked content is exactly what ships. The two `collapsed=true`
variants exist specifically because the collapsed sidebar's icon-only rows
are different content, not just a narrower render of the expanded ones -
each `content`×`collapsed` pair needed its own real instance underneath.

## Motion - the travelling highlight (2026-09-28)

The current row's glass is **one element per section that travels between
rows** (`lib/slidingHighlight.ts`), the same stretch-and-settle as
`SegmentedControl`'s. `SidebarNavItem` marks its frame `data-highlight` when
`active` and, inside a section, leaves its own glass off; its icon and label
colour ease over to match. The highlight copies the frame's radius, so the
Settings row's deep corner morphs in. A section with no current row (the
page lives in the other section) fades its highlight out.

**Figma:** no change - at rest it looks identical.
