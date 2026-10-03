<script setup lang="ts">
import { Editable as ArkEditable } from "@ark-ui/vue/editable";
import type { EditableContextSlots } from "./editable";

defineSlots<EditableContextSlots>();
</script>

<template>
  <ArkEditable.Context v-slot="context">
    <slot v-bind="context" />
  </ArkEditable.Context>
</template>
