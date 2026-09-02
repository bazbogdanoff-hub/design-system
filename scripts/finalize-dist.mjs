/**
 * After `vite build`: normalise the emitted component CSS to dist/styles.css
 * (it already includes the token bundle, since src/index.ts imports src/styles.css).
 */
import { readdirSync, renameSync, existsSync } from 'node:fs';
const dist = `${process.cwd()}/dist`;
const css = readdirSync(dist).filter((f) => f.endsWith('.css') && f !== 'styles.css');
if (css.length === 1) {
  renameSync(`${dist}/${css[0]}`, `${dist}/styles.css`);
  console.log(`dist/${css[0]} -> dist/styles.css`);
} else if (existsSync(`${dist}/styles.css`)) {
  console.log('dist/styles.css already in place');
} else {
  console.warn(`finalize-dist: expected 1 css file, found ${css.length}: ${css.join(', ')}`);
}
