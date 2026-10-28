<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import { Input } from "@dicehub/kappa/components/input";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Dialog } from "@dicehub/kappa/components/dialog";
import { Resizable } from "@dicehub/kappa/components/resizable";
import { Activity, ArrowUpRight, Bell, BookOpen, Box, Check, ChevronDown, ChevronRight, Circle, CircleCheck, CircleHelp, Code, LayoutGrid, ListChecks, MessageSquare, PanelLeftClose, PanelLeftOpen, Pin, Plus, Search, SlidersHorizontal, Users, X } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const root = ref<HTMLElement>();
const panels = ref<HTMLElement>();
const namespace = ref("Engineering");
const view = ref("Work items");
const navigationOpen = ref(true);
const mobileOpen = ref(false);
const pinned = ref(["Work items", "Pipelines", "Members"]);
const groupsOpen = ref<Record<string, boolean>>({ Pinned: true, Plan: true });
const flyout = ref("");
const filter = ref("");
const stateFilter = ref("All");
const searchOpen = ref(false);
const searchQuery = ref("");
const catalogOpen = ref(false);
const catalogQuery = ref("");
const activityOpen = ref(false);
const activityPresent = ref(false);
let returnToActivity = false;
const detailOpen = ref(false);
const detailId = ref<number>();
const comment = ref("");
const contentWidth = ref(0);
const splitSize = ref([50, 50]);
const detailHeading = ref<HTMLElement>();
const activityHeading = ref<HTMLElement>();
let catalogOpener: HTMLElement | undefined;
let catalogFromMobile = false;
let activityOpener: HTMLElement | undefined;
let detailOpener: HTMLElement | undefined;
let returnToItem = false;
let observer: ResizeObserver | undefined;
let focusFrame = 0;

type WorkItem = { id: number; title: string; summary: string; project: string; namespace: string; status: string; owner: string; label: string; updated: string; notes: { author: string; text: string }[] };
const workItems = ref<WorkItem[]>([
  { id: 128, title: "Refine the rotor mesh", summary: "Increase resolution around the blade tips before the next comparison run. Keep the far-field mesh unchanged so the results remain comparable.", project: "Rotor study", namespace: "Engineering", status: "Open", owner: "Maya Chen", label: "Mesh", updated: "12 min ago", notes: [{ author: "Maya Chen", text: "The baseline mesh is ready for review." }, { author: "Alex Morgan", text: "Check the prism layers at the blade tips before exporting." }] },
  { id: 127, title: "Compare inlet boundary conditions", summary: "Compare the measured inlet profile with the uniform reference. Record the pressure drop and mass-flow balance for both cases.", project: "Channel flow", namespace: "Engineering", status: "Open", owner: "Alex Morgan", label: "Simulation", updated: "34 min ago", notes: [{ author: "Maya Chen", text: "Both inlet profiles are available in the project files." }] },
  { id: 126, title: "Review heat exchanger results", summary: "Review the temperature distribution and heat-transfer coefficient against the reference experiment.", project: "Heat exchanger", namespace: "Engineering", status: "In review", owner: "Sam Rivera", label: "Validation", updated: "1 hour ago", notes: [{ author: "Maya Chen", text: "The steady-state run has converged." }] },
  { id: 125, title: "Validate mesh quality", summary: "Check non-orthogonality and skewness in the transition regions. Document any cells that need correction.", project: "Rotor study", namespace: "Engineering", status: "Open", owner: "Maya Chen", label: "Mesh", updated: "2 hours ago", notes: [] },
  { id: 124, title: "Check residual convergence", summary: "Compare the final residuals with the stopping criteria and confirm that the monitored forces are stable.", project: "Channel flow", namespace: "Engineering", status: "In review", owner: "Alex Morgan", label: "Simulation", updated: "3 hours ago", notes: [] },
  { id: 123, title: "Prepare transient simulation", summary: "Choose a time step from the Courant limit and prepare the transient run configuration.", project: "Rotor study", namespace: "Engineering", status: "Open", owner: "Sam Rivera", label: "Simulation", updated: "4 hours ago", notes: [] },
  { id: 122, title: "Archive the reference mesh", summary: "Keep a versioned copy of the accepted reference mesh with its quality report.", project: "Rotor study", namespace: "Engineering", status: "Closed", owner: "Maya Chen", label: "Mesh", updated: "Yesterday", notes: [{ author: "Maya Chen", text: "Reference mesh and report archived together." }] },
  { id: 121, title: "Document solver settings", summary: "Record the discretization schemes, tolerances, and relaxation factors used in the benchmark.", project: "Channel flow", namespace: "Engineering", status: "Open", owner: "Alex Morgan", label: "Documentation", updated: "Yesterday", notes: [] },
  { id: 120, title: "Export pressure contours", summary: "Export consistent pressure plots for the three reference sections, using the same range and units.", project: "Rotor study", namespace: "Engineering", status: "Closed", owner: "Sam Rivera", label: "Results", updated: "Yesterday", notes: [] },
  { id: 119, title: "Update material properties", summary: "Check temperature-dependent properties against the supplier data sheet.", project: "Heat exchanger", namespace: "Engineering", status: "Open", owner: "Maya Chen", label: "Validation", updated: "2 days ago", notes: [] },
  { id: 118, title: "Review benchmark agreement", summary: "Compare predicted pressure loss and temperature rise with the accepted benchmark range.", project: "Heat exchanger", namespace: "Engineering", status: "In review", owner: "Alex Morgan", label: "Validation", updated: "2 days ago", notes: [] },
  { id: 117, title: "Publish the study report", summary: "Prepare the study summary with assumptions, mesh statistics, and the final result figures.", project: "Rotor study", namespace: "Engineering", status: "Open", owner: "Sam Rivera", label: "Documentation", updated: "3 days ago", notes: [] },
  { id: 116, title: "Evaluate the turbulence model", summary: "Compare model sensitivity for the separated-flow case before selecting a reference setup.", project: "Inlet comparison", namespace: "Research", status: "Open", owner: "Maya Chen", label: "Simulation", updated: "Today", notes: [] },
]);
const categories = [
  { label: "Manage", icon: Users, pages: ["Members", "Activity log"] },
  { label: "Plan", icon: ListChecks, pages: ["Work items", "Milestones"] },
  { label: "Code", icon: Code, pages: ["Repositories", "Branches"] },
  { label: "Build", icon: Box, pages: ["Pipelines", "Artifacts"] },
  { label: "Analyze", icon: Activity, pages: ["Reports", "Usage"] },
];
const navigationGroups = computed(() => [{ label: "Pinned", icon: Pin, pages: pinned.value }, ...categories]);
const allPages = ["Overview", ...categories.flatMap(group => group.pages), "Settings", "Help"];
const namespaceItems = computed(() => workItems.value.filter(item => item.namespace === namespace.value));
const visibleItems = computed(() => namespaceItems.value.filter(item =>
  (stateFilter.value === "All" || (stateFilter.value === "Closed" ? item.status === "Closed" : item.status !== "Closed")) &&
  `${item.title} ${item.project} ${item.owner} ${item.label}`.toLocaleLowerCase().includes(filter.value.trim().toLocaleLowerCase()),
));
const currentItem = computed(() => workItems.value.find(item => item.id === detailId.value));
const split = computed(() => contentWidth.value >= 1200);
const panelSizes = computed(() => detailOpen.value && split.value ? splitSize.value : [100, 0]);
const panelDefinitions = computed(() => [{ id: "list", minSize: detailOpen.value && split.value ? 30 : 0 }, { id: "detail", minSize: detailOpen.value && split.value ? 30 : 0 }]);
const catalogPages = computed(() => allPages.filter(page => page.toLowerCase().includes(catalogQuery.value.toLowerCase())));
const events = ref(["Maya updated the rotor mesh quality report.", "Alex completed the inlet reference run.", "Sam requested a review of the heat exchanger results."]);
type SearchEntry = { label: string; description: string; id?: number };
const searchEntries = computed<SearchEntry[]>(() => [
  ...allPages.map(label => ({ label, description: "Go to page" })),
  ...namespaceItems.value.map(item => ({ label: item.title, description: `${item.project} · #${item.id}`, id: item.id })),
].filter(item => `${item.label} ${item.description}`.toLowerCase().includes(searchQuery.value.toLowerCase())));
const entryLabel = (item: unknown) => (item as SearchEntry).label;
const menuPosition = { placement: "bottom-end", strategy: "fixed", gutter: 6 } as const;

function navigateLink(page: string, event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(page);
}
function syncLocation() {
  const page = new URL(window.location.href).searchParams.get("view") ?? "Work items";
  navigate(allPages.includes(page) ? page : "Work items", false);
}
function navigate(page: string, updateLocation = true) {
  view.value = page;
  if (props.standalone && updateLocation) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") !== page) { url.searchParams.set("view", page); window.history.pushState(null, "", url); }
  }
  detailOpen.value = false;
  mobileOpen.value = false;
  flyout.value = "";
  filter.value = "";
  for (const category of categories) if (category.pages.includes(page)) groupsOpen.value[category.label] = true;
}
function changeNamespace(value: string) { namespace.value = value; navigate("Work items"); }
function togglePin(page: string) { pinned.value = pinned.value.includes(page) ? pinned.value.filter(value => value !== page) : [...pinned.value, page]; }
async function openItem(item: WorkItem, event?: Event) {
  detailOpener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : root.value?.querySelector<HTMLElement>(`[data-work-item="${item.id}"]`) ?? undefined;
  detailId.value = item.id;
  comment.value = "";
  view.value = "Work items";
  detailOpen.value = true;
  await nextTick();
  detailHeading.value?.focus({ preventScroll: true });
}
function finalDetailFocus() { return detailOpener?.isConnected && detailOpener.getClientRects().length ? detailOpener : root.value?.querySelector<HTMLElement>('[data-paneled-search]') ?? null; }
function updateDetailOpen(open: boolean) { detailOpen.value = open; returnToItem = !open; }
function restoreItemFocus() { if (returnToItem) { returnToItem = false; finalDetailFocus()?.focus({ preventScroll: true }); } }
function createItem() {
  const id = Math.max(...workItems.value.map(item => item.id)) + 1;
  const item: WorkItem = { id, title: `Untitled work item ${id}`, summary: "Add the context, expected result, and acceptance criteria for this work item.", project: "Rotor study", namespace: namespace.value, status: "Open", owner: "Alex Morgan", label: "Planning", updated: "Just now", notes: [] };
  workItems.value.unshift(item);
  filter.value = "";
  stateFilter.value = "All";
  events.value.unshift(`Alex created work item #${id}.`);
  void openItem(item);
}
function toggleStatus() {
  if (!currentItem.value) return;
  currentItem.value.status = currentItem.value.status === "Closed" ? "Open" : "Closed";
  events.value.unshift(`Work item #${currentItem.value.id} is now ${currentItem.value.status.toLowerCase()}.`);
}
function addComment() { if (currentItem.value && comment.value.trim()) { currentItem.value.notes.push({ author: "Alex Morgan", text: comment.value.trim() }); comment.value = ""; } }
function finalCatalogFocus() { return !catalogFromMobile && catalogOpener?.isConnected ? catalogOpener : root.value?.querySelector<HTMLElement>('[data-slot="sidebar-trigger"]') ?? null; }
async function showCatalog(event: Event) {
  catalogOpener = event.currentTarget as HTMLElement;
  catalogFromMobile = mobileOpen.value;
  catalogQuery.value = "";
  mobileOpen.value = false;
  await nextTick();
  catalogOpen.value = true;
}
function toggleActivity(event: Event) {
  activityOpener = event.currentTarget as HTMLElement;
  updateActivityOpen(!activityOpen.value);
}
function updateActivityOpen(open: boolean) { activityOpen.value = open; returnToActivity = !open; if (open) activityPresent.value = true; }
function restoreActivityFocus() { activityPresent.value = false; if (returnToActivity) { returnToActivity = false; finalActivityFocus()?.focus({ preventScroll: true }); } }
function finalActivityFocus() { return activityOpener?.isConnected ? activityOpener : null; }
function savePanelSize(size: number[]) { if (detailOpen.value && split.value && size.every(value => value >= 30)) splitSize.value = size; }
function showSearch() { searchQuery.value = ""; searchOpen.value = true; }
async function selectSearch(value: unknown) {
  const entry = value as SearchEntry;
  searchOpen.value = false;
  await nextTick();
  mobileOpen.value = false;
  if (entry.id) { const item = workItems.value.find(item => item.id === entry.id); if (item) { await openItem(item); detailOpener = root.value?.querySelector<HTMLElement>('[data-paneled-search]') ?? undefined; } }
  else navigate(entry.label);
}
function shortcut(event: KeyboardEvent) {
  const command = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  if ((!command && event.key !== "/") || event.repeat || event.isComposing || event.defaultPrevented || event.altKey || searchOpen.value) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input,textarea,select,[contenteditable="true"],[role="textbox"],[role="dialog"],[role="menu"]')) return;
  if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"]')) return;
  event.preventDefault();
  event.stopPropagation();
  root.value?.querySelector<HTMLElement>('[data-paneled-search]')?.focus();
  showSearch();
}
async function updateFlyout(label: string, open: boolean) {
  if (open) { flyout.value = label; return; }
  // Trigger blur precedes the link's focus event. Keep the flyout open while a link has focus.
  await nextTick();
  const content = document.querySelector<HTMLElement>(`[data-paneled-flyout="${label}"]`);
  if (!content?.contains(document.activeElement) && flyout.value === label) flyout.value = "";
}
function closeFlyout(label: string) {
  flyout.value = "";
  root.value?.querySelector<HTMLElement>(`[data-paneled-group="${label}"]`)?.focus();
}
function focusFlyout(label: string) {
  flyout.value = label;
  cancelAnimationFrame(focusFrame);
  if (!navigationGroups.value.find(group => group.label === label)?.pages.length) return;
  // Ark presence reveals the links on a later frame. Focus only after they can receive it.
  const focusLink = () => {
    if (flyout.value !== label) return;
    const link = document.querySelector<HTMLElement>(`[data-paneled-flyout="${label}"] a`);
    if (link?.getClientRects().length && getComputedStyle(link).visibility === "visible") {
      link.focus();
      if (document.activeElement === link) return;
    }
    focusFrame = requestAnimationFrame(focusLink);
  };
  focusFrame = requestAnimationFrame(focusLink);
}
onMounted(() => {
  if (panels.value) { observer = new ResizeObserver(([entry]) => { contentWidth.value = entry.contentRect.width; }); observer.observe(panels.value); }
  if (props.standalone) { syncLocation(); window.addEventListener("keydown", shortcut); window.addEventListener("popstate", syncLocation); }
});
onBeforeUnmount(() => { observer?.disconnect(); cancelAnimationFrame(focusFrame); window.removeEventListener("keydown", shortcut); window.removeEventListener("popstate", syncLocation); });
</script>

<template>
  <div ref="root" class="paneled-workspace-demo" data-sidebar-block="paneled-workspace" :data-standalone="props.standalone || undefined" @keydown="shortcut">
    <SidebarLayout v-model:open="navigationOpen" v-model:mobile-open="mobileOpen" variant="header" content-alignment="available" width="240px" collapsed-width="44px" :mobile-breakpoint="1200" label="Paneled workspace navigation" class="paneled-workspace-demo__layout">
      <template #toolbar>
        <a class="paneled-workspace-demo__brand" href="?view=Overview" aria-label="dicehub home" @click="navigateLink('Overview', $event)"><DicehubLogo variant="glyph" aria-hidden="true" /></a>
        <Button data-paneled-search class="paneled-workspace-demo__search" variant="ghost" size="sm" :icon="Search" aria-label="Search or go to…" aria-keyshortcuts="/ Control+k Meta+k" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="showSearch"><span>Search or go to…</span><kbd aria-hidden="true">/</kbd></Button>
        <div class="paneled-workspace-demo__global-actions">
          <Dropdown.Root :positioning="menuPosition"><Dropdown.Trigger as-child><Button variant="ghost" size="sm" shape="square" :icon="Plus" aria-label="Create new" /></Dropdown.Trigger><Dropdown.Context v-slot="menu"><Dropdown.Content :inert="!menu.open || undefined"><Dropdown.Item value="item" :icon="ListChecks" @select="createItem">New work item</Dropdown.Item><Dropdown.Item value="project" :icon="Box" @select="navigate('Repositories')">Browse projects</Dropdown.Item></Dropdown.Content></Dropdown.Context></Dropdown.Root>
          <Button class="paneled-workspace-demo__notification" variant="ghost" size="sm" :icon="Bell" aria-label="Notifications" @click="toggleActivity"><span>{{ events.length }}</span></Button>
          <Dropdown.Root :positioning="menuPosition"><Dropdown.Trigger as-child><Button variant="ghost" size="sm" shape="square" aria-label="Profile: Alex Morgan"><Avatar.Root class="paneled-workspace-demo__avatar"><Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" /><Avatar.Fallback>AM</Avatar.Fallback></Avatar.Root></Button></Dropdown.Trigger><Dropdown.Context v-slot="menu"><Dropdown.Content :inert="!menu.open || undefined"><div class="paneled-workspace-demo__identity"><strong>Alex Morgan</strong><span>alex@example.test</span></div><Dropdown.Separator /><Dropdown.Item value="profile" @select="navigate('Profile')">Your profile</Dropdown.Item><Dropdown.Item value="preferences" @select="navigate('Settings')">Preferences</Dropdown.Item><Dropdown.Item value="help" @select="navigate('Help')">Help and resources</Dropdown.Item></Dropdown.Content></Dropdown.Context></Dropdown.Root>
        </div>
      </template>
      <template #header="context">
        <Dropdown.Root :positioning="{ placement: context.iconCollapsed ? 'right-start' : 'bottom-start', strategy: 'fixed', gutter: 4 }"><Dropdown.Trigger as-child><Sidebar.MenuButton :icon="Box" :tooltip="namespace" :aria-label="`Workspace: ${namespace}`" class="paneled-workspace-demo__workspace"><span>{{ namespace }}</span><ChevronDown aria-hidden="true" /></Sidebar.MenuButton></Dropdown.Trigger><Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined"><Dropdown.Group><Dropdown.Label>Workspaces</Dropdown.Label><Dropdown.Item v-for="name in ['Engineering', 'Research']" :key="name" :value="name" :selected="namespace === name" @select="changeNamespace(name)">{{ name }}</Dropdown.Item></Dropdown.Group></Dropdown.Content></Dropdown.Context></Dropdown.Root>
      </template>
      <template #navigation="context">
        <Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton :icon="LayoutGrid" tooltip="Overview" href="?view=Overview" :active="view === 'Overview'" @click="navigateLink('Overview', $event)">Overview</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu>
        <div v-for="group in navigationGroups" :key="group.label" class="paneled-workspace-demo__nav-group">
          <HoverCard.Root v-if="context.iconCollapsed" :open="flyout === group.label" :open-delay="180" :close-delay="200" :positioning="{ placement: 'right-start', strategy: 'fixed', gutter: 8 }" @update:open="updateFlyout(group.label, $event)">
            <HoverCard.Trigger as-child><Sidebar.MenuButton :icon="group.icon" :aria-label="group.label" :data-paneled-group="group.label" :aria-expanded="flyout === group.label" @click="flyout = group.label" @keydown.down.capture.prevent="focusFlyout(group.label)">{{ group.label }}</Sidebar.MenuButton></HoverCard.Trigger>
            <HoverCard.Content :show-arrow="false" class="paneled-workspace-demo__flyout" :data-paneled-flyout="group.label" @keydown.esc.stop.prevent="closeFlyout(group.label)"><strong>{{ group.label }}</strong><nav :aria-label="`${group.label} pages`"><a v-for="page in group.pages" :key="page" :href="`?view=${encodeURIComponent(page)}`" :aria-current="view === page ? 'page' : undefined" @click="navigateLink(page, $event)">{{ page }}<span v-if="page === 'Work items'" aria-hidden="true">{{ namespaceItems.length }}</span></a><p v-if="!group.pages.length">Pin pages from the feature catalog.</p></nav></HoverCard.Content>
          </HoverCard.Root>
          <Sidebar.Collapsible v-else v-model:open="groupsOpen[group.label]">
            <Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="group.icon" class="paneled-workspace-demo__group-toggle">{{ group.label }}<ChevronRight aria-hidden="true" /></Sidebar.MenuButton></Sidebar.CollapsibleTrigger>
            <Sidebar.CollapsibleContent><Sidebar.MenuSub><Sidebar.MenuSubItem v-for="page in group.pages" :key="page"><Sidebar.MenuButton :href="`?view=${encodeURIComponent(page)}`" :active="view === page" @click="navigateLink(page, $event)">{{ page }}<span v-if="page === 'Work items'" class="paneled-workspace-demo__count" aria-hidden="true">{{ namespaceItems.length }}</span></Sidebar.MenuButton></Sidebar.MenuSubItem><li v-if="!group.pages.length" class="paneled-workspace-demo__nav-empty">No pinned pages</li></Sidebar.MenuSub></Sidebar.CollapsibleContent>
          </Sidebar.Collapsible>
          <Sidebar.Menu v-if="group.label === 'Pinned'"><Sidebar.MenuItem><Sidebar.MenuButton :icon="SlidersHorizontal" tooltip="Feature catalog" @click="showCatalog">Feature catalog</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu>
        </div>
      </template>
      <template #footer="context">
        <Dropdown.Root :positioning="{ placement: context.iconCollapsed ? 'right-end' : 'top-start', strategy: 'fixed', gutter: 6 }"><Dropdown.Trigger as-child><Sidebar.MenuButton :icon="CircleHelp" tooltip="Help">Help</Sidebar.MenuButton></Dropdown.Trigger><Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined"><Dropdown.Item value="docs" :icon="BookOpen" @select="navigate('Help')">Documentation</Dropdown.Item><Dropdown.Item value="shortcuts" @select="navigate('Keyboard shortcuts')">Keyboard shortcuts</Dropdown.Item></Dropdown.Content></Dropdown.Context></Dropdown.Root>
        <Sidebar.Trigger v-if="!context.isMobile" as-child><Sidebar.MenuButton :icon="navigationOpen ? PanelLeftClose : PanelLeftOpen" :tooltip="navigationOpen ? 'Collapse sidebar' : 'Expand sidebar'">{{ navigationOpen ? 'Collapse sidebar' : 'Expand sidebar' }}</Sidebar.MenuButton></Sidebar.Trigger>
      </template>
      <template #default>
        <div class="paneled-workspace-demo__workspace-body" :data-activity="activityPresent || undefined">
          <div ref="panels" class="paneled-workspace-demo__panels" :data-panel-mode="split ? 'split' : 'overlay'" :data-detail-open="detailOpen || undefined">
            <Resizable.Root :size="panelSizes" :panels="panelDefinitions" class="paneled-workspace-demo__splitter" @update:size="savePanelSize">
              <Resizable.Panel id="list" class="paneled-workspace-demo__primary">
                <nav class="paneled-workspace-demo__breadcrumbs" aria-label="Workspace breadcrumb"><button type="button" @click="navigate('Overview')">{{ namespace }}</button><ChevronRight aria-hidden="true" /><span aria-current="page">{{ view }}</span></nav>
                <section class="paneled-workspace-demo__list-scroll" aria-label="Workspace page">
                  <div class="paneled-workspace-demo__page-heading"><div><p class="paneled-workspace-demo__eyebrow">{{ namespace }} workspace</p><h2>{{ view }}</h2></div><Button v-if="view === 'Work items'" size="sm" :icon="Plus" @click="createItem">New item</Button><Button v-else size="sm" variant="outline" :icon="ListChecks" @click="navigate('Work items')">View work items</Button></div>
                  <template v-if="view === 'Work items'">
                    <div class="paneled-workspace-demo__filters"><div class="paneled-workspace-demo__filter"><Search aria-hidden="true" /><Input v-model="filter" size="sm" type="search" aria-label="Filter work items" placeholder="Filter work items" @keydown.esc="filter = ''" /></div><div class="paneled-workspace-demo__state-filter" role="group" aria-label="Item state"><button v-for="state in ['All', 'Open', 'Closed']" :key="state" type="button" :aria-pressed="stateFilter === state" @click="stateFilter = state">{{ state }}</button></div></div>
                    <div class="paneled-workspace-demo__list-meta"><span>{{ visibleItems.length }} work items</span><span>Recently updated</span></div>
                    <ul class="paneled-workspace-demo__items" aria-label="Work items">
                      <li v-for="item in visibleItems" :key="item.id" :data-selected="detailOpen && detailId === item.id || undefined"><component :is="item.status === 'Closed' ? CircleCheck : Circle" class="paneled-workspace-demo__item-icon" :data-closed="item.status === 'Closed' || undefined" aria-hidden="true" /><div class="paneled-workspace-demo__item-main"><button type="button" :data-work-item="item.id" :aria-expanded="detailOpen && detailId === item.id" aria-haspopup="dialog" @click="openItem(item, $event)">{{ item.title }}</button><p>{{ item.project }} <span aria-hidden="true">·</span> #{{ item.id }} <span aria-hidden="true">·</span> {{ item.owner }}</p><div class="paneled-workspace-demo__labels"><span :data-label="item.label">{{ item.label }}</span><span class="paneled-workspace-demo__state">{{ item.status }}</span></div></div><div class="paneled-workspace-demo__item-end"><Avatar.Root><Avatar.Fallback>{{ item.owner.split(' ').map(word => word[0]).join('') }}</Avatar.Fallback></Avatar.Root><span>{{ item.updated }}</span><span v-if="item.notes.length"><MessageSquare aria-hidden="true" />{{ item.notes.length }}</span></div></li>
                    </ul>
                    <div v-if="!visibleItems.length" class="paneled-workspace-demo__empty"><Search aria-hidden="true" /><h3>No work items found</h3><p>Change the search text or select another state.</p><Button variant="outline" size="sm" @click="filter = ''; stateFilter = 'All'">Clear filters</Button></div>
                  </template>
                  <div v-else class="paneled-workspace-demo__overview"><p>Keep the work in {{ namespace }} connected, from the first mesh to the final report.</p><div class="paneled-workspace-demo__summary"><div><strong>{{ namespaceItems.filter(item => item.status !== 'Closed').length }}</strong><span>Open work items</span></div><div><strong>3</strong><span>Active studies</span></div><div><strong>{{ namespaceItems.filter(item => item.status === 'In review').length }}</strong><span>Ready for review</span></div></div><h3>{{ view === 'Keyboard shortcuts' ? 'Keyboard shortcuts' : 'Continue your work' }}</h3><dl v-if="view === 'Keyboard shortcuts'"><div><dt>Search or go to</dt><dd>/ or Ctrl / Cmd + K</dd></div><div><dt>Close a panel or popup</dt><dd>Escape</dd></div><div><dt>Resize split panels</dt><dd>Focus the separator and use arrow keys</dd></div></dl><ul v-else><li v-for="item in namespaceItems.slice(0, 4)" :key="item.id"><button type="button" @click="openItem(item, $event)">{{ item.title }}<ArrowUpRight aria-hidden="true" /></button><p>{{ item.project }} · {{ item.owner }}</p></li></ul><p class="paneled-workspace-demo__quiet">This workspace uses local example data. Your changes last until reload.</p></div>
                </section>
              </Resizable.Panel>
              <Resizable.Handle v-if="detailOpen && split" id="list:detail" aria-label="Resize work item panels" class="paneled-workspace-demo__resize" />
              <Resizable.Panel id="detail" class="paneled-workspace-demo__detail-region">
                <Dialog.Root :open="detailOpen" @update:open="updateDetailOpen" @exit-complete="restoreItemFocus" :restore-focus="false" :modal="false" :trap-focus="false" :prevent-scroll="false" :close-on-interact-outside="false" :initial-focus-el="() => detailHeading ?? null" :final-focus-el="finalDetailFocus" aria-label="Work item details">
                  <Dialog.Content :teleport="false" :show-backdrop="false" :show-close-button="false" class="paneled-workspace-demo__detail" aria-label="Work item details" :inert="!detailOpen || undefined">
                    <div class="paneled-workspace-demo__detail-bar"><span>{{ currentItem?.project }} <strong>#{{ currentItem?.id }}</strong></span><Dialog.Close as-child><Button variant="ghost" size="sm" shape="square" :icon="X" aria-label="Close details" /></Dialog.Close></div>
                    <div v-if="currentItem" class="paneled-workspace-demo__detail-scroll"><h2 ref="detailHeading" tabindex="-1">{{ currentItem.title }}</h2><p class="paneled-workspace-demo__detail-meta"><span :data-status="currentItem.status">{{ currentItem.status }}</span> Created by {{ currentItem.owner }}</p><div class="paneled-workspace-demo__detail-columns"><article><h3>Summary</h3><p>{{ currentItem.summary }}</p><h3>Acceptance criteria</h3><ul><li>The result can be reproduced from the saved project configuration.</li><li>Quality checks are documented and reviewed by another team member.</li><li>Reference data and result files are attached to the study report.</li></ul><blockquote>Keep the reference case unchanged. Record each comparison as a separate run so the review remains traceable.</blockquote><h3>Review plan</h3><p>Check the setup, compare the key measurements, and add a short note with the outcome. A second reviewer can then confirm the result before the work item is closed.</p><h3>Activity</h3><ol class="paneled-workspace-demo__comments"><li v-for="(note, index) in currentItem.notes" :key="index"><Avatar.Root><Avatar.Fallback>{{ note.author.split(' ').map(word => word[0]).join('') }}</Avatar.Fallback></Avatar.Root><div><strong>{{ note.author }}</strong><p>{{ note.text }}</p></div></li><li v-if="!currentItem.notes.length" class="paneled-workspace-demo__quiet">No comments yet.</li></ol><form class="paneled-workspace-demo__comment-form" @submit.prevent="addComment"><Field.Root><Field.Label>Add a comment</Field.Label><Field.Textarea v-model="comment" :rows="3" placeholder="Add context for your team…" /></Field.Root><Button size="sm" variant="outline" :disabled="!comment.trim()" type="submit">Add comment</Button></form></article><aside aria-label="Work item properties"><dl><div><dt>Status</dt><dd>{{ currentItem.status }}</dd></div><div><dt>Assignee</dt><dd>{{ currentItem.owner }}</dd></div><div><dt>Project</dt><dd>{{ currentItem.project }}</dd></div><div><dt>Label</dt><dd>{{ currentItem.label }}</dd></div><div><dt>Milestone</dt><dd>November validation</dd></div><div><dt>Updated</dt><dd>{{ currentItem.updated }}</dd></div></dl><Button size="sm" variant="outline" :icon="currentItem.status === 'Closed' ? Circle : Check" @click="toggleStatus">{{ currentItem.status === 'Closed' ? 'Reopen item' : 'Close item' }}</Button></aside></div></div>
                  </Dialog.Content>
                </Dialog.Root>
              </Resizable.Panel>
            </Resizable.Root>
          </div>
          <div class="paneled-workspace-demo__activity-region"><Dialog.Root :open="activityOpen" @update:open="updateActivityOpen" @exit-complete="restoreActivityFocus" :restore-focus="false" :modal="false" :trap-focus="false" :prevent-scroll="false" :close-on-interact-outside="false" :initial-focus-el="() => activityHeading ?? null" :final-focus-el="finalActivityFocus" aria-label="Workspace activity"><Dialog.Content :teleport="false" :show-backdrop="false" :show-close-button="false" class="paneled-workspace-demo__activity" aria-label="Workspace activity" :inert="!activityOpen || undefined"><header><h2 ref="activityHeading" tabindex="-1">Activity</h2><Button variant="ghost" size="sm" shape="square" :icon="X" aria-label="Close activity" @click="updateActivityOpen(false)" /></header><p>Recent updates across {{ namespace }}.</p><ol><li v-for="(event, index) in events" :key="index"><Activity aria-hidden="true" /><div><p>{{ event }}</p><small>{{ index ? 'Earlier today' : 'Latest update' }}</small></div></li></ol><Button size="sm" variant="outline" @click="navigate('Activity log'); activityOpen = false">View activity log</Button></Dialog.Content></Dialog.Root></div>
          <nav class="paneled-workspace-demo__utility-rail" aria-label="Workspace tools"><Button variant="ghost" size="sm" shape="square" :icon="Activity" aria-label="Activity" :aria-expanded="activityOpen" @click="toggleActivity" /><Button variant="ghost" size="sm" shape="square" :icon="CircleHelp" aria-label="Workspace help" @click="navigate('Help')" /></nav>
        </div>
        <CommandPalette.Dialog v-model:open="searchOpen" class="paneled-workspace-demo__search-dialog" aria-label="Search paneled workspace"><CommandPalette.Panel v-model:value="searchQuery" :open="searchOpen" :items="searchEntries" :filter="false" :item-to-string-value="entryLabel" @close="searchOpen = false" @select="selectSearch"><CommandPalette.Input aria-label="Search pages and work items" placeholder="Search or go to…" /><CommandPalette.List><CommandPalette.Results v-slot="{ item }"><CommandPalette.ResultItem :value="item" :title="(item as SearchEntry).label" :description="(item as SearchEntry).description"><template #icon><ListChecks v-if="(item as SearchEntry).id" :size="16" aria-hidden="true" /><ArrowUpRight v-else :size="16" aria-hidden="true" /></template></CommandPalette.ResultItem></CommandPalette.Results><CommandPalette.Empty>No pages or work items found.</CommandPalette.Empty></CommandPalette.List><CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></CommandPalette.Footer></CommandPalette.Panel></CommandPalette.Dialog>
        <Dialog.Root v-model:open="catalogOpen" :final-focus-el="finalCatalogFocus" aria-label="Feature catalog"><Dialog.Content class="paneled-workspace-demo__catalog"><Dialog.Title>Feature catalog</Dialog.Title><Dialog.Description>Find a page and pin it to your navigation.</Dialog.Description><Input v-model="catalogQuery" size="sm" type="search" aria-label="Find a feature" placeholder="Find a feature" /><ul><li v-for="page in catalogPages" :key="page"><button type="button" @click="catalogOpen = false; navigate(page)">{{ page }}<ArrowUpRight aria-hidden="true" /></button><Button size="sm" variant="ghost" shape="square" :icon="Pin" :aria-label="`${pinned.includes(page) ? 'Unpin' : 'Pin'} ${page}`" :aria-pressed="pinned.includes(page)" @click="togglePin(page)" /></li></ul><p v-if="!catalogPages.length">No features found.</p></Dialog.Content></Dialog.Root>
      </template>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-paneled-workspace-demo.css"></style>
