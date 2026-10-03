<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import CollapsibleIndicator from "./CollapsibleIndicator.vue";
import type { CollapsibleTriggerProps, CollapsibleTriggerSlots } from "./collapsible";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleTriggerProps>(), {
  asChild: undefined,
  disabled: undefined,
});

defineSlots<CollapsibleTriggerSlots>();
</script>

<template>
  <ArkCollapsible.Trigger
    v-bind="$attrs"
    class="kappa-collapsible__trigger"
    data-slot="collapsible-trigger"
    :as-child="props.asChild"
    :disabled="props.disabled"
  >
    <slot />
    <slot v-if="!props.asChild" name="indicator">
      <CollapsibleIndicator />
    </slot>
  </ArkCollapsible.Trigger>
</template>
