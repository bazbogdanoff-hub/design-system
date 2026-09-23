# Tracker

The counter block for `NextTask` (not yet built) — a label, a hero value,
and a `ProgressBar`, in one fixed shape across three time modes. **L1
primitive**, from the Figma component of the same name.

```tsx
<Tracker urgency={{ mode: 'countdown', remainingSeconds: 792, totalSeconds: 1800 }} />
<Tracker urgency={{ mode: 'scheduled', dueAt: '2026-09-09T09:00:00' }} />
<Tracker urgency={{ mode: 'asap' }} />
```

| prop | values | default |
|---|---|---|
| `urgency` | `{ mode: 'countdown', remainingSeconds, totalSeconds }` \| `{ mode: 'scheduled', dueAt: Date \| string }` \| `{ mode: 'asap' }` | — |
| `important` | `boolean` — forces danger regardless of the time-based escalation below, including over `asap` | `false` |

Self-ticking: `countdown` re-renders every second (seconds are the
displayed unit below an hour), `scheduled` every 30s, `asap` never — the
consumer passes a snapshot (`remainingSeconds` as of whenever it last had
real data, or a fixed `dueAt`) and `Tracker` keeps the display live on its
own rather than requiring the parent to re-render every tick.

## Anatomy

```
div.tracker (flex column, gap space/16)
├─ div.text (flex column, gap space/8)
│  ├─ p.label  — text/heading/xs, color/text/subtle
│  └─ p.value  — text/display/md, color/text/<tone>-solid
└─ ProgressBar (size lg, max-width 260px, tone matches .value's tone)
```

Same shape in every state — nothing is added, removed, or repositioned.
Only the label text, the value text, the `ProgressBar`'s `tone`, and its
fill amount change.

## Urgency resolution

Checked in this order, first match wins:

```
1. important === true              -> danger, always (including over asap)
2. mode === 'asap'                 -> its own accent, not good/warning/danger
3. mode === 'countdown':
     remaining <= 0                              -> danger (overdue)
     ratio <= 0.2  OR  remaining <= 300  (5m)     -> danger
     ratio <= 0.5  OR  remaining <= 1800 (30m)    -> warning
     else                                          -> good
4. mode === 'scheduled':
     secondsUntilDue <= 0                          -> danger (overdue)
     secondsUntilDue <= 300  (5m)                  -> danger
     secondsUntilDue <= 1800 (30m)                 -> warning
     else                                           -> good
```

`scheduled` deliberately has **no ratio branch** — there's no honest
"total" to measure against (no assumed created-at timestamp), so only the
absolute floors apply. That's the one asymmetry with `countdown`, and it's
intentional.

## Color mapping — good/warning/danger to `ProgressBarTone`

`ProgressBar` only has 4 tones (`brand`/`success`/`warning`/`danger`) — no
dedicated neutral or "asap" hue. Rather than add a 5th tone unprompted:

| state | `ProgressBarTone` | why |
|---|---|---|
| `countdown`, good | `success` | an actively healthy countdown |
| `scheduled`, good | `brand` | a neutral "on the books" identity — deliberately a *different* color from countdown-good even though both are "fine," because they mean different things |
| either, warning | `warning` | shared — once it's urgent, both modes should look equally urgent |
| either, danger | `danger` | shared |
| `asap` | `brand` | deliberately distinct from every danger state, so "immediate" is never confused with "about to expire." Revisit if this doesn't read right — it was a pragmatic call within the existing 4 tones, not a settled design decision. |

## Track fill

- `countdown` → `clamp(remaining / total, 0, 1)`, literal — the only mode
  where fill actually varies.
- `scheduled` / `asap` → always full (100%). A scheduled task isn't
  "draining" toward its deadline in any way we can honestly measure, and
  `asap` has no deadline to measure at all.

## Value formatting

Words stay on the small label; the hero line is **count / clock only**.

| mode | far | near (< 1h) | overdue |
|---|---|---|---|
| `countdown` | label `Time left` · value `4h 20m` | label `Time left` · value `13m 12s` (ticks) | label `Overdue` · value `3m` |
| `scheduled` | label `Tomorrow` / `Wed` / `Today` · value `1:29 PM` | label `Due in` · value `22m` | label `Overdue` · value `12m` |
| `asap` | label `Priority` · value `ASAP` | — | — |

## Figma note

The Figma component's fill-width can't be varied per state via instance
override — Figma silently blocks resizing that nested rectangle through a
`ProgressBar` instance (confirmed: the identical resize works fine on the
`ProgressBar` master directly). All of Figma's `Tracker` variants therefore
show the same default fill ratio; only this React implementation actually
computes `countdown`'s literal fill percentage.
