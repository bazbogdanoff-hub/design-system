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

## Layout guide (offset / gutter / columns)

Page exposes the Figma layout-grid contract as CSS variables on `.page`:

| | token / var | |
|---|---|---|
| **columns** | `--page-cols: 16` | equal stretch tracks |
| **gutter** | `--page-gutter: space/16` | between columns (Grid default `gap="lg"`) |
| **offset** | `--_page-pad: space/16` | page padding from the content-card edge |

[`Grid`](./Grid.md) defaults to 16 columns / `gap="lg"` and inherits `--page-cols`
when nested under Page. A card with `span={4}` is always ~¼ of the content
track and scales as the page width changes.

## Two layouts

### `scroll` (default) — simple screens

The whole page scrolls; it's padded (`space/16` offset). Header is a flow
block, not sticky.

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
toolbars. Everything else keeps the `space/16` offset.

## Rules

- **Scroll lives here, never in AppShell.** `scroll` layout → the `.page`
  scrolls. `fixed` layout → only `Page.Body` scrolls.
- **No outer margins on screen content** — spacing is the parent `Stack`'s gap
  or `Page`'s padding.
- **Overlays portal to `<body>`** (dropdowns, popovers, tooltips, modals,
  toasts). A right-edge **slide-over** is `position: absolute` within the
  content card, not the viewport.

## Composition

`AppShell content slot` → `<Page>` → cards. **Never cards directly in the slot** —
the slot is dumb chrome (bg / radius / clip); `Page` owns padding, scroll, sticky
regions and the header.

```tsx
<AppShell sidebar={<CrmSidebar/>}>
  <Page layout="fixed">
    <Page.Header title="Dashboard" />
    <Page.Body>
      <Grid>
        <Grid.Item span={4}><StatCard … /></Grid.Item>
        <Grid.Item span={4}><StatCard … /></Grid.Item>
        <Grid.Item span={4}><StatCard … /></Grid.Item>
        <Grid.Item span={4}><StatCard … /></Grid.Item>
        <Grid.Item span={8}><Card>{/* chart */}</Card></Grid.Item>
        <Grid.Item span={8}><Card>{/* activity */}</Card></Grid.Item>
      </Grid>
    </Page.Body>
  </Page>
</AppShell>
```

Content inside `Page.Body` lays out on [`Grid`](./Grid.md)'s **16** columns —
see that doc for spans and approximate pixel widths.

## Figma

`Page` carries a native Figma `layoutGrids` overlay (16 columns, gutter/offset
16, stretch) — not a standalone guide frame. Screen frames compose `AppShell` +
content on that grid; React `Page` + `Grid` are the code counterpart.
