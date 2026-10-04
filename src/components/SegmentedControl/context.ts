import { createContext, useContext } from 'react';

/** `choice` - pick one value (radio semantics, the original behaviour).
 * `tabs` - switch which content panel is showing (tab semantics). */
export type SegmentedControlMode = 'choice' | 'tabs';

export const SegmentedControlModeContext = createContext<SegmentedControlMode>('choice');

export function useSegmentedControlMode(): SegmentedControlMode {
  return useContext(SegmentedControlModeContext);
}

/** True inside a `SegmentedControl` that draws one travelling highlight for
 * the picked item (`lib/slidingHighlight.ts`) - the item then leaves its own
 * fill off. False for an item rendered on its own. */
export const SegmentedControlSlidingContext = createContext(false);

export function useSegmentedControlSliding(): boolean {
  return useContext(SegmentedControlSlidingContext);
}
