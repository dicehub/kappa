<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type {
  SelectRootProviderEmits,
  SelectRootProviderProps,
  SelectRootProviderSlots,
} from "./select";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectRootProviderProps>(), {
  asChild: undefined,
  lazyMount: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<SelectRootProviderEmits>();
defineSlots<SelectRootProviderSlots>();
</script>

<template>
  <ArkSelect.RootProvider
    v-bind="$attrs"
    class="kappa-select"
    data-slot="select"
    :as-child="props.asChild"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkSelect.RootProvider>
</template>

<style src="./select.css"></style>
