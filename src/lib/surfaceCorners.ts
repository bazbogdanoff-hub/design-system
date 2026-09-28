import { useLayoutEffect, type RefObject } from 'react';

/**
 * Outer corners of a page's cards (owner, 2026-09-28 — an app rule; Figma
 * cannot express it, so it is not in the component masters).
 *
 * A top-level card's corner is **outer** — rounded to `radius.card-outer`
 * (24) instead of `radius.card` (16) — only when both hold:
 *
 * 1. **Both edges meeting at that corner lie on the page's inner border**
 *    (the edge of `Page`'s padding). The corner sits in a corner of the
 *    page, concentric with the page's own rounded corner.
 * 2. **No other card is within the gap of that corner.** Any card counts,
 *    whether its corner or the middle of its edge faces this one.
 *
 * Everything else stays 16. A lone card narrower than the page therefore
 * gets 24 only on the corner(s) it shares with the page.
 *
 * Only top-level surfaces take part: elements marked `data-surface` that are
 * not inside another surface, and not `data-elevated` (floating cards have no
 * neighbours in the layout sense). The result is written as
 * `data-corner-outer="tl tr bl br"` (any subset) and styled in each
 * component's CSS; attributes rather than custom properties because
 * attributes do not inherit into nested cards.
 *
 * Geometry is measured, so it follows every layout the page takes — tier
 * spans, stacked tablet rails, content that loads late.
 */

const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;
type Corner = (typeof CORNERS)[number];

/** How close an edge must be to the page border to count as touching it. */
const TOUCH_TOLERANCE_PX = 2;
/** The 8px gap between cards, plus slack for sub-pixel layout. */
const NEIGHBOUR_REACH_PX = 12;

interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function contentBox(page: HTMLElement): Box {
  const rect = page.getBoundingClientRect();
  const cs = getComputedStyle(page);
  const originX = rect.left + page.clientLeft;
  // A page that scrolls: the border that matters is the scrolled content's,
  // so a card at the very end of a long page still reaches the bottom
  // corners. A page that doesn't (dashboard, list pages): the visible box —
  // its scrollHeight can include overflow nobody sees, e.g. drop shadows.
  const scrolls = /(auto|scroll)/.test(cs.overflowY);
  const originY = rect.top + page.clientTop - (scrolls ? page.scrollTop : 0);
  const height = scrolls ? page.scrollHeight : page.clientHeight;
  return {
    left: originX + parseFloat(cs.paddingLeft),
    right: originX + page.clientWidth - parseFloat(cs.paddingRight),
    top: originY + parseFloat(cs.paddingTop),
    bottom: originY + height - parseFloat(cs.paddingBottom),
  };
}

function outerCorners(el: HTMLElement, others: DOMRect[], page: Box): Corner[] {
  const r = el.getBoundingClientRect();
  const near = (a: number, b: number) => Math.abs(a - b) <= TOUCH_TOLERANCE_PX;
  const onEdge = {
    left: near(r.left, page.left),
    right: near(r.right, page.right),
    top: near(r.top, page.top),
    bottom: near(r.bottom, page.bottom),
  };
  const point: Record<Corner, [number, number]> = {
    tl: [r.left, r.top],
    tr: [r.right, r.top],
    bl: [r.left, r.bottom],
    br: [r.right, r.bottom],
  };
  const touches: Record<Corner, boolean> = {
    tl: onEdge.left && onEdge.top,
    tr: onEdge.right && onEdge.top,
    bl: onEdge.left && onEdge.bottom,
    br: onEdge.right && onEdge.bottom,
  };
  const hasNeighbour = ([x, y]: [number, number]) =>
    others.some(
      (o) =>
        x >= o.left - NEIGHBOUR_REACH_PX &&
        x <= o.right + NEIGHBOUR_REACH_PX &&
        y >= o.top - NEIGHBOUR_REACH_PX &&
        y <= o.bottom + NEIGHBOUR_REACH_PX,
    );
  return CORNERS.filter((c) => touches[c] && !hasNeighbour(point[c]));
}

/** Resolves outer corners for every top-level surface inside `ref`. */
export function useSurfaceCorners(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const page = ref.current;
    if (!page || typeof ResizeObserver === 'undefined') return;

    let frame = 0;
    const observed = new Set<Element>();

    const update = () => {
      frame = 0;
      const surfaces = [...page.querySelectorAll<HTMLElement>('[data-surface]')].filter((el) => {
        if (el.hasAttribute('data-elevated')) return false;
        const outer = el.parentElement?.closest('[data-surface]');
        return !(outer && page.contains(outer));
      });
      const box = contentBox(page);
      const rects = surfaces.map((el) => el.getBoundingClientRect());
      surfaces.forEach((el, i) => {
        if (!observed.has(el)) {
          observed.add(el);
          resize.observe(el);
        }
        const others = rects.filter((o, j) => j !== i && o.width > 0 && o.height > 0);
        const next = (rects[i]?.width ?? 0) > 0 ? outerCorners(el, others, box).join(' ') : '';
        if ((el.getAttribute('data-corner-outer') ?? '') !== next) {
          if (next) el.setAttribute('data-corner-outer', next);
          else el.removeAttribute('data-corner-outer');
        }
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const resize = new ResizeObserver(schedule);
    resize.observe(page);
    // Cards appear after data loads and tabs switch; attribute writes above
    // are not observed, so updating cannot loop.
    const mutations = new MutationObserver(schedule);
    mutations.observe(page, { childList: true, subtree: true });
    update();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
    };
  }, [ref]);
}
