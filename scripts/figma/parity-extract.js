// Read-only variant/geometry/type extractor. Prepend `const TARGET = "<id>";`.
const node = await figma.getNodeByIdAsync(TARGET);
if (!node) return { error: 'not found: ' + TARGET };

const styleName = async (id) => {
  if (!id || typeof id !== 'string') return null;
  try { const s = await figma.getStyleByIdAsync(id); return s ? s.name : null; } catch { return null; }
};
const varName = async (id) => {
  if (!id) return null;
  try { const v = await figma.getVariableByIdAsync(id); return v ? v.name : null; } catch { return null; }
};
const num = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : (typeof v === 'symbol' ? 'MIXED' : v));

async function boundVars(n) {
  const b = n.boundVariables || {};
  const out = {};
  for (const k of Object.keys(b)) {
    if (k === 'fills' || k === 'strokes' || k === 'effects' || k === 'componentProperties') continue;
    const entry = b[k];
    const one = Array.isArray(entry) ? entry[0] : entry;
    if (one && one.id) { const nm = await varName(one.id); if (nm) out[k] = nm; }
  }
  return Object.keys(out).length ? out : null;
}

async function geom(n) {
  const g = {
    name: n.name, type: n.type,
    w: num(n.width), h: num(n.height),
  };
  if ('layoutMode' in n && n.layoutMode !== 'NONE') {
    g.layout = n.layoutMode;
    g.pad = [num(n.paddingTop), num(n.paddingRight), num(n.paddingBottom), num(n.paddingLeft)].join('/');
    g.gap = num(n.itemSpacing);
    g.align = (n.primaryAxisAlignItems || '') + ':' + (n.counterAxisAlignItems || '');
    if (n.layoutSizingHorizontal) g.sizing = n.layoutSizingHorizontal + '/' + n.layoutSizingVertical;
  }
  if ('cornerRadius' in n && n.cornerRadius !== 0) g.radius = num(n.cornerRadius);
  if ('strokeWeight' in n && n.strokes && n.strokes.length) {
    g.stroke = num(n.strokeWeight) + 'px';
    if ('strokeTopWeight' in n) {
      g.strokeSides = [num(n.strokeTopWeight), num(n.strokeRightWeight),
                       num(n.strokeBottomWeight), num(n.strokeLeftWeight)].join('/');
    }
    if ('strokesIncludedInLayout' in n) g.strokeInLayout = n.strokesIncludedInLayout;
  }
  if (n.effects && n.effects.length) {
    g.effects = n.effects.filter(e => e.visible !== false).map(e =>
      `${e.type}:${num(e.offset ? e.offset.x : 0)}/${num(e.offset ? e.offset.y : 0)} b${num(e.radius)} s${num(e.spread || 0)}`);
  }
  const bv = await boundVars(n);
  if (bv) g.vars = bv;
  if (n.type === 'TEXT') {
    g.text = typeof n.characters === 'string' ? n.characters.slice(0, 24) : 'MIXED';
    g.fontSize = num(n.fontSize);
    g.fontWeight = typeof n.fontWeight === 'number' ? n.fontWeight : 'MIXED';
    g.lineHeight = n.lineHeight && typeof n.lineHeight.value === 'number'
      ? n.lineHeight.unit + ':' + num(n.lineHeight.value) : String(n.lineHeight && n.lineHeight.unit);
    g.style = await styleName(n.textStyleId);
    if ('leadingTrim' in n) g.leadingTrim = n.leadingTrim;
    g.truncation = n.textTruncation;
    g.maxLines = n.maxLines;
    g.autoResize = n.textAutoResize;
  }
  return g;
}

// walk a variant to DEPTH, recording geometry of frames/text (skip deep icon guts)
async function walk(n, depth, acc, prefix) {
  const g = await geom(n);
  acc.push({ d: depth, path: prefix, ...g });
  if (depth >= 3) return;
  if (n.type === 'INSTANCE' && depth >= 1) return;
  if (!('children' in n)) return;
  for (const c of n.children) {
    if (c.visible === false) continue;
    await walk(c, depth + 1, acc, prefix + '/' + c.name);
  }
}

const variants = node.type === 'COMPONENT_SET' ? node.children : [node];
const result = { id: node.id, name: node.name, type: node.type, variantCount: variants.length, variants: [] };
for (const v of variants) {
  const acc = [];
  await walk(v, 0, acc, v.name);
  result.variants.push({ variant: v.name, nodes: acc });
}
return result;
