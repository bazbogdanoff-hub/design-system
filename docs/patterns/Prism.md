# Prism

**Prism** is the house style for a control that is *on*: the primary
button's brand fill, worn in the chart marks' glass recipe. Named by the
owner on 2026-10-04 so it can be asked for in one word: "make it Prism".

## The recipe

One colour, `--glass-fill`, set to `color/button/primary/background/default`
(brand.400). Hover moves it to `…/background/hover` (brand.500). Everything
else derives from it, exactly as `src/glass.css` defines for the chart marks:

| layer | value |
|---|---|
| fill | `--glass-fill` |
| catch | inset 1px 1px, no blur: the fill mixed toward white by `--glass-catch-mix` (32%) |
| inner shade | inset 2px 2px, blur 12: the fill mixed toward black in oklch by `--glass-inner-mix` (16%) |
| own light | 2px 3px blur 5 −1 at `--glass-light-near` (55%), and 3px 6px blur 12 −2 at `--glass-light-far` (30%) |

The light comes from the top left. A Prism element catches it on its top-left
edge, deepens inside and throws its own colour down and to the right.

Content on Prism is white: a check mark, a radio dot, a switch thumb.
Disabled drops every shadow and uses the plain disabled fill.

## Its partner: the well

What is *off* doesn't stay flat beside Prism. It sinks:

- **Checkbox, Radio:** a white well, `inset 1px 1px 3px` of alpha-black/20
  with a 1px inset hairline of alpha-black/10. White reads on a card and on
  the grey table header band alike.
- **Switch track:** the recessed grey, so its white thumb shows on it.

## Where it is used

| element | Prism when |
|---|---|
| `Button` `variant="primary"` | always (its own tokens, same structure, 1.5px catch) |
| `Checkbox` | checked or indeterminate |
| `Radio` | selected: the whole disc, with a white dot |
| `Switch` | on: the track; the thumb is a white raised piece |
| chart marks, `CategoryIcon` | always, in their own data colour (`--glass-fill` per series or category) |

The last row is the same recipe in other colours. *Prism* by itself means the
brand colour. "Prism in rose" means the recipe with a different fill.

## Asking for it

- "Make X Prism": X's on/selected state gets the recipe above, and its off
  state gets the well.
- Never re-describe the shadows in a component: set `--glass-fill` and copy
  the four `box-shadow` layers, or use `.ds-glass` where the element's shape
  allows it.

## Figma

Not yet a style in Figma (owner to add): an effect style with the four
layers, applied to a fill bound to `button/primary/background/default`.
