<script setup lang="ts">
import { computed, useAttrs } from "vue";
import {
  INPUT_GROUP_DEFAULT_SIZE,
  isInputGroupInvalid,
  resolveInputGroupAriaBoolean,
  resolveInputGroupSize,
  type InputGroupRootProps,
  type InputGroupRootSlots,
} from "./input-group";
import {
  createInputGroupContext,
  provideInputGroupContext,
} from "./context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<InputGroupRootProps>(), {
  disabled: false,
  invalid: false,
  size: INPUT_GROUP_DEFAULT_SIZE,
});

defineSlots<InputGroupRootSlots>();

const attrs = useAttrs();
const resolvedSize = computed(() => resolveInputGroupSize(props.size));
const resolvedDisabled = computed(() => props.disabled === true);
const resolvedInvalid = computed(
  () => props.invalid === true || isInputGroupInvalid(attrs),
);
const resolvedAriaDisabled = computed(() =>
  resolveInputGroupAriaBoolean(attrs["aria-disabled"]),
);
const resolvedAriaInvalid = computed(() =>
  resolveInputGroupAriaBoolean(attrs["aria-invalid"]),
);

provideInputGroupContext(
  createInputGroupContext(
    resolvedSize,
    resolvedDisabled,
    resolvedInvalid,
  ),
);
</script>

<template>
  <div
    v-bind="$attrs"
    class="kappa-input-group"
    data-slot="input-group"
    :data-disabled="resolvedDisabled ? '' : undefined"
    :data-invalid="resolvedInvalid ? '' : undefined"
    :data-size="resolvedSize"
    :aria-disabled="resolvedDisabled ? 'true' : resolvedAriaDisabled"
    :aria-invalid="resolvedInvalid ? 'true' : resolvedAriaInvalid"
    role="group"
  >
    <slot />
  </div>
</template>

<style src="./input-group.css"></style>
