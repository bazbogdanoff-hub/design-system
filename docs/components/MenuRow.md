# MenuRow

One row inside a `Menu`. **L1** — Figma + React, both built this session.

```tsx
<MenuRow icon={<AppleIcon />} selected>Apple</MenuRow>
<MenuRow icon={<CherryIcon />}>Cherry</MenuRow>
```

| prop | type | notes |
|---|---|---|
| `icon` | `ReactNode` | decorative, `aria-hidden` |
| `children` | `ReactNode` — required | the row's label |
| `selected` | `boolean` | shows a right-aligned brand-colored checkmark |

Every other native `<button>` prop passes through (`onClick`, `disabled`, …).

## A real button, not a styled `<li>`

`role="menuitemradio"` on a real `<button>` — natively focusable, clickable,
and keyboard-operable (Tab between rows, Enter/Space to pick) without a
hand-rolled roving-tabindex system. `menuitemradio` over `option`/listbox
because picking one row from a menu is a single-choice action, exactly what
that role models; `aria-checked` carries `selected`.

## Sizing — ancestor context, not a prop

No `size` prop. `MenuRow` reads its size from the nearest `Menu` ancestor's
`data-size` attribute (`[data-size='sm'] .row { … }` etc.) — the same
ancestor-context cascade `TableRow` already uses for header-vs-body. A row
never needs cloning or a size prop of its own; whatever opened the menu
(`Input`, `Select`, `Filter`) decides the size once, at the `Menu` level.

## Figma

`MenuRow` (`10315:21907`) — 9 variants: `size`(sm/md/lg) × `state`(default/
hover/selected). `state=selected` shows a right-aligned check glyph in
`color.text.brand`; `hover` is a flat background wash, same token family
`TableRow`/`Row` already use for their own hover states. Built in 3 per-size
batches (same server-timeout precaution as `Textarea`, applied proactively
here since the row count was known in advance).
