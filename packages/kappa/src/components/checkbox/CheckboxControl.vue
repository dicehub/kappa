<script setup lang="ts">
import { Checkbox as ArkCheckbox } from "@ark-ui/vue/checkbox";
import CheckboxIndicator from "./CheckboxIndicator.vue";
import type { CheckboxControlProps, CheckboxControlSlots } from "./checkbox";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<CheckboxControlProps>(), {
  asChild: undefined,
});

defineSlots<CheckboxControlSlots>();
</script>

<template>
  <ArkCheckbox.Control
    v-bind="$attrs"
    class="kappa-checkbox__control"
    data-slot="checkbox-control"
    :as-child="asChild"
  >
    <slot>
      <CheckboxIndicator>
        <svg
          class="kappa-checkbox__mark"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M3.25 8.75 6.25 11.5 12.75 4.5"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </CheckboxIndicator>
      <CheckboxIndicator indeterminate>
        <svg
          class="kappa-checkbox__mark"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M3.5 8h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </CheckboxIndicator>
    </slot>
  </ArkCheckbox.Control>
</template>

<style src="./checkbox.css"></style>
