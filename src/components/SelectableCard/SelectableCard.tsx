import { forwardRef, type MouseEvent, type ReactNode } from 'react';
import { Card, type CardPadding } from '../Card';
import { Tile } from '../Tile';
import { Radio, type RadioSize } from '../Radio';
import { cn } from '../../lib/cn';
import styles from './SelectableCard.module.css';

export interface SelectableCardProps {
  /** Radio group name - every card in one choice shares it, which is what
   * gives arrow-key movement between them and single selection, natively. */
  name: string;
  value: string;
  /** The card's accessible name, read when its radio is focused - usually the
   * same text as the card's heading. */
  label: string;
  checked: boolean;
  disabled?: boolean;
  /** Fires when this card becomes the selected one - from its radio, or
   * from a click anywhere on the card that isn't on another control. */
  onSelect: () => void;
  /** Top row, **left** of the radio - e.g. cost/time `Badge`s. Rendered after
   * the radio in the DOM and moved by `order`; see the CSS for why. */
  trailing?: ReactNode;
  children?: ReactNode;
  /** `Card` padding. `md` (default). */
  padding?: CardPadding;
  radioSize?: RadioSize;
  /** `card` (default) or `tile`: a choice among others inside one card
   * (owner, 2026-10-06: the task page's options, grouped as Context is). */
  surface?: 'card' | 'tile';
  className?: string;
}

/** Controls inside the card act on their own - a click on one never also
 * selects the card. */
const INTERACTIVE = 'button, a[href], input, select, textarea, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';

/**
 * A card that is one choice in a set - radio semantics, card surface.
 *
 * The card itself is **not** a button. It holds a real `Radio`, which carries
 * the accessible name and the keyboard behaviour (Tab into the group, arrow
 * keys between cards, Space to select). A pointer click anywhere on the card
 * is a shortcut for that radio. So the card can contain its own buttons -
 * a Confirm, a help icon - without the nested-interactive problem a
 * `role="button"` card creates for keyboard and screen-reader users.
 *
 * Selected shows a 1px brand ring in place of Card's white edge; keyboard
 * focus on the radio rings the whole card, since the card is what the user
 * is choosing.
 */
export const SelectableCard = forwardRef<HTMLDivElement, SelectableCardProps>(function SelectableCard(
  {
    name,
    value,
    label,
    checked,
    disabled = false,
    onSelect,
    trailing,
    children,
    padding = 'md',
    radioSize = 'md',
    surface = 'card',
    className,
  },
  ref,
) {
  function handleClick(e: MouseEvent<HTMLDivElement>) {
    if (disabled || checked) return;
    const target = e.target as HTMLElement;
    const control = target.closest(INTERACTIVE);
    // A click on the radio itself is handled by its own onChange.
    if (control && e.currentTarget.contains(control)) return;
    onSelect();
  }

  const content = (
    <>
      <div className={styles.top}>
        <Radio
          name={name}
          value={value}
          size={radioSize}
          checked={checked}
          disabled={disabled}
          aria-label={label}
          onChange={() => onSelect()}
        />
        {trailing != null && <div className={styles.trailing}>{trailing}</div>}
      </div>
      {children}
    </>
  );
  return surface === 'tile' ? (
    <Tile
      ref={ref}
      className={cn(styles.card, className)}
      data-surface={surface}
      data-selected={checked || undefined}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      padding={padding === 'sm' || padding === 'xs' ? padding : 'md'}
    >
      {content}
    </Tile>
  ) : (
    <Card
      ref={ref}
      className={cn(styles.card, className)}
      data-surface={surface}
      data-selected={checked || undefined}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      padding={padding}
    >
      {content}
    </Card>
  );
});
