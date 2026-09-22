# AppShell

The application chrome — a sidebar rail (**64px collapsed** / **180px
expanded**) + a padded main area whose rounded content surface **scrolls**.
Fluid: fills the viewport, and only the content region scrolls (never the
body). Deliberately generic: it just holds `sidebar` as a `ReactNode` slot —
it doesn't know or care that the real content is a
[`Sidebar`](./Sidebar.md) instance.

```tsx
<AppShell sidebar={<Sidebar {...sidebarProps} />} sidebarMode="expanded">
  {/* the screen */}
</AppShell>
```

| prop | type | |
|---|---|---|
| `sidebar` | `ReactNode` | content for the rail. Empty by default (just the dark bar). |
| `sidebarMode` | `'collapsed'` (default) \| `'expanded'` | controls the rail's own width only — 64px / 180px, matching `Sidebar`'s real built width at each mode. The `sidebar` content itself is unaffected; pass the same value to both. |
| `children` | `ReactNode` | the screen — fills the scrolling content surface. |

`className`, `style`, `...divProps` pass through to the root.

## Structure

```
.shell            grid  [64px|180px | 1fr]   100dvw × 100dvh   overflow: hidden
├─ .sidebar       64px/180px, full height, background/emphasis  ← sidebar slot
└─ .main          padding var(--space-12) (gutter); padding-left var(--space-8)
   └─ .content    background/muted · radius/page · NO padding · overflow hidden
                  ← dumb chrome only; Page owns padding + scroll
```

`--app-sidebar-width` was 240px for `expanded` until 2026-09-18 — a guess
made before the real `Sidebar` component existed. Corrected to 180px once
`Sidebar` was fully built (Figma + React) and its actual expanded width was
known; 240 left ~60px of dead space to the right of the real content.

The sidebar rail uses `align-items: stretch` so a `Sidebar` with
`width: 100%` + its own `10px` left / `6px` right padding fills the rail
and insets its panels correctly.

**Screens are not components.** A screen is a page/route that renders
`<AppShell sidebar={…}>…</AppShell>`. In Figma they're frames nesting one shell
instance with the content slot filled — never a component.

`radius/page` is its own component token (→ semantic `radius.page-container` →
`radius.4xl`, 24px) — deliberately separate from `radius/container` (→
`radius.xl`, 12px), which `Card`/`Modal` use. AppShell's content viewport is a
different scale of surface than a card, so it earned its own radius instead of
sharing Card's.

Dimensions (sidebar 64/180, gutter `space/12`) are literal in
`AppShell.module.css` for now — promote to `size/app/*` tokens if a denser
mode is ever added on top of collapsed/expanded. Content inset lives on
[`Page`](./Page.md) (`space/16`), not on `.content`. The
`Variant=Horizontal` on the Figma `Base` foreshadows a below-`lg` collapse.

---

## Layout inside the content area

`.content` is a plain block — lay it out with [`Stack`](./layout.md).

### Stretch-columns guide

Dashboard-style rows where panels share the width and match height:

```tsx
<Stack gap="lg">
  <Stack direction="row" gap="md" columns>
    <StatCard label="In transit" value={118} />
    <StatCard label="Delayed"    value={4} />
    <StatCard label="Idle"       value={12} />
  </Stack>
  <Stack direction="row" gap="md" columns>
    <Card>{/* chart */}</Card>
    <Card>{/* recent activity */}</Card>
  </Stack>
</Stack>
```

`Stack direction="row" columns` → every child `flex: 1 1 0; min-width: 0` and
`align-items: stretch`. Equal width, equal height, token gap.

- **Uneven splits** (e.g. 2 : 1): drop `columns`, set `flex` on the children
  (`<div style={{ flex: 2 }}>` / `{{ flex: 1 }}`), or wrap the minor column in a
  fixed-width `Box`.
- **Wrapping** (many cards, narrow viewport): use `wrap` and a `min-width` on
  children instead of `columns`.
- **Content width** — no max-width on `.content` for table-heavy screens; cap
  form/reading pages at ~720–960 inside the page.

---

## Breakpoints

Not DTCG tokens — constants in `src/lib/breakpoints.ts` (Tailwind's values):

| | px | |
|---|---|---|
| `sm` | 640 | |
| `md` | 768 | |
| `lg` | 1024 | **desktop floor** — below this the shell collapses the sidebar |
| `xl` | 1280 | narrow-desktop check |
| `2xl` | 1536 | |

```ts
import { up, down } from '@bazbogdanoff/design-system';
`@media ${up('lg')} { … }`      // (min-width: 1024px)
`@media ${down('lg')} { … }`    // (max-width: 1023px)
```

Design screens at **1440**; spot-check **1280**.
