<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import { computed } from "vue";
import type {
  CollapsibleSectionEmits,
  CollapsibleSectionProps,
  CollapsibleSectionSlots,
} from "./collapsible-section";
import {
  COLLAPSIBLE_SECTION_DEFAULT_SIZE,
  resolveCollapsibleSectionSize,
} from "./collapsible-section";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleSectionProps>(), {
  defaultOpen: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  open: undefined,
  size: COLLAPSIBLE_SECTION_DEFAULT_SIZE,
  unmountOnExit: undefined,
});

const emit = defineEmits<CollapsibleSectionEmits>();
defineSlots<CollapsibleSectionSlots>();

const resolvedSize = computed(() => resolveCollapsibleSectionSize(props.size));
</script>

<template>
  <ArkCollapsible.Root
    v-bind="$attrs"
    class="kappa-collapsible-section"
    data-slot="collapsible-section"
    :data-size="resolvedSize"
    :default-open="props.defaultOpen"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :lazy-mount="props.lazyMount"
    :open="props.open"
    :unmount-on-exit="props.unmountOnExit"
    @exit-complete="emit('exitComplete')"
    @open-change="emit('openChange', $event)"
    @update:open="emit('update:open', $event)"
  >
    <slot />
  </ArkCollapsible.Root>
</template>

<style src="./collapsible-section.css"></style>
