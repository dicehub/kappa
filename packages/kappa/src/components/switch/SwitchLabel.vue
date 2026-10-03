<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import type { SwitchLabelProps, SwitchLabelSlots } from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchLabelProps>(), {
  asChild: undefined,
});

defineSlots<SwitchLabelSlots>();
</script>

<template>
  <ArkSwitch.Label
    v-bind="$attrs"
    class="kappa-switch__label"
    data-slot="switch-label"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSwitch.Label>
</template>

<style src="./switch.css"></style>
