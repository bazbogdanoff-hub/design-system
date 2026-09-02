#!/usr/bin/env node
/**
 * fig.mjs — send one Figma Plugin API snippet to the figmosha2 bridge and print
 * the result as JSON. The figma-audit and figma-safe-edit skills both use this.
 *
 *   node scripts/figma/fig.mjs snippet.js
 *   node scripts/figma/fig.mjs snippet.js --out audit/raw/variables.json
 *   echo "return figma.currentPage.name" | node scripts/figma/fig.mjs -
 *
 * The snippet is the BODY of an async function (the plugin wraps it as
 * `return (async () => { <snippet> })()`), so it MUST end with `return <value>`.
 * <value> is JSON-serialised to stdout (or --out). print(...) → stderr.
 * Exit codes: 1 figma error · 2 bridge unreachable · 3 plugin not connected.
 *
 * Bridge URL: $FIGMOSHA_URL (default http://127.0.0.1:8787).
 * Start the bridge first:  cd <figmosha2 clone> && node bridge.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = process.env.FIGMOSHA_URL || 'http://127.0.0.1:8787';
const timeout = Number(process.env.FIGMOSHA_TIMEOUT || 120);

const args = process.argv.slice(2);
let outPath = null;
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--out') outPath = args[++i];
  else positional.push(args[i]);
}
const src = positional[0];
if (!src) {
  console.error('usage: fig.mjs <snippet.js | -> [--out <file>]');
  process.exit(64);
}
const code = src === '-' ? readFileSync(0, 'utf8') : readFileSync(src, 'utf8');

let resp;
try {
  resp = await fetch(`${BASE}/exec`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ code, timeout }),
  });
} catch (e) {
  console.error(`bridge unreachable at ${BASE}`);
  console.error('start it:  cd <figmosha2 clone> && node bridge.mjs        (' + e.message + ')');
  process.exit(2);
}

const data = await resp.json().catch(() => ({}));

if (resp.status === 503) {
  console.error('plugin not connected — in Figma Desktop: Plugins → Development → Figmosha Bridge');
  process.exit(3);
}
if (!data.ok) {
  console.error(`figma error: ${data.error || 'HTTP ' + resp.status}`);
  if (data.hint) console.error(`hint: ${data.hint}`);
  if (data.stack) console.error(String(data.stack).split('\n').slice(0, 4).join('\n'));
  process.stdout.write(JSON.stringify({ error: data.error || `HTTP ${resp.status}` }) + '\n');
  process.exit(1);
}

for (const line of data.logs || []) console.error(`[print] ${line}`);
const json = JSON.stringify(data.value ?? null, null, outPath ? 2 : 0);
if (outPath) {
  writeFileSync(outPath, json + '\n');
  console.error(`→ ${outPath}  (${json.length} bytes, ${data.elapsed_ms}ms)`);
} else {
  process.stdout.write(json + '\n');
}
