<script setup lang="ts">
import { onMounted, ref } from "vue";
import { CommandPalette, type CommandPaletteSelectOptions } from "@dicehub/kappa/components/command-palette";

const open = ref(false);
const query = ref("");
const count = ref(0);
const lastNewTab = ref(false);
const ready = ref(false);
const items = ["Copy", "Paste"];
onMounted(() => { ready.value = true; });
function select(_item: unknown, options: CommandPaletteSelectOptions) {
  count.value++;
  lastNewTab.value = options.newTab;
}
</script>

<template>
  <main>
    <button type="button" :disabled="!ready" @click="open = true">Open commands</button>
    <CommandPalette.Root v-model:open="open" v-model:value="query" :items="items" @select="select">
      <CommandPalette.Input />
      <CommandPalette.List>
        <CommandPalette.Results v-slot="{ item }">
          <CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item>
        </CommandPalette.Results>
      </CommandPalette.List>
      <CommandPalette.Footer>
        <button type="button" @click="query = 'Copy'">Set query to Copy</button>
        <output aria-label="Activation count">{{ count }}</output>
        <output aria-label="Open in new tab">{{ lastNewTab }}</output>
      </CommandPalette.Footer>
    </CommandPalette.Root>
  </main>
</template>
