<script setup lang="ts">
import { ref } from "vue";
import { Search } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";

const container = ref<HTMLElement>();
const body = ref<HTMLElement>();
const open = ref(false);
const query = ref("");
const selected = ref("");
const motion = ref<Record<string, string>>({});
const pages = ["Dashboard", "Projects", "Recently opened", "Activities", "Settings"];

function rectangleProperties(prefix: string, rectangle: DOMRect) {
  return {
    [`--kappa-morph-${prefix}-width`]: `${rectangle.width}px`,
    [`--kappa-morph-${prefix}-height`]: `${rectangle.height}px`,
    [`--kappa-morph-${prefix}-x`]: `${rectangle.x + rectangle.width / 2 - window.innerWidth / 2}px`,
    [`--kappa-morph-${prefix}-y`]: `${rectangle.y - 4}px`,
  };
}
function setOpen(next: boolean) {
  if (next === open.value) return;
  const trigger = container.value?.querySelector<HTMLElement>("[data-morph-search-trigger]");
  if (!trigger) return;
  const panel = body.value?.closest<HTMLElement>(".command-palette-morph-dialog");
  const origin = trigger.getBoundingClientRect();
  const current = panel?.getBoundingClientRect() ?? origin;
  const appearance = panel ? getComputedStyle(panel) : undefined;
  motion.value = {
    ...rectangleProperties("start", current),
    ...rectangleProperties("origin", origin),
    "--kappa-morph-start-radius": appearance?.borderRadius ?? "0.75rem",
    "--kappa-morph-start-opacity": appearance?.opacity ?? "1",
  };
  if (next) {
    trigger.focus();
    query.value = "";
  }
  open.value = next;
}
function select(item: unknown) {
  selected.value = String(item);
  setOpen(false);
}
function shortcut(event: KeyboardEvent) {
  if (event.key !== "/" || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || open.value) return;
  if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"]')) return;
  const target = event.composedPath().find(node => node instanceof HTMLElement) as HTMLElement | undefined;
  if (target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"], [role="combobox"], [role="searchbox"], [role="dialog"], [role="menu"], [role="listbox"]')) return;
  event.preventDefault();
  event.stopPropagation();
  setOpen(true);
}
</script>

<template>
  <div ref="container" class="command-palette-morph-demo" @keydown="shortcut">
    <Button variant="ghost" :icon="Search" class="command-palette-morph-demo__trigger" data-morph-search-trigger aria-label="Search or go to…" aria-keyshortcuts="/" aria-haspopup="dialog" :aria-expanded="open" @click="setOpen(true)">
      <span>Search or go to…</span><kbd aria-hidden="true">/</kbd>
    </Button>
    <p class="command-palette-morph-demo__status" role="status">{{ selected ? `Opened ${selected}.` : "" }}</p>
    <CommandPalette.Dialog :open="open" :style="motion" class="command-palette-morph-dialog" aria-label="Morphing search" @update:open="setOpen">
      <div ref="body" class="command-palette-morph-dialog__body">
        <CommandPalette.Panel v-model:value="query" :open="open" :items="pages" @close="setOpen(false)" @select="select">
          <CommandPalette.Input placeholder="Type to search…" />
          <CommandPalette.List>
            <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
            <CommandPalette.Empty>No results found.</CommandPalette.Empty>
          </CommandPalette.List>
          <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></CommandPalette.Footer>
        </CommandPalette.Panel>
      </div>
    </CommandPalette.Dialog>
  </div>
</template>

<style>
.command-palette-morph-demo { inline-size: 21.5rem; max-inline-size: 100%; margin-inline: auto; }
.command-palette-morph-demo__trigger.kappa-button { inline-size: 100%; min-inline-size: 0; block-size: 2rem; min-block-size: 2rem; border: 1px solid var(--kappa-line); border-radius: 0.75rem; background: color-mix(in srgb, var(--kappa-control) 50%, var(--kappa-tint)); color: var(--kappa-subtle); }
.command-palette-morph-demo__trigger.kappa-button[data-variant="ghost"] { --kappa-button-hover-background: color-mix(in srgb, var(--kappa-control) 50%, var(--kappa-tint)); --kappa-button-hover-foreground: var(--kappa-subtle); }
.command-palette-morph-demo__trigger.kappa-button:hover { border-color: color-mix(in srgb, var(--kappa-line) 90%, var(--kappa-subtle)); }
.command-palette-morph-demo__trigger .kappa-button__label { display: flex; flex: 1; align-items: center; gap: 0.5rem; min-inline-size: 0; }
.command-palette-morph-demo__trigger .kappa-button__label > span { flex: 1; overflow: hidden; text-align: start; text-overflow: ellipsis; white-space: nowrap; }
.command-palette-morph-demo__trigger kbd { display: grid; place-items: center; min-inline-size: 1.25rem; block-size: 1.25rem; border: 1px solid var(--kappa-line); border-radius: 0.1875rem; font: 0.75rem / 1 var(--kappa-font-mono); }
.command-palette-morph-demo__status { block-size: 1.5rem; margin: 0.5rem 0 0; overflow: hidden; color: var(--kappa-subtle); font-size: 0.875rem; line-height: 1.5rem; white-space: nowrap; text-overflow: ellipsis; }
.kappa-command-palette__positioner:has(> .command-palette-morph-dialog) { padding: 0.25rem 0.5rem 0.5rem; }
.command-palette-morph-dialog.kappa-command-palette__content { inline-size: min(48rem, calc(100vw - 1rem)); block-size: min(20rem, calc(100dvh - 0.75rem)); max-block-size: calc(100dvh - 0.75rem); border: 0; border-radius: 1rem; }
.command-palette-morph-dialog__body { display: flex; flex: 1; flex-direction: column; min-inline-size: 0; min-block-size: 0; }
.command-palette-morph-dialog .kappa-command-palette__input-header { min-block-size: 2.5rem; margin: 0.25rem; padding-inline: 0.5rem; gap: 0.5rem; border: 0; border-radius: 0.75rem; background: var(--kappa-control); }
.command-palette-morph-dialog .kappa-command-palette__input-header:focus-within { box-shadow: inset 0 0 0 2px var(--kappa-focus); }
.command-palette-morph-dialog .kappa-command-palette__input { font-size: 0.875rem; }
.command-palette-morph-dialog .kappa-command-palette__list { border-block-start: 1px solid var(--kappa-line); }
.command-palette-morph-dialog.kappa-command-palette__content[data-state="open"] { animation: command-palette-morph-in 200ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.command-palette-morph-dialog.kappa-command-palette__content[data-state="closed"] { animation: command-palette-morph-out 200ms cubic-bezier(0.22, 0.61, 0.36, 1); }
.command-palette-morph-dialog[data-state="open"] :is(.kappa-command-palette__list, .kappa-command-palette__footer) { animation: command-palette-morph-results-in 200ms ease-out; }
.kappa-command-palette__backdrop:has(+ .kappa-command-palette__positioner > .command-palette-morph-dialog) { background: color-mix(in srgb, var(--kappa-default) 24%, transparent); backdrop-filter: none; animation-duration: 200ms; }
@keyframes command-palette-morph-in {
  from { inline-size: var(--kappa-morph-start-width); block-size: var(--kappa-morph-start-height); translate: var(--kappa-morph-start-x) var(--kappa-morph-start-y); border-radius: var(--kappa-morph-start-radius); opacity: var(--kappa-morph-start-opacity); }
  to { inline-size: min(48rem, calc(100vw - 1rem)); block-size: min(20rem, calc(100dvh - 0.75rem)); translate: 0 0; border-radius: 1rem; opacity: 1; }
}
@keyframes command-palette-morph-out {
  from { inline-size: var(--kappa-morph-start-width); block-size: var(--kappa-morph-start-height); translate: var(--kappa-morph-start-x) var(--kappa-morph-start-y); border-radius: var(--kappa-morph-start-radius); opacity: var(--kappa-morph-start-opacity); }
  to { inline-size: var(--kappa-morph-origin-width); block-size: var(--kappa-morph-origin-height); translate: var(--kappa-morph-origin-x) var(--kappa-morph-origin-y); border-radius: 0.75rem; opacity: 0; }
}
@keyframes command-palette-morph-results-in { from, 35% { opacity: 0; } to { opacity: 1; } }
@media (max-width: 767px) {
  .command-palette-morph-dialog .kappa-command-palette__input { font-size: 1rem; }
}
@media (prefers-reduced-motion: reduce) {
  .command-palette-morph-dialog, .command-palette-morph-dialog :is(.kappa-command-palette__list, .kappa-command-palette__footer) { animation: none !important; }
}
</style>
