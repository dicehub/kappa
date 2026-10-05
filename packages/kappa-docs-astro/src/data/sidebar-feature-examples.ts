// read_when: Add or change Sidebar compositions and interactive examples.
import scrollToItemCode from "../components/SidebarScrollToItemDocsDemo.vue?raw";
import scrollToItemCss from "../components/sidebar-scroll-demo.css?raw";

export const sidebarFeatureExamples = [
  {
    id: "namespace-selector", title: "Namespace Selector",
    description: "Current workspace details, account actions, and a workspace list with the selected checkmark on the right. Ctrl/⌘ + 1–3 works only while the menu is open. Mobile menus stay inside the drawer.",
    code: `<script setup>
import { computed, onMounted, ref } from "vue";
import { Sidebar, WorkspaceSwitcher } from "@dicehub/kappa";
import { Building2, FlaskConical, Plus, UserRound } from "@lucide/vue";
const emit = defineEmits(["action"]);
const namespace = ref("Engineering");
const open = ref(false);
const isMac = ref(false);
const namespaces = [
  { value: "Engineering", name: "Engineering", description: "Pro plan · 12 members", icon: Building2 },
  { value: "Research", name: "Research", description: "Pro plan · 8 members", icon: FlaskConical },
  { value: "Personal", name: "Personal", description: "Free plan · 1 member", icon: UserRound },
];
const items = computed(() => namespaces.map((item, index) => ({ ...item,
  shortcut: (isMac.value ? "⌘" : "Ctrl ") + (index + 1),
  ariaKeyshortcuts: (isMac.value ? "Meta+" : "Control+") + (index + 1),
})));
onMounted(() => { isMac.value = /Mac|iPhone|iPad/.test(navigator.platform); });
function onShortcut(event) {
  if (!open.value || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey || event.isComposing || event.repeat) return;
  const item = items.value[Number(event.key) - 1];
  if (!item) return;
  event.preventDefault();
  event.stopPropagation();
  namespace.value = item.value;
  open.value = false;
}
</script>
<template>
  <Sidebar.Header>
    <Sidebar.Context v-slot="{ isMobile, setMobileOpen }">
      <WorkspaceSwitcher v-model="namespace" v-model:open="open" :items="items" label="Namespaces"
        :teleport="!isMobile" :positioning="{ placement: isMobile ? 'bottom-start' : 'right-start', strategy: 'fixed' }"
        :workspace-actions="[{ value: 'add', label: 'Add namespace', icon: Plus }]"
        @keydown="onShortcut" @action="action => { emit('action', action); setMobileOpen(false); }">
        <template #trigger="{ workspace }">
          <Sidebar.MenuButton :icon="workspace?.icon" :tooltip="namespace" :aria-label="'Namespace: ' + namespace">{{ namespace }}</Sidebar.MenuButton>
        </template>
      </WorkspaceSwitcher>
    </Sidebar.Context>
    <Sidebar.Close />
  </Sidebar.Header>
</template>`,
  },
  {
    id: "profile-selector", title: "Profile Selector",
    description: "A footer menu with initials, name, email, profile switching, and account actions. All data is synthetic. Actions update this example only.",
    code: `<Sidebar.Footer>
  <Sidebar.Context v-slot="{ isMobile }">
  <Dropdown.Root aria-label="Profile" :positioning="{ placement: isMobile ? 'top-start' : 'right-end', strategy: 'fixed' }">
    <Dropdown.Trigger as-child>
      <Sidebar.MenuButton :icon="UserRound" :tooltip="profile">{{ profile }}</Sidebar.MenuButton>
    </Dropdown.Trigger>
    <Dropdown.Content :teleport="!isMobile">
      <Dropdown.RadioGroup v-model="profile">
        <Dropdown.Label>Switch profile</Dropdown.Label>
        <Dropdown.RadioItem value="Casey Rivera" close-on-select>Casey Rivera</Dropdown.RadioItem>
        <Dropdown.RadioItem value="Jordan Lee" close-on-select>Jordan Lee</Dropdown.RadioItem>
      </Dropdown.RadioGroup>
      <Dropdown.Separator />
      <Dropdown.Item value="account" @select="openAccount">Account</Dropdown.Item>
    </Dropdown.Content>
  </Dropdown.Root>
  </Sidebar.Context>
</Sidebar.Footer>`,
  },
  {
    id: "quick-search", title: "Quick Search",
    description: "Quick search opens a real CommandPalette. Type a page name, use the arrow keys, then press Enter to navigate. Escape returns focus to the search button. No global shortcut is registered.",
    code: `<script setup>
import { ref } from "vue";
import { Sidebar, CommandPalette } from "@dicehub/kappa";
import { Search } from "@lucide/vue";
const open = ref(false);
const selected = ref("Overview");
const items = ["Overview", "Projects", "Geometry", "Refinement", "Settings"];
</script>
<template>
  <!-- Put the trigger in Sidebar.Content. -->
  <Sidebar.Menu><Sidebar.MenuItem>
    <Sidebar.MenuButton :icon="Search" tooltip="Quick search" @click="open = true">Quick search …</Sidebar.MenuButton>
  </Sidebar.MenuItem></Sidebar.Menu>
  <CommandPalette.Root v-model:open="open" :items="items" aria-label="Search navigation"
    @select="item => { selected = String(item); open = false; }">
    <CommandPalette.Input placeholder="Search navigation…" />
    <CommandPalette.List>
      <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
      <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
    </CommandPalette.List>
  </CommandPalette.Root>
</template>`,
  },
  {
    id: "resizable", title: "Resizable",
    description: "Drag the separator to change the width. Drag toward the rail to collapse; drag outward to expand. Arrow keys resize, Shift increases the step, Home/End move to the edge limits, and Enter toggles collapse. Ark owns the drag threshold between the minimum width and the rail. The handle is desktop-only.",
    code: `<Sidebar.Provider resizable :default-width="240" :min-width="180" :max-width="400">
  <Sidebar.Root label="Project navigation">
    <Sidebar.Header>Workspace <Sidebar.Close /></Sidebar.Header>
    <Sidebar.Content aria-label="Project links">…</Sidebar.Content>
    <Sidebar.ResizeHandle />
  </Sidebar.Root>
  <main style="flex: 1; min-width: 0"><Sidebar.Trigger />…</main>
</Sidebar.Provider>`,
  },
  {
    id: "resizable-controlled", title: "Controlled Width",
    description: "Keep the expanded width in application state. Lock width to reject resize requests. Collapse and mobile state remain separate.",
    code: `<Sidebar.Provider resizable v-model:resize-width="width" :min-width="180" :max-width="400">
  <!-- width is a ref containing pixels, for example ref(240). -->
  <Sidebar.Root><Sidebar.Content>…</Sidebar.Content><Sidebar.ResizeHandle /></Sidebar.Root>
  <main style="flex: 1; min-width: 0"><Sidebar.Trigger />…</main>
</Sidebar.Provider>`,
  },
  {
    id: "peeking", title: "Peeking",
    description: "Hover or focus the collapsed rail to peek. The live state distinguishes a temporary peek from a pinned sidebar. Pin it open, then collapse it to try again. Namespace and profile menus keep the peek visible. Escape or leaving both the Sidebar and its popup closes it without moving the page.",
    code: `<Sidebar.Provider peekable :default-open="false">
  <Sidebar.Root label="Project navigation">
    <Sidebar.Content aria-label="Project links">…</Sidebar.Content>
  </Sidebar.Root>
  <main style="flex: 1; min-width: 0">
    <Sidebar.Trigger />
    <Sidebar.Context v-slot="{ open, isPeeking, toggle }">
      <output>{{ isPeeking ? 'Peeking — temporary' : open ? 'Expanded — pinned' : 'Collapsed — ready to peek' }}</output>
      <Button @click="toggle">{{ open ? 'Collapse to try peeking' : 'Pin sidebar open' }}</Button>
    </Sidebar.Context>
  </main>
</Sidebar.Provider>`,
  },
  {
    id: "scroll-to-item", title: "Scroll to Item",
    description: "Jump to an item in a long navigation list without moving the documentation page or keyboard focus. Keep Settings visible does nothing when that row is already fully visible. This composition uses native Content scrolling; reduced motion disables smooth scrolling.",
    code: scrollToItemCode.replace('<style src="./sidebar-scroll-demo.css"></style>', `<style>\n${scrollToItemCss}</style>`),
  },
  {
    id: "sliding-views", title: "Sliding Views",
    description: "Use the navigation header or the page button to switch between workspace and project views. You can also open Rotor study from the list and go back. The active view is shown beside the navigation. Inactive views stay mounted, hidden, and inert. Motion respects reduced-motion settings.",
    code: `<script setup>
import { ref } from "vue";
import { Sidebar } from "@dicehub/kappa";
import { ArrowLeft, ArrowLeftRight, Folder } from "@lucide/vue";
const surface = ref("workspace");
</script>
<template>
<!-- Inside Sidebar.Root -->
<Sidebar.Header>
  <Sidebar.MenuButton :icon="ArrowLeftRight" tooltip="Switch navigation view"
    @click="surface = surface === 'workspace' ? 'project' : 'workspace'">
    {{ surface === 'workspace' ? 'Workspace view' : 'Rotor study view' }}
  </Sidebar.MenuButton>
  <Sidebar.Close />
</Sidebar.Header>
<Sidebar.SlidingViews :active-key="surface" :direction="surface === 'project' ? 'left' : 'right'">
  <Sidebar.SlidingView value="workspace" label="Workspace view">
    <Sidebar.Content aria-label="Workspace links">
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.MenuButton :icon="Folder" tooltip="Rotor study" @click="surface = 'project'">Rotor study</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </Sidebar.Content>
  </Sidebar.SlidingView>
  <Sidebar.SlidingView value="project" label="Project view">
    <Sidebar.Content aria-label="Project links">
      <Sidebar.Menu><Sidebar.MenuItem>
        <Sidebar.MenuButton :icon="ArrowLeft" tooltip="Back to workspace" @click="surface = 'workspace'">Back to workspace</Sidebar.MenuButton>
      </Sidebar.MenuItem></Sidebar.Menu>
    </Sidebar.Content>
  </Sidebar.SlidingView>
</Sidebar.SlidingViews>
</template>`,
  },
] as const;
