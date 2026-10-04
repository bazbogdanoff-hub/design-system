# Headercard

The page-header card: heading on the left, optionally with an `aside` beside it
and, under it, **either** a stat `LabelGroup` **or** a row of `controls`. A free
`actions` slot sits on the right.

## API

```tsx
// list pages - stat line under the heading
// detail pages - related entities beside the heading
<Headercard
  heading="RIG-01"
  aside={<><EntityChip icon={<Truck weight="fill" />} label="TK-001" onClick={…} />…</>}
  actions={<><Badge …>Active</Badge><IconButton … /></>}
/>

<Headercard
  heading="Trucks"
  labelGroup={<LabelGroup size="sm"><Label>86 total</Label>…</LabelGroup>}
  actions={<SegmentedControl …/>}
/>

// detail pages - controls under the heading
<Headercard
  heading="Reefer failure - SH-1041"
  controls={<><Badge …>critical, 9</Badge><IconButton … /></>}
  actions={<Button variant="secondary" …>All tasks</Button>}
/>
```

| prop | type | notes |
|---|---|---|
| `heading` | `ReactNode` | rendered as the `<h1>` |
| `aside` | `ReactNode` | beside the heading and **outside** the `<h1>`; `space/8` from it, `space/4` between its own children |
| `labelGroup` | `ReactNode` | stat line, `space/2` under the heading |
| `controls` | `ReactNode` | badges/buttons, `space/10` under the heading, `space/8` apart |
| `actions` | `ReactNode` | right side, `space/10` apart |

## Why `aside` is not just part of `heading`

Anything passed as `heading` becomes part of the page's accessible name,
because it renders inside the `<h1>`. A rig titled "RIG-01" carrying three
member chips would announce as **"RIG-01 TK-001 TR-004 Wójcik"** - the page
would have no stable name, and every chip label would be read before a screen
reader user reached anything else.

`aside` renders as a **sibling** of the `<h1>` on the same line, so the
heading keeps its name and the chips keep their own. Use it for things that
sit *next to* the title rather than being part of it: related entities as
`EntityChip`s, a status `Badge`, a count.

Its `space/4` inner gap is the chip-group spacing from the Figma header frame;
a single child never notices it. Chips hold their width (`flex: none`) and a
long heading is what gives way.

`labelGroup` and `controls` are **mutually exclusive** - the prop types
reject both at once.

With `controls`, the card's cross-axis alignment switches from **centre** to
**top**, so `actions` sit level with the heading instead of floating in the
middle of a taller left column. With `labelGroup` (or neither), it stays
centred - the Figma reference.

## Figma build (delta)

The master has a `hasLabelGroup` boolean. Add:

- **`hasControls`** boolean (default off) → a `controls` **SLOT** under the
  heading: HORIZONTAL auto-layout, gap **8**, wrap.
- When `hasControls` is on: left column gap **10** (not 2), `hasLabelGroup`
  off, and the card's counter-axis alignment **top**.
- Showcase: a severity `Badge md` + a secondary `IconButton md` in the slot,
  with a secondary "Back" `Button` in actions.
