// Smoke test — confirms the bridge + plugin + Figma are wired up.
// node scripts/figma/fig.mjs scripts/figma/ping.js
await figma.loadAllPagesAsync();
return {
  file: figma.root.name,
  currentPage: figma.currentPage.name,
  pages: figma.root.children.map((p) => ({ name: p.name, children: p.children.length })),
  collections: (await figma.variables.getLocalVariableCollectionsAsync()).map((c) => c.name),
};
