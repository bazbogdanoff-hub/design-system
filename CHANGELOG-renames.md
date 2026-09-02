# Rename log

Every time a token, variable, component, or variant is renamed, add a line here.
Format:

```
DATE  old.name → new.name    figma <status>  tokens <status>  build <status>  src <status>
```

Use `✓` when a surface is updated, `—` when it doesn't apply, `PENDING` when it still needs doing.

---

<!-- newest first -->

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
