import { watchEffect, type Ref } from "vue";

export function usePaneledSearchCenter(
  toolbar: Ref<HTMLElement | undefined>,
  content: Ref<HTMLElement | undefined>,
  enabled: Readonly<Ref<boolean>>,
) {
  watchEffect(onCleanup => {
    const bar = toolbar.value;
    const page = content.value;
    if (!enabled.value || !bar || !page) return;
    const property = "--kappa-paneled-search-center-offset";
    const update = () => {
      const headerBox = bar.getBoundingClientRect();
      const pageBox = page.getBoundingClientRect();
      if (!headerBox.width || !pageBox.width) return;
      const direction = getComputedStyle(bar).direction === "rtl" ? -1 : 1;
      const offset = (pageBox.x + pageBox.width / 2 - headerBox.x - headerBox.width / 2) * direction;
      bar.style.setProperty(property, `${offset}px`);
    };
    // The scroll region can resize while the bounded content keeps its width.
    const observer = new ResizeObserver(update);
    for (const element of [bar, page, page.parentElement]) if (element) observer.observe(element);
    update();
    onCleanup(() => { observer.disconnect(); bar.style.removeProperty(property); });
  }, { flush: "post" });
}
