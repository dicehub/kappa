<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from "vue";
import { menuBarContextKey, type MenuBarEmits, type MenuBarProps, type MenuBarSlots } from "./menu-bar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<MenuBarProps>(), {
  defaultValue: null,
  disabled: false,
});
const emit = defineEmits<MenuBarEmits>();
defineSlots<MenuBarSlots>();

const root = ref<HTMLElement | null>(null);
const internalValue = ref<string | null>(props.defaultValue);
const activeValue = computed(() => props.modelValue === undefined ? internalValue.value : props.modelValue);
const rovingValue = ref<string | null>(null);
const pendingPointerValue = ref<string | null>(null);
let pointerSwitchVersion = 0;
const disabled = computed(() => props.disabled);

const triggers = () => Array.from(root.value?.querySelectorAll<HTMLElement>(
  '[data-menu-bar-trigger]:not(:disabled):not([aria-disabled="true"])',
) ?? []);

const setActive = (value: string | null) => {
  if ((props.disabled && value !== null) || value === activeValue.value) return;
  if (props.modelValue === undefined) internalValue.value = value;
  emit("update:modelValue", value);
};

const switchByPointer = async (value: string) => {
  const version = ++pointerSwitchVersion;
  pendingPointerValue.value = value;
  // Give the previous Ark menu a closed render before opening the next one.
  setActive(null);
  await nextTick();
  if (version !== pointerSwitchVersion) return;
  setActive(value);
  pendingPointerValue.value = null;
};

const refreshRoving = () => {
  const entries = triggers();
  if (entries.some((entry) => entry.dataset.menuBarValue === rovingValue.value)) return;
  rovingValue.value = entries[0]?.dataset.menuBarValue ?? null;
};

watch(() => props.disabled, (value) => { if (value) setActive(null); });

const focusTrigger = async (trigger: HTMLElement, keepOpen: boolean) => {
  const value = trigger.dataset.menuBarValue;
  if (!value) return;
  if (keepOpen) {
    setActive(null);
    await nextTick();
  }
  rovingValue.value = value;
  trigger.focus({ preventScroll: true });
  if (keepOpen) {
    await nextTick();
    setActive(value);
  }
};

const move = (from: string, direction: -1 | 1, keepOpen: boolean) => {
  const entries = triggers();
  if (!entries.length) return;
  const current = entries.findIndex((entry) => entry.dataset.menuBarValue === from);
  const next = entries[(current + direction + entries.length) % entries.length];
  if (next) void focusTrigger(next, keepOpen);
};

const focusEdge = (edge: "first" | "last", keepOpen: boolean) => {
  const entries = triggers();
  const target = edge === "first" ? entries[0] : entries.at(-1);
  if (target) focusTrigger(target, keepOpen);
};

const onKeydown = (event: KeyboardEvent) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !root.value?.contains(target)) return;
  const trigger = target.closest<HTMLElement>('[data-menu-bar-trigger]');
  if (!trigger) return;
  const value = trigger.dataset.menuBarValue;
  if (!value) return;
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    event.stopPropagation();
    move(value, event.key === "ArrowRight" ? 1 : -1, activeValue.value !== null);
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    event.stopPropagation();
    focusEdge(event.key === "Home" ? "first" : "last", activeValue.value !== null);
  } else if (event.key === "Escape" && activeValue.value !== null) {
    event.preventDefault();
    setActive(null);
  }
};

provide(menuBarContextKey, { activeValue, pendingPointerValue, rovingValue, disabled, setActive, switchByPointer, refreshRoving, move, focusEdge });
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="kappa-menu-bar"
    data-slot="menu-bar"
    role="menubar"
    aria-orientation="horizontal"
    :aria-disabled="props.disabled ? 'true' : undefined"
    @keydown.capture="onKeydown"
  >
    <slot />
  </div>
</template>

<style src="./menu-bar.css"></style>
