<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useId, watch, type Component } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar, type SidebarContextValue } from "@dicehub/kappa/components/sidebar";
import { DicehubLogo } from "@dicehub/kappa/components/dicehub-logo";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherItems, namespaceSwitcherActions, namespaceSwitcherFooterActions, namespaceSwitcherWorkspaceActions, namespaceActionDescriptions } from "../data/workspace-switcher-demo";
import { Input } from "@dicehub/kappa/components/input";
import { Table } from "@dicehub/kappa/components/table";
import { Activity, Building2, ChevronDown, CircleHelp, Clock3, Compass, CreditCard, FileText, Folder, House, LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Plus, Search, Settings, UserRound, UsersRound } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const headingId = useId();
const namespace = ref("Ros.Space");
const selected = ref("Dashboard");
const filter = ref("");
const query = ref("");
const searchOpen = ref(false);
const searchScope = ref<HTMLElement>();
type SearchItem = { label: string; icon: Component; namespace?: string };
type SearchGroup = { label: string; items: SearchItem[] };
const namespaces = [
  { value: "Ros.Space", name: "Ros.Space", description: "Free plan · 1 member", avatarSrc: "/avatars/ros-space-astronaut.webp", initials: "RS" },
  ...namespaceSwitcherItems.filter(item => item.value !== "Personal"),
];
const globalLinks = ["Dashboard", "Explore", "Templates", "Community"];
const links = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Recently opened", icon: Clock3 },
  { label: "Activities", icon: Activity },
  { label: "User settings", icon: Settings },
];
const descriptions: Record<string, string> = {
  ...namespaceActionDescriptions,
  Dashboard: "Your projects and recent work, in one place.",
  Projects: "Projects in the selected namespace.",
  "Recently opened": "Return to a project you opened recently.",
  Activities: "Recent updates in this sample namespace.",
  "User settings": "Profile and account settings preview. No settings are changed.",
  Groups: "Choose a group namespace to see its projects.",
  Explore: "Browse the sample projects available in this namespace.",
  Templates: "Start with a sample project template.",
  Community: "Share project notes and review ideas with your team.",
  "Public profile": "Ros.Space · ros@example.com",
  Billing: "Billing preview. No payment or subscription is changed.",
  "Sign out": "Local preview only. Your real session stays signed in.",
  Help: "Select a navigation link or use Search or go to… to open a page.",
  Documentation: "Use the namespace menu to switch workspaces. The sidebar can collapse to an icon rail.",
  Support: "Support preview. No message is sent.",
};
const projects = ref([
  { id: "rotor", name: "Rotor study", namespace: "Ros.Space", status: "Ready", updated: "Today" },
  { id: "channel", name: "Channel flow", namespace: "Ros.Space", status: "In review", updated: "Yesterday" },
  { id: "heat", name: "Heat exchanger", namespace: "Engineering", status: "Draft", updated: "Today" },
  { id: "inlet", name: "Inlet comparison", namespace: "Research", status: "Ready", updated: "Yesterday" },
]);
const namespaceProjects = computed(() => projects.value.filter(project => project.namespace === namespace.value));
const visibleProjects = computed(() => namespaceProjects.value.filter(project => project.name.toLowerCase().includes(filter.value.trim().toLowerCase())));
const currentProject = computed(() => namespaceProjects.value.find(project => project.name === selected.value));
const isProjectList = computed(() => ["Dashboard", "Projects", "Recently opened", "Explore"].includes(selected.value));
const searchPages: SearchItem[] = [
  ...links,
  { label: "Explore", icon: Compass }, { label: "Templates", icon: Folder },
  { label: "Community", icon: UsersRound }, { label: "Projects", icon: Folder },
  { label: "Groups", icon: UsersRound }, { label: "Help", icon: CircleHelp },
];
const searchGroups = computed(() => {
  const term = query.value.trim().toLocaleLowerCase();
  const groups: SearchGroup[] = [{ label: "Go to", items: term ? searchPages : searchPages.filter(item => globalLinks.includes(item.label)) }];
  if (term) groups.push({ label: "Projects", items: namespaceProjects.value.map(project => ({ label: project.name, namespace: project.namespace, icon: Folder })) });
  return groups.map(group => ({ ...group, items: group.items.filter(item => `${item.label} ${item.namespace ?? ""}`.toLocaleLowerCase().includes(term)) })).filter(group => group.items.length);
});
const selectableSearchItems = (groups: unknown[]) => (groups as SearchGroup[]).flatMap(group => group.items);
const searchItemLabel = (item: unknown) => (item as SearchItem).label;
const menuPosition = { placement: "bottom-end", strategy: "fixed", gutter: 6 } as const;
watch(namespace, () => { selected.value = "Dashboard"; filter.value = ""; });

function navigate(label: string, context: SidebarContextValue) {
  selected.value = label;
  filter.value = "";
  context.setMobileOpen(false);
}
function search() { searchScope.value?.querySelector<HTMLElement>('[data-workspace-search-trigger]')?.focus(); query.value = ""; searchOpen.value = true; }
function searchShortcut(event: KeyboardEvent) {
  if (event.key !== "/" || event.defaultPrevented || event.repeat || event.isComposing || event.metaKey || event.ctrlKey || event.altKey || searchOpen.value) return;
  if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"][data-state="open"]')) return;
  const target = event.composedPath().find(node => node instanceof HTMLElement) as HTMLElement | undefined;
  if (target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"], [role="combobox"], [role="searchbox"], [role="dialog"], [role="menu"], [role="listbox"]')) return;
  event.preventDefault();
  event.stopPropagation();
  search();
}
onMounted(() => { if (props.standalone) window.addEventListener("keydown", searchShortcut); });
onBeforeUnmount(() => { window.removeEventListener("keydown", searchShortcut); });
function createProject(context: SidebarContextValue, template?: string) {
  const number = projects.value.length + 1;
  const name = template ? `${template} ${number}` : `Untitled project ${number}`;
  projects.value.push({ id: `project-${number}`, name, namespace: namespace.value, status: "Draft", updated: "Just now" });
  navigate(name, context);
}
</script>

<template>
  <div ref="searchScope" class="minimal-workspace-demo" data-sidebar-block="minimal-workspace" :data-standalone="props.standalone || undefined" @keydown="searchShortcut">
    <SidebarLayout variant="header" label="Minimal workspace navigation" width="250px" :default-width="250" :min-width="200" :max-width="420" collapsed-width="48px" resizable full-screen-on-mobile>
      <template #toolbar="context">
        <div class="minimal-workspace-demo__header-start">
        <a href="?view=dashboard" class="minimal-workspace-demo__brand" aria-label="dicehub home" @click.prevent="navigate('Dashboard', context)"><DicehubLogo aria-hidden="true" /></a>
        <nav class="minimal-workspace-demo__global-nav" aria-label="Application pages"><a v-for="label in globalLinks" :key="label" :href="`?view=${encodeURIComponent(label)}`" :aria-current="selected === label ? 'page' : undefined" @click.prevent="navigate(label, context)">{{ label }}</a></nav>
        </div>
        <Button size="sm" variant="ghost" :icon="Search" class="minimal-workspace-demo__search" data-workspace-search-trigger aria-label="Search or go to…" aria-keyshortcuts="/" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="search"><span>Search or go to…</span><kbd aria-hidden="true">/</kbd></Button>
        <div class="minimal-workspace-demo__header-end">
        <Dropdown.Root :positioning="menuPosition">
          <Dropdown.Trigger as-child><Button size="sm" shape="square" variant="ghost" :icon="Compass" aria-label="Browse application pages" class="minimal-workspace-demo__browse" /></Dropdown.Trigger>
          <Dropdown.Context v-slot="menu"><Dropdown.Content :inert="!menu.open || undefined"><Dropdown.Group><Dropdown.Label>Application pages</Dropdown.Label><Dropdown.Item v-for="label in globalLinks" :key="label" :value="label" @select="navigate(label, context)">{{ label }}</Dropdown.Item></Dropdown.Group></Dropdown.Content></Dropdown.Context>
        </Dropdown.Root>
        <Dropdown.Root :positioning="menuPosition">
          <Dropdown.Trigger as-child><Button size="sm" variant="ghost" class="minimal-workspace-demo__profile" aria-label="Profile: Ros.Space"><Avatar.Root aria-hidden="true"><Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" /><Avatar.Fallback>RS</Avatar.Fallback></Avatar.Root><ChevronDown aria-hidden="true" /></Button></Dropdown.Trigger>
          <Dropdown.Context v-slot="menu"><Dropdown.Content :inert="!menu.open || undefined" class="minimal-workspace-demo__profile-menu">
            <div class="minimal-workspace-demo__identity"><strong>Ros.Space</strong><span>ros@example.com</span></div>
            <Dropdown.Separator />
            <Dropdown.Item value="profile" :icon="UserRound" @select="navigate('Public profile', context)">Public profile</Dropdown.Item>
            <Dropdown.Item value="settings" :icon="Settings" @select="navigate('User settings', context)">User settings</Dropdown.Item>
            <Dropdown.Item value="billing" :icon="CreditCard" @select="navigate('Billing', context)">Billing</Dropdown.Item>
            <Dropdown.Separator />
            <Dropdown.Item value="sign-out" :icon="LogOut" @select="navigate('Sign out', context)">Sign out</Dropdown.Item>
          </Dropdown.Content></Dropdown.Context>
        </Dropdown.Root>
        </div>
      </template>
      <template #header="context">
        <WorkspaceSwitcher v-model="namespace" :items="namespaces" label="Namespaces" account-label="ros@example.test"
          :actions="namespaceSwitcherActions" :footer-actions="namespaceSwitcherFooterActions"
          :workspace-actions="[...namespaceSwitcherWorkspaceActions, { value: 'groups', label: 'Show all groups', icon: UsersRound }]"
          :teleport="!context.isMobile" :positioning="{ placement: context.iconCollapsed ? 'right-start' : 'bottom-start', strategy: 'fixed', gutter: 6 }"
          @action="navigate($event.value === 'groups' ? 'Groups' : $event.label, context)">
          <template #trigger><Sidebar.MenuButton class="minimal-workspace-demo__namespace" :aria-label="`Namespace: ${namespace}`" :tooltip="`Namespace: ${namespace}`">
            <template #icon><Avatar.Root v-if="namespace === 'Ros.Space'" aria-hidden="true"><Avatar.Image src="/avatars/ros-space-astronaut.webp" alt="" /><Avatar.Fallback>RS</Avatar.Fallback></Avatar.Root><Building2 v-else aria-hidden="true" /></template>
            <span>{{ namespace }}</span><ChevronDown aria-hidden="true" />
          </Sidebar.MenuButton></template>
        </WorkspaceSwitcher>
      </template>
      <template #navigation="context">
        <Sidebar.Group>
          <Sidebar.GroupLabel>{{ namespace === 'Ros.Space' ? 'User' : 'Group' }}</Sidebar.GroupLabel>
          <Sidebar.Menu aria-label="Workspace pages"><Sidebar.MenuItem v-for="link in links" :key="link.label"><Sidebar.MenuButton :icon="link.icon" :tooltip="link.label" :active="selected === link.label" :href="`?view=${encodeURIComponent(link.label)}`" @click.prevent="navigate(link.label, context)">{{ link.label }}</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu>
        </Sidebar.Group>
        <Sidebar.Group class="minimal-workspace-demo__projects-nav">
          <Sidebar.Menu><Sidebar.MenuItem>
            <Sidebar.MenuButton :icon="Folder" tooltip="Projects" :active="selected === 'Projects'" href="?view=projects" @click.prevent="navigate('Projects', context)">Projects</Sidebar.MenuButton>
            <Sidebar.MenuSub v-if="!context.iconCollapsed" aria-label="Project shortcuts"><Sidebar.MenuSubItem v-for="project in namespaceProjects" :key="project.id"><Sidebar.MenuButton :href="`?project=${project.id}`" :active="selected === project.name" @click.prevent="navigate(project.name, context)">{{ project.name }}</Sidebar.MenuButton></Sidebar.MenuSubItem></Sidebar.MenuSub>
          </Sidebar.MenuItem></Sidebar.Menu>
        </Sidebar.Group>
        <Sidebar.Group><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton :icon="UsersRound" tooltip="Groups" :active="selected === 'Groups'" href="?view=groups" @click.prevent="navigate('Groups', context)">Groups</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></Sidebar.Group>
      </template>
      <template #footer="context">
        <Dropdown.Root :positioning="{ placement: context.iconCollapsed ? 'right-end' : 'top-start', strategy: 'fixed', gutter: 6 }">
          <Dropdown.Trigger as-child><Sidebar.MenuButton :icon="CircleHelp" tooltip="Help" class="minimal-workspace-demo__help">Help</Sidebar.MenuButton></Dropdown.Trigger>
          <Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined"><Dropdown.Group><Dropdown.Label>Help and resources</Dropdown.Label><Dropdown.Item v-for="label in ['Help', 'Documentation', 'Support']" :key="label" :value="label" @select="navigate(label, context)">{{ label }}</Dropdown.Item></Dropdown.Group></Dropdown.Content></Dropdown.Context>
        </Dropdown.Root>
        <Sidebar.Trigger v-if="!context.isMobile" as-child><Sidebar.MenuButton class="minimal-workspace-demo__collapse" :icon="context.open ? PanelLeftClose : PanelLeftOpen" :tooltip="context.open ? 'Collapse sidebar' : 'Expand sidebar'">{{ context.open ? 'Collapse sidebar' : 'Expand sidebar' }}</Sidebar.MenuButton></Sidebar.Trigger>
      </template>
      <template #default="context">
        <CommandPalette.Dialog v-model:open="searchOpen" class="minimal-workspace-search-dialog" aria-label="Search minimal workspace">
          <CommandPalette.Panel v-model:value="query" :open="searchOpen" :items="searchGroups" :filter="false" :get-selectable-items="selectableSearchItems" :item-to-string-value="searchItemLabel" @close="searchOpen = false" @select="item => { searchOpen = false; navigate(searchItemLabel(item), context); }">
            <CommandPalette.Input aria-label="Search pages and projects" placeholder="Search or go to…" />
            <CommandPalette.List>
              <CommandPalette.Results v-slot="{ item: group }"><CommandPalette.Group :items="(group as SearchGroup).items">
                <CommandPalette.GroupLabel>{{ (group as SearchGroup).label }}</CommandPalette.GroupLabel>
                <CommandPalette.Items v-slot="{ item }"><CommandPalette.ResultItem :value="item" :title="(item as SearchItem).label" :description="(item as SearchItem).namespace" :show-arrow="!(item as SearchItem).namespace"><template #icon><component :is="(item as SearchItem).icon" :size="16" aria-hidden="true" /></template></CommandPalette.ResultItem></CommandPalette.Items>
              </CommandPalette.Group></CommandPalette.Results>
              <CommandPalette.Empty>No results found.</CommandPalette.Empty>
            </CommandPalette.List>
            <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></CommandPalette.Footer>
          </CommandPalette.Panel>
        </CommandPalette.Dialog>
        <nav class="minimal-workspace-demo__breadcrumb" aria-label="Workspace breadcrumb"><a href="?view=dashboard" aria-label="Workspace home" @click.prevent="navigate('Dashboard', context)"><House aria-hidden="true" /></a><a href="?view=projects" @click.prevent="navigate('Projects', context)">{{ namespace }}</a><span aria-hidden="true">/</span><span aria-current="page">{{ selected }}</span></nav>
        <section class="minimal-workspace-demo__page" :aria-labelledby="headingId">
          <div class="minimal-workspace-demo__page-heading"><div><h2 :id="headingId">{{ selected }}</h2><p>{{ currentProject ? 'Project overview in this local workspace.' : descriptions[selected] }}</p></div><Button v-if="isProjectList" size="sm" :icon="Plus" @click="createProject(context)">New project</Button></div>
          <div v-if="isProjectList" class="minimal-workspace-demo__project-panel">
            <div class="minimal-workspace-demo__panel-heading"><h3>Projects</h3><span>{{ namespaceProjects.length }}</span></div>
            <div class="minimal-workspace-demo__filters"><div class="minimal-workspace-demo__filter"><Search aria-hidden="true" /><Input v-model="filter" type="search" size="sm" aria-label="Search projects" placeholder="Search by name" @keydown.esc="filter = ''" /></div><span>{{ visibleProjects.length }} shown</span></div>
            <Table compact><Table.Caption class="minimal-workspace-demo__sr-only">Projects in {{ namespace }}</Table.Caption><Table.Header><Table.Row><Table.Head>Project</Table.Head><Table.Head>Status</Table.Head><Table.Head>Updated</Table.Head></Table.Row></Table.Header><Table.Body>
              <Table.Row v-for="project in visibleProjects" :key="project.id"><Table.Cell><button type="button" class="minimal-workspace-demo__project-link" @click="navigate(project.name, context)"><span class="minimal-workspace-demo__project-icon" aria-hidden="true">{{ project.name[0] }}</span><span><small>{{ namespace }} /</small><strong>{{ project.name }}</strong></span></button></Table.Cell><Table.Cell><span class="minimal-workspace-demo__status" :data-ready="project.status === 'Ready' || undefined">{{ project.status }}</span></Table.Cell><Table.Cell>{{ project.updated }}</Table.Cell></Table.Row>
              <Table.Row v-if="!visibleProjects.length"><Table.Cell colspan="3" class="minimal-workspace-demo__empty">No projects found.</Table.Cell></Table.Row>
            </Table.Body></Table>
          </div>
          <dl v-else-if="currentProject" class="minimal-workspace-demo__details"><div><dt>Namespace</dt><dd>{{ namespace }}</dd></div><div><dt>Status</dt><dd>{{ currentProject.status }}</dd></div><div><dt>Updated</dt><dd>{{ currentProject.updated }}</dd></div></dl>
          <ul v-else-if="selected === 'Activities'" class="minimal-workspace-demo__list"><li v-for="project in namespaceProjects" :key="project.id"><span>{{ project.name }} — {{ project.status }}</span><small>{{ project.updated }}</small></li></ul>
          <ul v-else-if="selected === 'Groups'" class="minimal-workspace-demo__list"><li v-for="item in namespaces.slice(1)" :key="item.value"><Button variant="ghost" size="sm" :icon="item.icon" @click="namespace = item.value">{{ item.name }}</Button><small>Group namespace</small></li></ul>
          <ul v-else-if="selected === 'Templates'" class="minimal-workspace-demo__list"><li v-for="name in ['Flow study', 'Thermal study']" :key="name"><span>{{ name }}</span><Button size="sm" variant="outline" @click="createProject(context, name)">Use {{ name }}</Button></li></ul>
          <p v-else-if="selected === 'Community'" class="minimal-workspace-demo__note"><FileText aria-hidden="true" />No shared notes yet.</p>
          <p class="minimal-workspace-demo__note">Example data only. Changes stay in this preview until reload.</p>
        </section>
      </template>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-minimal-workspace-demo.css"></style>
