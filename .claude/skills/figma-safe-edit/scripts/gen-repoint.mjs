/**
 * migration/mapping.json  ->  migration/repoint-local.js
 *
 * A snippet that repoints every LOCAL old variable named in mapping.map to an
 * alias of its new token (all modes). Library vars are skipped here and handled
 * by the node-rebind pass. Idempotent.
 */
import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = process.cwd();
const { map } = JSON.parse(readFileSync(`${ROOT}/migration/mapping.json`, 'utf8'));

const snippet = `const MAP = ${JSON.stringify(map)};
await figma.loadAllPagesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const mineIds = new Set(cols.filter((c) => ['Primitives','Semantic','Component'].includes(c.name)).map((c) => c.id));
const allVars = await figma.variables.getLocalVariablesAsync();
const newByName = new Map(allVars.filter((v) => mineIds.has(v.variableCollectionId)).map((v) => [v.name, v]));
const oldByName = new Map(allVars.filter((v) => !mineIds.has(v.variableCollectionId)).map((v) => [v.name, v]));
const collById = new Map(cols.map((c) => [c.id, c]));
const done = [], missTarget = [], libraryVars = [];
for (const [oldName, newName] of Object.entries(MAP)) {
  const ov = oldByName.get(oldName);
  if (!ov) { libraryVars.push(oldName); continue; }
  const nv = newByName.get(newName);
  if (!nv) { missTarget.push(oldName + ' -> ' + newName); continue; }
  if (ov.resolvedType !== nv.resolvedType) { missTarget.push(oldName + ' TYPE ' + ov.resolvedType + '!=' + nv.resolvedType); continue; }
  const coll = collById.get(ov.variableCollectionId);
  for (const m of coll.modes) ov.setValueForMode(m.modeId, figma.variables.createVariableAlias(nv));
  done.push(oldName + ' -> ' + newName);
}
return { repointed: done.length, done, libraryVarsForNodePass: libraryVars, targetMissing: missTarget };
`;
writeFileSync(`${ROOT}/migration/repoint-local.js`, snippet);
console.log(`migration/repoint-local.js — ${Object.keys(map).length} mapping entries`);
