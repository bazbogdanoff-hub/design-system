# Input

A single-line text field. **L1.** First React port of Figma's `Input` (15
variants: `size` × `state`), extended in code with icon and affix slots.

```tsx
<Input placeholder="Search fleet…" leadingIcon={<SearchIcon />} />
<Input prependText="https://" placeholder="example.com" />
<Input prependText="$" appendText="USD" placeholder="0.00" />
<Input error defaultValue="bad@value" />
```

| prop | type | default | notes |
|---|---|---|---|
| `size` | `sm` (28px) · `md` (32px) · `lg` (36px) | `md` | matches `Button`'s own heights |
| `leadingIcon` | `ReactNode` | — | decorative, `aria-hidden` |
| `trailingIcon` | `ReactNode` | — | decorative, `aria-hidden` |
| `prependText` | `ReactNode` | — | fixed, non-editable text before the value (e.g. `https://`) |
| `appendText` | `ReactNode` | — | fixed, non-editable text after the value (e.g. `kg`) |
| `error` | `boolean` | — | reddens the border, sets `aria-invalid` |
| `wrapperClassName` | `string` | — | class on the bordered field box; `className` targets the `<input>` |

Every other native `<input>` prop passes through (`disabled`, `type`,
`placeholder`, `value`/`defaultValue`, `onChange`, …). Native `size` (the
character-count attribute) is intentionally not exposed — our `size` means
something else here.

## Why the border lives on a wrapper, not the `<input>`

```
span.field [data-size] [data-error] [data-disabled]     ← border/background/radius/focus live here
├─ span.affix[prepend]?      color/input/affix (subtle)
├─ span.icon[leading]?        color/input/icon (subtle), aria-hidden
├─ input.input                flex:1, no border, transparent background
├─ span.icon[trailing]?
└─ span.affix[append]?
```

So `leadingIcon`/`trailingIcon`/`prependText`/`appendText` all sit *inside*
the same bordered field, and the whole box reacts as one on focus
(`:focus-within`) — not just the native input. This is the same "wrapper
owns the chrome" shape `IconButton`/`Button` use for their `.surface`.

## Icons vs. affixes — both always subtle, never state-colored

`color/input/icon` and `color/input/affix` both alias `color/text/subtle`
and **don't change** with hover/focus/error — only the border does. An
error state means "the value is wrong," not "the unit label next to it is
wrong," so a red `$` prefix next to a red-bordered field would be noise, not
signal. Affixes are plain text (not a chip/pill) at the field's own type
scale — closer to inline supporting text than a separate UI element.

## Tall panels aside — what's a Figma port vs. a code-first addition

`size` × plain `state` (default/hover/focus/error/disabled) is a **1:1 port**
of Figma's 15 variants — same heights (`size/control/*`), same radius
(`radius/input` → `radius/control`), same fixed 12px horizontal padding,
same `text/body/{size}` type scale for the value and placeholder.

`leadingIcon`/`trailingIcon`/`prependText`/`appendText` were built
code-first (per this session's "extend the undesigned components in code,
review live" call) because they're a real, recurring need (a search field, a
currency amount, a URL) — new tokens `color.input.icon` / `color.input.affix`
(both alias `color.text.subtle`) back them. **Figma has since caught up**:
the set gained a `filled` variant (`size`×`state`×`filled` = 30 variants, so
it can show a typed value vs. the placeholder) and the same 4 accessories as
**boolean component properties** — `leadingIcon`/`trailingIcon`/`prependText`/
`appendText` — bound to hidden-by-default layers, exactly mirroring these
props. No React change was needed for that catch-up; it was Figma matching
code, not the reverse.

## A duplicate-key bug fixed in passing

`tokens/component.color.json` had **two** `"input"` keys under `color` — an
old, stale block (with `label`/flat `placeholder`/`border.danger`) silently
shadowed by the real one three groups later (JSON parses last-key-wins, so
Style Dictionary and the Figma generator only ever saw the second). Deleted
the dead one while adding `icon`/`affix` to the real one — same class of
hygiene issue `design-system-conventions` exists to catch.
