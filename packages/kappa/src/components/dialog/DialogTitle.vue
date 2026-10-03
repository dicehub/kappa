<script setup lang="ts">
import { Dialog as ArkDialog } from "@ark-ui/vue/dialog";
import type { DialogTitleProps, DialogTitleSlots } from "./dialog";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DialogTitleProps>(), {
  asChild: undefined,
});

defineSlots<DialogTitleSlots>();
</script>

<template>
  <ArkDialog.Title
    v-bind="$attrs"
    class="kappa-dialog__title"
    data-slot="dialog-title"
    :as-child="props.asChild"
  >
    <slot />
  </ArkDialog.Title>
</template>

<style src="./dialog.css"></style>
