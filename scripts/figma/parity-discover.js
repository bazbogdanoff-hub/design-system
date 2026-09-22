// Read-only: locate the eleven target component sets across all pages.
await figma.loadAllPagesAsync();

const targets = [
  'card', 'taskcard', 'task card',
  'table', 'tablerow', 'table row', 'tablecell', 'table cell',
  'tableheadercell', 'table header cell',
  'badge', 'severitybadge', 'severity badge',
  'row', 'stack', 'grid', 'modal',
  'button', 'iconbutton', 'icon button',
];
const norm = (s) => s.toLowerCase().replace(/[–—_-]/g, ' ').replace(/\s+/g, ' ').trim();

const out = [];
for (const page of figma.root.children) {
  const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] });
  for (const s of sets) {
    const n = norm(s.name);
    if (!targets.includes(n)) continue;
    let defs = null;
    try {
      defs = Object.entries(s.componentPropertyDefinitions).map(([k, v]) => ({
        prop: k.split('#')[0],
        type: v.type,
        options: v.variantOptions || null,
        def: typeof v.defaultValue === 'boolean' ? v.defaultValue : undefined,
      }));
    } catch (e) { defs = 'ERR: ' + e.message; }
    out.push({
      page: page.name,
      name: s.name,
      id: s.id,
      variants: s.children.length,
      w: Math.round(s.width),
      defs,
    });
  }
  // standalone components with a target name (no variants)
  const singles = page.findAllWithCriteria({ types: ['COMPONENT'] })
    .filter((c) => c.parent && c.parent.type !== 'COMPONENT_SET' && targets.includes(norm(c.name)));
  for (const c of singles) {
    out.push({ page: page.name, name: c.name, id: c.id, variants: 0, standalone: true,
      w: Math.round(c.width), h: Math.round(c.height) });
  }
}
return out;
