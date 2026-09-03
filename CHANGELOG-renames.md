# Rename log

Every time a token, variable, component, or variant is renamed, add a line here.
Format:

```
DATE  old.name → new.name    figma <status>  tokens <status>  build <status>  src <status>
```

Use `✓` when a surface is updated, `—` when it doesn't apply, `PENDING` when it still needs doing.

---

<!-- newest first -->

2026-09-03  Badge reconcile — label ramp → bold, `*-subtle` bg → 100    figma ✓  tokens ✓  build ✓  docs ✓  src PENDING
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
