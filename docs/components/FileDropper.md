# FileDropper

A drag-and-drop file upload zone. **L2** — composes `ProgressBar` and
`HelperText`, both sides. Built React-first from a reference screenshot of
the idle state (per this session's usual "build in code first, review live"
call for undesigned components), then ported into Figma to match — see
**Figma** below.

```tsx
<FileDropper heading="Upload renewed document" onFilesSelected={(files) => upload(files[0])} />

<FileDropper
  heading="Upload renewed document"
  status="uploading"
  file={{ name: 'insurance-certificate-2026.pdf' }}
  progress={45}
  onFilesSelected={handleReplace}
  onCancel={cancelUpload}
/>

<FileDropper
  heading="Upload renewed document"
  status="success"
  file={{ name: 'insurance-certificate-2026.pdf', size: '2.4 MB' }}
  onFilesSelected={handleReplace}
  onRemove={clearFile}
/>

<FileDropper
  heading="Upload renewed document"
  status="error"
  file={{ name: 'insurance-certificate-2026.pdf' }}
  errorMessage="File exceeds 10 MB limit."
  onFilesSelected={handleReplace}
  onRetry={retryUpload}
/>
```

| prop | type | default | notes |
|---|---|---|---|
| `status` | `idle` \| `uploading` \| `success` \| `error` | `idle` | fully controlled — the component never sets its own status |
| `heading` | `ReactNode` — required | — | idle-state title |
| `description` | `ReactNode` | `"Click to upload, or drag a file here"` | idle-state subtext |
| `file` | `{ name: string; size?: string }` | — | required (in practice) once `status` leaves `idle` |
| `progress` | `number` (0–100) | `0` | read only while `status="uploading"` |
| `errorMessage` | `ReactNode` | — | rendered as a `HelperText` (`tone="error"`) under the filename |
| `accept` / `multiple` | forwarded to the native `<input type="file">` | — | |
| `disabled` | `boolean` | — | no click, drag, or trailing action |
| `onFilesSelected` | `(files: FileList) => void` — required | — | fires on click-pick or drop, in **any** status — dropping again replaces the current file |
| `onCancel` / `onRemove` / `onRetry` | `() => void` | — | trailing action shown only in the matching status, and only if passed |

## Controlled, not stateful — same split as `ProgressBar`

Picking or dropping a file never changes `status` itself — it only calls
`onFilesSelected`. The caller owns the actual upload (start it, track
`progress`, land on `success` or `error`) and drives every other prop from
that. This mirrors `ProgressBar`'s own "I just render `value`, I don't own
the timer" boundary — a `FileDropper` that quietly moved itself from
`uploading` to `success` on a fixed timeout would fight whatever real upload
logic the consumer has.

## A real `<label>`, not a styled `<div>` with click handlers

The whole box is a `<label>` wrapping a visually-hidden (clip-rect, not
`display:none`) native `<input type="file">`. Clicking anywhere activates the
input via native label semantics — no `ref.click()` trick needed — and the
hidden input stays keyboard-focusable/operable (Tab reaches it, Space/Enter
opens the file dialog) for free. Drag-and-drop is layered on top with manual
`onDragEnter`/`onDragOver`/`onDragLeave`/`onDrop` handlers on the label
itself, using a drag-counter ref (not a boolean) so a dragged file passing
over a child element doesn't flicker the highlight off.

The 3 trailing action buttons (cancel/remove/retry) sit *inside* the label.
Each `onClick` calls both `preventDefault()` and `stopPropagation()` before
the real handler — otherwise clicking "remove" would also re-open the file
picker via the label's own default action.

## Only the border carries state color — same restraint as `Input`

`Input`'s icon/affix colors never react to hover/focus/error, only the
border does (see `Input.md`). `FileDropper` follows the same rule: the
leading icon is `DocumentIcon` (`color.icon.subtle`, neutral) while
`uploading`, and only swaps to a colored status glyph
(`CheckCircleIcon`/`WarningIcon`, reused from `EmptyState`/`HelperText`
rather than redrawn) on `success`/`error`. The border is dashed at `idle`,
solid everywhere else, and only turns `color.border.danger` on `error` — it
never turns green on `success`, since the status glyph + optional `size`
metadata already carry that signal without needing a second channel.

## Drag-over always wins, in every status

Dragging a file over the zone highlights it (`color.border.brand` +
`color.background.brand-subtle`) regardless of the current `status` —
dropping a new file onto an already-`success`/`error` row is a legitimate
"replace it" gesture, not blocked. `disabled` is the only state drag-over
can't override.

## New icons, all fixed (not consumer-configurable)

Same "one small glyph per fixed meaning" pattern as `HelperText`'s
`InfoIcon`/`WarningIcon`: `UploadIcon` (idle), `DocumentIcon` (neutral file,
evenodd-punched text lines — same technique as `CheckCircleIcon`),
`CloseIcon` (cancel/remove — two rotated rounded bars, not a hand-drawn X
path), `RetryIcon` (error retry — the one icon in this file on a 24×24 grid
instead of the usual 256×256, a well-known minimal refresh-arrow shape reused
as-is).

## Figma

**`FileDropper`** (`10282:25711`) — 5 variants, one `status` axis
(`idle`/`uploading`/`success`/`error`/`disabled` — `disabled` folded into the
same axis rather than a separate boolean, same convention `Button`/`Input`
use for their own `state`). Built in Figma **after** the React port, from the
same reference screenshot — reuses real instances throughout rather than
redrawing: `IconButton` (`tertiary`/`sm`) for the trailing action (glyph
swapped per status — `X` for cancel/remove, `ArrowClockwise` for retry),
`ProgressBar` (`sm`/`brand`) for the uploading fill, `HelperText`
(`sm`/`error`) for the error message. Status glyphs are the file's own
Phosphor icons (`UploadSimple`, `FileText`, `CheckCircle`, `Warning`) with
their `Vector` fill bound directly to the matching semantic color variable —
same technique `Input`'s `leading-icon`/`trailing-icon` already use. Layers:
`badge`/`heading`/`description` (idle, disabled) and `statusIcon`/`info`
(`fileName` + `fileMeta`/`progress`/`HelperText`)/`action` (the 3 row
states) — lowercase role names throughout, per convention.

**Where Figma and React are only loosely matched:** the React icons
(`UploadIcon`/`DocumentIcon`/`CloseIcon`/`RetryIcon`) are small hand-drawn
SVGs built without the real Phosphor set to draw from — visually close but
not pixel-identical to Figma's actual `UploadSimple`/`FileText`/`X`/
`ArrowClockwise`. Not fixed in this pass since the React versions already
read correctly at their size; worth a follow-up if the two ever need to be
pixel-matched (e.g. tracing the real Phosphor paths into the React icon
files).
