<script setup lang="ts">
import { Toast as ArkToast } from "@ark-ui/vue/toast";
import type { ToastDescriptionProps, ToastPartSlots } from "./toast";
defineOptions({ inheritAttrs: false });
const props = defineProps<ToastDescriptionProps>();
defineSlots<ToastPartSlots>();
</script>

<template>
  <ArkToast.Description v-bind="$attrs" class="kappa-toast__description" data-slot="toast-description" :as-child="props.asChild"><slot /></ArkToast.Description>
</template>

<style src="./toast.css"></style>
