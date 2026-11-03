<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownRadioItemProps, DropdownRadioItemSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownRadioItemProps>(), {
  asChild: undefined,
  closeOnSelect: false,
  disabled: undefined,
  inset: false,
  valueText: undefined,
});

defineSlots<DropdownRadioItemSlots>();
</script>

<template>
  <ArkMenu.RadioItem
    v-bind="$attrs"
    class="kappa-dropdown__item kappa-dropdown__option-item"
    data-slot="dropdown-radio-item"
    :as-child="props.asChild"
    :close-on-select="props.closeOnSelect"
    :data-inset="props.inset ? '' : undefined"
    :disabled="props.disabled"
    :value="props.value"
    :value-text="props.valueText"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <slot />
      <slot name="end" />
      <ArkMenu.ItemIndicator
        class="kappa-dropdown__item-indicator"
        data-slot="dropdown-radio-item-indicator"
      >
        <slot name="indicator">
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="m3 8.25 3 3 7-7" />
          </svg>
        </slot>
      </ArkMenu.ItemIndicator>
    </template>
  </ArkMenu.RadioItem>
</template>

<style src="./dropdown.css"></style>
