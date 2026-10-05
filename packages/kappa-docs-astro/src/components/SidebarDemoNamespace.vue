<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherItems, namespaceSwitcherActions, namespaceSwitcherFooterActions, namespaceSwitcherWorkspaceActions } from "../data/workspace-switcher-demo";
import { ChevronsUpDown } from "@lucide/vue";

const namespace = defineModel<string>({ required: true });
const emit = defineEmits<{ add: []; action: [label: string] }>();
const open = ref(false);
const isMac = ref(false);
const namespaces = namespaceSwitcherItems;
const items = computed(() => namespaces.map((item, index) => ({ ...item,
  shortcut: `${isMac.value ? '⌘' : 'Ctrl '}${index + 1}`,
  ariaKeyshortcuts: `${isMac.value ? 'Meta' : 'Control'}+${index + 1}`,
})));
const selected = computed(() => namespaces.find(item => item.name === namespace.value) ?? namespaces[0]);
const desktopPositioning = { placement: "right-start", gutter: 8, strategy: "fixed" } as const;
const endPositioning = { placement: "left-start", gutter: 8, strategy: "fixed" } as const;
const mobilePositioning = { placement: "bottom-start", gutter: 6, strategy: "fixed" } as const;
onMounted(() => { isMac.value = /Mac|iPhone|iPad/.test(navigator.platform); });

// Shortcuts belong to this open menu, never to the page or browser tabs.
function onShortcut(event: KeyboardEvent) {
  if (!open.value || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey || event.isComposing || event.repeat) return;
  const item = namespaces[Number(event.key) - 1];
  if (!item) return;
  event.preventDefault();
  event.stopPropagation();
  namespace.value = item.name;
  open.value = false;
}
</script>

<template>
  <Sidebar.Context v-slot="{ isMobile, side, setMobileOpen }">
    <WorkspaceSwitcher v-model="namespace" v-model:open="open" :items="items" label="Namespaces" account-label="casey@example.test"
      :actions="namespaceSwitcherActions" :workspace-actions="namespaceSwitcherWorkspaceActions" :footer-actions="namespaceSwitcherFooterActions"
      :teleport="!isMobile" :positioning="isMobile ? mobilePositioning : side === 'end' ? endPositioning : desktopPositioning"
      @keydown="onShortcut" @action="action => { action.value === 'add-namespace' ? emit('add') : emit('action', action.label); setMobileOpen(false); }">
      <template #trigger>
        <Sidebar.MenuButton :icon="selected.icon" :tooltip="`Namespace: ${namespace}`" :aria-label="`Namespace: ${namespace}`" class="sidebar-demo__namespace">
          <ChevronsUpDown class="sidebar-demo__switch-icon" aria-hidden="true" />
          <span class="sidebar-demo__identity"><strong>{{ namespace }}</strong><small>Namespace</small></span>
        </Sidebar.MenuButton>
      </template>
    </WorkspaceSwitcher>
  </Sidebar.Context>
</template>
