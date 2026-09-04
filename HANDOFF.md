# Session handoff — Logistics CRM design system

Read this first if you're a fresh session. Everything below is also durable in
the repo (`CHANGELOG-renames.md` — full decision log, newest first;
`migration/journal.jsonl` — every Figma write, timestamped; `docs/`;
`.claude/skills/`).

Last updated: 2026-09-03 · repo HEAD `c56b2fa`

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
| `semantic.color.json` | semantic | `color.{background,surface,text,border,icon,chart}.*` |
| `component.color.json` | component | `color.{button,card,input,badge,table,modal}.*` |
| `primitives.type.json` + `semantic.type.json` | — | Plus Jakarta Sans, **20** composite `text.*` styles |
| `primitives.layout.json` + `semantic.layout.json` + `component.layout.json` | — | `radius.*`, `space.*` (4px grid + 2/6/10) |

**Figma:** collections `Primitives` / `Semantic` / `Component` + 20 `text/*`
styles — all built from token JSON via
`.claude/skills/figma-safe-edit/scripts/tokens-to-figma.mjs` →
`migration/build-0*.js`. The generator handles: colour primitives/aliases,
`radius.*` (including **per-size and per-variant×size** component radius, see
§5), `space.*`, and `font/*` primitives (family/size/weight — **not**
line-height/letter-spacing, see gotcha in §6) bound onto every text style.

### Since the last full audit, added this session

- `text.label.xl` (18px) — the label ramp is now **5 steps**: xl18·lg16·md14·sm13·xs12
- Label ramp: weight **bold** (was semibold, owner's call, system-wide — affects
  every future button/input/tab label), line-height **tight** (1.15, was snug
  1.3) — **`leadingTrim: CAP_HEIGHT` was tried and reverted** (clipped
  descenders, and being shorter than a 1em icon caused height jumps on
  Badge/StatButton when an icon toggled). Tight line-height solves the same
  problem without amputating glyphs.
- `color.border.highlight-active` (brand.500) + `color.card.border-active` —
  **the shared glass focus/active treatment**: the white top-left 1.5px catch
  becomes a **full 4-side 1.5px primary border** on `:focus-visible`/`:active`.
  Used by StatButton, Button-secondary, Button-primary (its own white variant,
  see below).
- `color.button.primary.*` — background `brand.400`→`.hover brand.500`
  (a **button-only** lightening gimmick; `color.text.brand`/`color.icon.brand`
  stay at 600 everywhere else), `text`/`icon` → `on-brand` (white),
  `border.default #aab1f9` / `.hover #7a85f8` / `.active` → white (full border),
  `shadow.default #6570e1` / `.hover #4e51ed` (hand-tuned, bind the owner's
  `Viginette/2xs primary` / `…hover` effect styles' inner-shadow colour).
- `color.button.secondary.*` — reuses the Card/StatButton glass surface
  (`color.card.*`) + `text.strong` + `icon.default`.
- `color.button.tertiary.*` (replaced the old `ghost`) — `text.default
  {color.text.strong}` / `text.active {color.text.brand}` ("turns primary
  colour" on active), `icon` mirrors. Hover = underline only (no colour
  change); active/focus = brand colour + underline.
- `radius.badge` and `radius.button` are **per-size** (badge) / **per
  variant×size** (button) — radius follows rendered height, not a flat rule.
  Badge: sm 6 · md/lg 8. Button: secondary sm6/md-xl8 · primary sm-md8/lg-xl12.
  (`radius.button.{secondary,primary}.{sm,md,lg,xl}` — 8 tokens.)
- Badge gained a 6th tone **`warning-strong`** (orange) for SeverityBadge's
  `attention` level; `background.warning-strong-subtle` bumped 50→100 to match
  the other four (which also moved 50→100 earlier — `info-subtle` and none
  others still sit at 50, a known semantic-layer asymmetry, not yet resolved).
- `color.badge.warning.text` deliberately lightened to `{color.amber.600}`
  (was `{color.text.warning}`/amber.700) — a component-tier **primitive**
  alias (like `color.surface.card`), so the amber `warning` badge reads
  distinctly from the orange `warning-strong` badge. ~3.2:1 contrast accepted
  — level differentiation judged the bigger a11y win.
- StatButton's value text: `color.text.default` → `color.text.strong` (one
  step lighter than a main Card/StatCard heading, owner's call).

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
| **Button** | L1, interactive | `variant`(primary/secondary/tertiary) × `size`(sm/md/lg/xl, **different px per variant** — see §3) × `state`(4) = 48 variants. `leadingIcon`/`trailingIcon` (both allowed at once), `loading` (spinner in leading slot — **Figma can't invert a boolean**, so the icon-hiding-on-loading only happens in React, not the Figma reference), shared `.surface` CSS class |
| **IconButton** | L1, interactive | square, one icon, **`aria-label` required** (TS-enforced union type); cloned from Button in Figma (48 variants), imports Button's `.surface` in React — 0 new tokens |

### Layout / shell — built this session, **in progress**

| component | tier | notes |
|---|---|---|
| **Box** | L1 | token `p`/`px`/`py`/`bg`/`radius`/`border`; no layout logic |
| **Stack** | L1 | flex, `direction`/`gap`/`align`/`justify`/`wrap`/`columns` (row, equal stretch) |
| **Grid** | L1 | **12-column** CSS grid, `Grid.Item span` (uneven splits = different spans, e.g. 8+4, 3+3+6). **This is the one true content-layout tool** — a row-grid was tried and rejected (876px content height ÷ 8 rows = 90.5, not clean; decided rows always flow by content height, never gridded) |
| **AppShell** | shell | `sidebar`(collapsed 64px / expanded 240px) variant; fixed viewport (`100dvw`×`100dvh`), only the content region scrolls. **Figma `content` slot has NO padding/scroll of its own** — `Page` owns that |
| **Page** | shell/L2 | `layout="scroll"` (whole page scrolls+padded) or `"fixed"` (grid rows, only `Page.Body` scrolls); `Page.Header`/`Body`/`Footer`, each takes `bleed` to go flush to the content-card edge. **React done.** Figma: component renamed from "Page — layout guide" to plain **`Page`** (2 variants, transparent — no longer draws its own bg/radius, AppShell's slot already does), structured into regions — **⚠ 4 frames still need the user to manually convert to Figma Slots** (API can't do it): `content` in `layout=scroll`; `Header`/`Body`/`Footer` in `layout=fixed`. **This is the very next thing to finish.** |
| `breakpoints.ts` | util | `sm640/md768/lg1024/xl1280/2xl1536` (Tailwind values) + `up()`/`down()` helpers. Design screens at **1440**, spot-check 1280. `lg` (1024) is the real desktop floor — below it the sidebar should collapse (not yet wired to a media query anywhere). |

**Composition rule (settled, don't re-litigate):** `AppShell` content slot →
`<Page>` → `Grid`/`Stack` of cards. **Never cards directly in the slot** — the
slot is dumb chrome, `Page` owns padding/scroll/sticky/header. **Screens are
not design-system components** — they're app pages/routes that render
`<AppShell sidebar={<CrmSidebar/>}><Page>…</Page></AppShell>`; in Figma a
screen is a frame nesting one `AppShell` instance with the slot filled, never
a component of its own.

**Figma layout guides — deliberately trimmed down to one.** `Page — layout
guide` (region reference) and `Content columns — layout guide` (stretch-column
widths) were built, then **deleted by the owner** in favour of a single
**`Content grid — layout guide`** (`sidebar=collapsed|expanded`, the 12-column
grid + example span rows 4·4·4/8·4/3·3·6/5·4·3 with pixel widths). If you see
docs or old chat referencing the other two, they no longer exist — don't
recreate them.

**Known TODO, flagged repeatedly, not yet done:** AppShell/Page/IconButton/
Button dimensions (sidebar width, gutter, button/control heights) are literal
px in the CSS, not tokens. A `size/control/*` (and maybe `size/app/*`) token
family was discussed as the next cleanup but never built.

### Not started

`Input`, `Select`, `Tab`, `Alert` (from `Info message`), `DataTable`,
`NavItem`/`NavSection` (sidebar content), `Pagination`, `EmptyState`. Suggested
order (per the last live discussion): finish **Page slots** →
`size/control/*` tokens → `Input`+`Select` → `Tab` → `DataTable` (validates the
whole shell: `Page layout="fixed"` + `bleed` + sticky header) →
`NavItem`/`NavSection`.

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
- Redefining an existing text style via the API ≈ 50s each (synchronous
  reflow) — fine for **new** styles (no reflow), avoid batch-redefining
  existing ones. `≤4 screens` / `≤5 createTextStyle` per exec for anything
  that walks node trees, or the plugin wedges (killed client leaves a zombie —
  no cancel).
- A Figma **version restore** unwinds everything after it — re-run the
  affected idempotent `migration/*.js` scripts.
- `strokesIncludedInLayout: false` + `strokeAlign: INSIDE` = layout-neutral
  stroke (matches CSS `box-shadow: inset`, not CSS `border`, which inflates an
  auto-height box). This was Card's original bug; the whole "glass catch → CSS
  inset box-shadow" pattern used everywhere (Card, StatButton, Button) comes
  from this.

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
2. **Finish `Page`**: ask the user to convert the 4 named frames to Figma
   Slots (`content` in `layout=scroll`; `Header`/`Body`/`Footer` in
   `layout=fixed`). Once done, `AppShell` + `Page` are fully composable and
   real screens can be assembled in Figma.
3. From there: either start wiring an actual dashboard screen (the owner has
   shown real mockups — a KPI-tile row + chart/activity row + a flagged-items
   list, matching the `Content grid` guide's 4·4·4 / 8·4 patterns), or pick up
   the next component off the list in §5 (`size/control/*` tokens first,
   recommended, then `Input`/`Select`).
4. Deferred, not blocking: migration task `E` — node-rebind screens/components
   off the old shim collections (`shadcn colors`, `theme`, `border radii`,
   `Title/*`), then delete those collections. Do it gradually as each
   screen/component is rebuilt for real.
