<script setup lang="ts">
import { Toast as ArkToast } from "@ark-ui/vue/toast";
import type { ToastContextSlots } from "./toast";
defineSlots<ToastContextSlots>();
</script>

<template><ArkToast.Context v-slot="toast"><slot v-bind="toast" /></ArkToast.Context></template>
