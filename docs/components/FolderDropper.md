# FolderDropper

The document upload (owner, 2026-10-02): a folder that files drop into as they
upload, and a list of every file beside it. Built in a lab first (Aegis
`/lab/documents`), from a reference image. **L2, React only** - no Figma
frame yet. Successor to `FileDropper` for documents; `FileDropper` stays for
the chat drag overlay and the profile avatar.

```tsx
<FolderDropper
  heading="Upload the renewed document"
  accept="application/pdf,image/png,image/jpeg"
  files={files}
  onFilesSelected={add}
  onRemove={remove}
/>
```

| prop | type | default | notes |
|---|---|---|---|
| `files` | `FolderDropperFile[]` - required | | `{ id, name, size? (bytes), status, progress? (0–1), error? }`; `status` is `queued` · `uploading` · `done` · `error` |
| `onFilesSelected` | `(files: File[]) => void` - required | | picked or dropped; one file unless `multiple` |
| `onRemove` | `(id) => void` | - | a row's ✕; called after the row has shrunk away. Omit for no ✕ |
| `onRetry` | `(id) => void` | - | a failed row's ↻; the consumer sets the file back to `queued`. Omit for no ↻ |
| `accept` / `multiple` / `disabled` | | `multiple` false | as a file input |
| `heading` / `description` | `string` | "Upload document" / "Click or drop a file" | the folder's words while empty |
| `timeScale` | `number` | 1 | scales every spring's clock - motion-review labs only |
| `layout` | `side` \| `stacked` | `side` if `multiple`, else `stacked` | where the list goes - beside the folder, or one row's slot under it |

Controlled: the consumer owns `files` and the upload; this only shows them.

**`accept` is enforced** (owner, 2026-10-03): a picked or dropped file that
doesn't match - by extension or MIME type - never reaches `onFilesSelected`.
The folder wobbles "no" and its front reads "Can’t add cat.gif" /
"Use PDF, PNG or JPG" for 2.6s. While a wrong-type file is dragged
over, the folder stays shut and says what it takes (the browser gives MIME
types during a drag; a type it doesn't report is let through to the drop
check). 12px of left padding keeps the folder's shadow clear of a clipping
parent.

## Look

- **Back** - 172 × 128, the tab on its top left, in the primary button's
  glass (fill, catch, inner shadow, drop shadow - an SVG filter, the chart
  marks' recipe).
- **Front** - 84 tall, the same brand colour at 26% fill deepening to 48%
  behind its words, over a 7px backdrop blur; a white catch top-left.
  Title `text.label.md` (two lines at most), detail `text.caption`, both
  `color.text.on-brand` with a soft glow for contrast over the sheets.
- **Sheets** - white, 96 × 100, three grey lines; fanned, at most **4**
  shown however many files the folder holds.
- **List** - beside the folder, a `Row` (md, large neutral tile, no divider, secondary sm buttons; as the parts in a repair's close) per finished **or failed**
  file, newest first: file-type `IconCell` (Phosphor fill), name, size, ✕.
  A failed row (owner, 2026-10-03) shows the file's `error` in danger
  in place of its size, and ↻ retry beside ✕.
  Scrolls past ~5 rows.

The front's words follow the state: empty → `heading` / `description`;
dragging → "Drop to upload"; uploading → "Uploading 2 of 5…" / "47% · name";
done → the latest name / "3 files · 2.4 MB"; error → "Upload failed" / the
file's `error`.

## Motion

All springs, integrated per frame (a beat that starts early inherits the
last one's velocity); **nothing fades** - shapes move, grow, shrink.

- **Upload** - a sheet grows in above the folder; the front swings 70% open
  (`rotateX` about its bottom edge); the sheet sinks as `progress` rises and
  drops in on `done` with a bounce; the folder squashes on the landing and
  the front closes. Up to 3 waiting sheets pile above; more wait unseen.
- **Fifth file** - the oldest shown sheet sinks out of sight.
- **Error** - the sheet jolts up, red-edged, shakes for 0.9s, then shrinks
  away; its row carries it. Retried, a fresh sheet grows in and queues.
- **Drag-over** - the front swings fully open; the folder leans and shifts
  toward the pointer and follows it.
- **Layout** - centred while empty, both ways (the room kept above for
  sheets counts, so it sits mid-box); when files arrive it walks to the left
  and settles to the bottom (one spring each) and rows grow in beside it as sheets land. A
  removed row shrinks away, its sheet with it.
- Reduced motion: every spring jumps to its target.

**It never changes size as files arrive** (owner, 2026-10-03 - a narrow
one-file dialog widened and jumped when a list appeared beside the folder):

- `side` reserves the list's width (14rem basis) from the start; the list's
  height is the folder column's, with a scroller laid over it that reaches
  up into the room above the folder - rows never add height.
- `stacked` holds one row's slot (3.625rem) open under the folder from the
  start, its width taken from the box. Empty, the folder sits mid-block
  (room above + slot below shared); uploading, it rises so the sheet has
  room, and the row fills the slot.
- Rows animate with transforms only - no per-frame layout.

Waiting sheets rise above the component's top padding (3.75rem side,
2.25rem stacked); overflow is visible, so give it room above.
