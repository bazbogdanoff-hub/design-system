# FilterIcon

The icon-only filter trigger for card/table headers — opens the
advanced-filter / add-filter popover. **L2 pattern** — `IconButton` fixed to
`variant="secondary"`, restricted to `sm`/`md`.

```tsx
<FilterIcon aria-label="Advanced filters" onClick={openAdvancedFilters} />
```

| prop | values | default |
|---|---|---|
| `size` | `sm` (28px) · `md` (32px) | `md` |

1440 migration: was `lg`(36)/`xl`(40), shifted with Button's own scale onto
the two sizes one step down (see [Button.md](./Button.md)).

Everything else (`loading`, `asChild`, standard button props) is
`IconButtonProps` passed straight through — `variant`/`size` are restricted
and `icon` is fixed (a bundled `FunnelIcon.tsx`, not a prop at all — matches
Figma, where `iconSwap` binds the same glyph across every variant instead of
being exposed). An accessible name (`aria-label` / `aria-labelledby`) stays
required, same as `IconButton`.

## Figma

**`Filter — icon`** — `size`(sm/md) × `state`(default/hover/active/disabled)
= 8 variants. Each nests a real instance of the matching `IconButton`
secondary variant (not a detached copy) — same technique as `Filter`.
`iconSwap` is bound to the same icon across all 8 variants and not exposed as
a component property — the trigger is always the same glyph, never swapped
per instance.

## a11y

Real `<button>`, same as `IconButton` — `aria-label`/`aria-labelledby` is
required at the type level (verified with a negative compile test: omitting
it, or trying to pass `icon`, both fail to typecheck).
