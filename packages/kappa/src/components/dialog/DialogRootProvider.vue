<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type {
  DialogRootProviderEmits,
  DialogRootProviderProps,
  DialogRootProviderSlots,
} from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogRootProviderProps>(), {
  lazyMount: true,
  unmountOnExit: true,
});

const emit = defineEmits<DialogRootProviderEmits>();
defineSlots<DialogRootProviderSlots>();
</script>

<template>
  <ArkDialog.RootProvider
    v-bind="$attrs"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    :value="props.value"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkDialog.RootProvider>
</template>
