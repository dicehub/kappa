<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Building2, ChevronsUpDown, FlaskConical, Plus, UserRound } from "@lucide/vue";

const namespace = defineModel<string>({ required: true });
const emit = defineEmits<{ add: [] }>();
const open = ref(false);
const isMac = ref(false);
const namespaces = [
  { name: "Engineering", icon: Building2 },
  { name: "Research", icon: FlaskConical },
  { name: "Personal", icon: UserRound },
];
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
    <Dropdown.Root v-model:open="open" aria-label="Namespaces" :positioning="isMobile ? mobilePositioning : side === 'end' ? endPositioning : desktopPositioning">
      <Dropdown.Trigger as-child>
        <Sidebar.MenuButton :icon="selected.icon" :tooltip="`Namespace: ${namespace}`" :aria-label="`Namespace: ${namespace}`" class="sidebar-demo__namespace">
          <ChevronsUpDown class="sidebar-demo__switch-icon" aria-hidden="true" />
          <span class="sidebar-demo__identity"><strong>{{ namespace }}</strong><small>Namespace</small></span>
        </Sidebar.MenuButton>
      </Dropdown.Trigger>
      <Dropdown.Content :teleport="!isMobile" :inert="!open || undefined" class="sidebar-demo__namespace-menu" @keydown="onShortcut">
        <Dropdown.Group>
          <Dropdown.Label>Namespaces</Dropdown.Label>
          <Dropdown.Item v-for="(item, index) in namespaces" :key="item.name" :value="item.name" :value-text="item.name"
            :aria-current="namespace === item.name ? 'true' : undefined"
            :aria-keyshortcuts="`${isMac ? 'Meta' : 'Control'}+${index + 1}`" @select="namespace = item.name">
            <template #icon><span class="sidebar-demo__namespace-icon" aria-hidden="true"><component :is="item.icon" /></span></template>
            {{ item.name }}
            <template #end><Dropdown.Shortcut aria-hidden="true">{{ isMac ? '⌘' : 'Ctrl ' }}{{ index + 1 }}</Dropdown.Shortcut></template>
          </Dropdown.Item>
        </Dropdown.Group>
        <Dropdown.Separator />
        <Dropdown.Group>
          <Dropdown.Item value="add-namespace" class="sidebar-demo__namespace-add" @select="emit('add'); setMobileOpen(false)">
            <template #icon><span class="sidebar-demo__namespace-icon" aria-hidden="true"><Plus /></span></template>
            Add namespace
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  </Sidebar.Context>
</template>

<style src="./sidebar-namespace-menu.css"></style>
