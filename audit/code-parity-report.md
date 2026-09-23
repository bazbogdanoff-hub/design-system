# Figma ↔ React parity audit — the eleven Alerts-screen components

Read-only pass, run against the brief in `aegis/PARITY-AUDIT.md` (roadmap step 4).
**Nothing was applied.** The only files written are this one and
`audit/code-parity-findings.json`. No component was edited, no Figma node was
mutated, no doc was rewritten, and nothing in the `aegis` repo was touched.

- **Figma masters** extracted read-only via figmosha2 → `audit/raw/parity/*.json`
- **React side** read from `src/components/**` (CSS modules + prop types) — the
  `aegis` code-side table never arrived, so the source was read directly, which
  is the more reliable half of that trade anyway
- **Colour skipped entirely** per §5 (phase 4 of `figma-audit` not run)

## Verdict per component — the eleven lines

| component | result |
|---|---|
| `Card` | 1 medium (`padding="xl"` has no master), 1 low doc-stale. Geometry exact. |
| `TaskCard` | 1 medium (fills container, not fixed height — **this is the right answer for aegis**), 1 low. |
| `Table` | **1 high** — row height 68 in code vs 56 in the master. |
| `TableRow` | 1 medium `figma-wrong` (master self-contradicts: 44 row vs 56 cell), 1 low prop-parity (defensible, code is the better citizen). |
| `TableCell` | **1 high** — `textStrong` drops the master's weight + line-height change, 1 low radius-tier. |
| `TableHeaderCell` | **1 high** — header renders ~39px against a 44/56 master, 1 low (off-vocabulary Figma text style). |
| `Badge` | 1 medium prop-parity (`variant=withicon` vs `icon="hasIcon"`), 1 low radius-tier. Geometry pixel-exact incl. per-corner radii. |
| `SeverityBadge` | **Clean.** Icon sizes 12/16/20/24 exact; `pill` composes `Badge` exactly as the master does. |
| `Row` | 1 low radius-tier only. Padding/gap 8/10/12 exact. |
| `Stack` | **1 high** (`Box` missing `min-width: 0`), 1 medium (`columns` footgun). **`columns` itself works.** |
| `Grid` | No Figma master exists (code-only L1). Implementation checks out. |
| `Button` | 1 low doc-stale JSDoc. **Everything else pixel-exact**, including the deliberate `tertiary xs = 24` exception. |
| `IconButton` | **Clean.** Sizes, radii and icon boxes all exact; accessible name enforced at the type level. |

## The headline

**The port is materially healthier than feared.** 22 findings, but only 4 change
layout, and the verdict split says where the real work is:

| verdict | count | meaning |
|---|---|---|
| `code-wrong` | 11 | …but **4 of those are token-tier only** (right value, wrong token) with zero visual change |
| `both-defensible` | 5 | divergences that are documented and reasoned, incl. 2 where code is the better citizen |
| `doc-stale` | 4 | docs describing a system that already moved |
| `figma-wrong` | 2 | the master contradicting itself or the naming conventions |

Net: **7 code findings that actually render differently**, four of them in the
table family and clustered in one place — vertical rhythm. `Button`,
`IconButton`, `Badge`, `SeverityBadge` and `Row` came back pixel-exact against
their masters, which is not what a sloppy agent port looks like.

## The four `high` findings in full

### TABLE-001 · `Table` / `TableRow` · size-mismatch

- **figma** — `TableRow` (`10298:18440`) `variant=default` is **56px**; `TableCell` and `TableHeaderCell` are both 56px. The master is internally inconsistent: the `Table` master (`10302:18481`) holds row instances overridden to 56 **and 60**.
- **code** — `Table.tsx:16` `TABLE_ROW_MAX_HEIGHT_PX = 68`; `TableRow.module.css:13` `height: var(--table-row-height, 68px)`; `TableCell.module.css:7-8` height/max-height 68px.
- **verdict** — `code-wrong`. The master says 56 and the brief makes the master ground truth. Caveat worth weighing: the code's fill-to-available behaviour (rows stretch to fill the card, capped at the max) is a deliberate improvement with no Figma equivalent. Only the **68 cap** is in question, not the mechanism.
- **proposed** — set the constant and both CSS fallbacks to 56. If 68 is the real intent, fix the `TableRow` master instead and normalise the stray 60px instance.
- **blastRadius** — every table screen: `TrucksPage`, `TrailersPage`, `DriversPage` and both Maintenance & repair screens (Frames 6, 7, 8, 10, 11, 12). **12px × 8 rows ≈ 96px of vertical shift per table.** The single most template-relevant finding here.

### TCELL-001 · `TableCell` · typography-mismatch

- **figma** — `content=textStrong` title is `text/label/sm` (13px / **600** / lh 1.15 → **15px line box**). `content=text` title is `text/body/sm` (13px / 500 / lh 1.5 → **20px line box**).
- **code** — `TableCellText.tsx:12` `emphasis?: 'default' | 'strong'`; `TableCellText.module.css:43-48` — `strong` changes **only colour** and stays on body/sm 500 at lh 1.5.
- **verdict** — `code-wrong`. `TableCellText.tsx:20` asserts Figma split `textStrong` out *"purely because Figma can't parameterize a variant's color"*. The master data contradicts that: it also changes weight and line-height.
- **proposed** — have `emphasis="strong"` apply the full `text/label/sm` token set, not just colour.
- **blastRadius** — any table with a primary-identifier column (rig ID, truck number, driver name) — Trucks, Trailers, Drivers, both Maintenance screens. Changes the line box by 5px, so it compounds with TABLE-001. **Fix the two together or measure twice.**

### THEAD-001 · `TableHeaderCell` · size-mismatch

- **figma** — `TableHeaderCell` (`10298:18358`) is a fixed **56px** with padding `0/16/0/16` (no vertical padding). `TableRow variant=header` is **44px**.
- **code** — `TableHeaderCell.module.css:2` `padding: var(--space-12) var(--space-16)`, no height set → header derives as 12 + ~15 + 12 ≈ **39px** (+1px border).
- **verdict** — `code-wrong` on height, **but blocked**: the master contradicts itself (44 vs 56, see TROW-002), so the target value needs the owner's call before anything is applied.
- **proposed** — resolve the master first, then give the header row an explicit height and drop vertical padding to match the master's centring model.
- **blastRadius** — the header band of all six table screens. Smaller than TABLE-001, but together they set the table's entire vertical rhythm — exactly what an L3 template would freeze in place.

### STACK-002 · `Stack` / `Box` · structure-mismatch

- **figma** — n/a, code-only primitive.
- **code** — `Stack.module.css:4` has `min-width: 0`. **`Box.module.css` does not** — only `box-sizing`. `docs/components/layout.md:53-54` claims it is *"baked into both so flex children can shrink (text truncation, tables) without overflowing."*
- **verdict** — `code-wrong`. The doc states the intent, `Stack` implements it, `Box` does not. A `Box` used as a flex child will refuse to shrink below its content — breaking the exact truncation case the doc promises.
- **proposed** — add `min-width: 0` to `.box`. One line.
- **blastRadius** — any `Box` inside a row `Stack` containing long text: table cells, card headers, the `Headercard` title row. **Silent today.** It surfaces the first time real data is longer than the mock copy — i.e. precisely when `aegis` swaps placeholders for Supabase rows.

## Everything `medium` / `low`, by category

| category | medium | low | ids |
|---|---|---|---|
| prop-parity | 2 | 2 | `CARD-002`, `BADGE-001`, `TROW-001`, `GRID-001` |
| structure-mismatch | 2 | — | `STACK-001`, `TASK-001` |
| spacing-mismatch | 1 | 1 | `MODAL-001`, `TASK-002` |
| size-mismatch | 1 | — | `TROW-002` |
| radius-tier | — | 4 | `BADGE-002`, `ROW-001`, `MODAL-002`, `TCELL-002` |
| doc-stale | — | 4 | `DOC-001`, `DOC-002`, `DOC-003`, `BUTTON-001` |
| typography-mismatch | — | 1 | `THEAD-002` |

All four `radius-tier` findings are **right value, wrong token** — zero visual
change, pure conventions hygiene (a primitive referenced where the cascade wants
a semantic/component token). They can be batched into one cheap commit.

Full detail for every id: **`audit/code-parity-findings.json`**.

## Things that touch an `aegis` decision

Per brief §8.5, these three were checked specifically:

1. **`Stack columns` — NOT invalidated. It works.** `.columns` gives
   `flex: 1 1 0` + `align-items: stretch` + `min-width: 0` on children, i.e.
   genuinely equal width *and* equal height. Screen-composition §9 is safe to
   keep as house law. **But** (`STACK-001`) `<Stack columns>` *without*
   `direction="row"` silently does nothing — `.stack[data-direction='column']`
   (specificity 0,2,0) beats `.columns` (0,1,0), and `direction` defaults to
   `column`. Every current call site passes `direction="row"`, so nothing is
   broken today; making `columns` mandatory raises the odds of the bare form
   being written. Worth hardening *before* the templates land.

2. **`TaskCard` — NOT invalidated. It does not force height from content.**
   `height: 100%`, title one-line-with-ellipsis, description clamped to 2 rows,
   footer on `margin-top: auto`. Copy length cannot change height. **One
   contract to document** (`TASK-001`): equal height requires a *stretching*
   parent (grid row, or `Stack direction="row" columns`). Against an
   auto-height block parent, `height: 100%` collapses to content height — that
   is the one way a consumer can break the 3×3 grid, so the template must own
   the row sizing.

3. **No missing variants.** Every variant the Alerts screens need exists in both
   surfaces. The only axis gaps run the *other* way — code offering more than
   the master (`Card padding="xl"`), or deliberately offering less
   (`TableRow` dropping Figma's `variant=header` / `state=hover`, which
   conventions actually endorse).

## Answers to the code-side questions (`PARITY-AUDIT-CODE.md` §5)

That table arrived mid-audit and asked 11 questions of the master. The
extraction answers most of them outright:

| # | question | answer from the master |
|---|---|---|
| **C1** | Grid's gap scale narrower than Stack's | **No master to arbitrate.** Neither layout primitive has a Figma master (`GRID-001`) — the sets named `Stack`/`GridFour` are Phosphor *icons*. This is purely a code-side consistency call. |
| **C2** | Card/Modal padding names offset by one step | **Confirmed, and it originates in Figma.** Card sm/md/lg = 12/16/20; Modal sm/md/lg = 16/20/24. **Both masters genuinely disagree and the code copies each correctly** — so this is `figma-wrong`, not a port error. New finding `CARD-003`. |
| **C3** | Modal uses `--radius-card` | **Confirmed** (`MODAL-002`). Master radius is 12, same as `--radius-modal` resolves to — invisible today, wrong token regardless. |
| **C4** | `Row` uses `--radius-sm`; should it be `--radius-chip`? | **Confirmed as a tier violation, but `--radius-chip` would be the wrong fix.** The master says radius **4**; `chip` is 6. The value in code is right — add a `radius.row → radius.sm` component token instead (`ROW-001`). |
| **C5** | Is Badge's 32px icon-side radius what the master says? | **Yes — verified per corner:** 32/6/6/32 at xs·sm, 32/8/8/32 at md·lg. Code is exact (`BADGE-002` is tier-only). |
| **C6** | Button/IconButton `xs` and `sm` identical box — collision or port error? | **Present in the master, so not a port error.** Master `xs` secondary and `sm` are both 28×28 at radius 6. Also confirmed: `xs` has **no** primary variant and `2xl` has **only** primary — exactly what the code's JSDoc says. IconButton's 12 vs 14px icons match too. |
| **C7** | Four focus recipes; confirm against the master's focus variant | **There is no focus variant.** Master states are `default \| hover \| disabled \| active` — focus was never designed. The code's ring geometry does faithfully match `state=active` (stroke goes 1.5/0/0/1.5 → 1.5/1.5/1.5/1.5). So the port is right and the *design* has the gap. New finding `BUTTON-002`. |
| **C8** | Badge inherits `label-md`'s weight/lh, overriding only size | **Correct today** — every Badge size in the master is weight 600 at 115%. The fragility is real but currently latent; no finding, worth the comment it already has. |
| **C9** | Header cell: `label.sm` or `text.overline`? | **`label.sm` wins decisively.** The master binds 13px / 600 / 115% — that is `label.sm`, nowhere near `overline` (10px extrabold). The only problem is the Figma *style name*, `text/badge-label/sm`, which is off-vocabulary (`THEAD-002`). |
| **C10** | 68px duplicated in three places, no token | **And the master says 56** (`TABLE-001`). Confirmed the third copy: `aegis/.cursor/rules/screen-composition.mdc:60` encodes "(capped at 68px)" — **that rule file has to change with any fix.** |
| **C11** | Raw px/rgba inventory — confirm against master effects | **Every geometry checked matches exactly.** Card inner shadow `4/4 b16` ✓; TaskCard drop `0/2 b12` ✓; Button inner `2/2 b12` + drop `0/1 b8`, hover drop `0/2 b12` ✓. Bonus: the master's `context=tasks` genuinely carries **no** drop shadow, matching the code's `box-shadow: none` override. Only the *colours* are unverifiable here, and they stay deferred under §5. |

## Two corrections to things previously stated

Both were caught by re-checking rather than trusting a prior claim:

- **`TableProgressStages` exists.** `aegis/PAGES.md` currently says it does not
  and routes it through the new-component pipeline. It is at
  `src/components/TableCell/TableProgressStages.tsx` — it was missed because it
  is nested inside the `TableCell` folder rather than having its own top-level
  directory. **`PAGES.md` needs that line corrected**; per brief §9 this audit
  does not edit the `aegis` repo, so flagging it here.
- **The header uppercase is NOT a finding.** The code applies
  `text-transform: uppercase` while the master's characters read `"Column"`.
  Checking `textCase` rather than the glyphs showed **`UPPER` on both the node
  and the style** — the master renders `COLUMN` too. Code is correct.

## Confirmed clean (checked, no finding)

- **§6.4 Button heights unified across variants** — yes: 28/28/32/36/40/44 per size, identical across `primary`/`secondary`/`tertiary`, with **one** documented exception (`tertiary xs = 24`, present in both master and code). The exception is height-only — `xs` radius is 6 for both variants — so the per-**size** `radius.button.*` token is safe.
- **§6.5 label ramp is `semibold`** — every checked component resolves to weight **600** in both surfaces (`Button`, `IconButton`, `Badge`, `SeverityBadge`, `TableHeaderCell`). No stray `bold`.
- **§6.6 `tight` line-height, no leading trim** — `--font-line-height-tight: 1.15` unitless; **`leadingTrim: NONE` on every text node across all masters checked**. A 1em icon cannot change a `Badge`/`Button` height (1em < 1.15em line box; `Button` also pins an explicit height).
- **§6.7 nudged label sizes** — 16 · 15 · 14 · 13 · 12 confirmed unbroken in tokens *and* in the masters.
- **§6.8 `Card` border top+left 1.5px + hand-tuned vignette** — master confirms `strokeSides 1.5/0/0/1.5` and `INNER_SHADOW 4/4 b16`, matching `Card.module.css:12-14` exactly. **No card-type component reinvented a full-perimeter border**: only `Card` and `Modal` declare the recipe, both top+left; `TaskCard` composes a real `<Card padding="md">`. The sidebar-glass recipe (`inset -1px -1px 2px`) appears in none of them — **no bleed between the two recipes**.
- **§6.11 `radius.container` / `radius.panel` both 12** — confirmed, and nothing in code assumes they differ; both are referenced by role, never by assumed value.

## Suggested triage order

1. **Decide the table's vertical rhythm** — `TROW-002` (pick 44 or 56) unblocks `THEAD-001`; then `TABLE-001` and `TCELL-001` land together. This is the whole high-severity cluster and it gates the L3 table template.
2. **`STACK-002`** — one line, silent bug, fix before real data lands.
3. **The four doc-stale fixes** — near-free, and `DOC-001` (`PageHeader`) is the highest value-per-character item in the audit, since docs are what coding agents imitate.
4. **`STACK-001`** — harden before `columns` becomes mandatory.
5. **The four `radius-tier` items** — one batched hygiene commit, zero visual risk.
6. **The two API decisions** — `CARD-002` and `BADGE-001` need an owner's call, not a fix.
