# Pagination

"Page X of Y" + a prev/next control. **L1** — ported from a mockup the owner
hand-built inside a real `Table` usage example in Figma, then componentized
there before this React port.

```tsx
<Pagination page={page} totalPages={10} onPageChange={setPage} />
```

| prop | type | notes |
|---|---|---|
| `page` | `number` — required | 1-indexed current page |
| `totalPages` | `number` — required | |
| `onPageChange` | `(page: number) => void` — required | called with `page - 1` / `page + 1` |

No page-number buttons — matches the Figma reference exactly, which is just
a label and a prev/next pair. `page <= 1` disables the previous button,
`page >= totalPages` disables next — computed internally rather than left
for the caller to get wrong, same reasoning `Slider`'s min/max clamping uses.

## Figma

`Pagination` (`10302:21731`) — single component, no variants. Same layout:
label (`text/body/sm`, `color.text.subtle`) + a `space/12` gap + a button
pair (real `IconButton` instances, `secondary`/`md`, `CaretLeft`/
`CaretRight` glyphs) with a `space/8` gap between them.
