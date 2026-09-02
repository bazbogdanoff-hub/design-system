/**
 * Builds preview/index.html — a static swatch sheet for every token in
 * build/tokens.css. Fully self-contained (no fetch), opens from file://.
 *
 * Run: npm run preview   (runs the token build first)
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const css = readFileSync(`${ROOT}/build/tokens.css`, 'utf8');
const typeCss = readFileSync(`${ROOT}/build/typography.css`, 'utf8');
const textClasses = [...typeCss.matchAll(/\.(text-[\w-]+)\s*\{/g)].map((m) => m[1]);
const specimens = textClasses.map((c) => {
  const size = (typeCss.match(new RegExp(`\\.${c}\\s*\\{[^}]*font-size:\\s*var\\(--(font-size-\\d+)\\)`)) || [])[1] || '';
  return `<div class="spec"><span class="${c}">Track shipment #48213 — Rotterdam to Hamburg</span>` +
    `<code class="nm">${c.replace('text-', '')}${size ? ' · ' + size.replace('font-size-', '') + 'px' : ''}</code></div>`;
}).join('');

// --- parse --name: value; and resolve var() chains to a final colour ----------
const raw = {};
for (const m of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) raw[m[1]] = m[2].trim();

const resolve = (name, seen = new Set()) => {
  let v = raw[name];
  if (v == null || seen.has(name)) return v;
  seen.add(name);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  return ref ? resolve(ref[1], seen) : v;
};

const tokens = Object.keys(raw).map((name) => ({
  name,
  css: `--${name}`,
  ref: raw[name],
  value: resolve(name),
  aliased: /^var\(/.test(raw[name]),
}));

// --- bucket -------------------------------------------------------------------
const HUES = ['slate','gray','zinc','neutral','stone','red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose'];
const isPrimitive = (t) => new RegExp(`^color-(${HUES.join('|')}|white|black)(-|$)`).test(t.name);
const isBrand = (t) => /^color-brand-/.test(t.name);
const semanticProp = (t) => (t.name.match(/^color-(background|surface|text|border|icon)-/) || [])[1];
const componentName = (t) => (t.name.match(/^color-(button|card|input|badge|table|modal)-/) || [])[1];

const group = (title, items) => {
  if (!items.length) return '';
  const rows = items.map((t) => {
    const dark = /text|icon|border/.test(t.name);
    return `<div class="sw">
      <div class="chip" style="background:var(${t.css})"></div>
      <div class="meta">
        <code class="nm">${t.name.replace(/^color-/, '')}</code>
        <span class="val">${t.value}${t.aliased ? ` <span class="a">← ${t.ref.replace(/var\(--color-|\)/g, '')}</span>` : ''}</span>
      </div>
    </div>`;
  }).join('');
  return `<h3>${title} <span class="c">${items.length}</span></h3><div class="grid">${rows}</div>`;
};

const primitives = HUES.map((h) =>
  group(h, tokens.filter((t) => new RegExp(`^color-${h}-`).test(t.name)))
).join('');

const semantic = ['background', 'surface', 'text', 'border', 'icon'].map((p) =>
  group(`color.${p}.*`, tokens.filter((t) => semanticProp(t) === p))
).join('');

const components = ['button', 'card', 'input', 'badge', 'table', 'modal'].map((c) =>
  group(`color.${c}.*`, tokens.filter((t) => componentName(t) === c))
).join('');

const radii = tokens.filter((t) => /^radius-/.test(t.name));
const radiusBlock = `<div class="grid">${radii.map((t) => `
  <div class="sw">
    <div class="rbox" style="border-radius:var(${t.css})"></div>
    <div class="meta"><code class="nm">${t.name.replace('radius-', '')}</code><span class="val">${t.value}${t.aliased ? ` <span class="a">← ${t.ref.replace(/var\(--|\)/g, '')}</span>` : ''}</span></div>
  </div>`).join('')}</div>`;

const spaces = tokens.filter((t) => /^space-/.test(t.name));
const spaceBlock = `<div class="spacecol">${spaces.map((t) => `
  <div class="spacerow"><code class="nm">space.${t.name.replace('space-', '')}</code>
    <span class="bar" style="width:var(${t.css})"></span><span class="val">${t.value}</span></div>`).join('')}</div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Design tokens — preview</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap');
${css}
${typeCss}
* { box-sizing: border-box; }
body { margin: 0; font: var(--text-body-md-font-weight) var(--text-body-md-font-size)/var(--text-body-md-line-height) var(--font-family-sans);
  background: var(--color-background-default); color: var(--color-text-default); padding: 40px; }
.spec { display: flex; align-items: baseline; gap: 16px; padding: 8px 0; border-bottom: 1px solid var(--color-border-subtle); }
.spec .nm { margin-left: auto; flex: none; font-size: 11px; color: var(--color-text-muted); font-family: var(--font-family-mono); }
h1 { font-size: 20px; margin: 0 0 4px; }
.sub { color: var(--color-text-muted); margin: 0 0 32px; }
h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .08em; color: var(--color-text-subtle);
  border-bottom: 1px solid var(--color-border-default); padding-bottom: 8px; margin: 40px 0 8px; }
h3 { font-size: 13px; margin: 20px 0 8px; color: var(--color-text-subtle); font-weight: 600; }
h3 .c { color: var(--color-text-muted); font-weight: 400; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 8px; }
.sw { display: flex; gap: 10px; align-items: center; padding: 6px; border: 1px solid var(--color-border-subtle);
  border-radius: 8px; background: var(--color-surface-default); }
.chip { width: 40px; height: 40px; border-radius: 6px; flex: none;
  border: 1px solid var(--color-border-default);
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
  background-size: 12px 12px; background-position: 0 0, 6px 6px; }
.meta { min-width: 0; display: flex; flex-direction: column; }
.nm { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.val { font-size: 11px; color: var(--color-text-muted); }
.a { color: var(--color-text-brand); }
.rbox { width: 56px; height: 56px; flex: none; background: var(--color-background-brand-subtle);
  border: 1.5px solid var(--color-border-brand); border-bottom: none; border-right: none; }
.spacecol { display: flex; flex-direction: column; gap: 4px; }
.spacerow { display: flex; align-items: center; gap: 12px; }
.spacerow .nm { width: 72px; flex: none; }
.spacerow .bar { height: 14px; background: var(--color-background-brand); border-radius: 2px; flex: none; }
.spacerow .val { flex: none; }
</style>
</head>
<body>
<h1>Logistics CRM — design tokens</h1>
<p class="sub">${tokens.filter((t) => t.name.startsWith('color-')).length} colour vars + ${textClasses.length} text styles · generated from <code>build/</code> · Plus Jakarta Sans · neutral = zinc · brand = indigo</p>

<h2>Typography <span style="font-weight:400;text-transform:none;letter-spacing:0">— text.* semantic styles</span></h2>
${specimens}

<h2>Radius <span style="font-weight:400;text-transform:none;letter-spacing:0">— scale · semantic · component</span></h2>
${radiusBlock}

<h2>Spacing <span style="font-weight:400;text-transform:none;letter-spacing:0">— space.* (no semantic tier)</span></h2>
${spaceBlock}

<h2>Semantic <span style="font-weight:400;text-transform:none;letter-spacing:0">— the colour API components use</span></h2>
${semantic}

<h2>Component</h2>
${components}

<h2>Brand ramp</h2>
${group('color.brand.* → indigo', tokens.filter(isBrand))}

<h2>Primitives <span style="font-weight:400;text-transform:none;letter-spacing:0">— full Tailwind palette, prune later</span></h2>
${primitives}
</body>
</html>
`;

mkdirSync(`${ROOT}/preview`, { recursive: true });
writeFileSync(`${ROOT}/preview/index.html`, html);
console.log(`preview/index.html — ${tokens.length} tokens`);
