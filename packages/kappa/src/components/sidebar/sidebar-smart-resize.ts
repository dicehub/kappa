import { computed, onScopeDispose, ref, shallowRef, watch } from "vue";
import { recordPreferredWidth, SIDEBAR_SNAP_DISTANCE, type WidthHistory } from "./sidebar-preferred-width";

interface SmartResizeOptions {
  enabled: () => boolean;
  width: () => number;
  defaultWidth: () => number;
  setWidth: (width: number) => void;
  open: () => boolean;
  geometry: () => readonly number[];
}

/** Applies a preferred width to Ark's pointer requests without replacing its interaction. */
export function useSidebarSmartResize(options: SmartResizeOptions) {
  const history = shallowRef<WidthHistory>({ samples: [], preferred: null });
  let beforeDrag = history.value;
  let beforeClickPair = history.value;
  const caught = ref(false);
  const targetPoint = computed(() => {
    if (!options.enabled()) return null;
    const [min, max] = options.geometry();
    const preferred = history.value.preferred;
    const target = preferred !== null && preferred >= min && preferred <= max ? preferred : options.defaultWidth();
    return target >= min && target <= max ? target : null;
  });
  let disposePointer: (() => void) | undefined;
  let dwell: ReturnType<typeof setTimeout> | undefined;
  let dragging = false;
  let pointerMove: PointerEvent | undefined;
  let changed = false;
  let hand = 0;
  const snapped = ref(false);
  let pausePosition = 0;
  let freeFrom: number | undefined;
  let point: number | null = null;
  let lastTarget: number | undefined;

  function clearDwell() { clearTimeout(dwell); dwell = undefined; }
  function stopPointer() {
    clearDwell();
    disposePointer?.();
    disposePointer = undefined;
    dragging = false;
    pointerMove = undefined;
    snapped.value = false;
    freeFrom = undefined;
  }
  function cancel() { stopPointer(); caught.value = false; }

  function start(event: PointerEvent) {
    if (!options.enabled() || event.button !== 0 || !event.isPrimary) return;
    stopPointer();
    beforeDrag = history.value;
    const target = event.currentTarget as HTMLElement;
    const doc = target.ownerDocument;
    const win = doc.defaultView;
    const pointerId = event.pointerId;
    const [, , , side] = options.geometry();
    const origin = event.clientX;
    const initialWidth = options.width();
    const direction = side ? -1 : 1;
    point = targetPoint.value;
    dragging = true;
    changed = false;
    lastTarget = undefined;
    const move = (next: PointerEvent) => {
      if (next.pointerId !== pointerId) return;
      if (next.pointerType === "mouse" && next.buttons === 0) { cancel(); return; }
      // Ark reads this same event in the bubble phase. Other resize requests bypass snapping.
      pointerMove = next;
      // Retain overshoot: Ark's requested width is already clamped at the bounds.
      hand = initialWidth + (next.clientX - origin) * direction;
    };
    const finishMove = (next: PointerEvent) => {
      // Ark omits equal-size requests. Still track a hold at a bound and retain
      // the fine-adjustment offset when the raw request equals the displayed edge.
      if (pointerMove === next && (snapped.value || freeFrom !== undefined) && options.open()) {
        options.setWidth(apply(options.width(), false));
      }
    };
    const finish = (next: PointerEvent) => {
      if (next.pointerId !== pointerId) return;
      const width = options.width();
      const record = next.type === "pointerup" && changed && options.open()
        && lastTarget !== undefined && Math.abs(width - lastTarget) < 0.5;
      if (next.type === "pointerup") stopPointer();
      else cancel();
      if (record) history.value = recordPreferredWidth(history.value, Math.round(width), Date.now(), point);
    };
    const lost = (next: PointerEvent) => { if (next.pointerId === pointerId) cancel(); };
    doc.addEventListener("pointermove", move, true);
    doc.addEventListener("pointerup", finish, true);
    doc.addEventListener("pointercancel", finish, true);
    doc.addEventListener("contextmenu", cancel, true);
    target.addEventListener("lostpointercapture", lost);
    win?.addEventListener("blur", cancel);
    win?.addEventListener("pointermove", finishMove);
    disposePointer = () => {
      doc.removeEventListener("pointermove", move, true);
      doc.removeEventListener("pointerup", finish, true);
      doc.removeEventListener("pointercancel", finish, true);
      doc.removeEventListener("contextmenu", cancel, true);
      target.removeEventListener("lostpointercapture", lost);
      win?.removeEventListener("blur", cancel);
      win?.removeEventListener("pointermove", finishMove);
    };
  }

  function apply(requested: number, collapsed: boolean) {
    if (!dragging || !pointerMove?.eventPhase || !options.enabled()) return requested;
    pointerMove = undefined;
    changed = true;
    if (collapsed) {
      lastTarget = undefined;
      clearDwell();
      snapped.value = false;
      freeFrom = undefined;
      return requested;
    }
    const accept = (value: number) => {
      const [min, max] = options.geometry();
      lastTarget = Math.max(min, Math.min(max, value));
      return lastTarget;
    };
    if (point === null) return accept(requested);
    if (freeFrom !== undefined) return accept(point + hand - freeFrom);
    if (Math.abs(hand - point) > SIDEBAR_SNAP_DISTANCE) {
      clearDwell();
      snapped.value = false;
      return accept(requested);
    }
    const [min, max] = options.geometry();
    if (hand < min || hand > max) {
      // A pause outside the range must not anchor fine movement beyond a bound.
      clearDwell();
      snapped.value = true;
      return accept(point);
    }
    if (!dwell || !snapped.value || Math.abs(hand - pausePosition) > SIDEBAR_SNAP_DISTANCE / 6) {
      clearDwell();
      pausePosition = hand;
      dwell = setTimeout(() => {
        if (!dragging || !snapped.value) return;
        freeFrom = hand;
        snapped.value = false;
      }, 300);
    }
    snapped.value = true;
    return accept(point);
  }

  watch([options.enabled, options.geometry], cancel, { flush: "sync" });
  onScopeDispose(cancel);
  const visiblySnapped = computed(() => snapped.value && options.open()
    && point !== null && Math.abs(options.width() - point) < 0.5);
  const inZone = computed(() => options.open() && targetPoint.value !== null
    && Math.abs(options.width() - targetPoint.value) <= SIDEBAR_SNAP_DISTANCE);
  watch(visiblySnapped, holding => { if (holding) caught.value = true; }, { flush: "sync" });
  watch(inZone, inside => { if (!inside) caught.value = false; }, { flush: "sync" });
  const zone = computed(() => options.open() && targetPoint.value !== null
    ? { width: targetPoint.value, radius: SIDEBAR_SNAP_DISTANCE, active: caught.value && inZone.value }
    : null);
  // Only the browser knows whether two releases form a double-click. A reset
  // discards movement from both clicks and keeps any earlier width samples.
  function click(event: MouseEvent) {
    if (!options.enabled()) return;
    if (event.detail === 1) beforeClickPair = beforeDrag;
    if (event.detail === 2) history.value = beforeClickPair;
  }
  return { start, apply, cancel, click, snapped: visiblySnapped, zone };
}
