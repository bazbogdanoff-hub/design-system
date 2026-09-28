import { useLayoutEffect, type RefObject } from 'react';

/**
 * Publishes the width of `ref`'s own vertical scrollbar as `--_page-scrollbar`
 * (0px when there is none), so its padding can give that width back
 * (owner, 2026-09-28): a scrollbar sits inside the padding box, so without
 * this the right side of a scrolling page reads as padding + scrollbar while
 * the left reads as padding alone.
 *
 * Measured rather than assumed — the bar's width is styled per app, scales
 * with the root, and exists only while the content overflows.
 */
export function useScrollbarGutter(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const cs = getComputedStyle(el);
      const borders = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
      const width = Math.max(0, el.offsetWidth - el.clientWidth - borders);
      const next = `${width}px`;
      if (el.style.getPropertyValue('--_page-scrollbar') !== next) {
        el.style.setProperty('--_page-scrollbar', next);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The bar appears when the content outgrows the page, so watch the
    // content's size as well as the page's own.
    const resize = new ResizeObserver(schedule);
    const observeChildren = () => {
      for (const child of Array.from(el.children)) resize.observe(child);
      schedule();
    };
    resize.observe(el);
    const mutations = new MutationObserver(observeChildren);
    mutations.observe(el, { childList: true });
    observeChildren();
    update();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
    };
  }, [ref]);
}
