# Checkbox

A rounded-square box for a single boolean or three-state (indeterminate)
selection. **L1** — Figma is the adopted legacy-kit component (see
`CHANGELOG-renames.md`, 2026-09-13), React ported this session.

```tsx
<Checkbox aria-label="Select row" />
<Checkbox aria-label="Select all" indeterminate />
<Checkbox aria-label="Terms accepted" defaultChecked />
<Checkbox aria-label="Locked" disabled defaultChecked />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (16px) · `md` (20px) · `lg` (24px) | `md` | |
| `checked` / `defaultChecked` / `onChange` | native `<input>` props | — | controlled or uncontrolled |
| `indeterminate` | `boolean` | — | a visual third state, layered on top of `checked` — see below |
| `disabled` | `boolean` | — | |

Every other native `<input>` prop passes through. `aria-label` or
`aria-labelledby` is required — same union `Switch`/`Radio`/`IconButton`/
`ProgressBar`/`Slider` use, since the box alone has no visible text.

## A real `<input type="checkbox">` under a decorative span

Same reason `Radio` wraps a real `<input type="radio">`: native
keyboard/click/focus/label-association behavior for free, instead of
re-implementing `role="checkbox"` ARIA by hand. The input is visually hidden
(`opacity: 0`, stretched over the whole box, not `display: none` — still
focusable) and a `<span>` underneath renders the visible chrome, reacting to
the real input's `:hover`/`:focus-visible`/`:disabled` via the sibling
combinator (`.input:hover + .box`). The decorative span is
`pointer-events: none` so every click still lands on the real input beneath
it — the same "input drives it, a plain span shows it" split `Slider`'s
track/fill uses.

## `indeterminate` is not a JSX attribute

React (and the DOM) has no `indeterminate` prop on `<input>` — it only
exists as an imperative property (`inputEl.indeterminate = true`), set here
via a ref inside a `useEffect` that re-runs whenever the prop changes.
Consumers never touch a ref for it themselves. Figma has no
`checked=true, indeterminate=true` variant (a real checkbox can't be both
facts at once); this component doesn't render one either — `indeterminate`
wins over `checked` in the glyph shown when both happen to be passed.

## Checked and indeterminate share one filled, borderless box

Confirmed via the Figma reference's read-back: `checked=true` and
`indeterminate=true` both bind the exact same `color/checkbox/background/on`
variable, with no border in either case (`strokes: []`). Only the glyph
differs — a checkmark vs. a dash, both thin wrappers around the real
`@phosphor-icons/react` `Check`/`Minus` (Bold weight). One caveat unique to
this component: Figma's own master doesn't use real Phosphor instances for
these glyphs either — they're legacy hand-drawn vectors
(`_FormControlCheck`/`_FormControlMinus`) inherited from the adopted kit —
so there's no live Figma reference to verify pixel-parity against, unlike
every other icon in the system. The genuine Phosphor icons were used anyway,
since the goal is the real library, not matching a non-Phosphor Figma source.

## Disabled uses a muted gray glyph, never white

New component token **`color.checkbox.icon.{default,disabled}`** — this was
a flat `checkbox.icon` leaf (`{color.white}` only) before this port; split
into a group so a disabled checked/indeterminate box can use
`color.text.disabled` for its glyph instead of white. A white checkmark on
the pale gray `color.checkbox.background.disabled` fill would be nearly
invisible — the same restraint `radio.dot.disabled` already applies for
`Radio`'s own dot.

**Fixed 2026-09-13:** the Figma↔code drift noted above (Figma still
white-on-disabled while code used `color.text.disabled`) is resolved — the
master's 6 disabled+checked/indeterminate glyph vectors are now bound to the
new `color/checkbox/icon/disabled` variable, and the other 18 glyph-bearing
variants to `color/checkbox/icon/default`. The old flat `color/checkbox/icon`
variable was deleted (nothing referenced it anymore). Figma and code now
render identically at every state.

## Figma

**`Checkbox`** (`4182:3616`) — 36 variants: `size`(sm/md/lg, 16/20/24px) ×
`checked`(false/true) × `indeterminate`(false/true) × `state`(default/hover/
focus/disabled) — a partial grid, `checked=true, indeterminate=true` isn't a
built combination (same "don't cross axes that can't co-occur" precedent as
`TableRow`'s own partial grid). `radius.checkbox` is flat (`radius.sm`, 4px)
across all 3 sizes, confirmed via read-back. This is the *adopted* component
— originally an external-kit import the owner preferred over an earlier
from-scratch build; see `CHANGELOG-renames.md`'s 2026-09-13 entry for the
full rebind/rename history.
