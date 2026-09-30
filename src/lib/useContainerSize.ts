import { useLayoutEffect, useRef, useState } from 'react';

/** How often, at most, a chart re-renders while its container keeps
 * resizing (a sidebar collapse, a window drag). */
const RESIZE_THROTTLE_MS = 100;

/** Measures an element's real rendered size via ResizeObserver. Used so a
 * chart's SVG coordinate space matches actual pixels 1:1 — the alternative
 * (a fixed viewBox stretched via `width:100%`) scales text along with the
 * plot area, which makes labels illegible on a narrow card. Shared by
 * `BarChart`, `LineChart` and `DonutChart`.
 *
 * The first measure is immediate. After that, a container that keeps
 * resizing re-renders the chart at most every 100ms, plus once when it
 * stops — every frame of the sidebar's width animation used to redraw every
 * chart (owner, 2026-09-30 perf pass). Changes under half a pixel are
 * ignored. */
export function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let committed = { width: rect.width, height: rect.height };
    setSize(committed);

    let latest = committed;
    let timer = 0;
    const commit = () => {
      timer = 0;
      if (Math.abs(latest.width - committed.width) < 0.5 && Math.abs(latest.height - committed.height) < 0.5) return;
      committed = latest;
      setSize(latest);
    };
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      latest = { width: entry.contentRect.width, height: entry.contentRect.height };
      if (!timer) timer = window.setTimeout(commit, RESIZE_THROTTLE_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return [ref, size] as const;
}
