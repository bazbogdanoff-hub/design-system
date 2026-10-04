# AppShell

The application chrome - a sidebar rail (**64px collapsed** / **180px
expanded**) + a padded main area whose rounded content surface **scrolls**.
Fluid: fills the viewport, and only the content region scrolls (never the
body). Deliberately generic: it just holds `sidebar` as a `ReactNode` slot -
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
| `sidebarMode` | `'collapsed'` (default) \| `'expanded'` | controls the rail's own width only - 64px / 180px, matching `Sidebar`'s real built width at each mode. The `sidebar` content itself is unaffected; pass the same value to both. |
| `children` | `ReactNode` | the screen - fills the scrolling content surface. |

`className`, `style`, `...divProps` pass through to the root.

## Structure

```
.shell            grid  [64px|180px | 1fr]   100dvw × 100dvh   overflow: hidden
├─ .sidebar       64px/180px, full height, background/emphasis  ← sidebar slot
└─ .main          padding var(--space-12) (gutter); padding-left var(--space-8)
   └─ .content    background/muted · radius/page · NO padding · overflow hidden
                  ← dumb chrome only; Page owns padding + scroll
```

`--app-sidebar-width` was 240px for `expanded` until 2026-09-18 - a guess
made before the real `Sidebar` component existed. Corrected to 180px once
`Sidebar` was fully built (Figma + React) and its actual expanded width was
known; 240 left ~60px of dead space to the right of the real content.

The sidebar rail uses `align-items: stretch` so a `Sidebar` with
`width: 100%` + its own `10px` left / `6px` right padding fills the rail
and insets its panels correctly.

**Screens are not components.** A screen is a page/route that renders
`<AppShell sidebar={…}>…</AppShell>`. In Figma they're frames nesting one shell
instance with the content slot filled - never a component.

`radius/page` is its own component token (→ semantic `radius.page-container` →
`radius.4xl`, 24px) - deliberately separate from `radius/container` (→
`radius.xl`, 12px), which `Card`/`Modal` use. AppShell's content viewport is a
different scale of surface than a card, so it earned its own radius instead of
sharing Card's.

Dimensions (sidebar 64/180, gutter `space/12`) are literal in
`AppShell.module.css` for now - promote to `size/app/*` tokens if a denser
mode is ever added on top of collapsed/expanded. Content inset lives on
[`Page`](./Page.md) (`space/16`), not on `.content`. The
`Variant=Horizontal` on the Figma `Base` foreshadows a below-`lg` collapse.

---

## Layout inside the content area

`.content` is a plain block - lay it out with [`Stack`](./layout.md).

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
- **Content width** - no max-width on `.content` for table-heavy screens; cap
  form/reading pages at ~720–960 inside the page.

---

## Breakpoints

Not DTCG tokens - constants in `src/lib/breakpoints.ts` (Tailwind's values):

| | px | |
|---|---|---|
| `sm` | 640 | |
| `md` | 768 | |
| `lg` | 1024 | **desktop floor** |
| `xl` | 1280 | `tablet` / `desktop` boundary |
| `2xl` | 1536 | |

```ts
import { up, down } from '@bazbogdanoff/design-system';
`@media ${up('lg')} { … }`      // (min-width: 1024px)
`@media ${down('lg')} { … }`    // (max-width: 1023px)
```

The shell does **not** collapse the sidebar by itself - `sidebarMode` is the
consumer's. (An earlier note here said it did below `lg`; nothing ever
implemented that.)

### Tiers

The breakpoints are vocabulary; the three tiers are what **placement**
switches on (spans, counts, the sidebar). They never set a size.
`useTier()` returns the live one; `tierQueries` holds the media strings.

| tier | viewport | typical |
|---|---|---|
| `wide` | ≥1600 **and** ≥820 tall | 1920 monitor at 100% |
| `desktop` | 1280–1599 (or ≥1600 but short) | 1366, 1440, 1536 - the Figma reference |
| `tablet` | <1280 | iPad, small laptops |

- 1536 is `desktop`, not `wide`: it is a 1920 laptop at Windows' 125%.
- The height floor keeps a 1600×900 monitor (≈770 tall once the browser is
  drawn) out of `wide`.

### Scale - fluid, in rem

**Everything is sized in rem**, and `scale.css` grows the root smoothly with
the viewport width:

| width | ≤1440 | 1600 | 1680 | 1920+ |
|---|---|---|---|---|
| root | 16px | 17.3px | 18px | **20px** (1.25×, the cap) |

Type, spacing, radii and controls scale together, proportions intact.
Borders, outlines, shadows and anything ≤2px stay `px`, so hairlines stay
hairlines. The growth is added on top of `100%`, so a reader's own browser
font size still counts.

At a 16px root the rem conversion is pixel-identical to the old px values -
verified by screenshot diff across 11 screens at 1440 and 1100 on 2026-09-27.

The few places that compute geometry in JS (`BarChart`, `LineChart`,
`Table` row fill, `Menu` placement) author their numbers at 16px and
multiply by `useRemScale()` / `remPx()`, which update on resize. **New
components: rem in CSS, never px, except hairlines and shadows.**

Because the UI grows with the screen, a wider screen is barely roomier in rem:
1440 is 90rem across, 1600 is 92rem, 1920 is 96rem. Placement at `wide` has
to be judged at 1600 as well as 1920.
