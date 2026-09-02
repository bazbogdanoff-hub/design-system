# Typography migration — COMPLETE

All old text styles are handled.

- **Deleted** (unused, cleaned up by hand): every non-`Title/` old style —
  `paragraph*`, `monospace*`, standalone `heading 1–4`, standalone `caption`.
- **Redefined in place** (shim): all **53 `Title/*`** styles. Each now uses
  **Plus Jakarta Sans**, with size / line-height / letter-spacing from the
  matching `text/*` token, and the **weight kept from its own name suffix**
  (Medium / SemiBold / Bold / ExtraBold; `Regular` → Medium).

Verified: 53/53 report line-height in `%`, family = Plus Jakarta Sans,
tracking ∈ {−2%, −1%, 0%, +1%}.

## What each `Title/*` prefix now equals

| old style prefix | renders as | size | line-height | tracking |
|---|---|---|---|---|
| `Title/Title-1/*`, `Title/Title-2/*` | `text/display/xl` | 64 | 100% | −2% |
| `Title/H1/*`, `Title/H2/*` | `text/display/lg` | 48 | 100% | −2% |
| `Title/H3/*` | `text/display/md` | 36 | 115% | −1% |
| `Title/H4/*` | `text/heading/xl` | 32 | 115% | −1% |
| `Title/H5/*` | `text/heading/md` | 24 | 130% | −1% |
| `Title/H6/*` | `text/heading/sm` | 20 | 130% | 0% |
| `Title/Body-1/*` | `text/body/lg` | 16 | 150% | 0% |
| `Title/Label-1/*`, `Title/label-1/table header` | `text/label/lg` | 16 | 130% | 0% |
| `Title/Label-2/*` | `text/label/md` | 14 | 130% | 0% |
| `Title/Label-3/*`, `Title/Label-3/Badge` | `text/label/xs` | 12 | 130% | +1% |
| `Title/Caption/Caption-1/*`, `Title/Caption/Caption-2/*` | `text/caption` | 12 | 150% | 0% |

## Left for the component rebuild

The `Title/*` styles are now **shims** — text nodes still name them, but they
render on the new scale. During the component rebuild:

1. Rebind text nodes to the real `text/*` styles (drop the weight variants —
   pick the one `text/*` style; weight is fixed by the style, not chosen per node).
2. Delete the `Title/*` styles once nothing references them.

Same pattern as the colour shims (`shadcn colors/*`, `theme/*`) and radius
(`border radii/*`).
