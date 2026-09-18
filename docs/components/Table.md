# Table

Card surface + header (filters/actions) + a real `<table>` + footer
(selection/pagination). **L2** — ported from Figma's `Table`.

```tsx
<Table
  filters={<FilterBar ... />}
  actions={<Button variant="secondary" size="sm">Export</Button>}
  header={
    <TableRow>
      <TableHeaderCell><input type="checkbox" aria-label="Select all rows" /></TableHeaderCell>
      <TableHeaderCell sortable sortDirection={sort} onSort={handleSort}>ID</TableHeaderCell>
      {/* ...more columns */}
    </TableRow>
  }
  selectedCount={selected.length}
  selectionActions={<Button variant="tertiary" size="sm">Delete</Button>}
  pagination={<Pagination page={page} totalPages={10} onPageChange={setPage} />}
>
  {rows.map((row) => (
    <TableRow key={row.id} status={row.status}>
      <TableCell>...</TableCell>
    </TableRow>
  ))}
</Table>
```

| prop | type | notes |
|---|---|---|
| `filters` | `ReactNode` | header, left-aligned |
| `actions` | `ReactNode` | header, right-aligned — 0 to N buttons, just compose them |
| `header` | `ReactNode` — required | a `<TableRow>` of `<TableHeaderCell>`s |
| `children` | `ReactNode` — required | body `<TableRow>`s of `<TableCell>`s |
| `selectedCount` | `number` | shows the footer's selection panel once truthy |
| `selectionActions` | `ReactNode` | shown next to the selection count |
| `pagination` | `ReactNode` | the footer's right side |

The header region renders only if `filters` or `actions` is passed; the
footer only if `selectedCount` is truthy or `pagination` is passed.

## Booleans in Figma become plain conditionals here

Figma's `Table` has 5 exposed booleans (`hasFilters`/`hasHeader`/
`hasSelection`/`hasPagination`/`hasFooter`) because Figma has no way to
*compute* "is this content present" — it has to be told. In React,
`filters != null`, `Boolean(selectedCount)`, etc. compute the same thing
from whatever was actually passed, so none of those need to be separate
props a consumer sets by hand.

## Wraps the real `Card` — the one place code and Figma deliberately diverge

`Table`'s root is `<Card padding="none">`, not a hand-replicated
fill/radius/shadow. In Figma, nesting a real `Card` **instance** inside
`Table` would put the `content` Slot 2 instance-levels deep (`Table`
instance → nested `Card` instance → stack → Slot) — exactly the
`insertChild` restriction logged in `HANDOFF.md` §6, meaning every future
row-insert into a real table would need `detachInstance()`. That restriction
is Figma-plugin-API-specific and doesn't exist in React, so here it's just
`<Card>` directly. `Card` gained `overflow: hidden` under `padding="none"`
for this (see `Card.md`) so the flush header/rows/footer respect its
rounded corners.

## A real `<table>` solves column alignment for free

A real question that came up while speccing this in Figma: if cells hug
their own content, how do columns line up across different rows? In Figma
there's no good answer short of manually keeping every cell's width in sync
per column (which is exactly what the *original* hand-built table did,
fragile by construction). A real HTML `<table>` doesn't have this problem —
the browser's own table layout algorithm gives every cell in a column the
same width automatically. One more reason this component wraps a real
`<table>` rather than a flex/grid re-implementation.

## Figma

`Table` (`10302:18481`) — single component, no variants. 3 stacked regions
(`space/16` between them): `header` (`space/16` padding, space-between),
`content` (the real Slot, zero padding — holds the header `TableRow` + body
`TableRow`s together), `footer` (`space/16` padding, space-between). Root
replicates Card's exact bound tokens (fill, per-side stroke weights, its
"vignette xs" inner-shadow effect, corner radius) rather than nesting a live
Card instance, for the reason above.
