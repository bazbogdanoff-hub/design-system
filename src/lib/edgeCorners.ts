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

/* ---- one shared batch for every badge on the page --------------------------
   Measuring badge by badge — read, write, read, write — made the browser
   recompute layout before each read (24+ times on the Tasks board; owner
   2026-09-30 perf pass). Now every badge that mounted or resized is queued,
   and one pass measures them all, then writes them all. The pass runs in a
   microtask: after the render that mounted them, before the frame paints,
   so there is no one-frame flash of the wrong corners. One ResizeObserver
   serves every badge and host. */

interface Entry {
  /** undefined = not looked up yet; null = no rounded, padded container. */
  host: HTMLElement | null | undefined;
}

const entries = new Map<HTMLElement, Entry>();
/** host → the badges it holds, so a host resize re-measures its badges. */
const byHost = new Map<HTMLElement, Set<HTMLElement>>();
const queue = new Set<HTMLElement>();
let scheduled = false;
let observer: ResizeObserver | null = null;

function enqueue(el: HTMLElement) {
  queue.add(el);
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(flush);
}

function onResize(records: ResizeObserverEntry[]) {
  for (const r of records) {
    const t = r.target as HTMLElement;
    if (entries.has(t)) enqueue(t);
    byHost.get(t)?.forEach(enqueue);
  }
}

function flush() {
  scheduled = false;
  const els = [...queue].filter((el) => entries.has(el) && el.isConnected);
  queue.clear();

  // Reads, all of them first.
  const results = els.map((el) => {
    const entry = entries.get(el)!;
    if (entry.host === undefined) {
      entry.host = paddedHost(el);
      if (entry.host) {
        let set = byHost.get(entry.host);
        if (!set) {
          set = new Set();
          byHost.set(entry.host, set);
          observer?.observe(entry.host);
        }
        set.add(el);
      }
    }
    // "Full" is half the height, rounded up (owner, 2026-09-29: 32 → 16,
    // 31 → 16, 30 → 15) — a real radius instead of 9999px. With 9999px on
    // one side, the browser shrinks every corner in proportion to fit, and
    // the 6 / 8 edge corners collapsed to nearly square.
    const half = `${Math.ceil(el.offsetHeight / 2)}px`;
    const host = entry.host;
    if (!host) return { el, half, edge: '' };
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
    return { el, half, edge: edges.join(' ') };
  });

  // Then the writes.
  for (const { el, half, edge } of results) {
    if (el.style.getPropertyValue('--_badge-full') !== half) el.style.setProperty('--_badge-full', half);
    if ((el.getAttribute('data-edge') ?? '') !== edge) {
      if (edge) el.setAttribute('data-edge', edge);
      else el.removeAttribute('data-edge');
    }
  }
}

export function useEdgeCorners(ref: RefObject<HTMLElement | null>): void {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    observer ??= new ResizeObserver(onResize);
    entries.set(el, { host: undefined });
    observer.observe(el);
    enqueue(el);
    return () => {
      const host = entries.get(el)?.host;
      entries.delete(el);
      queue.delete(el);
      observer?.unobserve(el);
      if (host) {
        const set = byHost.get(host);
        set?.delete(el);
        if (set && set.size === 0) {
          byHost.delete(host);
          observer?.unobserve(host);
        }
      }
    };
  }, [ref]);
}
