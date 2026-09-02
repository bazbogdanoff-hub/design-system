/**
 * DTCG token files in tokens/  ->  build/ (CSS custom properties + JS/TS).
 *
 *   primitives.color.json / brand.color.json   raw values (generated)
 *   semantic.color.json / component.color.json  aliases (hand-written)
 *   primitives.type.json                        font primitives
 *   semantic.type.json                          composite text.* styles
 *
 * `expand` splits the composite typography tokens (text.body.md) into individual
 * sub-props (--text-body-md-font-size …). The css platform uses an explicit
 * transform list WITHOUT `size/rem` — our dimension values are already authored
 * as final CSS (`0.9375rem`, `-0.02em`) and must pass through untouched.
 *
 * outputReferences keeps the colour alias chain intact so a future Dark mode
 * only overrides the semantic layer.
 */
export default {
  source: ['tokens/**/*.json'],
  expand: { include: ['typography'] },
  platforms: {
    css: {
      transforms: ['attribute/cti', 'name/kebab', 'color/css', 'fontFamily/css'],
      buildPath: 'build/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/',
      files: [
        { destination: 'tokens.js', format: 'javascript/es6' },
        { destination: 'tokens.d.ts', format: 'typescript/es6-declarations' },
      ],
    },
  },
};
