import { useLayoutEffect, type RefObject } from 'react';

/**
 * One highlight that travels between the items of a group, instead of each
 * item switching its own highlight on and off (owner, 2026-09-28: "tab
 * fluidly switches"). Used by `SegmentedControl` (the picked option) and
 * `SidebarSection` (the current nav row).
 *
 * The group renders a single absolutely positioned element (`highlightRef`)
 * that wears the highlight's skin; the items stop painting their own. On
 * every change of the marked item the element's four edges move to the new
 * item with CSS transitions — the edge in the direction of travel leaves a
 * beat before the trailing one, so the highlight stretches as it goes and
 * settles back to size when it lands.
 *
 * - Placement is measured, so it follows any size or position the items
 *   take. Measured through the group's own transform scale, so a group
 *   mid-entrance (scaled by the page entrance) still lands exactly.
 * - First placement, resizes and re-appearing after having no target do not
 *   travel — only a change of item does.
 * - The skin's radius is copied from the target, so per-size or
 *   per-position corners morph along the way.
 * - `data-tone` is copied too, for skins that colour by the item's tone.
 * - Reduced motion: the CSS of each consumer sets `transition: none`.
 */

/** ms for an edge to travel. */
const TRAVEL_MS = 420;
/** ms the trailing edge waits behind the leading one — the stretch. */
const LAG_MS = 70;
/** Arrives with a small overshoot, like the rest of the app's springs. */
const TRAVEL_EASE = 'cubic-bezier(0.34, 1.22, 0.64, 1)';
/** The skin's own properties (tone colour, radius) blend over this. */
const SKIN = 'background-color 320ms ease, border-color 320ms ease, box-shadow 320ms ease, border-radius 320ms ease';

interface Edges {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function useSlidingHighlight(
  containerRef: RefObject<HTMLElement | null>,
  highlightRef: RefObject<HTMLElement | null>,
  /** Finds the item to highlight inside the container, e.g. `:scope > [data-selected]`. */
  targetSelector: string,
): void {
  useLayoutEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;
    if (!container || !highlight) return;

    let last: Edges | null = null;
    let shown = false;

    const measure = (target: HTMLElement): Edges => {
      const c = container.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      const scale = c.width > 0 ? container.offsetWidth / c.width : 1;
      const left = (r.left - c.left) * scale - container.clientLeft + container.scrollLeft;
      const top = (r.top - c.top) * scale - container.clientTop + container.scrollTop;
      const width = r.width * scale;
      const height = r.height * scale;
      return {
        left,
        top,
        right: container.clientWidth - left - width,
        bottom: container.clientHeight - top - height,
      };
    };

    const place = (travel: boolean) => {
      const target = container.querySelector<HTMLElement>(targetSelector);
      const style = highlight.style;
      if (!target) {
        // Nothing to mark here (e.g. the current page lives in another
        // section): fade out where it stands.
        style.transition = 'opacity 180ms ease';
        style.opacity = '0';
        shown = false;
        return;
      }
      const next = measure(target);
      if (travel && shown && last) {
        const lag = (leads: boolean) => (leads ? 0 : LAG_MS);
        const right = next.left > last.left;
        const down = next.top > last.top;
        style.transition = [
          `left ${TRAVEL_MS}ms ${TRAVEL_EASE} ${lag(!right)}ms`,
          `right ${TRAVEL_MS}ms ${TRAVEL_EASE} ${lag(right)}ms`,
          `top ${TRAVEL_MS}ms ${TRAVEL_EASE} ${lag(!down)}ms`,
          `bottom ${TRAVEL_MS}ms ${TRAVEL_EASE} ${lag(down)}ms`,
          SKIN,
          'opacity 180ms ease',
        ].join(', ');
      } else {
        // Arrive in place: no travel, just (re)appear.
        style.transition = shown ? 'none' : 'opacity 180ms ease';
      }
      style.left = `${next.left}px`;
      style.top = `${next.top}px`;
      style.right = `${next.right}px`;
      style.bottom = `${next.bottom}px`;
      style.borderRadius = getComputedStyle(target).borderRadius;
      const tone = target.dataset.tone;
      if (tone && highlight.dataset.tone !== tone) highlight.dataset.tone = tone;
      else if (!tone && highlight.dataset.tone) delete highlight.dataset.tone;
      style.opacity = '1';
      last = next;
      shown = true;
    };

    place(false);

    // A new item marked: travel. Mutation callbacks run before paint, so
    // the old item never shows unhighlighted for a frame.
    // Records on the highlight itself are this hook's own writes — skipped,
    // or copying `data-tone` would re-trigger it forever.
    const mutations = new MutationObserver((records) => {
      if (records.some((r) => r.target !== highlight)) place(true);
    });
    mutations.observe(container, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-selected', 'data-highlight', 'data-tone'],
    });
    // The group changed size (a sidebar toggle, fonts arriving): re-place.
    const resize = new ResizeObserver(() => place(false));
    resize.observe(container);

    return () => {
      mutations.disconnect();
      resize.disconnect();
    };
  }, [containerRef, highlightRef, targetSelector]);
}
