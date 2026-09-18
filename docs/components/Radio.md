# Radio

A circle for choosing exactly one of several options. **L1** — Figma +
React, React ported this session.

```tsx
<Radio name="plan" aria-label="Free" defaultChecked />
<Radio name="plan" aria-label="Pro" />
<Radio name="plan" aria-label="Locked" disabled />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (16px) · `md` (20px) · `lg` (24px) | `md` | same box scale as `Checkbox` |
| `checked` / `defaultChecked` / `onChange` | native `<input>` props | — | controlled or uncontrolled |
| `disabled` | `boolean` | — | |

Every other native `<input>` prop passes through, including `name` — that's
how grouping works (see below). `aria-label` or `aria-labelledby` is
required, same union `Checkbox`/`Switch`/`IconButton`/`ProgressBar`/`Slider`
use.

## A real `<input type="radio">`, grouped the plain HTML way

Same "native input under a decorative span" split `Checkbox` uses, and for
the same reason: keyboard/click/focus/label-association for free. Radio
grouping — only one of a set can be checked — is the browser's own
same-`name` behavior, not a `RadioGroup` component. This system has no
`CheckboxGroup` either; a group is just several `Radio`s sharing one `name`.

## Never solid-fills, in any state — the real, deliberate restraint

Unlike `Checkbox`, which fills solid brand color when checked, `Radio` keeps
one flat white background (`color.radio.background`) at rest, hover,
checked, and disabled alike. Confirmed via the Figma reference's read-back:
the checked+default variant's fill binds the *exact same*
`color/radio/background` variable as the unchecked variant — not a
coincidence of similar colors, the literal same token. Checked state is
signaled two other ways instead: the border recolors
(`color.radio.border.on` → brand.600, `.on-hover` → brand.700) and an inner
dot appears (`color.radio.dot.on`, exactly half the box's diameter at every
size). Don't "fix" this into filling solid the way `Checkbox` does — it's a
deliberate, confirmed decision from the component's own Figma reference, not
an oversight.

## Sizes

| size | box | border | dot |
|---|---|---|---|
| `sm` | 16×16 | 1.5px | 8×8 |
| `md` | 20×20 | 1.5px | 10×10 |
| `lg` | 24×24 | 1.5px | 12×12 |

`radius.radio` (new token, see below) keeps every size fully circular.

## New token: `radius.radio`

`tokens/component.layout.json` had `radius.switch` and `radius.checkbox`
already, but no `radius.radio` — never scaffolded when Radio's other
component-color tokens were added earlier in the project. Added it now
(`→ radius.full`), confirmed circular via the Figma master
(`cornerRadius: 9999` on all 18 variants) — same shape/description pattern
as the pre-existing `radius.switch` entry.

## Figma

**`Radio`** (`10222:14006`) — 18 variants: `size`(sm/md/lg) ×
`checked`(checked/unchecked) × `state`(default/hover/disabled). Same
frame+centered-child anatomy as `Checkbox` but circular, with the plain
white background retained in every state described above.
