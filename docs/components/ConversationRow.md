# ConversationRow

One conversation in a chat list — the Aegis Messages page's left card.
**Built code-first** (owner, 2026-10-01); no Figma master yet — build notes
below.

```tsx
<ConversationRow
  avatar={<Avatar size="xl">TN</Avatar>}
  name="Tomasz Nowak"
  preview="Queue at Korczowa is about 40 trucks…"
  time="09:58"
  unread={2}
  selected
  onClick={() => open(id)}
/>
```

| prop | type | default | notes |
|---|---|---|---|
| `avatar` | `ReactNode` | | an `<Avatar>` instance; renders at its own size — `xl` (44) is the intended one (owner, 2026-10-01) |
| `name` | `ReactNode` | | one line, truncated |
| `preview` | `ReactNode` | | the last message, one line, truncated |
| `time` | `ReactNode` | | pre-formatted ("09:58", "Wed") |
| `unread` | `number` | | solid brand pill under the time; `99+` past 99; omit / 0 for none |
| `selected` | `boolean` | `false` | the open conversation; sets `aria-current` |
| `onClick` | `() => void` | | makes the row a keyboard-operable `role="button"` |

## Why not a `Row` variant

`Row`'s `leading` is deliberately locked to `IconCell` (see `Row.md`), and a
chat list needs three things Row doesn't have: an **Avatar**, a **time
stacked over an unread count**, and a **selected** state. Bending Row to
carry them would break its own rule for every problem and task list that
uses it. Same "two anatomies, two components" split as `IconCell` /
`CategoryIcon` and `SidebarNavItem` / `SettingsNavItem`.

## Anatomy

```
div.row                    padding 12, gap 10, radius xl (12), align center
├─ span.avatar             the Avatar, own size
├─ span.text               fill; column, gap 2
│  ├─ span.name            text/label/lg (15) · color.text.strong
│  └─ span.preview         text/body/md (14), weight medium · color.text.subtle
└─ span.meta               column, gap 4, top-aligned, items on its right edge
   ├─ span.time            text/caption · color.text.subtle · tabular figures
   └─ span.unread          the dashboard chat card's pill: 20 tall, min 20 wide,
                           4 side padding, radius full, brand.500 fill, 1px
                           brand.400 top-left catch, text/label/xs on-brand,
                           tabular figures
```

## States

- **default** — transparent, **no divider** (owner, 2026-10-01): padding 12
  and the list's gap (4) separate rows, as in messenger apps.
- **hover** — Row's wash (`scrollableArea.row.shadow.hover`).
- **selected** — **Tile's recipe exactly** (owner, 2026-10-01): `tile.background`
  fill, 2px top-left / 1px bottom-right white catch, inner shadow 1 1 8
  (`tile.inner-shadow`), drop 0.5 0.5 2 spread 2 (`tile.shadow`). Mirrors
  `Tile.module.css`; change them together. The drop
  needs ~4 of room around the row: a scrolling list must pad itself, or its
  `overflow` clips the shadow (see Aegis `InboxTemplate`).
- **focus-visible** — 1px inset ring (`scrollableArea.row.border.focus`).

## Figma build notes

Component set `ConversationRow`, property `state` = default / hover /
selected, boolean `unread` with a text property for the figure. Auto layout
horizontal, padding 12, gap 10, counter-axis centre, corner 12. Avatar
instance (xl); text frame fill-width, vertical, gap 2, both texts truncate;
meta frame hug, vertical, gap 4, top + right aligned, fill height. No divider; rows stack with
gap 4 in the list.
