# IconCell

A static badge-shaped cell — same box/radius grading as `IconButton`'s
primary variant, but non-interactive (no hover/active states). Holds either
a single icon or short text, usually a number (a queue position like
`#5`). **L1 primitive.**

```tsx
<IconCell size="sm" tone="neutral" icon={<CircleDashedIcon />} />
<IconCell size="sm" tone="neutral">#5</IconCell>
```

| prop | values | default |
|---|---|---|
| `size` | `sm` (28px) · `md` (32px) · `lg` (36px) · `xl` (40px) · `2xl` (44px) | `sm` |
| `tone` | `neutral` · `brand` · `success` · `warning` · `danger` | `neutral` |
| `icon` | `ReactNode` — mutually exclusive with `children` | — |
| `children` | `ReactNode` — mutually exclusive with `icon` | — |

Exactly one of `icon` / `children` is required — matches the Figma
component's `content: icon \| text` variant, where a cell is never both at
once.

## Sizing — borrowed from IconButton, not duplicated

Box size and corner radius at every step are identical to `IconButton`'s
primary variant (`sm` 28px/`radius.button.sm` … `2xl` 44px/`radius.button.2xl`)
— verified directly against it before building, not from memory. Icon size
(14/16/18/20/20) and the text size used when holding a number
(12/13/14/15/16, via the existing `text/label/xs…xl` styles) are two
*different* scales, since a cell holds one or the other, never both — each
is set explicitly per step rather than reusing one `font-size` for both the
way `IconButton` can (it only ever shows an icon).

## Color — Badge's tone pairing, not IconButton's

Each tone binds to the same `color/badge/<tone>/{background,text}` pair
`Badge` itself uses (`color.badge.neutral.background` etc.) — not
`IconButton` primary's solid brand fill. This reads as a badge (a light
tinted chip), matching the reference `#5` example, not a button. `neutral`
is the default, matching `Badge`'s own default tone name — the Figma
component briefly had this tone named `Default` (capitalized, a different
word than every other tone in the system); renamed to `neutral` before this
port for consistency.

## Not built yet

No `asChild`/polymorphic-root support — this is presentational content
inside another component (e.g. `TaskCard`'s queue-position cell), not
something rendered as an interactive element or a link. Add it if a real
use case needs the cell itself to be clickable — that would also mean
reconsidering "no hover/active states" as a requirement.
