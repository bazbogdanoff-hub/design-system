/**
 * audit/findings.json  ->  migration/batches.json + migration/plan.md
 *
 * Takes findings with status:"approved" and orders them into the 9 dependency-safe
 * batches (see figma-safe-edit/SKILL.md). Run after triage:
 *   node .claude/skills/figma-safe-edit/scripts/plan.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const ROOT = process.cwd();
const src = `${ROOT}/audit/findings.json`;
if (!existsSync(src)) { console.error('no audit/findings.json — run figma-audit first'); process.exit(1); }
const { findings = [] } = JSON.parse(readFileSync(src, 'utf8'));
mkdirSync(`${ROOT}/migration`, { recursive: true });

const approved = findings.filter((f) => f.status === 'approved');

// category (+ tier) -> batch number
const HUES = /^(color\/(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|brand))\//;
const tierOf = (f) => {
  const n = (f.current || f.proposed || '').replace(/\./g, '/');
  if (HUES.test(n) || /^(radius|space|font)\/(none|xs|sm|md|lg|xl|\dxl|full|\d+|family|size|weight|lineHeight|letterSpacing)/.test(n)) return 'primitive';
  if (/^color\/(button|card|input|badge|table|modal)\//.test(n) || /^radius\/(card|modal|table|popover|button|input|badge)$/.test(n)) return 'component';
  return 'semantic';
};
function batchOf(f) {
  switch (f.category) {
    case 'collection-structure': return 1;
    case 'variable-naming': return { primitive: 2, semantic: 3, component: 4 }[tierOf(f)];
    case 'variable-off-catalog': return 3;
    case 'variable-raw-value': return tierOf(f) === 'component' ? 4 : 3;
    case 'component-binding': return 5;
    case 'raw-color': return 6;
    case 'component-naming': return 7;
    case 'variant-naming': return 7;
    case 'style-not-variable': return 8;
    case 'duplicate': return 9;      // treated as merge
    case 'unused-primitive': return 9;
    case 'off-palette-color': return 9;
    default: return 9;
  }
}
const BATCH_NAME = {
  1: 'collections & modes', 2: 'primitive variables', 3: 'semantic variables',
  4: 'component variables', 5: 'repoint nodes off primitives', 6: 'bind loose fills',
  7: 'component & variant names', 8: 'styles → variables', 9: 'merges & deletes',
};

// enrich each finding with the fields the operation recipes expect
function op(f) {
  const o = { findingId: f.id, category: f.category, action: f.action, targetId: f.target.id, proposed: f.proposed };
  if (f.target.mode) o.mode = f.target.mode;
  if (f.target.channel) o.channel = f.target.channel;
  const alias = /(?:alias → |variable:)([\w/]+)/.exec(f.proposed || '');
  if (alias) o.aliasTargetName = o.newVarName = alias[1];
  if (typeof f.target.index === 'number') o.index = f.target.index;
  return o;
}

const batches = {};
for (const f of approved) {
  const b = batchOf(f);
  (batches[b] ||= { no: b, name: BATCH_NAME[b], gated: b === 5 || b === 9, ops: [] }).ops.push(op(f));
}
const ordered = Object.values(batches).sort((a, b) => a.no - b.no);

writeFileSync(`${ROOT}/migration/batches.json`, JSON.stringify({
  generatedAt: new Date().toISOString(),
  approved: approved.length, skipped: findings.length - approved.length,
  batches: ordered,
}, null, 2) + '\n');

let md = `# Migration plan\n\n${new Date().toISOString()}\n\n`;
md += `${approved.length} approved · ${findings.length - approved.length} not approved (skipped)\n\n`;
md += `Run batches in order. Checkpoint (\`saveVersionHistoryAsync\`) before each. Gated batches wait for your go.\n\n`;
for (const b of ordered) {
  md += `## Batch ${b.no} — ${b.name}${b.gated ? '  ⚠ gated' : ''} (${b.ops.length})\n\n`;
  md += `| finding | action | target | → |\n|---|---|---|---|\n`;
  for (const o of b.ops) md += `| ${o.findingId} | ${o.action} | ${o.targetId} | ${o.proposed ?? ''} |\n`;
  md += `\n`;
}
if (!ordered.length) md += `_Nothing approved yet — set \`status: "approved"\` on findings in audit/findings.json._\n`;
writeFileSync(`${ROOT}/migration/plan.md`, md);

console.log(`${approved.length} approved → ${ordered.length} batches → migration/plan.md, migration/batches.json`);
for (const b of ordered) console.log(`  batch ${b.no} ${b.name}: ${b.ops.length}${b.gated ? ' (gated)' : ''}`);
