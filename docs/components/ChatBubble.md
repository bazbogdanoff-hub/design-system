# Chat components — ChatBubble, DayDivider, ChatComposer, MediaViewer

Built **code-first** (owner, 2026-10-01, chat plan step 4) from the Aegis
Messages page, where each piece was argued out; no Figma masters yet — build
notes at the end. Three surfaces use them: the Messages page, the Aegis
assistant page, and the dashboard's dark chat card (`surface="dark"`).

## ChatBubble

```tsx
<ChatBubble side="in" tail time="09:52" channel="telegram">OK. Reefer is holding at 3 °C.</ChatBubble>
<ChatBubble side="out" photo={{ src, alt, width: 1200, height: 800, onOpen }} time="09:59">This is the queue now.</ChatBubble>
<ChatBubble side="in" size="sm" label="Aegis · draft" footer={<CopyButton />}>…</ChatBubble>
```

| prop | type | default | notes |
|---|---|---|---|
| `side` | `'in'` \| `'out'` | | someone else's on the left / yours on the right |
| `surface` | `'light'` \| `'dark'` | `'light'` | light: white Tile in, brand glass out. dark: sidebar panel in, sidebar brand pair out |
| `size` | `'sm'` \| `'lg'` | `'lg'` | text `body.sm` (13) or `body.lg` (15) |
| `tail` | `boolean` | `false` | first bubble of a run: square top corner toward the sender and a tail out of it |
| `label` | `ReactNode` | | a small line over the text ("Aegis · draft"); not for names in a one-to-one thread — the header says who |
| `photo` | `{ src?, alt, width?, height?, onOpen? }` | | fills the bubble bar a 4 frame, 20rem on its long side, shape reserved before it loads; the caption wraps to it |
| `file` | `{ name, detail?, type?, onOpen? }` | | a row with the file-kind tile; sets the width like a photo |
| `time` · `channel` · `edited` | | | the line under the text: channel mark (`ChannelLogo`, bare), "edited", time — `body.2xs`, quieter than the text |
| `footer` | `ReactNode` | | sources, a Copy button |
| `dimmed` | `boolean` | | the message being edited |

Other `div` props pass through (`onContextMenu`, `role`, …).

**Edge light is an SVG filter, not box-shadows.** A box-shadow follows the
box, so a tail bolted onto a shadowed bubble floats: the drop and the catch
stop at the joint and the inner shadow creases the side the tail grows
from (measured on the Messages page: #7781e6 against #7b85ed). `filters.ts`
re-expresses the four recipes — glass.css, Tile, the sidebar's brand pair
and panel — as filters on the painted alpha, so body and tail are lit as one.
The bubble adds the filter definitions to the page itself, once. The tail
overlaps the body 2px (a gap in the alpha would draw a catch line through
the joint) and its clip starts 1px above the box so its top edge snaps like
the body's. The attribute is `data-on`, not `data-surface` — `Page` treats
every `[data-surface]` as a card when computing outer corners.

## DayDivider

`<DayDivider>Today</DayDivider>` — a pill of 10% black over whatever it sits
on (25% on `surface="dark"`), centred in a row with 8 above and below.

## ChatComposer

Controlled: `value`, `onChange`, `onSubmit`. Paperclip only when `onFiles`
is given; `files` + `onRemoveFile` show the tray (72px thumbnails or rows,
0.5px hairline, small icon-only remove on a pale disc); `editing={{ original,
onCancel }}` shows the Editing bar; `error` a line above the field. The
field is `Textarea`'s message mode — one line at `Input`'s height, grows to
`maxRows` (8), send on its last line. **Enter submits, Shift+Enter breaks a
line, Esc leaves an edit, an IME's Enter picks its word.** `surface="dark"`
gives the field the sidebar's active-tab recipe.

## MediaViewer

`items`, `index` (null = closed), `onIndex`, `onClose`, `onDownload?` —
`Overlay scrim="strong"`, a `Card` bar with name, detail and "n of m",
download and close; the picture never cropped; ← → between items.

## Figma build notes

- **ChatBubble** — set with `side` × `surface` × `tail`; fills from the
  tokens above; tail a 10×12 vector (8 out, 2 in), corner 12 elsewhere.
  Effects as on Tile / glass; Figma has no shape-following filter issue.
- **DayDivider** — auto-layout pill, 4/10 padding, fill black 10%.
- **ChatComposer** — vertical: [edit bar] [tray] [row: IconButton lg ·
  Textarea message field], row bottom-aligned.
- **MediaViewer** — Overlay strong + Card bar + image + two lg IconButtons.
