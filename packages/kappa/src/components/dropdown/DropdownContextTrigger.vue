<script setup lang="ts">
import { Menu as ArkMenu, useMenuContext } from "@ark-ui/vue/menu";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  useTemplateRef,
  watch,
} from "vue";
import type { DropdownContextTriggerProps, DropdownContextTriggerSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownContextTriggerProps>(), {
  asChild: undefined,
  type: "button",
});

defineSlots<DropdownContextTriggerSlots>();

const menu = useMenuContext();
const contentProps = computed(() => menu.value.getContentProps());
const contentId = computed(() => contentProps.value.id);
const popupRole = computed<"dialog" | "menu">(() =>
  contentProps.value.role === "dialog" ? "dialog" : "menu",
);
const triggerElement = useTemplateRef<HTMLElement | { $el?: HTMLElement }>("trigger");

let openedFromKeyboard = false;
let restoreFocusAfterClose = false;

const getTriggerElement = () => {
  const value = triggerElement.value;
  return value instanceof HTMLElement ? value : value?.$el;
};

const trackKeyboardOpen = (event: KeyboardEvent) => {
  openedFromKeyboard = (event.shiftKey && event.key === "F10") || event.key === "ContextMenu";
};

const trackPointerOpen = () => {
  openedFromKeyboard = false;
  restoreFocusAfterClose = false;
};

const trackEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && openedFromKeyboard && menu.value.open) {
    restoreFocusAfterClose = true;
  }
};

watch(
  () => menu.value.open,
  (open, wasOpen) => {
    if (open || !wasOpen) return;

    const shouldRestoreFocus = restoreFocusAfterClose;
    openedFromKeyboard = false;
    restoreFocusAfterClose = false;
    if (!shouldRestoreFocus) return;

    void nextTick(() => getTriggerElement()?.focus({ preventScroll: true }));
  },
);

onMounted(() => document.addEventListener("keydown", trackEscape, true));
onBeforeUnmount(() => document.removeEventListener("keydown", trackEscape, true));
</script>

<template>
  <ArkMenu.ContextTrigger
    ref="trigger"
    v-bind="$attrs"
    class="kappa-dropdown__context-trigger"
    data-slot="dropdown-context-trigger"
    :as-child="props.asChild"
    :aria-controls="contentId"
    :aria-expanded="menu.open"
    :aria-haspopup="popupRole"
    :type="props.asChild ? undefined : props.type"
    @keydown.capture="trackKeyboardOpen"
    @pointerdown.capture="trackPointerOpen"
  >
    <slot />
  </ArkMenu.ContextTrigger>
</template>

<style src="./dropdown.css"></style>
