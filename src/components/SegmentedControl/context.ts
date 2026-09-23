import { createContext, useContext } from 'react';

/** `choice` — pick one value (radio semantics, the original behaviour).
 * `tabs` — switch which content panel is showing (tab semantics). */
export type SegmentedControlMode = 'choice' | 'tabs';

export const SegmentedControlModeContext = createContext<SegmentedControlMode>('choice');

export function useSegmentedControlMode(): SegmentedControlMode {
  return useContext(SegmentedControlModeContext);
}
