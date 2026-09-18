# Textarea

A multi-line text field. **L1** — Figma + React, both built this session.

```tsx
<Textarea placeholder="Add a note…" />
<Textarea size="lg" rows={4} />
<Textarea error defaultValue="bad value" />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (72px) · `md` (80px) · `lg` (88px) | `md` | exactly 2x `Input`'s own height at each step — a starting height, not a cap (still grows with `rows` or manual resize) |
| `error` | `boolean` | — | reddens the border, sets `aria-invalid` |

Every other native `<textarea>` prop passes through (native `size`, the
character-width attribute, is not what our `size` means here — same carve-out
`Input` makes).

## Why this isn't "`Input` with a taller box"

`Textarea` reuses `Input`'s own tokens (`color.input.*`, `radius.input`) but
not its wrapper-owns-chrome structure. `Input` needs a wrapper span because it
has icon/affix slots that must sit *inside* the same bordered box as the
native element. A notes-style field doesn't gain anything from a leading/
trailing icon, so `Textarea` skips the wrapper entirely and styles the native
`<textarea>` directly — the simpler of the two, no abstraction beyond what's
needed. Vertically resizable by default (`resize: vertical`), matching the
native element's own convention.

## Sizing — a direct 2x derivation, not a new scale

`size.textarea.{sm,md,lg}` = 72/80/88px, each exactly double `size.input`'s
own 36/40/44px. Not part of the token-to-Figma color/radius pipeline (`size.*`
tokens aren't synced there at all — Figma component heights are plain
unbound numbers, confirmed by checking `tokens-to-figma.mjs`'s allow-list),
so the Figma side's heights are set as literal numbers matching the same
72/80/88 values, not bound variables.

## Figma

`Textarea` (`10315:21846`) — 15 variants: `size`(sm/md/lg) × `state`(default/
hover/focus/error/disabled), same state set as `Input`. Built in 3 separate
per-size batches after a single combined build (15 variants × ~7 bind calls
each) timed out the bridge at 120s — each batch is its own small script,
templated via `sed` substitution rather than hand-duplicated.
