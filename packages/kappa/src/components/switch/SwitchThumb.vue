<script setup lang="ts">
import { Switch as ArkSwitch } from "@ark-ui/vue/switch";
import type { SwitchThumbProps, SwitchThumbSlots } from "./switch";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SwitchThumbProps>(), {
  asChild: undefined,
});

defineSlots<SwitchThumbSlots>();
</script>

<template>
  <ArkSwitch.Thumb
    v-bind="$attrs"
    class="kappa-switch__thumb"
    data-slot="switch-thumb"
    :as-child="props.asChild"
  >
    <slot />
  </ArkSwitch.Thumb>
</template>

<style src="./switch.css"></style>
