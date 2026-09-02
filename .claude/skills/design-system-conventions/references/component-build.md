# Building a component — Figma ↔ React

Code is the source of truth. The Figma component and the React component are the
same thing; when they disagree, the React one is right and Figma gets fixed.

## Workflow (per component)

1. **Spec** — a `docs/components/<Name>.md` is written first: the prop/variant
   table, anatomy, states, tokens, a11y notes. Both sides build from it.
2. **Figma** — the designer builds the component set from the spec.
3. **Extract** — pull the built component's exact values via figmosha
   (effects, spacing, any per-variant overrides) so the CSS matches pixel-for-pixel.
4. **React** — implement in `src/components/<Name>/`, styled with the token CSS vars.
5. **Commit** — component + its `docs/components/<Name>.md`, push.

## Figma rules

- **Name** = the React component name, PascalCase (`Card`, `Badge`, `TextField`).
  `/` only for a real category (`Form/TextField`).
- **One component set** per component. Variant **property names** are lowercase,
  **values** lowercase-kebab. Each property maps 1:1 to a React prop with the
  same name and the same values.
- **Bind every colour / radius / spacing** to a variable from the new collections
  (`color/*`, `radius/*`, `space/*`). A raw hex or off-scale number is a bug.
- **Do NOT tokenise effects.** Glass / vignette inner-shadows and their border
  treatments stay as Figma effects, hand-tuned per component. The extract step
  reads their exact values into the CSS.
- Interaction states (`hover`, `focus`, `active`, `disabled`) are **not** variants
  in the production component — they're CSS pseudo-classes / `data-` attributes in
  code. Only a documentation board uses state variants.
- Auto-layout everywhere; padding/gap from `space/*`.

## React rules

```
src/components/<Name>/
├── <Name>.tsx          the component
├── <Name>.module.css   token-var-based styles
├── <Name>.types.ts     exported props interface (if non-trivial)
└── index.ts            re-export
```

- **`forwardRef`** always; forward the ref to the root DOM node.
- **`asChild?: boolean`** via `@radix-ui/react-slot` `Slot` for polymorphism
  (render as `<a>`, `<button>`, Next `<Link>`, …). Non-interactive containers
  included.
- **className merge:** `className={cn(styles.root, className)}` — consumer classes
  win. Spread `...rest` onto the root.
- **Variants → `data-` attributes**, not conditional class strings:
  `<div data-padding={padding} data-elevation={elevation}>` and the CSS targets
  `.root[data-padding='lg']`. Keeps the DOM inspectable and matches how Figma
  variants read.
- **States → CSS**, driven by real interaction: `:hover`, `:focus-visible`,
  `[data-disabled]` / `:disabled`, `[data-state]` (from Radix).
- **Tokens only** in CSS: `var(--color-*)`, `var(--text-*-*)`, `var(--radius-*)`,
  `var(--space-*)`. No hard-coded colours or px (except effect values from the
  extract step, commented with their Figma origin).
- **Interactive components** wrap the matching Radix primitive; style its parts
  with our tokens. Non-interactive (Card, Badge) are plain elements.
- **Props naming** mirrors Figma variant props exactly. Standard HTML props
  (`disabled`, `onClick`, `type`, `aria-*`) are passed through via `...rest`, not
  redeclared as variants.
- Export the props type: `export type { CardProps } from './Card.types'`.

## Typography & colour in component CSS

- Text: apply a `text/*` utility class **or** the expanded custom props
  (`font: var(--text-label-md-font-weight) var(--text-label-md-font-size)/…`).
  Colour separately via `var(--color-text-*)`.
- A component that has its own colour tokens (`color/button/*`, `color/card/*`)
  uses those; otherwise it uses the semantic layer (`color/surface/*`, `color/text/*`).
