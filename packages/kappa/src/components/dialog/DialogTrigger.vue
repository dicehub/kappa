<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogTriggerProps, DialogTriggerSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogTriggerProps>(), {
  asChild: undefined,
  value: undefined,
});

defineSlots<DialogTriggerSlots>();
</script>

<template>
  <ArkDialog.Trigger
    v-bind="$attrs"
    class="kappa-dialog__trigger"
    data-slot="dialog-trigger"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkDialog.Trigger>
</template>

<style src="./dialog.css"></style>
