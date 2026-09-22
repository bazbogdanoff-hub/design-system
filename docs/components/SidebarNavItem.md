# SidebarNavItem

One row in the sidebar's nav list — a bare monochrome icon (no colored
tile), the module-toned label, with a neutral glass highlight on the active
row. **L1** — Figma + React, both built this session; rewritten this pass
to replace an earlier, incorrect light-surface color recipe.

```tsx
<SidebarNavItem icon={<ShieldCheckIcon />} label="Security" />
<SidebarNavItem icon={<GridFourIcon />} label="Task Hub" active tone="brand" />
<SidebarNavItem icon={<ShieldCheckIcon />} />                {/* collapsed sidebar — icon only */}
<SidebarNavItem avatar={<Avatar size="sm">JD</Avatar>} label="Profile" />
```

| prop | type | default | notes |
|---|---|---|---|
| `icon` | `ReactNode` | | a bare monochrome icon. Mutually exclusive with `avatar` |
| `avatar` | `ReactNode` | | an `<Avatar>` instance for a Profile-style row |
| `label` | `ReactNode` | | omit for the collapsed sidebar's icon-only row |
| `active` | `boolean` | `false` | is this the current page within the active module |
| `tone` | `'brand'` \| `'success'` \| `'danger'` | `'brand'` | matches whichever module this row belongs to; ignored unless `active` |
| `settingsCorner` | `boolean` | `false` | **Settings row only** — bottom-right frame radius 16px (`radius.2xl`) instead of 8, nesting inside the section's 24px deep corner |

Every other native `<button>` prop passes through (`onClick`, `disabled`, …).

## `icon` vs `avatar` — two slots, not one with an override

A Profile row's leading visual isn't a small monochrome icon scaled to fit —
`Avatar` has its own natural size (28px at `size="sm"`) and internal layout
that isn't built to scale outside its own variant sizes. An earlier version
of this row swapped a generic icon slot's underlying component to `Avatar`
after the fact; that force-resized it into the icon's 20×20 box and visibly
distorted it. Fixed by giving `avatar` its own slot instead — same "two
anatomies, two slots" reasoning `CategoryIcon`/`IconCell` already document.
Both slots render inside the same 40×40 centered box, but only `icon` gets
the fixed 20×20 inner constraint; `avatar` renders at its own size.

## Anatomy

```
button.item          ← hit target, padding space/4 vertical only (→ 48px tall)
└─ span.frame        ← fill width × 40px; hover / active glass chrome lives here
   ├─ span.leading   ← 40×40 icon/avatar cell
   └─ span.label     ← expanded only
```

The active highlight must **not** paint on `.item` — that would include the
4px gutters and read as a full 48px chrome. It fills `.frame` instead
(height/width fill of the padded content box = 40px tall).

## Active — a neutral highlight, not a color wash

The active row's highlight is the same glass fill/overlay recipe as the
module switcher — tone-agnostic on purpose. Stroke is **top + left only**:

```css
box-shadow:
  inset 1px 1px 0 0 var(--navItem-active-border),   /* top + left stroke */
  inset -1px -1px 2px 0 var(--navItem-active-innerShadow); /* corner shade */
```

**Do not** use a full CSS `border` or a universal inset ring
(`inset 0 0 0 1px`) on this component.

Only the icon and label recolor to the active module's `tone` (via
`color.sidebar.<tone>.accent`).

## Collapsed vs. expanded — omit `label`, not a prop

No `collapsed` prop here — `Sidebar` decides whether to pass `label` at all
based on its own `mode`, the same convention the old rail-based `Sidebar`
already used for its own bottom-cluster rows. `[data-mode='collapsed']`
(read off the `Sidebar` ancestor) centers the icon. Rows have no horizontal
padding in either mode (only `space-4` vertical).

## Figma

`SidebarNavItem` (`10603:32870`) — 12 variants: `collapsed`(true/false) ×
`leading`(icon/avatar) × `tone`(neutral/brand/success/danger) ×
`state`(default/active/hover), not a full cross-product (`tone` only varies
for `state=active`; `leading=avatar` only exists at `state=default`). Every
variant's content was cloned from the sidebar's own live rows, not built
from scratch.
