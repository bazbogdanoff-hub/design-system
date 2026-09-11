# LabelGroup

A short run of `Label`s separated by real 1px vertical dividers — the
pipe-separated pattern (`TK-4021 | TL-88 | Dumont`). **L1.** Intended for
**2–4 labels max.**

```tsx
<LabelGroup size="xs">
  <Label>TK-4021</Label>
  <Label>TL-88</Label>
  <Label>Dumont</Label>
</LabelGroup>
```

| prop | values | default |
|---|---|---|
| `size` | any `LabelSize` (`2xs`–`xl`) — cascades to every child `Label` and sizes the dividers | `md` |
| `children` | `Label` elements | — |

Renders a `<div>` (`inline-flex`, `gap: space/6`). Other `HTMLDivElement`
props pass through.

## The divider

A real 1px-wide element (`<span aria-hidden>`), **not** the `·` character
(reads as AI-generated). Height = the label's **font-size** at the current
`size` (not line-height — it should match the visual text height, not the
line box). Color is fixed chrome — `color.text.subtle` — never one of
`Label`'s own colors, so it stays constant regardless of how the labels are
colored.

## `size` cascade

`LabelGroup` clones each child `Label` to inject its own `size` unless that
child sets one explicitly (`child.props.size ?? size`). In practice a group
is one coherent size; per-child overrides exist only as an escape hatch.
`color` is always per-child.

## Used by Row

`Row`'s `description` is a `LabelGroup` in Figma, size-matched to the row:

| Row `size` | LabelGroup `size` |
|---|---|
| `sm` | `2xs` |
| `md` | `xs` |
| `lg` | `sm` |

Pass a bare `<LabelGroup>` (no `size`) as `Row`'s `description` and `Row`
applies that mapping for you. Passing an explicit `size` opts out.
