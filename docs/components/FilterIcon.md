# FilterIcon

The **add-a-filter** trigger for `FilterBar` — `IconButton` fixed to
`variant="secondary"`, restricted to `sm`/`md`. **L2 pattern.**

```tsx
<FilterIcon aria-label="Add filter" onClick={openFilterMenu} />
```

| prop | values | default |
|---|---|---|
| `size` | `sm` (28px) · `md` (32px) | `sm` |

`size` defaults to `sm` now (it sits next to `sm` `Filter`s in `FilterBar`
and matches the Figma reference). 1440 migration earlier shifted the scale
down from `lg`(36)/`xl`(40).

Everything else (`loading`, `asChild`, standard button props, plus
`aria-expanded` for menu state) is `IconButtonProps` passed straight
through — `variant`/`size` are restricted and `icon` is fixed. An accessible
name (`aria-label` / `aria-labelledby`) stays required.

## Funnel → "+" glyph swap

The trigger's job is *adding* a filter, not filtering directly, so the glyph
reflects that:

| state | glyph |
|---|---|
| rest (`default`) | funnel (`FunnelIcon`) |
| `:hover`, `:active` | plus (`PlusIcon`) |
| menu open (`aria-expanded="true"`) | plus |
| `disabled` | funnel |

Both glyphs are bundled and fixed (not props). Implemented as a **pure CSS
swap** in `FilterIcon.module.css` — both `<svg>`s render inside the button
and `display:none` hides the inactive one (no JS state, no layout shift). The
specificity has to beat Button's own `.surface [data-btn-icon] > svg` rule,
hence the `.filterIcon [data-btn-icon] > .plus` selectors.

Future: clicking opens a context menu listing every filter available for the
host component, each with a show/hide checkbox — the "+" is the entry point
to that.

## Figma

**`Filter — icon`** — `size`(sm/md) × `state`(default/hover/active/disabled)
= 8 variants. Each nests a real instance of the matching `IconButton`
secondary variant (not a detached copy). The glyph child is toggled per
state: `Funnel` visible in `default`/`disabled`, `Plus` visible in
`hover`/`active` — the same swap the React CSS does.

## a11y

Real `<button>`, `aria-label`/`aria-labelledby` required at the type level.
Set `aria-expanded` when it controls an open menu.
