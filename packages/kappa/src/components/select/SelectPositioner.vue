<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import { onMounted, ref, Teleport } from "vue";
import type { SelectPositionerProps, SelectPositionerSlots } from "./select";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SelectPositionerProps>(), {
  asChild: undefined,
  teleport: true,
  teleportTo: "body",
});

defineSlots<SelectPositionerSlots>();

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkSelect.Positioner
      v-bind="$attrs"
      class="kappa-select__positioner"
      data-slot="select-positioner"
      :as-child="props.asChild"
    >
      <slot />
    </ArkSelect.Positioner>
  </Teleport>
</template>

<style src="./select.css"></style>
