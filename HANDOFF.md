# Session handoff — Logistics CRM design system

Read this first if you're a fresh session. Everything below is also durable in
the repo (`CHANGELOG-renames.md` — full decision log, newest first;
`migration/journal.jsonl` — every Figma write, timestamped; `docs/`;
`.claude/skills/`).

Last updated: 2026-09-07 · repo HEAD `14ca952`

**Since the last full rewrite, the big-picture change: the whole system is
mid-migration from a 1920 design width to 1440 (25% viewport scale loss).**
Not a flat ×0.75 anywhere — type, radius, and Button/IconButton sizes were
each re-graded non-linearly (see §3, §5). This is an active, multi-step
effort — expect more components to get resized session over session.

---

## 1 · What this is

Building a design system for a **logistics CRM**. Two halves, kept in sync:

1. **Tokens + component library as code** (this repo) — the source of truth.
2. **A Figma file** (`figmosha des sys`, a **copy** — never the original) being
   migrated to match, driven by the `figmosha2` bridge.

Owner: Bogdan (`bazbogdanoff-hub` on GitHub). Working style: decisive, wants
recommendations not options, gets annoyed by code churn — **finalise a
component's spec in chat, then write it in one pass.** Don't change committed
component code without an explicit go-ahead. He builds/edits Figma himself
most of the time; increasingly he's also had Claude build/edit Figma directly
via the bridge (see §4) — StatButton, StatCard's rename, Badge's warning-strong
tone, the AppShell/Page/Grid layout components and all their guides were
Claude-built. When Claude builds in Figma: **always save a named Figma
version checkpoint first** (`safe-edit: <description>`), then verify with a
read-back extract.

## 2 · Repo & GitHub

- Local: `C:\Users\Dell\IdeaProjects\design-system` · branch `main`
- Remote: **https://github.com/bazbogdanoff-hub/design-system**
- `dist/` and `src/styles.css` are gitignored — `npm run build` regenerates
  (`prepare` hook runs it on install)
- End commits with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`
- **When editing files with embedded backticks/template-literal-looking text**
  (e.g. writing Markdown with code fences via a `node -e` one-liner), the shell
  quoting breaks easily — prefer the **Edit/Write tools** over `node -e` /
  heredoc tricks for repo file edits. Several commits this session had a
  doc-update step silently fail this way and needed a follow-up fix commit.

## 3 · Tokens — DONE (repo + Figma), still receiving small additions

DTCG JSON in `tokens/` → `build/` (CSS vars + JS + d.ts) via Style Dictionary.
`npm run tokens` (or the `figma-safe-edit` generator, see §4) rebuilds after
any token edit — **always run it and `npm run build` after touching
`tokens/*.json`.**

| file | tier | notes |
|---|---|---|
| `primitives.color.json` | primitive | full Tailwind palette |
| `brand.color.json` | primitive | `color.brand.*` → `color.indigo.*`; `color.extra.card` = `#fcfcfc` |
| `alpha.color.json` | primitive | `color.alpha-black.{1,3,5,10,15,20,25,30,40,50,60,70,80,90,100}` — hand-written, NOT in `primitives.color.json` (that file is regenerated from Tailwind every build and would wipe it) |
| `semantic.color.json` | semantic | `color.{background,surface,text,border,icon,chart}.*` |
| `component.color.json` | component | `color.{button,card,page,input,badge,table,modal,scrollableArea}.*` |
| `primitives.type.json` + `semantic.type.json` | — | Plus Jakarta Sans, **20** composite `text.*` styles |
| `primitives.layout.json` + `semantic.layout.json` + `component.layout.json` | — | `radius.*` (now up to `5xl`/32px), `space.*` (4px grid + 2/6/10) |

**Figma:** collections `Primitives` / `Semantic` / `Component` + 20 `text/*`
styles — all built from token JSON via
`.claude/skills/figma-safe-edit/scripts/tokens-to-figma.mjs` →
`migration/build-0*.js`. The generator handles: colour primitives/aliases,
`radius.*` (all per-size now — `radius.button` was per-variant×size, flattened
in the 1440 migration, see below), `space.*`, and `font/*` primitives
(family/size/weight — **not** line-height/letter-spacing, see gotcha in §6)
bound onto every text style. **Its allow-list regexes need a manual update
every time a new token family is added** — see the gotcha in §6, it's bitten
several additions already.

### 1440 migration — the type scale, radius scale, and Button/IconButton sizes

Non-linear everywhere — never a flat ×0.75. Type: `display`/`heading` lose
close to the full 25% (headroom to spare), `body`/`label` lose only 6–11%
(protecting legibility), and the floor (`label.xs`/`caption`/`overline`, plus
now `label.sm`) doesn't shrink further. Every new value reuses an existing
`font.size.*` step — roles slide down, nothing invented. Current label ramp:
**xl16·lg15·md14·sm13·xs12**, weight **semibold** (was bold for a stretch,
reverted). Full table in
`.claude/skills/design-system-conventions/references/typography-tokens.md`.

Radius: `radius.container` (Card/Modal) cut from `2xl`(16) to `xl`(12) — now
identical to `radius.panel`, a known floor collision, not yet resolved.
`AppShell`/`Page` got their **own** radius, deliberately split off from
`radius.container` since a full-viewport surface shouldn't share a card's
radius: new `radius.page-container` → `radius.4xl`(24) → component
`radius.page`. New primitives `radius.3xl`(20)/`4xl`(24)/`5xl`(32) to support it.

`radius.button` **flattened from per-variant×size to per-size** —
`Button`'s whole size scale got unified across variant (was a relative scale,
e.g. primary used to be 36/40/44/56 while secondary/tertiary were 28/32/36/40;
now they're identical) plus two new exception sizes: `2sm` (secondary/tertiary
only) and `2xl` (primary only) — 60 variants, was 48. `radius.button.{2sm,sm,
md,lg,xl,2xl}` = 6,6,8,8,8,12. `IconButton` was brought to full parity
(resized its primary sm/md/lg/xl, added the same 2sm/2xl exceptions) — also
60 variants now. `Filter`/`FilterIcon` (which restrict Button/IconButton to
two sizes) shifted with it: now `sm`/`md`, was `lg`/`xl`.

New primitive ramp: `color.alpha-black.{1,3,5,10,15,20,25,30,40,50,60,70,80,
90,100}` — a layerable black-alpha scale for hover/press washes that
composite over whatever's underneath instead of an opaque swap. New semantic
`color.background.overlay-subtle` → `alpha-black.3`, used by
`table.row.shadow.hover` / `scrollableArea.row.shadow.hover` (a shared token —
rows have no fill by default, so hover is an inset shadow, not a background).
New semantic `color.background.muted` → `zinc.300`, used by `AppShell`'s
content-slot backdrop (was `background.subtle`/zinc.100, too light once you
compare it against real content).

### Earlier decisions, still current

- `color.border.highlight-active` (brand.500) + `color.card.border-active` —
  the shared glass focus/active treatment: the white top-left 1.5px catch
  becomes a full 4-side 1.5px primary border on `:focus-visible`/`:active`.
  Used by StatButton, Button-secondary, Button-primary.
- `color.button.primary.*` — background `brand.400`→`.hover brand.500`
  (a **button-only** lightening gimmick; `color.text.brand`/`color.icon.brand`
  stay at 600 everywhere else), `text`/`icon` → `on-brand` (white).
- `color.button.tertiary.*` (replaced the old `ghost`) — `text.default
  {color.text.strong}` / `text.active {color.text.brand}`, `icon` mirrors.
- Badge has 6 tones including **`warning-strong`** (orange, for
  SeverityBadge's `attention` level). `color.badge.warning.text` deliberately
  lightened to `{color.amber.600}` so it reads distinctly from
  `warning-strong` — ~3.2:1 contrast accepted, level differentiation judged
  the bigger a11y win.
- StatButton's value text: `color.text.default` → `color.text.strong` (one
  step lighter than a main Card/StatCard heading).

## 4 · Figma bridge — per session

figmosha2 cloned to `C:\Users\Dell\IdeaProjects\figmosha2`. `bridge.mjs` there
is a **Node port** of the Python `bridge.py`.

Every session:
1. Open the **copy** in **Figma Desktop** (confirm file name = `figmosha des sys`).
2. Figma → Plugins → Development → **Figmosha Bridge** (green = connected).
   **The plugin disconnects on its own sometimes mid-session** — if a call
   returns "plugin not connected", just tell the user to reopen it, no bridge
   restart needed.
3. Terminal (or background Bash tool call): `node C:\Users\Dell\IdeaProjects\figmosha2\bridge.mjs`
   — leave running. If the background process dies (exit code ≠ 0 in its
   output file), just relaunch it.
4. `node scripts/figma/fig.mjs scripts/figma/ping.js` — must return the file name.

`fig.mjs` sends a Plugin API snippet (function body, ends in `return`), prints
JSON. `--out <file>` for big dumps. Exit 2 = bridge down, 3 = plugin not open.
Write snippets to the scratchpad dir, not inline heredocs, when they're
non-trivial — easier to fix and re-run.

**Every write batch: `saveVersionHistoryAsync('safe-edit: …')` first.** The
file has reverted uncommitted Figma changes at least twice this session
(closed/reopened without saving, or a version restore) — always remind the
user to **save the Figma file** after a batch of bridge writes, and re-verify
with a read-back before assuming a change stuck.

## 5 · Component library — status

`src/components/` — React + TS, **CSS Modules against token vars**, `clsx` for
class merge (`cn()` in `src/lib/cn.ts`), Radix `Slot`/`Slottable` for
`asChild`. Vite lib build (ES + CJS + rolled d.ts). Docs = markdown in
`docs/components/`.

- `npm run build` → `dist/{index.js,index.cjs,index.d.ts,styles.css}`
- consume: `npm i github:bazbogdanoff-hub/design-system` then
  `import '@bazbogdanoff/design-system/styles.css'` + `import { X } from '@bazbogdanoff/design-system'`

### Done, both sides (Figma component clean + React built + docs)

| component | tier | notes |
|---|---|---|
| **Card** | L1 | padding-only variant, glass surface, `box-shadow: inset` (not `border`) |
| **Badge** | L1 | `tone`(6: neutral/brand/success/warning/warning-strong/danger) × `size`(sm/md/lg), optional `icon` |
| **SeverityBadge** | L2 | composes Badge; `level`×`size`×`format`(pill/icon); pill has **no icon** (colour+bold text carries it), icon format = bare triangle |
| **StatButton** | L2, interactive | first Claude-Figma-built component; `tone`×`size`×`state`(default/hover/active/disabled, 20 variants); shares `Viginette/2xs`/`…hover` glass shadow pair with Button |
| **StatCard** | L2 | composes `Card padding=lg`; `badge` is a Figma *variant* not boolean (its content sits in Card's slot, which can't take component properties); `children` = StatButton row in React, 2 fixed instances in Figma |
| **Button** | L1, interactive | `variant`(primary/secondary/tertiary) × `size`(`2sm`·`sm`·`md`·`lg`·`xl`·`2xl` — **unified across variant now**, see §3; `2sm` is secondary/tertiary-only, `2xl` primary-only) × `state`(4) = 60 variants. `leadingIcon`/`trailingIcon` (both allowed at once), `loading` (spinner in leading slot — **Figma can't invert a boolean**, so the icon-hiding-on-loading only happens in React, not the Figma reference), shared `.surface` CSS class |
| **IconButton** | L1, interactive | square, one icon, **`aria-label` required** (TS-enforced union type); cloned from Button in Figma, now at full size parity with it (60 variants — primary resized, `2sm`/`2xl` added by cloning the nearest existing variant), imports Button's `.surface` in React — 0 new tokens |
| **Filter** | L2 | `Button` fixed to `variant="secondary"`, restricted to `sm`/`md`. Figma nests a real `Button` instance per size×state (not cloned) so it inherits states/tokens for free |
| **FilterIcon** | L2 | same pattern off `IconButton`; fixed funnel icon (bundled `FunnelIcon.tsx`, not a prop — matches Figma, where `iconSwap` isn't exposed) |
| **FilterBar** | L2 | `Stack(row, gap=md)` + a `FilterIcon` trigger + a `Filter` slot (`children` in React, a real Figma `SLOT` named `filters`) |
| **ScrollableArea** | L1 | generic `overflow-y:auto` container, recessed background + inner-shadow edges, no variants. `min-height:0` in the CSS (flex-column gotcha) isn't modeled in Figma |
| **ChartLegend** | L1 | swatch+label per series, built from a screenshot, no Figma involved |
| **ChartTooltip** | L1 | every-series-at-once hover/focus readout; positioning owned by the chart, not itself |
| **BarChart** | L1 | stacked SVG bar chart — first data-viz component; built per the `dataviz` skill's procedure (form → validated color → marks → interaction → accessibility). No colors hardcoded — reuses `color.chart.1` + `color.background.warning-strong`, no new tokens. Visible table-view toggle not built yet (a hidden `<table>` covers the accessibility requirement) |
| **ChartCard** | L2 | composes `Card` + `ChartLegend` + a `Filter`-based filters slot. Filters are **per-card** — a deliberate deviation from the dataviz skill's "one shared filter row" guidance, matching the product's actual mockups |

### Layout / shell — built this session, **in progress**

| component | tier | notes |
|---|---|---|
| **Box** | L1 | token `p`/`px`/`py`/`bg`/`radius`/`border`; no layout logic |
| **Stack** | L1 | flex, `direction`/`gap`/`align`/`justify`/`wrap`/`columns` (row, equal stretch) |
| **Grid** | L1 | **12-column** CSS grid (code default, overridable via `columns` prop), `Grid.Item span` (uneven splits = different spans, e.g. 8+4, 3+3+6). **This is the one true content-layout tool** — a row-grid was tried and rejected (876px content height ÷ 8 rows = 90.5, not clean; decided rows always flow by content height, never gridded). Note: `Page`'s own Figma layout-grid guide is now **16** columns (see below) — that's the guide's own reference count, not a change to `Grid`'s code default; unconfirmed whether `Grid` should also move to 16 |
| **AppShell** | shell | `sidebar`(collapsed 64px / expanded 240px) variant; fixed viewport (`100dvw`×`100dvh`), only the content region scrolls. Content-slot background `color.background.muted`(zinc.300, was subtle/zinc.100), radius `radius.page`(24, its own token — see §3) |
| **Page** | shell/L2 | `layout="scroll"` (whole page scrolls+padded) or `"fixed"` (grid rows, only `Page.Body` scrolls); `Page.Header`/`Body`/`Footer`, each takes `bleed` to go flush to the content-card edge. **Both sides done** — the 4 content-region frames were converted to real Figma Slots (owner, manual). The 12-col reference guide now lives as a **native Figma layout grid** on `Page` itself (`layoutGrids`, editor overlay, no separate frame) — currently **16 columns**, `gutterSize`/`offset` both 16, up from 12 |
| `breakpoints.ts` | util | `sm640/md768/lg1024/xl1280/2xl1536` (Tailwind values) + `up()`/`down()` helpers. Design screens at **1440** now (migrating down from 1920 — see the top of this doc), spot-check 1280. `lg` (1024) is the real desktop floor — below it the sidebar should collapse (not yet wired to a media query anywhere). |

### In progress — Figma built, React not started

| component | tier | notes |
|---|---|---|
| **ListCard** | L2 | nests a real `Card`(`padding=md`) instance — Header/Filters/Body inside it, in a `Stack (column, gap=xl)` wrapper frame. No variants (single component) — the `description` toggle lives on the nested `ListCardHeader`, not on `ListCard` itself (see below) |
| **ListCardHeader** | L1 | heading + optional description line. `description` is a real **boolean** on `ListCardHeader`'s own definition (valid despite being nested inside `Card`'s slot — the "no boolean inside a slot" restriction only blocks a *parent* reaching into a slot from outside, not a component's own internal boolean). Exposed up via Figma's nested-instance-properties, one level only — reaches `ListCard`'s panel since `ListCardHeader` is `ListCard`'s own direct child |
| `ScrollableAreaRow` | L1 | **not built yet** — next planned piece, goes inside `ScrollableArea`'s `content` slot inside `ListCard.Body` |

**Composition rule (settled, don't re-litigate):** `AppShell` content slot →
`<Page>` → `Grid`/`Stack` of cards. **Never cards directly in the slot** — the
slot is dumb chrome, `Page` owns padding/scroll/sticky/header. **Screens are
not design-system components** — they're app pages/routes that render
`<AppShell sidebar={<CrmSidebar/>}><Page>…</Page></AppShell>`; in Figma a
screen is a frame nesting one `AppShell` instance with the slot filled, never
a component of its own.

**Figma layout guides — zero standalone frames, by design.** Three were tried
and all three are gone: two deleted outright by the owner, the third
(`Content grid — layout guide`, a documentation frame) replaced by the native
Figma layout grid now sitting directly on `Page` (see the table above). Don't
recreate any of them if you see stale docs/chat referencing one. The grid's
`gutterSize`/`offset` (16/16) don't match `Grid`'s own code default
(`gap="md"` = `space-12`) — unconfirmed whether that's intentional; the grid
guide is just a visual reference, real gutters come from whatever `gap` an
actual `Grid` instance uses.

**Naming convention for plain (non-component) layout frames** — settled: name
them so they read as a literal JSX transcription. `Grid` / `Grid.Item
(span=8)` / `Stack (row, gap=md)` — only state a prop value when it's not the
code default. `ListCard`'s own wrapper is `Stack (column, gap=xl)` as a live
example.

**Known TODO, flagged repeatedly, not yet done:** AppShell/Page/IconButton/
Button dimensions (sidebar width, gutter, button/control heights) are literal
px in the CSS, not tokens. A `size/control/*` (and maybe `size/app/*`) token
family was discussed as the next cleanup but never built.

### Not started

`Input`, `Select`, `Tab`, `Alert` (from `Info message`), `DataTable`,
`NavItem`/`NavSection` (sidebar content), `Pagination`, `EmptyState`. Next up
per the live thread: **`ScrollableAreaRow`** (finishes `ListCard`), then
whatever's next in the 1440 resize pass (component-by-component, owner-driven
— check CHANGELOG-renames.md's newest entries for what's already been done),
then `size/control/*` tokens → `Input`+`Select` → `Tab` → `DataTable`.

## 6 · Known gotchas (Figma plugin API specifics learned this session)

- **`figma.createSlot()` does not exist in the plugin API.** Slot creation is
  Figma-UI-only. When a component needs a slot, build the frame structure via
  the bridge, name it clearly (e.g. `"content  (convert to Slot)"`), and ask
  the user to do that one click.
- **`layoutSizingHorizontal`/`Vertical = 'FILL'` only works on children of an
  auto-layout parent.** You cannot set it on a top-level `COMPONENT` that is a
  variant inside a `COMPONENT_SET` (the set isn't an auto-layout frame in that
  sense) — use `primaryAxisSizingMode`/`counterAxisSizingMode` on those, and
  size the instance with FILL only after it's placed inside a real auto-layout
  parent (e.g. once dropped into AppShell's content slot).
- **`layoutGrow` only accepts `0` or `1`** in this Figma API version — no
  proportional grow values. For "span N of 12" style proportional widths,
  compute literal pixel widths and set fixed sizes instead.
- **`counterAxisAlignItems` does not accept `'STRETCH'`** — only
  `MIN`/`MAX`/`CENTER`/`BASELINE`. For stretch-to-fill-height in a row, give
  children a fixed height or `layoutSizingVertical = 'FILL'` individually.
- Text-node `.title` is a reserved HTML attribute name — when building a props
  interface for something like `Page.Header`'s `title` prop, `Omit<'title'>`
  from any base `HTMLAttributes` you extend, or TS conflicts.
- Figma UI goes stale after plugin writes — close/reopen the Variables /
  Text-styles panel to see changes.
- Redefining an existing text style via the API was assumed to be ≈50s each
  (synchronous reflow) — **turned out not to hold**: redefining all 20 text
  styles (4 batches of 5) for the full 1440 type-scale migration took under
  8 seconds combined. Keep the `≤5 createTextStyle` / `≤4 screens`-per-exec
  batching anyway (still the safe default for anything walking node trees —
  a wedged plugin leaves a zombie client, no cancel), just don't expect it to
  be slow.
- A Figma **version restore** unwinds everything after it — re-run the
  affected idempotent `migration/*.js` scripts.
- `strokesIncludedInLayout: false` + `strokeAlign: INSIDE` = layout-neutral
  stroke (matches CSS `box-shadow: inset`, not CSS `border`, which inflates an
  auto-height box). This was Card's original bug; the whole "glass catch → CSS
  inset box-shadow" pattern used everywhere (Card, StatButton, Button) comes
  from this.
- **`figma.combineAsVariants()` rejects `FRAME` children** — "Cannot move
  node. A COMPONENT_SET node cannot have children of type other than
  COMPONENT." Build each variant with `figma.createComponent()` directly, or
  convert a frame via `figma.createComponentFromNode()` before combining.
- **Adding new variants to an *existing* component set**: `clone()` the
  nearest existing variant (not `createComponentFromNode`/from scratch),
  rename it to the new `prop=value, ...` combination, resize whatever
  actually differs, then `existingSet.appendChild(clone)`. Figma registers it
  as a real new variant option automatically (confirmed via
  `componentPropertyDefinitions` after) — this is how `Filter`/`Filter — icon`
  got their 8 variants each and how `IconButton` grew from 48 to 60.
- **Nested-instance property exposure only reaches one level.** A property
  exposed on a component only bubbles up to its *direct parent's* panel. If
  the parent itself isn't also set to expose nested instances, a grandparent
  won't see it — and don't turn "expose nested instances" on for a
  widely-shared primitive (`Card`) just to reach one specific grandchild
  (`ListCardHeader`); that surfaces whatever's in *every* Card's slot,
  everywhere. Select the deeply-nested instance directly instead — normal,
  not a defect.
- **Figma variable names with spaces vs. code's kebab-case**: hand-typing a
  Figma variable/property name (e.g. `radius/page container` instead of
  `radius/page-container`) silently breaks the code↔Figma alias lookup the
  token generator relies on (name-based). Renaming the Figma variable is
  a safe fix — aliases are ID-based, so it only changes the display name.
- **The token generator's regexes need updating every time a new
  component/primitive family is added** (`isColorComponent`,
  `isColorPrimitive`, and the two inline radius regexes in
  `tokens-to-figma.mjs`) — they're hardcoded allow-lists, not derived from
  the token files. This bit `scrollableArea`, `alpha-black`, `4xl`/`5xl`, and
  digit-leading segments like `2sm`/`2xl` (a plain `[a-z]+` doesn't match
  them) — each time, the generator silently dropped the new tokens
  (`created: 0`, no error) instead of failing loudly. Always check `created`
  count against what you expect after adding a new family.
- **`figma.getNodeByIdAsync()` called directly on a compound sublayer ID**
  (the `I<instance>;<override>;<node>` format Figma returns for a node nested
  inside a component instance) **is unreliable** — hit 3 consecutive
  connection-timeout failures on one specific ID while a trivial no-op script
  and a bare `figma.loadAllPagesAsync()` both succeeded in between, ruling out
  a general bridge outage. It wasn't a stale-ID problem either (re-traversing
  from scratch returned the exact same ID string). **Fix: don't resolve
  compound sublayer IDs directly.** Fetch the top-level instance/component by
  its plain ID once, then reach the nested node with `.findOne((n) => n.name
  === '...' )` tree traversal from there — worked on the first try. Prefer
  this pattern generally for any script that targets something nested inside
  an instance, rather than caching/reusing a compound ID across separate
  `fig.mjs` calls.

## 7 · Where things live

```
tokens/                       DTCG source of truth
build/                        generated CSS/JS/d.ts (gitignored)
src/components/<Name>/        React components (see §5 for the full list)
src/lib/breakpoints.ts        breakpoint constants + up()/down()
src/lib/cn.ts                 class-merge helper
docs/components/<Name>.md     per-component specs
docs/architecture.md          L1/L2/L3 model
.claude/skills/
  design-system-conventions/  naming + structure contract, all catalogs, component-build workflow
  figma-audit/                 read-only inventory (built pre-session, superseded by hand-driven work)
  figma-safe-edit/             tokens-to-figma.mjs generator + safe-edit discipline
scripts/figma/fig.mjs         the bridge helper
migration/
  journal.jsonl                every Figma write this whole project, timestamped — READ THIS for full history
  build-0*.js                  generated idempotent token→Figma snippets (gitignored, regen via tokens-to-figma.mjs)
CHANGELOG-renames.md           every rename/decision, newest first — the detailed companion to this file
```

## 8 · Immediate next steps

1. Bring the bridge up (§4) — reopen Figmosha Bridge plugin in Figma Desktop,
   restart `bridge.mjs` if needed, `ping.js` to confirm.
2. **Build `ScrollableAreaRow`** — the next planned piece, finishes `ListCard`
   (goes in `ScrollableArea`'s `content` slot inside `ListCard.Body`). Two
   very different row shapes were shown as reference (icon+text+timestamp vs.
   text+text+badge) — a strong signal the row itself should stay dumb
   (padding, divider-between, hover, freeform `children`), not bake in a
   specific content layout.
3. **The 1440 resize is ongoing, component by component, owner-driven** — the
   owner resizes something in Figma, tells Claude, Claude checks + resyncs
   React + documents. Check `CHANGELOG-renames.md`'s newest entries for
   what's already been migrated before assuming a component's dimensions are
   current; `Card`, `StatButton`, `StatCard`, `AppShell`, `Page`, `Button`,
   `IconButton`, `Filter`, `FilterIcon` are done, most other components
   (`Badge`, `SeverityBadge`, `FilterBar`, `ScrollableArea`, `ListCard`) have
   not explicitly been resized yet — don't assume they're covered.
4. Once the resize settles down: `size/control/*` tokens (promote the
   remaining literal-px control heights) → `Input`+`Select` → `Tab` →
   `DataTable` (validates the whole shell: `Page layout="fixed"` + `bleed` +
   sticky header) → `NavItem`/`NavSection`.
5. Deferred, not blocking: migration task `E` — node-rebind screens/components
   off the old shim collections (`shadcn colors`, `theme`, `border radii`,
   `Title/*`), then delete those collections. Do it gradually as each
   screen/component is rebuilt for real.
