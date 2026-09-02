# scripts/figma

Bridge to the Figma file via **figmosha2** (`C:\Users\Dell\IdeaProjects\figmosha2`).
Used by the `figma-audit` and `figma-safe-edit` skills.

## One-time setup (already done)

- figmosha2 cloned to `C:\Users\Dell\IdeaProjects\figmosha2`
- `bridge.mjs` there is a Node port of `bridge.py` (no Python needed); `npm install` run
- In Figma Desktop: **Plugins → Development → Import plugin from manifest…** →
  `C:\Users\Dell\IdeaProjects\figmosha2\plugin\manifest.json` (once, ever)

## Every session

1. Open the target file in **Figma Desktop** (not the browser).
2. **Plugins → Development → Figmosha Bridge** — leave the little window open.
3. Start the bridge in a terminal:
   ```
   node C:\Users\Dell\IdeaProjects\figmosha2\bridge.mjs
   ```
   Leave it running. The plugin window turns green ("Connected").
4. Smoke test:
   ```
   node scripts/figma/fig.mjs scripts/figma/ping.js
   ```

## fig.mjs

```
node scripts/figma/fig.mjs <snippet.js>
node scripts/figma/fig.mjs <snippet.js> --out audit/raw/thing.json
echo "return figma.currentPage.name" | node scripts/figma/fig.mjs -
```

A snippet is the **body of an async function** and must end with `return <value>`.
`figma`, `print`, and `h` (figmosha helpers) are in scope. `<value>` is printed as
JSON; `print(...)` goes to stderr.

Exit codes: `1` figma error · `2` bridge unreachable · `3` plugin not connected.
