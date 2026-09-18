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

## Active — a neutral highlight, not a color wash

The active row's highlight is the same glass recipe (zinc fill + a
black-alpha overlay + zinc border + inset shadow) the module switcher's own
unselected segment uses — tone-agnostic on purpose. Only the icon and label
recolor to the active module's `tone` (via `color.sidebar.<tone>.accent`,
the 400-step "reads clearly on a dark surface" pair, not the 600/700
semantic tone tokens calibrated for light surfaces). An earlier version of
this component used a light-surface `background.<tone>-subtle` wash instead
— replaced to match the real Figma component once it was fully built out
this session.

## Collapsed vs. expanded — omit `label`, not a prop

No `collapsed` prop here — `Sidebar` decides whether to pass `label` at all
based on its own `mode`, the same convention the old rail-based `Sidebar`
already used for its own bottom-cluster rows. `[data-mode='collapsed']`
(read off the `Sidebar` ancestor) centers the icon and drops the row's own
inline padding when no label is present.

## Figma

`SidebarNavItem` (`10603:32870`) — 12 variants: `collapsed`(true/false) ×
`leading`(icon/avatar) × `tone`(neutral/brand/success/danger) ×
`state`(default/active/hover), not a full cross-product (`tone` only varies
for `state=active`; `leading=avatar` only exists at `state=default`). Every
variant's content was cloned from the sidebar's own live rows, not built
from scratch.
