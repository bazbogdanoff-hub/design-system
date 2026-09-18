# TableRow

A real `<tr>`. **L1** — ported from Figma's `TableRow`.

```tsx
<TableRow>...</TableRow>
<TableRow status="danger">...</TableRow>
<TableRow status="success">...</TableRow>
```

| prop | type | notes |
|---|---|---|
| `status` | `'danger' \| 'success'` | a real fact about this row's data (e.g. "this rig has a critical issue") |

Every other native `<tr>` prop passes through.

## No `variant` prop, no `hover`/`active` props

Figma's `TableRow` needs a `variant` (`header`/`default`) property because
Figma has no way to know "this row happens to sit inside a `<thead>`" — it
has to be told. Real HTML does know that, so this component has no such
prop: `Table` places the header row inside a real `<thead>` and body rows
inside `<tbody>`, and this component's CSS keys off that ancestor context
(`thead .row` / `tbody .row`) to pick the right background/divider.

Likewise, Figma's `state` needed explicit `hover`/`active` values because a
static reference can't have live pseudo-classes — a real `<tr>` gets
`:hover` and `:focus-within` for free, so 2 of the 4 Figma states need no
code-side prop at all. Only `danger`/`success` describe something CSS can't
derive (the row's own data), hence the one `status` prop.

## `hover` — an inset wash, not a background swap

`box-shadow: inset 0 0 0 1000px color.table.row.shadow.hover` — a
translucent (alpha-black 3%) wash layered over whatever background is
already there, not a background-color swap. Same technique the original
`Row`/`ScrollableArea` hover already uses, and the same token
(`table.row.shadow.hover`) is shared with it.

## `active`/focus — mirrors `default`, only the border differs

Owner's call, after first trying a background-color swap for the focused
state: `color.table.row.background.active` now directly **aliases**
`color.table.row.background.default` (not a duplicated value) — the fill
never changes on focus. A `:focus-within` outline (`1px`,
`color.table.row.border.active` → `color.border.focus`, `outline-offset:
-1px` so it draws inside the row) is the only signal. Same restraint
`Input` already uses for its own focus state (border changes, fill doesn't).

## Figma

`TableRow` (`10298:18440`) — 6 variants, a **partial grid**: `variant=header`
× `{default}` + `variant=default` × `{default, hover, active, danger,
success}` (not a full 2×5 cross — same precedent as `Button`'s own `xs`/
`2xl` exceptions). The header row briefly had its own `active` state too,
but the owner decided a header row only ever needs one flat color and
collapsed it back to a single `default` — using the value that had been
`active` (zinc.100, actually distinguishable from the row/card tones around
it), not the original `default` (zinc.50, nearly invisible at that gap).
