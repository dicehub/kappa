<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import type { CollapsibleEmits, CollapsibleProps, CollapsibleSlots } from "./collapsible";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<CollapsibleProps>(), {
  asChild: undefined,
  collapsedHeight: undefined,
  collapsedWidth: undefined,
  defaultOpen: undefined,
  disabled: undefined,
  id: undefined,
  ids: undefined,
  lazyMount: undefined,
  open: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<CollapsibleEmits>();
defineSlots<CollapsibleSlots>();
</script>

<template>
  <ArkCollapsible.Root
    v-bind="$attrs"
    class="kappa-collapsible"
    data-slot="collapsible"
    :as-child="props.asChild"
    :collapsed-height="props.collapsedHeight"
    :collapsed-width="props.collapsedWidth"
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

<style src="./collapsible.css"></style>
