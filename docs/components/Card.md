# Card

A surface that groups related content. A padded box — nothing more. Sections,
dividers, footers, headers are the **consumer's composition**, or belong to a
specific card type built on top of `Card` (see [architecture.md](../architecture.md)).

## API

```tsx
<Card padding="none|sm|md|lg" elevation="raised|flat" interactive asChild>
  {children}
</Card>
```

| prop | values | default | Figma variant | notes |
|---|---|---|---|---|
| `padding` | `none` `sm` `md` `lg` | `md` | `padding` | all-sides: 0 / **12** / **16** / **20** (`space/12` · `space/16` · `space/20`) |
| `elevation` | `raised` `flat` | `raised` | `elevation` | `raised` = glass inner-shadow + border; `flat` = border only |
| `interactive` | `boolean` | `false` | **code-only, not a Figma variant** | hover bg + `cursor: pointer`; consumer provides the interaction semantics |
| `asChild` | `boolean` | `false` | — | render as another element (`<a>`, router `<Link>`) |

`className`, `style`, `...divProps` pass through to the root.

## Tokens

| target | token / value |
|---|---|
| fill | `color/card/background/default` → `color/surface/card` (`#fcfcfc`) |
| fill, interactive hover | `color/card/background/hover` → `color/surface/subtle` |
| border | `color/card/border` → `color/border/default`, 1px |
| radius | `radius/card` → `radius/container` (16) |
| **glass effect** | `box-shadow: inset 4px 4px 16px #f0f0f0` — **not a token**, from the Figma `INNER_SHADOW`; `flat` drops it |
| padding | `space/16` · `space/20` · `space/24` |

## Figma build

- Component set **`Card`**. Variant properties: `padding` (`none|sm|md|lg`) ·
  `elevation` (`raised|flat`). **8 variants** (4 × 2) in a 4-col × 2-row grid.
  Do **not** add `interactive` as a variant — it's a code-only prop; show a
  hover example on a docs board instead.
- **One `SLOT`** for content. No `Card Section`, no `Show header/footer`,
  no `Slot count` — drop all of those.
- Base variant: **width 320**, height **hug** (auto-layout VERTICAL, gap 0,
  padding from the variant). Fill the slot with a placeholder — a subheading +
  2 body lines + a Button instance — so each variant renders ~150–180px tall
  and the padding differences read clearly.
- Effect = your existing `INNER_SHADOW` (#f0f0f0, offset 4/4, blur 16) — on the
  `raised` variants only; `flat` has none.

### Colour bindings (per layer)

| Figma layer | bind to (Component collection) | resolves to |
|---|---|---|
| Card frame **fill** | `color/card/background/default` | `color/surface/card` → `#fcfcfc` |
| Card frame **stroke** (1px) | `color/card/border` | `color/border/default` → zinc.200 |
| Card frame **corner radius** | `radius/card` | `radius/container` → 16 |
| inner-shadow effect colour | **leave raw `#f0f0f0`** — effects aren't tokenised | — |
| (docs board only) hover fill | `color/card/background/hover` | `color/surface/subtle` → zinc.50 |

No layer inside `Card` binds to a semantic token directly — always the
`color/card/*` component tokens, so the whole card retints from one place.

## Full-bleed footers / dividers

Not `Card`'s job. When a specific card type needs an edge-to-edge muted footer or
internal divider, that component (usually app-level / L3) handles the negative
margin once, internally. A `<Divider bleed>` primitive may be added later if the
need is broad — not before.

## a11y

Plain `<div>`. When `interactive`, the consumer supplies semantics (`asChild` +
`<a>`/`<button>`, or `role`/`tabIndex`/key handlers). The component only provides
the hover affordance.
