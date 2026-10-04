/*
 * ChatBubble's edge light, as SVG filters (2026-10-01).
 *
 * A box-shadow follows the box, not the shape, so on a bubble with a tail it
 * stops at the joint and creases the side the tail grows from. A filter works
 * from the painted alpha - body and tail as one silhouette - so the catch,
 * the inner band and the drop run unbroken round both. Each recipe is the
 * design system's own, re-expressed (box-shadow blur b is stdDeviation b/2;
 * a negative spread is an erode, a positive one a dilate):
 *
 *   light out  glass.css on the primary fill - catch, inner, two lights
 *   light in   Tile - 2/1 white catch, inner 1 1 8, drop 0.5 0.5 2 spread 2
 *   dark out   the sidebar's brand pair - brand.400 catch, 2px inner shade
 *   dark in    the sidebar panel - a 4px inner shade all round
 *
 * One hidden <svg> holds all four, added to <body> the first time a bubble
 * mounts; colours are CSS variables, so they follow the tokens.
 */

const ID = 'ds-chat-bubble-filters';

export type BubbleFilter = 'light-out' | 'light-in' | 'dark-out' | 'dark-in';

export const filterId = (f: BubbleFilter) => `ds-bubble-${f}`;

const region = 'x="-25%" y="-50%" width="150%" height="200%" color-interpolation-filters="sRGB"';

/** An inset band: the alpha minus itself shifted (dx, dy) and blurred. */
const inset = (dx: number, dy: number, sd: number, color: string, out: string) => `
  <feOffset in="SourceAlpha" dx="${dx}" dy="${dy}" result="${out}Shifted" />
  ${sd > 0 ? `<feGaussianBlur in="${out}Shifted" stdDeviation="${sd}" result="${out}Shifted" />` : ''}
  <feComposite in="SourceAlpha" in2="${out}Shifted" operator="out" result="${out}Band" />
  <feFlood style="flood-color: ${color}" />
  <feComposite in2="${out}Band" operator="in" result="${out}" />`;

/** An outer shadow: the alpha grown or shrunk, blurred, shifted. */
const drop = (dx: number, dy: number, sd: number, spread: number, color: string, out: string) => `
  ${spread !== 0 ? `<feMorphology in="SourceAlpha" operator="${spread > 0 ? 'dilate' : 'erode'}" radius="${Math.abs(spread)}" />` : ''}
  <feGaussianBlur ${spread !== 0 ? '' : 'in="SourceAlpha"'} stdDeviation="${sd}" />
  <feOffset dx="${dx}" dy="${dy}" result="${out}Shape" />
  <feFlood style="flood-color: ${color}" />
  <feComposite in2="${out}Shape" operator="in" result="${out}" />`;

const merge = (under: string[], over: string[]) =>
  `<feMerge>${[...under, 'SourceGraphic', ...over].map((n) => `<feMergeNode in="${n}" />`).join('')}</feMerge>`;

const glass = 'var(--color-button-primary-background-default)';
const mixAlpha = (c: string, a: string) => `color-mix(in srgb, ${c} ${a}, transparent)`;

const RECIPES: Record<BubbleFilter, string> = {
  'light-out':
    drop(2, 3, 2.5, -1, mixAlpha(glass, 'var(--glass-light-near)'), 'near') +
    drop(3, 6, 6, -2, mixAlpha(glass, 'var(--glass-light-far)'), 'far') +
    inset(2, 2, 6, `color-mix(in oklch, ${glass}, black var(--glass-inner-mix))`, 'inner') +
    inset(1, 1, 0, `color-mix(in srgb, ${glass}, white var(--glass-catch-mix))`, 'catch') +
    merge(['far', 'near'], ['inner', 'catch']),
  'light-in':
    drop(0.5, 0.5, 1, 2, 'var(--color-tile-shadow)', 'drop') +
    inset(1, 1, 4, 'var(--color-tile-inner-shadow)', 'inner') +
    inset(2, 2, 0, 'var(--color-tile-border)', 'catchA') +
    inset(-1, -1, 0, 'var(--color-tile-border)', 'catchB') +
    merge(['drop'], ['inner', 'catchA', 'catchB']),
  'dark-out':
    inset(-1, -1, 1, 'color-mix(in oklch, var(--color-sidebar-brand-fill), black 20%)', 'shade') +
    inset(1, 1, 0, 'var(--color-sidebar-brand-accent)', 'catch') +
    merge([], ['shade', 'catch']),
  'dark-in':
    // inset 0 0 4px: the alpha minus itself blurred, unshifted.
    inset(0, 0, 2, 'var(--color-sidebar-panel-inner-shadow)', 'inner') + merge([], ['inner']),
};

/** Adds the filters to the page once; every bubble after that reuses them. */
export function ensureBubbleFilters(): void {
  if (typeof document === 'undefined' || document.getElementById(ID)) return;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = ID;
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.style.position = 'absolute';
  svg.innerHTML = (Object.keys(RECIPES) as BubbleFilter[])
    .map((f) => `<filter id="${filterId(f)}" ${region}>${RECIPES[f]}</filter>`)
    .join('');
  document.body.appendChild(svg);
}
