import { useEffect, useRef, useState } from 'react';

/**
 * Keeps something mounted for `exitMs` after `open` goes false, so its exit
 * animation can play (motion playground, 2026-09-28). `closing` is true for
 * that window — style it with `data-state="closing"`. Under reduced motion
 * it unmounts straight away. `onExited` runs once it is gone.
 */
export function usePresence(
  open: boolean,
  exitMs: number,
  onExited?: () => void,
): { present: boolean; closing: boolean } {
  const [present, setPresent] = useState(open);
  // Opening is immediate — adjust during render rather than a frame later.
  if (open && !present) setPresent(true);

  const exited = useRef(onExited);
  useEffect(() => {
    exited.current = onExited;
  });

  useEffect(() => {
    if (open || !present) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(
      () => {
        setPresent(false);
        exited.current?.();
      },
      reduce ? 0 : exitMs,
    );
    return () => window.clearTimeout(timer);
  }, [open, present, exitMs]);

  return { present: open || present, closing: !open && present };
}
