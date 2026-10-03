<script setup lang="ts">
import { Select as ArkSelect } from "@ark-ui/vue/select";
import type { SelectHiddenSelectProps, SelectHiddenSelectSlots } from "./select";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<SelectHiddenSelectProps>(), {
  asChild: undefined,
});

defineSlots<SelectHiddenSelectSlots>();
</script>

<template>
  <ArkSelect.HiddenSelect v-bind="$attrs" :as-child="asChild" data-slot="select-hidden-select" />
</template>

<style src="./select.css"></style>
