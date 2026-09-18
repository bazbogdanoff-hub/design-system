# EmptyState

A short "nothing here" state — icon + a line of text, optionally a second
muted line, all centered. **L1**, generic — not itself about "no issues,"
just the shape.

```tsx
<EmptyState heading="No issues" />
<EmptyState heading="No results" description="Try a different search term." />
<EmptyState icon={<InboxIcon />} heading="Nothing here yet" />
```

| prop | type | notes |
|---|---|---|
| `icon` | `ReactNode` | defaults to a success-colored checkmark; override for other contexts |
| `heading` | `ReactNode` — required | |
| `description` | `ReactNode` | optional second, more muted line |

## First real use: a cleared `EntityProblemPanel`

Built for `EntityProblemPanel`'s `state=empty` variant (an entity with zero
issues) — the default checkmark fits that "resolved" framing. Reuse it
elsewhere it fits (nothing found, no data yet); pass your own `icon` when
the default checkmark reads wrong for the context (an empty search isn't a
"success").

## Figma

**`EmptyState`** (`10264:21655`) — single component, no variants, sized to
the `EntityProblemPanel` column context (281px). Icon `color/icon/success`,
heading `color/text/subtle`.
