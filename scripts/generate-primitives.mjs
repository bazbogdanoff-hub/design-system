/**
 * Generates tokens/primitives.color.json and tokens/brand.color.json.
 *
 * WHY THIS EXISTS: during the design-system build-out we want the whole Tailwind
 * palette available in Figma and code as raw values to pick from. Once the
 * semantic layer is stable (target: a few months out), prune the unused hues,
 * delete this script + the `tailwindcss` devDependency, and hand-maintain
 * tokens/primitives.color.json directly.
 *
 * Run: npm run gen:primitives
 */
import twColors from 'tailwindcss/colors.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

// The 22 canonical Tailwind v3 hues (deprecated aliases like lightBlue omitted).
const HUES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
  'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
  'fuchsia', 'pink', 'rose',
];
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

// The one blessed primitive->primitive alias. Swap this to re-brand.
const BRAND_HUE = 'indigo';

function write(relPath, obj) {
  const full = `${ROOT}/${relPath}`;
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, JSON.stringify(obj, null, 2) + '\n');
  console.log(`  ${relPath}`);
}

// --- primitives.color.json : raw Tailwind values -------------------------------
const color = {
  $type: 'color',
  white: { $value: '#ffffff' },
  black: { $value: '#000000' },
};
for (const hue of HUES) {
  color[hue] = {};
  for (const step of STEPS) {
    const hex = twColors[hue]?.[step];
    if (!hex) throw new Error(`missing ${hue}.${step} in tailwindcss/colors`);
    color[hue][step] = { $value: hex.toLowerCase() };
  }
}

// --- brand.color.json : brand ramp + product overrides ------------------------
// No $type here on purpose — it's declared once, on the `color` group in
// primitives.color.json, and inherited through the alias chain. A second
// declaration makes Style Dictionary log a token collision.
const brand = { brand: {}, extra: {} };
for (const step of STEPS) {
  brand.brand[step] = { $value: `{color.${BRAND_HUE}.${step}}` };
}
// Product-override primitives — bespoke hexes not on the Tailwind scale.
brand.extra.card = { $value: '#fcfcfc', $description: 'warm near-white card fill — product override' };

console.log('Generating token files:');
write('tokens/primitives.color.json', { color });
write('tokens/brand.color.json', { color: brand });
console.log(`Done — ${HUES.length} hues x ${STEPS.length} steps + white/black, brand -> ${BRAND_HUE}.`);
