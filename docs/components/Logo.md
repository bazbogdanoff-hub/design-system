# Logo

The brand mark — a 4-quadrant pinwheel, always pure white regardless of
theme. **L1** — Figma + React, both built this session.

```tsx
<Logo collapsed name="Acme" />       {/* mark only */}
<Logo name="Acme" />                 {/* mark + wordmark (default) */}
```

| prop | type | default | notes |
|---|---|---|---|
| `collapsed` | `boolean` | `false` | mark only vs. mark + wordmark |
| `name` | `ReactNode` | | the wordmark text next to the mark; ignored when `collapsed` |

Every other native `<span>` prop passes through (`className`, `id`, …).

## Always pure white — a deliberate exception

`color.sidebar.logo.mark`/`.wordmark` both alias `color.white` directly, not
the zinc ramp every other `sidebar.*` token uses. The mark is never meant to
soften or recede the way the rest of the sidebar's UI chrome does — same
reasoning as `switch.thumb`, the one other place in this system that aliases
raw white on purpose. Caught and fixed during this build: the owner's
hand-placed mark was bound to `color.zinc.100` (an off-white) and the
wordmark to `color.zinc.200` — neither matched the "pure white" call, and
the two didn't even match each other.

## Why `collapsed`, not a `size` prop

The mark itself never changes size or shape between the sidebar's two
states — only whether the wordmark renders next to it. A boolean that
mirrors the sidebar's own `collapsed`/`expanded` vocabulary (same as
`SegmentedControl`'s `collapsed` prop) is a more honest fit than inventing a
size axis for a mark that doesn't actually resize.

## Figma

`Logo` (`10623:21244`) — 2 variants (`collapsed` only): `true` is the bare
21×21 mark; `false` nests that same mark next to a "Name"-style wordmark
text (Plus Jakarta Sans SemiBold 24, `text.heading.lg` in code). Built by
converting the owner's hand-placed mark into `collapsed=true`, then cloning
the sidebar's own live mark+wordmark frame (which already nested a real
instance of the mark) into `collapsed=false` — the existing
`Property 1=Default`/`Variant2` sidebar instances auto-resolved onto the new
variants with zero breakage.
