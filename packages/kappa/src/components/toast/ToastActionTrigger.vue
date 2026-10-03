<script setup lang="ts">
import { Toast as ArkToast } from "@ark-ui/vue/toast";
import type { ToastActionTriggerProps, ToastPartSlots } from "./toast";
defineOptions({ inheritAttrs: false });
const props = defineProps<ToastActionTriggerProps>();
defineSlots<ToastPartSlots>();
</script>

<template>
  <ArkToast.ActionTrigger v-bind="$attrs" class="kappa-toast__action" data-slot="toast-action-trigger" :as-child="props.asChild"><slot /></ArkToast.ActionTrigger>
</template>

<style src="./toast.css"></style>
