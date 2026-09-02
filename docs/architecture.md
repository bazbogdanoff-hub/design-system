# Component architecture

## Three layers

| layer | examples | knows about | lives in |
|---|---|---|---|
| **L1 · Primitive** | `Card`, `Badge`, `Button`, `Input`, `Text`, `Divider` | nothing — pure layout / style | this repo (`src/components/`) |
| **L2 · Pattern** | `StatCard`, `EmptyState`, `Alert`, `Banner`, `Toolbar` | a *shape* that recurs across products, still domain-agnostic | this repo (`src/components/`) |
| **L3 · Domain** | `ShipmentCard`, `RouteTimeline`, `CarrierPanel`, `Chart card` | *product entities* — shipment, carrier, PO#, route | **the app** (`dzrep/src/components/`), imports `@bazbogdanoff/design-system` |

### The test for where a component belongs

> *Would this exact component make sense in a different company's CRM?*

Yes → L1/L2, design system. No — it references *your* entities → L3, app code.

L3 components **compose** L1/L2 (`<ShipmentCard>` renders `<Card>`, `<Badge>`,
`<StatCard>`, `<Button>` internally). They are product code, versioned with the app.

## Primitives stay small

A primitive never grows a domain variant (`Card variant="shipment"`) or a wall of
booleans for every layout. It owns its surface/behaviour and exposes a slot.
Everything specific is composed on top.

## How content attaches

| mechanism | when | code | Figma |
|---|---|---|---|
| `children` | open composition | `<Card>{anything}</Card>` | nested instance, free content in the SLOT |
| sub-components | repeated internal regions of one component | `<Menu.Item>` | grouped variant components |
| typed props | required / structured data | `<StatCard label value delta />` | text-layer overrides + variant/boolean props |
| named slot props | one or two fixed insertion points | `<StatCard action={<Button/>} />` | `SLOT` property |

L1 primitives lean on `children` + `asChild`. L2 patterns use typed props for the
data plus a `children` escape hatch.

## Figma: never detach

Detaching a component orphans the copy from its primitive — a later change to the
glass effect, `radius/card`, or a token won't reach it. Always:

1. nest an **instance** of the primitive,
2. fill its **slots**, override text / props,
3. publish the result as its own component.

A Figma `ShipmentCard` is a frame containing a `Card` instance with its slot
filled — not a detached copy of `Card` with edits.

## Build order

Primitives first (they unblock everything), then patterns as they prove recurring,
then domain components in the app. Current: `Card` (L1).
Next L1/L2 candidates from the audit: `Badge`, `Button`, `Input`, `Tab`,
`Alert` (from `Info message`), `StatCard` (from `Stat - button`).
