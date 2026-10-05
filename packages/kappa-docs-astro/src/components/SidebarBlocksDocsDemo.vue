<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { SidebarLayout, type SidebarLayoutVariant } from "@dicehub/kappa/blocks/sidebar-layout";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherItems, namespaceSwitcherActions, namespaceSwitcherFooterActions, namespaceSwitcherWorkspaceActions, namespaceActionDescriptions } from "../data/workspace-switcher-demo";
import { Sidebar, type SidebarContextValue } from "@dicehub/kappa/components/sidebar";
import { Button } from "@dicehub/kappa/components/button";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Table } from "@dicehub/kappa/components/table";
import { Building2, ChevronsUpDown, Folder, LayoutDashboard, FileText, Settings, Search, Plus, Box, CircleHelp, MessageSquare, BadgeCheck, Bell, CreditCard, LogOut, Sparkles, UsersRound } from "@lucide/vue";

const props = withDefaults(defineProps<{ variant?: SidebarLayoutVariant; standalone?: boolean; iconNavigation?: boolean; insetNavigation?: boolean }>(), { variant: "workspace", standalone: false, iconNavigation: false, insetNavigation: false });
const richNavigation = computed(() => props.iconNavigation || props.insetNavigation);
const headingId = useId();
const namespace = ref("Engineering");
const profile = ref("ros");
const selected = ref("Overview");
const secondaryLinks = [{ label: "Support", icon: CircleHelp }, { label: "Feedback", icon: MessageSquare }];
const accountPages: Record<string, string> = {
  ...namespaceActionDescriptions,
  'Upgrade to Pro': 'Review the plans available for your workspace.',
  Account: 'Manage your profile and account details.',
  Billing: 'Review your subscription, invoices, and payment details.',
  Notifications: 'Choose which workspace updates you receive.',
  Preferences: 'Set your display and workspace preferences.',
  'Log out': 'This preview does not end a real session.',
};
const accountPage = computed(() => accountPages[selected.value]);
const utilityPage = computed(() => Boolean(accountPage.value) || (props.insetNavigation && secondaryLinks.some(link => link.label === selected.value)));
const searchOpen = ref(false);
const query = ref("");
const navigating = ref(false);
const searchFromDrawer = ref(false);
const sectionsOpen = ref(true);
const profiles = [
  { value: "ros", name: "Ros.Space", email: "ros@example.com", initials: "RS", avatar: "/avatars/ros-space-astronaut.webp" },
  { value: "jordan", name: "Jordan Lee", email: "jordan@example.test", initials: "JL", avatar: "/avatars/mei-chen.webp" },
];
const account = computed(() => profiles.find(item => item.value === profile.value)!);
const links = [{ label: "Overview", icon: LayoutDashboard }, { label: "Projects", icon: Folder }, { label: "Reports", icon: FileText }];
const navigationGroups = [
  { label: "Workspace", icon: LayoutDashboard, items: ["Overview", "Reports"] },
  { label: "Mesh", icon: Box, items: ["Geometry", "Refinement", "Simulation"] },
  { label: "Settings", icon: Settings, items: ["General", "Members", "Integrations"] },
];
const openGroups = ref<Record<string, boolean>>({ Workspace: true, Mesh: false, Settings: false });
const searchItems = computed(() => richNavigation.value
  ? [...navigationGroups.flatMap(group => group.items), ...projects.value.map(project => project.name), ...(props.insetNavigation ? secondaryLinks.map(link => link.label) : [])]
  : ["Overview", "Projects", "Reports", "Geometry", "Refinement", "Settings"]);
const projects = ref([
  { name: "Rotor study", code: "MESH-042", state: "Ready" },
  { name: "Channel flow", code: "MESH-041", state: "In review" },
  { name: "Heat exchanger", code: "MESH-039", state: "Draft" },
]);
const namespacePositioning = { placement: "bottom-start", strategy: "fixed", gutter: 6 } as const;
const desktopProfilePositioning = { placement: "right-end", strategy: "fixed", gutter: 8 } as const;
const aboveProfilePositioning = { placement: "top-start", strategy: "fixed", gutter: 8 } as const;
const profileSubmenuPositioning = { placement: "right-end", strategy: "fixed", gutter: 4, fitViewport: true, overflowPadding: 8 } as const;
const mobileProfileSubmenuPositioning = { ...profileSubmenuPositioning, overlap: true } as const;
function navigate(value: string, context: SidebarContextValue) {
  selected.value = value;
  if (richNavigation.value) {
    const group = navigationGroups.find(group => group.items.includes(value));
    if (group) openGroups.value[group.label] = true;
  }
  context.setMobileOpen(false);
}
function search(context: SidebarContextValue) { query.value = ""; navigating.value = false; searchFromDrawer.value = context.isMobile && context.mobileOpen; searchOpen.value = true; }
function createProject() {
  const name = `Untitled project ${projects.value.length - 2}`;
  projects.value.push({ name, code: `MESH-${String(43 + projects.value.length - 3).padStart(3, "0")}`, state: "Draft" });
  selected.value = name;
}
</script>

<template>
  <div class="sidebar-block-demo" :data-sidebar-block="props.insetNavigation ? 'inset-navigation' : props.iconNavigation ? 'collapsible-icons' : props.variant" :data-standalone="props.standalone || undefined">
    <SidebarLayout :variant="props.variant" :label="props.insetNavigation ? 'Inset application navigation' : props.iconNavigation ? 'Icon application navigation' : `${props.variant} application navigation`" :resizable="!richNavigation && props.variant === 'workspace'" full-screen-on-mobile>
      <template #header="context">
        <WorkspaceSwitcher v-model="namespace" :items="namespaceSwitcherItems" label="Namespaces" :account-label="account.email"
          :actions="namespaceSwitcherActions" :workspace-actions="namespaceSwitcherWorkspaceActions" :footer-actions="namespaceSwitcherFooterActions"
          :teleport="!context.isMobile" :positioning="props.insetNavigation && !context.isMobile ? { placement: 'right-start', strategy: 'fixed', gutter: 8 } : namespacePositioning"
          @action="navigate($event.label, context)">
          <template #trigger>
            <Sidebar.MenuButton :aria-label="`Namespace: ${namespace}`" :tooltip="`Namespace: ${namespace}`" class="sidebar-block-demo__identity-button sidebar-block-demo__namespace">
              <template #icon><span class="sidebar-block-demo__namespace-icon"><Building2 aria-hidden="true" /></span></template>
              <span class="sidebar-block-demo__identity"><strong>{{ namespace }}</strong><small>Namespace</small></span>
              <ChevronsUpDown class="sidebar-block-demo__chevrons" aria-hidden="true" />
            </Sidebar.MenuButton>
          </template>
        </WorkspaceSwitcher>
      </template>
      <template #navigation="context">
        <Sidebar.Menu class="sidebar-block-demo__search">
          <Sidebar.MenuItem><Sidebar.MenuButton :icon="Search" tooltip="Quick search" class="sidebar-block-demo__search-button" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="search(context)">Quick search …</Sidebar.MenuButton></Sidebar.MenuItem>
        </Sidebar.Menu>
        <template v-if="richNavigation">
          <Sidebar.Group>
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem v-for="group in navigationGroups" :key="group.label">
                <Sidebar.Collapsible v-model:open="openGroups[group.label]">
                  <Sidebar.CollapsibleTrigger as-child>
                    <Sidebar.MenuButton :icon="group.icon" :tooltip="group.label" :active="group.items.includes(selected)" :aria-current="undefined" class="sidebar-block-demo__group-trigger">{{ group.label }}<Sidebar.MenuChevron /></Sidebar.MenuButton>
                  </Sidebar.CollapsibleTrigger>
                  <Sidebar.CollapsibleContent><Sidebar.MenuSub :aria-label="group.label">
                    <Sidebar.MenuSubItem v-for="item in group.items" :key="item"><Sidebar.MenuButton :active="selected === item" :href="`?view=${item.toLowerCase()}`" @click.prevent="navigate(item, context)">{{ item }}</Sidebar.MenuButton></Sidebar.MenuSubItem>
                  </Sidebar.MenuSub></Sidebar.CollapsibleContent>
                </Sidebar.Collapsible>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
            <Sidebar.Menu><Sidebar.MenuItem v-for="project in projects" :key="project.code">
              <Sidebar.MenuButton :icon="Folder" :tooltip="project.name" :active="selected === project.name" :href="`?project=${project.code}`" @click.prevent="navigate(project.name, context)">{{ project.name }}</Sidebar.MenuButton>
            </Sidebar.MenuItem></Sidebar.Menu>
          </Sidebar.Group>
        </template>
        <template v-else>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuItem v-for="link in links" :key="link.label">
              <Sidebar.MenuButton :icon="link.icon" :tooltip="link.label" :active="selected === link.label" :href="`?view=${link.label.toLowerCase()}`" @click.prevent="navigate(link.label, context)">{{ link.label }}</Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.Collapsible v-model:open="sectionsOpen">
                <Sidebar.CollapsibleTrigger as-child><Sidebar.MenuButton :icon="Box" tooltip="Mesh">Mesh <Sidebar.MenuChevron /></Sidebar.MenuButton></Sidebar.CollapsibleTrigger>
                <Sidebar.CollapsibleContent><Sidebar.MenuSub>
                  <Sidebar.MenuSubItem v-for="name in ['Geometry', 'Refinement']" :key="name"><Sidebar.MenuButton :active="selected === name" :href="`?view=${name.toLowerCase()}`" @click.prevent="navigate(name, context)">{{ name }}</Sidebar.MenuButton></Sidebar.MenuSubItem>
                </Sidebar.MenuSub></Sidebar.CollapsibleContent>
              </Sidebar.Collapsible>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Manage</Sidebar.GroupLabel>
          <Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton :icon="Settings" tooltip="Settings" :active="selected === 'Settings'" href="?view=settings" @click.prevent="navigate('Settings', context)">Settings</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu>
        </Sidebar.Group>
        </template>
      </template>
      <template #footer="context">
        <nav v-if="props.insetNavigation" aria-label="Help and feedback" class="sidebar-block-demo__secondary">
          <Sidebar.Menu><Sidebar.MenuItem v-for="link in secondaryLinks" :key="link.label">
            <Sidebar.MenuButton :icon="link.icon" :tooltip="link.label" :active="selected === link.label" :href="`?view=${link.label.toLowerCase()}`" @click.prevent="navigate(link.label, context)">{{ link.label }}</Sidebar.MenuButton>
          </Sidebar.MenuItem></Sidebar.Menu>
        </nav>
        <Dropdown.Root aria-label="Profile" :positioning="context.isMobile || props.iconNavigation ? aboveProfilePositioning : desktopProfilePositioning">
          <Dropdown.Trigger as-child>
            <Sidebar.MenuButton :aria-label="`Profile: ${account.name}`" :tooltip="account.name" class="sidebar-block-demo__identity-button sidebar-block-demo__profile">
              <template #icon><Avatar.Root class="sidebar-block-demo__avatar" aria-hidden="true"><Avatar.Image :src="account.avatar" alt="" /><Avatar.Fallback>{{ account.initials }}</Avatar.Fallback></Avatar.Root></template>
              <span class="sidebar-block-demo__identity"><strong>{{ account.name }}</strong><small>{{ account.email }}</small></span>
              <ChevronsUpDown class="sidebar-block-demo__chevrons" aria-hidden="true" />
            </Sidebar.MenuButton>
          </Dropdown.Trigger>
          <Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined" class="sidebar-block-demo__profile-menu" :data-mobile="context.isMobile || undefined">
            <div class="sidebar-block-demo__profile-summary">
              <Avatar.Root class="sidebar-block-demo__avatar" aria-hidden="true"><Avatar.Image :src="account.avatar" alt="" /><Avatar.Fallback>{{ account.initials }}</Avatar.Fallback></Avatar.Root>
              <span class="sidebar-block-demo__identity"><strong>{{ account.name }}</strong><small>{{ account.email }}</small></span>
            </div>
            <Dropdown.Separator />
            <Dropdown.Group><Dropdown.Item value="upgrade" :icon="Sparkles" @select="navigate('Upgrade to Pro', context)">Upgrade to Pro</Dropdown.Item></Dropdown.Group>
            <Dropdown.Separator />
            <Dropdown.Group>
              <Dropdown.Item value="account" :icon="BadgeCheck" @select="navigate('Account', context)">Account</Dropdown.Item>
              <Dropdown.Item value="billing" :icon="CreditCard" @select="navigate('Billing', context)">Billing</Dropdown.Item>
              <Dropdown.Item value="notifications" :icon="Bell" @select="navigate('Notifications', context)">Notifications</Dropdown.Item>
              <Dropdown.Item value="preferences" :icon="Settings" @select="navigate('Preferences', context)">Preferences</Dropdown.Item>
            </Dropdown.Group>
            <Dropdown.Separator />
            <Dropdown.Sub aria-label="Switch profile" :positioning="context.isMobile ? mobileProfileSubmenuPositioning : profileSubmenuPositioning">
              <Dropdown.SubTrigger :icon="UsersRound">Switch profile</Dropdown.SubTrigger>
              <Dropdown.Context v-slot="submenu"><Dropdown.SubContent :teleport="!context.isMobile" :inert="!submenu.open || undefined" class="sidebar-block-demo__profile-menu" :data-mobile="context.isMobile || undefined">
                <Dropdown.RadioGroup v-model="profile">
                  <Dropdown.Label>Profiles</Dropdown.Label>
                  <Dropdown.RadioItem v-for="item in profiles" :key="item.value" :value="item.value" close-on-select class="sidebar-block-demo__profile-option">
                    <template #indicator><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 8.25 3 3 7-7" /></svg></template>
                    {{ item.name }}
                  </Dropdown.RadioItem>
                </Dropdown.RadioGroup>
              </Dropdown.SubContent></Dropdown.Context>
            </Dropdown.Sub>
            <Dropdown.Separator />
            <Dropdown.Item value="logout" :icon="LogOut" @select="navigate('Log out', context)">Log out</Dropdown.Item>
          </Dropdown.Content></Dropdown.Context>
        </Dropdown.Root>
      </template>
      <template #toolbar>
        <span class="sidebar-block-demo__breadcrumb"><span>{{ namespace }}</span><span aria-hidden="true">/</span><span>{{ selected }}</span></span>
      </template>
      <template #default="context">
        <CommandPalette.Root v-model:open="searchOpen" v-model:value="query" :items="searchItems" :restore-focus="!navigating || !searchFromDrawer" aria-label="Search navigation" @select="item => { navigating = true; searchOpen = false; navigate(String(item), context); }">
          <CommandPalette.Input placeholder="Search navigation…" />
          <CommandPalette.List>
            <CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results>
            <CommandPalette.Empty>No pages found.</CommandPalette.Empty>
          </CommandPalette.List>
          <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span></CommandPalette.Footer>
        </CommandPalette.Root>
        <section class="sidebar-block-demo__page" :aria-labelledby="headingId">
          <div class="sidebar-block-demo__page-heading">
            <div><span class="sidebar-block-demo__eyebrow">{{ namespace }} workspace</span><h2 :id="headingId">{{ selected }}</h2></div>
            <Button v-if="!utilityPage" size="sm" variant="secondary" @click="createProject"><Plus aria-hidden="true" />New project</Button>
          </div>
          <p v-if="utilityPage" class="sidebar-block-demo__description">{{ accountPage || (selected === 'Support' ? 'Find help with your workspace, geometry, and simulation setup.' : 'Share a suggestion or report an issue with your workspace.') }}</p>
          <p v-else class="sidebar-block-demo__description">Review geometry, prepare meshes, and track project changes.</p>
          <template v-if="!utilityPage">
          <div class="sidebar-block-demo__section-heading"><h3>Recent projects</h3><span>{{ projects.length }} projects</span></div>
          <Table compact>
            <Table.Caption class="sidebar-block-demo__sr-only">Recent projects in {{ namespace }}</Table.Caption>
            <Table.Header><Table.Row><Table.Head>Project</Table.Head><Table.Head>Status</Table.Head></Table.Row></Table.Header>
            <Table.Body><Table.Row v-for="item in projects" :key="item.code">
              <Table.Cell><button type="button" class="sidebar-block-demo__project-link" @click="selected = item.name">{{ item.name }}</button><span class="sidebar-block-demo__project-code">{{ item.code }}</span></Table.Cell>
              <Table.Cell><span class="sidebar-block-demo__status" :data-ready="item.state === 'Ready' || undefined">{{ item.state }}</span></Table.Cell>
            </Table.Row></Table.Body>
          </Table>
          </template>
          <p v-if="accountPage" class="sidebar-block-demo__note" role="status">Local preview only. No account, payment, notification, or session is changed.</p>
          <p v-else-if="utilityPage" class="sidebar-block-demo__note">This is a local navigation preview. Connect this page to your application's {{ selected === 'Support' ? 'help resources' : 'feedback form' }}. No message is sent.</p>
          <p v-else class="sidebar-block-demo__note" role="status">{{ projects.length > 3 ? 'New projects added to this example.' : 'Example data. Changes stay in this preview.' }}</p>
        </section>
      </template>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-blocks-demo.css"></style>
