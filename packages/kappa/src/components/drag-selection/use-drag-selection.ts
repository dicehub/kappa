import { computed, onBeforeUnmount, ref, watch, type Ref } from "vue";
import {
  DRAG_SELECTION_DEFAULT_THRESHOLD, intersectsSelection, mergeDragSelection, selectionRectangle,
  type DragSelectionProps, type SelectionPoint, type SelectionRectangle,
} from "./drag-selection";

interface Gesture {
  pointerId: number;
  origin: SelectionPoint;
  startClient: SelectionPoint;
  client: SelectionPoint;
  initial: string[];
  additive: boolean;
  active: boolean;
}

export function useDragSelection(
  props: DragSelectionProps,
  viewport: Ref<HTMLElement | undefined>,
  selected: Ref<string[]>,
  change: (value: string[]) => void,
  notify: (event: "start" | "end", canceled?: boolean) => void,
) {
  const rectangle = ref<SelectionRectangle>();
  const dragging = computed(() => rectangle.value !== undefined);
  let gesture: Gesture | undefined;
  let frame = 0;
  let suppressClick = false;
  const interactive = (target: EventTarget | null) => target instanceof Element &&
    !!target.closest('button, a, input, textarea, select, [contenteditable="true"], [data-drag-selection-ignore]');

  const point = (x: number, y: number): SelectionPoint => {
    const el = viewport.value!;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(el.clientWidth, x - rect.left - el.clientLeft)) + el.scrollLeft,
      y: Math.max(0, Math.min(el.clientHeight, y - rect.top - el.clientTop)) + el.scrollTop,
    };
  };

  function update() {
    const el = viewport.value;
    if (!gesture?.active || !el) return;
    const bounds = el.getBoundingClientRect();
    if (props.autoScroll !== false) {
      const edge = 28;
      const speed = (position: number, start: number, end: number) =>
        position < start + edge ? -Math.min(18, (start + edge - position) / 2) :
          position > end - edge ? Math.min(18, (position - end + edge) / 2) : 0;
      el.scrollTop += speed(gesture.client.y, bounds.top, bounds.bottom);
    }
    rectangle.value = selectionRectangle(gesture.origin, point(gesture.client.x, gesture.client.y));
    const hits: string[] = [];
    for (const item of el.querySelectorAll<HTMLElement>('[data-kappa-drag-item]:not([data-disabled])')) {
      const rect = item.getBoundingClientRect();
      if (intersectsSelection(rectangle.value, {
        x: rect.left - bounds.left - el.clientLeft + el.scrollLeft,
        y: rect.top - bounds.top - el.clientTop + el.scrollTop,
        width: rect.width, height: rect.height,
      })) hits.push(item.dataset.value!);
    }
    change(mergeDragSelection(gesture.initial, hits, gesture.additive));
    frame = requestAnimationFrame(update);
  }

  const removeListeners = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", pointercancel);
    window.removeEventListener("blur", cancel);
    window.removeEventListener("keydown", keydown, true);
    cancelAnimationFrame(frame);
  };

  function finish(canceled: boolean) {
    const current = gesture;
    if (!current) return;
    gesture = undefined;
    removeListeners();
    rectangle.value = undefined;
    if (current.active) {
      if (canceled) change(current.initial);
      notify("end", canceled);
      suppressClick = true;
    }
  }

  function move(event: PointerEvent) {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    gesture.client = { x: event.clientX, y: event.clientY };
    const threshold = Number.isFinite(props.threshold) ? Math.max(1, props.threshold!) : DRAG_SELECTION_DEFAULT_THRESHOLD;
    if (!gesture.active && Math.hypot(event.clientX - gesture.startClient.x, event.clientY - gesture.startClient.y) >= threshold) {
      gesture.active = true;
      window.getSelection()?.removeAllRanges();
      notify("start");
      update();
    }
    if (gesture.active) event.preventDefault();
  }

  function up(event: PointerEvent) {
    if (event.pointerId !== gesture?.pointerId) return;
    if (gesture.active) {
      gesture.client = { x: event.clientX, y: event.clientY };
      cancelAnimationFrame(frame);
      update();
    }
    finish(false);
  }
  function cancel() { finish(true); }
  function pointercancel(event: PointerEvent) {
    if (event.pointerId === gesture?.pointerId) cancel();
  }
  function keydown(event: KeyboardEvent) {
    if (event.key === "Escape" && gesture) {
      event.preventDefault();
      event.stopPropagation();
      cancel();
    }
  }

  function pointerdown(event: PointerEvent) {
    suppressClick = false;
    if (props.disabled || props.dragDisabled || event.button !== 0 || event.pointerType === "touch" || !event.isPrimary || interactive(event.target)) return;
    cancel();
    viewport.value?.focus({ preventScroll: true });
    gesture = {
      pointerId: event.pointerId, origin: point(event.clientX, event.clientY),
      startClient: { x: event.clientX, y: event.clientY }, client: { x: event.clientX, y: event.clientY },
      initial: [...selected.value], additive: event.ctrlKey || event.metaKey || event.shiftKey, active: false,
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", pointercancel);
    window.addEventListener("blur", cancel);
    window.addEventListener("keydown", keydown, true);
  }

  function click(event: MouseEvent) {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
      return;
    }
    if (interactive(event.target)) { event.stopPropagation(); return; }
    if (!props.disabled && event.target instanceof Element && !event.target.closest("[data-kappa-drag-item]") && !event.ctrlKey && !event.metaKey && !event.shiftKey) change([]);
  }

  watch(() => [props.disabled, props.dragDisabled, props.columns, props.items], () => cancel());
  onBeforeUnmount(() => {
    gesture = undefined;
    removeListeners();
  });

  return { rectangle, dragging, pointerdown, click, interactive };
}
