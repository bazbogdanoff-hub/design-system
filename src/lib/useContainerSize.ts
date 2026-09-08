import { useLayoutEffect, useRef, useState } from 'react';

/** Measures an element's real rendered size via ResizeObserver. Used so a
 * chart's SVG coordinate space matches actual pixels 1:1 — the alternative
 * (a fixed viewBox stretched via `width:100%`) scales text along with the
 * plot area, which makes labels illegible on a narrow card. Shared by
 * `BarChart` and `LineChart`. */
export function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
