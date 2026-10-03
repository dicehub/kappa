<script setup lang="ts">
import { computed, ref } from "vue";
import {
  TOGGLE_DEFAULT_SIZE,
  TOGGLE_DEFAULT_TYPE,
  TOGGLE_DEFAULT_VARIANT,
  resolveToggleSize,
  resolveToggleType,
  resolveToggleVariant,
  type ToggleEmits,
  type ToggleProps,
  type ToggleSlots,
} from "./toggle";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ToggleProps>(), {
  defaultPressed: false,
  disabled: false,
  pressed: undefined,
  size: TOGGLE_DEFAULT_SIZE,
  type: TOGGLE_DEFAULT_TYPE,
  variant: TOGGLE_DEFAULT_VARIANT,
});

const emit = defineEmits<ToggleEmits>();
defineSlots<ToggleSlots>();

const uncontrolledPressed = ref(props.defaultPressed);
const resolvedPressed = computed(() => props.pressed ?? uncontrolledPressed.value);
const resolvedSize = computed(() => resolveToggleSize(props.size));
const resolvedType = computed(() => resolveToggleType(props.type));
const resolvedVariant = computed(() => resolveToggleVariant(props.variant));

const toggle = () => {
  if (props.disabled) return;

  const nextPressed = !resolvedPressed.value;
  if (props.pressed === undefined) uncontrolledPressed.value = nextPressed;
  emit("update:pressed", nextPressed);
  emit("pressedChange", nextPressed);
};
</script>

<template>
  <button
    v-bind="$attrs"
    class="kappa-toggle"
    data-slot="toggle"
    :data-disabled="props.disabled ? '' : undefined"
    :data-pressed="resolvedPressed ? '' : undefined"
    :data-size="resolvedSize"
    :data-state="resolvedPressed ? 'on' : 'off'"
    :data-variant="resolvedVariant"
    :aria-pressed="resolvedPressed"
    :disabled="props.disabled"
    :type="resolvedType"
    @click="toggle"
  >
    <slot />
  </button>
</template>

<style src="./toggle.css"></style>
