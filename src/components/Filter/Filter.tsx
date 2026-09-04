import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../Button';

export type FilterSize = 'lg' | 'xl';

export interface FilterProps extends Omit<ButtonProps, 'variant' | 'size'> {
  /** `lg` (36px) · `xl` (40px, default). Secondary-button heights only. */
  size?: FilterSize;
}

/**
 * A filter trigger for card/table headers — `Button` fixed to `variant="secondary"`
 * with only the two taller sizes. Same composition in Figma: each `Filter`
 * variant nests a real `Button` instance, so states/tokens/icons all come
 * from `Button` directly, nothing duplicated here.
 */
export const Filter = forwardRef<HTMLButtonElement, FilterProps>(function Filter(
  { size = 'xl', ...rest },
  ref,
) {
  return <Button ref={ref} variant="secondary" size={size} {...rest} />;
});
