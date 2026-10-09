<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const container = ref<HTMLElement>();
const open = ref(false);
const query = ref("");
const selected = ref("");
const pages = ["Dashboard", "Projects", "Recently opened", "Activities", "Settings"];
function showSearch() {
  container.value?.querySelector<HTMLElement>("[data-search-trigger]")?.focus();
  query.value = "";
  open.value = true;
}
function shortcut(event: KeyboardEvent) {
  if (event.key !== "/" || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || open.value) return;
  const target = event.composedPath().find(node => node instanceof HTMLElement) as HTMLElement | undefined;
  if (target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"], [role="combobox"], [role="searchbox"], [role="dialog"], [role="menu"]')) return;
  event.preventDefault();
  event.stopPropagation();
  showSearch();
}
</script>

<template>
  <div ref="container" class="command-palette-top-search-demo" @keydown="shortcut">
    <Button variant="ghost" :icon="Search" class="command-palette-top-search-demo__trigger" data-search-trigger aria-label="Search or go to…" aria-keyshortcuts="/" aria-haspopup="dialog" :aria-expanded="open" @click="showSearch">
      <span>Search or go to…</span><kbd aria-hidden="true">/</kbd>
    </Button>
    <p v-if="selected" role="status">Opened {{ selected }}.</p>
    <CommandPalette.Dialog v-model:open="open" class="command-palette-top-search-dialog" aria-label="Top-aligned search">
      <CommandPalette.Panel v-model:value="query" :open="open" :items="pages" @close="open = false" @select="item => { selected = String(item); open = false; }">
        <CommandPalette.Input placeholder="Search or go to…" />
        <CommandPalette.List>
          <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
          <CommandPalette.Empty>No results found.</CommandPalette.Empty>
        </CommandPalette.List>
        <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></CommandPalette.Footer>
      </CommandPalette.Panel>
    </CommandPalette.Dialog>
  </div>
</template>

<style>
.command-palette-top-search-demo { inline-size: 21.5rem; max-inline-size: 100%; margin-inline: auto; }
.command-palette-top-search-demo__trigger.kappa-button { inline-size: 100%; min-inline-size: 0; block-size: 2rem; min-block-size: 2rem; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: color-mix(in srgb, var(--kappa-control) 25%, var(--kappa-tint)); color: var(--kappa-subtle); }
.command-palette-top-search-demo__trigger.kappa-button[data-variant="ghost"] { --kappa-button-hover-background: color-mix(in srgb, var(--kappa-control) 25%, var(--kappa-tint)); --kappa-button-hover-foreground: var(--kappa-subtle); }
.command-palette-top-search-demo__trigger.kappa-button:hover { border-color: color-mix(in srgb, var(--kappa-line) 90%, var(--kappa-subtle)); }
.command-palette-top-search-demo__trigger .kappa-button__label { display: flex; flex: 1; align-items: center; gap: 0.5rem; min-inline-size: 0; }
.command-palette-top-search-demo__trigger .kappa-button__label > span { flex: 1; overflow: hidden; text-align: start; text-overflow: ellipsis; white-space: nowrap; }
.command-palette-top-search-demo__trigger kbd { display: grid; place-items: center; min-inline-size: 1.25rem; block-size: 1.25rem; border: 1px solid var(--kappa-line); border-radius: 0.1875rem; font: 0.75rem / 1 var(--kappa-font-mono); }
.kappa-command-palette__positioner:has(> .command-palette-top-search-dialog) { padding: 0.25rem 0.5rem 0.5rem; }
.command-palette-top-search-dialog.kappa-command-palette__content { inline-size: min(48rem, calc(100vw - 1rem)); max-block-size: calc(100dvh - 0.75rem); border: 0; border-radius: 1rem; transform-origin: center top; }
.command-palette-top-search-dialog .kappa-command-palette__input-header { min-block-size: 2.5rem; margin: 0.25rem; padding-inline: 0.5rem; gap: 0.5rem; border: 0; border-radius: 0.75rem; background: var(--kappa-control); }
.command-palette-top-search-dialog .kappa-command-palette__input-header:focus-within { box-shadow: inset 0 0 0 2px var(--kappa-focus); }
.command-palette-top-search-dialog .kappa-command-palette__input { font-size: 0.875rem; }
.command-palette-top-search-dialog .kappa-command-palette__list { border-block-start: 1px solid var(--kappa-line); }
.command-palette-top-search-dialog.kappa-command-palette__content[data-state="open"] { animation: command-palette-top-search-in 200ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.command-palette-top-search-dialog.kappa-command-palette__content[data-state="closed"] { animation: command-palette-top-search-out 200ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.kappa-command-palette__backdrop:has(+ .kappa-command-palette__positioner > .command-palette-top-search-dialog) { background: color-mix(in srgb, var(--kappa-default) 24%, transparent); backdrop-filter: none; animation-duration: 200ms; }
@keyframes command-palette-top-search-in { from { opacity: 0; scale: 0.8; } to { opacity: 1; scale: 1; } }
@keyframes command-palette-top-search-out { from { opacity: 1; scale: 1; } to { opacity: 0; scale: 0.8; } }
@media (max-width: 767px) {
  .command-palette-top-search-dialog .kappa-command-palette__input { font-size: 1rem; }
}
</style>
