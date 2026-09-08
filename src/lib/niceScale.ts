/** Picks a round axis max + step (e.g. max 30, step 5) so gridlines land on
 * clean numbers instead of the raw data max. Assumes a zero baseline — for
 * `BarChart`, where the filled area encodes magnitude and must start at 0. */
export function niceScale(maxValue: number, targetTicks = 6): { max: number; step: number } {
  if (maxValue <= 0) return { max: targetTicks, step: 1 };
  const rawStep = maxValue / Math.max(1, targetTicks - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude;
  const max = Math.ceil(maxValue / step) * step;
  return { max, step };
}

/** Same rounding, but for a scale that doesn't need a zero baseline — a line
 * chart's mark encodes trend/position, not a filled magnitude from zero, so
 * cramping the range down to the data's own min/max (rounded to clean
 * ticks) reads the trend far better than forcing every line down near a
 * flat baseline. */
export function niceScaleRange(
  minValue: number,
  maxValue: number,
  targetTicks = 6,
): { min: number; max: number; step: number } {
  if (minValue === maxValue) {
    const { max, step } = niceScale(Math.max(0, maxValue), targetTicks);
    return { min: 0, max, step };
  }
  const span = maxValue - minValue;
  const rawStep = span / Math.max(1, targetTicks - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const step = (residual > 5 ? 10 : residual > 2 ? 5 : residual > 1 ? 2 : 1) * magnitude;
  const min = Math.floor(minValue / step) * step;
  const max = Math.ceil(maxValue / step) * step;
  return { min, max, step };
}
