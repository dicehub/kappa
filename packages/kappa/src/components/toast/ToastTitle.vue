<script setup lang="ts">
import { Toast as ArkToast } from "@ark-ui/vue/toast";
import type { ToastTitleProps, ToastPartSlots } from "./toast";
defineOptions({ inheritAttrs: false });
const props = defineProps<ToastTitleProps>();
defineSlots<ToastPartSlots>();
</script>

<template>
  <ArkToast.Title v-bind="$attrs" class="kappa-toast__title" data-slot="toast-title" :as-child="props.asChild"><slot /></ArkToast.Title>
</template>

<style src="./toast.css"></style>
