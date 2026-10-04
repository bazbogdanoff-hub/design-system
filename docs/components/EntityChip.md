# EntityChip

One related entity, compressed to a chip: its icon at rest, its identity on
hover. Built for a heading row - a rig's truck, trailer and driver beside its
name - where three full labels would out-weigh the heading they belong to,
but three anonymous icons would say nothing. **L2 pattern.**

Figma: `EntityChip` (`10772:10486`).

```tsx
<EntityChip icon={<TruckIcon weight="fill" />} label="TK-001" onClick={open} />
<EntityChip icon={<UserIcon weight="fill" />} label="Wójcik" onClick={open} />
```

| prop | values | default |
|---|---|---|
| `icon` | `ReactNode` - the glyph standing for the thing | required |
| `label` | `string` - which one it is: a fleet code, a surname | required |
| `open` | `boolean` - keep the label showing regardless of hover | `false` |
| `asChild` | `boolean` - render as the child element, e.g. an `<a>` | `false` |

Renders a `<button>` when given `onClick`, a `<span>` otherwise, and whatever
you pass under `asChild`.

## Why this isn't a Badge

It wears Badge's glass - the same `badge/neutral/glow` radial fill, the same
inset shadow, the same `badge/neutral/text`, the same `label/xs` type and the
same 4/6 padding as Badge `xs`. It still can't be one, because it breaks two
of Badge's rules on purpose:

- **Badge is presentational** - "no border, no elevation, no interaction
  states", in its own doc comment. This component is interactive by
  definition: its label only exists on hover.
- **Badge capsules its left corners** (32px, `radius-5xl`) whenever
  `icon="hasIcon"`. This keeps a uniform 6px radius all round, because an
  icon-only chip with one round end reads as a fragment of a pill rather than
  a square.

Adding a "square icon, interactive" mode to Badge would mean a presentational
primitive growing hover states for one caller. Separate component.

## Geometry

| state | width | made of |
|---|---|---|
| rest | 26px | 6 + icon 14 + 6 |
| revealed | 43px | 6 + icon 14 + gap 4 + label + 6 |

Height is 24px in both - the tight `label/md` line-height holds the box steady
whether or not the label is showing. **The chip widens on reveal**, so a row of
them reflows as you move across it. That is the Figma behaviour; if it reads
as jitter in place, `open` pins the label instead.

The 4px gap lives *inside* the collapsing column, not as the flex `gap` - a
`gap` would leave 4px of air beside a lone icon and break the 26px rest width.

## Accessibility

The label is **always in the DOM**. It is the chip's accessible name, not
decoration, and it is clipped to zero width by a `0fr` grid column rather than
hidden - `display: none` would take it away from screen readers too, leaving
an unlabelled control.

- Revealed on `:hover` **and** `:focus` - any focus, not just `:focus-visible`,
  so a click opens it too. The focus *ring* stays on `:focus-visible`, so a
  mouse click reveals the label without drawing an outline.
- Under `@media (hover: none)` the label shows permanently. A coarse pointer
  has no hover state, and an identity that can never be read on a phone is
  worse than a slightly wider chip.
- The transition is dropped under `prefers-reduced-motion: reduce`.
- The icon is `aria-hidden` - it duplicates the label.

## Related

- `Badge` - the presentational pill this borrows its surface from.
- `IconCell` - a static icon tile, when there is no identity to reveal.
- `Tag` - categorical colour, no interaction.
