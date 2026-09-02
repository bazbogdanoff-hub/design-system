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
| `padding` | `none` `sm` `md` `lg` | `md` | `padding` | all-sides: 0 / 16 / 20 / 24 (`space/16‑24`) |
| `elevation` | `raised` `flat` | `raised` | `elevation` | `raised` = glass inner-shadow + border; `flat` = border only |
| `interactive` | `boolean` | `false` | `interactive` (bool) | hover bg + `cursor: pointer`; consumer provides the interaction semantics |
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

- Component set **`Card`**. Variant props: `padding` (`none|sm|md|lg`),
  `elevation` (`raised|flat`); boolean prop `interactive`.
- **One `SLOT`** for content. No `Card Section`, no `Show header/footer`,
  no `Slot count` — drop all of those. Keep a docs board with example fills.
- Base: fill `color/card/background/default`, radius `radius/card`, 1px stroke
  `color/card/border`, effect = your `INNER_SHADOW` on `elevation=raised` only.
- Auto-layout VERTICAL, gap 0, padding per the `padding` variant.

## Full-bleed footers / dividers

Not `Card`'s job. When a specific card type needs an edge-to-edge muted footer or
internal divider, that component (usually app-level / L3) handles the negative
margin once, internally. A `<Divider bleed>` primitive may be added later if the
need is broad — not before.

## a11y

Plain `<div>`. When `interactive`, the consumer supplies semantics (`asChild` +
`<a>`/`<button>`, or `role`/`tabIndex`/key handlers). The component only provides
the hover affordance.
