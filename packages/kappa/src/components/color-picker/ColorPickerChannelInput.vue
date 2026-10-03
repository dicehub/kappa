<script setup lang="ts">
import { ColorPicker as ArkColorPicker } from "@ark-ui/vue/color-picker";
import type { ColorPickerChannelInputProps } from "./color-picker";
defineOptions({ inheritAttrs: false }); const props = defineProps<ColorPickerChannelInputProps>();
</script>
<template><ArkColorPicker.ChannelInput v-bind="{ ...$attrs, ...props }" class="kappa-color-picker__channel-input" data-slot="color-picker-channel-input" /></template>
<style src="./color-picker.css"></style>
