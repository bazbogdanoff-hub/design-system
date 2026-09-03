# Component tokens

`tokens/component.color.json` · Figma collection **Component**.

A component token exists to give one component a **named override point** so a
future tweak ("make secondary buttons warmer") is one edit, not a hunt through
CSS. Every component token **aliases a semantic token** — never a primitive,
never a raw value.

Canonical path: `color.<component>.<part>[.<variant>][.<state>]`
CSS: `--color-<component>-<part>-…`

## When to add a component's tokens

Add them **when you start building that component**, not before. Scaffolding
tokens for components that don't exist yet just creates more to keep in sync.

Procedure:
1. List the colored parts of the component (background, text, border, icon…) and its meaningful variants/states.
2. For each, find the semantic token that already expresses the intent. If none fits, the *semantic* catalog is missing something — fix that first ([color-tokens.md](color-tokens.md)).
3. Add the group to `tokens/component.color.json`, `npm run build:tokens`.
4. Create the matching Figma variables in the **Component** collection.
5. The React component's CSS uses only `--color-<component>-*` vars.

## Scaffolded set

### `button`

| Token | → semantic |
|---|---|
| `button.primary.background.default` / `.hover` / `.active` | `background.brand.default` / `.hover` / `.active` |
| `button.primary.text` | `text.on-brand` |
| `button.secondary.background.default` / `.hover` / `.active` | `surface.default` / `background.subtle` / `background.subtle` |
| `button.secondary.text` | `text.default` |
| `button.secondary.border` | `border.default` |
| `button.ghost.background.default` / `.hover` / `.active` | `transparent` *(raw)* / `background.brand-subtle` / `background.brand-subtle` |
| `button.ghost.text` | `text.brand` |
| `button.danger.background.default` / `.hover` | `background.danger.default` / `.hover` |
| `button.danger.text` | `text.on-danger` |
| `button.disabled.background` | `background.disabled` |
| `button.disabled.text` | `text.disabled` |

`disabled` is shared across variants — one token pair, applied when the button is disabled regardless of `variant`.

### `card`

| Token | → semantic |
|---|---|
| `card.background.default` | `surface.card` |
| `card.background.hover` | `surface.subtle` *(clickable cards only, not used yet)* |
| `card.border` | `border.highlight` — white top-left glass catch |
| `card.border-active` | `border.highlight-active` — full primary border on focus/active; shared by StatButton + other glass buttons |

### `input`

| Token | → semantic |
|---|---|
| `input.background.default` / `.disabled` | `surface.default` / `background.disabled` |
| `input.text` | `text.default` |
| `input.placeholder` | `text.muted` |
| `input.label` | `text.subtle` |
| `input.border.default` / `.hover` / `.focus` / `.danger` | `border.default` / `border.strong` / `border.focus` / `border.danger` |

### `badge` (logistics-CRM status pills)

Six tones. Each is `subtle` background + matching text.

| Token | → semantic |
|---|---|
| `badge.neutral.background` / `.text` | `background.subtle` / `text.subtle` |
| `badge.brand.background` / `.text` | `background.brand-subtle` / `text.brand` |
| `badge.success.background` / `.text` | `background.success-subtle` / `text.success` |
| `badge.warning.background` / `.text` | `background.warning-subtle` / `text.warning` |
| `badge.danger.background` / `.text` | `background.danger-subtle` / `text.danger` |
| `badge.info.background` / `.text` | `background.info-subtle` / `text.info` |

Map shipment/order statuses onto these tones in the app layer (e.g. `delivered → success`, `delayed → warning`, `cancelled → danger`) — don't add per-status tokens.

### `table`

| Token | → semantic |
|---|---|
| `table.header.background` / `.text` | `surface.subtle` / `text.subtle` |
| `table.row.background.default` / `.hover` / `.selected` | `surface.default` / `background.subtle` / `background.brand-subtle` |
| `table.border` | `border.subtle` |

### `modal`

| Token | → semantic |
|---|---|
| `modal.background` | `surface.raised` |
| `modal.border` | `border.default` |
| `modal.scrim` | `background.overlay` |

## Figma ↔ React component mapping

- Figma component name = React component name, PascalCase: `Button`, `Badge`, `TextField`.
- Figma variant **property** names and **values** = the React prop names and values exactly: Figma `variant=secondary` ↔ `<Button variant="secondary">`.
- Figma variant props for the scaffolded set:
  - `Button`: `variant` = `primary|secondary|ghost|danger`, `size` = `sm|md|lg`, booleans `leadingIcon` / `trailingIcon`
  - `Badge`: `tone` = `neutral|brand|success|warning|danger|info`
  - `Input`/`TextField`: `state` = `default|hover|focus|disabled|danger` (visual only in Figma; in code these are pseudo-classes + an `error` prop)
- Interaction state (`hover`, `focus`, `active`) is a Figma variant only on documentation boards. In code it's CSS pseudo-classes driving the `.hover`/`.focus` component tokens.
