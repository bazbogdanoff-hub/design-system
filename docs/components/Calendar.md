# Calendar

A month calendar (owner, 2026-10-02, rebuilt from a reference image). **L2,
React only** — no Figma frame yet; built in code first, the Figma master
follows from this doc.

```tsx
<Card padding="lg">
  <Calendar value={date} onChange={(next) => setDate(next)} />
</Card>
```

| prop | type | default | notes |
|---|---|---|---|
| `value` | `string` (`yyyy-mm-dd`) | — | the picked day; `''` / omitted = nothing picked |
| `onChange` | `(value, how: 'pick' \| 'move') => void` | — | `pick` = a day clicked (or Enter / Space); `move` = arrow keys / Page Up-Down walked to it |
| `today` | `string` (`yyyy-mm-dd`) | device date | pass it to pin today (tests, demos) |
| `weekStartsOn` | `0` \| `1` | `0` | Sunday or Monday first |

Content only — it sits on a surface the consumer gives it (a `Card`, or
`DateInput`'s popover card). Nothing on the bare page.

## Anatomy

- **Header** — month and year (`text.heading.xs`, `color.text.default`);
  previous / next month as small secondary `IconButton`s (`CaretLeft` /
  `CaretRight`, bold).
- **Weekday letters** — `text.caption`, `color.text.muted`. Today's weekday
  carries a 4px brand dot underneath, while today's month is on view.
- **Six weeks** of 32px day cells (`text.body.sm`, tabular figures), 4px
  between columns and rows (owner, 2026-10-02: a step smaller than the
  first build's 40px — it opens from a form field). Six weeks always, so the height never
  changes between months. Days outside the month are `color.text.muted`;
  clicking one picks it and turns to its month.

## The highlight

The **highlighted day** is the picked one, or **today while nothing is
picked** — the picked date mirrors the reference's "today" look (owner left
the call to Claude; the pick is the state that matters most once there is
one). Today keeps its own mark either way: brand number, brand dot.

- **Week pill** — the highlighted day's whole week, in the **primary
  button's skin** (`color.button.primary.*`: fill, 1.5px catch top-left,
  inner shadow, drop shadow), `radius.pill`. Its numbers are
  `color.text.on-brand`.
- **Day disc** — a 24px disc of **card glass** (`color.card.background`,
  catch, vignette, a small drop shadow) inside the pill, 4px in from the
  cell. Its number is `color.text.default`. (A "framed" variant — card-glass
  ring around a brand disc — was tried in the lab and dropped.)

## Motion

Picking a day springs the pill to its week (460ms, `cubic-bezier(0.34, 1.4,
0.64, 1)`); the disc follows 50ms behind (520ms) and slides along to its
day — it rides in with the pill, then finds the day. The new day's number
changes colour 240ms in, once its disc has arrived. Both are transforms
only. Reduced motion: no transitions.

## Keyboard

Roving tab stop on the highlighted day. Arrows move the pick by a day / a
week, Page Up / Down by a month — across month edges, turning the page.
