// Fails when a tracked text file holds the long dash (U+2014). Owner,
// 2026-10-04: many readers take it as a sign of machine-written text, so it
// appears nowhere: not in the UI, the data, comments or docs. The rule and
// what to write instead are in CLAUDE.md.
//
// No exclusions: the design system has no applied history to keep.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const DASH = String.fromCharCode(0x2014);

const files = execSync('git ls-files', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => !/\.(png|jpe?g|gif|pdf|woff2?|ttf|otf|ico|webp|mp4)$/i.test(f));

const hits = [];
for (const f of files) {
  let text;
  try {
    text = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  if (!text.includes(DASH)) continue;
  text.split('\n').forEach((line, i) => {
    if (line.includes(DASH)) hits.push(`${f}:${i + 1}: ${line.trim().slice(0, 100)}`);
  });
}

if (hits.length) {
  console.error(`Long dash (U+2014) found in ${hits.length} line(s). Use a comma, colon, full stop, brackets or " - " instead:\n`);
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log('No long dashes.');
