<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { Input } from "@dicehub/kappa/components/input";
import { BookOpen, ChevronRight, Search } from "@lucide/vue";

const props = withDefaults(defineProps<{ standalone?: boolean }>(), { standalone: false });
const headingId = useId();
const selected = ref("Create a project");
const query = ref("");
const groups = [
  { title: "Getting started", items: ["Introduction", "Installation", "Create a project"] },
  { title: "Project workflow", items: ["Import geometry", "Prepare a mesh", "Run a simulation", "Review results"] },
  { title: "Reference", items: ["Configuration", "Keyboard shortcuts", "Troubleshooting"] },
];
const section = computed(() => groups.find(group => group.items.includes(selected.value))!);
const filtered = computed(() => groups.map(group => ({ ...group, items: group.items.filter(item => item.toLowerCase().includes(query.value.trim().toLowerCase())) })).filter(group => group.items.length));
const slug = (name: string) => name.toLowerCase().replaceAll(" ", "-");
</script>

<template>
  <div class="sidebar-grouped-demo" data-sidebar-block="dropdown-submenus" :data-standalone="props.standalone || undefined">
    <SidebarLayout label="Documentation navigation" collapsible="offcanvas" full-screen-on-mobile
      :content-alignment="props.standalone ? 'shell' : 'available'" :mobile-breakpoint="1200">
      <template #header="context">
        <Sidebar.MenuButton href="?page=introduction" class="sidebar-grouped-demo__version" @click.prevent="selected = 'Introduction'; query = ''; context.setMobileOpen(false)">
          <template #icon><span class="sidebar-grouped-demo__mark"><BookOpen aria-hidden="true" /></span></template>
          <span class="sidebar-grouped-demo__identity"><strong>Documentation</strong><span>v1.0.1</span></span>
        </Sidebar.MenuButton>
      </template>
      <template #navigation="context">
        <div class="sidebar-grouped-demo__search"><Search aria-hidden="true" /><Input v-model="query" size="sm" type="search" aria-label="Search documentation" placeholder="Search the docs…" @keydown.esc.stop="query = ''" /></div>
        <Sidebar.Menu>
          <Sidebar.MenuItem v-for="group in filtered" :key="group.title">
            <Dropdown.Root :aria-label="group.title" lazy-mount unmount-on-exit :navigate="({ node }) => node.click()"
              :positioning="{ placement: context.isMobile ? 'bottom-start' : 'right-start', strategy: 'fixed', gutter: 8, overflowPadding: 8, fitViewport: true }"
              @select="selected = $event.value; context.setMobileOpen(false)">
              <Dropdown.Trigger as-child>
                <Sidebar.MenuButton class="sidebar-grouped-demo__parent sidebar-grouped-demo__dropdown-parent" :active="section.title === group.title" :aria-current="undefined">
                  {{ group.title }}<ChevronRight class="sidebar-grouped-demo__submenu-arrow" aria-hidden="true" />
                </Sidebar.MenuButton>
              </Dropdown.Trigger>
              <Dropdown.Context v-slot="menu">
                <Dropdown.Content :teleport="!context.isMobile" :inert="!menu.open || undefined" class="sidebar-grouped-demo__submenu-popup" :data-mobile="context.isMobile || undefined">
                  <Dropdown.Group><Dropdown.Label>{{ group.title }}</Dropdown.Label>
                    <Dropdown.LinkItem v-for="item in group.items" :key="item" :value="item" :href="`?page=${slug(item)}`" :aria-current="selected === item ? 'page' : undefined" @click.prevent>{{ item }}</Dropdown.LinkItem>
                  </Dropdown.Group>
                </Dropdown.Content>
              </Dropdown.Context>
            </Dropdown.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <p v-if="!filtered.length" class="sidebar-grouped-demo__empty" role="status">No pages found.</p>
      </template>
      <template #toolbar>
        <span class="sidebar-grouped-demo__divider" aria-hidden="true"></span>
        <nav class="sidebar-grouped-demo__breadcrumb" aria-label="Breadcrumb"><span>{{ section.title }}</span><span aria-hidden="true">/</span><span aria-current="page">{{ selected }}</span></nav>
      </template>
      <section class="sidebar-grouped-demo__article" :aria-labelledby="headingId">
        <span class="sidebar-grouped-demo__eyebrow">Documentation · v1.0.1</span>
        <h2 :id="headingId">{{ selected }}</h2>
        <p>Browse the {{ section.title.toLowerCase() }} guide. Click a parent row to open its page links in a popup.</p>
        <h3>In this section</h3>
        <ul><li v-for="item in section.items" :key="item">{{ item }}</li></ul>
        <p class="sidebar-grouped-demo__note">Example documentation. Navigation updates this preview only. Search filters the links in each popup. Selection and search are retained on mobile.</p>
      </section>
    </SidebarLayout>
  </div>
</template>

<style src="./sidebar-grouped-demo.css"></style>
