<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Activity, CirclePlay, History, LayoutDashboard } from "@lucide/vue";
import PaneledWorkspaceNavigation from "./PaneledWorkspaceNavigation.vue";
import PaneledWorkspacePinned from "./PaneledWorkspacePinned.vue";
import PaneledWorkspacePinAction from "./PaneledWorkspacePinAction.vue";
import { projectCategories, projectNavigation, workspaceLinks, type NavigationCategory } from "./paneled-workspace-navigation";
import { settingsNavigation, type WorkspaceNavigationContext } from "./paneled-workspace-settings";

defineProps<{
  context: WorkspaceNavigationContext;
  initialized: boolean;
  categories: NavigationCategory[];
  view: string;
  pageTitle: string;
  projectName: string;
  iconCollapsed: boolean;
  isMobile: boolean;
  menuOpen: boolean;
  runCount: number;
  isExplorePage: boolean;
  hrefForPage: (page: string) => string;
  pageLabel: (page: string) => string;
  pageAvatar: (page: string) => { name: string; avatarSrc?: string } | undefined;
  projectGuide: boolean;
  projectsSection: boolean;
  compactShowMore: boolean;
  pinnedSection: boolean;
}>();
const groupsOpen = defineModel<Record<string, boolean>>("groupsOpen", { required: true });
const pinnedPages = defineModel<string[]>("pinnedPages", { required: true });
const workspaceItems = [
  { page: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { page: "Recents", label: "Recents", icon: History },
  { page: "Activities", label: "Activities", icon: Activity },
  { page: "Simulation runs", label: "Simulation runs", icon: CirclePlay },
  ...workspaceLinks,
];
function togglePin(page: string) {
  pinnedPages.value = pinnedPages.value.includes(page) ? pinnedPages.value.filter(item => item !== page) : [...pinnedPages.value, page];
}
const emit = defineEmits<{
  navigate: [page: string, event: MouseEvent];
  showMore: [category: string];
  createProject: [];
  createRun: [];
}>();
</script>

<template>
  <Sidebar.SlidingViews class="paneled-workspace-demo__sliding-views" :data-initializing="!initialized || undefined" :active-key="context" :direction="context === 'workspace' ? 'right' : 'left'">
    <Sidebar.SlidingView value="workspace" label="Workspace navigation">
      <PaneledWorkspaceNavigation v-model:groups-open="groupsOpen" :categories="categories" :view="view" :active="context === 'workspace'" :icon-collapsed="iconCollapsed" :is-mobile="isMobile" :menu-open="menuOpen" :run-count="runCount" label="Workspace links" :href-for-page="hrefForPage" :page-label="pageLabel" :page-avatar="pageAvatar" :project-guide="projectGuide" :projects-section="projectsSection" :compact-show-more="compactShowMore" :pin-enabled="pinnedSection" :pinned-pages="pinnedPages" @toggle-pin="togglePin" @navigate="(page, event) => emit('navigate', page, event)" @show-more="emit('showMore', $event)" @group-action="emit('createProject')">
        <template #before><PaneledWorkspacePinned v-if="pinnedSection" v-model:pages="pinnedPages" :compact="iconCollapsed" :is-mobile="isMobile" :active="context === 'workspace' && !menuOpen" :view="view" :href-for-page="hrefForPage" @navigate="(page, event) => emit('navigate', page, event)" /></template>
        <Sidebar.MenuItem v-for="item in workspaceItems" :key="item.page" :class="{ 'paneled-pin-row': pinnedSection && !iconCollapsed }">
          <Sidebar.MenuButton :href="hrefForPage(item.page)" :tooltip="item.label" :icon="item.icon" :active="item.page === 'Explore' ? isExplorePage : view === item.page" :class="{ 'paneled-workspace-demo__workspace paneled-workspace-demo__dashboard': item.page === 'Dashboard' }" @click="emit('navigate', item.page, $event)">{{ item.label }}<span v-if="item.page === 'Simulation runs'" class="paneled-workspace-demo__count" aria-hidden="true">{{ runCount }}</span></Sidebar.MenuButton>
          <PaneledWorkspacePinAction v-if="pinnedSection && !iconCollapsed" :page="item.page" :label="item.label" :pinned="pinnedPages.includes(item.page)" @toggle="togglePin" />
        </Sidebar.MenuItem>
      </PaneledWorkspaceNavigation>
    </Sidebar.SlidingView>
    <Sidebar.SlidingView value="project" :label="`${projectName} navigation`">
      <PaneledWorkspaceNavigation :categories="projectCategories" :view="pageTitle" :active="context === 'project'" :icon-collapsed="iconCollapsed" :is-mobile="isMobile" :menu-open="menuOpen" :run-count="runCount" label="Project links" :href-for-page="hrefForPage" @navigate="(page, event) => emit('navigate', page, event)" @group-action="emit('createRun')">
        <Sidebar.MenuItem v-for="item in projectNavigation.slice(0, 3)" :key="item.page"><Sidebar.MenuButton :href="hrefForPage(item.page)" :tooltip="item.page" :icon="item.icon" :active="pageTitle === item.page" @click="emit('navigate', item.page, $event)">{{ item.page }}</Sidebar.MenuButton></Sidebar.MenuItem>
        <template #after>
          <Sidebar.MenuItem v-for="item in projectNavigation.slice(-1)" :key="item.page"><Sidebar.MenuButton :href="hrefForPage(item.page)" :tooltip="item.page" :icon="item.icon" :active="view === item.page" @click="emit('navigate', item.page, $event)">{{ item.page }}</Sidebar.MenuButton></Sidebar.MenuItem>
        </template>
      </PaneledWorkspaceNavigation>
    </Sidebar.SlidingView>
    <Sidebar.SlidingView value="settings" label="Settings navigation">
      <Sidebar.Content aria-label="Settings links">
        <Sidebar.Menu>
          <Sidebar.MenuItem v-for="item in settingsNavigation" :key="item.page">
            <Sidebar.MenuButton :href="hrefForPage(item.page)" :tooltip="item.page" :icon="item.icon" :active="context === 'settings' && pageTitle === item.page" @click="emit('navigate', item.page, $event)">{{ item.page }}</Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Content>
    </Sidebar.SlidingView>
  </Sidebar.SlidingViews>
</template>
