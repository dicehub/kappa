import { computed, ref, watch, type Ref } from "vue";

export function usePaneledSearchDialogStyle(
  root: Ref<HTMLElement | undefined>,
  open: Ref<boolean>,
  insetHeader: Ref<boolean>,
) {
  const width = ref<number>();

  watch([open, insetHeader], ([isOpen, isInset], _previous, cleanup) => {
    if (!isInset) { width.value = undefined; return; }
    if (!isOpen) return;
    const trigger = root.value?.querySelector<HTMLElement>("[data-paneled-search]");
    if (!trigger) return;

    const update = () => {
      const viewport = document.documentElement.clientWidth;
      const { left, right } = trigger.getBoundingClientRect();
      const maximum = Math.max(0, viewport - 8);
      const minimum = Math.min(48 * parseFloat(getComputedStyle(document.documentElement).fontSize), maximum);
      // Mirror the farthest trigger edge around the viewport center, with room
      // for the dialog's input padding. Keep a usable width near the center.
      const halfWidth = Math.max(viewport / 2 - left, right - viewport / 2) + 8;
      width.value = Math.min(maximum, Math.max(minimum, halfWidth * 2));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(trigger.closest("header") ?? trigger);
    window.addEventListener("resize", update);
    cleanup(() => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    });
  }, { flush: "sync" });

  return computed(() => width.value === undefined ? undefined : {
    "--kappa-paneled-search-width": `${width.value}px`,
  });
}
