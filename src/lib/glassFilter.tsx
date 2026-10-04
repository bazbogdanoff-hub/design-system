/**
 * The glass pattern (src/glass.css) as an SVG filter, for chart marks -
 * SVG ignores box-shadow. One per colour: the primary Button's plain drop
 * shadow (0 1 8, black 20%), the source, then the inner shadow and the 1px
 * catch along the top-left edge (owner, 2026-09-29). Shared by BarChart and
 * DonutChart so every chart mark wears the same recipe.
 *
 * `region` is the filter's user-space area - pass the whole chart, so the
 * shadow is never clipped at the mark's bounding box.
 */
export function GlassFilter({
  id,
  color,
  region,
  catchWidth = 1,
  frameRotation = 0,
  innerScale = 1,
}: {
  id: string;
  color: string;
  region: { x: number; y: number; width: number; height: number };
  /** px of the top-left catch - 1 on bar blocks; bigger marks (a donut
   * ring) need 2–3 or the edge reads as soft clay rather than depth. */
  catchWidth?: number;
  /** Degrees the mark's own frame is rotated by (DonutChart turns its ring
   * −90° to start at twelve). Filter offsets live in that frame, so they are
   * turned back by this much - the light keeps coming from the top left. */
  frameRotation?: number;
  /** Scales the inner shadow (offset 2, blur 12 at 1) with the mark - the
   * recipe was tuned on a 16px pill, so a thicker mark passes thickness / 16. */
  innerScale?: number;
}) {
  // A screen-space offset expressed in the mark's rotated frame.
  const t = (-frameRotation * Math.PI) / 180;
  const off = (dx: number, dy: number) => ({
    dx: +(dx * Math.cos(t) - dy * Math.sin(t)).toFixed(3),
    dy: +(dx * Math.sin(t) + dy * Math.cos(t)).toFixed(3),
  });
  const catchColor = `color-mix(in srgb, ${color}, white var(--glass-catch-mix))`;
  const innerColor = `color-mix(in oklch, ${color}, black var(--glass-inner-mix))`;
  return (
    <filter id={id} filterUnits="userSpaceOnUse" {...region} colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={4} />
      <feOffset {...off(0, 1)} result="dropShape" />
      <feFlood floodColor="#000" floodOpacity={0.2} />
      <feComposite in2="dropShape" operator="in" result="drop" />
      <feOffset in="SourceAlpha" {...off(2 * innerScale, 2 * innerScale)} />
      <feGaussianBlur stdDeviation={6 * innerScale} result="innerShifted" />
      <feComposite in="SourceAlpha" in2="innerShifted" operator="out" result="innerBand" />
      <feFlood style={{ floodColor: innerColor }} />
      <feComposite in2="innerBand" operator="in" result="inner" />
      <feOffset in="SourceAlpha" {...off(catchWidth, catchWidth)} result="catchShifted" />
      <feComposite in="SourceAlpha" in2="catchShifted" operator="out" result="catchBand" />
      <feFlood style={{ floodColor: catchColor }} />
      <feComposite in2="catchBand" operator="in" result="catch" />
      <feMerge>
        <feMergeNode in="drop" />
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="inner" />
        <feMergeNode in="catch" />
      </feMerge>
    </filter>
  );
}

/** A filter id safe inside url(#…) - React's useId has colons. */
export function glassFilterId(base: string, index: number): string {
  return `glass${base.replace(/[^a-zA-Z0-9_-]/g, '')}-${index}`;
}
