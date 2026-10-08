<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { Sidebar, type SidebarContextValue } from "@dicehub/kappa/components/sidebar";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Tabs } from "@dicehub/kappa/components/tabs";
import { Tooltip } from "@dicehub/kappa/components/tooltip";
import { Building2, ChevronsLeft, ChevronsRight, ChevronsUpDown, FlaskConical, Folder, House, Inbox, MessageCircle, Plus, Search, Settings, UserRound, UsersRound } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const host = ref<HTMLElement>();
const maxWidth = ref(600);
watch(host, (element, _, onCleanup) => {
  if (!element) return;
  const observer = new ResizeObserver(([entry]) => {
    const available = entry.contentRect.width - 240;
    maxWidth.value = Math.max(260, Math.min(600, Math.floor(props.standalone ? available / 2 : available)));
  });
  observer.observe(element);
  onCleanup(() => observer.disconnect());
}, { flush: "post" });
const workspace = ref("Engineering");
const workspaces = [
  { value: "Engineering", name: "Engineering", description: "Pro plan · 12 members", icon: Building2 },
  { value: "Research", name: "Research", description: "Pro plan · 8 members", icon: FlaskConical },
  { value: "Personal", name: "Personal", description: "Free plan · 1 member", icon: UserRound },
];
const workspaceActions = [
  { value: "settings", label: "Settings", icon: Settings },
  { value: "invite", label: "Invite members", icon: UsersRound },
];
const creationActions = [{ value: "add-workspace", label: "Add workspace", icon: Plus }];
const open = ref(true);
const locked = ref(false);
const end = ref(false);
const rtl = ref(false);
const mobileProfilePositioning = computed(() => ({ placement: rtl.value ? 'left-start' : 'right-start', gutter: 4, strategy: 'fixed', fitViewport: true, overflowPadding: 8, overlap: true } as const));
const selected = ref("Create a project");
const profile = ref("Casey Rivera");
const requests = ref(0);
const searchId = `hover-workspace-search-${useId()}`;
const searchOpen = ref(false);
const searchFromSidebar = ref(false);
const navigating = ref(false);
const query = ref("");
const contexts = [
  { value: "home", label: "Home", icon: House, groups: [
    { title: "Getting started", items: ["Introduction", "Installation", "Create a project"] },
    { title: "Project workflow", items: ["Import geometry", "Prepare a mesh", "Run a simulation", "Review results"] },
    { title: "Reference", items: ["Configuration", "Keyboard shortcuts", "Troubleshooting"] },
  ] },
  { value: "chat", label: "AI Chat", icon: MessageCircle, groups: [
    { title: "Recent chats", items: ["Mesh refinement notes", "Boundary condition review", "Compare simulation results"] },
  ] },
  { value: "projects", label: "Projects", icon: Folder, groups: [
    { title: "Projects", items: ["Rotor study", "Channel flow", "Heat exchanger"] },
  ] },
  { value: "inbox", label: "Inbox", icon: Inbox, groups: [
    { title: "Messages", items: ["Mesh review is ready", "Geometry files uploaded", "Channel flow results"] },
  ] },
];
const activeContext = ref("home");
const contextRow = ref<HTMLElement>();
const expandedContextLabels = ref(false);
const openGroups = ref<Record<string, boolean>>(Object.fromEntries(contexts.flatMap(context => context.groups.map(group => [`${context.value}:${group.title}`, true]))));
const pages = contexts.flatMap(context => context.groups.flatMap(group => group.items));
const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");
function navigate(page: string, setMobileOpen: SidebarContextValue["setMobileOpen"]) {
  selected.value = page;
  const context = contexts.find(context => context.groups.some(group => group.items.includes(page)));
  const group = context?.groups.find(group => group.items.includes(page));
  if (context && group) {
    activeContext.value = context.value;
    openGroups.value[`${context.value}:${group.title}`] = true;
  }
  setMobileOpen(false);
}
function resetWorkspace() {
  activeContext.value = "home";
  selected.value = "Create a project";
  openGroups.value["home:Getting started"] = true;
}
function keepContextVisible() {
  const tab = contextRow.value?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  const rail = tab?.closest<HTMLElement>('[role="tablist"]');
  if (!tab || !rail) return;
  const target = tab.getBoundingClientRect();
  const bounds = rail.getBoundingClientRect();
  if (target.left < bounds.left || target.right > bounds.right) tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
}
watch([activeContext, contextRow], () => nextTick(keepContextVisible), { flush: "post" });
watch(contextRow, (row, _, onCleanup) => {
  if (!row) { expandedContextLabels.value = false; return; }
  const measure = row.querySelector<HTMLElement>('[data-context-measure]');
  const search = row.querySelector<HTMLElement>('[data-hover-search-trigger]');
  if (!measure || !search) return;
  const observer = new ResizeObserver(() => {
    const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0;
    const required = Number.parseFloat(getComputedStyle(measure).width) + Number.parseFloat(getComputedStyle(search).width) + gap;
    expandedContextLabels.value = Math.ceil(required) <= row.clientWidth;
    keepContextVisible();
  });
  observer.observe(row);
  observer.observe(measure);
  observer.observe(search);
  onCleanup(() => observer.disconnect());
}, { flush: "post" });
function updateOpen(value: boolean) { if (!locked.value) open.value = value; }
function search(fromSidebar: boolean, event?: MouseEvent) {
  if (event?.currentTarget instanceof HTMLElement) event.currentTarget.focus({ preventScroll: true });
  searchFromSidebar.value = fromSidebar;
  navigating.value = false;
  query.value = "";
  searchOpen.value = true;
}
async function selectPage(item: unknown, context: SidebarContextValue) {
  navigating.value = true;
  searchOpen.value = false;
  await nextTick();
  navigate(String(item), context.setMobileOpen);
}
function shortcut(event: KeyboardEvent) {
  if (event.key !== "/" || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || searchOpen.value) return;
  const target = event.composedPath().find(node => node instanceof HTMLElement) as HTMLElement | undefined;
  if (!props.standalone && (!target || !host.value?.contains(target))) return;
  if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"]')) return;
  if (target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"], [role="combobox"], [role="searchbox"], [role="dialog"], [role="menu"], [role="listbox"]')) return;
  event.preventDefault();
  event.stopPropagation();
  search(Boolean(target && host.value?.querySelector('[data-slot="sidebar"]')?.contains(target)));
}
onMounted(() => window.addEventListener("keydown", shortcut));
onBeforeUnmount(() => window.removeEventListener("keydown", shortcut));
</script>

<template>
  <div ref="host" class="sidebar-hover-demo" :data-standalone="props.standalone || undefined" data-sidebar-demo="hover-reveal">
    <DirectionProvider :locale="rtl ? 'ar' : 'en'">
      <SidebarLayout :open="open" peekable collapsible="offcanvas" :content-alignment="props.standalone ? 'shell' : 'available'" resizable
        :min-width="260" :max-width="maxWidth" :collapse-on-resize="false"
        :side="end ? 'end' : 'start'" :dir="rtl ? 'rtl' : 'ltr'" label="Hover navigation"
        :trigger-props="{ peek: true, expandLabel: 'Pin sidebar open' }" class="sidebar-hover-demo__layout"
        @update:open="updateOpen" @open-change="requests += 1">
        <template #header="{ isMobile, open }">
          <WorkspaceSwitcher v-model="workspace" :items="workspaces" label="Workspaces" account-label="casey@example.test"
            :actions="workspaceActions" :workspace-actions="creationActions" :teleport="!isMobile"
            :positioning="{ placement: 'bottom-start', gutter: 6, strategy: 'fixed' }"
            @update:model-value="resetWorkspace" @action="selected = $event.label">
            <template #trigger="{ workspace: current }">
              <Sidebar.MenuButton :icon="current?.icon" :aria-label="`Workspace: ${workspace}`" class="sidebar-hover-demo__workspace">
                <span>{{ workspace }}</span><ChevronsUpDown aria-hidden="true" />
              </Sidebar.MenuButton>
            </template>
          </WorkspaceSwitcher>
          <Sidebar.Trigger v-if="!isMobile" :expand-label="'Pin sidebar open'" class="sidebar-hover-demo__pin">
            <component :is="open !== (end !== rtl) ? ChevronsLeft : ChevronsRight" aria-hidden="true" />
            <span class="sidebar-hover-demo__sr-only">{{ open ? 'Collapse sidebar' : 'Pin sidebar open' }}</span>
          </Sidebar.Trigger>
        </template>
        <template #navigation="{ setMobileOpen, isMobile }">
          <Tabs.Root v-model="activeContext" :lazy-mount="false" :unmount-on-exit="false" class="sidebar-hover-demo__contexts">
            <Tabs.Context v-slot="tabs"><div ref="contextRow" class="sidebar-hover-demo__context-row" :data-labels-expanded="expandedContextLabels || undefined" @transitionend="keepContextVisible">
              <div class="sidebar-hover-demo__context-measure-clip" aria-hidden="true" inert><div class="sidebar-hover-demo__context-list kappa-tabs__list sidebar-hover-demo__context-measure" data-context-measure>
                <span v-for="context in contexts" :key="context.value" class="sidebar-hover-demo__context-tab kappa-tabs__trigger">
                  <component :is="context.icon" aria-hidden="true" />
                  <span class="sidebar-hover-demo__context-label"><span>{{ context.label }}</span></span>
                </span>
              </div></div>
              <Tabs.List aria-label="Navigation context" class="sidebar-hover-demo__context-list">
                <Tooltip.Root v-for="context in contexts" :key="context.value" :disabled="expandedContextLabels || activeContext === context.value"
                  :ids="{ trigger: tabs.getTriggerProps({ value: context.value }).id }">
                  <Tabs.Trigger :value="context.value" :aria-label="context.label" class="sidebar-hover-demo__context-tab" as-child>
                    <Tooltip.Trigger as-child><button type="button">
                        <component :is="context.icon" aria-hidden="true" />
                        <span class="sidebar-hover-demo__context-label" aria-hidden="true"><span>{{ context.label }}</span></span>
                    </button></Tooltip.Trigger>
                  </Tabs.Trigger>
                  <Tooltip.Content :teleport="!isMobile">{{ context.label }}</Tooltip.Content>
                </Tooltip.Root>
              </Tabs.List>
              <Tooltip.Root>
                <Tooltip.Trigger as-child>
                  <Button variant="ghost" :icon="Search" class="sidebar-hover-demo__search" data-hover-search-trigger
                    aria-label="Search workspace pages" aria-keyshortcuts="/" aria-haspopup="dialog" :aria-expanded="searchOpen"
                    :aria-controls="!searchOpen || searchFromSidebar ? searchId : undefined" @click="search(true, $event)" />
                </Tooltip.Trigger>
                <Tooltip.Content :teleport="!isMobile">Search (/)</Tooltip.Content>
              </Tooltip.Root>
            </div></Tabs.Context>
            <Tabs.Content v-for="context in contexts" :key="context.value" :value="context.value" class="sidebar-hover-demo__context-panel">
              <Sidebar.Group v-for="group in context.groups" :key="group.title">
                <Sidebar.Collapsible v-model:open="openGroups[`${context.value}:${group.title}`]">
                  <Sidebar.CollapsibleTrigger class="sidebar-hover-demo__group-trigger"><Sidebar.MenuChevron />{{ group.title }}</Sidebar.CollapsibleTrigger>
                  <Sidebar.CollapsibleContent>
                    <Sidebar.MenuSub :aria-label="group.title" class="sidebar-hover-demo__pages">
                      <Sidebar.MenuSubItem v-for="page in group.items" :key="page">
                        <Sidebar.MenuButton :href="`?page=${slug(page)}`" :active="selected === page"
                          @click.prevent="navigate(page, setMobileOpen)">{{ page }}</Sidebar.MenuButton>
                      </Sidebar.MenuSubItem>
                    </Sidebar.MenuSub>
                  </Sidebar.CollapsibleContent>
                </Sidebar.Collapsible>
              </Sidebar.Group>
            </Tabs.Content>
          </Tabs.Root>
        </template>
        <template #footer="{ isMobile }">
          <Dropdown.Root aria-label="Account menu" :positioning="{ placement: 'top-start', gutter: 6, strategy: 'fixed' }">
            <Dropdown.Trigger as-child><Sidebar.MenuButton :icon="UserRound">{{ profile }}</Sidebar.MenuButton></Dropdown.Trigger>
            <Dropdown.Content :teleport="!isMobile">
              <Dropdown.Item value="preferences" @select="selected = 'Preferences'">Preferences</Dropdown.Item>
              <Dropdown.Sub aria-label="Switch profile" :positioning="isMobile ? mobileProfilePositioning : undefined">
                <Dropdown.SubTrigger>Switch profile</Dropdown.SubTrigger>
                <Dropdown.SubContent :teleport="!isMobile">
                  <Dropdown.RadioGroup v-model="profile">
                    <Dropdown.RadioItem v-for="name in ['Casey Rivera', 'Jordan Lee']" :key="name" :value="name" close-on-select class="sidebar-hover-demo__profile-option">
                      <template #indicator><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.25 3 3 7-7" /></svg></template>
                      {{ name }}
                    </Dropdown.RadioItem>
                  </Dropdown.RadioGroup>
                </Dropdown.SubContent>
              </Dropdown.Sub>
            </Dropdown.Content>
          </Dropdown.Root>
        </template>
        <template #toolbar>{{ selected }}</template>
        <template #default="context">
          <CommandPalette.Dialog :ids="{ content: searchId }" v-model:open="searchOpen" aria-label="Search workspace pages"
            :restore-focus="!navigating || !context.isMobile">
            <CommandPalette.Panel v-model:value="query" :open="searchOpen" :items="pages"
              @close="searchOpen = false" @select="item => selectPage(item, context)">
              <CommandPalette.Input placeholder="Search workspace pages…" />
              <CommandPalette.List>
                <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
                <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
              </CommandPalette.List>
              <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></CommandPalette.Footer>
            </CommandPalette.Panel>
          </CommandPalette.Dialog>
          <article class="sidebar-hover-demo__article">
            <span class="sidebar-hover-demo__eyebrow">{{ workspace }}</span>
            <h2>{{ selected }}</h2>
            <p>Collapse the sidebar. Hover over the header toggle to reveal it, then click to pin it open.</p>
            <p>The temporary panel leaves this reading column in place. Move away to hide it, or press Escape.</p>
            <output aria-live="polite">{{ context.isMobile ? 'Mobile drawer' : context.state }} · {{ requests }} open requests</output>
            <div class="sidebar-hover-demo__controls">
              <Button variant="secondary" size="sm" @click="locked = !locked">{{ locked ? 'Unlock state' : 'Lock state' }}</Button>
              <Button variant="secondary" size="sm" @click="end = !end">Change side</Button>
              <Button variant="secondary" size="sm" @click="rtl = !rtl">{{ rtl ? 'Use LTR' : 'Use RTL' }}</Button>
            </div>
          </article>
        </template>
      </SidebarLayout>
    </DirectionProvider>
  </div>
</template>

<style src="./sidebar-hover-demo.css"></style>
