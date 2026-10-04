# Badge

A small status/label pill - subtle tinted fill, bold label, optional leading
icon. Semantic `tone`, not colour. For a fixed severity scale (low / attention /
warning / critical) use `SeverityBadge`, which composes this. See
[architecture.md](../architecture.md).

## API

```tsx
<Badge tone="neutral|brand|success|warning|danger" size="xs|sm|md|lg" icon="default|hasIcon" leadingIcon={<Icon/>} asChild>
  In transit
</Badge>
```

| prop | values | default | Figma |
|---|---|---|---|
| `tone` | `neutral` `brand` `success` `warning` `warning-strong` `danger` | `neutral` | variant `tone` |
| `size` | `xs` `sm` `md` `lg` | `md` | variant `size` |
| `icon` | `default` · `hasIcon` | `default` | variant `icon` |
| `leadingIcon` | `ReactNode` - glyph when `icon="hasIcon"` | - | icon instance on `hasIcon` |
| `asChild` | `boolean` | `false` | - |

`className`, `style`, `...spanProps` pass through to the root. No border, no
elevation, no interaction states - a badge is presentational.

## Anatomy

Root `<span>`, `display: inline-flex`, `vertical-align: middle` (badges sit in
running text and table cells). Optional icon box, then the label. Hug in both
axes.

## Appearance

**Every badge is a pill** (owner, 2026-09-28): `radius/badge/<size>` →
`radius/full` at every size, so status never reads as a button. `md` and `lg`
get extra horizontal padding (+4 and +6 - the space scale has no 14) since a
pill needs about half its height at the sides; `xs` and `sm` keep their
original padding (the extra read too wide at those sizes). Heights are
unchanged. `icon="hasIcon"` no longer changes the shape (it used to give
the left side a 32 radius); the prop remains until the Figma master drops it.

| `size` | label style | padding (vertical / horizontal) | gap | radius | icon | height |
|---|---|---|---|---|---|---|
| `xs` | `text/label/xs` - 12 / bold / **wide tracking** | `space/4` / `space/6` | `space/4` (4) | pill | 12 (1em) | ~22 |
| `sm` | `text/label/sm` - 13 / bold | `space/6` / `space/6` | `space/4` (4) | pill | 13 (1em) | ~27 |
| `md` | `text/label/md` - 14 / bold | `space/8` / `space/12` | `space/6` (6) | pill | 14 (1em) | ~32 |
| `lg` | `text/label/lg` - 16 / bold | `space/10` / `space/16` | `space/6` (6) | pill | 16 (1em) | ~37 |

`xs` is the odd size out because it composes `text/label/xs` specifically: it's the only size where the CSS
overrides `letter-spacing` in addition to `font-size` - `label/xs` is uniquely
`wide`-tracked in this system's type scale; `sm`/`md`/`lg` are all `normal`, so
they get away with a font-size-only override against the shared base rule.
`xs` also doesn't get its own radius token - it reuses `radius/badge/sm`
(now a pill like the rest), as Figma bound it.

Per **`tone`** (each pair is a component token → semantic `-subtle` / status text):

| `tone` | `--color-badge-<tone>-background` | `--color-badge-<tone>-text` |
|---|---|---|
| `neutral` | `background.subtle` - zinc 100 | `text.subtle` - zinc 500 |
| `brand` | `background.brand-subtle` - indigo 100 | `text.brand` - indigo 700 |
| `success` | `background.success-subtle` - green 100 | `text.success` - green 700 |
| `warning` | `background.warning-subtle` - amber 100 | `color.amber.600` - amber 600 (one step lighter than `text.warning`, to separate from `warning-strong`) |
| `warning-strong` | `background.warning-strong-subtle` - orange 100 | `text.warning-strong` - orange 700 |
| `danger` | `background.danger-subtle` - red 100 | `text.danger` - red 700 |

Icon colour = `currentColor` (the tone's text colour). The icon box is `1em`
square - same as the label font-size (12 / 13 / 14 / 16 for `xs`/`sm`/`md`/`lg`).

### Height is stable with or without an icon

`text/label/*` runs at line-height `tight` (1.15), so the label box (~14 / 15 /
16 / 18px) is *larger* than the `1em` icon. Toggling the icon changes the badge
**width only** - never the height. The badge stays hug in both axes; heights land
around xs 22 / sm 27 / md 32 / lg 38. Figma and CSS match (both use the token
line-height; no trim, no hardcoded value).

## Figma build

- Component set **`Badge`** - variant props `tone` (6, including `warning-strong`)
  × `size` (4: `xs`/`sm`/`md`/`lg`) × `icon` (`default` / `hasIcon`) = 48 variants.
- `icon="hasIcon"` shows the leading icon instance. Since 2026-09-28 every badge
  is a pill, so this variant no longer changes the corners - the Figma master
  should drop the separate left radius (and can merge the two variants).
- Auto-layout HORIZONTAL, hug × hug, centre align. Fill → `color/badge/<tone>/background`,
  radius → size (or asymmetric for `hasIcon`), label style `text/label/<size>` + colour
  `color/badge/<tone>/text`, icon vector fill → `color/badge/<tone>/text`.
- No stroke, no effects.
- **Naming collision in the file**: at least one other, unrelated component is
  also named "Badge" (id `4234:7995`, a `Color`-only variant set with no
  `tone`/`size` - not this component). Any `findOne`/by-name lookup for
  "Badge" can silently grab the wrong one; the real one used here is
  `10036:11182`. Same issue exists for "Row" - see its doc.

## a11y

Presentational `<span>`, no role. When the badge is the only signal of a live
status (not restated in nearby text), the consumer adds `aria-label` or a
visually-hidden prefix. Decorative icon only - no `alt`.
