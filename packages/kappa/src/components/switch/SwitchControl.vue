<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import SwitchThumb from "./SwitchThumb.vue";
import type { SwitchControlProps, SwitchControlSlots } from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchControlProps>(), {
  asChild: undefined,
});

defineSlots<SwitchControlSlots>();
</script>

<template>
  <ArkSwitch.Control
    v-bind="$attrs"
    class="kappa-switch__control"
    data-slot="switch-control"
    :as-child="props.asChild"
  >
    <slot><SwitchThumb /></slot>
  </ArkSwitch.Control>
</template>

<style src="./switch.css"></style>
