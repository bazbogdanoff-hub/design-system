# Modal

The **dialog panel**: a heading with a close button, the content, and an
optional footer row, on the card surface. Presentational only: no portal, no
scrim, no focus handling and no open/close animation. Pair it with `Overlay`
for all of that. **L1.**

```tsx
const [open, setOpen] = useState(true);

<Overlay open={open} onClose={() => setOpen(false)} onExited={onClose}>
  <Modal
    width="md"
    padding="md"
    heading="Delete TK-021?"
    onClose={() => setOpen(false)}
    role="dialog"
    aria-modal="true"
    aria-label="Delete TK-021?"
    footer={
      <Stack direction="row" gap="md" justify="end">
        <Button variant="secondary" size="md" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="primary" size="md" onClick={remove}>Delete</Button>
      </Stack>
    }
  >
    …
  </Modal>
</Overlay>
```

| prop | type | default | notes |
|---|---|---|---|
| `heading` | `ReactNode` | - | `text/heading/sm` in `color/text/default` |
| `onClose` | `() => void` | - | wired to the header's close `IconButton` (secondary, `md`); omit to hide the button |
| `children` | `ReactNode` | - | the content; it scrolls inside the panel when the panel is held shorter than it |
| `footer` | `ReactNode` | - | omit to drop the footer row; the buttons in it are the caller's (right-aligned, 8 apart, is the house pattern) |
| `padding` | `'lg' \| 'md' \| 'sm' \| 'xs'` | `'lg'` | 24 / 20 / 16 / 12. The gap between header, content and footer matches the padding |
| `width` | `'sm' \| 'md' \| 'lg'` | - | 24 / 30 / 36rem, never wider than the screen less `space/32`. Omit to size to the content |

Other `div` props pass through to the panel: put `role="dialog"`,
`aria-modal` and an `aria-label` here, not on `Overlay`.

## Give it a width

**Set `width` on any dialog whose content can change** (owner, 2026-10-03).
A content-sized `Modal` re-sizes and re-centres the moment anything inside it
mounts, grows or wraps: a file list arriving, an error line appearing, a
select's value getting longer. That reads as the dialog jumping, and a
one-field dialog sized to its content was "unusably narrow". In Aegis:

| dialog | width |
|---|---|
| a confirmation (Delete, can't delete) | `sm` |
| the task-resolve upload | `md` |
| document Renew / Add, every add and edit form | `lg` |

Leave it off only for content with a fixed size of its own, such as the
"Ask Aegis" question grid, which sets its own width.

## Padding names are not Card's

`Modal`'s steps are one notch bigger than `Card`'s at each name: `Modal`
`sm` is 16, `Card` `sm` is 12; `Modal` `md` is 20, `Card` `md` is 16. Both
Figma masters say so (parity audit CARD-003), so neither side is "fixed"
without the other. `padding="md"` (20) is what the app's dialogs use.

## Surface

The card surface, replicated rather than nested: `color/card/background/default`,
the same inset border and vignette as `Card`, corner `radius/modal`
(`radius.container`, 12). It does not wrap a `Card`, because the padding
scales don't line up.

## Figma

**`Modal`**: auto-layout vertical, `space/24` padding and gap at `lg`; a
header row (heading text style `text/heading/sm`, close `IconButton`
instance), a `content` slot, and an optional `footer` slot. The `width`
variants are not in the master yet (code-first, 2026-10-03); build them as a
`width` property of `hug` / `sm` / `md` / `lg` with fixed widths of 384 / 480
/ 576 at the 16px root.
