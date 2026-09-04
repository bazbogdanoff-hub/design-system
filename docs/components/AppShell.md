# AppShell

The application chrome — a fixed **64px sidebar rail** + a padded main area
whose rounded content surface **scrolls**. Fluid: fills the viewport, and only
the content region scrolls (never the body).

```tsx
<AppShell sidebar={<CrmSidebar/>}>
  {/* the screen */}
</AppShell>
```

| prop | type | |
|---|---|---|
| `sidebar` | `ReactNode` | content for the 64px rail. Empty by default (just the dark bar). |
| `children` | `ReactNode` | the screen — fills the scrolling content surface. |

`className`, `style`, `...divProps` pass through to the root.

## Structure

```
.shell            grid  [64px | 1fr]   100dvw × 100dvh   overflow: hidden
├─ .sidebar       64px, full height, background/emphasis  ← sidebar slot
└─ .main          padding var(--space-12) (gutter)
   └─ .content    background/subtle · radius/container · padding var(--space-20)
                  overflow-y: auto   ← THE scroll container; children live here
```

**Screens are not components.** A screen is a page/route that renders
`<AppShell sidebar={…}>…</AppShell>`. In Figma they're frames nesting one shell
instance with the content slot filled — never a component.

Dimensions (sidebar 64, gutter `space/12`, content padding `space/20`, radius
`radius/container`) are literal in `AppShell.module.css` for now — promote to
`size/app/*` tokens if a collapsed/expanded sidebar or denser mode is added.
The `Variant=Horizontal` on the Figma `Base` foreshadows a below-`lg` collapse.

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
