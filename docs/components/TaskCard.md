# TaskCard

A task summary card — queue-position cell, category tag, title,
description, severity, and a trailing action. **L2 pattern**, from the
Figma component of the same name.

```tsx
<TaskCard
  position={5}
  category={{ label: 'Maintenance', color: 'emerald' }}
  title="Inspect TR-3305"
  description="Last inspected Apr 28, 2026 — 101 days ago."
  severity="warning"
  action={
    <Button variant="primary" size="sm" trailingIcon={<ArrowRightIcon />}>
      Resolve
    </Button>
  }
/>
```

| prop | type | notes |
|---|---|---|
| `context` | `list` (default) \| `queue` | `list` — standalone, no stack. `queue` — 3 decorative ghost layers behind it, for `NextTask` |
| `position` | `number` | the leading `IconCell`'s number, formatted as `#${position}` |
| `category` | `{ label: ReactNode; color: TagColor }` | rendered as a `Tag` above the title |
| `title` | `ReactNode` | — |
| `description` | `ReactNode` | — |
| `severity` | `SeverityLevel` | passed straight to `SeverityBadge` |
| `action` | `ReactNode` — optional | usually a primary `Button` |

## Anatomy

```
div.taskCard
└─ div.shadow (drop-shadow lives here, never on Card)
   └─ Card (padding md)
      └─ div.header (row)
      │  ├─ IconCell (size 2xl) — "#{position}"
      │  └─ div.titleGroup (column)
      │     ├─ Tag (size xs, color={category.color}) — {category.label}
      │     └─ h3.heading — {title}
      ├─ p.description — {description}
      └─ div.footer (row, space-between)
         ├─ SeverityBadge (level={severity})
         └─ {action}
```

## Why the shadow sits on a wrapper, not on Card

The drop shadow is a property of *this card's context* (its own elevation),
not of `Card` itself — `Card` already carries its own default inner-shadow
vignette (set when `Card` was finalized), and that stays completely
untouched here. Putting `TaskCard`'s shadow on a dedicated `.shadow`
wrapper means `Card` remains a pure pass-through: if `Card`'s own default
treatment ever changes, `TaskCard` picks it up automatically, with zero
risk of a stale, manually-set effect silently drifting out of sync.

## `context="queue"` — 3 ghosts, not a generic stack cap

Renders 3 empty, `aria-hidden` decorative layers behind the real card, each
10px higher and 20px narrower than the one in front (`margin: -10px 10px`,
`-20px 20px`, `-30px 30px`) — all four layers (3 ghosts + the real card)
share one CSS Grid cell so the ghosts stretch to match the real card's
actual height with no JS measurement. This constant (3) is specific to
`TaskCard`, not a generic rule — a different stacked-card component may use
a different fixed depth. What's shared is the principle: the ghost count
never reflects the real queue size, and it's capped regardless of how many
items actually exist — the real count belongs in visible text nearby (e.g.
`NextTask`'s `+3 after this`), never in how many edges are drawn.

`position` is always `1` for `context="queue"` — `NextTask` only ever shows
the front task. It varies for `context="list"`, where each row in a real
list has its own genuine position.
