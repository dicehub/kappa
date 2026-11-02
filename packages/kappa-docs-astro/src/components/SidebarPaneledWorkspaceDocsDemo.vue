<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherAvatarItems } from "../data/workspace-switcher-demo";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button, ToolbarButton } from "@dicehub/kappa/components/button";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import { Field } from "@dicehub/kappa/components/field";
import { Table } from "@dicehub/kappa/components/table";
import { Badge } from "@dicehub/kappa/components/badge";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Kbd, KbdGroup } from "@dicehub/kappa/components/kbd";
import PaneledWorkspaceProfileMenu from "./PaneledWorkspaceProfileMenu.vue";
import PaneledWorkspaceHelpMenu from "./PaneledWorkspaceHelpMenu.vue";
import PaneledWorkspaceCredits from "./PaneledWorkspaceCredits.vue";
import PaneledWorkspaceComputePages from "./PaneledWorkspaceComputePages.vue";
import PaneledWorkspaceNotifications from "./PaneledWorkspaceNotifications.vue";
import PaneledWorkspaceAiChat from "./PaneledWorkspaceAiChat.vue";
import { createWorkspaceNotifications, type WorkspaceNotification } from "./paneled-workspace-notifications";
import type { WorkspaceChatState } from "./paneled-workspace-chat";
import { workspaceCompute, runningJobs, creditAmount, runStatusVariant, type WorkspaceRun } from "./paneled-workspace-compute";
import PaneledWorkspaceProjectPages from "./PaneledWorkspaceProjectPages.vue";
import PaneledWorkspaceProjectSummary from "./PaneledWorkspaceProjectSummary.vue";
import PaneledWorkspaceProjects from "./PaneledWorkspaceProjects.vue";
import PaneledWorkspaceTemplates from "./PaneledWorkspaceTemplates.vue";
import PaneledWorkspaceCalculators from "./PaneledWorkspaceCalculators.vue";
import { workspaceCalculatorPages } from "./paneled-workspace-calculators";
import { workspaceTemplatePages } from "./paneled-workspace-templates";
import PaneledWorkspaceNavigation from "./PaneledWorkspaceNavigation.vue";
import PaneledWorkspaceProjectSwitcher from "./PaneledWorkspaceProjectSwitcher.vue";
import { usePaneledWorkspaceLocation } from "./use-paneled-workspace-location";
import { limitedWorkspacePages, projectCategories, workspaceCategories as defaultWorkspaceCategories, workspaceUtilityDescriptions } from "./paneled-workspace-navigation";
import { Activity, ArrowLeft, ArrowUpRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, CirclePlay, LayoutDashboard, Maximize2, Minimize2, Plus, Search, Sparkles, UsersRound, X } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const root = ref<HTMLElement>();
const projectSwitcher = ref<HTMLElement>();
const namespace = ref("Ros.Space");
const projectNames = ref<Record<string, string>>({ "Ros.Space": "Aster VTOL", Engineering: "Vega demonstrator", Research: "Orion testbed" });
const { projects: workspaceProjects, view, selectedProject, lastProject, isProjectOverview, hrefForPage: breadcrumbHref, selectPage, readLocation, renameProject } = usePaneledWorkspaceLocation(props.standalone);
const workspaceCategories = computed(() => defaultWorkspaceCategories.map(group => group.label === "Projects"
  ? { ...group, pages: ["All projects", ...workspaceProjects.value.slice(0, 6).map(project => project.code)] } : group));
const pageLabel = (page: string) => workspaceProjects.value.find(project => project.code === page)?.name ?? page;
const projectName = computed(() => selectedProject.value?.name ?? projectNames.value[namespace.value]);
const workspaceOptions = namespaceSwitcherAvatarItems.filter(item => Object.hasOwn(projectNames.value, item.value));
const workspaceMenuOpen = ref(false);
const isTemplatePage = computed(() => workspaceTemplatePages.includes(view.value));
const isCalculatorPage = computed(() => workspaceCalculatorPages.includes(view.value));
const utilityDescription = computed(() => workspaceUtilityDescriptions[view.value]);
const isLimitedPage = computed(() => limitedWorkspacePages.includes(view.value));
const navigationOpen = ref(true);
const navigationInitialized = ref(!props.standalone);
let navigationInitFrame = 0;
const mobileOpen = ref(false);
watch([navigationOpen, mobileOpen], () => { workspaceMenuOpen.value = false; });
const filter = ref("");
const stateFilter = ref("All runs");
const searchOpen = ref(false);
const searchQuery = ref("");
const searchKeyboard = ref(false);
const asideOpen = ref(false);
const asideMaximized = ref(false);
const sidePanel = ref<"ai" | "activities">("activities");
const panelTitle = computed(() => sidePanel.value === "ai" ? "AI chat" : "Activities");
const railOnBottom = ref(false);
let railObserver: ResizeObserver | undefined;
const aiChat = ref<WorkspaceChatState>({ threads: {}, drafts: {} });
const activityList = ref<HTMLElement>();
const activityScrollStart = ref(false);
const activityScrollEnd = ref(false);
function updateActivityScroll() {
  const list = activityList.value;
  activityScrollStart.value = !!list && list.scrollTop > 1;
  activityScrollEnd.value = !!list && list.scrollHeight - list.clientHeight - list.scrollTop > 1;
}
watch(activityList, (list, _previous, cleanup) => {
  if (!list) return;
  const resize = new ResizeObserver(updateActivityScroll);
  resize.observe(list);
  updateActivityScroll();
  cleanup(() => resize.disconnect());
});
const detailOpen = ref(false);
const detailId = ref<string>();
const comment = ref("");
const detailHeading = ref<HTMLElement>();
const asideHeading = ref<HTMLElement>();
let asideOpener: HTMLElement | undefined;
let detailOpener: HTMLElement | undefined;

const computeAccounts = ref(structuredClone(workspaceCompute));
const creditsReady = ref(false);
const compute = computed(() => computeAccounts.value[namespace.value]);
const activeRunCount = computed(() => runningJobs(compute.value.runs).length);
const currentRun = computed(() => compute.value.runs.find(run => run.id === detailId.value));
const runNotes = ref<Record<string, { author: string; text: string }[]>>({});
const currentNotes = computed(() => currentRun.value ? runNotes.value[currentRun.value.id] ?? [] : []);
const events = ref(["Maya updated the rotor mesh quality report.", "Alex completed the inlet reference run.", "Sam requested a review of the heat exchanger results."]);
const notifications = ref(createWorkspaceNotifications(Object.keys(projectNames.value)));
const namespaceNotifications = computed(() => notifications.value.filter(item => item.namespace === namespace.value));
watch(() => events.value.length, updateActivityScroll, { flush: "post" });
type SearchEntry = { label: string; description: string; id?: string; page?: string; namespace?: string };
type SearchGroup = { label: string; items: SearchEntry[] };
const projectSearchPages = computed(() => selectedProject.value ? ["Overview", "Project activity"] : []);
const navigationSearchGroups = computed<SearchGroup[]>(() => [
  { label: "Your work", items: [{ label: "Dashboard", description: "" }, ...(!selectedProject.value ? [{ label: "Simulation runs", description: "" }] : [])] },
  { label: "Project", items: projectSearchPages.value.map(page => ({ label: page, page, description: "" })) },
  ...[...workspaceCategories.value, ...(selectedProject.value ? projectCategories : [])].map(group => ({ label: group.label, items: group.pages.map(page => ({ label: pageLabel(page), page, description: "" })) })),
  { label: "Recent simulation runs", items: compute.value.runs.slice(0, 4).map(run => ({ label: run.name, description: `${run.id} · ${run.status}`, id: run.id })) },
  { label: "Workspaces", items: workspaceOptions.map(item => ({ label: item.name, namespace: item.value, description: "" })) },
]);
const searchEntries = computed<SearchEntry[]>(() => [
  ...[...new Set(["Dashboard", "Simulation runs", ...projectSearchPages.value, ...[...workspaceCategories.value, ...(selectedProject.value ? projectCategories : [])].flatMap(group => group.pages), ...workspaceProjects.value.map(project => project.code)])].map(page => ({ label: pageLabel(page), page, description: "" })),
  ...compute.value.runs.map(run => ({ label: run.name, description: `${run.id} · ${run.status}`, id: run.id })),
  ...workspaceOptions.map(item => ({ label: item.name, namespace: item.value, description: "Workspace" })),
].filter(item => `${item.label} ${item.description}`.toLowerCase().includes(searchQuery.value.trim().toLowerCase())));
const searchGroups = computed<SearchGroup[]>(() => searchQuery.value.trim()
  ? [{ label: "Search results", items: searchEntries.value }].filter(group => group.items.length)
  : navigationSearchGroups.value.filter(group => group.items.length));
const selectableSearchItems = (groups: unknown[]) => (groups as SearchGroup[]).flatMap(group => group.items);
const entryLabel = (item: unknown) => (item as SearchEntry).label;
const entryValue = (item: unknown) => {
  const entry = item as SearchEntry;
  return entry.id ? `run:${entry.id}` : entry.namespace ? `namespace:${entry.namespace}` : `page:${entry.page ?? entry.label}`;
};

function navigateLink(page: string, event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const fromFlyout = event.currentTarget instanceof Element && event.currentTarget.closest("[data-paneled-flyout]");
  const backNavigation = event.currentTarget instanceof Element && event.currentTarget.matches(".paneled-workspace-demo__back")
    ? event.currentTarget.closest(".paneled-workspace-demo__navigation") : null;
  navigate(page);
  if (backNavigation) void nextTick(() => focusWorkspaceNavigation(backNavigation));
  if (fromFlyout) void nextTick(focusPageHeading);
}
function focusPageHeading() {
  const heading = root.value?.querySelector<HTMLElement>(".paneled-workspace-demo__page-content h2");
  heading?.setAttribute("tabindex", "-1");
  heading?.focus({ preventScroll: true });
}
function restoreRemovedPageFocus(previous: Element | null, wasMobileOpen: boolean) {
  if (wasMobileOpen) return;
  void nextTick(() => {
    if (previous && !previous.isConnected && document.activeElement === document.body) focusPageHeading();
  });
}
function focusWorkspaceNavigation(navigation: Element) {
  const workspace = navigation.querySelector<HTMLElement>('[data-slot="sidebar-sliding-view"][data-value="workspace"]');
  const link = workspace?.querySelector<HTMLElement>('a[aria-current="page"]');
  link?.focus({ preventScroll: true });
  if (!link || document.activeElement !== link) workspace?.focus({ preventScroll: true });
}
function navigateFromProjectSwitcher(page: string) {
  // The switcher unmounts when leaving a project, so its trigger cannot receive focus.
  const navigation = projectSwitcher.value?.closest('.paneled-workspace-demo__navigation');
  navigate(page);
  if (!selectedProject.value && navigation) void nextTick(() => focusWorkspaceNavigation(navigation));
}
function finishNavigation(keepDrawer = false) {
  detailOpen.value = false;
  if (!keepDrawer) mobileOpen.value = false;
  filter.value = "";
}
function syncLocation() {
  const navigation = projectSwitcher.value?.closest('.paneled-workspace-demo__navigation');
  const active = document.activeElement;
  const restoreWorkspaceFocus = navigation?.querySelector('[data-slot="sidebar-header"]')?.contains(active)
    || active?.closest('.paneled-project-switcher__popover');
  const previousProject = selectedProject.value?.code;
  const wasMobileOpen = mobileOpen.value;
  readLocation();
  finishNavigation(previousProject !== selectedProject.value?.code);
  restoreRemovedPageFocus(active, wasMobileOpen);
  if (restoreWorkspaceFocus && !selectedProject.value && navigation) void nextTick(() => focusWorkspaceNavigation(navigation));
}
function navigate(page: string) {
  const previousFocus = document.activeElement;
  const wasMobileOpen = mobileOpen.value;
  const contextChanged = selectPage(page);
  // Keep the drawer open to show project navigation or the return to all projects.
  finishNavigation(contextChanged && (!!selectedProject.value || page === "All projects"));
  restoreRemovedPageFocus(previousFocus, wasMobileOpen);
}
function changeNamespace(value: string) { namespace.value = value; stateFilter.value = "All runs"; navigate("Dashboard"); mobileOpen.value = false; }
async function openRun(run: WorkspaceRun, event?: Event) {
  detailOpener = event?.currentTarget instanceof HTMLElement ? event.currentTarget : root.value?.querySelector<HTMLElement>(`[data-simulation-run="${run.id}"]`) ?? undefined;
  if (view.value !== "Simulation runs") { stateFilter.value = "All runs"; navigate("Simulation runs"); }
  detailId.value = run.id;
  comment.value = "";
  detailOpen.value = true;
  await nextTick();
  detailHeading.value?.focus({ preventScroll: true });
}
function finalDetailFocus() { return detailOpener?.isConnected && detailOpener.getClientRects().length ? detailOpener : root.value?.querySelector<HTMLElement>('[data-paneled-search]') ?? null; }
function createRun() {
  const number = Math.max(...Object.values(computeAccounts.value).flatMap(account => account.runs.map(run => Number(run.id.slice(4))))) + 1;
  const run: WorkspaceRun = { id: `SIM-${number}`, name: `Untitled simulation run ${number}`, status: "Queued", cpus: 16, elapsed: "—", hourlyCents: 120, costCents: 0 };
  compute.value.runs.unshift(run);
  filter.value = "";
  stateFilter.value = "All runs";
  events.value.unshift(`Ros.Space created simulation run ${run.id}.`);
  void openRun(run);
}
function cancelRun() {
  if (!currentRun.value || !["Running", "Queued"].includes(currentRun.value.status)) return;
  currentRun.value.status = "Cancelled";
  events.value.unshift(`Simulation run ${currentRun.value.id} was cancelled.`);
  void nextTick(() => detailHeading.value?.focus({ preventScroll: true }));
}
function addComment() { if (currentRun.value && comment.value.trim()) { (runNotes.value[currentRun.value.id] ??= []).push({ author: "Ros.Space", text: comment.value.trim() }); comment.value = ""; } }
function toggleTool(tool: "ai" | "activities", event: Event) {
  asideOpener = event.currentTarget as HTMLElement;
  const open = !asideOpen.value || sidePanel.value !== tool;
  sidePanel.value = tool;
  updateAsideOpen(open);
  if (open) void nextTick(() => asideHeading.value?.focus({ preventScroll: true }));
}
function updateAsideOpen(open: boolean) { asideOpen.value = open; }
function finalAsideFocus() { return asideOpener?.isConnected ? asideOpener : null; }
function openNotification(notification: WorkspaceNotification) { notification.read = true; navigate(notification.page); }
function readAllNotifications() { namespaceNotifications.value.forEach(item => { item.read = true; }); }
function showSearch() { searchKeyboard.value = false; searchQuery.value = ""; searchOpen.value = true; }
async function selectSearch(value: unknown) {
  const entry = value as SearchEntry;
  searchOpen.value = false;
  await nextTick();
  mobileOpen.value = false;
  if (entry.id) { const run = compute.value.runs.find(run => run.id === entry.id); if (run) { await openRun(run); detailOpener = root.value?.querySelector<HTMLElement>('[data-paneled-search]') ?? undefined; } }
  else if (entry.namespace) changeNamespace(entry.namespace);
  else navigate(entry.page ?? entry.label);
}
function shortcut(event: KeyboardEvent) {
  const showShortcuts = event.key === "?" && !event.ctrlKey && !event.metaKey && !event.altKey;
  const openSearch = event.key.toLowerCase() === "k" && event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey;
  if ((!showShortcuts && !openSearch) || event.defaultPrevented || event.repeat || event.isComposing || searchOpen.value) return;
  const target = event.target as HTMLElement | null;
  if (target?.closest('input,textarea,select,[contenteditable="true"],[role="textbox"],[role="dialog"][aria-modal="true"],[role="menu"]')) return;
  if (document.querySelector('[role="dialog"][aria-modal="true"][data-state="open"], [role="menu"][data-state="open"]')) return;
  event.preventDefault();
  event.stopPropagation();
  if (showShortcuts) { navigate("Keyboard shortcuts"); return; }
  root.value?.querySelector<HTMLElement>('[data-paneled-search]')?.focus();
  showSearch();
}
onMounted(async () => {
  creditsReady.value = true;
  if (root.value) {
    railOnBottom.value = root.value.clientWidth < 992;
    railObserver = new ResizeObserver(([entry]) => { railOnBottom.value = entry.contentRect.width < 992; });
    railObserver.observe(root.value);
  }
  if (props.standalone) { syncLocation(); window.addEventListener("keydown", shortcut); window.addEventListener("popstate", syncLocation); }
  await nextTick();
  if (!root.value?.isConnected) return;
  // Finish Vue's initial enter frames before enabling user-triggered slides.
  navigationInitFrame = requestAnimationFrame(() => {
    navigationInitFrame = requestAnimationFrame(() => { navigationInitialized.value = true; });
  });
});
onBeforeUnmount(() => { railObserver?.disconnect(); cancelAnimationFrame(navigationInitFrame); window.removeEventListener("keydown", shortcut); window.removeEventListener("popstate", syncLocation); });
</script>

<template>
  <div ref="root" class="paneled-workspace-demo" data-sidebar-block="paneled-workspace" :data-standalone="props.standalone || undefined" :data-activity="asideOpen || undefined" @keydown="shortcut">
    <AppShell.Root appearance="paneled" bloom hide-desktop-trigger resizable :default-width="240" :min-width="200" :max-width="420" v-model:open="navigationOpen" v-model:mobile-open="mobileOpen" label="Paneled workspace navigation" :navigation-props="{ class: 'paneled-workspace-demo__navigation' }" class="paneled-workspace-demo__layout">
      <template #toolbar-start>
        <a class="kappa-app-shell__brand" :href="breadcrumbHref('Dashboard')" aria-label="dicehub home" @click="navigateLink('Dashboard', $event)"><DicehubLogo variant="glyph" aria-hidden="true" /></a>
      </template>
      <template #toolbar>
        <AppShell.SearchTrigger shortcut="Ctrl + K" data-paneled-search :icon="Search" aria-keyshortcuts="Control+K" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="showSearch" />
        <div class="paneled-workspace-demo__global-actions">
          <PaneledWorkspaceCredits :namespace="namespace" :compute="compute" :loading="!creditsReady" @navigate="navigate" @add-credits="compute.balanceCents += $event" />
          <ToolbarButton :icon="CirclePlay" :aria-label="`Runs: ${activeRunCount} active`" :tooltip="`${activeRunCount} active simulation runs`" @click="navigate('Simulation runs')">{{ activeRunCount }}</ToolbarButton>
          <PaneledWorkspaceNotifications :items="namespaceNotifications" @open="openNotification" @read-all="readAllNotifications" />
          <PaneledWorkspaceProfileMenu @navigate="navigate" />
        </div>
      </template>
      <template #header="context">
        <Sidebar.MenuButton v-if="selectedProject" :href="breadcrumbHref('All projects')" tooltip="Back to Projects" :icon="ArrowLeft" class="paneled-workspace-demo__back" @click="navigateLink('All projects', $event)">Back to Projects</Sidebar.MenuButton>
        <div class="paneled-workspace-demo__context-row" :data-collapsed="context.iconCollapsed || undefined">
          <p v-if="!context.iconCollapsed" class="paneled-workspace-demo__context-label">{{ selectedProject ? "Project" : "Your work" }}</p>
          <Sidebar.Trigger v-if="!context.isMobile" class="paneled-workspace-demo__pin"
            :aria-label="navigationOpen ? 'Collapse sidebar' : 'Expand sidebar'">
            <component :is="navigationOpen ? ChevronsLeft : ChevronsRight" aria-hidden="true" />
          </Sidebar.Trigger>
        </div>
        <div v-if="selectedProject" ref="projectSwitcher" class="paneled-workspace-demo__project-switcher" :data-collapsed="context.iconCollapsed || undefined">
          <PaneledWorkspaceProjectSwitcher :project="selectedProject" :projects="workspaceProjects" :href-for-page="breadcrumbHref"
            :compact="context.iconCollapsed" :is-mobile="context.isMobile" @navigate="navigateFromProjectSwitcher" />
        </div>
      </template>
      <template #navigation="context">
        <Sidebar.SlidingViews class="paneled-workspace-demo__sliding-views" :data-initializing="!navigationInitialized || undefined" :active-key="selectedProject ? 'project' : 'workspace'" :direction="selectedProject ? 'left' : 'right'">
          <Sidebar.SlidingView value="workspace" label="Workspace navigation">
            <PaneledWorkspaceNavigation :categories="workspaceCategories" :view="view" :active="!selectedProject" :icon-collapsed="context.iconCollapsed" :is-mobile="context.isMobile" :menu-open="workspaceMenuOpen" :run-count="compute.runs.length" label="Workspace links" :href-for-page="breadcrumbHref" :page-label="pageLabel" @navigate="navigateLink">
              <Sidebar.MenuButton :href="breadcrumbHref('Dashboard')" tooltip="Dashboard" :icon="LayoutDashboard" :active="view === 'Dashboard'" class="paneled-workspace-demo__workspace paneled-workspace-demo__dashboard" @click="navigateLink('Dashboard', $event)">Dashboard</Sidebar.MenuButton>
              <Sidebar.MenuButton :href="breadcrumbHref('Simulation runs')" tooltip="Simulation runs" :icon="CirclePlay" :active="view === 'Simulation runs'" @click="navigateLink('Simulation runs', $event)">Simulation runs<span class="paneled-workspace-demo__count" aria-hidden="true">{{ compute.runs.length }}</span></Sidebar.MenuButton>
            </PaneledWorkspaceNavigation>
          </Sidebar.SlidingView>
          <Sidebar.SlidingView value="project" :label="`${lastProject.name} navigation`">
            <PaneledWorkspaceNavigation :categories="projectCategories" :view="view" :active="!!selectedProject" :icon-collapsed="context.iconCollapsed" :is-mobile="context.isMobile" :menu-open="workspaceMenuOpen" :run-count="compute.runs.length" label="Project links" :href-for-page="breadcrumbHref" @navigate="navigateLink">
              <Sidebar.MenuButton :href="breadcrumbHref(lastProject.code)" tooltip="Overview" :icon="LayoutDashboard" :active="isProjectOverview" @click="navigateLink(lastProject.code, $event)">Overview</Sidebar.MenuButton>
              <Sidebar.MenuButton :href="breadcrumbHref('Project activity')" tooltip="Project activity" :icon="Activity" :active="view === 'Project activity'" @click="navigateLink('Project activity', $event)">Project activity</Sidebar.MenuButton>
            </PaneledWorkspaceNavigation>
          </Sidebar.SlidingView>
        </Sidebar.SlidingViews>
      </template>
      <template #footer="context">
        <div class="paneled-workspace-demo__workspace-row" :data-collapsed="context.iconCollapsed || undefined">
          <PaneledWorkspaceHelpMenu v-if="context.isMobile || context.iconCollapsed" :is-mobile="context.isMobile" :icon-collapsed="context.iconCollapsed" :href-for-page="breadcrumbHref" @navigate="navigate" />
          <WorkspaceSwitcher show-arrow :model-value="namespace" v-model:open="workspaceMenuOpen" :items="workspaceOptions"
            :workspace-actions="[{ value: 'New group', label: 'Create Group', icon: Plus }, { value: 'Groups', label: 'Show all groups', icon: UsersRound }]" @action="navigate($event.value)"
            label="Workspaces" account-label="ros@example.test" :teleport="!context.isMobile"
            :positioning="{ placement: context.iconCollapsed ? 'right-end' : 'top-start', gutter: 6, strategy: 'fixed' }" @update:model-value="changeNamespace">
            <template #trigger="{ workspace, disabled }">
              <Sidebar.MenuButton :icon="workspace?.icon" :disabled="disabled" :aria-label="`Workspace: ${namespace}`"
                :tooltip="workspaceMenuOpen ? undefined : `Workspace: ${namespace}`"
                class="paneled-workspace-demo__workspace paneled-workspace-demo__workspace-switcher">
                <template v-if="workspace?.avatarSrc" #icon>
                  <Avatar.Root size="sm">
                    <Avatar.Image :src="workspace.avatarSrc" alt="" />
                    <Avatar.Fallback>{{ workspace.initials }}</Avatar.Fallback>
                  </Avatar.Root>
                </template>
                <span>{{ namespace }}</span><ChevronsUpDown aria-hidden="true" />
              </Sidebar.MenuButton>
            </template>
          </WorkspaceSwitcher>
          <PaneledWorkspaceHelpMenu v-if="!context.isMobile && !context.iconCollapsed" :is-mobile="context.isMobile" :icon-collapsed="context.iconCollapsed" :href-for-page="breadcrumbHref" @navigate="navigate" />
        </div>
      </template>
      <template #default>
        <AppShell.Panels v-model:detail-open="detailOpen" v-model:aside-open="asideOpen" v-model:aside-maximized="asideMaximized"
          detail-label="Simulation run details" :aside-label="panelTitle" resize-label="Resize simulation run panels" :aside-resize-label="`Resize ${panelTitle}`"
          :initial-detail-focus="() => detailHeading ?? null" :final-detail-focus="finalDetailFocus"
          :initial-aside-focus="() => asideHeading ?? null" :final-aside-focus="finalAsideFocus">
                <Breadcrumbs.Root size="sm" class="paneled-workspace-demo__breadcrumbs" aria-label="Workspace breadcrumb">
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref('Dashboard')" @click="navigateLink('Dashboard', $event)">{{ namespace }}</Breadcrumbs.Link></Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <template v-if="selectedProject && !isProjectOverview">
                      <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref(selectedProject.code)" @click="navigateLink(selectedProject.code, $event)">{{ selectedProject.name }}</Breadcrumbs.Link></Breadcrumbs.Item>
                      <Breadcrumbs.Separator />
                    </template>
                    <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref(view)" aria-current="page" @click="navigateLink(view, $event)">{{ isProjectOverview ? projectName : view }}</Breadcrumbs.Link></Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Breadcrumbs.Root>
                <section class="paneled-workspace-demo__list-scroll" :data-width="isLimitedPage ? 'limited' : undefined" aria-label="Workspace page">
                  <div class="paneled-workspace-demo__page-content" :data-width="isLimitedPage ? 'limited' : undefined">
                  <div class="paneled-workspace-demo__page-heading"><h2>{{ isProjectOverview ? projectName : view }}</h2><Button v-if="view === 'Simulation runs'" size="sm" :icon="Plus" @click="createRun">New simulation run</Button><Button v-else size="sm" variant="outline" :icon="CirclePlay" @click="navigate('Simulation runs')">View simulation runs</Button></div>
                  <PaneledWorkspaceProjectSummary v-if="selectedProject && isProjectOverview" :project="selectedProject" />
                  <PaneledWorkspaceProjects v-else-if="view === 'All projects'" :projects="workspaceProjects" :href-for-page="breadcrumbHref" @open="navigateLink" />
                  <div v-else-if="view === 'Groups'" class="paneled-workspace-demo__overview">
                    <p>Choose a group to open its workspace.</p>
                    <Table compact aria-label="Groups">
                      <Table.Header><Table.Row><Table.Head scope="col">Group</Table.Head><Table.Head scope="col">Details</Table.Head></Table.Row></Table.Header>
                      <Table.Body><Table.Row v-for="group in workspaceOptions.filter(item => item.value !== 'Ros.Space')" :key="group.value">
                        <Table.Cell><Button variant="link" size="sm" :icon="group.icon" @click="changeNamespace(group.value)">{{ group.name }}</Button></Table.Cell>
                        <Table.Cell>{{ group.description }}</Table.Cell>
                      </Table.Row></Table.Body>
                    </Table>
                  </div>
                  <PaneledWorkspaceTemplates v-else-if="isTemplatePage" :key="view" :page="view" />
                  <PaneledWorkspaceCalculators v-else-if="isCalculatorPage" :key="view" :page="view" />
                  <PaneledWorkspaceProjectPages v-else-if="isLimitedPage && view !== 'Dashboard'" :key="`${namespace}-${selectedProject?.code}-${view}`" :page="view" :project="projectName" :href-for-page="breadcrumbHref" @navigate="navigate" @rename="renameProject" />
                  <PaneledWorkspaceComputePages v-else-if="view === 'Simulation runs' || view === 'Compute usage' || view === 'Billing'" :key="`${namespace}-${view}`" :page="view" :namespace="namespace" :compute="compute" v-model:filter="stateFilter" v-model:query="filter" :selected-id="detailOpen ? detailId : undefined" @open="openRun" />
                  <div v-else-if="utilityDescription" class="paneled-workspace-demo__overview">
                    <p>{{ utilityDescription }}</p>
                    <Button variant="outline" size="sm" @click="navigate('Dashboard')">Return to Dashboard</Button>
                  </div>
                  <div v-else class="paneled-workspace-demo__overview">
                    <p>Follow simulations in {{ selectedProject?.name ?? namespace }}, from the first mesh to the final report.</p>
                    <div class="paneled-workspace-demo__summary">
                      <div><strong>{{ activeRunCount }}</strong><span>Active simulation runs</span></div>
                      <div><strong>{{ compute.runs.filter(run => run.status === 'Queued').length }}</strong><span>Queued simulation runs</span></div>
                      <div><strong>{{ compute.runs.filter(run => run.status === 'Completed').length }}</strong><span>Completed simulation runs</span></div>
                    </div>
                    <h3>{{ view === 'Keyboard shortcuts' ? 'Keyboard shortcuts' : 'Recent simulation runs' }}</h3>
                    <dl v-if="view === 'Keyboard shortcuts'"><div><dt>Show keyboard shortcuts</dt><dd><Kbd>?</Kbd></dd></div><div><dt>Search or go to</dt><dd><KbdGroup><Kbd>Ctrl</Kbd><span>+</span><Kbd>K</Kbd></KbdGroup></dd></div><div><dt>Close a panel or popup</dt><dd>Escape</dd></div><div><dt>Resize split panels</dt><dd>Focus the separator and use arrow keys</dd></div></dl>
                    <ul v-else><li v-for="run in compute.runs.slice(0, 4)" :key="run.id"><Button variant="link" size="sm" :icon="ArrowUpRight" icon-position="inline-end" @click="openRun(run, $event)">{{ run.name }}</Button><p>{{ run.id }} · {{ run.status }} · {{ run.cpus }} vCPUs</p></li></ul>
                    <p class="paneled-workspace-demo__quiet">This workspace uses local example data. Your changes last until reload.</p>
                  </div>
                  </div>
                </section>
          <template #detail="{ close }">
            <div class="paneled-workspace-demo__detail-bar"><span>{{ namespace }} <strong>{{ currentRun?.id }}</strong></span><Button variant="ghost" size="sm" shape="square" :icon="X" aria-label="Close details" @click="close" /></div>
            <div v-if="currentRun" class="paneled-workspace-demo__detail-scroll">
              <h2 ref="detailHeading" tabindex="-1">{{ currentRun.name }}</h2>
              <p class="paneled-workspace-demo__detail-meta"><Badge :variant="runStatusVariant(currentRun.status)">{{ currentRun.status }}</Badge> {{ currentRun.id }}</p>
              <div class="paneled-workspace-demo__detail-columns">
                <article>
                  <h3>Simulation summary</h3>
                  <p>Compute allocation: {{ currentRun.cpus }} vCPUs. Runtime: {{ currentRun.elapsed }}.</p>
                  <h3>Result validation</h3>
                  <ul><li>Check mesh quality and boundary conditions.</li><li>Check residual convergence and mass balance.</li><li>Compare pressure, velocity, and temperature fields with the reference case.</li></ul>
                  <blockquote>Keep the reference case unchanged. Save each comparison as a separate simulation run.</blockquote>
                  <p class="paneled-workspace-demo__quiet">Local example data. No solver or compute service is connected. New runs and cancellations update this preview only.</p>
                  <h3>Run notes</h3>
                  <ol class="paneled-workspace-demo__comments">
                    <li v-for="(note, index) in currentNotes" :key="index"><Avatar.Root><Avatar.Fallback>{{ note.author.split(' ').map(word => word[0]).join('') }}</Avatar.Fallback></Avatar.Root><div><strong>{{ note.author }}</strong><p>{{ note.text }}</p></div></li>
                    <li v-if="!currentNotes.length" class="paneled-workspace-demo__quiet">No notes yet.</li>
                  </ol>
                  <form class="paneled-workspace-demo__comment-form" @submit.prevent="addComment"><Field.Root><Field.Label>Add a run note</Field.Label><Field.Textarea v-model="comment" :rows="3" placeholder="Record setup changes or observations…" /></Field.Root><Button size="sm" variant="outline" :disabled="!comment.trim()" type="submit">Add note</Button></form>
                </article>
                <aside aria-label="Simulation run properties">
                  <dl><div><dt>Status</dt><dd>{{ currentRun.status }}</dd></div><div><dt>Workspace</dt><dd>{{ namespace }}</dd></div><div><dt>Compute</dt><dd>{{ currentRun.cpus }} vCPUs</dd></div><div><dt>Runtime</dt><dd>{{ currentRun.elapsed }}</dd></div><div><dt>Compute rate</dt><dd>{{ creditAmount(currentRun.hourlyCents) }} / hour while running</dd></div><div><dt>Cost to date</dt><dd>{{ creditAmount(currentRun.costCents) }}</dd></div></dl>
                  <Button v-if="currentRun.status === 'Running' || currentRun.status === 'Queued'" size="sm" variant="outline" :icon="X" @click="cancelRun">Cancel simulation run</Button>
                </aside>
              </div>
            </div>
          </template>
          <template #aside="{ toggleMaximized, canMaximize }">
            <header><h2 ref="asideHeading" tabindex="-1">{{ panelTitle }}</h2><Button v-if="canMaximize" class="paneled-workspace-demo__activity-size" variant="ghost" size="sm" shape="square" :icon="asideMaximized ? Minimize2 : Maximize2" :aria-label="`${asideMaximized ? 'Restore' : 'Maximize'} ${panelTitle}`" @click="toggleMaximized" /><Button variant="ghost" size="sm" shape="square" :icon="X" :aria-label="`Close ${panelTitle}`" @click="updateAsideOpen(false)" /></header>
            <PaneledWorkspaceAiChat v-if="sidePanel === 'ai'" v-model="aiChat" :namespace="namespace" :runs="compute.runs" />
            <template v-else>
              <p>Recent updates across {{ namespace }}.</p><div class="paneled-workspace-demo__activity-scroll" :data-scroll-start="activityScrollStart || undefined" :data-scroll-end="activityScrollEnd || undefined"><ol ref="activityList" @scroll="updateActivityScroll"><li v-for="(event, index) in events" :key="index"><Activity aria-hidden="true" /><div><p>{{ event }}</p><small>{{ index ? 'Earlier today' : 'Latest update' }}</small></div></li></ol></div><Button size="sm" variant="outline" @click="navigate('Activity log'); updateAsideOpen(false)">View activity log</Button>
            </template>
          </template>
        </AppShell.Panels>
        <AppShell.SearchDialog v-model:open="searchOpen" class="workspace-search-dialog paneled-workspace-search-dialog" aria-label="Search paneled workspace" :data-search-keyboard="searchKeyboard || undefined" @pointermove.capture="searchKeyboard = false" @keydown.capture="searchKeyboard = ['ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'].includes($event.key)">
          <CommandPalette.Panel v-model:value="searchQuery" :open="searchOpen" :items="searchGroups" :filter="false" :get-selectable-items="selectableSearchItems" :item-to-string-value="entryLabel" :item-to-value="entryValue" @close="searchOpen = false" @select="selectSearch">
            <CommandPalette.Input aria-label="Search pages and simulation runs" placeholder="Type to search…" />
            <CommandPalette.List><CommandPalette.Results v-slot="{ item: group }"><CommandPalette.Group :items="(group as SearchGroup).items"><CommandPalette.GroupLabel>{{ (group as SearchGroup).label }}</CommandPalette.GroupLabel><CommandPalette.ResultItem v-for="item in (group as SearchGroup).items" :key="entryValue(item)" :value="item" :title="item.label" :description="item.description" :show-arrow="false" /></CommandPalette.Group></CommandPalette.Results><CommandPalette.Empty>No pages or simulation runs found.</CommandPalette.Empty></CommandPalette.List>
          </CommandPalette.Panel>
        </AppShell.SearchDialog>
      </template>
      <template #rail>
        <ToolbarButton variant="ghost" size="sm" :icon="Sparkles" tooltip="AI chat" :tooltip-placement="railOnBottom ? 'top' : 'left'" :aria-expanded="asideOpen && sidePanel === 'ai'" @click="toggleTool('ai', $event)" />
        <ToolbarButton variant="ghost" size="sm" :icon="Activity" tooltip="Activities" :tooltip-placement="railOnBottom ? 'top' : 'left'" :aria-expanded="asideOpen && sidePanel === 'activities'" @click="toggleTool('activities', $event)" />
      </template>
    </AppShell.Root>
  </div>
</template>

<style src="./sidebar-paneled-workspace-demo.css"></style>
