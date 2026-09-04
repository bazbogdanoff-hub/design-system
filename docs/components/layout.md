# Layout primitives — `Box` + `Stack`

The two low-level building blocks for composition. Everything spatial is a token —
app code never writes raw `px` for gap, padding, or radius.

- **`Box`** — a styled container. Token padding / background / radius / border.
- **`Stack`** — a flex container. Token gap + alignment. The workhorse.

Both are polymorphic (`as`, `asChild`) and forward their ref.

---

## `Box`

```tsx
<Box p="md" bg="card" radius="panel" border>…</Box>
```

| prop | values | maps to |
|---|---|---|
| `p` / `px` / `py` | `none` `xs` `sm` `md` `lg` `xl` | `space/` 0 · 4 · 8 · 12 · 16 · 20 |
| `bg` | `default` `subtle` `card` `sunken` | `surface/*` · `background/subtle` |
| `radius` | `chip` `control` `panel` `container` | radius roles (6 · 8 · 12 · 16) |
| `border` | `boolean` | 1px `border/default` |
| `as` / `asChild` | — | element / merge onto child |

`px`/`py` override `p` on their axis. `Box` does **no** layout — it's a leaf
surface. For arranging children, wrap them in a `Stack`.

## `Stack`

```tsx
<Stack gap="md">…</Stack>                        // vertical, 12px gaps
<Stack direction="row" gap="sm" align="center">…  // horizontal toolbar
<Stack direction="row" gap="lg" columns>…         // stretch columns
```

| prop | values | |
|---|---|---|
| `direction` | `column` (default) · `row` | |
| `gap` | `none` `2xs` `xs` `sm` `md` `lg` `xl` `2xl` | `space/` 0·2·4·8·12·16·20·24 |
| `align` | `start` `center` `end` `stretch` `baseline` | cross-axis |
| `justify` | `start` `center` `end` `between` | main-axis |
| `wrap` | `boolean` | row only |
| `columns` | `boolean` | row: children `flex:1`, equal height |

### Guidance

- **Gap, not margins.** Spacing between siblings is the parent `Stack`'s `gap`.
  Components never carry outer margin.
- **`Box` inside `Stack`.** `Stack` positions; `Box` (or a real component)
  provides the surface.
- **`min-width: 0`** is baked into both so flex children can shrink (text
  truncation, tables) without overflowing.

```tsx
<Stack gap="lg">
  <PageHeader title="Shipments" />
  <Stack direction="row" gap="md" columns>
    <StatCard label="In transit" value={118} />
    <StatCard label="Delayed" value={4} />
    <StatCard label="Idle" value={12} />
  </Stack>
  <ShipmentsTable />
</Stack>
```
