<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, watch } from "vue";
import { Dropdown } from "../dropdown";
import { menuBarContextKey, menuBarMenuContextKey, type MenuBarSlots, type MenuBarTriggerProps } from "./menu-bar";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<MenuBarTriggerProps>(), { asChild: false, disabled: false });
defineSlots<MenuBarSlots>();
const bar = inject(menuBarContextKey);
const menu = inject(menuBarMenuContextKey);
if (!bar || !menu) throw new Error("MenuBar.Trigger must be inside MenuBar.Menu");
const resolvedDisabled = computed(() => props.disabled || bar.disabled.value);
let pointerSwitchTimer: ReturnType<typeof setTimeout> | null = null;
const cancelPointerSwitch = () => {
  if (pointerSwitchTimer !== null) clearTimeout(pointerSwitchTimer);
  pointerSwitchTimer = null;
};
const tabIndex = computed(() => {
  if (resolvedDisabled.value) return -1;
  return bar.rovingValue.value === menu.value ? 0 : -1;
});

onMounted(() => {
  if (bar.rovingValue.value === null && !resolvedDisabled.value) bar.rovingValue.value = menu.value;
});

onUnmounted(() => {
  cancelPointerSwitch();
  if (bar.activeValue.value === menu.value) bar.setActive(null);
  if (bar.rovingValue.value === menu.value) bar.rovingValue.value = null;
  void nextTick(bar.refreshRoving);
});

watch(resolvedDisabled, (value) => {
  if (value && bar.activeValue.value === menu.value) bar.setActive(null);
  void nextTick(bar.refreshRoving);
});

const onFocus = () => { if (!resolvedDisabled.value) bar.rovingValue.value = menu.value; };
const onPointerEnter = (event: PointerEvent) => {
  if (event.pointerType !== "mouse") return;
  if (resolvedDisabled.value ||
    (bar.activeValue.value === null && bar.pendingPointerValue.value === null) ||
    bar.activeValue.value === menu.value) return;
  cancelPointerSwitch();
  pointerSwitchTimer = setTimeout(() => {
    pointerSwitchTimer = null;
    if (!resolvedDisabled.value &&
      (bar.activeValue.value !== null || bar.pendingPointerValue.value !== null) &&
      bar.activeValue.value !== menu.value) bar.switchByPointer(menu.value);
  }, 90);
};
</script>

<template>
  <Dropdown.Trigger
    v-bind="$attrs"
    class="kappa-menu-bar__trigger"
    data-menu-bar-trigger=""
    :data-menu-bar-value="menu.value"
    :as-child="props.asChild"
    :disabled="resolvedDisabled"
    :tabindex="tabIndex"
    role="menuitem"
    @focus="onFocus"
    @pointerenter="onPointerEnter"
    @pointerleave="cancelPointerSwitch"
  >
    <slot />
  </Dropdown.Trigger>
</template>

<style src="./menu-bar.css"></style>
