# TableHeaderCell

A real `<th scope="col">`. **L1** — ported from Figma's `TableHeaderCell`.

```tsx
<TableHeaderCell>
  <input type="checkbox" aria-label="Select all rows" />
</TableHeaderCell>

<TableHeaderCell sortable sortDirection={sort} onSort={handleSort}>
  ID
</TableHeaderCell>

<TableHeaderCell /> {/* trailing/overflow column, empty */}
```

| prop | type | notes |
|---|---|---|
| `children` | `ReactNode` | text, a select-all checkbox, or nothing |
| `sortable` | `boolean` | wraps `children` in a real `<button>` + shows the sort caret |
| `sortDirection` | `'ascending' \| 'descending' \| 'none'` | sets `aria-sort` on the `<th>` when `sortable` |
| `onSort` | `() => void` | fires on click |

Every other native `<th>` prop passes through.

## One component, not three Figma variants

Figma's `TableHeaderCell` has a `content` variant (`select`/`label`/`end`)
because a static reference needs one concrete shape per cell. In code
there's no such constraint — `children` already covers `select` (pass a
checkbox) and `end` (pass nothing); only `label`'s sort *behavior* needed
real props, so that's the only thing exposed. A `<th>` isn't itself
interactive, which is why `sortable` renders a real `<button>` inside it
rather than making the cell clickable directly — the whole label+caret is
one keyboard-operable target, not just the tiny icon.

## Figma

`TableHeaderCell` (`10298:18358`) — 3 variants, `content`: `select` (a
`Checkbox` instance — always checkbox, never radio, since "select all" is
inherently a multi-select concept) / `label` (text + a `CaretUpDown` icon
gated by an exposed `hasSort` boolean) / `end` (empty). Text: `text/label/sm`,
`color.text.subtle`, uppercase.
