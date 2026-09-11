# EntitySummary

A clickable entity icon (→ that entity's own page) + heading/description +
a trailing count `Badge`, on a brand-tinted background. **L2.** Extracted
from `RigProblemDetail`, where it appeared 3× identically — one per
truck/trailer/driver column.

```tsx
<EntitySummary
  icon={<TruckIcon />}
  iconLabel="Open truck WI 2418LN"
  onIconClick={() => navigate(`/trucks/${truckId}`)}
  heading="Truck"
  description="WI 2418LN"
  count="4 issues left"
/>
```

| prop | type | notes |
|---|---|---|
| `icon` | `ReactNode` — required | rendered in a primary `IconButton` |
| `iconLabel` | `string` — required | accessible name for the icon trigger |
| `onIconClick` | `MouseEventHandler` | wire to navigation |
| `heading` | `ReactNode` — required | |
| `description` | `ReactNode` — required | e.g. a plate/unit number, or a surname |
| `count` | `ReactNode` — required | rendered in a `Badge` (`tone="brand"`, `size="xs"`) |

One fixed size — no `size` prop, matching the Figma component (also
single-size, no variants).

## Why not `Row`

Visually close ([leading] [heading+description] [trailing]) but three
deliberate differences ruled out reusing `Row`:

- **The leading icon is interactive here.** `Row.leading` is locked to a
  decorative `IconCell` on purpose (`Row.md`'s own rule: "a generic slot
  would be the wrong tool" for something that's always exactly one type).
  `EntitySummary`'s icon is a real `IconButton` that navigates — the
  opposite requirement.
- **Always filled.** `Row` never has a background by default (rows in a
  scroll track stay transparent); `EntitySummary` is always
  `color.background.brand-subtle`.
- **Trailing is always exactly one count `Badge`**, not `Row`'s flexible
  `status`/`action` pair.

## A note on how this got found

The icon was first (wrongly) "fixed" from `IconButton` to `IconCell` on the
assumption it was decorative — it isn't; it's a real link to that truck's/
trailer's/driver's own page. Reverted, then this component was extracted
once it was clear the *button* itself was correct and the pattern (icon +
text + count, 3× identical) was what actually needed a name.

## Figma

**`EntitySummary`** (`10264:19623`) — single component, no variants. `title`
(the `IconButton` + heading/description stack) + a trailing `count` (renamed
from the generic `Badge` instance name). Background `color/background/brand-subtle`,
radius `radius/lg` (8px). The 3 `RigProblemDetail` columns each hold a real
instance of this component now (not copy-pasted frames) with the icon glyph
swapped and heading/description/count overridden per column.
