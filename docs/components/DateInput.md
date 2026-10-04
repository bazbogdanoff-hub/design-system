# DateInput

A date field that opens `Calendar` (owner, 2026-10-02). **L2, React only** -
`Input` + `IconButton` + `Card` + `Calendar`.

```tsx
<FormField label="Expires" htmlFor="doc-expiry">
  <DateInput id="doc-expiry" value={expiry} onChange={setExpiry} />
</FormField>
```

| prop | type | default | notes |
|---|---|---|---|
| `value` | `string` (`yyyy-mm-dd`) - required | | `''` for no date |
| `onChange` | `(value: string) => void` - required | | the value, not the event |
| `today` | `string` | device date | passed to `Calendar` |
| `weekStartsOn` | `0` \| `1` | `0` | passed to `Calendar` - Sunday or Monday first |
| `size`, `error`, `disabled`, `id`, `min`, `max`, … | | | as `Input` |

- The field is a **native date input**, so a date can still be typed segment
  by segment; an empty one shows `mm/dd/yyyy` in the placeholder colour
  (`Input`'s `data-empty`).
- The browser's picker icon is hidden and replaced by our own **tertiary
  `IconButton`** with Phosphor `CalendarBlank` (bold), in `Input`'s
  `trailingAction` slot.
- The button opens `Calendar` on a `Card` (padding `md`) in `Menu`'s shell:
  fixed positioning (escapes scrolling panels and modals), elevation, the
  grow-out-of-its-corner enter and exit. Pinned to the field's right edge;
  flips above when there is more room there. Re-placed on scroll / resize.
- **Closes** on a picked day (after 380ms, once the week pill has landed),
  Escape, or a click outside. Arrow-key moves inside the calendar do not
  close it. On open, focus goes to the highlighted day.
