# Filter

A filter trigger for card/table headers. **L2 pattern** — `Button` fixed to
`variant="secondary"`, restricted to `sm`/`md`.

```tsx
<Filter leadingIcon={<CalendarIcon/>} trailingIcon={<CaretDownIcon/>} onClick={openDatePicker}>
  Last 7 days
</Filter>
```

| prop | values | default |
|---|---|---|
| `size` | `sm` (28px) · `md` (32px) | `md` |

1440 migration: was `lg`(36)/`xl`(40) — Button's whole size scale shifted
(see [Button.md](./Button.md)), and Filter shifted with it onto the two
sizes one step down.

Everything else (`leadingIcon`, `trailingIcon`, `loading`, `asChild`, standard
button props) is `ButtonProps` passed straight through — `variant` and `size`
are the only two Filter fixes/restricts.

## Figma

**`Filter`** — `size`(sm/md) × `state`(default/hover/active/disabled) = 8
variants. Each variant **nests a real instance of the matching `Button`
variant** (e.g. `size=md, state=hover` wraps an instance of Button's own
`"size=md, variant=secondary, state=hover"`) — not a detached copy. That's
why there's no separate token/CSS work here: Button changes propagate
straight through. The nested Button's `leadingIcon`/`trailingIcon`/swap
properties are exposed up to Filter's own properties panel (Figma's "expose
nested instance properties"), so they're directly editable per Filter
instance without drilling in.

The trailing icon differs by state on purpose: `default`/`disabled` show a
caret pointing down, `hover`/`active` point up — closed vs. open picker.

`Filter — icon` (the fixed funnel-icon trigger, opens the advanced-filter /
add-filter popover) follows the same nest-not-clone technique, built
separately.

## a11y

Real `<button>`, same as `Button`.
