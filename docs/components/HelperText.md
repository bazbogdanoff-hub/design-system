# HelperText

A fixed icon + message row — the piece `FormField` shows below its control in
a non-default state. **L1.**

```tsx
<HelperText tone="primary">This key is only shown once — copy it now.</HelperText>
<HelperText tone="error" size="sm">Enter a valid email address.</HelperText>
```

| prop | values | default |
|---|---|---|
| `tone` | `primary` (informational, brand) · `error` (validation failure, danger) — required | — |
| `size` | `sm` · `md` (default) · `lg` — matches the `Input`/`FormField` it sits under | `md` |
| `children` | the message | — |

## Not the other Tooltip

This is **not** the hover-triggered popover component named `Tooltip` on the
roadmap (a generic component-doesn't-exist-yet floating hint). Naming it
`Tooltip` would collide with that later — `HelperText` is the standard term
for exactly this pattern (Chakra's `FormHelperText`, MUI's `helperText`): a
persistent, non-interactive row under a form control, not something that
appears on hover. If you did mean a real hover tooltip, that's a distinct,
not-yet-built component.

## Icon is fixed per tone, not a prop

Same rule as `SeverityBadge`: no free icon. `primary` → `InfoIcon`, `error` →
`WarningIcon` (both bundled, `fill-rule: evenodd` punch-through glyphs, same
technique as `SeverityIcon`'s triangle). Icon and message are **always the
same tone color** — a red message next to a gray icon reads as inconsistent,
so both bind to the matching `color.helperText.*` token.

`error` also sets `role="alert"` on the row so assistive tech announces it
when it appears; `primary` doesn't (it's not urgent).

## Sizing

Icon size mirrors `Input`'s own leading/trailing icon scale exactly (14 / 16
/ 18px) since `HelperText` sits directly under an `Input` of the same size —
message text uses `text/body/{size}`, same scale `Input`'s value text uses.

## Figma

**`HelperText`** (`10264:18161`) — 6 variants, `size` × `tone`. Reuses the
file's own `Info`/`Warning` icon sets (`Format=Outline, Weight=Bold`, same
style as every other icon in the file) rather than a one-off glyph. Left the
pre-existing `Info message` component (`4205:6290`) untouched — it's a
different, bigger thing (12 variants: 3 tones × 2 sizes × icon position) —
that's the future `Alert`/`Callout` precursor, not this.
