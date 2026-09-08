import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../Button';

export type FilterSize = 'sm' | 'md';

export interface FilterProps extends Omit<ButtonProps, 'variant' | 'size'> {
  /** `sm` (28px) · `md` (32px, default). Secondary-button heights only. */
  size?: FilterSize;
}

/**
 * A filter trigger for card/table headers — `Button` fixed to `variant="secondary"`.
 * Same composition in Figma: each `Filter` variant nests a real `Button`
 * instance, so states/tokens/icons all come from `Button` directly, nothing
 * duplicated here.
 */
export const Filter = forwardRef<HTMLButtonElement, FilterProps>(function Filter(
  { size = 'md', ...rest },
  ref,
) {
  return <Button ref={ref} variant="secondary" size={size} {...rest} />;
});
