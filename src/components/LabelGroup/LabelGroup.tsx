import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '../../lib/cn';
import { Label, type LabelProps, type LabelSize } from '../Label';
import styles from './LabelGroup.module.css';

export interface LabelGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Cascades to every child `Label` (and sizes the dividers). `md` by default. */
  size?: LabelSize;
  /** `Label` elements — 2–4 is the intended range. Real 1px dividers are
   *  inserted between them automatically. */
  children: ReactElement<LabelProps> | Array<ReactElement<LabelProps> | null | false | undefined>;
}

/**
 * A short run of `Label`s separated by real 1px vertical dividers — the
 * pipe-separated pattern (`TK-4021 | TL-88 | Dumont`). The divider is fixed
 * chrome (`color.text.subtle`), never one of `Label`'s own colors. Used as
 * `Row`'s `description`. See `docs/components/LabelGroup.md`.
 */
export const LabelGroup = forwardRef<HTMLDivElement, LabelGroupProps>(function LabelGroup(
  { size = 'md', children, className, ...rest },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<LabelProps>[];

  return (
    <div ref={ref} className={cn(styles.group, className)} data-size={size} {...rest}>
      {items.map((child, i) => (
        <Fragment key={child.key ?? i}>
          {i > 0 && <span aria-hidden="true" className={styles.divider} />}
          {child.type === Label
            ? cloneElement(child, { size: child.props.size ?? size })
            : child}
        </Fragment>
      ))}
    </div>
  );
});
