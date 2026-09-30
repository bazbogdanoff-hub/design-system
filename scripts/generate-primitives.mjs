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
brand.extra.card = {
  $value: '#f6f6f8',
  $description:
    'cool near-white card fill — product override (owner, 2026-09-29: #f6f7f8 → #f6f6f8, tuned by eye to the most contrast for white items before it reads grey; was #fcfcfc before 2026-09-28)',
};
// The card moved down a step, so the surfaces keyed to it move with it and
// keep the steps they had against #fcfcfc (owner, 2026-09-28).
brand.extra.recessed = {
  $value: '#eeeff1',
  $description:
    'recessed zone inside a card — table header band, scroll tray. ≈ 2.8 L* below the card fill, the step zinc.100 had against the old #fcfcfc card',
};
// Card-looking things that sit ON a card (StatButton, secondary Button and
// everything built on it) keep the old lighter fill, so they read as raised
// above the card, with the vignette that was tuned for that fill.
// (Not "raised": surface.raised already exists — white, for popovers.)
brand.extra['card-item'] = {
  $value: '#fcfcfc',
  $description: 'fill of a card-like element sitting on a card — one step lighter than the card (the pre-2026-09-28 card fill)',
};
brand.extra['card-item-vignette'] = {
  $value: '#f0f0f0',
  $description: 'glass inner-shadow colour for card items — the original vignette, tuned for the #fcfcfc fill',
};
// The white task tile's own glass (owner, 2026-09-29) — flat white alone did
// not hold on the card. Alpha is part of the colour: 30% and 60%.
brand.extra['tile-shadow'] = {
  $value: '#e4e4e84d',
  $description: 'TaskTile drop shadow colour — #e4e4e8 at 30%',
};
// The severity chart's 'attention' step (owner, 2026-09-29). Off the Tailwind
// scale on purpose: amber/yellow .500 sit too light for the chart band on
// the card and .600 fall into orange for deutan readers; this is the one
// step the dataviz validator passes beside orange.600 and emerald.600.
brand.extra['chart-attention'] = {
  $value: '#f0b90b',
  $description: 'severity chart — attention, one step lighter (owner, 2026-09-29 trial) beside rose.600 / orange.500 / emerald.500: passes the CVD and normal-vision checks, sits just above the chart lightness band (L 0.81) so relies on the legend and tooltips. The fully validated darker set was #e0a800 with rose.700 / orange.600 / emerald.600',
};
brand.extra['tile-lift-shadow'] = {
  $value: '#18181b1f',
  $description: 'TaskTile hover lift — zinc 900 at 12%, dark enough to read as height on the #f6f6f8 card (owner, 2026-09-29)',
};
brand.extra['tile-inner-shadow'] = {
  $value: '#f0f0f099',
  $description: 'TaskTile inner shadow colour — #f0f0f0 at 60%',
};
brand.extra.vignette = {
  $value: '#eaebed',
  $description:
    "glass inner-shadow colour on card-filled surfaces. Was a raw #f0f0f0 in each component's CSS; darkened with the card so the edges keep their depth",
};

console.log('Generating token files:');
write('tokens/primitives.color.json', { color });
write('tokens/brand.color.json', { color: brand });
console.log(`Done — ${HUES.length} hues x ${STEPS.length} steps + white/black, brand -> ${BRAND_HUE}.`);
