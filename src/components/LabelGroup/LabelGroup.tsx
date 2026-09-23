import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Label, type LabelColor, type LabelProps, type LabelSize } from '../Label';
import styles from './LabelGroup.module.css';

export interface LabelGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Cascades to every child `Label` (and sizes the dividers). `md` by default. */
  size?: LabelSize;
  /** Default `color` for child `Label`s that don't set one. When set, skips
   *  Headercard total/active/inactive inference. `Row` always passes `subtle`. */
  color?: LabelColor;
  /** `Label` elements — 2–4 is the intended range. Real 1px dividers are
   *  inserted between them automatically. */
  children: ReactElement<LabelProps> | Array<ReactElement<LabelProps> | null | false | undefined>;
}

function labelText(children: ReactNode): string {
  if (children == null || typeof children === 'boolean') return '';
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(labelText).join('');
  if (isValidElement<{ children?: ReactNode }>(children)) return labelText(children.props.children);
  return '';
}

/**
 * Stat-line convention for Headercard counts (only when `color` is unset):
 * - "… total" → subtle
 * - "… active" → success
 * - "… inactive" → danger
 * Explicit `color` on a `Label` always wins.
 */
function inferStatColor(text: string): LabelColor | undefined {
  const t = text.toLowerCase();
  if (/\binactive\b/.test(t)) return 'danger';
  if (/\bactive\b/.test(t)) return 'success';
  if (/\btotal\b/.test(t)) return 'subtle';
  return undefined;
}

/**
 * A short run of `Label`s separated by real 1px vertical dividers — the
 * pipe-separated pattern (`TK-4021 | TL-88 | Dumont`). The divider is fixed
 * chrome (`color.text.subtle`), never one of `Label`'s own colors. Used as
 * `Row`'s `description`. See `docs/components/LabelGroup.md`.
 */
export const LabelGroup = forwardRef<HTMLDivElement, LabelGroupProps>(function LabelGroup(
  { size = 'md', color, children, className, ...rest },
  ref,
) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<LabelProps>[];

  return (
    <div ref={ref} className={cn(styles.group, className)} data-size={size} {...rest}>
      {items.map((child, i) => {
        const nextProps: Partial<LabelProps> = { size: child.props.size ?? size };
        if (child.type === Label && child.props.color == null) {
          if (color != null) {
            nextProps.color = color;
          } else {
            const inferred = inferStatColor(labelText(child.props.children));
            if (inferred) nextProps.color = inferred;
          }
        }
        return (
          <Fragment key={child.key ?? i}>
            {i > 0 && <span aria-hidden="true" className={styles.divider} />}
            {child.type === Label ? cloneElement(child, nextProps) : child}
          </Fragment>
        );
      })}
    </div>
  );
});
