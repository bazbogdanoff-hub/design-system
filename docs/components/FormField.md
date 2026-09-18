# FormField

Label + control + conditional helper text — the standard wrapper for a
single form field. **L2** — composes a headline and `HelperText`.

```tsx
<FormField label="Email">
  <Input placeholder="you@example.com" />
</FormField>

<FormField label="API key" state="primary" helperText="This key is only shown once — copy it now.">
  <Input defaultValue="sk_live_51H8..." />
</FormField>

<FormField label="Email" state="error" helperText="Enter a valid email address.">
  <Input defaultValue="not-an-email" />
</FormField>
```

| prop | type | notes |
|---|---|---|
| `label` | `ReactNode` — required | the headline above the control |
| `size` | `sm` · `md` (default) · `lg` | cascades to a bare `<Input>` child (no explicit `size` of its own) and to the headline/`HelperText` sizing — the headline itself renders one `text/label/*` step down (`sm`→`xs`, `md`→`sm`, `lg`→`md`) |
| `state` | `default` (default) · `primary` · `error` | colors the headline; `primary`/`error` also show `helperText` below |
| `helperText` | `ReactNode` | rendered as a `HelperText` — only when `state` isn't `default` |
| `htmlFor` | `string` | associates the headline with the control via a real `<label htmlFor>` |
| `children` | `ReactNode` — required | the control — usually `Input`, but not required to be |

## Naming — "input container" became `FormField`

The industry-standard term for label+control+helper (Chakra's `FormControl`,
MUI's `TextField` internals, Ant's `Form.Item`) is **`FormField`**, and it
was already the planned name for this exact wrapper before this component
existed (see HANDOFF's earlier component-scope discussion) — so it generalizes
past `Input` on purpose: `Select`/`Textarea` will use the same wrapper later.
It isn't hardcoded to `Input` — any control works as `children` — but only a
bare `Input` gets `size` auto-filled (see below).

## `size` cascades to a bare `Input` child

Same mechanism `LabelGroup` uses for its `Label` children: if `children` is
a `<Input>` with no explicit `size`, `FormField` clones it with its own
`size`. An `Input` with its own `size` set is left alone — the explicit value
always wins. This means you don't have to keep two `size` props in sync for
the common case, but can still override when a field is intentionally the
odd one out.

## `state` — three, not two

`default` just renders the headline in `color.formField.label.default`
(matches `Row`'s heading color — a field label reads as a subheading, not a
page heading) — no helper row, regardless of whether `helperText` is passed.
`primary` and `error` both color the headline (`color.formField.label.primary`
/ `.error`) **and** render `helperText` as a `HelperText` in the matching
tone below the control. There's no separate "success" tone yet — add one
(token + `HelperTextTone` member) if a real screen needs it; don't guess the
value ahead of that.

## Layout

`display: flex; flex-direction: column; gap: space/6` — a small, even gap
between headline → control → helper, no special-cased margin for the helper
row.

## Headline is one label step down from `size`, not same-size

`sm`→`text/label/xs`, `md`→`text/label/sm`, `lg`→`text/label/md` — same
downshift-by-one convention `Row`'s `LabelGroup` description uses relative to
its own `size`. Owner corrected this in Figma (was naively same-size before);
React's `.field[data-size] .label` rules now mirror it exactly.

## Figma

**`FormField`** (`10264:18328`) — 9 variants, `size` × `state`. Each has a
`label` text node, a `content` **Slot** (owner has since converted it from a
plain frame) wrapping a size-matched `Input` instance, and, only on
`primary`/`error` variants, a `HelperText` instance at the matching
size/tone. `default` variants have no `HelperText` child at all, matching
React exactly (it never renders regardless of the `helperText` prop).
