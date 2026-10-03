<script setup lang="ts">
import { computed } from "vue";
import {
  INPUT_GROUP_DEFAULT_ADDON_ALIGN,
  resolveInputGroupAddonAlign,
  type InputGroupAddonProps,
  type InputGroupAddonSlots,
} from "./input-group";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputGroupAddonProps>(), {
  align: INPUT_GROUP_DEFAULT_ADDON_ALIGN,
});

defineSlots<InputGroupAddonSlots>();

const resolvedAlign = computed(() => resolveInputGroupAddonAlign(props.align));

const handleMousedown = (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  if (
    target.closest(
      "button, a, input, textarea, select, [contenteditable='true'], [role='button'], [tabindex]",
    )
  ) {
    return;
  }

  const addon = event.currentTarget;
  if (!(addon instanceof HTMLElement)) return;
  const control = addon
    .closest('[data-slot="input-group"]')
    ?.querySelector<HTMLElement>('[data-slot="input-group-control"]:not(:disabled)');
  event.preventDefault();
  control?.focus();
};
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-input-group__addon"
    data-slot="input-group-addon"
    :data-align="resolvedAlign"
    @mousedown="handleMousedown"
  >
    <slot />
  </div>
</template>
