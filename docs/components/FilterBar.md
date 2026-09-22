# FilterBar

A header row for cards/tables that need filtering: an **optional** add-filter
trigger (`FilterIcon`) plus any number of `Filter`s. Everything sits in **one
wrapping row** and stays aligned as it wraps. **L2 pattern** — composes a
single `Stack` (`direction="row" gap="md" align="center" wrap`).

```tsx
<FilterBar addFilterLabel="Add filter" onAddFilter={openFilterMenu}>
  <Filter showCaret>All types</Filter>
  <Filter showCaret>All entities</Filter>
  <Filter leadingIcon={<CalendarIcon/>} showCaret>Today</Filter>
</FilterBar>
```

| prop | values | default |
|---|---|---|
| `children` | `Filter` instances — any number, **including none** | — |
| `size` | `sm` (28px) · `md` (32px) — applied to the leading `FilterIcon`; match your `Filter`s | `md` |
| `onAddFilter` | click handler for the add-filter trigger. **Its presence renders the trigger** | — |
| `addFilterLabel` | accessible name for the trigger | `"Add filter"` |
| `addFilterMenuOpen` | reflects a future menu's open state onto the trigger (keeps it showing "+") | — |

Everything else is `StackProps` (minus `direction`/`gap`/`align`/`wrap`,
which are fixed) passed straight through.

## The trigger is no longer always present

The old rule — a funnel icon fixed as the mandatory first element — was
**dropped**. Now:

- **Pass `onAddFilter`** → the trigger renders (as the first item in the same
  wrapping row as the `Filter`s, not a pinned sibling). Omit it → no trigger.
- **No trigger and no `Filter`s** → `FilterBar` renders `null`. A header with
  nothing to filter and nothing to add doesn't need the component at all.

The trigger itself (`FilterIcon`) shows a **funnel at rest** and a **"+" on
hover / press / while its menu is open** — its job is *adding* a filter (a
future context menu of every available filter with show/hide checkboxes), not
filtering directly. See [FilterIcon.md](./FilterIcon.md).

## Alignment / wrap

One flex row: `align-items: center`, `flex-wrap: wrap`, `gap` and row-gap
both `space/12` (`gap="md"`). Trigger and `Filter`s are the same height, so
they stay aligned; when the row wraps in a narrow header everything reflows
together (no pinned element to fight the wrap).

## Figma

**`FilterBar`** (renamed from the owner's `Filterholder`) — one component, no
variants. The `filters` **SLOT** is `layoutWrap: WRAP` with `space/12` on
both axes and center-aligns its children; the `Filter — icon` instance now
lives **inside** that slot as its first child (previously a pinned sibling of
the slot) — which is what lets it wrap and align with the `Filter`s instead
of anchoring separately. React mirrors this as one flat
`<Stack row wrap>{trigger}{children}</Stack>`.

## a11y

The trigger is a real `<button>` with a required accessible name
(`addFilterLabel` → `FilterIcon`'s `aria-label`); `addFilterMenuOpen` maps to
`aria-expanded`.
