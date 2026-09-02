/**
 * build/typography.css — one utility class per semantic text.* token, built from
 * the var(--font-*) custom properties Style Dictionary emits. This is the common
 * way to consume type; the individual --text-*-font-size props (from the token
 * build) are there when a component needs finer control.
 *
 * Run via `npm run tokens` (after the Style Dictionary build).
 */
import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = process.cwd();
const semantic = JSON.parse(readFileSync(`${ROOT}/tokens/semantic.type.json`, 'utf8'));

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const refToVar = (v) => {
  const m = String(v).match(/^\{(.+)\}$/);
  return m ? `var(--${m[1].split('.').map(kebab).join('-')})` : v;
};

// DTCG composite $value key -> CSS property
const PROP = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
};

const rules = [];
(function walk(node, path) {
  if (node && typeof node === 'object' && '$value' in node && typeof node.$value === 'object') {
    const cls = 'text-' + path.join('-');
    const lines = Object.entries(PROP)
      .filter(([k]) => k in node.$value)
      .map(([k, css]) => `  ${css}: ${refToVar(node.$value[k])};`);
    if (path.at(-1) === 'overline') lines.push('  text-transform: uppercase;');
    rules.push(`.${cls} {\n${lines.join('\n')}\n}`);
    return;
  }
  for (const k of Object.keys(node || {})) {
    if (k.startsWith('$')) continue;
    walk(node[k], [...path, k]);
  }
})(semantic.text, []);

const css = `/**\n * Do not edit directly, this file was auto-generated.\n */\n\n${rules.join('\n\n')}\n`;
writeFileSync(`${ROOT}/build/typography.css`, css);
console.log(`build/typography.css — ${rules.length} text classes`);
