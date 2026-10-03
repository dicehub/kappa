<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldItemSlots } from "./field";

defineOptions({ inheritAttrs: false });

const props = defineProps<{ value: string }>();

defineSlots<FieldItemSlots>();
</script>

<template>
  <ArkField.Item :value="props.value">
    <slot />
  </ArkField.Item>
</template>
