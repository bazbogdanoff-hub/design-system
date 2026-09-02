# Operation recipes

One recipe per `action` in `findings.json`. Each is written as a snippet body
(ends in `return`), is **idempotent** (safe to re-run), and returns
`{before, after, skipped}` per target so the batch loop can verify.

Shared preamble for any batch that looks variables up by name:

```js
const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = new Map(allVars.map((v) => [v.name, v]));
const varById = async (id) => figma.variables.getVariableByIdAsync(id);
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collByName = new Map(collections.map((c) => [c.name, c]));
```

Batches are a loop over an inlined `const OPS = [ ... ]` array (put the approved
findings' data there). Keep `OPS.length <= 20` per call.

---

## `rename` — variable

```js
const results = [];
for (const op of OPS) {                       // op: {findingId, targetId, proposed}
  const v = await figma.variables.getVariableByIdAsync(op.targetId);
  if (!v) { results.push({ ...op, ok: false, note: 'variable gone' }); continue; }
  const before = v.name;
  const target = op.proposed.replace(/\./g, '/');   // canonical dots -> Figma slashes
  if (before !== target) v.name = target;
  results.push({ findingId: op.findingId, targetId: op.targetId, before, after: v.name, skipped: before === target, ok: true });
}
return results;
```

## `rename` — component / component-set / node

```js
const results = [];
for (const op of OPS) {
  const n = await figma.getNodeByIdAsync(op.targetId);
  if (!n) { results.push({ ...op, ok: false, note: 'node gone' }); continue; }
  const before = n.name;
  if (before !== op.proposed) n.name = op.proposed;
  results.push({ findingId: op.findingId, targetId: op.targetId, before, after: n.name, skipped: before === op.proposed, ok: true });
}
return results;
```

Variant **property** renames (`variant-naming`, e.g. `Type` → `variant`) go
through the component-set:
`componentSet.editComponentProperty(oldName, { name: newName })`. Variant **value**
renames: rename each child component's name string (`Type=Primary` →
`variant=primary`) — do the property rename first, then the values.

## `variable-raw-value` → make a mode value an alias

`op: {findingId, targetId, mode, aliasTargetName}` — `aliasTargetName` is the
primitive the audit matched by hex (`color/brand/600`).

```js
const results = [];
for (const op of OPS) {
  const v = await figma.variables.getVariableByIdAsync(op.targetId);
  const coll = collections.find((c) => c.id === v.variableCollectionId);
  const modeId = coll.modes.find((m) => m.name === op.mode).modeId;
  const target = varByName.get(op.aliasTargetName);
  if (!target) { results.push({ ...op, ok: false, note: `alias target not found: ${op.aliasTargetName}` }); continue; }
  const cur = v.valuesByMode[modeId];
  const already = cur && cur.type === 'VARIABLE_ALIAS' && cur.id === target.id;
  if (!already) v.setValueForMode(modeId, figma.variables.createVariableAlias(target));
  results.push({ findingId: op.findingId, targetId: op.targetId, before: already ? 'alias' : 'raw', after: `alias:${op.aliasTargetName}`, skipped: already, ok: true });
}
return results;
```

## `component-binding` / `rebind` — repoint a node paint off a primitive

`op: {findingId, targetId, channel, index, newVarName}` — from usage rows.

```js
const results = [];
for (const op of OPS) {
  const n = await figma.getNodeByIdAsync(op.targetId);
  const target = varByName.get(op.newVarName);
  if (!n || !target) { results.push({ ...op, ok: false, note: 'node or target var missing' }); continue; }
  const paints = JSON.parse(JSON.stringify(n[op.channel]));       // frozen — copy first
  const before = paints[op.index]?.boundVariables?.color?.id ?? 'raw';
  if (before === target.id) { results.push({ ...op, skipped: true, ok: true, after: op.newVarName }); continue; }
  paints[op.index] = figma.variables.setBoundVariableForPaint(paints[op.index], 'color', target);
  n[op.channel] = paints;
  results.push({ findingId: op.findingId, targetId: op.targetId, before, after: op.newVarName, skipped: false, ok: true });
}
return results;
```

`h.bF(n, idx, target.id)` / `h.bS(...)` do the copy-and-bind for you — use them
if you prefer: `await h.bF(await figma.getNodeByIdAsync(op.targetId), op.index, target.id)`.

## `create-and-bind` — bind a loose raw fill to a (possibly new) variable

```js
const results = [];
for (const op of OPS) {                        // op: {targetId, channel, index, varName, collection}
  let v = varByName.get(op.varName);
  if (!v) {
    const coll = collByName.get(op.collection);
    v = figma.variables.createVariable(op.varName, coll, 'COLOR');
    // leave its value for the semantic-alias pass; or set here if op carries aliasTargetName
  }
  const n = await figma.getNodeByIdAsync(op.targetId);
  await h.bF(n, op.index, v.id);               // (or h.bS for strokes)
  results.push({ findingId: op.findingId, targetId: op.targetId, before: 'raw', after: op.varName, ok: true });
}
return results;
```

## `convert-style-to-variable`

Mostly `manual-review` — it needs the semantic intent picked by a human. When the
audit did match a semantic token by hex: create that variable (if missing), then
for every node using the style, unlink the style and bind the variable. Scanning
for style consumers is expensive — do this per style, gated, on its own.

## `merge` A → B

```js
// op: {fromId, toName}
const from = await figma.variables.getVariableByIdAsync(op.fromId);
const to = varByName.get(op.toName);
// 1. repoint variables that alias `from`
for (const v of allVars) for (const [mid, val] of Object.entries(v.valuesByMode))
  if (val && val.type === 'VARIABLE_ALIAS' && val.id === from.id)
    v.setValueForMode(mid, figma.variables.createVariableAlias(to));
// 2. repoint node paints — scan pages (expensive; gate this)
await figma.loadAllPagesAsync();
let repointed = 0;
for (const page of figma.root.children)
  for (const n of page.findAllWithCriteria({ types: ['FRAME','INSTANCE','COMPONENT','RECTANGLE','ELLIPSE','VECTOR','TEXT','LINE'] }))
    for (const ch of ['fills','strokes']) {
      const p = n[ch]; if (!Array.isArray(p)) continue;
      let changed = false;
      const copy = JSON.parse(JSON.stringify(p));
      copy.forEach((paint, i) => {
        if (paint.boundVariables?.color?.id === from.id) { copy[i] = figma.variables.setBoundVariableForPaint(paint, 'color', to); changed = true; repointed++; }
      });
      if (changed) n[ch] = copy;
    }
return { repointed, note: 'now safe to delete ' + from.name };
```

Delete `from` only in the **next** batch, after verifying `repointed` covers
every reference the audit counted.

## `delete` / `unused-primitive`

```js
const results = [];
for (const op of OPS) {                         // op: {targetId, name}
  const v = await figma.variables.getVariableByIdAsync(op.targetId);
  if (!v) { results.push({ ...op, skipped: true, ok: true, note: 'already gone' }); continue; }
  // last safety check: nothing aliases it
  const refs = allVars.filter((x) => Object.values(x.valuesByMode).some((val) => val && val.type === 'VARIABLE_ALIAS' && val.id === v.id));
  if (refs.length) { results.push({ ...op, ok: false, note: `still referenced by ${refs.map((r) => r.name).join(', ')}` }); continue; }
  v.remove();
  results.push({ findingId: op.findingId, targetId: op.targetId, before: op.name, after: 'deleted', ok: true });
}
return results;
```

## `collection-structure`

```js
// create a collection
const coll = collByName.get(name) ?? figma.variables.createVariableCollection(name);
// rename the default mode to Light
if (!coll.modes.some((m) => /^light$/i.test(m.name)))
  coll.renameMode(coll.modes[0].modeId, 'Light');
// hide primitives from publishing
if (name === 'Primitives') for (const id of coll.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id); v.hiddenFromPublishing = true;
}
return { collection: coll.name, modes: coll.modes.map((m) => m.name) };
```

Moving a variable between collections is **not** supported by the API — you
recreate it in the target collection and repoint, then delete the original
(that's a `merge`).
