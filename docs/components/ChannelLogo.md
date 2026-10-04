# ChannelLogo

A messaging app's logo - Telegram, WhatsApp, Viber - saying which channel a
conversation or message travelled on. **Built code-first** (owner,
2026-10-01); no Figma master yet.

```tsx
<ChannelLogo channel="telegram" size="lg" />          {/* app-icon tile, in a chat header */}
<ChannelLogo channel="viber" size="xs" tile={false} /> {/* bare mark, in a message's time line */}
```

| prop | type | default | notes |
|---|---|---|---|
| `channel` | `'telegram'` \| `'whatsapp'` \| `'viber'` | | in-app has no logo - render nothing |
| `size` | `'xs'` \| `'sm'` \| `'md'` \| `'lg'` | `'md'` | 12 · 20 · 28 · 36. `lg` is an `lg` `IconButton`'s height, so a tile sits level beside one |
| `tile` | `boolean` | `true` | `true`: white mark on a rounded square in the app's colour. `false`: the bare mark in `currentColor` |
| `decorative` | `boolean` | `false` | the app's name is the accessible label unless the name is written beside it |

## Artwork and colour

- **Marks** are [Simple Icons](https://simpleicons.org)' (CC0-1.0), copied
  verbatim into `paths.ts` - the apps' own logos, not redrawn. Phosphor has
  no Viber mark and only approximations of the other two.
- **Colours** are the apps' own, as tokens: `color.channelLogo.telegram`
  `#26a5e4`, `.whatsapp` `#25d366`, `.viber` `#7360f2`, mark
  `.glyph` (white). **Not ours to retune** - a channel logo is recognised by
  its colour, which is also why these sit outside the brand/semantic ramps.
- Trademarks remain their owners'; the logos are used to identify the
  channel, nothing more.

## Anatomy (tile)

```
span.logo     rounded square - radius.control (8); radius.sm at size sm
              fill color.channelLogo.<channel>
└─ svg.mark   60% of the tile, centred, fill color.channelLogo.glyph
```

Bare (`tile={false}`): the mark fills the box, `fill: currentColor`.

## Figma build notes

Component set `ChannelLogo`, properties `channel` (telegram / whatsapp /
viber), `size` (xs / sm / md / lg), `tile` (boolean). Import the three
Simple Icons SVGs as vectors; tile = frame with the brand fill, corner 8,
mark centred at 60%. Brand fills as variables under `color/channelLogo/*`.
