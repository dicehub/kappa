import { useFocusVisible } from "@ark-ui/vue/interaction";
import { computed, ref, watch } from "vue";

/** Ark keeps focus on Content while the pointer changes the highlighted item. */
export function useDropdownFocus(isOpen: () => boolean) {
  const focusVisible = useFocusVisible();
  const pointerHover = ref(false);

  watch(isOpen, () => { pointerHover.value = false; });

  return {
    keyboardFocus: computed(() => focusVisible.value && !pointerHover.value),
    onPointerMove: () => { pointerHover.value = true; },
    onKeyDown: () => { pointerHover.value = false; },
  };
}
