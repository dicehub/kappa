<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Input } from "@dicehub/kappa/components/input";
import { BookOpen, Search } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean; floating?: boolean; collapsible?: boolean }>(), { standalone: false, floating: false, collapsible: false });
const headingId = useId();
const selected = ref("Create a project");
const query = ref("");
const groups = [
  { title: "Getting started", items: ["Introduction", "Installation", "Create a project"] },
  { title: "Project workflow", items: ["Import geometry", "Prepare a mesh", "Run a simulation", "Review results"] },
  { title: "Reference", items: ["Configuration", "Keyboard shortcuts", "Troubleshooting"] },
];
const section = computed(() => groups.find(group => group.title === selected.value || group.items.includes(selected.value))!);
const openGroups = ref<Record<string, boolean>>(Object.fromEntries(groups.map(group => [group.title, group.items.includes(selected.value)])));
const filtered = computed(() => groups.map(group => ({ ...group, items: group.items.filter(item => item.toLowerCase().includes(query.value.trim().toLowerCase())) })).filter(group => group.items.length));
watch(query, value => {
  if (value.trim()) for (const group of filtered.value) openGroups.value[group.title] = true;
});
const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");
</script>

<template>
  <div class="sidebar-grouped-demo" :data-sidebar-block="props.collapsible ? 'collapsible-submenus' : props.floating ? 'floating-submenus' : 'submenus'" :data-standalone="props.standalone || undefined">
    <SidebarLayout :variant="props.floating ? 'floating' : 'workspace'" :width="props.floating ? '19rem' : undefined" label="Documentation navigation" collapsible="offcanvas" full-screen-on-mobile
      :content-alignment="props.standalone ? 'shell' : 'available'" :mobile-breakpoint="1200">
      <template #header="context">
        <Sidebar.MenuButton href="?page=introduction" class="sidebar-grouped-demo__version" @click.prevent="selected = 'Introduction'; openGroups['Getting started'] = true; query = ''; context.setMobileOpen(false)">
          <template #icon><span class="sidebar-grouped-demo__mark"><BookOpen aria-hidden="true" /></span></template>
          <span class="sidebar-grouped-demo__identity"><strong>Documentation</strong><span>v1.0.1</span></span>
        </Sidebar.MenuButton>
      </template>
      <template #navigation="context">
        <div v-if="props.collapsible" class="sidebar-grouped-demo__search"><Search aria-hidden="true" /><Input v-model="query" size="sm" type="search" aria-label="Search documentation" placeholder="Search the docs…" @keydown.esc.stop="query = ''" /></div>
        <Sidebar.Menu>
          <Sidebar.MenuItem v-for="group in filtered" :key="group.title" class="sidebar-grouped-demo__branch">
            <Sidebar.Collapsible v-if="props.collapsible" v-model:open="openGroups[group.title]">
              <Sidebar.CollapsibleTrigger class="sidebar-grouped-demo__parent">{{ group.title }}<Sidebar.MenuChevron /></Sidebar.CollapsibleTrigger>
              <Sidebar.CollapsibleContent>
                <Sidebar.MenuSub :aria-label="group.title">
                  <Sidebar.MenuSubItem v-for="item in group.items" :key="item">
                    <Sidebar.MenuButton :href="`?page=${slug(item)}`" :active="selected === item" @click.prevent="selected = item; context.setMobileOpen(false)">{{ item }}</Sidebar.MenuButton>
                  </Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.CollapsibleContent>
            </Sidebar.Collapsible>
            <template v-else>
              <Sidebar.MenuButton class="sidebar-grouped-demo__parent" :href="`?page=${slug(group.title)}`" :active="selected === group.title" @click.prevent="selected = group.title; context.setMobileOpen(false)">{{ group.title }}</Sidebar.MenuButton>
              <Sidebar.MenuSub :aria-label="group.title">
                <Sidebar.MenuSubItem v-for="item in group.items" :key="item">
                  <Sidebar.MenuButton :href="`?page=${slug(item)}`" :active="selected === item" @click.prevent="selected = item; context.setMobileOpen(false)">{{ item }}</Sidebar.MenuButton>
                </Sidebar.MenuSubItem>
              </Sidebar.MenuSub>
            </template>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <p v-if="!filtered.length" class="sidebar-grouped-demo__empty" role="status">No pages found.</p>
      </template>
      <template #toolbar>
        <span class="sidebar-grouped-demo__divider" aria-hidden="true"></span>
        <nav class="sidebar-grouped-demo__breadcrumb" aria-label="Breadcrumb">
          <template v-if="section.title !== selected"><span>{{ section.title }}</span><span aria-hidden="true">/</span></template>
          <span aria-current="page">{{ selected }}</span>
        </nav>
      </template>
      <section class="sidebar-grouped-demo__article" :aria-labelledby="headingId">
        <span class="sidebar-grouped-demo__eyebrow">Documentation · v1.0.1</span>
        <h2 :id="headingId">{{ selected }}</h2>
        <p>Browse the {{ section.title.toLowerCase() }} guide. {{ props.collapsible ? 'Click a parent row to show or hide its links. The indented links open individual pages.' : 'Parent links open a section overview; the indented links open individual pages.' }}</p>
        <h3>In this section</h3>
        <ul><li v-for="item in section.items" :key="item">{{ item }}</li></ul>
        <p class="sidebar-grouped-demo__note">Example documentation. Navigation updates this preview only. {{ props.collapsible ? 'Search opens matching submenus. Open groups and the selected page are retained on mobile.' : 'All submenus stay visible; the toolbar button hides the entire sidebar.' }}</p>
      </section>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-grouped-demo.css"></style>
