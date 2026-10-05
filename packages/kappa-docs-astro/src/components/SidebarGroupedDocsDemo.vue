<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Input } from "@dicehub/kappa/components/input";
import { BookOpen, ChevronsUpDown, Search } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean; collapsibleSections?: boolean }>(), { standalone: false, collapsibleSections: false });
const headingId = useId();
const version = ref("1.0.1");
const query = ref("");
const selected = ref("Create a project");
const groups = [
  { title: "Getting started", items: ["Introduction", "Installation", "Create a project"] },
  { title: "Project workflow", items: ["Import geometry", "Prepare a mesh", "Run a simulation", "Review results"] },
  { title: "Reference", items: ["Configuration", "Keyboard shortcuts", "Troubleshooting"] },
];
const filtered = computed(() => groups.map(group => ({ ...group, items: group.items.filter(item => item.toLowerCase().includes(query.value.trim().toLowerCase())) })).filter(group => group.items.length));
const openSections = ref<Record<string, boolean>>(Object.fromEntries(groups.map(group => [group.title, true])));
watch(query, value => {
  if (props.collapsibleSections && value.trim()) {
    for (const group of filtered.value) openSections.value[group.title] = true;
  }
});
const section = computed(() => groups.find(group => group.items.includes(selected.value))!.title);
const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");
const positioning = { placement: "bottom-start", strategy: "fixed", gutter: 6 } as const;
</script>

<template>
  <div class="sidebar-grouped-demo" :data-sidebar-block="props.collapsibleSections ? 'collapsible-sections' : 'grouped'" :data-standalone="props.standalone || undefined">
    <SidebarLayout label="Documentation navigation" collapsible="offcanvas" full-screen-on-mobile
      :content-alignment="props.standalone ? 'shell' : 'available'" :mobile-breakpoint="1200">
      <template #header="context">
        <Dropdown.Root aria-label="Documentation versions" :positioning="positioning">
          <Dropdown.Trigger as-child>
            <Sidebar.MenuButton class="sidebar-grouped-demo__version" :aria-label="`Documentation version: ${version}`">
              <template #icon><span class="sidebar-grouped-demo__mark"><BookOpen aria-hidden="true" /></span></template>
              <span class="sidebar-grouped-demo__identity"><strong>Documentation</strong><span>v{{ version }}</span></span>
              <ChevronsUpDown class="sidebar-grouped-demo__chevrons" aria-hidden="true" />
            </Sidebar.MenuButton>
          </Dropdown.Trigger>
          <Dropdown.Context v-slot="menu"><Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined">
            <Dropdown.RadioGroup v-model="version"><Dropdown.Label>Versions</Dropdown.Label>
              <Dropdown.RadioItem v-for="item in ['1.0.1', '1.1.0-alpha', '2.0.0-beta']" :key="item" :value="item" close-on-select>v{{ item }}</Dropdown.RadioItem>
            </Dropdown.RadioGroup>
          </Dropdown.Content></Dropdown.Context>
        </Dropdown.Root>
      </template>
      <template #navigation="context">
        <div class="sidebar-grouped-demo__search"><Search aria-hidden="true" /><Input v-model="query" size="sm" aria-label="Search documentation" placeholder="Search the docs…" type="search" @keydown.esc.stop="query = ''" /></div>
        <Sidebar.Group v-for="group in filtered" :key="group.title">
          <Sidebar.Collapsible v-if="props.collapsibleSections" v-model:open="openSections[group.title]">
            <Sidebar.CollapsibleTrigger class="sidebar-grouped-demo__section-trigger">{{ group.title }}<Sidebar.MenuChevron /></Sidebar.CollapsibleTrigger>
            <Sidebar.CollapsibleContent>
              <Sidebar.Menu><Sidebar.MenuItem v-for="item in group.items" :key="item">
                <Sidebar.MenuButton :href="`?page=${slug(item)}`" :active="selected === item" @click.prevent="selected = item; context.setMobileOpen(false)">{{ item }}</Sidebar.MenuButton>
              </Sidebar.MenuItem></Sidebar.Menu>
            </Sidebar.CollapsibleContent>
          </Sidebar.Collapsible>
          <template v-else>
            <Sidebar.GroupLabel>{{ group.title }}</Sidebar.GroupLabel>
            <Sidebar.Menu><Sidebar.MenuItem v-for="item in group.items" :key="item">
              <Sidebar.MenuButton :href="`?page=${slug(item)}`" :active="selected === item" @click.prevent="selected = item; context.setMobileOpen(false)">{{ item }}</Sidebar.MenuButton>
            </Sidebar.MenuItem></Sidebar.Menu>
          </template>
        </Sidebar.Group>
        <p v-if="!filtered.length" class="sidebar-grouped-demo__empty" role="status">No pages found.</p>
      </template>
      <template #toolbar>
        <span class="sidebar-grouped-demo__divider" aria-hidden="true"></span>
        <nav class="sidebar-grouped-demo__breadcrumb" aria-label="Breadcrumb"><span>{{ section }}</span><span aria-hidden="true">/</span><span aria-current="page">{{ selected }}</span></nav>
      </template>
      <section class="sidebar-grouped-demo__article" :aria-labelledby="headingId">
        <span class="sidebar-grouped-demo__eyebrow">{{ section }} · v{{ version }}</span>
        <h2 :id="headingId">{{ selected }}</h2>
        <p>Keep project data, configuration, and results together in one workspace.</p>
        <h3>Before you start</h3>
        <p>Choose a workspace and check that you have permission to create projects. Use a clear name so your team can find the project later.</p>
        <h3>Next steps</h3>
        <ol><li>Create the project in your workspace.</li><li>Import geometry and check its dimensions.</li><li>Save your configuration before you run a simulation.</li></ol>
        <p class="sidebar-grouped-demo__note">Example documentation. Search filters the navigation; page and version selections stay in this preview.</p>
      </section>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-grouped-demo.css"></style>
