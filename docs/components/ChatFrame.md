# ChatFrame

The dashboard's chat card — **for that card only** (owner, 2026-10-01).
Built code-first from the owner's 2026-09-30 prototype.

```tsx
<ChatFrame
  icon={<Sparkle weight="fill" />}
  switcher={
    <SegmentedControl size="sm" surface="dark" aria-label="Chat with">
      <SegmentedControlItem selected>Aegis</SegmentedControlItem>
      <SegmentedControlItem count={2}>Team</SegmentedControlItem>
    </SegmentedControl>
  }
  onExpand={() => navigate('/assistant')}
  expandLabel="Open Aegis"
  peer={{ avatar, name: 'Tomasz Nowak', detail: 'Driver · DR-002 · Telegram', onBack }}
  footer={<ChatComposer surface="dark" … />}
>
  {thread}
</ChatFrame>
```

| prop | type | notes |
|---|---|---|
| `icon` | `ReactNode` | in the header's left tile — what the chat is with |
| `switcher` | `ReactNode` | a `SegmentedControl surface="dark"` |
| `onExpand` · `expandLabel` | | the header's right tile: open the chat full size |
| `peer` | `{ avatar, name, detail?, onBack, backLabel? }` | who an open conversation is with, under the header, with a back caret |
| `children` | `ReactNode` | the conversation or the list; takes the rest of the height — the consumer owns its scrolling |
| `footer` | `ReactNode` | pinned to the foot — suggestions, a `ChatComposer surface="dark"` |

## Why it is its own component

The frame is the app frame reaching into the page: the AppShell's own fill
(`background.emphasis`), the main cards' border recipe in the frame's tones
(a 1.5px zinc.500 catch, a zinc.900 vignette), 16 corners on top and the
page's 24 at the foot so the composer rounds off inside it, at most 32rem
tall. Nothing else in the app looks like this, and a general "dark card"
would invite it where it doesn't belong — **a second use is a design
question first**, not a reuse.

## The page holds still under it (owner, 2026-10-01)

While the pointer is over the card, a wheel or touch scroll moves only
something inside it that can take it — the conversation, the chip row, a
list — or nothing; it never falls through to the page. A native
non-passive listener walks up from the pointer as the browser would and
cancels the gesture when nothing between it and the frame can scroll that
way (pinch-zoom is left alone), and every scroll area inside has
`overscroll-behavior: contain`, so reaching its end doesn't hand off
either. Verified: header and a thread at its end move nothing; the page
still scrolls outside the card.

Everything inside is a normal component in its `surface="dark"` variant:
`SegmentedControl` (+ `SegmentedControlItem count`), `ConversationRow`,
`Button` (secondary), `ChatBubble`, `DayDivider`, `ChatComposer`.

## Figma build notes

Frame: vertical auto layout, padding 16, gap 12, corners 16/16/24/24, fill
`background/emphasis`, inner shadows as above. Header: grid of tile ·
switch · fill · tile; tiles 32×32, corner 8, fill `sidebar/panel/background`
with its 4px inner shade. Peer row: back caret 32×32, avatar md, name
`label/sm` white, detail `body/xs` white 60%.
