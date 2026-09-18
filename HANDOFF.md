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
only, since renamed to `xs` — see §6) and `2xl` (primary only) — 60 variants,
was 48. `radius.button.{xs,sm,md,lg,xl,2xl}` = 6,6,8,8,8,12. `IconButton` was
brought to full parity (resized its primary sm/md/lg/xl, added the same
xs/2xl exceptions) — also 60 variants now. `Filter`/`FilterIcon` (which
restrict Button/IconButton to two sizes) shifted with it: now `sm`/`md`, was
`lg`/`xl`.

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
| **Button** | L1, interactive | `variant`(primary/secondary/tertiary) × `size`(`xs`·`sm`·`md`·`lg`·`xl`·`2xl` — **unified across variant now**, see §3; `xs` (was `2sm`) is secondary/tertiary-only, `2xl` primary-only) × `state`(4) = 60 variants. `leadingIcon`/`trailingIcon` (both allowed at once), `loading` (spinner in leading slot — **Figma can't invert a boolean**, so the icon-hiding-on-loading only happens in React, not the Figma reference), shared `.surface` CSS class |
| **IconButton** | L1, interactive | square, one icon, **`aria-label` required** (TS-enforced union type); cloned from Button in Figma, now at full size parity with it (60 variants — primary resized, `xs`/`2xl` added by cloning the nearest existing variant), imports Button's `.surface` in React — 0 new tokens |
| **Filter** | L2 | `Button` fixed to `variant="secondary"`, restricted to `sm`/`md`. Figma nests a real `Button` instance per size×state (not cloned) so it inherits states/tokens for free |
| **FilterIcon** | L2 | the **add-filter** trigger off `IconButton`. Funnel at rest → **"+" on hover / press / `aria-expanded`** (pure-CSS 2-glyph swap; `FunnelIcon`/`PlusIcon` both bundled, neither a prop). Default `size` `sm`. Figma set `10075:13138` toggles the same glyphs per `state`. Future: click opens a show/hide-filters menu |
| **FilterBar** | L2 | one flat `Stack(row, gap=md, align=center, wrap)` holding `{trigger?}{children}`. Trigger renders only if `onAddFilter` is passed (rule "always present" dropped); whole bar returns `null` with no trigger + no `Filter`s. Props: `onAddFilter`/`addFilterLabel`/`addFilterMenuOpen`. Figma: the `Filter — icon` now sits **inside** the wrapping `filters` SLOT (`layoutWrap: WRAP`), not as a pinned sibling |
| **ScrollableArea** | L1 | generic `overflow-y:auto` container, recessed background + inner-shadow edges, no variants. `min-height:0` in the CSS (flex-column gotcha) isn't modeled in Figma |
| **Input** | L1 | React port + Figma at full parity, kept in sync in both directions. React: `size`×`state` base, extended **code-first** with `leadingIcon`/`trailingIcon` + `prependText`/`appendText` (`color.input.icon`/`color.input.affix`, both state-invariant); border/background/radius live on a wrapper span, not the native `<input>`. Figma (`10223:14055`): `filled` variant (true/false, → 30 variants: `size`×`state`×`filled`) so the set can show a typed value (`color/input/text/default`) vs placeholder; same 4 accessories as **boolean component properties** (non-multiplying, same mechanism as `Row`'s `hasStatus`/`hasAction`) bound to hidden-by-default layers. Fixed 2 real bugs in passing: a duplicate stale `"input"` key in `component.color.json` (silently shadowed, deleted), and `itemSpacing: 0` on every Figma variant (fine with one child, not five — set to `space/8`). **2026-09-11: owner then resized the control a full step up in Figma** (sm 28→36, md 32→40, lg 36→44px) — ported back into React via new component-tier tokens `size.input.{sm,md,lg}` (36/40/44px), deliberately split off from `size.control.*` (confirmed Button's own Figma set is unchanged at 28/32/36) |
| **HelperText** | L1 | Icon (fixed per `tone`: `InfoIcon`/`WarningIcon`) + message, `tone` `primary`/`error` only (no `default` — never renders otherwise), icon+text always the same tone color, `role="alert"` on error. Sized to `Input`'s own icon/text scale. Named to avoid colliding with the real (not-yet-built) hover-triggered `Tooltip` popover. Figma: 6 variants (`10264:18161`), reuses the file's own `Info`/`Warning` icons — distinct from the pre-existing `Info message` (`4205:6290`), which is the future `Alert`/`Callout` precursor, left untouched |
| **FormField** | L2 | `label` (headline, colored by `state`) + `children` (usually `Input`) + conditional `HelperText`. `state` `default`/`primary`/`error` — only the latter two show `helperText`. `size` cascades to a bare `Input` child (same mechanism as `LabelGroup`→`Label`); an `Input` with its own `size` wins. Named `FormField` (not "input container") — generalizes past `Input` for `Select`/`Textarea` later. Figma: 9 variants (`10264:18328`) — `content` is now a real Slot (owner converted it); `HelperText` instance present only on `primary`/`error`. **2026-09-11: headline text style is one `text/label/*` step DOWN from `size`**, not same-size (`sm`→`xs`, `md`→`sm`, `lg`→`md`) — same downshift `Row`'s `LabelGroup` uses for its description; owner corrected this in Figma, React's CSS updated to match |
| **EntitySummary** | L2 | Clickable entity icon (real `IconButton`, navigates to that entity's own page — **not** decorative, don't swap it for `IconCell`) + heading/description + trailing count `Badge`, on `color.background.brand-subtle`. Extracted from `RigProblemDetail`'s 3 identical columns — Figma `10264:19623` (single component, no variants) built first, React ported to match exactly. Deliberately not `Row`-based — see `EntitySummary.md` for the 3 reasons |
| **EmptyState** | L1 | Icon (default: success-colored checkmark) + heading + optional muted description, centered. Generic — not itself about "no issues." First real use: `EntityProblemPanel`'s `state=empty`. Figma `10264:21655` + React built |
| **TableHeaderCell** | L1 | Figma + React. Figma (`10298:18358`, 3 variants: `select`/`label`/`end`). `label` = text + `CaretUpDown` gated by a new `hasSort` boolean. `select` is checkbox-only — "select all" is inherently multi-select. Replaces the ad hoc "Header cells" layers on the owner's Fleet Problems table (kept the old table intact, this is a fresh build). React: a real `<th scope="col">`, one component instead of 3 variants — `sortable`/`sortDirection`/`onSort` cover `label`'s real behavior, `select`/`end` are just `children` (a checkbox, or nothing) |
| **TableCell** | L1 | Figma + React. Figma (`10298:18423`, 9 `content` variants: `select`/`text`/`textStrong`/`badge`/`action`/`actionStatus`/`progress`/`iconOnly`/`custom`). Replaces the old "Cell" component's 5-variant set (`Main text`/`Secondary text`/`Progress`/`Only icon`/`Ahy Element` wildcard) — redesigned, not ported: merged the near-duplicate Main/Secondary text into `text`/`textStrong` (same shape, split by emphasis, dropped both's redundant embedded alert-icon toggles); promoted the wildcard's two most common uses (a `SeverityBadge` pill, a `Button`) into first-class `badge`/`action` types, keeping `custom` as a real escape hatch only. `select` holds a real `Checkbox` with an `INSTANCE_SWAP` property to become a `Radio` — one control cell for both multi- and single-select tables (owner's ask). `progress` is a bespoke rebuilt dot/line stage tracker — checked `Tracker` first as a possible reuse, wrong shape (it's a time-left countdown card), so kept bespoke; worth promoting to its own component if this shape recurs. **2026-09-13: the owner nested a real component into `progress`'s content** — a pre-token component they'd used before, found as "Progress bar" (`4182:3097`, `Property 1`=1–5) bound to old `shadcn colors` variables. Adopted it the same way as `Switch`→`SegmentedControl`/`Check`→`Checkbox`: renamed to `TableProgressStages` (avoiding collision with the real linear `ProgressBar`), renamed its variant property to `stage`, rebound its 3 old variables onto new `color.tableProgressStages.{filled,unfilled,ring}` tokens. `text`/`textStrong` also both gained a shared `hasAlert` boolean gating a new 16px `Warning` icon instance (`color/icon/warning-strong`) — for flagging a fact about the cell's own value (e.g. a date expiring soon), not an interaction state. **2026-09-13: `content=badge` gained a `badgeSwap` `INSTANCE_SWAP` property** (default `Badge`, suggests `SeverityBadge`) — found while building a Maintenance & repair screen that a badge cell showing Attention/Warning/Critical was using plain `Badge` when it should've been the real `SeverityBadge` (that's exactly what it exists for); React never needed this fix (composing `<TableCell><SeverityBadge/></TableCell>` already just works), it's a Figma-only gap now closed the same way `select`'s Checkbox↔Radio swap already worked. Text sizes: title `text/body/sm`, supporting `text/body/xs` (same pairing `EmptyState` uses). `content=custom`'s inner placeholder still needs the owner's one-click Slot conversion. **All 9 variants now have NO fill (transparent)** — row-level color (default/hover/active/danger/success) is `TableRow`'s job alone; a solid cell fill would have hidden every row state change underneath it. React: a plain transparent `<td>` + 2 new helpers (`TableCellText` for the icon+title+supporting shape — one `emphasis` prop instead of Figma's two separate variants; `TableProgressStages` for the dot/line tracker) — `badge`/`action`/`iconOnly` needed no wrapper, already composable with `Badge`/`Button`/`IconButton` directly |
| **Table** | L2 | Figma + React. Figma (`10302:18481`, single component, no variants). Root replicates `Card`'s exact fill/border/shadow/radius (copied the real Card master's bound tokens — `color/card/background/default`, `color/card/border`, per-side stroke weights, its "vignette xs" inner-shadow effect, and `radius/table` — note: Card's own Figma master is currently bound to a variable literally named `radius/table`, not `radius/card`; a pre-existing oddity spotted in passing, not introduced or fixed here, both currently resolve to 12) rather than nesting a real `Card` **instance** — nesting one would put the `content` Slot 2 instance-levels deep (`Table` instance → nested `Card` instance → stack → Slot), exactly the `insertChild` restriction already logged in §6, so every future row-insert into a real table would need `detachInstance()`. `clipsContent=true` so flush rows respect the rounded corners. 3 stacked regions (`itemSpacing` `space/16` between them): `header` (padding `space/16`, space-between — `filters` Slot left, `actions` Slot right, 0-to-N buttons need no boolean since an empty/hug Slot just collapses), `content` (the real Slot, zero padding so rows go edge-to-edge — holds the header `TableRow` + body `TableRow`s together, per the owner's spec), `footer` (padding `space/16`, space-between — `selection` Slot left, `pagination` Slot right). 5 boolean component properties gate whole-region/sub-slot presence: `hasFilters`, `hasHeader` (collapses if neither filters nor actions), `hasSelection`, `hasPagination`, `hasFooter` (collapses if neither selection nor pagination) — in React these mostly collapse to plain conditional rendering (`selectedCount > 0`, `totalPages > 1`) rather than props a consumer sets by hand. 5 slot conversions pending (`filters`/`actions`/`content`/`selection`/`pagination`, all marked "(convert to Slot)"). React: wraps the real `Card` (`padding="none"`) directly instead of replicating its tokens — no `insertChild`-depth restriction in React, so no reason not to; renders a real `<table>`, which also solves "how do columns align across rows" for free (a real table's layout engine, not manual per-cell width sync) — `Card` gained `overflow: hidden` under `padding="none"` for this. All 5 booleans collapse to plain conditional rendering |
| **Pagination** | L1 | Figma + React. Figma (`10302:21731`, single component, no variants). Componentized from a mockup the owner hand-built in the "Claude" frame's real table example: "Page X of Y" label + prev/next `IconButton` pair (secondary/md, CaretLeft/CaretRight), `space/12` label↔buttons, `space/8` button↔button. React adds disabled-at-boundary logic (`page<=1`/`page>=totalPages`) — a real component needs it even though the static Figma reference didn't |
| **TableRow** | L1 | Figma + React. Figma (`10298:18440`, 6 variants — a **partial grid**, not a full cross, same precedent as `Button`'s `xs`/`2xl` exceptions: `variant=header`×{`default`} + `variant=default`×{`default`,`hover`,`active`,`danger`,`success`}). Header briefly had its own `active` state too, but the owner decided a header row only ever needs one flat color — collapsed back to just `default`, using the value that had been `active` (zinc.100, actually visible) rather than the original `default` (zinc.50, barely distinguishable). **Gotcha hit:** deleting the old header variant orphaned `Table`'s own demo header-row instance (Figma doesn't auto-migrate an instance when its master variant is removed from a set) — fixed via `instance.swapComponent()` onto the surviving renamed variant. Named `TableRow` not `Row` — `Row` already exists as a different component (the `ScrollableArea` list-item). Each variant is a Slot for cells + a real per-side bottom-only stroke divider (`border.default` under the header, `border.subtle` between body rows — stroke, not effect). Row owns ALL visible color now that `TableCell` is transparent: `default`→`color.table.row.background.default` (`#fcfcfc`, fixed from a `#ffffff` mismatch caught by the token generator's drift detector), `hover`→`color.table.row.shadow.hover` (pre-existing alpha-black.3 wash, used directly as a fill since the token already carries real alpha), `active`→ now **mirrors `default`'s fill exactly** (aliased, not duplicated) + a real 1px border on all 4 sides via `color.table.row.border.active`→`color.border.focus` (same token `Input` uses for its own focus border) — owner's call, matching Input's restraint of "focus changes the border, never the fill" (an earlier version used a zinc.100 background swap instead; caught via exact RGB readback that it was indistinguishable from `#fcfcfc` at a 2/255 gap before this), `danger`/`success`→`color.table.row.background.{danger,success}` (red.50/green.50, deliberate primitive aliases one step paler than the existing `-subtle` tokens, owner's explicit choice). Header row mirrors with `color.table.header.background.{default,active}` (zinc.50/zinc.100 — same indistinguishable-value bug caught and fixed the same way). Built by renaming + cloning the 2 pre-existing variants (preserving the owner's already-converted `cells` Slots), not rebuilt from scratch. React: no `variant` prop at all — header-vs-body is just "sits inside `<thead>` or `<tbody>`", which real HTML already knows, `Table` controls it; no `hover`/`active` props either — a real `<tr>` gets `:hover`/`:focus-within` for free, only `status: 'danger'|'success'` (real row data, not an interaction state) is an explicit prop. **2026-09-14: caught during the Figma↔React alignment audit — Figma had grown a 7th variant, `state=selected` (`color.table.row.background.selected`, already a real bound token), with zero React equivalent.** Added a `selected?: boolean` prop (same "real fact, not an interaction state" treatment as `status`) + a `[data-selected]` CSS rule. |
| **Slider** | L1 | Single-thumb range, React + Figma both built same session. React: real `<input type="range">`, transparent except its thumb — visible track+fill is a plain decorative span pair (same shape `ProgressBar` uses), not the input's own `::-webkit-slider-runnable-track` background. `size` `sm`/`md`/`lg` — its own 8/12/16px track scale (originally shared with `ProgressBar`; `ProgressBar` was independently resized to 6/10/12px on 2026-09-13 for dense-context fit, `Slider` was not touched and still uses the original scale); thumb is always track+8 (16/20/24). Controlled or uncontrolled, always rendered controlled internally. Mandatory `aria-label`/`aria-labelledby` (same union pattern as `ProgressBar`/`IconButton`). **Gotcha hit + fixed:** comma-combining a `::-webkit-*` selector with a `::-moz-*` one makes Chrome drop the WHOLE rule silently (unrecognized vendor pseudo-element invalidates the entire selector list) — logged in §6 and `Slider.md`. Figma (`10282:25857`, 3 variants, `size` only): plain track/fill/thumb shapes on the same tokens as React |
| **FileDropper** | L2 | Drag-and-drop upload zone, React + Figma now both built. React: `status` `idle`/`uploading`/`success`/`error`, fully controlled (same split as `ProgressBar` — picking/dropping only calls `onFilesSelected`, caller drives `status`). Real `<label>` + hidden `<input type=file>` (native click/keyboard for free) + manual drag handlers (drag-counter ref, not boolean, to avoid child-hover flicker); drag-over highlight wins in every status but `disabled`. Composes `ProgressBar` (uploading) + `HelperText` (error message) + reuses `EmptyState`'s `CheckCircleIcon`/`HelperText`'s `WarningIcon` for status glyphs. Only the border carries state color (dashed idle → solid, danger on error) — same restraint `Input` uses for icon/affix. 4 new fixed React icons: `UploadIcon`/`DocumentIcon`/`CloseIcon`/`RetryIcon` (the last on a 24×24 grid, a reused well-known refresh-arrow shape). Figma (`10282:25711`, 5 variants, `disabled` folded into the `status` axis): composes real `IconButton`/`ProgressBar`/`HelperText` instances + the file's own Phosphor icons (`UploadSimple`/`FileText`/`CheckCircle`/`Warning`/`X`/`ArrowClockwise`) rather than redrawing — React's 4 hand-drawn icons are only a visually-close stand-in for these, not pixel-identical (noted as a follow-up in FileDropper.md) |
| **Overlay** | L1 | modal scrim + centering layer. `createPortal` to body, `position:fixed inset:0`, fill `color/modal/scrim` (→ `alpha-black/40`, repointed from a 70% zinc tint). Backdrop-click + Escape close, scroll-lock, focus in/out. **Deferred to a future `Dialog` panel:** focus-trap, animation, `role`/`aria` (put those on your panel). z-index raw `1000` — no `z/*` scale yet. Figma `Overlay` `10261:15414`, `content` Slot for the panel |
| **ChartLegend** | L1 | swatch+label per series, built from a screenshot, no Figma involved |
| **ChartTooltip** | L1 | every-series-at-once hover/focus readout; positioning owned by the chart, not itself |
| **BarChart** | L1 | stacked SVG bar chart — first data-viz component; built per the `dataviz` skill's procedure (form → validated color → marks → interaction → accessibility). No colors hardcoded — reuses `color.chart.1` + `color.background.warning-strong`, no new tokens. Visible table-view toggle not built yet (a hidden `<table>` covers the accessibility requirement) |
| **ChartCard** | L2 | composes `Card` + `ChartLegend` + a `Filter`-based filters slot. Filters are **per-card** — a deliberate deviation from the dataviz skill's "one shared filter row" guidance, matching the product's actual mockups |
| **ProgressBar** | L1 | Horizontal track+fill, `size`(sm/md/lg)×`tone`(brand/success/warning/danger), hand-built against the WAI-ARIA `progressbar` pattern (no headless-UI dependency — see `ProgressBar.md`). `value`/`max` control only fill width; `tone` is an independent consumer-set signal, deliberately allowed to disagree with the ratio. Mandatory `aria-label`/`aria-labelledby` union (same pattern as `IconButton`/`Slider`). **2026-09-13: resized ~20-25% smaller** (track 8/12/16px → **6/10/12px**) so the control can actually fit a dense context like a `TableCell` — which currently uses a bespoke `TableProgressStages` dot/line tracker instead of `ProgressBar` precisely because the old size read too tall there (see `TableCell.md`); whether to actually switch `TableCell`'s `progress` type over to this now-smaller `ProgressBar` is still an open owner decision, not made here. New component-tier tokens `size.progressBar.{sm,md,lg}` (6/10/12px, split off `space.*` the same way `size.input` split off `size.control`) drive the CSS; `radius.full` (pill) and the fill/track color bindings were untouched — pure dimensional resize, zero behavior change. Figma `ProgressBar` (`10153:16106`, 12 variants: `size`×`tone`) resized by hand to match (`size.*` isn't in the token→Figma sync pipeline, same as `size.textarea` — see §6) |
| **Label** | L1 | `<span>`, `size` 2xs/xs/sm/md/lg/xl (mirrors `text/body/*`, **body weight**, default `md`), `color` default/subtle/muted/brand/success/warning/danger (`color.label.*`, aliases of `color.text.*`). Figma: 42 variants (`10237:14080`). Distinct from `Tag` (uppercase/semibold) and `Badge` (filled chip). New token `text.body.xl` added to complete the scale |
| **LabelGroup** | L1 | `<div>` inline-flex, `gap: space/6`; holds `Label`s separated by real **1px vertical dividers** (not `·`), divider height = the size's font-size, colour `color/text/subtle` (fixed chrome). `size` cascades to children. Figma: 6 variants (`10238:14161`). **Is `Row`'s `description`** — size-matched (`sm`→`2xs`, `md`→`xs`, `lg`→`sm`); `Row` fills in the `size` for a bare `<LabelGroup>` |
| **Row** (was `ScrollableAreaRow`) | L1 | `[leading? IconCell] [heading + description] [status?] [action?]`, 3 sizes (padding 8/10/12). Hover = flat wash, focus = 1px inset border, permanent 1px bottom divider (a **stroke** in Figma, never an effect — see Row.md). `status`/`action` are real Figma Slots + `hasStatus`/`hasAction` booleans; `leading` is a typed prop. `description` is a nested size-matched `LabelGroup` (18 variants, `10180:18768`). Next: drop into `ScrollableArea`'s `content` slot inside `ListCard.Body` |
| **Textarea** | L1 | Figma + React, "input-types gap closing" pass. Figma (`10315:21846`, 15 variants: `size`(sm/md/lg)×`state`, same state set as `Input`) built in 3 per-size batches after a single combined build (15×~7 binds) timed out the bridge at 120s. React: direct-styled native `<textarea>` on `Input`'s own tokens, no wrapper span (no icon slots needed, so skips `Input`'s wrapper-owns-chrome pattern). New tokens `size.textarea.{sm,md,lg}` = 72/80/88px, exactly 2x `size.input`'s scale — confirmed `size.*` isn't in the token→Figma sync pipeline at all (only `color.*`/`radius.*` have allow-list regexes), so Figma heights are matching literal numbers, not bound variables |
| **MenuRow** | L1 | Figma + React. Figma (`10315:21907`, 9 variants: `size`×`state`(default/hover/selected)), built in 3 per-size batches proactively (same timeout precaution as `Textarea`). React: a real `<button role="menuitemradio">`, no `size` prop — sized by its `Menu` ancestor's `data-size` (same ancestor-context cascade `TableRow` uses for header-vs-body). `selected` shows a right-aligned brand-colored checkmark |
| **Menu** | L1 | Figma + React. Figma (`10315:21998`, 6 variants: `variant`(default/card)×`size`) — two shells sharing one `MenuRow` list: `default` (plain bordered/shadowed dropdown shell, for `Input`/`Select`) and `card` (replicates `Card`'s exact bound tokens — fill, per-side stroke weights, "vignette xs" inner-shadow, `radius/table` — same `insertChild`-2-levels-deep restriction `Table`'s own root already worked around, rather than nesting a live `Card` instance). React: `position: absolute; top: 100%` anchored to the consumer's own `position: relative` wrapper, no floating-UI collision detection (out of scope for this system's current screens); closes on outside-click/Escape |
| **Select** | L2, React only | "An input with a caret that opens options to choose" — a native `<input>` can't drive a real dropdown, so this is a functional trigger `<button>` + `Menu` + mapped `MenuRow`s, not a modified `Input`. Trigger imports `Input.module.css` directly (`.field`/`.input`/`.icon`, same cross-component reuse `IconButton` does with `Button.module.css`) plus one local `:focus` rule (the trigger itself is the focused element, unlike `Input`'s `:focus-within`-on-a-child). **Deliberately no Figma component** — Figma already has every visual piece (`Input`'s trailing-icon slot, `Menu`'s `default` shell, `MenuRow`) to depict it at rest; only the real open/close/select behavior was new, and that's code-only |
| **SegmentedControl** / **SegmentedControlItem** | L1 | Figma + React. Replaces an unrelated, unnamed pre-token "Switch"/"Switch item" pair found elsewhere in the file (`6033:16788`/`4227:6728`) — a 3-segment view-switcher (List/Grid/Map-style), not a boolean toggle, built before this system's tokens existed (raw hex, a legacy glass shadow effect on old shim-collection variables, a weight-swap for selected/unselected, and an internal sizing bug in the original). Rebuilt the same functional shape on this system's own tokens, deliberately under a **new name** — `Switch` was already taken by the real boolean toggle (`10221:13885`) built in an earlier session; reusing it here would collide. Sized off `size.control.{sm,md,lg}` (28/32/36, `Button`'s own scale — this sits in a toolbar next to `Button`/`Filter`, not next to `Input`), not `size.input`. New tokens: `color.segmentedControl.track.background` (`color.background.subtle`), `color.segmentedControl.item.text.{default,hover,disabled}`, `color.segmentedControl.item.background.hover` (reuses the same `color.background.overlay-subtle` wash `MenuRow`/`Row`/`TableRow` share), `radius.segmentedControl.{sm,md,lg}` (mirrors `radius.button.{sm,md,lg}` exactly). Had to add `segmentedControl` to `tokens-to-figma.mjs`'s two allow-list regexes first, or the generator would have silently dropped these tokens (`created: 0`) — the same gotcha already logged below for `scrollableArea`/`alpha-black`. Figma: `SegmentedControlItem` (`10323:16971`, 12 variants: `size`×`state`(default/hover/selected/disabled), 3 per-size batches) + `SegmentedControl` (`10323:16996`, 3 variants: `size` only, a recessed track with 3 demo items). React: `SegmentedControl` (`role="radiogroup"`, cascades `data-size`) + `SegmentedControlItem` (`role="radio"`, `aria-checked`, no `size` prop — reads the ancestor's `data-size`, same pattern `MenuRow` uses). The old "Switch"/"Switch item" pair was left in place, untouched — a fresh replacement, not a rename; its existing usages (several old screen headers) were not repointed. **Same-day correction:** the first pass's `selected` state was a flat color fill (own height, own background/text tokens) and had a real bug — it could render taller than the track that clipped it. Owner's fix: `selected` should look like, and now literally is, a real nested `Button` (`size=X, variant=secondary, state=default`, both icon slots forced off) — in Figma a genuine instance inside a zero-padding hug wrapper (no independent height left to drift), in React `Button.module.css`'s own `.surface[data-variant='secondary']` class cross-imported directly. `item.text.selected`/`item.background.selected` tokens were removed (nothing binds them now) and the 2 orphaned Figma variables deleted. Verified overflow-free via `getBoundingClientRect()` at all 3 sizes. **2026-09-17/18: extended for the sidebar module switcher** — added `size=xs` (a transparent/unpadded/unradiused track, distinct from the sm/md/lg recessed-track recipe) to both components, `SegmentedControl.collapsed` (16px vs 24px item height), and `SegmentedControlItem`'s `tone`(brand/success/danger/neutral)/`position`(start/middle/end, only meaningful with `tone`) — see [SegmentedControl.md](docs/components/SegmentedControl.md)/[SegmentedControlItem.md](docs/components/SegmentedControlItem.md) and `migration/journal.jsonl` for the full detail (multiple passes: initial tone build, a raw-primitive token fix, hover-state addition, an alpha-black opacity tweak). New tokens: `color.sidebar.<tone>.fill/accent`, `color.segmentedControl.item.xs.{default,hover}.{fill,border,innerShadow,overlay}`. |
| **Switch** | L1 | Figma + React. Figma (`10221:13885`, 18 variants: `size`(sm/md/lg)×`checked`×`state`(default/hover/disabled), built autonomously an earlier session) — pill track (`primaryAxisAlignItems` MIN/MAX toggles thumb position), plain white thumb at every state, no border at all (track color alone carries on/off/disabled — confirmed via read-back, `strokesBound: null` on every variant). React: a real `<button role="switch" aria-checked>` — no native HTML switch element exists, unlike `Checkbox`/`Radio`. Controlled (`checked`+`onCheckedChange`) or uncontrolled (`defaultChecked`), same internal-state-seeded-from-default split `Slider` uses for `value`. Sizes read straight off the Figma geometry (sm 32×18/thumb 14, md 40×22/thumb 18, lg 48×26/thumb 22 — track padding is a flat 2px at every size, and the thumb's travel distance always equals its own size, a clean coincidence of that 2px padding) — no `size.switch.*` token family exists yet (same "literal px, no token" precedent `Slider`'s own track sizes set), thumb slides via `transform: translateX(var(--thumb-size))` for a real transition Figma's static reference doesn't model. |
| **Checkbox** | L1 | Figma + React. Figma (`4182:3616`, "Checkbox" — the adopted legacy-kit component, 36 variants: `size`(sm/md/lg 16/20/24px)×`checked`×`indeterminate`×`state`(default/hover/focus/disabled), `radius.checkbox` flat at 4 across all sizes). React wraps a real `<input type="checkbox">` — visually hidden (`opacity:0`, stretched over the box, `pointer-events:none` on the decorative span so every click still lands on the input) under a decorative span, same "real control drives it, a span shows it" split `Radio` and `Slider`'s track/fill use. `indeterminate` isn't a JSX/DOM attribute — set imperatively via a ref in a `useEffect`, same restriction the task brief flagged going in. Checked/indeterminate glyph is two small hand-drawn inline SVGs (`CheckIcon`/`MinusIcon`, plain Phosphor-style bold paths) instead of importing Figma's nested `_FormControlCheck`/`_FormControlMinus` shared icon instances — same "close stand-in, not pixel-identical" precedent `FileDropper`'s own icons set. Checked and indeterminate share one filled, borderless brand box (confirmed via read-back: `checked=true` and `indeterminate=true` both bind `color/checkbox/background/on`, no border). **New component token `color.checkbox.icon.{default,disabled}`** (was a flat `checkbox.icon` leaf, split into a group): disabled uses `color.text.disabled` for the glyph, never white — a white checkmark on the pale gray disabled fill would be nearly invisible. Caught a real Figma↔code drift while verifying this: the live Figma master's disabled+checked/indeterminate glyph vectors are *still* bound to the old flat white `color/checkbox/icon` (confirmed via bridge read-back) — bridge was read-only for this task so not fixed; follow-up is renaming that Figma variable to `color/checkbox/icon/default` and binding a sibling `.../disabled` onto the disabled glyph vectors. |
| **Radio** | L1 | Figma + React. Figma (`10222:14006`, 18 variants: `size`(sm/md/lg 16/20/24px)×`checked`×`state`(default/hover/disabled), border 1.5px at every size, dot always exactly half the box). **New token `radius.radio`** (`→ radius.full`) — never scaffolded when Radio's other component-color tokens were added; confirmed circular via the Figma master (`cornerRadius: 9999` on all 18) and added now, same shape as the existing `radius.switch`. React wraps a real `<input type="radio">` (same visually-hidden-input-under-a-decorative-span split as `Checkbox`) — grouping is a plain native `name` attribute, no separate `RadioGroup` component (this system has no `CheckboxGroup` either). **Never solid-fills, in any state** — `color.radio.background` is one flat white token used at rest/hover/checked/disabled alike; only border color + the inner dot (checked only) signal state. Confirmed via read-back this is deliberate (not a gap): the checked+default variant's fill is bound to the exact same `color/radio/background` variable as unchecked. |
| **ListCardHeader** | L1 | Figma + React. Figma (`10114:12896`) — heading (`text/heading/md`, `color/text/default`) + optional description (`text/body/md`, `color/text/subtle`), `itemSpacing: 0` (stacked flush, no gap), `description` a real boolean (default `true`). No `size` variant in Figma at all — it's a single fixed-size reference. React adds a `size` prop (`sm`/`md`/`lg`, default `md`) purely as a code convenience — `text.heading.*`/`text.body.*` at the matching step, not stepped down the way `FormField`'s own headline is relative to its control — since `ListCard` cascades its own `size` down to a bare `ListCardHeader` child, the same mechanism `FormField` uses for a bare `Input`. |
| **ListCard** | L2 | Figma + React. Figma (`10084:14100`, single component, no variants) — nests a real `Card`(`padding=md`) instance holding `ListCardHeader` + `FilterBar` + `ScrollableArea` in a vertical stack. **Spotted in passing, not fixed (read-only bridge):** the wrapper frame is named `"Stack (column, gap=xl)"` but its measured `itemSpacing` is actually `16` (`gap="lg"`, not `xl`/20) — a stale label, most likely, since `16` matches `Table`'s own identical header/content/footer region-stacking gap exactly; React uses the real measured value (`gap="lg"`). React: `header` (required, usually a `<ListCardHeader>`, size-cascaded per its own entry above) + optional `filters` (rendered inside a real `FilterBar`, which already collapses to nothing when empty — so omitting `filters` skips the row entirely, matching the Figma reference's variant-free single form) + `children` (rendered inside a real `ScrollableArea`). `size` (`sm`/`md`/`lg`, default `md`) has no Figma variant either — a React-only convenience cascaded to `header`, same reasoning as `ListCardHeader`'s own `size`. |
| **TaskCard** | L2 | Figma + React (`10168:17214`, `context` variant `list`/`queue`/**`tasks`**). `list`/`queue` shipped an earlier session (React `TaskCardProps.context: 'list' \| 'queue'` — composes `Card`(`padding=md`) + `IconCell`(`size=2xl`) + `Tag`(`size=xs`) + `SeverityBadge` + optional action, `queue` adds 3 `aria-hidden` decorative "ghost" stacked-deck layers behind it). **2026-09-14: owner added `context=tasks` in Figma** — a smaller reference (320×170 vs `list`'s 380×200) for the tasks screen: `IconCell` `2xl`→`xl`, tighter `8px` slot spacing (still token-bound, not raw), `Button` down to `size=sm`/`variant=secondary` — all real, clean variant swaps, confirmed via a full node scan with no stray unbound fills. **One real bug found and fixed:** the `SeverityBadge` instance had been manually resized+overridden to look like `size=sm` (64×27, nested `Badge` swapped to `tone=warning-strong, size=sm`) while its own variant property still read `size=md` — the instance panel would've lied about what was rendered, and a reset-to-master would've snapped it back to the wrong 72×32 size. Fixed with `setProperties({size:'sm'})`, a real swap onto the official `size=sm` component instead of the stale override — identical visual result. React's `context` type doesn't have `'tasks'` yet — deferred, Figma-first precedent (Switch/Checkbox/Radio/Avatar etc.). |

### Layout / shell — built this session, **in progress**

| component | tier | notes |
|---|---|---|
| **Box** | L1 | token `p`/`px`/`py`/`bg`/`radius`/`border`; no layout logic |
| **Stack** | L1 | flex, `direction`/`gap`/`align`/`justify`/`wrap`/`columns` (row, equal stretch) |
| **Grid** | L1 | **12-column** CSS grid (code default, overridable via `columns` prop), `Grid.Item span` (uneven splits = different spans, e.g. 8+4, 3+3+6). **This is the one true content-layout tool** — a row-grid was tried and rejected (876px content height ÷ 8 rows = 90.5, not clean; decided rows always flow by content height, never gridded). Note: `Page`'s own Figma layout-grid guide is now **16** columns (see below) — that's the guide's own reference count, not a change to `Grid`'s code default; unconfirmed whether `Grid` should also move to 16 |
| **AppShell** | shell | `sidebar`(collapsed 64px / expanded 180px) variant; fixed viewport (`100dvw`×`100dvh`), only the content region scrolls. Content-slot background `color.background.muted`(zinc.300, was subtle/zinc.100), radius `radius.page`(24, its own token — see §3). **2026-09-14: React caught up during the Figma↔React alignment audit** — React's `AppShell` had no equivalent to Figma's `expanded` variant at all (`--app-sidebar-width` was hardcoded to 64px, with a comment already flagging it should become variable "later if it needs to vary"). Added `sidebarMode?: 'collapsed' \| 'expanded'` (default `collapsed`, so every existing screen renders identically) + a `[data-sidebar='expanded']` CSS override, originally guessed at 240px since the real `Sidebar` didn't exist yet. **2026-09-18: corrected to 180px** now that `Sidebar` is fully built (Figma + React) and its real expanded width is known — 240 would have left ~60px of dead space to the right of the actual sidebar content. |
| **Page** | shell/L2 | `layout="scroll"` (whole page scrolls+padded) or `"fixed"` (grid rows, only `Page.Body` scrolls); `Page.Header`/`Body`/`Footer`, each takes `bleed` to go flush to the content-card edge. **Both sides done** — the 4 content-region frames were converted to real Figma Slots (owner, manual). The 12-col reference guide now lives as a **native Figma layout grid** on `Page` itself (`layoutGrids`, editor overlay, no separate frame) — currently **16 columns**, `gutterSize`/`offset` both 16, up from 12 |
| `breakpoints.ts` | util | `sm640/md768/lg1024/xl1280/2xl1536` (Tailwind values) + `up()`/`down()` helpers. Design screens at **1440** now (migrating down from 1920 — see the top of this doc), spot-check 1280. `lg` (1024) is the real desktop floor — below it the sidebar should collapse (not yet wired to a media query anywhere). |

### In progress — Figma built, React not started

| component | tier | notes |
|---|---|---|
| **Modal** | L2 | Owner-built, Figma only — 4 variants (`10264:14412`): `padding` (lg/md/sm/xs), each `header` (`heading` Slot + `close` `IconButton`) / `content` Slot / `footer` Slot. Layer names were Figma defaults, fixed to lowercase role names matching the rest of the file. React/docs not started — a reasonable next stretch goal (plain presentational panel only, no portal/focus-trap/animation — those are `Dialog`'s job, see `Overlay`'s own entry). |
| **Tooltip** | L1 | Figma only (`10342:26226`) — 4 variants: `position`(top/bottom/left/right). A dark pill (`color.surface.inverse` → zinc.900, `color.text.on-inverse` → white, `radius.tooltip` → `radius.chip`) plus a small triangle (`figma.createPolygon()`, pointCount 3) pointing back toward whatever it's anchored to. Hit two real Figma-API gotchas building this — see `.claude/skills/figma-agent-checklist/SKILL.md` items 6–8 (a fill bound directly on the node passed to `createComponentFromNode` silently loses its binding; `.rotation` pivots around a shape's top-left corner, not its center, so a rotated arrow needs its position compensated by its own width/height or it lands off-target — confirmed by reading `.absoluteBoundingBox` after rotating, not by assuming the math). React/docs not started. |
| **Divider** | L1 | Figma only (`10344:26287`, rebuilt once — see below) — 2 variants: `orientation`(horizontal/vertical), a single 1px line on `color.divider.line` → `color.border.subtle`. First build was a bare rectangle passed directly to `createComponentFromNode` (lost its fill binding, checklist item 6) — rather than just rebinding in place, rebuilt as a zero-fill wrapper **frame** containing a nested `line` rectangle (own `cornerRadius` explicitly zeroed defensively), matching every other component's own safe shape and incidentally resolving an unexplained corner-rounding the owner spotted on the original bare-rectangle version (root cause not conclusively identified — likely Figma's own component-selection outline being mistaken for the shape's own edge on a 1px sliver — but the more robust frame-wrapped construction is the right shape regardless). React/docs not started. |
| **Spinner** | L1 | Figma only (`10342:26203`) — 3 variants: `size`(sm 16/md 20/lg 24px, `size.spinner.*`). **Resized 2026-09-13**: was 16/24/32, which jumped straight past the standard 20px icon step — tightened to a 16/20/24 progression. Reuses the file's existing `Loading` icon (the same glyph already hidden inside every `Button`/`IconButton`'s own `loading` state) rather than drawing a new one — just resized instances bound to `color.spinner.icon`. Rotation/spin animation is a code-only concern (CSS), not modeled in Figma. React/docs not started. |
| **Breadcrumb** / **BreadcrumbItem** | L1 | Figma only (`BreadcrumbItem` `10345:26301`, 4 variants: `state`(default/hover/current/**primary**); `Breadcrumb` `10345:26317`, single component). Distinct from `Headercard`'s own ad hoc "Back" button — a real multi-level trail, not a single return-to-previous action. **2026-09-13: `BreadcrumbItem` gained a `primary` state** (`color.breadcrumb.text.primary` → `color.text.brand`) for calling out one segment independent of which crumb is current, and `Breadcrumb` was rebuilt from a fixed 3-item demo into a real **2–4 part configurable** component — 4 items total (`item1`/`item2` always shown; `item3`+its preceding separator gated by a `hasItem3` boolean, `item4`+its preceding separator by `hasItem4`, default `true`/`true`) — demoing "Fleet › **Trucks** › Reports › FL-0954" with `Trucks` in the new primary color and `FL-0954` as the current/final crumb. Note: `state=current` styling is fixed on `item4`'s own instance — toggling `hasItem4` off does **not** retroactively restyle `item3` as the new "last" crumb (a static Figma reference can't do that dynamically); a real usage should swap whichever instance is actually last onto the `current` variant by hand. First `BreadcrumbItem` attempt built each state as a bare `TEXT` node converted directly to a component (checklist item 7) — instances came back with `.characters` silently `undefined`, no error — rebuilt with the text wrapped in a frame. React/docs not started. |
| **Avatar** | L1 | Figma only (`10356:29053`) — 45 variants: `size`(xs 24/sm 28/md 32/lg 40/xl 44, `size.avatar.*`) × `status`(none/online/offline) × `action`(none/add/delete). Base is a rounded-square frame (`radius.avatar` → `radius.full`) hugging centered initials text (`color.avatar.background`/`text`) rather than a real photo — no image-upload story exists yet, so this is the fallback-state reference. `status` (bottom-right) and `action` (top-right) are two independently optional corner badges, each a ring circle (`color.avatar.ring`, white — separates the badge from the avatar underneath) plus an inner circle 1px smaller than the ring on every side; `status` inner circle is a flat color dot (`color.avatar.status.{online,offline}`, success-green/muted-gray), `action` inner circle additionally nests a small `Plus`/`TrashSimple` icon (`color.avatar.action.{add,delete}` fill, white icon) — reused existing icons rather than drawing new glyphes. **2026-09-14: badges resized smaller** — the first pass had them at ~35–42% of avatar diameter with a 2px-per-side ring, which the owner flagged as way too big; now ~27–29% of avatar diameter with a 1px-per-side ring (badge/ring diameters: xs 7/9, sm 8/10, md 9/11, lg 11/13, xl 12/14 — icon sizes scaled down to match). Both badges are flush-aligned to the avatar's own corner (not overlapping past its edge) — a deliberate v1 simplification; a more typical "poking out past the rim" placement is a one-line offset change if the owner wants it later. Built in 5 per-size batches (9 status×action variants each) then combined. One dead-end during verification: the `size=xl, status=online, action=add` export briefly looked like the base circle had square corners — turned out to be a misreading of the composition (two badges pulling visual weight to the right made the plain circle look asymmetric), confirmed by re-exporting the same variant with `status=none, action=none` and finding it pixel-clean; no fix was actually needed (`clipsContent` was set `true` on all 45 variants regardless, a reasonable safety property). React/docs not started. |
| **CategoryIcon** | L1 | Figma only (`10364:30823`) — 200 variants: `size`(sm/md/lg/xl/2xl, matches `IconCell`'s own box/icon/radius scale exactly — box 28/32/36/40/44, icon 14/16/18/20/20, radius reused from `radius/button/{sm..2xl}`) × `color`(10 hues: brand/teal/rose/lime/fuchsia/cyan/pink/violet/emerald/blue) × `emphasis`(strong/**muted**) × `state`(default/disabled). Adopted from the owner's legacy "Colored icons" (`4234:6411`, left in place untouched, not repointed) — same visual job as `IconCell` (colored tile + centered icon) but a different axis of meaning: `IconCell`'s `tone` is semantic status (neutral/brand/success/warning/danger), this component's `color` is arbitrary categorical identity (the same job `Tag`'s `color` prop does) — kept as a sibling component rather than merged into `IconCell`, since cramming both vocabularies into one variant prop would conflate two different concepts. `emphasis` is the actual new capability the owner asked for: `strong` = saturated fill + white icon for **modules**, `muted` = the same fill **desaturated, not lightened**, still white icon, for **settings**. **First pass used `emphasis=subtle` (pale `.100` tint + colored icon) — owner corrected it: wanted "just slightly less saturated and accented than default," not a different treatment.** A plain lighter Tailwind step was tried and rejected too — Tailwind ramps often get *more* saturated approaching their chroma peak while getting lighter, the opposite of the ask (confirmed via each hue's own HSL numbers). Landed on a genuine desaturate: each hue's `background` converted to HSL, saturation -0.20 with hue/lightness held fixed, converted back to hex — `color.category.{hue}.background-muted`, a first-of-its-kind raw (non-aliased) hex exception in `semantic.color.json` since no Tailwind step matched, each with its own `$type: color` (no alias chain for Style Dictionary to infer from) and a documented HSL derivation + contrast number. Verified against the white icon: worst case (lime) 3.74:1, rest 4.1–6.9:1 — same "always paired with a label" mitigation this token group already uses for lime/teal/cyan elsewhere. Colors deliberately capped at the 10 hues already validated for `Tag` (`color.category.*`) — the legacy component's other 6 (sky/indigo/purple/green/yellow/taupe) were dropped rather than carried forward without CVD/contrast validation, owner's explicit call. React not started. |
| **SettingsNavItem** | L1 | Figma only (`10370:33460`) — 6 variants: `state`(default/hover/active) × `hasBadge`(true/false). A colored `CategoryIcon` tile + label, for a settings-style sidebar nav list — built to replicate a reference "Settings" screen mockup (left nav + right toggle panel). No existing component covered this shape: `MenuRow` is the closest analog but signals selection with a checkmark, not a full highlighted background+border, different enough visual language that reusing it would fight more than it'd save. **2026-09-14: reworked from a `selected` boolean (flat `background.brand-subtle` + `border.focus` tint) to a real 3-state model, matching the same elevation trick already used for `SegmentedControlItem`'s own `state=selected`** — `default` (transparent), `hover` (`color.background.overlay-subtle`, the same flat neutral wash `Row`/`MenuRow`/`TableRow` already share — no button-like look), `active` (genuinely reuses `Button`'s own secondary surface: `color.button.secondary.background.default` fill, `color.button.secondary.border.default` stroke, and `Button`'s own two-layer glass shadow **effect style** applied directly via `effectStyleId`, not hand-copied). Unlike `SegmentedControlItem` (whose icon+label content maps 1:1 onto a real `Button` instance, so it nests one directly), `SettingsNavItem`'s content — a 32px colored `CategoryIcon` tile, not a plain small icon — doesn't fit `Button`'s own icon-slot anatomy, so the surface treatment (fill/border/shadow) is applied to `SettingsNavItem`'s own frame instead of nesting a literal `Button` instance; same visual result via the same tokens+effect style, correct shape for different content. All 7 nav-item instances migrated onto the new set via `swapComponent()` — text/icon-color overrides survived intact since child layer names matched between old and new masters. `hasBadge` shows a small solid dot (`color.background.brand.default`) for an unread-style indicator, independent of `state` (they coincide in the reference but aren't the same concept). Icon+color assigned per nav item from the same 10 validated `color.category.*` hues `CategoryIcon`/`Tag` use (screenshot's exact hues — yellow for Appearance, orange for Alert thresholds — aren't in the validated set, closest available hues substituted). The reference mockup's nav icons render `emphasis=strong` (saturated) even though `CategoryIcon`'s `muted` emphasis was built specifically for settings contexts — flagged to the owner, not resolved. The rest of the reference screen (toggle rows) needed **no new component** — a real legacy "Settings row" component (`4268:6989`, pre-token, used across several older screens) turned out to be exactly `Row`'s own shape (heading+description text combo + a `Slot` holding a `Switch`), confirming `Row`(`hasLeading=false`) + `action={Switch}` is the direct successor; only had to trim `Row`'s `description` `LabelGroup` down from 3 labels to 1 (via `.visible = false` — nested-instance children can't be `.remove()`d, see the checklist). React not started. |
| **Sidebar** / **SidebarNavItem** / **SidebarSection** / **Logo** | L2 / L1 / L1 / L1 | Figma + React, the app's left rail — built across an extended, mostly Figma-only stretch (2026-09-17/18) then synced to code. `Sidebar` (`10577:30220`, 2 variants: collapsed 64px / expanded 180px) — brand mark, a 3-segment module switcher (real `SegmentedControl`/`SegmentedControlItem` instances, not loose frames), the active module's nav list, a fixed Profile/Settings section. `SidebarNavItem` (`10603:32870`, 12 variants: `collapsed`×`leading`(icon/avatar)×`tone`×`state`) replaced an earlier light-surface `background.<tone>-subtle` active recipe with the real neutral-glass highlight (matches the switcher's own unselected-segment look); `avatar` is its own slot, not an icon-slot override — swapping a generic icon instance to `Avatar` force-resized it (20×20 vs. its natural 28×28) and visibly distorted the photo. `SidebarSection` (`10603:32642`, 4 variants: `content`(module/settings)×`collapsed`) is the rounded panel wrapper — same background/inner-shadow both variants, corner radius differs per `content` (`radius.sidebar.section.top`/`.deep`, both deliberate primitive-alias exceptions). `Logo` (`10623:21244`, 2 variants: `collapsed`) — mark always pure white (`color.sidebar.logo.mark`/`.wordmark`, both alias `color.white` directly, same exception class as `switch.thumb`); fixed 2 pre-existing wrong bindings (`zinc.100`/`zinc.200`) while building it. New `sidebar.*` tokens throughout `component.color.json` (`icon.default`, `text.default`, `panel.background`/`.innerShadow`, `navItem.active.*`/`.hover.*`, `logo.*`) and `component.layout.json` (`sidebar.section.top`/`.deep`) — see `migration/journal.jsonl` for the full step-by-step (roughly a dozen entries: tone builds, position variants, the collapsed-height fix, the avatar-distortion fix, token syncs). React port (2026-09-18) replaced the old `CategoryIcon`-rail `Sidebar` structure entirely; extracted the real `GearSix` icon from Figma, retiring the hand-drawn `GearIcon` placeholder. `AppShell`'s own `--app-sidebar-width` for `expanded` was corrected 240px → 180px in the same pass, once `Sidebar`'s real width was known (Figma's own `AppShell` frame already had the correct 180 — only React's guess was stale). |
| **RigProblemDetail** | L2 | Owner-built, Figma only — a `Modal` instance (`padding=sm`) with 3 columns (`truck`/`trailer`/`driver`), each a real `EntityProblemPanel` instance. Opens from a "Problems with fleet" row click. Named to mirror the Rig entity (TK/TL/DR/RG vocabulary) rather than the source list. Master stays generic placeholder; the live preview instance (Claude frame → `Overlay`) is filled with real RG-101/Dumont content — 5 truck / 3 trailer / 4 driver issue rows. React/docs not started — no `Dialog` panel component exists yet to route this through. |
| **EntityProblemPanel** | L2 | Figma only (`10264:21749`) — 2 variants: `state`(issues/empty). `EntitySummary` header + either the existing `ScrollableArea` of `Row`s or an `EmptyState`. Built at this grain (not a combinatorial `RigProblemDetail`) so any mix of which entities have issues is just picking each column instance's variant. No React port yet — pairs with `RigProblemDetail`. |
| **Headercard** | L2 | Owner-built, Figma only (`10331:18312`) — single component, no variants. The page-header card most pages use: a real `Card`-replica root (same fill/border/radius/effect recipe as `Table`'s own root — `color/card/background/default`, `color/card/border`, `radius/table`, one `INNER_SHADOW`) holding a fixed left side (`Heading` text + a `LabelGroup` instance of stat `Label`s, e.g. "86 total \| 75 active \| 11 inactive") and a real right-side `Slot` for optional actions — reviewed 2026-09-13, structurally sound, matched the owner's spec exactly (fixed heading+`LabelGroup` on the left; on the right, whatever mix of a `Button`(secondary, `ArrowLeft` icon, "Back" — a return-to-previous-page breadcrumb, meant to appear only when this page was opened from another page rather than the sidebar menu), a `SegmentedControl` (view/entity switcher — the demo shows Trucks/**Trailers**/Drivers with Trailers selected, correctly matching the page's own "Trailers" heading), and a settings `IconButton`(`GearSix`) is relevant for that page). Found and fixed 2 real defects: the left side's heading-to-stats gap (`itemSpacing`) was an unbound raw `3` — not even a value on this system's space scale — snapped to `space/4` and bound properly; the right side `Slot`'s own `itemSpacing` was an unbound raw `10` (coincidentally equal to `space.10`'s value) — bound to the real `space/10` variable. Re-exported after both fixes — pixel-identical, confirming the binds were pure correctness fixes with zero visual change. **2026-09-13: added a `hasLabelGroup` boolean** (default `true`, matching prior always-visible behavior) gating the `LabelGroup` instance's visibility, so a consumer can show heading-only when there's nothing worth summarizing — verified via a hide/show toggle export, no layout artifacts. React/docs not started. |

**2026-09-19: every hand-drawn icon in the system replaced with the real
`@phosphor-icons/react` package.** Previously ~20 small icon files across
`Avatar`, `Breadcrumb`, `Checkbox`, `EmptyState`, `FileDropper`,
`FilterIcon`, `HelperText`, `MenuRow`, `NextTask`, `Pagination`, `Select`,
`TableHeaderCell` were hand-drawn SVGs — a few explicitly flagged as "close
stand-in, not pixel-identical" (`FileDropper`, `Checkbox`), the rest never
individually verified either way. Installed `@phosphor-icons/react` and
turned every icon file into a thin wrapper (same exported name, same
`SVGProps<SVGSVGElement>` signature — zero consumer-facing changes) around
the real icon. Every mapping (name + weight) was confirmed against the live
Figma file via the bridge rather than assumed — one consistent finding:
every single icon in the system uses `Format=Outline, Weight=Bold`, no
per-icon variation. Two exceptions with no live Figma instance to check
against: `Checkbox`'s `Check`/`Minus` (Figma's own master uses legacy
hand-drawn `_FormControlCheck`/`_FormControlMinus` vectors, not real
Phosphor) and `Select`'s `CaretDown` (Select has no Figma component at all,
per its own doc) — both still mapped to the genuine Phosphor icon, since
the goal was the real library, not matching a non-Phosphor source. `GearSix`
(Sidebar's settings icon) already got this treatment in the prior Sidebar
pass and needed no rework. Verified via a full production build (bundle
grew ~4KB gzipped — tree-shaking confirmed working, not bundling the whole
1200+ icon library) and a live render check of all 20 icons. `docs/
components/FileDropper.md` and `Checkbox.md` updated to remove the
now-resolved "not pixel-identical" caveats.

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

`Tab`, `Alert` (from `Info message`), `DataTable`,
`NavItem`/`NavSection` (sidebar content). `Input`, `Select`, `Pagination`,
`EmptyState` are now done — see §5's tables above. Next up per the live
thread: whatever's next in the 1440 resize pass (component-by-component,
owner-driven — check CHANGELOG-renames.md's newest entries for what's
already been done), then `size/control/*` tokens → `Tab` → `DataTable`.

## 6 · Known gotchas (Figma plugin API specifics learned this session)

- **`insertChild`/`appendChild` fails with "Cannot move node. New parent is an
  instance or is inside of an instance" when the target Slot is nested 2+
  instance-levels deep** (e.g. `Modal` instance → column frame →
  `ScrollableArea` INSTANCE's own `content` Slot). This is unrelated to
  master-vs-placed-instance — it failed identically editing `RigProblemDetail`'s
  own master and editing an already-placed instance of it. A Slot belonging to
  a single, non-nested instance (e.g. a bare cloned frame's own direct
  `ScrollableArea` instance, as in the `EntityProblemPanel` build) accepts
  `insertChild` fine. **Workaround:** `scrollArea.detachInstance()` on the
  specific instance that needs new children — detaching drops the instance
  boundary (and turns its Slot into a plain frame), after which
  clone/insert/append all work normally. Rename the detached frame back to
  its original name for clarity. Sacrifices that one instance's live link to
  the component (won't pick up future master changes) — fine for a
  content-specific screen instance, not for anything meant to stay reusable.
  Separately: to show one line of text where `description` is a `LabelGroup`
  instance (not plain text), don't try to delete+replace the node (same
  restriction, plus it's a full removal) — retext the `LabelGroup`'s first
  `Label` child and set the rest (other `Label`s + dividers) `visible = false`.
  Property overrides (text, visibility, component swap) work at any nesting
  depth; only *new node creation* is restricted.
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
  **Corollary, hit 3 times now (`Tracker`-in-`NextTask`, then `Row`-in-
  `ScrollableArea`): `createInstance()` always stays `FIXED` at the master's
  own canvas size — nothing sets `FILL` automatically just because the real
  parent is auto-layout.** After `parent.appendChild(instance)`, always check
  whether the instance should stretch to its real container and explicitly
  set `layoutSizingHorizontal`/`Vertical = 'FILL'` if so — otherwise content
  that should be near the container's edge (a trailing badge, an action
  button) silently renders past the real visible bounds at the master's
  original width, invisible in any render/export without an explicit
  width/position check. Don't just eyeball a screenshot for "did the content
  show up" — read back the instance's actual width against its parent's.
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
- **`Button`/`IconButton`'s `2sm` size was renamed to `xs`** (owner, in
  Figma) — `xs` reads as the logical bottom step of the `sm`/`md`/`lg`/`xl`/
  `2xl` scale, same idea as `2xl` being the logical top step. Renamed
  everywhere in React (`ButtonSize`, both `.module.css` files) and docs;
  `tokens/component.layout.json`'s `radius.button.2sm` → `radius.button.xs`.
  The owner only renamed the **variant labels** in Figma (`size=2sm` →
  `size=xs`), not the underlying variable — re-running the token sync
  therefore *created* a stray duplicate `radius/button/xs` instead of
  matching anything (the generator only creates-or-matches by name, it never
  renames), leaving the real, already-bound variable stuck at its old name
  `radius/button/2sm`. Fixed by hand: deleted the stray duplicate, then
  renamed the real variable (ID-based rename, doesn't touch any of the 16
  xs-variant bindings) — re-verified all 16 Button/IconButton `xs` variants
  still resolve `cornerRadius: 6` through the same variable ID, now correctly
  named. **Lesson for next time a variant label gets renamed in Figma without
  the underlying variable being renamed too:** re-running Mode A's sync will
  silently create an orphan rather than catching the intended rename — check
  for exactly this (a new create where you expected zero, or two
  similarly-named variables) before trusting the sync's `created` count.
  Historical mentions of the literal string `2sm` tied to a specific past
  event (the digit-leading regex bug above, the original clone-from names in
  `IconButton.md`) were deliberately left as `2sm` rather than rewritten,
  since they describe what the name was *at that time*, not what it's called
  now.
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
- **Multiple unrelated top-level components share this system's names** —
  found twice: two different "Row" components (one this system's, one
  unrelated), and 5 matches for `/badge/i` including an unrelated Color-only
  "Badge" and literal library junk ("Badgeeee", "IdentificationBadge"). A bare
  `findOne(name === '...')`/`findAll(/name/i)` silently returns whichever
  matches first — always confirm you have the right one (check its variant
  properties/anatomy match what you expect) before editing, or address it by
  a known-good id. When you need a reliable anchor for a *specific* screen
  instance buried in a deep tree (not a shared component), the fix that
  worked well: ask the owner to wrap it in a distinctively-named frame (e.g.
  `"Claude"`) — one unambiguous `findAll` away, zero collision risk. **Caveat:
  this only holds until someone moves the content out of the wrapper** — hit
  exactly this once already (the wrapper went empty after the owner
  relocated the screen inside it while working in parallel). When the anchor
  frame comes back empty, don't assume data loss — search for the known
  child by name across the whole page (`findAll`) and trace `.parent` upward
  to find its new location before concluding anything is actually gone.
- **A "convert to Slot" click appends a disambiguating numeric suffix to the
  name** if any other layer in the file shares it — e.g. `"status (convert to
  Slot)"` becomes `"status (convert to Slot)6"`. Match Slot names with
  `.startsWith(...)`, never `===`, or `findOne` silently returns `null`. Once
  the manual conversion step is done, the descriptive "(convert to Slot)"
  suffix has no reason to stay — safe to rename the Slot node back to a plain
  name (`status`, `action`) afterward; Figma does not require Slot names to
  be file-unique (confirmed: renaming 18 pairs to the same two plain names
  produced no auto-suffixing, unlike the original conversion step).
- **A real, confirmed Figma rendering bug: an effect (e.g. `INNER_SHADOW`) on
  a frame with no fill corrupts text rendering for that frame's descendants.**
  Glyphs render missing/warped (e.g. hyphens vanish, letters warp toward a
  serif substitute) specifically for **Plus Jakarta Sans as a variable font**
  (`fontName.variationSettings`, a weight-axis instance rather than a static
  per-weight file) — this is what actually broke `Row`'s heading/description
  text this session, not any specific edit sequence. **Root-caused the hard
  way**: three different theories (redefining text styles, instance-level
  text overrides, "any sustained document activity") were each individually
  disproven by isolated tests before the owner found the real cause by
  inspecting the effects list directly. Once found, trivial to confirm:
  removing the effect and using a real **stroke** instead (Figma has no
  bottom-only-border primitive, so a 1px-bottom-only stroke via
  `strokeBottomWeight = 1` + `strokeTopWeight/strokeLeftWeight/
  strokeRightWeight = 0`, `strokeAlign: 'INSIDE'`,
  `strokesIncludedInLayout: false` for layout-neutrality — same recipe as
  Card's own inset-stroke technique) renders perfectly on the identical
  no-fill frame. **Strokes on a no-fill frame are fine; effects on one are
  not.** Neither closing/reopening the file nor a full Figma Desktop restart
  ever cleared it once introduced — only reverting past the point the effect
  was added did (confirms it's saved into the document, not merely an
  in-memory render cache). If this recurs: check the node's `effects` array
  first, before chasing anything else — verify via the API
  (`node.characters`/`fontName`/`textStyleId`) that the underlying document
  data is correct (it always was, every time, across every test this session)
  to rule out real data corruption, then check for any effect sitting on a
  fill-less frame. (The `build-04-text-styles-N.js` drift-safety fix from
  earlier in this saga is still a good change — redefining an unchanged style
  every run was real, avoidable waste — but it was not the actual cause here;
  don't rely on it alone if this recurs.)

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
  figma-agent-checklist/       5 real bugs spawned agents shipped building screen content (stale
                                instance defaults, reshuffled nav order, doubled icon+text signals,
                                wrong badge component) — hand this to any agent building/filling
                                screen content alongside its task instructions
scripts/figma/fig.mjs         the bridge helper
migration/
  journal.jsonl                every Figma write this whole project, timestamped — READ THIS for full history
  build-0*.js                  generated idempotent token→Figma snippets (gitignored, regen via tokens-to-figma.mjs)
CHANGELOG-renames.md           every rename/decision, newest first — the detailed companion to this file
```

## 8 · Immediate next steps

1. Bring the bridge up (§4) — reopen Figmosha Bridge plugin in Figma Desktop,
   restart `bridge.mjs` if needed, `ping.js` to confirm.
2. **Build `Row` in Figma** — React side is done (`src/components/Row`, see
   `docs/components/Row.md`). The old "keep it dumb/freeform children" plan
   here (from when only two reference shapes existed) is superseded — the
   owner pinned down the real anatomy: `leading` (`IconCell` only, typed
   prop) + fixed heading/description + `status`/`action` (two ordered real
   Slots). Once built, finishes `ListCard` (goes in `ScrollableArea`'s
   `content` slot inside `ListCard.Body`). Note: `figma.createSlot()` isn't
   scriptable, so `status`/`action` need a manual "convert to Slot" click per
   variant, same gap as `ListCard`'s own `content` frame.
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
