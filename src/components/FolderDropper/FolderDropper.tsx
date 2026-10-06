import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { ArrowClockwise, FileImage, FilePdf, FileText, X } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton';
import { Label } from '../Label';
import { LabelGroup } from '../LabelGroup';
import { Row } from '../Row';
import styles from './FolderDropper.module.css';

export type FolderDropperStatus = 'queued' | 'uploading' | 'done' | 'error';

export interface FolderDropperFile {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  status: FolderDropperStatus;
  /** 0–1, while `uploading`. */
  progress?: number;
  /** Shown on the folder while `error`. */
  error?: string;
}

export interface FolderDropperProps {
  files: FolderDropperFile[];
  /** Picked or dropped. The consumer adds them to `files` and uploads them. */
  onFilesSelected: (files: File[]) => void;
  /** A row's remove button - called once the row has shrunk away. */
  onRemove?: (id: string) => void;
  /** A failed row's retry button - the consumer sets the file back to
   * `queued` (or `uploading`) and its sheet comes back to try again. */
  onRetry?: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** The folder's words while it is empty. */
  heading?: string;
  description?: string;
  className?: string;
  /** Scales every spring's clock - for motion-review labs only. */
  timeScale?: number;
  /**
   * `side` - the list beside the folder, for many files · `stacked` - the
   * row under it, for one (owner, 2026-10-03: a narrow one-file dialog
   * widened when a list appeared beside the folder). Defaults to `side` when
   * `multiple`, `stacked` when not. Either way the space is reserved from the
   * start, so the component never changes size as files arrive.
   */
  layout?: 'side' | 'stacked';
}

/* ---- geometry (px) - 0.72 of the lab's first size (owner, 2026-10-02: "make
   it smaller generally", to fit a one-file dialog) -------------------------- */
const W = 172; // folder width
const BACK_H = 128; // back panel, tab included
const TAB_W = 66;
const TAB_H = 12;
const FRONT_H = 84; // front panel (bottom-aligned)
const SHEET_W = 96;
const SHEET_H = 100;
/** Sheet top when it sits inside - it peeks this far above the front. */
const SHEET_IN_Y = BACK_H - FRONT_H - 28;
/** Sheet top while it waits - raised most of its height above its seat. */
const SHEET_HOVER_Y = SHEET_IN_Y - SHEET_H * 0.7;
/** Shown inside at most - older files are in there, just not drawn. */
const MAX_VISIBLE = 4;
/** Waiting sheets shown above the folder at most. */
const MAX_QUEUED_VISIBLE = 3;
/** The visible sheets' fan, newest first: x offset, rotation (deg), y. */
const FAN = [
  { x: 4, r: -2, y: 3 },
  { x: -10, r: -7, y: 0 },
  { x: 13, r: 6, y: -1 },
  { x: -3, r: 3, y: -4 },
];

/* ---- springs (stiffness / damping) - as approved in the lab --------------- */
const SPRING = {
  sheet: { k: 260, c: 17 },
  sheetPop: { k: 420, c: 20 },
  front: { k: 300, c: 16 },
  lean: { k: 180, c: 14 },
  squash: { k: 520, c: 14 },
  shake: { k: 900, c: 10 },
  /** The folder's walk from the centre to the left when files arrive. */
  shift: { k: 160, c: 17 },
};
const FRONT_OPEN_DEG = -38;
const FRONT_UPLOAD_OPEN = 0.7;
const LEAN_DEG = 7;
const LEAN_PX = 10;
const LAND_KICK = -1.6;
const ERROR_KICK = 380;
/** A removed row shrinks this long before `onRemove`. */
const REMOVE_MS = 220;
/** A failed sheet jolts and shakes this long, then shrinks away - its row
 * (Failed · Retry · Remove) carries it from there (owner, 2026-10-03). */
const ERROR_SHOW_S = 0.9;

type Spring = { x: number; v: number; t: number; k: number; c: number };
const spring = (x: number, s: { k: number; c: number }): Spring => ({ x, v: 0, t: x, k: s.k, c: s.c });
const step = (s: Spring, dt: number) => {
  const n = Math.ceil(dt / (1 / 240));
  const h = dt / n;
  for (let i = 0; i < n; i++) {
    s.v += (-s.k * (s.x - s.t) - s.c * s.v) * h;
    s.x += s.v * h;
  }
};
type SheetState = {
  x: Spring;
  y: Spring;
  r: Spring;
  scale: Spring;
  shake: Spring;
  landed: boolean;
  /** Spring-clock time it failed at, while failed. */
  erroredAt: number | null;
};

const bytes = (n: number) =>
  n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;
const fileIcon = (name: string) =>
  /\.(png|jpe?g|gif|webp|heic)$/i.test(name) ? (
    <FileImage weight="fill" />
  ) : /\.pdf$/i.test(name) ? (
    <FilePdf weight="fill" />
  ) : (
    <FileText weight="fill" />
  );

/* ---- accept - enforced, not just a picker hint (owner, 2026-10-03: "you
   can't put a cat gif instead of a document"). `accept` on the input only
   filters the picker's default view; a drop, or "All files" in the picker,
   gets anything through. ------------------------------------------------- */
const EXT_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  heic: 'image/heic',
};
const tokens = (accept?: string) =>
  (accept ?? '')
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
/** A MIME type against `accept` - '' (the browser didn't say) passes. */
function mimeAccepted(mime: string, accept?: string) {
  const list = tokens(accept);
  if (!list.length || !mime) return true;
  const m = mime.toLowerCase();
  return list.some((t) =>
    t.startsWith('.') ? EXT_MIME[t.slice(1)] === m : t.endsWith('/*') ? m.startsWith(t.slice(0, -1)) : t === m,
  );
}
/** A file against `accept` - by extension, or by its MIME type. */
function fileAccepted(file: File, accept?: string) {
  const list = tokens(accept);
  if (!list.length) return true;
  const name = file.name.toLowerCase();
  if (list.some((t) => t.startsWith('.') && name.endsWith(t))) return true;
  return !!file.type && list.some((t) => !t.startsWith('.') && mimeAccepted(file.type, t));
}
/** "PDF, PNG or JPG" - what `accept` allows, in words. */
function acceptWords(accept?: string) {
  const words: string[] = [];
  for (const t of tokens(accept)) {
    const w = t.startsWith('.')
      ? t.slice(1).toUpperCase()
      : t.endsWith('/*')
        ? `${t.slice(0, -2)}s`
        : (Object.keys(EXT_MIME).find((e) => EXT_MIME[e] === t)?.toUpperCase() ?? t);
    if (!words.includes(w) && !(w === 'JPEG' && words.includes('JPG'))) words.push(w);
  }
  return words.length > 1 ? `${words.slice(0, -1).join(', ')} or ${words[words.length - 1]}` : (words[0] ?? 'a file');
}
/** How long a refused file's message stays on the folder. */
const REFUSED_MS = 2600;
/** The folder's "no" - a sideways wobble on the lean springs (px/s, deg/s). */
const REFUSE_KICK_X = 260;
const REFUSE_KICK_R = 90;

/**
 * The document upload (owner, 2026-10-02 - a folder, from a reference, built
 * in a lab first): a folder files drop into as they upload, and a list of
 * every file beside it.
 *
 * - **Folder** - the back in the primary button's glass, a frosted front at a
 *   quarter of that fill (deepening behind its words), white sheets between.
 *   At most four sheets show, however many files it holds.
 * - **Upload** - a picked file's sheet grows in above the folder, the front
 *   swings partly open, the sheet sinks as `progress` rises and drops in on
 *   `done` with a bounce; the folder squashes on the landing. Up to three
 *   waiting sheets pile above. An `error` jolts the sheet back up and shakes
 *   it, red-edged.
 * - **Drag-over** - the front swings fully open and the folder leans toward
 *   the pointer, following it.
 * - **Layout** - centred while empty; when files arrive it walks to the left
 *   and the list grows in beside it, newest first, a row per finished file.
 *
 * All motion is springs, integrated per frame (a beat that starts early takes
 * the last one's velocity); nothing fades. Reduced motion: everything jumps
 * to its end state.
 *
 * Controlled: the consumer owns `files` and the upload; this only shows them.
 */
export function FolderDropper({
  files,
  onFilesSelected,
  onRemove,
  onRetry,
  accept,
  multiple = false,
  disabled,
  heading = 'Upload document',
  description = 'Click or drop a file',
  className,
  timeScale = 1,
  layout: layoutProp,
}: FolderDropperProps) {
  const layout = layoutProp ?? (multiple ? 'side' : 'stacked');
  const rootRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const shiftRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetEls = useRef(new Map<string, HTMLDivElement>());
  const sheets = useRef(new Map<string, SheetState>());
  const filterId = `folder-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [dragOver, setDragOver] = useState(false);
  /** A drag whose files are the wrong type - the folder stays shut. */
  const [dragRefused, setDragRefused] = useState(false);
  /** The last refused pick, shown on the folder for a moment. */
  const [refused, setRefused] = useState<string | null>(null);
  const refusedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(refusedTimer.current), []);
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const pointer = useRef({ x: 0, y: 0 });
  const centreOffset = useRef(0);
  const world = useRef({
    front: spring(0, SPRING.front),
    leanR: spring(0, SPRING.lean),
    leanX: spring(0, SPRING.lean),
    leanY: spring(0, SPRING.lean),
    squash: spring(1, SPRING.squash),
    shift: spring(0, SPRING.shift),
    shiftY: spring(0, SPRING.shift),
  });
  /** How far up "centred" is: half the room kept above for the sheets. */
  const centreLift = useRef(0);
  const slotRef = useRef<HTMLDivElement>(null);
  const live = useRef({ files, dragOver, timeScale, removing, layout });
  live.current = { files, dragOver, timeScale, removing, layout };

  // Where "centred" is: half the free width. Measured, and re-measured on
  // resize; the first measure places it there without a walk.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let first = true;
    const measure = () => {
      const padLeft = parseFloat(getComputedStyle(root).paddingLeft) || 0;
      centreOffset.current = Math.max(0, (root.clientWidth - W) / 2 - padLeft);
      // Empty, it sits in the middle of the whole box - the room kept above
      // for sheets included (and, stacked, the row's slot below); files
      // arriving, it settles to where the sheets have their room (owner,
      // 2026-10-03).
      const cs = getComputedStyle(root);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const below = live.current.layout === 'stacked' && slotRef.current
        ? slotRef.current.offsetHeight + (parseFloat(cs.rowGap) || 0)
        : 0;
      centreLift.current = (below - padTop) / 2;
      if (first && !live.current.files.length) {
        world.current.shift.x = world.current.shift.t = centreOffset.current;
        world.current.shiftY.x = world.current.shiftY.t = centreLift.current;
        if (shiftRef.current) {
          shiftRef.current.style.transform = `translate(${centreOffset.current}px, ${centreLift.current}px)`;
        }
      }
      first = false;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (slotRef.current) ro.observe(slotRef.current);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let last = performance.now();
    let clock = 0;
    const frame = (now: number) => {
      const { files: fs, dragOver: over, timeScale: ts } = live.current;
      const dt = Math.min((now - last) / 1000, 1 / 30) * ts;
      last = now;
      clock += dt;
      const w = world.current;
      const ptr = pointer.current;

      const waiting = fs.filter((f) => f.status === 'queued' || f.status === 'uploading');
      w.front.t = over ? 1 : waiting.length ? FRONT_UPLOAD_OPEN : 0;
      w.leanR.t = over ? ptr.x * LEAN_DEG : 0;
      w.leanX.t = over ? ptr.x * LEAN_PX : 0;
      w.leanY.t = over ? ptr.y * LEAN_PX * 0.5 : 0;
      // Stacked, it stays centred across; beside a list, it walks left.
      w.shift.t = fs.length && live.current.layout === 'side' ? 0 : centreOffset.current;
      w.shiftY.t = fs.length ? 0 : centreLift.current;

      const done = fs.filter((f) => f.status === 'done');
      const doneSlot = new Map(done.slice().reverse().map((f, i) => [f.id, i]));
      let queueIndex = 0;

      for (const f of fs) {
        let s = sheets.current.get(f.id);
        if (!s) {
          s = {
            x: spring(0, SPRING.sheet),
            y: spring(SHEET_HOVER_Y, SPRING.sheet),
            r: spring(0, SPRING.sheet),
            scale: spring(0, SPRING.sheetPop),
            shake: spring(0, SPRING.shake),
            landed: f.status === 'done',
            erroredAt: null,
          };
          if (f.status === 'done') {
            // Already in the folder when it mounted - no entrance.
            const slot = doneSlot.get(f.id) ?? MAX_VISIBLE;
            const fan = FAN[Math.min(slot, MAX_VISIBLE - 1)]!;
            s.y.x = SHEET_IN_Y + fan.y;
            s.x.x = fan.x;
            s.r.x = fan.r;
            s.scale.x = slot < MAX_VISIBLE ? 1 : 0;
          }
          sheets.current.set(f.id, s);
        }
        // Retried: a fresh try - it may fail (and shake) again.
        if (f.status !== 'error' && s.erroredAt !== null) s.erroredAt = null;

        if (f.status === 'done') {
          const slot = doneSlot.get(f.id) ?? 0;
          const fan = FAN[Math.min(slot, MAX_VISIBLE - 1)]!;
          s.x.t = fan.x;
          s.r.t = fan.r;
          s.y.t = slot >= MAX_VISIBLE ? BACK_H - SHEET_H * 0.4 : SHEET_IN_Y + fan.y;
          s.scale.t = slot >= MAX_VISIBLE ? 0 : 1;
          if (!s.landed) {
            s.landed = true;
            w.squash.v += LAND_KICK;
          }
        } else if (f.status === 'uploading') {
          s.scale.t = 1;
          s.x.t = 0;
          s.r.t = 0;
          s.y.t = SHEET_HOVER_Y + (SHEET_IN_Y - 12 - SHEET_HOVER_Y) * Math.min(1, Math.max(0, f.progress ?? 0));
        } else if (f.status === 'queued') {
          const q = queueIndex++;
          s.scale.t = q < MAX_QUEUED_VISIBLE ? 0.82 - q * 0.08 : 0;
          s.x.t = (q % 2 ? -1 : 1) * (6 + q * 4);
          s.r.t = (q % 2 ? -1 : 1) * (3 + q * 2);
          s.y.t = SHEET_HOVER_Y - 14 - Math.min(q, MAX_QUEUED_VISIBLE - 1) * 9;
        } else {
          if (s.erroredAt === null) {
            s.erroredAt = clock;
            s.shake.v = ERROR_KICK;
            s.y.v -= 240;
          }
          s.y.t = SHEET_HOVER_Y - 6;
          s.r.t = 0;
          s.x.t = 0;
          s.scale.t = clock - s.erroredAt < ERROR_SHOW_S ? 1 : 0;
        }
      }
      for (const [id, s] of sheets.current) {
        if (!fs.some((f) => f.id === id)) {
          s.scale.t = 0;
          if (Math.abs(s.scale.x) < 0.01 && Math.abs(s.scale.v) < 0.05) sheets.current.delete(id);
        }
      }

      const springs: Spring[] = [w.front, w.leanR, w.leanX, w.leanY, w.squash, w.shift, w.shiftY];
      for (const s of sheets.current.values()) springs.push(s.x, s.y, s.r, s.scale, s.shake);
      for (const s of springs) {
        if (reduced) {
          s.x = s.t;
          s.v = 0;
        } else {
          step(s, dt);
        }
      }

      if (shiftRef.current) shiftRef.current.style.transform = `translate(${w.shift.x}px, ${w.shiftY.x}px)`;
      const sq = w.squash.x;
      if (folderRef.current) {
        folderRef.current.style.transform = `translate(${w.leanX.x}px, ${w.leanY.x}px) rotate(${w.leanR.x}deg) scale(${2 - sq}, ${sq})`;
      }
      if (frontRef.current) frontRef.current.style.transform = `rotateX(${w.front.x * FRONT_OPEN_DEG}deg)`;
      for (const [id, s] of sheets.current) {
        const el = sheetEls.current.get(id);
        if (!el) continue;
        const k = s.shake.x;
        el.style.transform = `translate(${s.x.x + k}px, ${s.y.x}px) rotate(${s.r.x + k * 0.05}deg) scale(${Math.max(0, s.scale.x)})`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  // ---- the front panel's words ----
  const done = files.filter((f) => f.status === 'done');
  const pending = files.filter((f) => f.status === 'queued' || f.status === 'uploading');
  const uploading = files.find((f) => f.status === 'uploading');
  const failed = files.filter((f) => f.status === 'error');
  let title = heading;
  let detail = description;
  if (dragRefused) {
    title = 'Can’t add this file';
    detail = `Use ${acceptWords(accept)}`;
  } else if (dragOver) {
    title = 'Drop to upload';
    detail = done.length ? `${done.length} in this folder` : description;
  } else if (refused) {
    title = `Can’t add ${refused}`;
    detail = `Use ${acceptWords(accept)}`;
  } else if (uploading) {
    title = pending.length + done.length > 1 ? `Uploading ${done.length + 1} of ${done.length + pending.length}…` : 'Uploading…';
    detail = `${Math.round((uploading.progress ?? 0) * 100)}% · ${uploading.name}`;
  } else if (failed.length) {
    title = failed.length === 1 ? 'Upload failed' : `${failed.length} uploads failed`;
    detail = 'Retry or remove it';
  } else if (done.length) {
    title = done[done.length - 1]!.name;
    const total = done.reduce((sum, f) => sum + (f.size ?? 0), 0);
    detail = `${done.length} file${done.length === 1 ? '' : 's'}${total ? ` · ${bytes(total)}` : ''}`;
  }

  /** The list: finished and failed files, in the order they came. */
  const listed = files.filter((f) => f.status === 'done' || f.status === 'error');

  const order = [...files].sort((a, b) => rank(a, files) - rank(b, files));
  const leaving = [...sheets.current.keys()].filter((id) => !files.some((f) => f.id === id));

  const track = (e: DragEvent) => {
    const r = folderRef.current?.parentElement?.getBoundingClientRect();
    if (!r) return;
    pointer.current = {
      x: Math.max(-1, Math.min(1, ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 0.8)),
      y: Math.max(-1, Math.min(1, ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 0.8)),
    };
  };
  const endDrag = () => {
    setDragOver(false);
    setDragRefused(false);
    pointer.current = { x: 0, y: 0 };
  };
  /** While dragging only MIME types are known (no names); none matching -
   * and the browser saying what they are - means refuse. */
  const dragAcceptable = (e: DragEvent) => {
    const types = [...e.dataTransfer.items].filter((i) => i.kind === 'file').map((i) => i.type);
    return !types.length || types.some((t) => !t || mimeAccepted(t, accept));
  };
  const pick = (list: FileList | null) => {
    const all = [...(list ?? [])];
    const ok = all.filter((f) => fileAccepted(f, accept));
    const bad = all.filter((f) => !fileAccepted(f, accept));
    if (bad.length) {
      // The folder shakes its head, and says why.
      const w = world.current;
      w.leanX.v += REFUSE_KICK_X;
      w.leanR.v += REFUSE_KICK_R;
      setRefused(bad.length === 1 ? bad[0]!.name : `${bad.length} files`);
      window.clearTimeout(refusedTimer.current);
      refusedTimer.current = window.setTimeout(() => setRefused(null), REFUSED_MS / timeScale);
    }
    if (ok.length) onFilesSelected(multiple ? ok : ok.slice(0, 1));
  };
  const remove = (id: string) => {
    setRemoving((r) => new Set(r).add(id));
    window.setTimeout(() => {
      onRemove?.(id);
      setRemoving((r) => {
        const next = new Set(r);
        next.delete(id);
        return next;
      });
    }, REMOVE_MS / timeScale);
  };

  return (
    <div
      ref={rootRef}
      className={cn(styles.root, className)}
      data-disabled={disabled || undefined}
      data-drag-over={dragOver || undefined}
      data-layout={layout}
      style={{ '--_remove-ms': `${REMOVE_MS / timeScale}ms` } as CSSProperties}
      onDragEnter={(e) => {
        if (disabled) return;
        e.preventDefault();
        if (dragAcceptable(e)) {
          setDragOver(true);
          setDragRefused(false);
          track(e);
        } else {
          setDragRefused(true);
        }
      }}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        if (!dragRefused) track(e);
        e.dataTransfer.dropEffect = dragRefused ? 'none' : 'copy';
      }}
      onDragLeave={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) endDrag();
      }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        endDrag();
        pick(e.dataTransfer.files);
      }}
    >
      <div ref={shiftRef} className={styles.shift}>
        <button
          type="button"
          className={styles.target}
          disabled={disabled}
          aria-label={`${title}. ${detail}`}
          onClick={() => inputRef.current?.click()}
        >
          <div ref={folderRef} className={styles.folder} style={{ width: W, height: BACK_H }}>
            <svg className={styles.back} width={W} height={BACK_H} viewBox={`0 0 ${W} ${BACK_H}`} aria-hidden="true">
              <defs>
                <filter
                  id={filterId}
                  x={-16}
                  y={-16}
                  width={W + 32}
                  height={BACK_H + 32}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feGaussianBlur in="SourceAlpha" stdDeviation={4} />
                  <feOffset dy={1} result="dropShape" />
                  <feFlood floodColor="#000" floodOpacity={0.2} />
                  <feComposite in2="dropShape" operator="in" result="drop" />
                  <feOffset in="SourceAlpha" dx={2} dy={2} />
                  <feGaussianBlur stdDeviation={7} result="innerShifted" />
                  <feComposite in="SourceAlpha" in2="innerShifted" operator="out" result="innerBand" />
                  <feFlood style={{ floodColor: 'var(--color-button-primary-shadow-default)' }} />
                  <feComposite in2="innerBand" operator="in" result="inner" />
                  <feOffset in="SourceAlpha" dx={1.5} dy={1.5} result="catchShifted" />
                  <feComposite in="SourceAlpha" in2="catchShifted" operator="out" result="catchBand" />
                  <feFlood style={{ floodColor: 'var(--color-button-primary-border-default)' }} />
                  <feComposite in2="catchBand" operator="in" result="catch" />
                  <feMerge>
                    <feMergeNode in="drop" />
                    <feMergeNode in="SourceGraphic" />
                    <feMergeNode in="inner" />
                    <feMergeNode in="catch" />
                  </feMerge>
                </filter>
              </defs>
              <path d={backPath()} className={styles.backShape} filter={`url(#${filterId})`} />
            </svg>

            <div className={styles.sheets} aria-hidden="true">
              {[...order.map((f) => f.id), ...leaving].map((id) => (
                <div
                  key={id}
                  ref={(el) => {
                    if (el) sheetEls.current.set(id, el);
                    else sheetEls.current.delete(id);
                  }}
                  className={styles.sheet}
                  style={{ width: SHEET_W, height: SHEET_H, left: (W - SHEET_W) / 2, transform: 'scale(0)' }}
                  data-error={files.find((f) => f.id === id)?.status === 'error' || undefined}
                >
                  <span className={styles.line} style={{ width: '58%' }} />
                  <span className={styles.line} style={{ width: '82%' }} />
                  <span className={styles.line} style={{ width: '70%' }} />
                </div>
              ))}
            </div>

            <div ref={frontRef} className={styles.front} style={{ height: FRONT_H }} aria-hidden="true">
              <span className={styles.title}>{title}</span>
              <span className={styles.detail}>{detail}</span>
            </div>
          </div>
        </button>
      </div>

      {/* Reserved from the start - rows arriving never resize the component. */}
      <div ref={slotRef} className={styles.list} aria-label="Uploaded files">
        <div className={styles.listScroll}>
          {listed
            .slice()
            .reverse()
            .map((f) => (
              <div key={f.id} className={styles.item} data-removing={removing.has(f.id) || undefined}>
                <div className={styles.itemInner}>
                  {/* As the parts in a repair's close: a large neutral tile, the
                      name over the size, a small secondary remove, no divider
                      (owner, 2026-10-06). */}
                  <Row
                    size="md"
                    divider="none"
                    leading={{ icon: fileIcon(f.name), size: 'lg' }}
                    heading={f.name}
                    description={
                      <LabelGroup>
                        {f.status === 'error' ? (
                          <Label color="danger">{f.error ?? 'Didn’t upload'}</Label>
                        ) : (
                          <Label>{f.size != null ? bytes(f.size) : 'Uploaded'}</Label>
                        )}
                      </LabelGroup>
                    }
                    action={
                      <span className={styles.actions}>
                        {f.status === 'error' && onRetry ? (
                          <IconButton
                            variant="secondary"
                            size="sm"
                            icon={<ArrowClockwise weight="bold" />}
                            aria-label={`Retry ${f.name}`}
                            disabled={disabled}
                            onClick={() => onRetry(f.id)}
                          />
                        ) : null}
                        {onRemove ? (
                          <IconButton
                            variant="secondary"
                            size="sm"
                            icon={<X weight="bold" />}
                            aria-label={`Remove ${f.name}`}
                            disabled={disabled}
                            onClick={() => remove(f.id)}
                          />
                        ) : null}
                      </span>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/** Paint order: done sheets oldest→newest, then waiting, then the one uploading. */
function rank(f: FolderDropperFile, all: FolderDropperFile[]) {
  if (f.status === 'uploading') return 3e6;
  if (f.status === 'queued' || f.status === 'error') return 2e6 - all.indexOf(f);
  return all.indexOf(f);
}

/** The back panel: a rounded body, the tab on its top left. */
function backPath() {
  const R = 12;
  const r = 9;
  const slope = 10;
  return [
    `M0 ${r}`,
    `A${r} ${r} 0 0 1 ${r} 0`,
    `L${TAB_W - 7} 0`,
    `C${TAB_W - 1} 0 ${TAB_W + 1} ${TAB_H} ${TAB_W + slope} ${TAB_H}`,
    `L${W - R} ${TAB_H}`,
    `A${R} ${R} 0 0 1 ${W} ${TAB_H + R}`,
    `L${W} ${BACK_H - R}`,
    `A${R} ${R} 0 0 1 ${W - R} ${BACK_H}`,
    `L${R} ${BACK_H}`,
    `A${R} ${R} 0 0 1 0 ${BACK_H - R}`,
    'Z',
  ].join(' ');
}
