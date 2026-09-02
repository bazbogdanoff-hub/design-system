/**
 * figma-audit · phase 5 — cross-check the raw Figma dumps against
 * design-system-conventions and emit audit/findings.json + audit/report.md.
 *
 * Reads:
 *   audit/raw/overview.json
 *   audit/raw/variables.json
 *   audit/raw/styles.json
 *   audit/raw/components.json
 *   audit/raw/usage-*.json
 *   tokens/*.json                 (the target token set)
 * Preserves `status` and edited `proposed` from an existing audit/findings.json
 * (matched on id = hash(target.id + category)).
 *
 * Run:  node .claude/skills/figma-audit/scripts/audit-report.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';

const ROOT = process.cwd();
const RAW = `${ROOT}/audit/raw`;
const OUT_JSON = `${ROOT}/audit/findings.json`;
const OUT_MD = `${ROOT}/audit/report.md`;

// ---------- helpers ----------------------------------------------------------
const readJSON = (p) => JSON.parse(readFileSync(p, 'utf8'));
const readJSONMaybe = (p) => (existsSync(p) ? readJSON(p) : null);
const hex6 = (h) => {
  if (!h || typeof h !== 'string' || h[0] !== '#') return null;
  let s = h.slice(1).toLowerCase();
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  return '#' + s.slice(0, 6);
};
const djb2 = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
};
const fid = (prefix, targetId, category) => `${prefix}-${djb2(`${targetId}:${category}`).slice(0, 6)}`;

// ---------- target model from tokens/ --------------------------------------
function loadExpected() {
  const merged = { color: {} };
  const files = readdirSync(`${ROOT}/tokens`).filter((f) => f.endsWith('.json'));
  for (const f of files) deepMerge(merged, readJSON(`${ROOT}/tokens/${f}`));

  const flat = {}; // canonical path -> raw $value
  (function walk(node, path) {
    if (node && typeof node === 'object' && '$value' in node) { flat[path.join('.')] = node.$value; return; }
    for (const k of Object.keys(node || {})) {
      if (k.startsWith('$')) continue;
      walk(node[k], [...path, k]);
    }
  })(merged, []);

  const resolve = (v, seen = new Set()) => {
    const m = typeof v === 'string' && v.match(/^\{(.+)\}$/);
    if (!m) return typeof v === 'string' ? v : null;
    if (seen.has(m[1]) || !(m[1] in flat)) return null;
    seen.add(m[1]);
    return resolve(flat[m[1]], seen);
  };

  const byPath = {};       // canonical path -> resolved hex/value
  const byHex = {};        // hex -> [canonical paths]
  const referencedPrimitives = new Set();
  for (const [p, raw] of Object.entries(flat)) {
    const val = resolve(raw);
    byPath[p] = val;
    const h = hex6(val);
    if (h) (byHex[h] ||= []).push(p);
    // any {color.<hue>.<step>} reference — including the brand ramp's
    // {color.indigo.N} — keeps that hue alive
    const m = typeof raw === 'string' && raw.match(/\{(color\.[a-z]+\.\d+)\}/);
    if (m) referencedPrimitives.add(m[1]);
  }
  const semanticPaths = new Set(Object.keys(byPath).filter((p) => /^color\.(background|surface|text|border|icon)\./.test(p)));
  const componentPaths = new Set(Object.keys(byPath).filter((p) => /^color\.(button|card|input|badge|table|modal)\./.test(p)));
  return { byPath, byHex, semanticPaths, componentPaths, referencedPrimitives };
}
function deepMerge(a, b) {
  for (const k of Object.keys(b)) {
    if (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k])) { a[k] ||= {}; deepMerge(a[k], b[k]); }
    else a[k] = b[k];
  }
  return a;
}

// ---------- naming normalisation ------------------------------------------
const HUES = ['slate','gray','zinc','neutral','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'];
const isPrimitivePath = (p) => new RegExp(`^color\\.(${HUES.join('|')}|brand|white|black)(\\.|$)`).test(p);
const figmaToCanonical = (name) => {
  let s = name.trim().replaceAll('/', '.').replace(/\s+/g, '');
  if (!s.startsWith('color.')) s = 'color.' + s.replace(/^color\.?/, '');
  return s;
};
const SYN = {
  bg: 'background', background: 'background', surface: 'surface', fill: 'background',
  fg: 'text', foreground: 'text', content: 'text', label: 'text', copy: 'text',
  stroke: 'border', outline: 'border', divider: 'border', border: 'border',
  icon: 'icon', glyph: 'icon',
  primary: 'brand', accent: 'brand', brand: 'brand',
  error: 'danger', negative: 'danger', critical: 'danger', danger: 'danger', destructive: 'danger',
  positive: 'success', success: 'success', ok: 'success',
  caution: 'warning', warn: 'warning', warning: 'warning',
  informational: 'info', info: 'info',
  muted: 'muted', subtle: 'subtle', subdued: 'subtle', tertiary: 'muted', secondary: 'subtle',
  strong: 'strong', bold: 'strong', emphasis: 'emphasis', inverse: 'emphasis',
  hover: 'hover', active: 'active', pressed: 'active', focus: 'focus', disabled: 'disabled', selected: 'selected',
  default: 'default', base: 'default', rest: 'default',
};
function proposeCanonical(figmaName, expectedSet) {
  const canon = figmaToCanonical(figmaName);
  if (expectedSet.has(canon)) return { proposed: canon, exact: true };
  const segs = canon.split('.').slice(1); // drop leading "color"
  const mapped = segs.map((s) => SYN[s.toLowerCase()] ?? s.toLowerCase());
  for (const cand of [
    'color.' + mapped.join('.'),
    'color.' + mapped.join('.') + '.default',
    'color.' + mapped.slice(0, -1).join('.') + '-' + mapped.at(-1), // role+prominence compound
  ]) {
    if (expectedSet.has(cand)) return { proposed: cand, exact: false };
  }
  return null;
}

// ---------- load raw -------------------------------------------------------
const overview = readJSONMaybe(`${RAW}/overview.json`) || {};
const variablesDump = readJSONMaybe(`${RAW}/variables.json`) || { collections: [], variables: [] };
const stylesDump = readJSONMaybe(`${RAW}/styles.json`) || { paint: [], text: [], effect: [] };
const componentsDump = readJSONMaybe(`${RAW}/components.json`) || { components: [] };
const usageFiles = existsSync(RAW) ? readdirSync(RAW).filter((f) => /^usage-.*\.json$/.test(f)) : [];
const usageRows = usageFiles.flatMap((f) => (readJSON(`${RAW}/${f}`).rows || []).map((r) => ({ ...r, _file: f })));

const expected = loadExpected();
const prior = readJSONMaybe(OUT_JSON);
const priorById = Object.fromEntries((prior?.findings || []).map((f) => [f.id, f]));

// ---------- build findings ----------------------------------------------
const findings = [];
const add = (prefix, category, severity, target, current, proposed, rationale, action) => {
  const id = fid(prefix, target.id, category);
  const p = priorById[id];
  findings.push({
    id, category, severity, target, current,
    proposed: p?.proposed ?? proposed,
    rationale, action,
    status: p?.status ?? 'proposed',
  });
};

// collection role heuristic
const collName = Object.fromEntries(variablesDump.collections.map((c) => [c.id, c.name]));
const collRole = {}; // collectionId -> 'primitive' | 'semantic' | 'component' | 'mixed'
for (const c of variablesDump.collections) {
  const kinds = new Set();
  for (const v of variablesDump.variables.filter((v) => v.collectionId === c.id)) {
    const p = figmaToCanonical(v.name);
    if (isPrimitivePath(p)) kinds.add('primitive');
    else if (/^color\.(button|card|input|badge|table|modal)\./.test(p)) kinds.add('component');
    else kinds.add('semantic');
  }
  collRole[c.id] = kinds.size > 1 ? 'mixed' : [...kinds][0] || 'semantic';
}

// --- collection structure ---
for (const c of variablesDump.collections) {
  if (collRole[c.id] === 'mixed')
    add('STRUCT', 'collection-structure', 'high', { kind: 'collection', id: c.id, name: c.name },
      c.name, 'split into Primitives / Semantic / Component',
      'one collection mixes primitive and semantic/component variables — they need separate collections to theme', 'manual-review');
  if (collRole[c.id] !== 'primitive' && !c.modes.some((m) => /light/i.test(m)))
    add('STRUCT', 'collection-structure', 'medium', { kind: 'collection', id: c.id, name: c.name },
      `modes: ${c.modes.join(', ')}`, 'add a "Light" mode',
      'semantic/component collection has no Light mode — conventions expect Light now, Dark later', 'manual-review');
  if (collRole[c.id] === 'primitive' && c.modes.length > 1)
    add('STRUCT', 'collection-structure', 'medium', { kind: 'collection', id: c.id, name: c.name },
      `modes: ${c.modes.join(', ')}`, 'one mode', 'primitives collection should have a single mode', 'manual-review');
}

// --- variables: naming, raw values ---
for (const v of variablesDump.variables) {
  const canon = figmaToCanonical(v.name);
  const role = collRole[v.collectionId];
  const target = { kind: 'variable', id: v.id, name: v.name, collection: v.collection };

  if (role === 'primitive') {
    // primitive naming: color.<hue>.<step>  (or color.brand.<step>)
    if (!isPrimitivePath(canon))
      add('VAR', 'variable-naming', 'medium', target, v.name, null,
        'variable in the primitives collection is not named color/<hue>/<step>', 'manual-review');
    continue;
  }

  // a primitive-named variable living outside the primitives collection
  if (isPrimitivePath(canon)) {
    add('VAR', 'collection-structure', 'high', target, `${v.name} (in ${v.collection})`,
      'move to the Primitives collection', 'a primitive is sitting in a semantic/component collection', 'manual-review');
    continue;
  }

  const expSet = role === 'component' ? expected.componentPaths : expected.semanticPaths;
  const guess = proposeCanonical(v.name, expSet);
  if (!guess) {
    add('VAR', 'variable-off-catalog', 'medium', target, v.name, null,
      'name maps to nothing in the approved catalogue — decide if it should exist', 'manual-review');
  } else if (!guess.exact) {
    add('VAR', 'variable-naming', 'medium', target, v.name, guess.proposed.replaceAll('.', '/'),
      `rename to the catalogue grammar (${guess.proposed})`, 'rename');
  }

  // raw hex where an alias is expected
  for (const [mode, val] of Object.entries(v.modes || {})) {
    if (val && 'hex' in val) {
      const h = hex6(val.hex);
      const primMatch = h && Object.entries(expected.byPath).find(([p, x]) => isPrimitivePath(p) && hex6(x) === h);
      add('VAR', 'variable-raw-value', 'high', { ...target, id: `${v.id}:${mode}`, mode }, `${mode}: ${val.hex}`,
        primMatch ? `alias → ${primMatch[0].replaceAll('.', '/')}` : 'alias → (no primitive matches this hex)',
        `${role} variable holds a raw colour in mode "${mode}" — every semantic/component variable must be an alias`,
        primMatch ? 'rebind' : 'manual-review');
    }
  }
}

// --- unused primitives ---
for (const hue of HUES) {
  const usedBySemantic = [...expected.referencedPrimitives].some((p) => p.startsWith(`color.${hue}.`));
  const usedInFigma = usageRows.some((r) => r.binding === `variable:color/${hue}` || String(r.binding).startsWith(`variable:color/${hue}/`));
  if (!usedBySemantic && !usedInFigma)
    add('PRIM', 'unused-primitive', 'low', { kind: 'hue', id: `hue:${hue}`, name: hue },
      hue, 'delete from Primitives collection', 'no semantic token or node references this Tailwind hue', 'delete');
}

// --- styles ---
for (const s of stylesDump.paint || []) {
  const h = hex6(s.paints?.[0]?.hex);
  const match = h && expected.byHex[h]?.[0];
  add('STY', 'style-not-variable', 'medium', { kind: 'style', id: s.id, name: s.name },
    s.name, match ? match.replaceAll('.', '/') : 'a variable in the Semantic collection',
    'this system is variable-based — local paint styles should become variables', 'convert-style-to-variable');
}

// --- components: naming + variants ---
const goodComponentName = (n) => /^([A-Z][A-Za-z0-9]*)(\/[A-Z][A-Za-z0-9]*)*$/.test(n);
for (const c of componentsDump.components || []) {
  const target = { kind: 'component', id: c.id, name: c.name, page: c.page };
  if (!goodComponentName(c.name)) {
    const fixed = c.name.trim().split('/').map((seg) =>
      seg.replace(/[_-]+/g, ' ').replace(/\s+(.)/g, (_, x) => x.toUpperCase()).replace(/^(.)/, (_, x) => x.toUpperCase()).replace(/\s/g, '')
    ).join('/');
    add('COMP', 'component-naming', 'medium', target, c.name, fixed,
      'component name must be PascalCase, optionally Category/Component', 'rename');
  }
  for (const [prop, def] of Object.entries(c.properties || {})) {
    const base = prop.replace(/#\d+$/, '');
    if (base !== base.toLowerCase()) {
      const norm = { type: 'variant', style: 'variant', kind: 'variant' }[base.toLowerCase()] ?? base.toLowerCase();
      add('COMP', 'variant-naming', 'medium', { ...target, id: `${c.id}:${prop}` }, `${prop}`, norm,
        'variant property names are lowercase (and "type"/"style" → "variant")', 'rename');
    }
    for (const opt of def?.variantOptions || []) {
      if (opt !== opt.toLowerCase().replace(/\s+/g, '-'))
        add('COMP', 'variant-naming', 'low', { ...target, id: `${c.id}:${prop}:${opt}` }, `${prop}=${opt}`,
          opt.toLowerCase().replace(/\s+/g, '-'), 'variant values are lowercase-kebab', 'rename');
    }
  }
}

// --- usage: primitive-direct-use, raw, off-palette ---
for (const r of usageRows) {
  const target = { kind: 'node', id: r.nodeId, name: r.node, page: r._file.replace(/^usage-|\.json$/g, ''), channel: r.channel };
  if (String(r.binding).startsWith('variable:')) {
    const canon = figmaToCanonical(r.binding.slice('variable:'.length));
    if (isPrimitivePath(canon)) {
      const h = hex6(r.hex);
      const semMatch = h && (expected.byHex[h] || []).find((p) => expected.semanticPaths.has(p));
      add('USE', 'component-binding', 'high', target, r.binding,
        semMatch ? `variable:${semMatch.replaceAll('.', '/')}` : 'a semantic token',
        'node is bound to a primitive — must go through a semantic (or component) token', semMatch ? 'rebind' : 'manual-review');
    }
    continue;
  }
  if (r.binding === 'raw') {
    const h = hex6(r.hex);
    const exactSem = h && (expected.byHex[h] || []).find((p) => expected.semanticPaths.has(p));
    const isPalette = h && Object.entries(expected.byPath).some(([p, x]) => isPrimitivePath(p) && hex6(x) === h);
    if (exactSem)
      add('USE', 'raw-color', 'medium', target, r.hex, `variable:${exactSem.replaceAll('.', '/')}`,
        `raw fill matches ${exactSem} exactly — bind it`, 'create-and-bind');
    else if (isPalette)
      add('USE', 'raw-color', 'medium', target, r.hex, 'a semantic token (hex is on the palette but ambiguous)',
        'raw fill uses a palette colour directly — pick the semantic token that expresses the intent', 'manual-review');
    else
      add('USE', 'off-palette-color', 'low', target, r.hex, 'palette colour or a product-override token',
        'raw fill is not on the Tailwind palette — a mistake, or one of the planned 2–3 product overrides', 'manual-review');
  }
}

// ---------- write --------------------------------------------------------
const byCategory = {};
for (const f of findings) byCategory[f.category] = (byCategory[f.category] || 0) + 1;
const sevRank = { high: 0, medium: 1, low: 2 };
findings.sort((a, b) => sevRank[a.severity] - sevRank[b.severity] || a.category.localeCompare(b.category) || a.id.localeCompare(b.id));

const out = {
  generatedAt: new Date().toISOString(),
  figmaFile: overview.file ? { name: overview.file } : {},
  summary: {
    variables: variablesDump.variables.length,
    components: (componentsDump.components || []).length,
    nodesScanned: usageRows.length,
    findings: findings.length,
    byCategory,
  },
  findings,
};
mkdirSync(`${ROOT}/audit`, { recursive: true });
writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + '\n');

// report.md
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
let md = `# Figma audit report\n\n`;
md += `${out.generatedAt} · file: ${out.figmaFile.name ?? '(unknown)'}\n\n`;
md += `**${findings.length} findings** — ${Object.entries(byCategory).map(([k, v]) => `${k}: ${v}`).join(' · ')}\n\n`;
md += `${variablesDump.variables.length} variables · ${(componentsDump.components || []).length} components · ${usageRows.length} coloured nodes scanned\n\n`;
md += `Triage: edit \`proposed\` / \`action\` in \`audit/findings.json\`, set \`status\` to \`approved\` / \`skip\` / \`manual\`. Then run figma-safe-edit.\n\n`;
for (const sev of ['high', 'medium', 'low']) {
  const group = findings.filter((f) => f.severity === sev);
  if (!group.length) continue;
  md += `## ${sev} (${group.length})\n\n`;
  md += `| id | category | current | → proposed | action | status |\n|---|---|---|---|---|---|\n`;
  for (const f of group) {
    const t = f.target.name || f.target.id;
    md += `| ${f.id} | ${f.category} | ${esc(t)} — ${esc(f.current)} | ${esc(f.proposed)} | ${f.action} | ${f.status} |\n`;
  }
  md += `\n`;
}
writeFileSync(OUT_MD, md);

console.log(`${findings.length} findings → audit/findings.json, audit/report.md`);
for (const [k, v] of Object.entries(byCategory)) console.log(`  ${k}: ${v}`);
