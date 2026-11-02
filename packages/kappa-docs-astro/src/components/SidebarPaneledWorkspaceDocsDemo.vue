<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherAvatarItems } from "../data/workspace-switcher-demo";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Button, ToolbarButton } from "@dicehub/kappa/components/button";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import { Field } from "@dicehub/kappa/components/field";
import { Badge } from "@dicehub/kappa/components/badge";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
import { HoverCard } from "@dicehub/kappa/components/hover-card";
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
import { workspaceProjects } from "./paneled-workspace-projects";
import { usePaneledFlyoutIntent } from "./use-paneled-flyout-intent";
import { limitedWorkspacePages, resolveWorkspacePage, workspaceCategories, workspacePages as allPages, workspaceUtilityDescriptions } from "./paneled-workspace-navigation";
import { Activity, ArrowUpRight, ChevronRight, ChevronsLeft, ChevronsRight, ChevronsUpDown, CirclePlay, LayoutDashboard, Maximize2, Minimize2, Plus, Search, Sparkles, X } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const root = ref<HTMLElement>();
const namespace = ref("Ros.Space");
const projectNames = ref<Record<string, string>>({ "Ros.Space": "Aster VTOL", Engineering: "Vega demonstrator", Research: "Orion testbed" });
const projectName = computed(() => projectNames.value[namespace.value]);
const workspaceOptions = namespaceSwitcherAvatarItems.filter(item => Object.hasOwn(projectNames.value, item.value));
const workspaceMenuOpen = ref(false);
const view = ref("Simulation runs");
const selectedProject = computed(() => workspaceProjects.find(project => project.name === view.value));
const isTemplatePage = computed(() => workspaceTemplatePages.includes(view.value));
const isCalculatorPage = computed(() => workspaceCalculatorPages.includes(view.value));
const breadcrumbRoot = computed(() => selectedProject.value || view.value === "Dashboard" || view.value === "All projects" || isTemplatePage.value || isCalculatorPage.value ? { page: "Dashboard", label: namespace.value } : { page: "Overview", label: projectName.value });
const categories = computed(() => workspaceCategories.map(group => {
  if (group.label !== "Projects" || !selectedProject.value || group.pages.includes(view.value)) return group;
  const shortcuts = group.pages.filter(page => page !== "All projects");
  return { ...group, pages: ["All projects", ...shortcuts.slice(0, 5), view.value] };
}));
const navigationLabel = (page: string) => page === "All projects" || page === "All templates" ? "Overview" : page;
const utilityDescription = computed(() => workspaceUtilityDescriptions[view.value]);
const isLimitedPage = computed(() => limitedWorkspacePages.includes(view.value));
const navigationOpen = ref(true);
const mobileOpen = ref(false);
const groupsOpen = ref<Record<string, boolean>>({ Projects: true });
const flyout = ref("");
const flyoutOwner = useId();
const { corridor, pointTrigger, leaveTrigger, enterContent } = usePaneledFlyoutIntent(flyout, flyoutOwner);
watch([navigationOpen, mobileOpen], () => { flyout.value = ""; workspaceMenuOpen.value = false; });
watch(workspaceMenuOpen, open => { if (open) flyout.value = ""; });
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
let focusFrame = 0;

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
const navigationSearchGroups = computed<SearchGroup[]>(() => [
  { label: "Your work", items: [{ label: "Dashboard", description: "" }] },
  ...categories.value.map(group => ({ label: group.label, items: group.pages.map(page => ({ label: page, page, description: "" })) })),
  { label: "Recent simulation runs", items: compute.value.runs.slice(0, 4).map(run => ({ label: run.name, description: `${run.id} · ${run.status}`, id: run.id })) },
  { label: "Workspaces", items: workspaceOptions.map(item => ({ label: item.name, namespace: item.value, description: "" })) },
]);
const searchEntries = computed<SearchEntry[]>(() => [
  ...[...new Set(["Dashboard", ...categories.value.flatMap(group => group.pages), ...workspaceProjects.map(project => project.name)])].map(label => ({ label, description: "" })),
  ...compute.value.runs.map(run => ({ label: run.name, description: `${run.id} · ${run.status}`, id: run.id })),
  ...workspaceOptions.map(item => ({ label: item.name, namespace: item.value, description: "Workspace" })),
].filter(item => `${item.label} ${item.description}`.toLowerCase().includes(searchQuery.value.trim().toLowerCase())));
const searchGroups = computed<SearchGroup[]>(() => searchQuery.value.trim()
  ? [{ label: "Search results", items: searchEntries.value }].filter(group => group.items.length)
  : navigationSearchGroups.value.filter(group => group.items.length));
const selectableSearchItems = (groups: unknown[]) => (groups as SearchGroup[]).flatMap(group => group.items);
const entryLabel = (item: unknown) => (item as SearchEntry).label;

function breadcrumbHref(page: string) {
  const path = props.standalone ? "" : "/examples/appshell/paneled-workspace";
  return `${path}?view=${encodeURIComponent(page)}`;
}

function navigateLink(page: string, event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const fromFlyout = event.currentTarget instanceof Element && event.currentTarget.closest("[data-paneled-flyout]");
  navigate(page);
  if (fromFlyout) void nextTick(() => {
    const heading = root.value?.querySelector<HTMLElement>(".paneled-workspace-demo__page-content h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  });
}
function syncLocation() {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get("view");
  const page = resolveWorkspacePage(requested ?? "Simulation runs");
  const target = allPages.includes(page) ? page : "Simulation runs";
  navigate(target, false);
  if (requested && requested !== target) { url.searchParams.set("view", target); window.history.replaceState(null, "", url); }
}
function navigate(page: string, updateLocation = true) {
  page = resolveWorkspacePage(page);
  view.value = page;
  if (props.standalone && updateLocation) {
    const url = new URL(window.location.href);
    if (url.searchParams.get("view") !== page) { url.searchParams.set("view", page); window.history.pushState(null, "", url); }
  }
  detailOpen.value = false;
  mobileOpen.value = false;
  flyout.value = "";
  filter.value = "";
  for (const category of categories.value) if (category.pages.includes(page)) groupsOpen.value[category.label] = true;
}
function changeNamespace(value: string) { namespace.value = value; stateFilter.value = "All runs"; navigate("Simulation runs"); }
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
async function updateFlyout(label: string, open: boolean) {
  if (open) { flyout.value = label; return; }
  // Trigger blur precedes the link's focus event. Keep the flyout open while a link has focus.
  await nextTick();
  const content = document.querySelector<HTMLElement>(`[data-flyout-owner="${flyoutOwner}"][data-paneled-flyout="${label}"]`);
  // A short close timer can finish during the trigger-to-content event handoff.
  if (!content?.matches(":hover") && !content?.contains(document.activeElement) && flyout.value === label) flyout.value = "";
}
function closeFlyout(label: string) {
  flyout.value = "";
  root.value?.querySelector<HTMLElement>(`[data-paneled-group="${label}"]`)?.focus();
}
function focusFlyout(label: string) {
  flyout.value = label;
  cancelAnimationFrame(focusFrame);
  if (!categories.value.find(group => group.label === label)?.pages.length) return;
  // Ark presence reveals the links on a later frame. Focus only after they can receive it.
  const focusLink = () => {
    if (flyout.value !== label || (navigationOpen.value && groupsOpen.value[label])) return;
    const link = document.querySelector<HTMLElement>(`[data-flyout-owner="${flyoutOwner}"][data-paneled-flyout="${label}"] a`);
    if (link?.getClientRects().length && getComputedStyle(link).visibility === "visible") {
      link.focus();
      if (document.activeElement === link) return;
    }
    focusFrame = requestAnimationFrame(focusLink);
  };
  focusLink();
}
onMounted(() => {
  creditsReady.value = true;
  if (root.value) {
    railOnBottom.value = root.value.clientWidth < 992;
    railObserver = new ResizeObserver(([entry]) => { railOnBottom.value = entry.contentRect.width < 992; });
    railObserver.observe(root.value);
  }
  if (props.standalone) { syncLocation(); window.addEventListener("keydown", shortcut); window.addEventListener("popstate", syncLocation); }
});
onBeforeUnmount(() => { railObserver?.disconnect(); cancelAnimationFrame(focusFrame); window.removeEventListener("keydown", shortcut); window.removeEventListener("popstate", syncLocation); });
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
        <div class="paneled-workspace-demo__context-row" :data-collapsed="context.iconCollapsed || undefined">
          <p v-if="!context.iconCollapsed" class="paneled-workspace-demo__context-label">Your work</p>
          <Sidebar.Trigger v-if="!context.isMobile" class="paneled-workspace-demo__pin"
            :aria-label="navigationOpen ? 'Collapse sidebar' : 'Expand sidebar'">
            <component :is="navigationOpen ? ChevronsLeft : ChevronsRight" aria-hidden="true" />
          </Sidebar.Trigger>
        </div>
      </template>
      <template #navigation="context">
        <Sidebar.MenuButton href="?view=Dashboard" tooltip="Dashboard" :icon="LayoutDashboard" :active="view === 'Dashboard'"
          class="paneled-workspace-demo__workspace paneled-workspace-demo__dashboard"
          @click="navigateLink('Dashboard', $event)">Dashboard</Sidebar.MenuButton>
        <div v-for="group in categories" :key="group.label" class="paneled-workspace-demo__nav-group">
          <HoverCard.Root :open="flyout === group.label && !context.isMobile && (context.iconCollapsed || !groupsOpen[group.label])" :disabled="context.isMobile || (!context.iconCollapsed && groupsOpen[group.label])" :open-delay="0" :close-delay="5" :positioning="{ placement: 'right-start', strategy: 'fixed', gutter: 10 }" @update:open="updateFlyout(group.label, $event)">
            <HoverCard.Trigger v-if="context.iconCollapsed" as-child><Sidebar.MenuButton :icon="group.icon" :aria-label="group.label" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="group.pages.includes(view) || undefined" :data-flyout-open="flyout === group.label || undefined" :aria-expanded="flyout === group.label" @click="flyout = group.label" @keydown.down.capture.prevent="focusFlyout(group.label)" @keydown.esc.stop.prevent="closeFlyout(group.label)">{{ group.label }}</Sidebar.MenuButton></HoverCard.Trigger>
            <Sidebar.Collapsible v-else :open="groupsOpen[group.label]" @update:open="groupsOpen[group.label] = $event; flyout = ''">
              <HoverCard.Trigger as-child><Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="group.icon" class="paneled-workspace-demo__group-toggle" :data-paneled-group="group.label" @pointermove="pointTrigger(group.label, $event)" @pointerleave="leaveTrigger" :data-active-descendant="!groupsOpen[group.label] && group.pages.includes(view) || undefined" :data-flyout-open="!groupsOpen[group.label] && flyout === group.label || undefined" @keydown.down.capture="!context.isMobile && !groupsOpen[group.label] && ($event.preventDefault(), focusFlyout(group.label))" @keydown.esc="flyout === group.label && ($event.stopPropagation(), $event.preventDefault(), closeFlyout(group.label))"><span>{{ group.label }}</span><ChevronRight aria-hidden="true" /></Sidebar.MenuButton></Sidebar.CollapsibleTrigger></HoverCard.Trigger>
              <Sidebar.CollapsibleContent><Sidebar.MenuSub>
                <Sidebar.MenuSubItem v-for="page in group.pages" :key="page">
                  <Sidebar.MenuButton :href="breadcrumbHref(page)" :active="view === page" @click="navigateLink(page, $event)"><span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ compute.runs.length }}</span></Sidebar.MenuButton>
                </Sidebar.MenuSubItem>
              </Sidebar.MenuSub></Sidebar.CollapsibleContent>
            </Sidebar.Collapsible>
            <HoverCard.Content :show-arrow="false" class="paneled-workspace-demo__flyout" :data-paneled-flyout="group.label" :data-flyout-owner="flyoutOwner" @pointermove="enterContent" @keydown.esc.stop.prevent="closeFlyout(group.label)">
              <div v-if="flyout === group.label && corridor" data-flyout-corridor class="paneled-workspace-demo__flyout-corridor" :style="corridor" aria-hidden="true" />
              <template v-if="context.iconCollapsed">
                <h3 class="paneled-workspace-demo__flyout-title">{{ group.label }}</h3>
                <hr class="paneled-workspace-demo__flyout-divider" aria-hidden="true" />
              </template>
              <nav :aria-label="`${group.label} pages`">
                <a v-for="page in group.pages" :key="page" :href="breadcrumbHref(page)" :aria-current="view === page ? 'page' : undefined" @click="navigateLink(page, $event)"><span :title="navigationLabel(page)">{{ navigationLabel(page) }}</span><span v-if="page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ compute.runs.length }}</span></a>
              </nav>
            </HoverCard.Content>
          </HoverCard.Root>
        </div>
      </template>
      <template #footer="context">
        <div class="paneled-workspace-demo__workspace-row" :data-collapsed="context.iconCollapsed || undefined">
          <WorkspaceSwitcher show-arrow :model-value="namespace" v-model:open="workspaceMenuOpen" :items="workspaceOptions"
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
          <PaneledWorkspaceHelpMenu :is-mobile="context.isMobile" :icon-collapsed="context.iconCollapsed" :href-for-page="breadcrumbHref" @navigate="navigate" />
        </div>
      </template>
      <template #default>
        <AppShell.Panels v-model:detail-open="detailOpen" v-model:aside-open="asideOpen" v-model:aside-maximized="asideMaximized"
          detail-label="Simulation run details" :aside-label="panelTitle" resize-label="Resize simulation run panels" :aside-resize-label="`Resize ${panelTitle}`"
          :initial-detail-focus="() => detailHeading ?? null" :final-detail-focus="finalDetailFocus"
          :initial-aside-focus="() => asideHeading ?? null" :final-aside-focus="finalAsideFocus">
                <Breadcrumbs.Root size="sm" class="paneled-workspace-demo__breadcrumbs" aria-label="Workspace breadcrumb">
                  <Breadcrumbs.List>
                    <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref(breadcrumbRoot.page)" @click="navigateLink(breadcrumbRoot.page, $event)">{{ breadcrumbRoot.label }}</Breadcrumbs.Link></Breadcrumbs.Item>
                    <Breadcrumbs.Separator />
                    <template v-if="selectedProject">
                      <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref('All projects')" @click="navigateLink('All projects', $event)">All projects</Breadcrumbs.Link></Breadcrumbs.Item>
                      <Breadcrumbs.Separator />
                    </template>
                    <Breadcrumbs.Item><Breadcrumbs.Link :href="breadcrumbHref(view)" aria-current="page" @click="navigateLink(view, $event)">{{ view }}</Breadcrumbs.Link></Breadcrumbs.Item>
                  </Breadcrumbs.List>
                </Breadcrumbs.Root>
                <section class="paneled-workspace-demo__list-scroll" :data-width="isLimitedPage ? 'limited' : undefined" aria-label="Workspace page">
                  <div class="paneled-workspace-demo__page-content" :data-width="isLimitedPage ? 'limited' : undefined">
                  <div class="paneled-workspace-demo__page-heading"><h2>{{ view }}</h2><Button v-if="view === 'Simulation runs'" size="sm" :icon="Plus" @click="createRun">New simulation run</Button><Button v-else size="sm" variant="outline" :icon="CirclePlay" @click="navigate('Simulation runs')">View simulation runs</Button></div>
                  <PaneledWorkspaceProjectSummary v-if="selectedProject" :project="selectedProject" />
                  <PaneledWorkspaceProjects v-else-if="view === 'All projects'" :projects="workspaceProjects" :href-for-page="breadcrumbHref" @open="navigateLink" />
                  <PaneledWorkspaceTemplates v-else-if="isTemplatePage" :key="view" :page="view" />
                  <PaneledWorkspaceCalculators v-else-if="isCalculatorPage" :key="view" :page="view" />
                  <PaneledWorkspaceProjectPages v-else-if="isLimitedPage && view !== 'Dashboard'" :key="`${namespace}-${view}`" :page="view" :project="projectName" @navigate="navigate" @rename="projectNames[namespace] = $event" />
                  <PaneledWorkspaceComputePages v-else-if="view === 'Simulation runs' || view === 'Compute usage' || view === 'Billing'" :key="`${namespace}-${view}`" :page="view" :namespace="namespace" :compute="compute" v-model:filter="stateFilter" v-model:query="filter" :selected-id="detailOpen ? detailId : undefined" @open="openRun" />
                  <div v-else-if="utilityDescription" class="paneled-workspace-demo__overview">
                    <p>{{ utilityDescription }}</p>
                    <Button variant="outline" size="sm" @click="navigate('Dashboard')">Return to Dashboard</Button>
                  </div>
                  <div v-else class="paneled-workspace-demo__overview">
                    <p>Follow simulations in {{ namespace }}, from the first mesh to the final report.</p>
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
          <CommandPalette.Panel v-model:value="searchQuery" :open="searchOpen" :items="searchGroups" :filter="false" :get-selectable-items="selectableSearchItems" :item-to-string-value="entryLabel" @close="searchOpen = false" @select="selectSearch">
            <CommandPalette.Input aria-label="Search pages and simulation runs" placeholder="Type to search…" />
            <CommandPalette.List><CommandPalette.Results v-slot="{ item: group }"><CommandPalette.Group :items="(group as SearchGroup).items"><CommandPalette.GroupLabel>{{ (group as SearchGroup).label }}</CommandPalette.GroupLabel><CommandPalette.ResultItem v-for="item in (group as SearchGroup).items" :key="item.label" :value="item" :title="item.label" :description="item.description" :show-arrow="false" /></CommandPalette.Group></CommandPalette.Results><CommandPalette.Empty>No pages or simulation runs found.</CommandPalette.Empty></CommandPalette.List>
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
