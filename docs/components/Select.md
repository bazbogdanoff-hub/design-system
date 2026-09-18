# Select

A single-choice dropdown — "an input with a caret that opens options to
choose." **L2, React only** — a composition of `Menu` + `MenuRow` with an
`Input`-styled trigger; no Figma component (see below for why).

```tsx
<Select
  aria-label="Fruit"
  options={[
    { value: 'apple', label: 'Apple' },
    { value: 'cherry', label: 'Cherry' },
  ]}
  value={value}
  onChange={setValue}
/>
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` \| `md` \| `lg` | `md` | same scale, same visual chrome, as `Input` |
| `options` | `SelectOption[]` — required | | `{ value, label, icon? }` |
| `value` | `string` | — | the selected option's `value`; omit for no selection |
| `onChange` | `(value: string) => void` | — | |
| `placeholder` | `ReactNode` | `'Select…'` | shown when nothing is selected |
| `disabled` | `boolean` | — | |
| `aria-label` / `aria-labelledby` | `string` | — | one is required — the trigger is an unlabeled `<button>` otherwise |

## Why this is a real component, not a modified `Input`

A native `<input>` can't drive a dropdown of choices — there's no HTML
primitive for "type-safe single choice with a custom-rendered menu" the way
there is for icons/affixes on a text field. Building this as an `Input` that
merely *looks* clickable would ship a half-finished control (nothing would
happen on click). So `Select` is a real trigger `<button>` + `Menu` + mapped
`MenuRow`s — functional, not a lookalike.

## Reusing `Input`'s CSS directly

The trigger imports `Input.module.css` and applies its `.field`/`.input`/
`.icon` classes as-is (`import inputStyles from '../Input/Input.module.css'`)
— same cross-component CSS reuse `IconButton` already does with
`Button.module.css` — rather than re-declaring border/radius/height/hover
states. This makes the trigger pixel-identical to a real `Input` at rest for
free, and keeps the two in sync automatically if `Input`'s chrome ever
changes. One local addition: a `:focus` rule, since here the trigger button
*is* the focused element directly, where `Input`'s `.field` reacts to a
focused **child** via `:focus-within`.

## No Figma component

Scoped down deliberately, the same reasoning applied to the calendar-input
pattern (see [Input.md](./Input.md)): a functioning `Select` is a real
`Input` trigger + the already-built `Menu`/`MenuRow` set, composed — Figma
already has every visual piece it needs (`Input`'s `trailingIcon` slot with
a caret glyph, `Menu`'s `default` shell, `MenuRow`) to represent this at rest
as a static reference, with nothing new to draw. Only the React composition
(the actual open/close/select behavior) is new.
