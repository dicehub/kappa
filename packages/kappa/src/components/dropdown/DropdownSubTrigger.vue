<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import type { DropdownSubTriggerProps, DropdownSubTriggerSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownSubTriggerProps>(), {
  asChild: undefined,
  disabled: false,
  icon: undefined,
  iconProps: () => ({}),
  inset: false,
});

defineSlots<DropdownSubTriggerSlots>();

const guardDisabledInteraction = (event: Event) => {
  if (!props.disabled) return;

  event.preventDefault();
  event.stopImmediatePropagation();
};

const guardDisabledKeydown = (event: KeyboardEvent) => {
  if (!["Enter", " ", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    return;
  }
  guardDisabledInteraction(event);
};
</script>

<template>
  <ArkMenu.TriggerItem
    v-bind="$attrs"
    class="kappa-dropdown__item kappa-dropdown__sub-trigger"
    data-slot="dropdown-sub-trigger"
    :aria-disabled="props.disabled ? true : undefined"
    :as-child="props.asChild"
    :data-disabled="props.disabled ? '' : undefined"
    :data-inset="props.inset ? '' : undefined"
    @click.capture="guardDisabledInteraction"
    @keydown.capture="guardDisabledKeydown"
    @pointerdown.capture="guardDisabledInteraction"
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
      <slot name="end">
        <svg
          class="kappa-dropdown__sub-caret"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 3.75 4.25 4.25L6 12.25" />
        </svg>
      </slot>
    </template>
  </ArkMenu.TriggerItem>
</template>

<style src="./dropdown.css"></style>
