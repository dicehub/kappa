<script setup lang="ts">
import { Field as ArkField } from "@ark-ui/vue/field";
import type { FieldContextSlots } from "./field";

defineOptions({ inheritAttrs: false });

defineSlots<FieldContextSlots>();
</script>

<template>
  <ArkField.Context v-slot="context">
    <slot v-bind="context" />
  </ArkField.Context>
</template>
