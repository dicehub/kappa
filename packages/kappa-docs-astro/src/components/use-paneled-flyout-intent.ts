import { nextTick, onBeforeUnmount, ref, watch, type CSSProperties, type Ref } from "vue";

/** Keep diagonal pointer movement within the current Ark HoverCard. */
export function usePaneledFlyoutIntent(flyout: Ref<string>, instanceId: string) {
  const corridor = ref<CSSProperties>();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let frame = 0;
  let disposed = false;
  let placementDeadline = 0;
  let revision = 0;
  let origin: { label: string; x: number; pointerType: string; trigger: DOMRect } | undefined;

  function clear() {
    revision += 1;
    clearTimeout(timeout);
    cancelAnimationFrame(frame);
    corridor.value = undefined;
  }

  function prepare() {
    if (!origin) return;
    const { label, x, pointerType, trigger } = origin;
    if (pointerType === "touch" || flyout.value !== label) return;
    const content = document.querySelector<HTMLElement>(`[data-flyout-owner="${instanceId}"][data-paneled-flyout="${label}"]`);
    if (!content || !content.getClientRects().length) { retryPlacement(); return; }
    const box = content.getBoundingClientRect();
    // The menu can flip on a narrow preview. Shield only the gap toward it.
    const isRight = box.left >= x;
    const distance = isRight ? box.left - x : x - box.right;
    if (distance < 0) { retryPlacement(); return; }
    const top = Math.min(box.top, trigger.top);
    const bottom = Math.max(box.bottom, trigger.bottom);
    const width = distance + 6;
    // Allow a small sideways drift while heading into the menu. Keep the tip
    // on the menu-facing half of the trigger so straight vertical navigation
    // through the icon centers does not get caught by the corridor.
    const middle = trigger.left + trigger.width / 2;
    const pointerTip = isRight ? Math.max(x - 5, middle) : Math.min(x + 5, middle);
    const tip = isRight ? pointerTip - (x - 6) : pointerTip - box.right;
    const edge = isRight ? width : 0;
    corridor.value = {
      top: `${top - box.top}px`, height: `${bottom - top}px`, width: `${width}px`,
      left: isRight ? `${-width}px` : "100%",
      // Two connected triangles leave the trigger's full height uncovered.
      // Otherwise the shield itself would start the leave timer under a still pointer.
      clipPath: `polygon(${tip}px ${trigger.top - top}px, ${edge}px 0px, ${edge}px ${bottom - top}px, ${tip}px ${trigger.bottom - top}px, ${edge}px ${trigger.bottom - top}px, ${edge}px ${trigger.top - top}px)`,
    };
  }

  function retryPlacement() {
    if (performance.now() < placementDeadline) frame = requestAnimationFrame(prepare);
  }

  async function schedule() {
    const currentRevision = revision;
    await nextTick();
    if (disposed || revision !== currentRevision) return;
    cancelAnimationFrame(frame);
    // Ark presence and Floating placement can settle on separate frames.
    placementDeadline = performance.now() + 1000;
    frame = requestAnimationFrame(prepare);
  }

  function pointTrigger(label: string, event: PointerEvent) {
    const trigger = (event.target as Element).closest("[data-paneled-group]");
    if (!trigger) return;
    origin = { label, x: event.clientX, pointerType: event.pointerType, trigger: trigger.getBoundingClientRect() };
    clearTimeout(timeout);
    void schedule();
  }

  function leaveTrigger() { timeout = setTimeout(clear, 1000); }

  function enterContent(event: PointerEvent) {
    // The outer pointer margin and section heading are still part of the
    // handoff. Keep protection until the actual menu list receives the pointer.
    if (event.target instanceof Element && event.target.closest("[data-paneled-flyout] nav")) clear();
  }

  watch(flyout, label => {
    clear();
    if (origin?.label === label) void schedule();
  });
  onBeforeUnmount(() => { disposed = true; clear(); });
  return { corridor, pointTrigger, leaveTrigger, enterContent };
}
