<script setup lang="ts">
import { Fieldset as ArkFieldset } from "@ark-ui/vue/fieldset";
import type { FieldsetContextSlots } from "./fieldset";

defineOptions({ inheritAttrs: false });

defineSlots<FieldsetContextSlots>();
</script>

<template>
  <ArkFieldset.Context v-slot="context">
    <slot v-bind="context" />
  </ArkFieldset.Context>
</template>
