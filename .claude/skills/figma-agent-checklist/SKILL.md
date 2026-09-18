---
name: figma-agent-checklist
description: >-
  A short list of real mistakes made this project while building new Figma
  components and while filling Figma screen content (building/replacing
  TableRow cells, retexting SegmentedControl/nav items, wiring badges,
  relabeling buttons, positioning rotated shapes, converting bare shapes to
  components) — read this ALONGSIDE the task-specific instructions you were
  given, before writing to Figma. Every item here is a bug that actually
  shipped and a human had to catch on review, not a hypothetical. Use
  whenever a task asks you to build a new Figma component from scratch, or to
  build, fill, clone, or relabel screen content using this design system's
  existing components (Table/TableRow/TableCell/TableHeaderCell,
  SegmentedControl, Button, Badge/SeverityBadge, Tooltip, or similar).
  Trigger words: build screen, fill table, populate rows, clone screen,
  duplicate frame content, relabel nav, add button, badge cell, new
  component, createComponentFromNode, rotation, arrow, triangle.
---

# Figma agent checklist

Fourteen real bugs (plus one recurring pattern), each shipped and caught on human review this project. Check
every one before you report a Figma build or content-fill task done.

## 1. A fresh `createInstance()` copies the master's defaults, not its neighbors'

`variant.createInstance()` gives you the **master's own default** property
values — never what a sibling instance next to it happens to show. Cloning a
correctly-configured row and expecting new cells to match it is wrong; two
different agents shipped this exact bug the same day: new `TableCell` "text"
cells rendered a stray dashed-circle icon and a phantom "Supporting text"
line because the cell master's own `hasIcon`/`hasSupporting` defaults are
`true`, while every existing cell around them had those explicitly forced to
`false`. **After every `createInstance()`, explicitly set every boolean/
variant property the surrounding pattern relies on — never assume "it'll
look like the one next to it."**

## 2. A component's default for a boolean can be surprising — verify, don't assume

`Button`'s `leadingIcon`/`trailingIcon` booleans default to `true` on the
master (an unusual choice, discovered only by reading
`componentPropertyDefinitions` directly). Don't guess what a property
defaults to from the name alone. Before relying on default behavior, either
read `componentPropertyDefinitions` on the component set, or check a
known-good existing instance's own resolved values.

## 3. "Item X should be selected" means *move the highlight*, not *reshuffle the list*

Told "the `SegmentedControl` should have Trucks selected," one agent kept
`selected` pinned to its structural middle position and swapped labels
around it — so a shared nav read Trailers/**Trucks**/Drivers on one screen
and something else on the next. A real nav's item **order is fixed** across
every screen that shows it; only *which item carries the selected state*
changes per screen. Before editing a shared nav-like control, check what
order it renders in elsewhere and preserve it — swap the `default`↔`selected`
component on the two affected items, don't rewrite every label.

## 4. Don't type a signal into the label if the icon already carries it

Two "+ Add X" buttons ended up with **two** plus signs — a real leading
`Plus` icon instance, and a literal "+ " also typed into the label text.
Before writing a label, check whether an adjacent icon already communicates
the same thing the text is about to repeat.

## 5. A "badge" cell isn't always plain `Badge` — check what the value actually is

If what you're rendering is a genuine severity/urgency level (critical,
warning, attention...), this design system has a dedicated component for
that — `SeverityBadge`, not generic `Badge` — even if the slot you're
filling is literally named "badge cell" and currently nests a plain `Badge`
by default. Don't assume the cell's own name tells you which component
belongs inside it; look at what the value *means* first. (Generic status
tags with no severity meaning — e.g. "Resolved" — correctly stay `Badge`.)

## 6. `createComponentFromNode()` can drop a fill bound on the exact node you convert

Binding a color variable directly on the node you're about to pass to
`figma.createComponentFromNode()` sometimes loses the binding entirely
(the fill silently resets to an invisible, unbound paint) — this hit a
`Divider` (a bare rectangle converted straight to a component) and a
`BreadcrumbItem` (a bare text node converted straight to a component) the
same day. Binding a fill on a **descendant** of the node you convert (e.g. a
shape or text nested inside a wrapper frame) is safe — every other component
built this way had zero issues. **Never bind a color directly on the exact
node passed to `createComponentFromNode` — wrap it in a frame first, bind
the color on the child, convert the frame.** After building, read back
`fills[0].visible` and `fills[0].boundVariables.color` on anything you
suspect — don't just trust that the bind call didn't throw.

## 7. A component whose root is a bare text node can't be retexted through its instances

Converting a bare `TEXT` node straight into a component (no wrapping frame)
means every **instance** of it has no traversable child at all — `.characters`
comes back `undefined` on the instance, silently, with no error. Any
text-bearing component's root must be a **frame wrapping a text child** (the
shape every other text component in this file already uses), never the bare
text node itself, or you'll have no way to retext an instance after creating
it.

## 8. `.rotation` pivots around the shape's top-left corner, not its center

Setting `.rotation` on a node (e.g. a small triangle/diamond built via
`figma.createPolygon()` or a rotated square) shifts its visual bounding box
away from wherever you positioned it — by an amount equal to the shape's own
width/height, in a direction that depends on the rotation angle (180°
shifts by `(-width, -height)`; 90°/-90° shift by `(0, -height)`/`(-width,
0)` respectively, confirmed empirically on an 8×8 shape). Do not assume
rotation pivots around the shape's center. Set position and rotation, then
**read back `.absoluteBoundingBox`** and compare it against where you
actually wanted the shape to land — adjust `.x`/`.y` to compensate, don't
guess the compensation from rotation math alone without verifying.

## 9. A stale "it's empty" read can go stale mid-task — re-check before a long build, especially if the owner might be editing concurrently

Asked to fill task cards on a screen, one agent read the target frame, found
its content slot empty, and spent many minutes building a full replacement
layout from scratch (header, 9 cards, placeholder cards) — without
re-checking the live document. The owner had been concurrently building the
*real* layout in Figma the whole time (a richer header, real task cards, two
populated side cards using components from earlier in the same session). The
agent's build silently duplicated and visually overlapped the owner's real
work, only caught by exporting and looking at the result afterward. **A
single "it's empty" read is a snapshot, not a guarantee** — it can go stale
the moment a human is also in the file. Before committing to a
multi-step build (especially one that will take several batches/minutes),
weigh how plausible concurrent editing is (an active session, a recent
screenshot showing content the read didn't find, phrasing like "I added" or
"appears only here"), and re-verify immediately before writing, not just
once at the start. If genuinely ambiguous whether something already exists
partway built, a quick re-read costs far less than an hour of duplicated work.

## 10. `swapComponent()` replaces *every* variant axis, not just the one you meant to change

Changing one property on a nested instance (e.g. `SeverityBadge`'s `level`)
by calling `instance.swapComponent(targetMain)` silently overwrites *every
other axis too* — `size`, `format`, whatever the target component happens to
have — not just the axis you intended to touch. One agent needed to change 9
`SeverityBadge` instances' `level` (critical/warning/attention/low) and
grabbed "the obvious" `size=md` variant for each target, overwriting a
*deliberate* `size=sm` choice that had been fixed earlier that same session
specifically because these cards are smaller than the `list` variant. The
level changed correctly; the size silently regressed on all 9. **Before
calling `swapComponent()` to change one axis, read the existing instance's
own `variantProperties` (or its `mainComponent.name`) first, and pick a
target that matches every axis you're not deliberately changing** — never
assume "the default size" is the right one just because it's the first
variant you find.

## 11. A `Slot`'s own sizing mode doesn't follow its parent instance's `HUG` — set it explicitly

Setting a `Card` instance's `layoutSizingVertical` to `HUG` (so it wraps whatever
content ends up in its `Slot`) does **not** mean the `Slot` itself resizes to
fit that content — the `Slot` node has its *own* independent sizing mode, and
if it's left at whatever the master defaulted to (`FILL`, bound to some
inherited fixed height), the whole card silently caps at that stale height
no matter how much real content gets appended into it. Building a settings
screen, two `Card` instances both reported `height: 220` — visibly true, both
lists of content were clipped exactly at that line — despite each instance's
own `layoutSizingVertical` correctly reading `HUG`. The actual culprit was
one level deeper: `card.findOne(n => n.type === 'SLOT').layoutSizingVertical`
was `FILL`. Setting it to `HUG` fixed both cards instantly (400px/433px).
**After composing content into any instance's `Slot`, check and explicitly
set the `Slot` node's own `layoutSizingVertical` (and horizontal, if
relevant) — never assume it inherits hug/fill behavior from the ancestor
instance's own sizing mode.**

## 12. You can hide a nested instance's override child, but you can't remove it

Calling `.remove()` on a child several instance-levels deep (e.g. deleting
extra `Label` + `divider` children inside a `Row` instance's own `LabelGroup`
instance, to collapse a 3-label description down to one) throws `"Removing
this node is not allowed"` — the same family of restriction as the
`insertChild` depth limit already logged for `Table`/`Menu`. Setting
`.visible = false` on the same nodes works fine and achieves the same visual
result. **Deleting content nested inside an instance isn't available through
the plugin API at all — reach for `.visible = false` from the start, don't
try `.remove()` first.**

## 13. Every spacing/padding number on a new frame must be bound to a `space.*` variable — never a raw literal

Building `SettingsNavItem` from scratch, its `itemSpacing`/padding were set as
plain numbers (`10`, `6`) instead of being bound to the matching `space.*`
variables this system uses everywhere else. This is the same class of defect
`Headercard`'s own audit caught and fixed earlier this project (an unbound
raw `3` and `10` on its layout) — it should have been caught here by the same
discipline, and wasn't, because building a *brand-new* component from loose
frames feels different from *auditing an existing one*, but the rule doesn't
change: **any numeric layout value you type into a newly-created frame
(`itemSpacing`, `paddingLeft/Top/Right/Bottom`, gap) must be bound to a real
`space/*` variable before the component is considered done** — pick the
nearest existing step, don't invent a bespoke number, and don't leave it
unbound "for now."

## 14. New text needs a real registered text style — never hand-set `fontName`/`fontSize`

Every heading and label created fresh this session (`"My tasks"`, `"Settings"`,
`"Notifications"`, `SettingsNavItem`'s own label) was built with
`figma.createText()` + manually chosen `fontName`/`fontSize` (plain Inter,
whatever size looked right) instead of applying one of this system's **27
real registered text styles** (`text/display/*`, `text/heading/xl…xs`,
`text/body/xl…2xs`, `text/label/xl…xs`, plus `text/badge-label/*`,
`text/overline`, `text/caption`, `text/code` — list them with
`figma.getLocalTextStylesAsync()`, never assume names). This is a crucial
miss: it silently reintroduces exactly the "raw value instead of a token"
problem this whole project exists to eliminate, just in the type dimension
instead of color — a hand-set 20px Bold Inter heading will never update if
`text/heading/lg` changes, and doesn't show up in any audit that greps for
token usage. **Any new TEXT node must get a real style applied
(`node.textStyleId = style.id`, or the async setter if the bridge requires
it) — figure out which existing style matches the intended role (a page
title is `text/heading/*`, a row label is `text/label/*` or `text/body/*`)
before typing a single font property by hand.** If truly no existing style
fits, that's a signal to flag a token gap, not to freehand one.

## Recurring: a component name search finds whichever match comes first, not the real one

Items 1–10 already covered `Stack` and `Tag` colliding with unrelated icons.
The same thing happened again this session with `Switch` (a legacy
`Property 1=Default/Variant2` component, not the real 18-variant `Switch`)
and `Divider` (a legacy `Type=Horizontal/Vertical` component, not the real
`orientation=horizontal/vertical` one) — both found by an innocent
`page.findAll(name === 'X')` before the real component turned up deeper in
the tree. This is now happened enough times that it should be the default
assumption, not a surprise: **treat every name-based component search as
untrusted until you've checked its `componentPropertyDefinitions` match what
you expect (right variant axes, right value casing) — prefer a known-good ID
from `HANDOFF.md` over a fresh name search whenever one exists.**

## Before you report done

Re-export the actual result as a PNG and look at it. Every bug above was
caught by looking at an image, not by reading properties back as JSON — a
property read can confirm a value was *set*, not that the result *looks
right*.
