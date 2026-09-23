# TableCell / TableCellText / TableProgressStages

A real `<td>`, plus two small composition helpers. **L1** — ported from
Figma's `TableCell`.

```tsx
<TableCell><input type="checkbox" aria-label="Select row" /></TableCell>

<TableCell><TableCellText emphasis="strong" title="FL-0954" /></TableCell>
<TableCell><TableCellText title="Low tire pressure" /></TableCell>
<TableCell><TableCellText title="No station selected yet" supporting="Flagged 2h ago" /></TableCell>

<TableCell><Badge tone="danger">Critical</Badge></TableCell>
<TableCell><SeverityBadge level="critical" size="sm">Critical</SeverityBadge></TableCell>
<TableCell><Button variant="secondary" size="sm">Book Repair</Button></TableCell>
<TableCell align="end"><IconButton variant="tertiary" size="sm" icon={<DotsIcon />} aria-label="More actions" /></TableCell>

<TableCell>
  <TableProgressStages stageCount={5} currentStage={2} caption="In repair" aria-label="Repair progress" />
</TableCell>
```

## `TableCell`

| prop | type | default |
|---|---|---|
| `align` | `'start' \| 'center' \| 'end'` | `start` |
| `width` | `'checkbox' \| 'radio' \| 'icon' \| 'action' \| 'value' \| 'timestamp' \| 'wide'` | — |

### Width roles

| role | width | for |
|---|---|---|
| `checkbox` `radio` `icon` | fixed 48px | a control rail |
| `action` | fixed 8rem | cells holding a `Button` |
| `value` | 7rem minimum | a figure wider than its own header — money, distance, duration |
| `timestamp` | fixed 9rem | a date **and** time on one line |
| `wide` | 12rem minimum | a primary text column (Model, Location) |
| omitted | hugs one line | a value no wider than its header |

**Fixed vs minimum matters.** `checkbox`/`radio`/`icon`, `action` and
`timestamp` are fixed — their content has a known width, so they take no
share of the leftover space. `value` and `wide` are minimums on an `auto`
column, so they grow into whatever is left. Give the slack to the column that
can use it: a row where the date column absorbed it and the location column
clipped was the bug that produced this rule.

**Omitting the role is only safe when the header is at least as wide as
everything under it.** `Table` locks the row height by taking each cell's
content out of flow (`data-row-fill` → the inner fill is absolutely
positioned), which means a cell contributes no intrinsic width: the column is
sized by its **header**, and a longer value is clipped rather than widening
the column. `action` and `value` exist for exactly that, and the same role
must be set on the column's `TableHeaderCell` — a column is only as wide as
the widest of the two requests.

Every other native `<td>` prop passes through. **No fill of its own —
transparent, on purpose.** `TableRow` owns all visible row color
(default/hover/danger/success); a `TableCell` with its own opaque background
would hide every one of those states underneath it, which is exactly the bug
this had in Figma before the fill was removed (see `TableRow.md`).

## `Badge` vs `SeverityBadge` in a badge cell

React needs no wrapper here — `<TableCell><Badge/></TableCell>` and
`<TableCell><SeverityBadge/></TableCell>` are both already just composition,
no special-casing. Figma's `content=badge` variant nests one fixed instance,
so it needed a real fix (2026-09-13): a `badgeSwap` `INSTANCE_SWAP` component
property (default `Badge`, suggests `SeverityBadge`) — added after a
severity-style table (Maintenance & repair) initially used plain `Badge` for
what were really severity levels (Attention/Warning/Critical), which isn't
what `SeverityBadge` exists for. Rule of thumb: a genuine severity/urgency
level → `SeverityBadge`; a plain status tag with no severity semantics (e.g.
"Resolved") → stays `Badge`. Don't force every badge cell into
`SeverityBadge`'s `low`/`attention`/`warning`/`critical` vocabulary just
because the cell type is named "badge."

## Why only 2 helpers, not 9 (matching Figma's `content` variants)

Figma's `TableCell` enumerates 9 `content` values because a static reference
needs one concrete shape per possibility. In code, most of those are already
fully solved by composing existing components directly inside a plain
`TableCell` — a `Badge`, a `Button`, an `IconButton` — no wrapper needed.
Only two shapes needed genuinely new code:

### `TableCellText`

Icon + title + supporting text — the dominant shape (an ID, a problem
description, a station+schedule pair). Figma splits this into two variants
(`text`/`textStrong`) purely because Figma can't parameterize a variant's
color; in code that's one component with an `emphasis` prop.

| prop | type | default |
|---|---|---|
| `icon` | `ReactNode` | — (decorative, `aria-hidden`) |
| `title` | `ReactNode` — required | |
| `supporting` | `ReactNode` | — |
| `emphasis` | `'default' \| 'strong'` | `default` |
| `alert` | `boolean` | — |

Colors match the owner's final Figma tuning (not the original proposal):
`default` → `color.text.strong`, `strong` → `color.text.default` (the
darkest step) — a primary identifier (e.g. an ID column) needs to read
clearly heavier than its default-emphasis siblings in the same row.
Supporting text follows: `muted` under `default`, `subtle` under `strong`.

### `alert` — a fact about the value, not an interaction state

`alert` shows a trailing 16px warning triangle (`color.icon.warning-strong`,
the same orange `SeverityBadge`'s "attention" level uses) — added for cases
like a date that's expiring soon. Deliberately a boolean the caller sets
based on their own data (e.g. `alert={daysUntilExpiry < 7}`), not something
`TableCellText` computes itself — it has no concept of "soon," only whether
to show the glyph. Reuses `HelperText`'s own `WarningIcon` rather than a new
one. Matches Figma's `hasAlert` boolean, shared identically between the
`text` and `textStrong` variants.

### `TableProgressStages`

The compact multi-stage tracker (dots + connecting line, current stage
enlarged) — e.g. "Awaiting booking → Booked → En route → In repair →
Completed". Checked whether `ProgressBar` (continuous 0–100%) or `Tracker`
(a big time-left countdown card) could cover this before building new code —
neither matches "discrete named stages, one of which is current", so this
stayed its own thing, the same call made in Figma. Kept inline here rather
than promoted to a standalone top-level component since this exact shape
only has one use so far; worth revisiting if it recurs elsewhere (the same
threshold `EntitySummary` was extracted at).

| prop | type | notes |
|---|---|---|
| `stageCount` | `number` — required | |
| `currentStage` | `number` — required | 0-indexed; stages at or before this are "done" |
| `caption` | `ReactNode` | — |

Mandatory `aria-label`/`aria-labelledby` (same union-type pattern as
`ProgressBar`) — `role="progressbar"` with real `aria-valuenow/min/max`.

The dot/line colors (`color.tableProgressStages.{filled,unfilled}`) and the
current stage's halo ring (`color.tableProgressStages.ring`) are real
component tokens, adopted from a pre-token component the owner had already
built and placed into Figma's `progress` cell (see Figma section below) —
this component was originally hand-built without knowing that reference
existed, so it lacked the current-stage's halo ring entirely; added it here
to match, as a `box-shadow` on the current dot rather than a real border
(same "inset visual, no layout impact" reasoning used throughout this repo).

## Figma

`TableCell` (`10298:18423`) — 9 `content` variants (`select`/`text`/
`textStrong`/`badge`/`action`/`actionStatus`/`progress`/`iconOnly`/`custom`).
See `HANDOFF.md` for the full redesign rationale (this replaced the original
table's 5-variant `Cell` component, merging near-duplicates and promoting
the wildcard's two most common uses into first-class types). All 9 variants
are transparent (no fill) — same reasoning as the React side. `text`/
`textStrong` both carry a shared `hasAlert` boolean gating a 16px `Warning`
icon instance, bound to `color/icon/warning-strong`.

`progress`'s content nests a real `TableProgressStages` instance
(`4182:3097`) — a pre-token component the owner had used before (found
already named "Progress bar", `Property 1`=1–5), rebuilt here on this
system's tokens (was bound to old `shadcn colors` variables:
`primary/primary`, `shadcn colors/general/actual muted`, `primary/bg`) and
renamed to avoid colliding with the real linear `ProgressBar`, matching the
same adopt-and-rebind treatment as `Switch`→`SegmentedControl` and
`Check`→`Checkbox` earlier this project.
