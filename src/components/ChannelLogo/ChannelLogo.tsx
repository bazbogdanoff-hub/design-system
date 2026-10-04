import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { CHANNEL_PATHS } from './paths';
import styles from './ChannelLogo.module.css';

export type ChannelLogoChannel = keyof typeof CHANNEL_PATHS;
export type ChannelLogoSize = 'xs' | 'sm' | 'md' | 'lg';

const NAME: Record<ChannelLogoChannel, string> = {
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  viber: 'Viber',
};

export interface ChannelLogoProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Which messaging app. In-app messages have no logo - render nothing. */
  channel: ChannelLogoChannel;
  /** `xs` (12) · `sm` (20) · `md` (28) · `lg` (36, the height of an `lg`
   * `IconButton`, so it sits beside one in a header). */
  size?: ChannelLogoSize;
  /** `true` (default): the app's own logo - its white mark on a rounded
   * tile in its brand colour. `false`: the bare mark in `currentColor`, for
   * running text (a message's time line). */
  tile?: boolean;
  /** The app's name is the accessible label by default; pass `decorative`
   * when the name is already written next to it. */
  decorative?: boolean;
}

/**
 * A messaging app's logo (owner, 2026-10-01, built code-first) - Telegram,
 * WhatsApp, Viber - for saying which channel a conversation or a message
 * travelled on. Marks are Simple Icons' (CC0), verbatim; colours are the
 * apps' own (`color.channelLogo.*`), not ours to retune. Phosphor has no
 * Viber mark and only approximations of the others, hence its own artwork.
 * See docs/components/ChannelLogo.md.
 */
export const ChannelLogo = forwardRef<HTMLSpanElement, ChannelLogoProps>(function ChannelLogo(
  { channel, size = 'md', tile = true, decorative = false, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.logo, className)}
      data-channel={channel}
      data-size={size}
      data-tile={tile || undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : NAME[channel]}
      aria-hidden={decorative || undefined}
      {...rest}
    >
      <svg className={styles.mark} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={CHANNEL_PATHS[channel]} />
      </svg>
    </span>
  );
});
