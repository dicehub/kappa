<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { computed } from "vue";
import {
  DROPDOWN_DEFAULT_ITEM_VARIANT,
  resolveDropdownItemVariant,
  type DropdownItemEmits,
  type DropdownItemProps,
  type DropdownItemSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownItemProps>(), {
  asChild: undefined,
  closeOnSelect: undefined,
  disabled: undefined,
  icon: undefined,
  iconProps: () => ({}),
  inset: false,
  selected: false,
  valueText: undefined,
  variant: DROPDOWN_DEFAULT_ITEM_VARIANT,
});

const emit = defineEmits<DropdownItemEmits>();
defineSlots<DropdownItemSlots>();

const resolvedVariant = computed(() => resolveDropdownItemVariant(props.variant));
</script>

<template>
  <ArkMenu.Item
    v-bind="$attrs"
    class="kappa-dropdown__item"
    data-slot="dropdown-item"
    :as-child="props.asChild"
    :close-on-select="props.closeOnSelect"
    :data-inset="props.inset ? '' : undefined"
    :data-selected="props.selected ? '' : undefined"
    :data-variant="resolvedVariant"
    :disabled="props.disabled"
    :value="props.value"
    :value-text="props.valueText"
    @select="emit('select')"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <component
        :is="props.icon"
        v-if="props.icon"
        v-bind="props.iconProps"
        aria-hidden="true"
        class="kappa-dropdown__item-icon"
        data-slot="dropdown-item-icon"
      />
      <slot v-else name="icon" />
      <slot />
      <slot name="end" />
      <slot v-if="props.selected" name="selected">
        <span class="kappa-dropdown__selected-indicator" aria-hidden="true">
          <svg viewBox="0 0 16 16" focusable="false"><path d="m3 8.25 3 3 7-7" /></svg>
        </span>
      </slot>
    </template>
  </ArkMenu.Item>
</template>

<style src="./dropdown.css"></style>
