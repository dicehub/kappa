import {
  useNavigationMenu as useArkNavigationMenu,
  type UseNavigationMenuProps,
  type UseNavigationMenuReturn,
} from "@ark-ui/vue/navigation-menu";
import { computed, nextTick, onMounted, ref, unref, type MaybeRef } from "vue";

/**
 * Ark 5.39 initializes panel observers on value changes, not initial state.
 * Activate an initial value after the viewport and its teleports are mounted.
 * This also keeps server and hydration output identical. Interaction and state
 * remain owned by Ark; no synthetic selection events are sent.
 */
export function useNavigationMenu(
  props: MaybeRef<UseNavigationMenuProps> = {},
  emit?: Parameters<typeof useArkNavigationMenu>[1],
): UseNavigationMenuReturn {
  const mounted = ref(false);
  let initializing = true;
  const api = useArkNavigationMenu(computed(() => {
    const options = unref<UseNavigationMenuProps>(props);
    return {
      ...options,
      value: mounted.value ? options.value : "",
      onValueChange(details) {
        if (initializing) return;
        emit?.("valueChange", details);
        emit?.("update:value", details.value);
        options.onValueChange?.(details);
      },
    };
  }));
  onMounted(async () => {
    await nextTick();
    mounted.value = true;
    await nextTick();
    const options = unref<UseNavigationMenuProps>(props);
    if (options.value === undefined && options.defaultValue) api.value.setValue(options.defaultValue);
    await nextTick();
    initializing = false;
  });
  return computed(() => ({
    ...api.value,
    getContentProps(item) {
      const content = api.value.getContentProps(item);
      // Ark 5.39 guards viewport leave but not the content inside it.
      return {
        ...content,
        onPointerleave: unref<UseNavigationMenuProps>(props).disablePointerLeaveClose
          ? undefined : content.onPointerleave,
      };
    },
    getTriggerProps(item) {
      const trigger = api.value.getTriggerProps(item);
      return {
        ...trigger,
        onPointerdown(event: PointerEvent) {
          if (event.pointerType !== "mouse" || unref<UseNavigationMenuProps>(props).disableClickTrigger) return;
          // Cancel pending hover intent before a click toggles the menu.
          // These Ark handlers clear the open and close timers respectively.
          trigger.onPointerleave?.(event);
          api.value.getViewportProps().onPointerenter?.(event);
        },
      };
    },
  }));
}
