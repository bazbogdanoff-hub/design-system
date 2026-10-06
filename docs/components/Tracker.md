# Tracker

How much time a task has: the task page's deadline card (owner,
2026-10-06; it replaced the old centred clock with its striped bar). A
small label, the figure in the default text colour, and a **time track**:
a recessed well from the window's start to its deadline, a glass bar
filling with the time used. **Only the bar's material carries the
situation**; the text never turns red. Sits on a `Card` (`padding="md"`).
The Figma frame still shows the old clock and needs redrawing from this
page.

```tsx
<Tracker
  urgency={{ mode: 'scheduled', dueAt: checkpointEta, startAt: detectedAt }}
  dueLabel="Checkpoint ETA"
  context="Next checkpoint · Koroszczyn, PL/BY"
  important={severity === 'critical'}
/>
<Tracker urgency={{ mode: 'countdown', remainingSeconds: 792, totalSeconds: 1800 }} />
<Tracker urgency={{ mode: 'asap' }} />
<Tracker urgency={{ mode: 'done', doneAt: closedAt, startAt: detectedAt }} />
```

| prop | values | default |
|---|---|---|
| `urgency` | `countdown { remainingSeconds, totalSeconds }` · `scheduled { dueAt, startAt? }` · `asap` · `done { doneAt?, startAt? }` | - |
| `important` | forces danger whatever the time says, `asap` included; ignored once `done` | `false` |
| `startLabel` / `dueLabel` | names of the track's ends | `Detected` / `Due` |
| `context` | one line under the ends: what the deadline is | - |
| `timeFormatter` | `(d: Date) => string` for the ends | `Sep 30, 13:48` |

Self-ticking: `countdown` every second (seconds show under an hour),
`scheduled` every 30 s, `asap` and `done` never. The consumer passes a
snapshot; `Tracker` keeps it live.

## Anatomy

```
div.tracker (column, gap space/12; --glass-fill by tone)
├─ div.text (gap space/2)
│  ├─ p.label  - text/label/sm, color/text/subtle      "Due in"
│  └─ p.value  - text/heading/md, color/text/default    "2d 11h" (tabular)
├─ div.track  - the well: color/chart/window, inset shade, 12 tall, pill
│  ├─ span.bar   - the glass recipe (src/glass.css), grows in from the left
│  └─ span.notch - 2px, color/text/default: where the deadline was, once passed
├─ dl.ends    - start left, end right: caption + label/sm (tabular)
└─ div.notes  - "Checkpoint ETA was …" once passed, then `context` (body/sm subtle)
```

## The bar's material

| situation | `--glass-fill` |
|---|---|
| calm | `color/chart/1` (Prism's brand) |
| warning | `color/chart/severity/warning` |
| danger, overdue, or `important` | `color/chart/severity/critical` |
| done | `color/chart/severity/low` |

## Urgency and fill

- **scheduled with `startAt`:** fill = time used of `startAt` → `dueAt`.
  Warning at 30 min left or four-fifths of the window used; danger at 5 min.
  **Overdue:** the track runs `startAt` → now, full, with a notch where the
  deadline was; the right end reads "Now" and a note names the deadline
  ("Checkpoint ETA was Sep 30, 13:48").
- **scheduled without `startAt`:** no honest total to measure against, so
  only the absolute floors apply and the bar is full.
- **countdown:** fill = share of `totalSeconds` used; warning at half or 30
  min, danger at a fifth or 5 min.
- **asap:** "Priority · As soon as possible", full bar, brand (danger if
  `important`).
- **done:** "Closed after 7d 0h" when both ends are known, the closing
  time when only that is, else "Done". Emerald, full.

Durations: `2d 11h` from two days, `5h 59m` under that, `24m 58s` (ticking)
under an hour in a countdown.
