# ListCard

A card built specifically to hold a filterable, scrollable list. **L2** —
Figma + React, React ported this session.

```tsx
<ListCard
  header={<ListCardHeader heading="Fleet issues" description="Trucks with open problems" />}
  filters={
    <>
      <Filter>Status</Filter>
      <Filter>Region</Filter>
    </>
  }
>
  {rows.map((row) => (
    <Row key={row.id} heading={row.title} description={row.detail} />
  ))}
</ListCard>

// No filters, no description — both are optional
<ListCard header={<ListCardHeader heading="Recent activity" />}>
  <Row heading="Only one row" description="…" />
</ListCard>
```

| prop | type | notes |
|---|---|---|
| `header` | `ReactNode` — required | usually a `<ListCardHeader>` — see below |
| `filters` | `ReactNode` | any number of `Filter`s, rendered in a `FilterBar` row. Omit entirely to skip the row |
| `children` | `ReactNode` — required | rendered inside a `ScrollableArea` |
| `size` | `sm` · `md` (default) · `lg` | cascades to a bare `header` — see below |

`ListCard` renders a real `Card` (`padding="md"`) as its root, so any other
`Card`/`HTMLAttributes<HTMLDivElement>` prop (`className`, `onClick`, …)
passes through to it.

## Single component in Figma — no variants to mirror

The Figma reference (`10084:14100`) has zero component properties. The only
thing that ever varies is whether `ListCardHeader`'s own `description` is
present, and that's `ListCardHeader`'s prop, not this component's — matching
HANDOFF's own framing ("the `description` toggle lives on the nested
`ListCardHeader`, not on `ListCard` itself").

## `size` cascades to a bare `header`, same mechanism as `FormField`→`Input`

If `header` is a `<ListCardHeader>` with no explicit `size` of its own,
`ListCard` clones it with its own `size`. A `ListCardHeader` with its own
`size` set is left alone — the explicit value always wins. Like
`ListCardHeader`'s own `size`, this has no Figma variant backing it — it's a
React-only convenience for the rare case a screen wants a denser or roomier
list card.

## `filters` — omit it, and the row disappears entirely

Passed straight through as `FilterBar`'s `children`. `FilterBar` already
collapses to `null` when it has no add-filter trigger and no filters — so
`filters={undefined}` (the default) means no `FilterBar` renders at all, not
an empty row. This matches the single-component Figma reference, which has
no separate "with/without filters" variant to speak of.

## Composition

```
Card (padding="md")
└─ Stack (direction="column", gap="lg")
   ├─ header               (ListCardHeader, size-cascaded)
   ├─ FilterBar             (only if `filters` is passed)
   └─ ScrollableArea        (children — the list rows)
```

`ScrollableArea` is given `flex: 1 1 auto; min-height: 0` so it absorbs
whatever extra height a consumer's own layout gives `ListCard` (e.g. a
fixed-height `Grid` cell) — the header and filters row stay their natural
size, only the list scrolls. Without an explicit height anywhere up the
tree, the card simply grows to fit its content and nothing scrolls, which is
the correct default for a card with only a few rows.

## Spotted in passing, not fixed: a stale gap label

The Figma wrapper frame is named `"Stack (column, gap=xl)"`, but its
measured `itemSpacing` is actually `16` (`space/lg`), not `20`
(`space/xl`) — almost certainly a stale layer name rather than the intended
value, since `16` matches `Table`'s own identical header/content/footer
region-stacking gap exactly. React uses the real measured value (`gap="lg"`)
rather than the label. Bridge access was read-only this pass (another agent
was concurrently resizing `ProgressBar` in the same live file), so the label
itself wasn't corrected in Figma.

## Figma

**`ListCard`** (`10084:14100`) — single component, no variants. Nests a real
`Card`(`padding=md`) instance holding a `ListCardHeader` instance, a
`FilterBar` instance (itself holding one `Filter — icon` trigger + 3 demo
`Filter`s), and a `ScrollableArea` instance (its `content` Slot empty in the
reference) inside a `Stack (column, gap=xl)` wrapper frame — see the gap
note above for why React uses 16px, not 20px.
