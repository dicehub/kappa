<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { useCommandPaletteContext } from "./command-palette-context";

defineOptions({ inheritAttrs: false });
defineSlots<{ default(props: { index: number; item: unknown; key?: string | number }): unknown }>();

const context = useCommandPaletteContext("CommandPalette.Results");
</script>

<template>
  <Combobox.List v-bind="$attrs" class="kappa-command-palette__results">
    <slot
      v-for="(item, index) in context.items.value"
      :key="context.stringifyItem(item) || index"
      :index="index"
      :item="item"
    />
  </Combobox.List>
</template>

<style src="./command-palette.css"></style>
