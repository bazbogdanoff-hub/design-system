# Label

A plain, colorable inline text bit — sentence-case, **body weight** (not
uppercase/semibold like `Tag`). The atomic piece `LabelGroup` composes.
**L1 primitive.**

```tsx
<Label>TK-4021</Label>
<Label size="sm" color="warning">Delayed</Label>
```

| prop | values | default |
|---|---|---|
| `size` | `2xs` (10px) · `xs` (12px) · `sm` (13px) · `md` (14px, default) · `lg` (15px) · `xl` (16px) — mirrors `text/body/*` | `md` |
| `color` | `default` · `subtle` · `muted` · `brand` · `success` · `warning` · `danger` | `default` |

Renders a `<span>`. All other `HTMLSpanElement` props pass through.

## Not a Tag, not a Badge

| | case | weight | chrome | vocabulary |
|---|---|---|---|---|
| `Label` | sentence | body (medium) | none | open — 7 semantic/brand text colors |
| `Tag` | UPPERCASE | semibold | none | 10 `color.category.*` hues |
| `Badge` | sentence | semibold | tinted chip | fixed status set |

`Label` is for inline metadata bits — codes, names, short values — that need
to pick up a semantic color (a red `Label` for an overdue reference, a
brand-colored one for a highlighted ID). It is deliberately the quietest of
the three.

## Typography — reuses tokens

`size` binds straight to the `--text-body-*` CSS variables; no parallel token
family. The 2xs step (10px) exists specifically for `Row`'s smallest
description — same reason `text/body/2xs` was added to the scale.

## `color` — aliases, not new values

Every `color` binds to `color.label.<name>`, which is a plain alias of the
matching `color.text.*` semantic token — no new color values were introduced.
The divider inside a `LabelGroup` is **not** one of these; it's fixed chrome
(`color.text.subtle`).
