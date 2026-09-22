# Headercard

The page-header card: heading on the left with, under it, **either** a stat
`LabelGroup` **or** a row of `controls`, and a free `actions` slot on the
right.

## API

```tsx
// list pages — stat line under the heading
<Headercard
  heading="Trucks"
  labelGroup={<LabelGroup size="sm"><Label>86 total</Label>…</LabelGroup>}
  actions={<SegmentedControl …/>}
/>

// detail pages — controls under the heading
<Headercard
  heading="Reefer failure — SH-1041"
  controls={<><Badge …>critical, 9</Badge><IconButton … /></>}
  actions={<Button variant="secondary" …>All tasks</Button>}
/>
```

| prop | type | notes |
|---|---|---|
| `heading` | `ReactNode` | rendered as the `<h1>` |
| `labelGroup` | `ReactNode` | stat line, `space/2` under the heading |
| `controls` | `ReactNode` | badges/buttons, `space/10` under the heading, `space/8` apart |
| `actions` | `ReactNode` | right side, `space/10` apart |

`labelGroup` and `controls` are **mutually exclusive** — the prop types
reject both at once.

With `controls`, the card's cross-axis alignment switches from **centre** to
**top**, so `actions` sit level with the heading instead of floating in the
middle of a taller left column. With `labelGroup` (or neither), it stays
centred — the Figma reference.

## Figma build (delta)

The master has a `hasLabelGroup` boolean. Add:

- **`hasControls`** boolean (default off) → a `controls` **SLOT** under the
  heading: HORIZONTAL auto-layout, gap **8**, wrap.
- When `hasControls` is on: left column gap **10** (not 2), `hasLabelGroup`
  off, and the card's counter-axis alignment **top**.
- Showcase: a severity `Badge md` + a secondary `IconButton md` in the slot,
  with a secondary "Back" `Button` in actions.
