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
    padding="lg"
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
| `padding` | `'xl' \| 'lg' \| 'md' \| 'sm'` | `'xl'` | 24 / 20 / 16 / 12, the same names and sizes as `Card`'s. The gap between header, content and footer matches the padding |
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

On `phone` a `width` is capped at the Overlay's room, the page's padded
area (Overlay.md), not at the viewport less 32, and a dialog taller than
that room scrolls its content between a fixed header and footer.

## Padding names are Card's

Since 2026-10-04 (owner, parity audit CARD-003) `Modal` uses `Card`'s
names and sizes: `sm` 12, `md` 16, `lg` 20, `xl` 24. Before that its names
sat one notch bigger (`sm` was 16), so the same word meant two sizes. Every
dialog kept its size in the move: what was `md` (20) is now `lg`, which is
what the app's dialogs use. **Figma to do:** rename the Modal master's
padding variants to match.

## Footer on phone

On the phone tier the footer's buttons split the full width equally and
stand one size up (sm to md, md to lg, lg to xl, xl to 2xl), from Modal's
CSS through Button's `data-size`: pass the desktop size, nothing else.
Anything beside the buttons (a form's error) wraps onto its own line above
them (owner, 2026-10-06).

## Surface

The card surface, replicated rather than nested: `color/card/background/default`,
the same inset border and vignette as `Card`, corner `radius/modal`
(`radius.container`, 12). It does not wrap a `Card`: the header, content and
footer gap follows the padding, which a nested card would not.

## Figma

**`Modal`**: auto-layout vertical, `space/24` padding and gap at `xl`; a
header row (heading text style `text/heading/sm`, close `IconButton`
instance), a `content` slot, and an optional `footer` slot. The `width`
variants are not in the master yet (code-first, 2026-10-03); build them as a
`width` property of `hug` / `sm` / `md` / `lg` with fixed widths of 384 / 480
/ 576 at the 16px root.

On phone the title is `heading/lg` (owner, 2026-10-07).
