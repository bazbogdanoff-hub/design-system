import { useLayoutEffect, type RefObject } from 'react';

/**
 * Which horizontal sides of an element sit on its container's padding edge
 * (owner, 2026-09-29 — a Badge rule, like the card corner rule an app-side
 * one Figma can't express).
 *
 * The container is the nearest ancestor that is both rounded and padded — a
 * card, a tile, a modal. A badge whose left side lies on that container's
 * left padding edge is `start`; right side on the right edge, `end`. Badge
 * CSS then gives both corners on that side (top and bottom) the badge's
 * original radius (6 / 8) and keeps the other side a full pill. A badge
 * touching neither side stays a full pill.
 *
 * Written as `data-edge="start end"` (any subset). Measured, so it follows
 * layout: ResizeObserver on the element and its container.
 */

/** How close a side must be to the padding edge to count as touching it. */
const TOUCH_TOLERANCE_PX = 2;

function paddedHost(el: HTMLElement): HTMLElement | null {
  for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
    const cs = getComputedStyle(n);
    const rounded = parseFloat(cs.borderTopLeftRadius) > 0 || parseFloat(cs.borderTopRightRadius) > 0;
    const padded = parseFloat(cs.paddingLeft) > 0 || parseFloat(cs.paddingRight) > 0;
    if (rounded && padded) return n;
  }
  return null;
}

export function useEdgeCorners(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const host = paddedHost(el);

    const update = () => {
      // "Full" is half the height, rounded up (owner, 2026-09-29: 32 → 16,
      // 31 → 16, 30 → 15) — a real radius instead of 9999px. With 9999px on
      // one side, the browser shrinks every corner in proportion to fit, and
      // the 6 / 8 edge corners collapsed to nearly square.
      const half = `${Math.ceil(el.offsetHeight / 2)}px`;
      if (el.style.getPropertyValue('--_badge-full') !== half) el.style.setProperty('--_badge-full', half);
      if (!host) return;
      const cs = getComputedStyle(host);
      const h = host.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      // Everything in the host's own scale: a card mid-entrance is scaled,
      // and its bounding rect is while clientWidth/padding are not.
      const scale = host.offsetWidth > 0 ? h.width / host.offsetWidth : 1;
      const borderRight = host.offsetWidth - host.clientLeft - host.clientWidth;
      const left = h.left + (host.clientLeft + parseFloat(cs.paddingLeft)) * scale;
      const right = h.right - (borderRight + parseFloat(cs.paddingRight)) * scale;
      const edges: string[] = [];
      if (Math.abs(r.left - left) <= TOUCH_TOLERANCE_PX) edges.push('start');
      if (Math.abs(r.right - right) <= TOUCH_TOLERANCE_PX) edges.push('end');
      const next = edges.join(' ');
      if ((el.getAttribute('data-edge') ?? '') !== next) {
        if (next) el.setAttribute('data-edge', next);
        else el.removeAttribute('data-edge');
      }
    };

    update();
    const resize = new ResizeObserver(update);
    resize.observe(el);
    if (host) resize.observe(host);
    return () => resize.disconnect();
  }, [ref]);
}
