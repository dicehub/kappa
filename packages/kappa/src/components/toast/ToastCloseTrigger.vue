<script setup lang="ts">
import { Toast as ArkToast } from "@ark-ui/vue/toast";
import type { ToastCloseTriggerProps, ToastPartSlots } from "./toast";
defineOptions({ inheritAttrs: false });
const props = defineProps<ToastCloseTriggerProps>();
defineSlots<ToastPartSlots>();
</script>

<template>
  <ArkToast.CloseTrigger v-bind="$attrs" class="kappa-toast__close" data-slot="toast-close-trigger" :as-child="props.asChild">
    <slot>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false"><path d="m4 4 8 8M12 4l-8 8" /></svg>
    </slot>
  </ArkToast.CloseTrigger>
</template>

<style src="./toast.css"></style>
