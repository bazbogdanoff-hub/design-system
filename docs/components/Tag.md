# Tag

A plain colored, uppercase, bold label — no background, no padding. The
"category eyebrow" pattern (a module/type tag sitting above a title, e.g.
`MAINTENANCE`), not a filled chip. **L1 primitive.** Name is provisional —
flag if you want something else.

```tsx
<Tag color="rose">Fuel cost</Tag>
<Tag size="sm" color="emerald">Maintenance</Tag>
```

| prop | values | default |
|---|---|---|
| `size` | `xs` (12px, default) · `sm` (13px) · `md` (14px) · `lg` (15px) · `xl` (16px) — mirrors `text/label/*`'s scale | `xs` |
| `color` | one of the 10 validated `color.category.*` hues: `brand` · `teal` · `rose` · `lime` · `fuchsia` · `cyan` · `pink` · `violet` · `emerald` · `blue` | `brand` |

## Not a Badge

`Badge` stays exactly as it is — non-uppercase, reserved for the fixed
status vocabulary (`neutral`/`brand`/`success`/`warning`/`danger`), with its
own tinted-chip background. `Tag` is a different job: an open-ended,
consumer-assigned category/module identity, uppercase, text-only. They
happen to share a visual family (small bold label) but aren't variants of
the same component — conflating them would mean either uppercasing every
existing `Badge` (unintended, breaking change) or giving `Badge` a second,
incompatible tone vocabulary.

## Typography — reuses tokens, doesn't duplicate them

In Figma, `text/badge-label/xs…xl` exist as genuine duplicate text styles of
`text/label/xs…xl` (same size/weight/line-height/letter-spacing, only
`textCase` differs) — required there because a Figma text style is a sealed
bundle; you can't apply `label` and separately add uppercase. In code,
`Tag` needs none of that duplication: it reuses the existing
`--text-label-*` CSS variables directly and layers `text-transform:
uppercase` on top, since CSS properties compose freely. Same visual result,
no parallel token family to keep in sync.

## `color.category.*` — text-only for now

Every `color` value binds to `color.category.<name>.text` — there's no
`.background` counterpart yet (planned separately, for filled uses like
settings-page cells). If that pairing ships later, `Tag` itself likely
doesn't change — a filled chip built on it would be a different component
(or a `Badge`-like variant), since `Tag`'s whole identity here is "plain
text, no chip."

## Color order matters if you automate assignment

The 10 `category` colors were validated as **adjacent-safe**, not
all-pairs-safe — see `tokens/semantic.color.json`'s own description for the
validated order (`brand, teal, rose, lime, fuchsia, cyan, pink, violet,
emerald, blue`) and exactly which pairs were rejected. A human manually
picking a `color` for one `Tag` at a time has no risk. Something that
auto-assigns colors round-robin (a "next category color" picker, an
auto-tagger) **must** cycle through them in that exact order to preserve
the distinctness guarantee — picking alphabetically or by insertion order
elsewhere can reintroduce a rejected adjacent pair.
