# ListCardHeader

`ListCard`'s title region — a heading and an optional muted description
line. **L1** — Figma + React, React ported this session.

```tsx
<ListCardHeader heading="Fleet issues" description="Trucks with open problems" />
<ListCardHeader heading="Fleet issues" />
```

| prop | type | notes |
|---|---|---|
| `heading` | `ReactNode` — required | |
| `description` | `ReactNode` | omit entirely to render just the heading |
| `size` | `sm` (18/13) · `md` (20/14, default) · `lg` (24/16) | see below |

## `size` has no Figma variant — it's a React-only convenience

The Figma reference (`10114:12896`) is a single fixed-size component: no
`size` variant property at all, just one heading + one optional description
text node. Usually left unset here too and cascaded from a `ListCard`
ancestor instead — the same mechanism `FormField` uses to cascade `size` to
a bare `Input` child (see `ListCard.md`). Set it directly only when a
`ListCardHeader` is used standalone, outside a `ListCard`.

`size` maps `heading` to `text.heading.*` and `description` to
`text.body.*` at the **same** size step (`sm`→`heading.sm`/`body.sm`,
`md`→`heading.md`/`body.md`, `lg`→`heading.lg`/`body.lg`) — not stepped down
the way `FormField`'s own headline sits one `text.label.*` step below its
`size`. The Figma reference's only built variant (heading `text/heading/md`,
description `text/body/md`) confirms the same-step pairing.

## No gap between heading and description

`itemSpacing: 0` in the Figma reference — the two lines sit flush against
each other, unlike `FormField`'s label→control→helper stack (`space/6`
gap). React matches this exactly (`gap: 0`).

## Figma

**`ListCardHeader`** (`10114:12896`) — heading (`text/heading/md`,
`color/text/default`) + `description` (a real boolean, default `true`),
description text styled `text/body/md`/`color/text/subtle`. Nested one level
inside `ListCard`'s own `Card` slot — `description`'s boolean is exposed up
to `ListCard`'s own instance panel via Figma's one-level nested-instance-
property exposure (see HANDOFF §6 for why this only reaches a direct
parent, not further).
