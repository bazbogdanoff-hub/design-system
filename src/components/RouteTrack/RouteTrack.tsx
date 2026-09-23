import { Fragment, forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { MapPin } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { VehicleMarker } from './VehicleMarker';
import styles from './RouteTrack.module.css';

export interface RouteTrackStop {
  /** React key. Falls back to the index when absent. */
  id?: string;
  /** Where this stop is — the bold line. */
  place: ReactNode;
  /** What happens there — the quiet line under it. */
  process?: ReactNode;
  /** Overrides the default `MapPin`. */
  icon?: ReactNode;
}

type Base = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Two or more. One stop isn't a route. */
  stops: RouteTrackStop[];
  /**
   * How far along the whole route, `0`–`1`. Stops are evenly spaced, so with
   * four stops the second sits at `0.333`. Clamped.
   */
  progress: number;
  /** Hides the vehicle marker — for a finished or not-yet-started route. */
  hideVehicle?: boolean;
};

/** An accessible name is required — `aria-label`, or `aria-labelledby`. Same
 * mandatory-name pattern as `ProgressBar` and `TableProgressStages`. */
export type RouteTrackProps =
  | (Base & { 'aria-label': string; 'aria-labelledby'?: never })
  | (Base & { 'aria-labelledby': string; 'aria-label'?: never });

/**
 * A route as one wide band: pinned stops joined by segments, the travelled
 * part filled, and a vehicle marker riding the head of the fill.
 *
 * Not `TableProgressStages` — that's the same idea shrunk into a table cell
 * (bare dots, no labels, whole segments only, no marker) and it stays as it
 * is. Not `ProgressBar` either: this has named places, and the fill is
 * geometry, not a percentage readout. Checked both before building, the same
 * way `TableProgressStages` records checking `ProgressBar` and `Tracker`.
 *
 * Every surface here is the `Button` treatment — reached stops and the filled
 * segment wear `button/primary/*`, unreached ones `button/secondary/*`,
 * including the glass catch and the coloured vignette. That's what Figma
 * authored (`RouteCard`, 10746:21164), not a liberty taken here.
 *
 * The band scrolls horizontally rather than compressing: stops keep their
 * label widths, and a long route runs off the edge. See
 * docs/components/RouteTrack.md.
 */
export const RouteTrack = forwardRef<HTMLDivElement, RouteTrackProps>(function RouteTrack(
  { stops, progress, hideVehicle, className, ...rest },
  ref,
) {
  const clamped = Math.min(1, Math.max(0, progress));
  const segments = Math.max(1, stops.length - 1);

  /* Which segment the vehicle is in, and how far across it. At exactly 1 the
     floor would land one segment past the end, so the last segment keeps it. */
  const raw = clamped * segments;
  const activeSegment = Math.min(segments - 1, Math.floor(raw));
  const withinSegment = raw - activeSegment;

  /* Standing at a stop rather than running between two. The marker then hangs
     off that stop and is centred over its pin, instead of clinging to the end
     of a bar where it would read as half-arrived. The epsilon is for the
     float: 0.2 * 5 is not exactly 1. */
  const nearest = Math.round(raw);
  const stoppedAt = Math.abs(raw - nearest) < 1e-6 ? nearest : null;

  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className={styles.lane}>
        {stops.map((stop, i) => {
          /* A stop is reached once the vehicle is at or past it. */
          const reached = clamped * segments >= i;

          /* The segment drawn in this iteration is the one *before* this stop,
             so it is segment `i - 1` — not `i`. Behind the vehicle it's full,
             ahead of it empty, and the one it's in is filled to exactly where
             the marker sits, which is what makes the two agree. */
          const segment = i - 1;
          const segmentFill =
            segment < activeSegment ? 1 : segment === activeSegment ? withinSegment : 0;

          return (
            <Fragment key={stop.id ?? i}>
              {i > 0 && (
                <div className={styles.segment}>
                  <div className={styles.line}>
                    {segmentFill > 0 && (
                      <div className={styles.lineFill} style={{ width: `${segmentFill * 100}%` }} />
                    )}
                  </div>
                  {!hideVehicle && stoppedAt == null && segment === activeSegment && (
                    <span className={styles.marker} style={{ left: `${withinSegment * 100}%` }}>
                      <VehicleMarker />
                    </span>
                  )}
                </div>
              )}
              <div className={styles.stop} data-stopped={stoppedAt === i || undefined}>
                {!hideVehicle && stoppedAt === i && (
                  <span className={styles.marker} style={{ left: '50%' }}>
                    <VehicleMarker />
                  </span>
                )}
                <span className={styles.pin} data-reached={reached || undefined}>
                  {stop.icon ?? <MapPin weight="bold" aria-hidden="true" />}
                </span>
                <span className={styles.labels}>
                  <span className={styles.place}>{stop.place}</span>
                  {stop.process != null && <span className={styles.process}>{stop.process}</span>}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
});
