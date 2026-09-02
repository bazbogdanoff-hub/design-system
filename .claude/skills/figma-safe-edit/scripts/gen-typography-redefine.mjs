/**
 * migration/typography-map.json + tokens/semantic.type.json
 *   -> migration/redefine-type-{1..N}.js   (slices of ~8)
 *
 * Shim strategy (like the colour repoint): instead of rebinding thousands of
 * text nodes, REDEFINE each old Title/* / paragraph* style in place to match the
 * mapped text/* spec — size, line-height, tracking, family — while keeping the
 * weight from the style's own name suffix. Nodes keep their bindings and render
 * to the new scale. Node-rebind + old-style deletion happens later.
 *
 * Run: node .claude/skills/figma-safe-edit/scripts/gen-typography-redefine.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
const ROOT = process.cwd();
const { byPrefix } = JSON.parse(readFileSync(`${ROOT}/migration/typography-map.json`, 'utf8'));
const type = JSON.parse(readFileSync(`${ROOT}/tokens/semantic.type.json`, 'utf8'));
const prim = JSON.parse(readFileSync(`${ROOT}/tokens/primitives.type.json`, 'utf8'));

// resolve a {ref} against primitives
const P = {};
(function walk(n, p) { if (n && n.$value !== undefined && typeof n.$value !== 'object') { P[p.join('.')] = n.$value; return; } for (const k of Object.keys(n || {})) { if (k[0] === '$') continue; walk(n[k], [...p, k]); } })(prim, []);
const num = (ref) => {
  const m = String(ref).match(/^\{(.+)\}$/); const v = m ? P[m[1]] : ref;
  const mm = String(v).match(/^(-?[\d.]+)(rem|em|px)?$/);
  if (!mm) return Number(v);
  return mm[2] === 'rem' ? +mm[1] * 16 : +mm[1];
};

// flatten text/* -> {size, lhPct, lsPct, mono}
const specs = {};
(function walk(n, p) {
  if (n && n.$value && typeof n.$value === 'object' && 'fontSize' in n.$value) {
    const v = n.$value;
    specs['text/' + p.join('/')] = {
      size: num(v.fontSize),
      lhPct: +(num(v.lineHeight) * 100).toFixed(2),
      lsPct: +(num(v.letterSpacing) * 100).toFixed(2),
      mono: /mono/.test(String(v.fontFamily)),
      upper: p.at(-1) === 'overline',
    };
    return;
  }
  for (const k of Object.keys(n || {})) { if (k[0] === '$') continue; walk(n[k], [...p, k]); }
})(type.text, []);

// Normalise whatever weight string the old style has onto a Plus Jakarta Sans style.
const SNIPPET_HEAD = `const BYPREFIX = ${JSON.stringify(byPrefix)};
const SPECS = ${JSON.stringify(specs)};
const normWeight = (w) => {
  const x = String(w).toLowerCase().replace(/\\s+/g, '');
  if (x.includes('extrabold') || x.includes('black') || x === 'heavy') return 'ExtraBold';
  if (x.includes('semibold') || x === 'demibold') return 'SemiBold';
  if (x.includes('bold')) return 'Bold';
  if (x.includes('extralight') || x.includes('thin')) return 'Light';
  if (x.includes('light')) return 'Light';
  if (x.includes('medium')) return 'Medium';
  return 'Medium'; // regular/normal/book -> Medium (this system's lightest)
};
const styles = await figma.getLocalTextStylesAsync();
const mine = new Set(styles.filter(s => s.name.startsWith('text/')).map(s => s.name));
const targets = styles.filter(s => { const k = Object.keys(BYPREFIX).find(p => s.name.startsWith(p)); return k && !mine.has(s.name); });
`;

const SNIPPET_LOOP = (from, to) => `${SNIPPET_HEAD}
const slice = targets.slice(${from}, ${to});
const missingFonts = new Set(); const out = [];
for (const s of slice) {
  const prefix = Object.keys(BYPREFIX).find(p => s.name.startsWith(p));
  const spec = SPECS[BYPREFIX[prefix]];
  const suffix = s.name.split('/').pop();
  const style = spec.mono ? 'Medium' : normWeight(/table header|badge|caption/i.test(suffix) ? (typeof s.fontName === 'object' ? s.fontName.style : 'SemiBold') : suffix);
  const fontName = { family: spec.mono ? 'Roboto Mono' : 'Plus Jakarta Sans', style };
  try { await figma.loadFontAsync(fontName); } catch (e) { missingFonts.add(fontName.family + ' ' + fontName.style + ' <- ' + s.name); continue; }
  s.fontName = fontName;
  s.fontSize = spec.size;
  s.lineHeight = { unit: 'PERCENT', value: spec.lhPct };
  s.letterSpacing = { unit: 'PERCENT', value: spec.lsPct };
  if (spec.upper) s.textCase = 'UPPER';
  out.push(s.name + ' -> ' + BYPREFIX[prefix] + ' (' + spec.size + '/' + style + ')');
}
return { redefined: out.length, out, missingFonts: [...missingFonts], totalTargets: targets.length };
`;

// we don't know target count until runtime; emit 10 slice files of 8 (covers up to 80 styles)
const runOrder = [];
for (let i = 0; i < 10; i++) {
  const f = `redefine-type-${i + 1}.js`;
  writeFileSync(`${ROOT}/migration/${f}`, SNIPPET_LOOP(i * 8, i * 8 + 8));
  runOrder.push(f);
}
console.log(`migration/redefine-type-{1..10}.js (slices of 8). Run in order; stop when redefined:0.`);
console.log('specs:', Object.keys(specs).join(', '));
