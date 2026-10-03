<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { computed } from "vue";
import { provideCommandPaletteGroupContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{ items?: unknown[] }>(), {
  items: () => [],
});
provideCommandPaletteGroupContext(computed(() => props.items));
</script>

<template>
  <Combobox.ItemGroup v-bind="$attrs" class="kappa-command-palette__group">
    <slot />
  </Combobox.ItemGroup>
</template>

<style src="./command-palette.css"></style>
