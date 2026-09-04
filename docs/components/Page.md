# Page

The per-screen layout contract. Lives inside the [`AppShell`](./AppShell.md)
content slot and **owns all scrolling, padding and sticky regions** — the
AppShell content frame itself never scrolls and has no padding.

Every screen is:

```tsx
<AppShell sidebar={<CrmSidebar/>}>
  <Page …>{/* this screen */}</Page>
</AppShell>
```

## Two layouts

### `scroll` (default) — simple screens

The whole page scrolls; it's padded (`space/20`). Header is a flow block, not sticky.

```tsx
<Page>
  <Page.Header title="Carrier settings" actions={<Button variant="primary">Save</Button>} />
  <SettingsForm/>
</Page>
```

### `fixed` — table / master-detail screens

`display: grid; grid-template-rows: auto 1fr auto`. Header and Footer stay
pinned; **`Page.Body` is the only scroll region** (so a table's sticky column
headers work, and pagination never scrolls away).

```tsx
<Page layout="fixed">
  <Page.Header title="Shipments" actions={<Button variant="primary" leadingIcon={<Plus/>}>New</Button>}>
    <FiltersBar/>
  </Page.Header>
  <Page.Body bleed>
    <DataTable/>
  </Page.Body>
  <Page.Footer>
    <Pagination/>
  </Page.Footer>
</Page>
```

## API

| | prop | |
|---|---|---|
| `Page` | `layout` | `scroll` (default) · `fixed` |
| | `padded` | `scroll` only — pad the page (default `true`) |
| `Page.Header` | `title` | `<h1>`, `text/heading/xl` |
| | `actions` | right-aligned node (buttons) |
| | `bleed` | drop horizontal padding — region goes flush to the content-card edge |
| | `children` | rendered below the title row (filters, tabs) |
| `Page.Body` | `bleed` | as above — the usual place: full-width tables, maps, kanban |
| `Page.Footer` | `bleed` | as above |

All regions take `className` + native attrs.

## bleed

The content card has `overflow: hidden` and rounded corners. A region with
`bleed` drops its horizontal padding so its content aligns with the card's inner
edge — the clip makes the corner look intentional. Use it for anything that
wants the full width: `DataTable`, route maps, kanban boards, edge-to-edge
toolbars. Everything else keeps the `space/20` gutter.

## Rules

- **Scroll lives here, never in AppShell.** `scroll` layout → the `.page`
  scrolls. `fixed` layout → only `Page.Body` scrolls.
- **No outer margins on screen content** — spacing is the parent `Stack`'s gap
  or `Page`'s padding.
- **Overlays portal to `<body>`** (dropdowns, popovers, tooltips, modals,
  toasts). A right-edge **slide-over** is `position: absolute` within the
  content card, not the viewport.

## Figma

`Page — layout guide` — a 2-variant reference (`layout=scroll` / `layout=fixed`)
showing the region structure, what's pinned, what scrolls, and where `bleed`
applies. It's a guide, not an instanced component; screen frames compose
`AppShell` + their own content.
