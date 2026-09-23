# SelectableCard

A card that is one choice in a set — radio semantics on a `Card` surface.
Built for the Aegis task console's option cards; domain-agnostic (L2).

> **Figma: no master yet.** Built in code first, at the owner's request.
> The selected ring below needs a Figma component to
> match.

## API

```tsx
<SelectableCard
  name="task-option"          // shared by every card in the set
  value={option.id}
  label="Reroute via Lynden"  // accessible name — usually the heading text
  checked={selectedId === option.id}
  disabled={option.superseded}
  onSelect={() => setSelectedId(option.id)}
  trailing={<Badge …/>}       // top row, right of the radio
  padding="md"
>
  {/* anything — including its own Buttons */}
</SelectableCard>
```

| prop | type | default |
|---|---|---|
| `name` | `string` | — |
| `value` | `string` | — |
| `label` | `string` | — |
| `checked` | `boolean` | — |
| `disabled` | `boolean` | `false` |
| `onSelect` | `() => void` | — |
| `trailing` | `ReactNode` | — |
| `padding` | `CardPadding` | `md` |
| `radioSize` | `RadioSize` | `md` |

## Why it isn't a button

A clickable card is usually built as `role="button"` — which breaks the
moment the card contains its own button (a Confirm, a help icon): nested
interactive controls confuse keyboard and screen-reader users, and fail
automated a11y checks.

Here the card is a plain surface holding a real `Radio`:

- **Keyboard** — Tab into the set, arrow keys move between cards (native
  radio-group behaviour via the shared `name`), Space selects.
- **Screen reader** — hears "Reroute via Lynden, radio button, 2 of 4",
  then the card's own buttons as separate controls.
- **Pointer** — a click anywhere on the card selects it, **except** a click
  on a control inside it (`button`, `a`, `input`, …), which acts on its own.

## Appearance

| state | look |
|---|---|
| default | `Card` — glass surface, white top/left catch |
| selected | 1px `color/border/brand` ring replaces the catch; vignette kept |
| keyboard focus | **same as selected** — house rule for now: focus mirrors the active look, as on `Button`, until focus states are designed. Shown on the whole card when its radio has `:focus-visible`; the radio also shows its own focus ring |
| disabled | radio disabled, pointer cursor removed |

Internal spacing: `space/12` between the top row and children, `space/8`
between trailing items. Children carry no margins.

## Figma build

**Its own component, not a `Card` variant** — owner's decision
(2026-09-22). `Card` is a stateless frame for content; states belong to the
component that has them. This follows architecture.md's "primitives stay
small": `Card` never grows a `selected` variant.

- Component set **`SelectableCard`** — **one variant property**: `state`
  (`default | selected | disabled`) → **3 variants** in a row. **No
  `focus` variant**: focus mirrors `selected` (house rule, same as the
  Button masters, which have no focus variant either).
  No `hover` — code has none (only the pointer cursor), so don't invent one.
- Built from a nested **`Card` instance** (`padding=md`), never detached.
  The selected look is an **instance override** on that Card, so a
  later change to Card's fill, radius or vignette still reaches this.
- Inside the Card: VERTICAL auto-layout, gap **12** (`space/12`):
  1. **Top row** — HORIZONTAL, space-between, gap **8**: a `Radio` instance
     (`size=md`; `checked` in `selected`, disabled in `disabled`) +
     a `trailing` **SLOT** (showcase: two `Badge xs` with icons).
  2. **Body** — a **SLOT**, empty by default.
- Per state:
  | `state` | Card stroke (instance override) | extra |
  |---|---|---|
  | `default` | as Card — top/left 1.5, `color/card/border` | — |
  | `selected` | **all sides 1**, `color/border/brand`; vignette kept | Radio checked |
  | `disabled` | as `default` | Radio disabled |
- Base variant: width **320**, height **hug**.
- Showcase: a docs board with a 2×2 set of options (one selected, one
  disabled/superseded) using real content — label, detail line, ETA label,
  and a Confirm `Button` in the body — to show the card holding its own
  controls.
