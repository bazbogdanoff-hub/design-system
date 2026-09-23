# Tooltip · TooltipTrigger

Two parts, deliberately separate:

- **`Tooltip`** — the bubble only: dark pill + arrow. No positioning, no
  show/hide logic. Matches the Figma reference.
- **`TooltipTrigger`** — when and where it shows. Wrap one focusable
  element; pass the text as `content`.

> **Figma:** `Tooltip` has a master. `TooltipTrigger` is behaviour, which
> Figma can't express beyond a prototype interaction — the only visual
> change is that the bubble now wraps long text (below).

## API

```tsx
<TooltipTrigger content={option.riskNote} position="top">
  <IconButton aria-label="Risk note" icon={<Question weight="bold" />} />
</TooltipTrigger>
```

| prop | type | default |
|---|---|---|
| `content` | `ReactNode` — empty/`null` renders the child alone | — |
| `position` | `top` `bottom` `left` `right` | `top` |
| `children` | one focusable element | — |

## Behaviour

- Opens on **hover and keyboard focus**, with no delay.
- Stays open while the pointer is over the bubble; closes on **Escape**
  (WCAG 1.4.13 — hoverable, dismissible). The trigger→bubble gap is padding
  on the bubble's wrapper, so crossing it doesn't close the tooltip.
- The child gets `aria-describedby` pointing at the bubble, which is always
  in the DOM — screen readers read the text as the control's description
  even while it's visually hidden.
- `prefers-reduced-motion` removes the fade.
- No collision handling: it opens on the chosen side, centred.

## Long text

The pill sizes to its text (`width: max-content`) up to **300px**, then
wraps at word boundaries. A short label stays on one line even inside a
narrow anchor; a paragraph-long note becomes a readable block instead of
one line running off the screen.

## Consumers

- `TaskCard` — the category tag's "From {module}". The tag gets
  `tabIndex={0}` so keyboard users can reach it: `TooltipTrigger` needs a
  focusable child, and a plain `Tag` is a `<span>`.
- Aegis task console — the option card's risk note.

No hand-built hover tooltips remain in this repo.

## Figma build (delta)

The existing `Tooltip` master changes in one way: the pill **wraps**.

- Pill auto-layout: width **hug**, with **max width 300**; text layer
  **auto height** (fixed-width wrapping), not auto width.
- Add a showcase instance with a long note (3–4 lines) next to the
  existing short one, so both behaviours are visible.
- `TooltipTrigger` has no master — it is behaviour. At most, a prototype
  interaction on the docs board (hover → show).
