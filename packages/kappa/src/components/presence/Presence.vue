<script setup lang="ts">
import { Presence as ArkPresence } from "@ark-ui/vue/presence";
import type { PresenceEmits, PresenceProps, PresenceSlots } from "./presence";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<PresenceProps>(), {
  asChild: undefined,
  immediate: undefined,
  lazyMount: undefined,
  present: false,
  skipAnimationOnMount: undefined,
  unmountOnExit: undefined,
});

const emit = defineEmits<PresenceEmits>();
defineSlots<PresenceSlots>();
</script>

<template>
  <ArkPresence
    v-bind="$attrs"
    class="kappa-presence"
    data-slot="presence"
    :as-child="props.asChild"
    :immediate="props.immediate"
    :lazy-mount="props.lazyMount"
    :present="props.present"
    :skip-animation-on-mount="props.skipAnimationOnMount"
    :unmount-on-exit="props.unmountOnExit"
    @enter-complete="emit('enterComplete')"
    @exit-complete="emit('exitComplete')"
  >
    <slot />
  </ArkPresence>
</template>

<style src="./presence.css"></style>
