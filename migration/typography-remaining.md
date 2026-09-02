# Typography migration — 38 styles left to redefine by hand

**Why by hand:** the figmosha plugin API redefines a text style *synchronously*,
and each edit forces Figma to reflow every node using that style (hundreds each)
before the next line runs — ~50 s per style in this file. Editing the same styles
in Figma's UI (Assets → right-click style → Edit) does the reflow async and takes
seconds.

37 of 75 old styles are already redefined to the new scale. For each below: open
the style, set **font = Plus Jakarta Sans**, and the size / line-height / letter-
spacing shown. **Keep the weight** already in the style name (Medium / SemiBold /
Bold / ExtraBold). Line-height as **%**, letter-spacing as **%**.

| old style | matches new | size | line-height | letter-spacing |
|---|---|---|---|---|
| `Title/Title-1/*` (Medium/SemiBold/Bold/ExtraBold) | `text/display/xl` | 64 | 100% | −2% |
| `Title/H6/*` (SemiBold/Bold/ExtraBold) | `text/heading/sm` | 20 | 130% | 0% |
| `Title/Body-1/*` (Medium/SemiBold/Bold) | `text/body/lg` | 16 | 150% | 0% |
| `Title/Label-1/*` (Medium/SemiBold/Bold/ExtraBold) | `text/label/lg` | 16 | 130% | 0% |
| `Title/label-1/table header` | `text/label/lg` | 16 | 130% | 0% |
| `Title/Label-2/*` (Medium/SemiBold/Bold/ExtraBold) | `text/label/md` | 14 | 130% | 0% |
| `Title/Label-3/*` (Medium/SemiBold/Bold/ExtraBold) + `Label-3/Badge` | `text/label/xs` | 12 | 130% | +1% |
| `Title/Caption/Caption-1/*` (Medium/SemiBold) | `text/caption` | 12 | 150% | 0% |
| `Title/Caption/Caption-2/*` (Medium/SemiBold) | `text/caption` | 12 | 150% | 0% |
| `monospace/*`, `monospace small/*`, `monospace mini/*` | `text/code` | 13 | 150% | 0% · **font = Roboto Mono** |
| `heading 1` (standalone, likely unused) | `text/display/md` | 36 | 115% | −1% |
| `heading 2` | `text/heading/xl` | 32 | 115% | −1% |
| `heading 3` | `text/heading/lg` | 28 | 130% | −1% |
| `heading 4` | `text/heading/md` | 24 | 130% | −1% |
| `caption` (standalone) | `text/caption` | 12 | 150% | 0% |

Already done (don't touch): all `paragraph*`, `Title/H2/*`, `Title/H3/*`,
`Title/H4/*`, `Title/H5/*` (verify by checking their line-height reads in **%**
not **px**).

After these are done, the old `Title/*` / `paragraph*` / `monospace*` styles are
pure shims — every text node still names them, but they render on the new scale.
Rebind text nodes to the real `text/*` styles + delete the shims during the
component rebuild.
