<script setup lang="ts">
import { computed, nextTick, ref, useId } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { WorkspaceSwitcher } from "@dicehub/kappa/blocks/workspace-switcher";
import { namespaceSwitcherItems, namespaceSwitcherActions, namespaceSwitcherFooterActions, namespaceSwitcherWorkspaceActions, namespaceActionDescriptions } from "../data/workspace-switcher-demo";
import { Sidebar, type SidebarContextValue } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { Button } from "@dicehub/kappa/components/button";
import { Building2, ChevronsUpDown, Search, House, CalendarDays, Settings, Trash2, CircleHelp, Star } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const headingId = useId();
type Page = { title: string; emoji: string; summary: string; notes: string[] };
type Group = { name: string; emoji: string; pages: Page[] };
const workspaces: Record<string, Group[]> = {
  Engineering: [
    { name: "Projects", emoji: "📐", pages: [
      { title: "Project brief", emoji: "🧭", summary: "A shared starting point for the rotor study. Keep the scope, decisions, and review notes together.", notes: ["Compare the baseline geometry with the revised inlet.", "Use the same boundary conditions for both runs.", "Record mesh quality before the design review."] },
      { title: "Mesh notes", emoji: "🔬", summary: "Mesh preparation and quality checks for the current study.", notes: ["Check the surface normals after import.", "Refine the inlet and the blade tips.", "Keep the baseline mesh for comparison."] },
      { title: "Review checklist", emoji: "✅", summary: "A short checklist before sharing a simulation result.", notes: ["Check units and boundary conditions.", "Attach the convergence plot.", "Link the source geometry and mesh."] },
    ] },
    { name: "Team", emoji: "👋", pages: [
      { title: "Getting started", emoji: "🌱", summary: "The essentials for working in this namespace.", notes: ["Read the project brief.", "Find the current mesh notes.", "Add frequently used pages to Favorites."] },
      { title: "Meeting notes", emoji: "📝", summary: "Decisions from the latest engineering review.", notes: ["Keep the baseline for the next comparison.", "Review the inlet refinement with the team.", "Update the project brief after approval."] },
      { title: "Team directory", emoji: "👥", summary: "People who maintain the sample workspace.", notes: ["Ros.Space — project coordination.", "Jordan Lee — geometry and mesh review.", "Mei Chen — simulation results."] },
    ] },
    { name: "Resources", emoji: "📚", pages: [
      { title: "Guidelines", emoji: "📖", summary: "Shared conventions for clear, useful project pages.", notes: ["Give each page one purpose.", "Record decisions with their reasons.", "Link related pages instead of copying their content."] },
      { title: "Release notes", emoji: "🚀", summary: "Recent changes to the sample workflow.", notes: ["The review checklist now includes source links.", "Mesh notes are grouped with the project brief."] },
    ] },
  ],
  Research: [
    { name: "Studies", emoji: "🔬", pages: [
      { title: "Study plan", emoji: "🧪", summary: "Plan the next comparison before running experiments.", notes: ["Define the hypothesis.", "Choose the comparison cases.", "Record the acceptance criteria."] },
      { title: "Experiment log", emoji: "📝", summary: "A record of the inputs and results for each experiment.", notes: ["Keep one entry per run.", "Include unsuccessful runs and their causes."] },
    ] },
    { name: "Library", emoji: "📚", pages: [
      { title: "Reading list", emoji: "📖", summary: "Background reading for the current research.", notes: ["Review the internal benchmark notes.", "Summarize useful methods in the study plan."] },
    ] },
  ],
  Personal: [
    { name: "Notes", emoji: "📝", pages: [
      { title: "Weekly plan", emoji: "🗓️", summary: "A small set of priorities for the week.", notes: ["Review the project brief.", "Prepare questions for the next team meeting."] },
      { title: "Ideas", emoji: "💡", summary: "A place for ideas that need more work.", notes: ["Make review notes easier to find.", "Document one useful shortcut each week."] },
    ] },
  ],
};
const namespace = ref("Engineering");
const selections = ref<Record<string, string>>({ Engineering: "Project brief", Research: "Study plan", Personal: "Weekly plan" });
const selected = computed({ get: () => selections.value[namespace.value], set: value => { selections.value[namespace.value] = value; } });
const groups = computed(() => workspaces[namespace.value]);
const pages = computed(() => groups.value.flatMap(group => group.pages));
const currentPage = computed(() => pages.value.find(page => page.title === selected.value));
const currentGroup = computed(() => groups.value.find(group => group.pages.some(page => page.title === selected.value)));
const favorites = ref<Record<string, string[]>>({ Engineering: ["Project brief", "Getting started", "Meeting notes"], Research: ["Study plan"], Personal: ["Weekly plan"] });
const favoritePages = computed(() => favorites.value[namespace.value].map(title => pages.value.find(page => page.title === title)!).filter(Boolean));
const isFavorite = computed(() => favorites.value[namespace.value].includes(selected.value));
const openGroups = ref<Record<string, boolean>>({ "Engineering/Projects": true, "Research/Studies": true, "Personal/Notes": true });
const utilities = [
  { title: "Calendar", icon: CalendarDays, description: "Upcoming reviews in this sample namespace.", notes: ["Tuesday, 10:00 — Project review", "Thursday, 14:00 — Team notes"] },
  { title: "Settings", icon: Settings, description: "Namespace settings preview. No account settings are changed.", notes: ["Access: workspace members", "Default page: workspace home"] },
  { title: "Trash", icon: Trash2, description: "Trash is empty.", notes: ["Deleted pages would appear here. This example does not delete pages."] },
  { title: "Help", icon: CircleHelp, description: "Find your way around the workspace.", notes: ["Use Quick search to find a page by name.", "Expand a group to see its pages.", "Use the star beside a page title to add or remove a Favorite."] },
];
const utility = computed(() => utilities.find(item => item.title === selected.value));
const searchOpen = ref(false);
const query = ref("");
const navigating = ref(false);
const searchFromDrawer = ref(false);
const searchItems = computed(() => ["Home", ...pages.value.map(page => page.title), ...utilities.map(item => item.title)]);

function navigate(title: string, context: SidebarContextValue) {
  selected.value = title;
  const group = groups.value.find(group => group.pages.some(page => page.title === title));
  if (group) openGroups.value[`${namespace.value}/${group.name}`] = true;
  context.setMobileOpen(false);
}
function search(context: SidebarContextValue) {
  query.value = "";
  navigating.value = false;
  searchFromDrawer.value = context.isMobile && context.mobileOpen;
  searchOpen.value = true;
}
async function selectSearchPage(item: unknown, context: SidebarContextValue) {
  navigating.value = true;
  searchOpen.value = false;
  // Release the nested search layer before closing its navigation drawer.
  await nextTick();
  navigate(String(item), context);
}
function toggleFavorite() {
  if (!currentPage.value) return;
  const titles = favorites.value[namespace.value];
  favorites.value[namespace.value] = isFavorite.value ? titles.filter(title => title !== selected.value) : [...titles, selected.value];
}
</script>

<template>
  <div class="sidebar-pages-demo" data-sidebar-block="workspace-pages" :data-standalone="props.standalone || undefined">
    <SidebarLayout label="Workspace pages navigation" navigation-label="Workspace page links" collapsible="offcanvas" full-screen-on-mobile
      :content-alignment="props.standalone ? 'shell' : 'available'" :mobile-breakpoint="1200">
      <template #header="context">
        <WorkspaceSwitcher v-model="namespace" :items="namespaceSwitcherItems" label="Namespaces" account-label="ros@example.test"
          :actions="namespaceSwitcherActions" :workspace-actions="namespaceSwitcherWorkspaceActions" :footer-actions="namespaceSwitcherFooterActions"
          :teleport="!context.isMobile" :positioning="{ placement: 'bottom-start', strategy: 'fixed', gutter: 8 }"
          @action="navigate($event.label, context)">
          <template #trigger>
            <Sidebar.MenuButton :aria-label="`Namespace: ${namespace}`" class="sidebar-pages-demo__namespace">
              <template #icon><span class="sidebar-pages-demo__namespace-icon"><Building2 aria-hidden="true" /></span></template>
              <span class="sidebar-pages-demo__identity"><strong>{{ namespace }}</strong><small>Workspace pages</small></span>
              <ChevronsUpDown class="sidebar-pages-demo__chevrons" aria-hidden="true" />
            </Sidebar.MenuButton>
          </template>
        </WorkspaceSwitcher>
      </template>
      <template #navigation="context">
        <Sidebar.Menu aria-label="Workspace shortcuts">
          <Sidebar.MenuItem><Sidebar.MenuButton :icon="Search" class="sidebar-pages-demo__search" aria-haspopup="dialog" :aria-expanded="searchOpen" @click="search(context)">Quick search …</Sidebar.MenuButton></Sidebar.MenuItem>
          <Sidebar.MenuItem><Sidebar.MenuButton :icon="House" :active="selected === 'Home'" href="?page=Home" @click.prevent="navigate('Home', context)">Home</Sidebar.MenuButton></Sidebar.MenuItem>
        </Sidebar.Menu>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Favorites</Sidebar.GroupLabel>
          <Sidebar.Menu aria-label="Favorites">
            <Sidebar.MenuItem v-for="page in favoritePages" :key="page.title">
              <Sidebar.MenuButton :active="selected === page.title" :href="`?page=${encodeURIComponent(page.title)}`" @click.prevent="navigate(page.title, context)"><template #icon>{{ page.emoji }}</template>{{ page.title }}</Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
          <p v-if="!favoritePages.length" class="sidebar-pages-demo__empty">No Favorites yet. Open a page and select its star.</p>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.Menu aria-label="Page groups">
            <Sidebar.MenuItem v-for="group in groups" :key="`${namespace}/${group.name}`">
              <Sidebar.Collapsible v-model:open="openGroups[`${namespace}/${group.name}`]">
                <Sidebar.CollapsibleTrigger as-child>
                  <Sidebar.MenuButton class="sidebar-pages-demo__group"><template #icon>{{ group.emoji }}</template>{{ group.name }}<Sidebar.MenuChevron /></Sidebar.MenuButton>
                </Sidebar.CollapsibleTrigger>
                <Sidebar.CollapsibleContent><Sidebar.MenuSub :aria-label="`${group.name} pages`">
                  <Sidebar.MenuSubItem v-for="page in group.pages" :key="page.title"><Sidebar.MenuButton :active="selected === page.title" :href="`?page=${encodeURIComponent(page.title)}`" @click.prevent="navigate(page.title, context)"><template #icon>{{ page.emoji }}</template>{{ page.title }}</Sidebar.MenuButton></Sidebar.MenuSubItem>
                </Sidebar.MenuSub></Sidebar.CollapsibleContent>
              </Sidebar.Collapsible>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
      </template>
      <template #footer="context">
        <Sidebar.Menu aria-label="Utility links" class="sidebar-pages-demo__utilities">
          <Sidebar.MenuItem v-for="item in utilities" :key="item.title"><Sidebar.MenuButton :icon="item.icon" :active="selected === item.title" :href="`?page=${item.title}`" @click.prevent="navigate(item.title, context)">{{ item.title }}</Sidebar.MenuButton></Sidebar.MenuItem>
        </Sidebar.Menu>
      </template>
      <template #toolbar>
        <span class="sidebar-pages-demo__breadcrumb"><span>{{ namespace }}</span><span aria-hidden="true">/</span><span>{{ selected }}</span></span>
        <Button v-if="currentPage" size="sm" variant="ghost" shape="square" :icon="Star" class="sidebar-pages-demo__favorite" :aria-label="`${isFavorite ? 'Remove' : 'Add'} ${selected} ${isFavorite ? 'from' : 'to'} Favorites`" :aria-pressed="isFavorite" @click="toggleFavorite" />
      </template>
      <template #default="context">
        <CommandPalette.Root v-model:open="searchOpen" v-model:value="query" :items="searchItems" :inert="!searchOpen || undefined" :restore-focus="!navigating || !searchFromDrawer" aria-label="Search workspace pages" @select="item => selectSearchPage(item, context)">
          <CommandPalette.Input placeholder="Search workspace pages…" />
          <CommandPalette.List><CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results><CommandPalette.Empty>No pages found.</CommandPalette.Empty></CommandPalette.List>
          <CommandPalette.Footer><span>↑↓ Navigate</span><span>Enter Open</span></CommandPalette.Footer>
        </CommandPalette.Root>
        <section class="sidebar-pages-demo__page" :aria-labelledby="headingId">
          <span class="sidebar-pages-demo__page-icon" aria-hidden="true">{{ currentPage?.emoji ?? (selected === 'Home' ? '🏡' : '📋') }}</span>
          <p class="sidebar-pages-demo__eyebrow">{{ namespace }}<template v-if="currentGroup"> / {{ currentGroup.name }}</template></p>
          <h2 :id="headingId">{{ selected }}</h2>
          <p class="sidebar-pages-demo__summary">{{ currentPage?.summary ?? utility?.description ?? namespaceActionDescriptions[selected] ?? 'Your shared pages, project notes, and team resources in one place.' }}</p>
          <template v-if="currentPage">
            <div class="sidebar-pages-demo__byline"><span>Ros.Space</span><span>Sample document</span></div>
            <h3>At a glance</h3>
            <ul class="sidebar-pages-demo__notes"><li v-for="note in currentPage.notes" :key="note">{{ note }}</li></ul>
            <aside class="sidebar-pages-demo__callout"><Star aria-hidden="true" /><p>Add pages to Favorites with the star in the toolbar. They stay within the selected namespace.</p></aside>
          </template>
          <ul v-else-if="utility" class="sidebar-pages-demo__notes"><li v-for="note in utility.notes" :key="note">{{ note }}</li></ul>
          <template v-else-if="!namespaceActionDescriptions[selected]">
            <h3>All pages <span class="sidebar-pages-demo__count">{{ pages.length }}</span></h3>
            <ul class="sidebar-pages-demo__index"><li v-for="page in pages" :key="page.title"><button type="button" @click="navigate(page.title, context)"><span aria-hidden="true">{{ page.emoji }}</span><span>{{ page.title }}</span></button></li></ul>
          </template>
          <p class="sidebar-pages-demo__note">Local example data. Page selection, Favorites, and open groups are kept until you reload.</p>
        </section>
      </template>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-workspace-pages-demo.css"></style>
