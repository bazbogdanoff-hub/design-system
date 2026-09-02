# Extraction snippets

Plugin API read snippets for each audit phase. Each is the **body of an async
function** ending in `return` (see [bridge-setup.md](bridge-setup.md)). Run with:

```
node scripts/figma/fig.mjs <snippet-file.js> --out audit/raw/<name>.json
```

**Before relying on these:** run `scripts/figma/ping.js`, then the phase-1
snippet on the real file. If a shape looks wrong, the installed Figma API version
differs — fix it here once so later runs are clean.

Gotchas:
- `await figma.loadAllPagesAsync()` first, before any non-current page.
- `node.fillStyleId` / `strokeStyleId` can be `figma.mixed` (a Symbol) — guard with `typeof … === 'string'`.
- Reading `componentPropertyDefinitions` on a **variant** `COMPONENT` (child of a set) throws — read it on the set, skip set children.
- Figma colours are 0–1 floats. Hex = `Math.round(channel * 255)`.
- Use the `…Async` getters; sync variants are deprecated.

---

## Phase 1 — overview  → `audit/raw/overview.json`

```js
await figma.loadAllPagesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const paint = await figma.getLocalPaintStylesAsync();
const text = await figma.getLocalTextStylesAsync();
const effect = await figma.getLocalEffectStylesAsync();
let componentSets = 0, components = 0;
for (const page of figma.root.children) {
  componentSets += page.findAllWithCriteria({ types: ['COMPONENT_SET'] }).length;
  components   += page.findAllWithCriteria({ types: ['COMPONENT'] }).length;
}
return {
  file: figma.root.name,
  pages: figma.root.children.map((p) => ({ id: p.id, name: p.name, children: p.children.length })),
  collections: collections.map((c) => ({
    id: c.id, name: c.name,
    modes: c.modes.map((m) => ({ modeId: m.modeId, name: m.name })),
    defaultModeId: c.defaultModeId,
    variableCount: c.variableIds.length,
  })),
  styleCounts: { paint: paint.length, text: text.length, effect: effect.length },
  componentSets, components,
};
```

---

## Phase 2 — variables  → `audit/raw/variables.json`

```js
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const byId = Object.fromEntries(collections.map((c) => [c.id, c]));
const vars = await figma.variables.getLocalVariablesAsync();
const nameCache = {};
const nameOf = async (id) => {
  if (!(id in nameCache)) { const v = await figma.variables.getVariableByIdAsync(id); nameCache[id] = v ? v.name : null; }
  return nameCache[id];
};
const toHex = (c) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  let s = '#' + h(c.r) + h(c.g) + h(c.b);
  if (c.a !== undefined && c.a < 1) s += h(c.a);
  return s;
};
const variables = [];
for (const v of vars) {
  const coll = byId[v.variableCollectionId];
  const modes = {};
  for (const m of coll.modes) {
    const val = v.valuesByMode[m.modeId];
    if (val == null) modes[m.name] = null;
    else if (val.type === 'VARIABLE_ALIAS') modes[m.name] = { alias: await nameOf(val.id), aliasId: val.id };
    else if (v.resolvedType === 'COLOR') modes[m.name] = { hex: toHex(val) };
    else modes[m.name] = { value: val };
  }
  variables.push({
    id: v.id, name: v.name, type: v.resolvedType,
    collection: coll.name, collectionId: coll.id,
    scopes: v.scopes, hiddenFromPublishing: v.hiddenFromPublishing,
    modes,
  });
}
return {
  collections: collections.map((c) => ({ id: c.id, name: c.name, modes: c.modes.map((m) => m.name), count: c.variableIds.length })),
  variables,
};
```

Row: `{ id, name, type, collection, modes: { <modeName>: {hex} | {alias,aliasId} | {value} | null } }`.

---

## Phase 2 — styles  → `audit/raw/styles.json`

```js
const toHex = (c) => { const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0'); return '#' + h(c.r) + h(c.g) + h(c.b); };
const paint = await figma.getLocalPaintStylesAsync();
const text = await figma.getLocalTextStylesAsync();
const effect = await figma.getLocalEffectStylesAsync();
return {
  paint: paint.map((s) => ({
    id: s.id, name: s.name,
    paints: s.paints.map((p) => p.type === 'SOLID'
      ? { type: 'SOLID', hex: toHex(p.color), opacity: p.opacity ?? 1, boundVariable: p.boundVariables?.color?.id ?? null }
      : { type: p.type }),
  })),
  text: text.map((s) => ({ id: s.id, name: s.name, fontSize: s.fontSize, fontName: s.fontName, lineHeight: s.lineHeight })),
  effect: effect.map((s) => ({ id: s.id, name: s.name, effects: s.effects.map((e) => e.type) })),
};
```

---

## Phase 3 — components  → `audit/raw/components.json`

```js
await figma.loadAllPagesAsync();
const components = [];
for (const page of figma.root.children) {
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT_SET'] })) {
    components.push({
      kind: 'COMPONENT_SET', id: n.id, name: n.name, page: page.name,
      properties: n.componentPropertyDefinitions,
      variants: n.children.map((c) => c.name),
    });
  }
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT'] })) {
    if (n.parent && n.parent.type === 'COMPONENT_SET') continue;
    components.push({
      kind: 'COMPONENT', id: n.id, name: n.name, page: page.name,
      properties: n.componentPropertyDefinitions ?? {},
    });
  }
}
return { components };
```

`properties` shape: `{ "<prop>": { type: "VARIANT"|"BOOLEAN"|"TEXT"|"INSTANCE_SWAP", defaultValue, variantOptions? } }`.

---

## Phase 4 — colour usage, one page  → `audit/raw/usage-<page>.json`

Put the page name on the first line, or template it in.

```js
const PAGE = "__PAGE_NAME__";
await figma.loadAllPagesAsync();
const page = figma.root.children.find((p) => p.name === PAGE);
if (!page) return { error: 'page not found: ' + PAGE };
const toHex = (c, a) => {
  const h = (n) => Math.round(n * 255).toString(16).padStart(2, '0');
  let s = '#' + h(c.r) + h(c.g) + h(c.b);
  if (a != null && a < 1) s += h(a);
  return s;
};
const varName = {};
const nameOf = async (id) => { if (!(id in varName)) { const v = await figma.variables.getVariableByIdAsync(id); varName[id] = v ? v.name : id; } return varName[id]; };
const styleName = {};
const styleNameOf = async (id) => { if (!(id in styleName)) { const s = await figma.getStyleByIdAsync(id); styleName[id] = s ? s.name : id; } return styleName[id]; };
const rows = [];
const nodes = page.findAllWithCriteria({
  types: ['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'RECTANGLE', 'ELLIPSE', 'VECTOR', 'TEXT', 'LINE', 'POLYGON', 'STAR', 'BOOLEAN_OPERATION'],
});
for (const n of nodes) {
  for (const [channel, styleKey] of [['fills', 'fillStyleId'], ['strokes', 'strokeStyleId']]) {
    const paints = n[channel];
    if (!Array.isArray(paints)) continue;
    for (let i = 0; i < paints.length; i++) {
      const p = paints[i];
      if (p.type !== 'SOLID' || p.visible === false) continue;
      let binding = 'raw';
      const bv = p.boundVariables && p.boundVariables.color;
      if (bv && bv.id) binding = 'variable:' + await nameOf(bv.id);
      else if (typeof n[styleKey] === 'string' && n[styleKey]) binding = 'style:' + await styleNameOf(n[styleKey]);
      rows.push({ nodeId: n.id, node: n.name, nodeType: n.type, channel, index: i, hex: toHex(p.color, p.opacity), binding });
    }
  }
}
return { page: PAGE, count: rows.length, rows };
```

Row: `{ nodeId, node, nodeType, channel: "fills"|"strokes", hex, binding: "raw" | "variable:<name>" | "style:<name>" }`.
