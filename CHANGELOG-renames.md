# Rename log

Every time a token, variable, component, or variant is renamed, add a line here.
Format:

```
DATE  old.name → new.name    figma <status>  tokens <status>  build <status>  src <status>
```

Use `✓` when a surface is updated, `—` when it doesn't apply, `PENDING` when it still needs doing.

---

<!-- newest first -->

2026-09-03  AppShell built in Figma (matches React)    figma ✓
            AppShell COMPONENT: 1440x900, sidebar 64xFILL (background/emphasis, pad space/12) + main gutter (space/12, left space/8) + content surface (background/subtle, radius/container, pad+gap space/20).
            All new-token bound. MANUAL follow-up: convert content (+ sidebar) frames to Figma Slots — figma.createSlot is not in the plugin API. Screens become AppShell instances with the content slot filled.

2026-09-03  Layout: breakpoints + Box/Stack + AppShell    src ✓  docs ✓  build ✓
            src/lib/breakpoints.ts (sm640/md768/lg1024/xl1280/2xl1536 + up()/down() helpers; not DTCG). src/components/Box (p/px/py/bg/radius/border, token-mapped) + Stack (direction/gap/align/justify/wrap/columns).
            src/components/AppShell: fixed 64px sidebar rail (empty dark bar, sidebar slot) + padded main whose rounded content surface scrolls (100dvw/dvh, only .content scrolls). dims literal for now (size/app/* TODO).
            docs/components/layout.md (Box+Stack) + AppShell.md (structure + stretch-columns guide + breakpoints). Screens are pages, not components.

2026-09-03  Button + IconButton — React build    src ✓  docs ✓  build ✓
            src/components/Button/ (Button.tsx, Button.module.css, Spinner.tsx) + src/components/IconButton/. variant (primary/secondary/tertiary) × size (sm/md/lg/xl).
            Shared `.surface` CSS module class (variant colour/border/shadow/state, [data-variant]-keyed) — IconButton imports it. States all CSS (:hover, :focus-visible+:active identical, :disabled).
            `loading` → <Spinner> (animated arc) in the leading slot, trailing icon hidden, label stays, aria-busy, interaction blocked. asChild via Slot/Slottable. IconButton requires aria-label (TS-enforced).
            Heights literal px in CSS (28/32/36/40 · 36/40/44/56) — size/control/* tokens TODO. tsc + build clean.

2026-09-03  IconButton (Figma, Claude-built by cloning Button)    figma ✓  src —
            Separate component (square, one icon, no label, aria-label required). Cloned the 48-variant Button set: deleted leading/trailing icon bools + trailingIconSwap, renamed leadingIconSwap→iconSwap; kept loading/size/variant/state.
            Each variant made square = the Button height for that variant×size (primary 36/40/44/56, secondary+tertiary 28/32/36/40), icon centred, sized per variant. Reuses ALL color/button/*, Viginette styles, radius/button/*, states — 0 new tokens. 0 old bindings.

2026-09-03  Button tertiary variant (Claude-built) + color.button.tertiary tokens    tokens ✓  build ✓  figma ✓  src —
            color.button.ghost → tertiary: text {default {color.text.strong}, active {color.text.brand}}, icon {default {color.icon.default}, active {color.icon.brand}}. ghost vars removed.
            16 tertiary variants cloned from secondary, surface stripped (no fill/stroke/effect). Same label styles / icon sizes / heights as secondary. hover → underline; active → underline + brand colour; disabled → 0.7 opacity.
            Button component set is now 48 variants (16 × primary/secondary/tertiary) — Figma complete. Remaining: React build.

2026-09-03  Button loading spinner — all 32 variants    figma ✓  src —
            `loading` boolean (owner renamed from Spinner). `Loading` layer = child 0 (leading), AUTO, hidden by default, ref `loading#10059:0`. spinner size = icon size per variant:
            primary xl22/lg20/md20/sm16, secondary xl20/lg18/md16/sm14; fill → color/button/{variant}/icon. Claude: fixed primary sm 18→16, cloned Loading into all 16 secondary variants.
            Figma cannot invert a boolean → loading does NOT auto-hide the icon layers; React does `{loading ? <Spinner/> : leadingIcon}`. Button Figma now complete bar the tertiary variant.

2026-09-03  +color.button.primary.border.active = white; Button Figma done (bar loading/tertiary)    tokens ✓  build ✓  figma ✓  src —
            full 1.5px white border on primary focus/active (parallels secondary.border.active). Applied to 4 primary active variants. primary active shadow aligned to rest (Viginette/2xs primary) by owner.
            Button component set = 32 variants, all bindings clean, heights/radius/labels/states done. Remaining: loading state, tertiary variant, React build.

2026-09-03  Button — cleanup + owner states/heights    figma ✓ (0 old bindings)  src —
            32 variants (4 sizes × 2 variants × 4 states). Owner: heights (sec 28/32/36/40, pri 36/40/44/56), primary active+disabled, made Viginette/2xs primary + hover styles, disabled 0.7.
            Claude: stroke weights unbound from stroke/glass elements/* → raw 1.5/0/0/1.5 catch (active 1.5 all-side), INSIDE + not-in-layout; secondary hover → Viginette/2xs hover; md-secondary padding xs → space/8.
            LEFT (non-loading/tertiary): primary focus/active border colour (reuses border/default #aab1f9, low contrast on the indigo fill — recommend +color.button.primary.border.active = white); primary active uses hover shadow vs secondary active rest shadow (align?); no separate focus state (active covers it).

2026-09-03  +text.label.xl (18px) — label ramp now 5 (18/16/14/13/12)    tokens ✓  build ✓  figma ✓  docs ✓
            for the xl / 56px primary button. bold, tight lh, no trim, bound family/size/weight like the rest. 20 text/* styles total. build-04 slices 3+4 rerun.

2026-09-03  radius.button → per variant × size (radius follows height)    tokens ✓  build ✓  figma ✓  docs ✓
            primary & secondary have different heights at the same size name, so radius must key on both. secondary {sm 6, md/lg/xl 8}; primary {sm/md 8, lg/xl 12}.
            build-03 rerun: +8 radius/button/{primary,secondary}/* vars, 4 per-size orphans removed; 28 Button variants rebound. `--radius-button-<variant>-<size>` in CSS.

2026-09-03  radius tweak: Badge lg 12→8, Button per-size    tokens ✓  build ✓  figma ✓  docs ✓
            radius.badge.lg {radius.panel}→{radius.control} (8). radius.button leaf → per-size {sm {radius.chip} 6, md/lg/xl {radius.control} 8}.
            build-03 rerun: +4 radius/button/* vars, orphan radius/button removed; Badge lg auto-updated via alias, Button 28 variants rebound per size.

2026-09-03  Button (Nova kit) — property rename + partial token rebind    figma ~  src —
            props: Size/Variant/State → size/variant/state; Show left/right icon → leadingIcon/trailingIcon (bool); left/right icon → leadingIconSwap/trailingIconSwap.
            size values Extrasmall/Small/Default/Large → sm/md/lg/xl (ascending). 28 variants: radius radius-md→radius/button, gap out-of-scale→space/6, label Title/Label-1/*→text/label/md, stray text stroke removed.
            Owner had already bound color/button/{primary,secondary}/* to fills/strokes/text/icon + primary shadow. LEFT: padding (out-of-scale, height-driven — owner), stroke geometry, state=invalid (drop?), primary missing states, per-size label, loading. checkpoint: safe-edit: pre Button property rename.

2026-09-03  secondary Button tokens (glass, neutral = StatButton surface)    tokens ✓  build ✓  figma ✓  src —
            color.button.secondary reworked: background.default -> {color.card.background.default} (#fcfcfc, state-invariant fill). text -> {color.text.strong}. +icon -> {color.icon.default}.
            border.default -> {color.card.border} (white catch), border.active -> {color.card.border-active} (primary, focus/active). Dropped background.hover/active + old border leaf.
            Reuses the shared Viginette/2xs <-> hover effect styles (no secondary-specific shadow token). build-03 rerun (+3 vars, 3 orphans removed). checkpoint safe-edit: pre secondary-button tokens.

2026-09-03  primary Button tokens (glass, coloured)    tokens ✓  build ✓  figma ✓  src —
            color.button.primary reworked: background.default {color.brand.400} / .hover {color.brand.500} (button-only gimmick — semantic brand stays 600).
            +text {on-brand} +icon {on-brand}. +border.default #aab1f9 / .hover #7a85f8 (glass catch, hand-tuned). +shadow.default #6570e1 / .hover #4e51ed
            (inner-shadow colour for owner-made "Viginette primary 2xs" / "...hover" effect styles). Dropped background.active. build-03 rerun (+5 vars, orphan removed).
            checkpoint safe-edit: pre primary-button tokens.

2026-09-03  StatCard (was `Dashboard card`) — reworked in Figma + built    figma ✓  docs ✓  src ✓  build ✓
            L2. Renamed `Dashboard card`→`StatCard`; property `variant`(Default/has badge)→`badge`(false/true) — stays a variant because content sits in Card's slot
            and slot content cannot take component properties. Layers: div→`header`/`stats`; root fill→transparent. All placeholder text→"Label"/"0".
            Composes `Card padding=lg` (nested, never detached). React: src/components/StatCard/ — typed label/value, optional `badge` slot, `children` = StatButton row (flex:1 each).
            Figma has 2 fixed StatButtons; React children is any count (documented divergence).

2026-09-03  StatButton — reworked in Figma + built in React    figma ✓  docs ✓  src ✓  build ✓
            First interactive component + first Claude-built Figma component. From kit `Stat - button` (copy renamed `StatButton`).
            Figma via bridge (checkpoint `safe-edit: pre StatButton rework`): props Variant→tone(default/danger), Size→size(sm/lg), +state(default/hover) = 8 variants.
            Rebound ALL colour/radius/spacing/type to new collections: radius/control, color/card/background/default, color/card/border, space/8+12,
            text/body/sm (label), text/heading/md|lg (value), color/text/subtle|default|danger. Detached kit `Text Combination` → plain `content` frame.
            state=hover swaps effect style `Viginette/2xs` → `Viginette/2xs hover` (the shared glass-button rest/hover treatment). Arrow rebound.
            (effect styles themselves still ref the `effects/` + shadcn-alpha shims — out of scope, effects not migrated.)
            React: `src/components/StatButton/` — `<button>`, no asChild (Slot can't wrap structural children). States = CSS (:hover, :focus-visible+:active ring, :disabled).

2026-09-03  SeverityBadge — built (Figma + React)    figma ✓  docs ✓  src ✓  build ✓
            L2. docs/components/SeverityBadge.md + src/components/SeverityBadge/. level(4) x size(3) x format(2) = 24 Figma variants.
            pill = <Badge tone={map} size>{label}</Badge>, NO icon (colour+bold text carry severity). icon = bare alert-triangle 16/20/24 in tone colour.
            level->tone: low=success, attention=warning, warning=warning-strong, critical=danger. Triangle path extracted verbatim from Figma vector (evenodd punch for the !).
            Reconcile: Badge icon-bool default re-fixed to false; SeverityBadge icon frames had stray foreign radius binds (removed by owner); level order fixed to severity order.

2026-09-03  color.badge.warning.text: text.warning → color.amber.600 (one step lighter)    tokens ✓  build ✓  figma ✓  docs ✓  src —
            amber `warning` and orange `warning-strong` badge text were near-identical (amber.700 vs orange.700). Lighten warning to amber.600.
            Deliberate component-tier primitive alias (like color.surface.card). Contrast ~3.2:1 on amber.100 — accepted: level differentiation is the bigger a11y win. build-03 re-run.

2026-09-03  Badge gains `warning-strong` tone (orange) + warning-strong-subtle 50->100    tokens ✓  build ✓  figma ✓  docs ✓  src ✓
            Needed for SeverityBadge `attention`. background.warning-strong-subtle orange.50 -> orange.100 (parity with the other -subtle tones).
            BadgeTone union + `.badge[data-tone=warning-strong]` + Badge.md row. Figma Badge set: +3 variants (warning-strong x sm/md/lg), now 18.

2026-09-03  Badge: per-size radius + lg padding    tokens ✓  build ✓  figma ✓  docs ✓  src ✓
            radius scale has no 10 → `radius.badge` becomes per-size: sm `{radius.chip}` 6 · md `{radius.control}` 8 · lg `{radius.panel}` 12
            (larger badge borrows the next radius role up). Only component radius that is per-size. Generator regex broadened; build-03 re-run (+3 vars); 15 Figma variants rebound.
            lg padding `space/8` → `space/10` (owner) — heights now ~sm27 / md32 / lg38.

2026-09-03  label ramp: line-height snug → tight (1.15), cap-trim REVERTED    tokens ✓  build ✓  figma ✓  docs ✓  src ✓
            `leadingTrim: CAP_HEIGHT` on `text/label/*` clipped descenders (14px label measured ~10px) and — being smaller
            than a 1em icon — made badges jump height when the icon toggled.
            Fix: `text.label.{lg,md,sm,xs}` lineHeight snug → **tight** (1.15), leadingTrim → NONE everywhere.
            Generator: dropped the label-trim logic, forces leadingTrim NONE. Re-ran text-style slices 3+4.
            Badge: icons resized 20/16/14 → **1em** (16/14/13) so icon < label box → height stable w/ or w/o icon.
            Badge.module.css: line-height hardcoded 1 → var(--text-label-md-line-height). Heights now ~sm27/md32/lg34, Figma == CSS.

2026-09-03  Badge — built (Figma + React)    figma ✓  tokens ✓  build ✓  docs ✓  src ✓
            docs/components/Badge.md + src/components/Badge/. tone (neutral/brand/success/warning/danger) × size (sm/md/lg),
            optional leading `icon` slot, asChild, root <span> inline-flex. Reconciled A-D + weight rebind against the Figma set:
            A `Variant`/`Size` → `tone`/`size` (user); B radius → `radius/badge` 6px (user); C label nodes now use text/label/* clean
            (no overrides — node == style once ramp went bold); D icon-bool default false, default variant → neutral/md;
            C+ text/label/* fontWeight rebound Weights/Bold → font/weight/bold.
            Height: Figma padding+cap-trim vs CSS line-height:1 → browser renders ~2-4px taller; accepted (hug component).

2026-09-03  Badge reconcile — label ramp → bold, `*-subtle` bg → 100    figma ✓  tokens ✓  build ✓  docs ✓
            E: `text.label.{lg,md,sm,xs}` weight semibold → **bold** (owner's call; affects button/input/tab/table-header too). Figma styles already switched.
            G: `background.{brand,success,warning,danger}-subtle` → primitive **100** (was 50), for stronger badge fills.
               Side effects (shared semantic token): ghost-button hover/active tint, selected table-row tint, and all *-subtle banners/callouts also go one step stronger.
               `info-subtle` + `warning-strong-subtle` left at 50 → semantic-layer asymmetry, flagged for parity decision.
            Figma `Badge` set built: 15 variants (tone×size), icon = boolean + instance-swap component property, leading icon.
            Still to fix in Figma before src: `Variant`→`tone` / `Size`→`size` prop rename; radius rebind `radius/lg|md` → `radius/badge`;
            strip redundant font-property overrides on the Label node (keep style + colour only); icon-bool default true→false, size default lg→md.

2026-09-03  Figma text styles — bind family/size/weight to font/* primitives    figma ✓
            build-01 now also creates font primitives: font/family/{sans,mono} (STRING), font/size/{10..64} (FLOAT), font/weight/{medium,semibold,bold,extrabold} (FLOAT).
            build-04 binds fontFamily + fontSize + fontWeight on all 19 text/* styles.
            NOT bound: lineHeight / letterSpacing — Figma force-converts a bound variable on those fields to PIXELS,
            which destroys a ratio line-height / em tracking. They stay raw PERCENT on each style. (font/lineHeight+letterSpacing vars created then removed.)

2026-09-03  Figma text styles rebuilt from tokens — clean `text/*` set    figma ✓  tokens —  build —
            No `text/*` styles existed (only the 53 legacy `Title/*`; the earlier build was lost, likely a version restore — HANDOFF §6).
            Regenerated all 19 from tokens/*.type.json via tokens-to-figma.mjs → build-04-text-styles-{1..4}.js (all creates, 0 updates, no reflow).
            NEW in generator: `text/label/*` get `leadingTrim: CAP_HEIGHT` (single-line UI labels drop into components with no line-height override);
            each style carries its token `$description`. `Title/*` left intact — cleared during the screen rebuild.
            leadingTrim is Figma-only (no DTCG field) — documented as a label-ramp convention.

2026-09-03  Card border decision resolved    src ✓  build ✓  figma ✓  docs ✓
            Figma extract confirms: inside stroke, strokesIncludedInLayout: false, top/left 1.5px, right/bottom 0.
            Card.module.css border-top/border-left → single `box-shadow` (inset white catch + inset vignette xs),
            layout-neutral to match. Card.tsx unchanged. Figma Card set matches docs/components/Card.md 1:1.

2026-09-02  neutral hue gray → slate (colder / more premium)    tokens/semantic.color.json ✓  docs ✓  build ✓  figma PENDING  src —
            (all `{color.gray.NN}` semantic aliases repointed to `{color.slate.NN}`; both hues still in primitives — `gray` is now a prune candidate)

2026-09-02  token additions (decisions from audit)    tokens ✓  build ✓  figma ✓  docs ✓
            + color.surface.card → color.extra.card (#fcfcfc)   card fill, product override
            + color.background/text/icon.warning-strong → orange.{500,700,600}   alert warning pill/icon (amber `warning` unchanged)
            + color.background.warning-strong-subtle → orange.50 · color.badge.warning-strong.*
            + color.chart.1..8   categorical placeholder palette (rebuild with real chart component)
            decision: keep indigo brand + slate neutral — screens migrate/recolour intentionally

2026-09-02  screen colour migration (24 Base instances)    figma ✓  (mapping.json)
            - 59 local old vars (shadcn colors/*, theme/*, tw-raw/*) repointed to alias new tokens — screens recolour, 0 node edits
            - 193 node rebinds for library vars (severity/*/text ×103, Green/60 ×63, Card/Main color ×27)
            - result: 0 library bindings remain; all screen colour resolves through the new token system
            - 220 raw-hex paints remain (glass/effect — deferred); old collections kept as alias shims (delete later)

2026-09-02  neutral zinc replaces slate (slate too blue)    tokens ✓  docs ✓  build ✓  figma ✓
            all {color.slate.*} semantic aliases + mapping.json targets → {color.zinc.*}. build-02 + repoint-local re-run. gray still a prune candidate too.

2026-09-02  text ramp lightened + text.strong added    tokens ✓  docs ✓  build ✓  figma ✓
            color/text: default=zinc900 (main headings), strong=zinc800 NEW (subheadings, renamed from user's "Color"),
            subtle=zinc500 (body — was zinc700), muted=zinc400 (was zinc500), disabled=zinc300 (was zinc400)

2026-09-02  A raw-hex + B radius + C typography (partial)    figma ~
            A: all remaining raw-hex paints on screens are glass/effect (#15adc3b2 teal glass ×24/screen, #ffffff1a, #4040401a) — SKIP per instruction. #989898 (~24 uses) flagged, not bound.
            B: 13 'border radii' vars repointed to alias radius/* primitives (shim). 3xl/4xl (22/26px) clamped to radius/2xl (16 cap).
            C: shim strategy — redefine old Title/*/paragraph* styles in place to the text/* scale (keep weight from name). paragraph* styles done; Title/* pending (plugin kept wedging on the cascade reflow).

2026-09-02  C typography — COMPLETE    figma ✓
            figmosha redefines a text style ~50s each in this file (synchronous reflow of every node using it). Not viable to finish via API.
            Done: all paragraph*, Title/H2-H5. Remaining 38 (Title/Title-1, H6, Body-1, Label-1/2/3, Caption, monospace, standalone heading 1-4)
            -> migration/typography-remaining.md (spec table; finish in Figma UI, seconds each).

2026-09-02  C typography COMPLETE (update)    figma ✓
            background C passes finished all Title/* redefines; user deleted unused non-Title styles.
            53 Title/* styles now = Plus Jakarta Sans on the text/* scale (weight kept from name). typography-remaining.md rewritten as completion record.

2026-09-02  +color.border.highlight (white); card.border -> highlight    tokens ✓ build ✓ figma ✓
            Card finalised: padding-only (12/16/20), no elevation/interactive, asymmetric glass border (top+left 1.5px white), vignette-xs inner shadow #f0f0f0 (not tokenised)
