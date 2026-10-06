# ProgressSteps

Stages on a vertical rail, each with when it was reached and what happened
during it. **L2**, built in code first (owner, 2026-10-06) for the task
page's Progress card, which replaced the separate Stages and Timeline
cards so no date shows twice. No Figma frame yet; this page is its spec.
On a list or a table row the small version stays `TableProgressStages`.

```tsx
<ProgressSteps
  aria-label="Task progress"
  current={1}
  steps={[
    {
      key: 'detected',
      label: 'Detected',
      at: 'Sep 26, 21:21',
      note: 'customs returned a tariff-code mismatch',
      events: [{ key: 'e1', label: 'Scored 8.2 · critical', at: 'Sep 26, 21:23' }],
    },
    { key: 'reviewed', label: 'Reviewed', at: 'Sep 26, 22:01' },
    { key: 'decided', label: 'Decided' },
    { key: 'executing', label: 'Executing' },
    { key: 'closed', label: 'Closed' },
  ]}
/>
```

| prop | what |
|---|---|
| `steps` | `{ key, label, at?, note?, events? }[]`, in order |
| `current` | 0-based index of the current step |
| `complete` | every step done, the last included |
| `aria-label` | the list's name; the current step carries `aria-current="step"` |

## Anatomy

```
ol.steps
└─ li.step (grid: 20 disc column, 12 gap, body) - padding-bottom 16 is the rail's run
   ├─ ::before   the rail, 2px, disc to disc (2 clear of each); brand below a done step
   ├─ span.disc  20: Prism + check (done) · Prism + white dot (current) · white well (ahead)
   └─ div.body (gap 4)
      ├─ head     label (label/md, strong; subtle ahead) · at (caption subtle, tabular)
      ├─ p.note   body/xs subtle, wraps in full
      └─ ul.events  each: label (body/xs default, wraps) · at (caption subtle)
```

Prism and the well are the recipes in `docs/patterns/Prism.md`.
