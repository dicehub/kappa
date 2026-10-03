<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import CollapsibleSectionIndicator from "./CollapsibleSectionIndicator.vue";
import type {
  CollapsibleSectionTriggerProps,
  CollapsibleSectionTriggerSlots,
} from "./collapsible-section";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleSectionTriggerProps>(), {
  disabled: undefined,
});

defineSlots<CollapsibleSectionTriggerSlots>();
</script>

<template>
  <ArkCollapsible.Trigger
    v-bind="$attrs"
    class="kappa-collapsible-section__trigger"
    data-slot="collapsible-section-trigger"
    :disabled="props.disabled"
  >
    <slot name="indicator">
      <CollapsibleSectionIndicator />
    </slot>
    <span class="kappa-collapsible-section__label" data-slot="collapsible-section-label">
      <slot />
    </span>
  </ArkCollapsible.Trigger>
</template>
