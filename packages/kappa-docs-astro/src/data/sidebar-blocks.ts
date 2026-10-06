// read_when: Add or change the Sidebar block gallery, preview routes, or source examples.
export const sidebarBlocks = [
  { id: "grouped", title: "Grouped Navigation", description: "A documentation sidebar with text links grouped by section, a version selector, and an editable search field. Desktop collapse hides the sidebar; mobile uses a full-screen drawer." },
  { id: "collapsible-sections", title: "Collapsible Sections", description: "Section headings expand and collapse their links independently. Search opens matching sections, and section state is retained when switching between desktop and mobile." },
  { id: "submenus", title: "Submenus", description: "Clickable parent pages with always-visible, indented child links. A simple documentation header and off-canvas collapse keep the hierarchy clear." },
  { id: "floating-submenus", title: "Floating Submenus", description: "A wider, floating navigation panel with a border, rounded corners, and visible child links. Desktop collapse hides the panel; mobile uses a full-screen drawer." },
  { id: "collapsible-submenus", title: "Collapsible Submenus", description: "Click a parent row to show or hide its indented links. The selected page's group starts open. Search reveals matching links, and open groups are retained on mobile." },
  { id: "dropdown-submenus", title: "Dropdown Submenus", description: "Click a parent row to open its page links in a popup. Search filters the links. Mobile selection closes the full-screen navigation and keeps the selected page." },
  { id: "collapsible-icons", title: "Collapsible Icon Navigation", description: "Starts expanded with nested link groups, project shortcuts, namespace and profile menus, and Quick search. Collapse to an icon rail; click a group icon to expand its links. Group state and selection are retained on mobile." },
  { id: "inset-navigation", title: "Inset Navigation", description: "An inset content panel beside nested navigation and project links. Support and Feedback stay above the profile menu while the main links scroll. Includes namespace selection, Quick search, icon collapse, and full-screen mobile navigation." },
  { id: "inbox-navigation", title: "Inbox Navigation", description: "A fixed folder icon rail beside a searchable message list and reading panel. Filter unread messages, collapse the list, and open messages from a full-screen mobile drawer." },
  { id: "workspace-pages", title: "Workspace Pages", description: "A page-based workspace with Favorites, expandable groups, namespace selection, Quick search, and utility links. Desktop collapse hides the sidebar; mobile uses a full-screen drawer. The original Workspace example remains available below." },
  { id: "minimal-workspace", title: "Minimal Workspace", description: "A compact dicehub-style shell with centered search and a / shortcut, a simple namespace selector, a resizable sidebar, and a rounded content panel. Includes local project creation, profile and Help menus, a footer collapse button, and full-screen mobile navigation." },
  { id: "workspace", title: "Workspace", description: "Grouped navigation, namespace and profile menus, Quick search, and a resizable edge." },
  { id: "rail", title: "Icon Rail", description: "Starts with a compact icon rail. Expand it for labels and nested navigation. Use the centered search field or press / to open a panel that expands and fades in. Search pages and projects." },
  { id: "inset", title: "Inset Content", description: "A quiet navigation surface beside a bordered, inset content panel." },
  { id: "floating", title: "Floating Sidebar", description: "A separate navigation panel with a small outer gap and rounded edges." },
] as const;

export const sidebarLayoutUsage = `<script setup>
import { SidebarLayout } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Folder } from "@lucide/vue";
</script>

<template>
  <SidebarLayout variant="workspace" label="Project navigation" style="height: 100svh">
    <template #header>
      <Sidebar.MenuButton :icon="Folder" tooltip="Workspace">Workspace</Sidebar.MenuButton>
    </template>
    <template #navigation="{ setMobileOpen }">
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton :icon="Folder" href="/projects" tooltip="Projects"
            @click="setMobileOpen(false)">Projects</Sidebar.MenuButton>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </template>
    <template #toolbar>Projects</template>
    <main style="padding: 1.5rem">Your application content.</main>
  </SidebarLayout>
</template>`;
