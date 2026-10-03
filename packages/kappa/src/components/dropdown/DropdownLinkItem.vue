<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { computed } from "vue";
import {
  DROPDOWN_DEFAULT_ITEM_VARIANT,
  resolveDropdownItemVariant,
  type DropdownLinkItemEmits,
  type DropdownLinkItemProps,
  type DropdownLinkItemSlots,
} from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownLinkItemProps>(), {
  closeOnSelect: undefined,
  disabled: undefined,
  icon: undefined,
  iconProps: () => ({}),
  inset: false,
  rel: undefined,
  target: undefined,
  value: undefined,
  valueText: undefined,
  variant: DROPDOWN_DEFAULT_ITEM_VARIANT,
});

const emit = defineEmits<DropdownLinkItemEmits>();
defineSlots<DropdownLinkItemSlots>();

const resolvedRel = computed(() =>
  props.rel ?? (props.target === "_blank" ? "noopener noreferrer" : undefined),
);
const resolvedHref = computed(() => (props.disabled ? undefined : props.href));
const resolvedValue = computed(() => props.value ?? props.href);
const resolvedVariant = computed(() => resolveDropdownItemVariant(props.variant));
</script>

<template>
  <ArkMenu.Item
    :close-on-select="props.closeOnSelect"
    :disabled="props.disabled"
    :value="resolvedValue"
    :value-text="props.valueText"
    as-child
    @select="emit('select')"
  >
    <a
      v-bind="$attrs"
      class="kappa-dropdown__item kappa-dropdown__link-item"
      data-slot="dropdown-link-item"
      :data-inset="props.inset ? '' : undefined"
      :data-variant="resolvedVariant"
      :href="resolvedHref"
      :rel="resolvedRel"
      :target="props.target"
    >
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
    </a>
  </ArkMenu.Item>
</template>

<style src="./dropdown.css"></style>
