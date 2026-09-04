# FilterBar

A header row for cards/tables that need filtering: a fixed funnel trigger
(`FilterIcon`) plus a slot for as many `Filter`s as the header needs. **L2
pattern** — composes `Stack` (`direction="row" gap="md" align="center"`) +
`FilterIcon`.

```tsx
<FilterBar filterIconLabel="Advanced filters" onFilterIconClick={openAdvancedFilters}>
  <Filter showCaret>All types</Filter>
  <Filter showCaret>All entities</Filter>
  <Filter leadingIcon={<CalendarIcon/>} showCaret>Today</Filter>
</FilterBar>
```

| prop | values | default |
|---|---|---|
| `children` | `Filter` instances (any number) — required | — |
| `filterIconLabel` | accessible name for the funnel trigger | `"Advanced filters"` |
| `onFilterIconClick` | click handler for the funnel trigger | — |

Everything else is `StackProps` (minus `direction`/`gap`/`align`, which are
fixed) passed straight through.

## Figma

**`FilterBar`** (renamed from the owner's `Filterholder`) — a single
component, no variants: a `Filter — icon` trigger + a real Figma **SLOT**
(named `filters`) holding N example `Filter` instances. Both the holder's and
the slot's `itemSpacing` bind to the same `space/12` token — matches
`Stack gap="md"` exactly, which is why the React side is a flat
`<Stack>{icon}{children}</Stack>` rather than mirroring Figma's nested
slot-frame: the extra nesting there is a Figma slot-authoring necessity, not
a visual distinction (both gaps are identical), so it doesn't need a matching
DOM level in code.

## a11y

The funnel trigger is a real `<button>` with a required accessible name
(`filterIconLabel`, forwarded to `FilterIcon`'s `aria-label`).
