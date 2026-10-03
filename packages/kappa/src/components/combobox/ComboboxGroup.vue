<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";

defineOptions({ inheritAttrs: false });

defineProps<{ id?: string }>();
</script>

<template>
  <Combobox.ItemGroup
    v-bind="$attrs"
    class="kappa-combobox__group"
    :id="id"
    data-slot="combobox-group"
  >
    <slot />
  </Combobox.ItemGroup>
</template>
