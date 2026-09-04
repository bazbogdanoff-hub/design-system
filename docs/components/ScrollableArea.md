# ScrollableArea

A generic vertically-scrolling container — recessed background, inner-shadow
edges. **L1 primitive.**

```tsx
<ScrollableArea style={{ flex: 1 }}>
  {rows.map((r) => <ScrollableAreaRow key={r.id}>{r.content}</ScrollableAreaRow>)}
</ScrollableArea>
```

| prop | values | default |
|---|---|---|
| `as` | element type | `div` |
| `asChild` | `boolean` | `false` |

No variants — one component, matching Figma exactly. Standard `div` props
pass through.

Sizing is the consumer's job: `ScrollableArea` only owns `overflow-y: auto` +
the recessed look, not a height. Give it an explicit height, or put it in a
flex column with `flex: 1` (e.g. `ListCard.Body`, once built).

## Tokens

`color.scrollableArea.background` (→ `background.subtle`, the same "inset
zone" token used elsewhere) for the fill, `color.scrollableArea.shadow` (→
`alpha-black.15`) for the inner-shadow edge tint.

## Figma

`ScrollableArea` — one component, no variants. `clipsContent: true`, a single
`content` slot (lowercase — a generic single region, same convention as
`Page`'s scroll-layout `content` slot). `min-height: 0` in the CSS isn't
modeled in Figma (a flexbox-in-a-column gotcha, code-only).
