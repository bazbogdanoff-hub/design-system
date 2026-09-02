/**
 * tokens/*.json  ->  migration/build-0{1..4}.js
 *
 * Four idempotent figmosha snippets that (re)create this repo's tokens as Figma
 * variables + text styles. Run them in order via fig.mjs, verifying each:
 *
 *   node .claude/skills/figma-safe-edit/scripts/tokens-to-figma.mjs
 *   node scripts/figma/fig.mjs migration/build-01-primitives.js
 *   node scripts/figma/fig.mjs migration/build-02-semantic.js
 *   node scripts/figma/fig.mjs migration/build-03-component.js
 *   node scripts/figma/fig.mjs migration/build-04-text-styles.js
 *
 * Idempotent = re-running updates values, never duplicates. Safe on a duplicate
 * file / branch only (figmosha2 has no undo).
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';

const ROOT = process.cwd();
const OUT = `${ROOT}/migration`;
mkdirSync(OUT, { recursive: true });

// ---------- flatten + partially resolve tokens ----------------------------
const merged = {};
for (const f of readdirSync(`${ROOT}/tokens`).filter((f) => f.endsWith('.json'))) {
  deepMerge(merged, JSON.parse(readFileSync(`${ROOT}/tokens/${f}`, 'utf8')));
}
function deepMerge(a, b) {
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) { a[k] ||= {}; deepMerge(a[k], b[k]); }
    else a[k] = b[k];
  }
  return a;
}

const rawByPath = {};   // "color.brand.600" -> "#4f46e5" | "{color.indigo.600}" | {typography object}
(function walk(node, path) {
  if (node && typeof node === 'object' && '$value' in node) { rawByPath[path.join('.')] = node.$value; return; }
  for (const k of Object.keys(node || {})) { if (k.startsWith('$')) continue; walk(node[k], [...path, k]); }
})(merged, []);

const resolve = (v, seen = new Set()) => {
  const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
  if (!m) return v;
  if (seen.has(m[1]) || !(m[1] in rawByPath)) return v;
  seen.add(m[1]);
  return resolve(rawByPath[m[1]], seen);
};
const figName = (p) => p.replace(/\./g, '/');
const remToNum = (s) => {
  if (s === 0 || s === '0') return 0;
  let m = String(s).match(/^(-?[\d.]+)rem$/); if (m) return +(+m[1] * 16).toFixed(4);
  m = String(s).match(/^(-?[\d.]+)px$/); if (m) return +m[1];
  m = String(s).match(/^(-?[\d.]+)em$/); if (m) return +m[1];
  return Number(s);
};
const HUES = 'slate gray zinc neutral stone red orange amber yellow lime green emerald teal cyan sky blue indigo violet purple fuchsia pink rose'.split(' ');
const isColorPrimitive = (p) => new RegExp(`^color\\.(${HUES.join('|')}|brand|extra|white|black)(\\.|$)`).test(p);
const isColorSemantic = (p) => /^color\.(background|surface|text|border|icon|chart)\./.test(p);
const isColorComponent = (p) => /^color\.(button|card|input|badge|table|modal)\./.test(p);

// ---------- 01 · primitives (COLOR + FLOAT) -------------------------------
const colors = [];
const floats = [];
for (const [p, raw] of Object.entries(rawByPath)) {
  if (isColorPrimitive(p)) {
    const hex = resolve(raw);
    if (typeof hex === 'string' && hex.startsWith('#')) colors.push({ name: figName(p), hex });
  } else if (/^radius\.(none|xs|sm|md|lg|xl|2xl|3xl|full)$/.test(p) || /^space\.\d+$/.test(p)) {
    floats.push({ name: figName(p), value: remToNum(raw) });
  }
}

// ---------- 02 · semantic (aliases + a few raws) ------------------------
const semAliases = [], semRaws = [];
for (const [p, raw] of Object.entries(rawByPath)) {
  if (!isColorSemantic(p) && !/^radius\.(container|panel|control|chip|pill)$/.test(p)) continue;
  const m = typeof raw === 'string' && raw.match(/^\{(.+)\}$/);
  if (m) semAliases.push({ name: figName(p), target: figName(m[1]), type: p.startsWith('color') ? 'COLOR' : 'FLOAT' });
  else if (typeof raw === 'string' && raw.startsWith('#')) semRaws.push({ name: figName(p), hex: raw });
  else if (raw === 'transparent') semRaws.push({ name: figName(p), hex: '#00000000' });
}

// ---------- 03 · component (aliases) ------------------------------------
const compAliases = [];
for (const [p, raw] of Object.entries(rawByPath)) {
  if (!isColorComponent(p) && !/^radius\.(card|modal|table|popover|button|input|badge)$/.test(p)) continue;
  const m = typeof raw === 'string' && raw.match(/^\{(.+)\}$/);
  if (m) compAliases.push({ name: figName(p), target: figName(m[1]), type: p.startsWith('color') ? 'COLOR' : 'FLOAT' });
  else if (raw === 'transparent') compAliases.push({ name: figName(p), raw: '#00000000', type: 'COLOR' });
  else if (typeof raw === 'string' && raw.startsWith('#')) compAliases.push({ name: figName(p), raw, type: 'COLOR' });
}

// ---------- 04 · text styles ------------------------------------------
const WEIGHT_STYLE = { 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold' };
const textStyles = [];
(function walkType(node, path) {
  if (node && node.$value && typeof node.$value === 'object' && 'fontSize' in node.$value) {
    const v = node.$value;
    const num = (ref) => remToNum(resolve(ref));
    textStyles.push({
      name: 'text/' + path.join('/'),
      family: 'Plus Jakarta Sans',
      style: WEIGHT_STYLE[num(v.fontWeight)] || 'Medium',
      size: num(v.fontSize),
      lineHeightPct: +(num(v.lineHeight) * 100).toFixed(2),
      letterSpacingPct: +(num(v.letterSpacing) * 100).toFixed(2),
      uppercase: path.at(-1) === 'overline',
      mono: /mono/.test(String(v.fontFamily)),
    });
    return;
  }
  for (const k of Object.keys(node || {})) { if (k.startsWith('$')) continue; walkType(node[k], [...path, k]); }
})(merged.text || {}, []);

// ---------- emit -----------------------------------------------------
const HEX_TO_RGB = `const hexToRgb = (h) => { h = String(h).replace('#',''); if (h.length===3) h=[...h].map(c=>c+c).join(''); const n=parseInt(h.slice(0,6),16); const a=h.length===8?parseInt(h.slice(6,8),16)/255:1; return { r:((n>>16)&255)/255, g:((n>>8)&255)/255, b:(n&255)/255, a }; };`;

writeFileSync(`${OUT}/build-01-primitives.js`, `// generated by tokens-to-figma.mjs — idempotent
const COLORS = ${JSON.stringify(colors)};
const FLOATS = ${JSON.stringify(floats)};
${HEX_TO_RGB}
const cols = await figma.variables.getLocalVariableCollectionsAsync();
let coll = cols.find((c) => c.name === 'Primitives') || figma.variables.createVariableCollection('Primitives');
const modeId = coll.modes[0].modeId;
const mine = (await figma.variables.getLocalVariablesAsync()).filter((v) => v.variableCollectionId === coll.id);
const byName = new Map(mine.map((v) => [v.name, v]));
let created = 0, updated = 0;
for (const c of COLORS) {
  let v = byName.get(c.name);
  if (!v) { v = figma.variables.createVariable(c.name, coll, 'COLOR'); created++; } else updated++;
  v.hiddenFromPublishing = true;
  v.setValueForMode(modeId, hexToRgb(c.hex));
}
for (const f of FLOATS) {
  let v = byName.get(f.name);
  if (!v) { v = figma.variables.createVariable(f.name, coll, 'FLOAT'); created++; } else updated++;
  v.hiddenFromPublishing = true;
  v.setValueForMode(modeId, f.value);
}
return { collection: coll.name, created, updated, expected: COLORS.length + FLOATS.length };
`);

const ALIAS_APPLY = (specVar, collName, hasRaw) => `
const all = await figma.variables.getLocalVariablesAsync();
const anyByName = new Map(all.map((v) => [v.name, v]));
const cols = await figma.variables.getLocalVariableCollectionsAsync();
let coll = cols.find((c) => c.name === '${collName}') || figma.variables.createVariableCollection('${collName}');
if (!coll.modes.some((m) => /^light$/i.test(m.name))) coll.renameMode(coll.modes[0].modeId, 'Light');
const modeId = coll.modes.find((m) => /^light$/i.test(m.name)).modeId;
const mine = new Map(all.filter((v) => v.variableCollectionId === coll.id).map((v) => [v.name, v]));
const missing = [];
let created = 0, updated = 0, aliased = 0;
for (const a of ${specVar}) {
  let v = mine.get(a.name);
  if (!v) { v = figma.variables.createVariable(a.name, coll, a.type); created++; mine.set(a.name, v); } else updated++;
  const target = anyByName.get(a.target);
  if (!target) { missing.push(a.name + ' -> ' + a.target); continue; }
  v.setValueForMode(modeId, figma.variables.createVariableAlias(target));
  aliased++;
}
${hasRaw ? `${HEX_TO_RGB}
for (const r of RAWS) {
  let v = mine.get(r.name);
  if (!v) { v = figma.variables.createVariable(r.name, coll, 'COLOR'); created++; }
  v.setValueForMode(modeId, hexToRgb(r.hex));
}` : ''}
return { collection: coll.name, created, updated, aliased, missing };
`;

writeFileSync(`${OUT}/build-02-semantic.js`, `// generated by tokens-to-figma.mjs — run AFTER build-01
const ALIASES = ${JSON.stringify(semAliases)};
const RAWS = ${JSON.stringify(semRaws)};
${ALIAS_APPLY('ALIASES', 'Semantic', true)}`);

writeFileSync(`${OUT}/build-03-component.js`, `// generated by tokens-to-figma.mjs — run AFTER build-02
const ALIASES = ${JSON.stringify(compAliases.filter((a) => a.target))};
const RAWS = ${JSON.stringify(compAliases.filter((a) => a.raw).map((a) => ({ name: a.name, hex: a.raw })))};
${ALIAS_APPLY('ALIASES', 'Component', true)}`);

// Text styles are heavy — createTextStyle rebuilds a preview each time, and
// ~15+ in one exec call hangs the plugin (figmosha2 has no resumption). So this
// is emitted as slices of 5, each its own fig.mjs call.
const TS_BODY = (slice) => `const SPEC = ${JSON.stringify(slice)};
const existing = await figma.getLocalTextStylesAsync();
const byName = new Map(existing.map((s) => [s.name, s]));
const missingFonts = new Set();
let created = 0, updated = 0;
for (const s of SPEC) {
  const fontName = { family: s.mono ? 'Roboto Mono' : s.family, style: s.style };
  try { await figma.loadFontAsync(fontName); }
  catch (e) { missingFonts.add(fontName.family + ' ' + fontName.style); continue; }
  let st = byName.get(s.name);
  if (!st) { st = figma.createTextStyle(); st.name = s.name; created++; } else updated++;
  st.fontName = fontName;
  st.fontSize = s.size;
  st.lineHeight = { unit: 'PERCENT', value: s.lineHeightPct };
  st.letterSpacing = { unit: 'PERCENT', value: s.letterSpacingPct };
  if (s.uppercase) st.textCase = 'UPPER';
}
return { created, updated, names: SPEC.map((s) => s.name), missingFonts: [...missingFonts] };
`;
const tsSlices = [];
for (let i = 0; i < textStyles.length; i += 5) {
  const n = String(i / 5 + 1);
  const file = `build-04-text-styles-${n}.js`;
  writeFileSync(`${OUT}/${file}`, `// generated by tokens-to-figma.mjs — text styles slice ${n} (run each; order doesn't matter)\n${TS_BODY(textStyles.slice(i, i + 5))}`);
  tsSlices.push(file);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  primitives: { colors: colors.length, floats: floats.length },
  semantic: { aliases: semAliases.length, raws: semRaws.length },
  component: { aliases: compAliases.filter((a) => a.target).length, raws: compAliases.filter((a) => a.raw).length },
  textStyles: textStyles.length,
  runOrder: ['build-01-primitives.js', 'build-02-semantic.js', 'build-03-component.js', ...tsSlices],
};
writeFileSync(`${OUT}/build-manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
console.log('migration/ snippets written — run order:');
for (const f of manifest.runOrder) console.log('  ' + f);
