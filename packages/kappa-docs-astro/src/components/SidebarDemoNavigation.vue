<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { Box, Folder, LayoutDashboard, Settings, Activity, FileText } from "@lucide/vue";
defineProps<{ selected: string; long?: boolean }>();
const emit = defineEmits<{ select: [value: string] }>();
const links = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Projects", icon: Folder },
];
</script>

<template>
  <Sidebar.Context v-slot="{ setMobileOpen }">
    <Sidebar.Content aria-label="Workspace links">
      <slot />
      <Sidebar.Group>
        <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem v-for="link in links" :key="link.label">
            <Sidebar.MenuButton
              :icon="link.icon" :tooltip="link.label" :active="selected === link.label"
              :href="`?section=${link.label.toLowerCase()}`"
              @click.prevent="emit('select', link.label); setMobileOpen(false)"
            >{{ link.label }}</Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.Collapsible default-open>
              <Sidebar.CollapsibleTrigger as-child>
                <Sidebar.MenuButton :icon="Box" tooltip="Mesh">
                  Mesh <Sidebar.MenuChevron />
                </Sidebar.MenuButton>
              </Sidebar.CollapsibleTrigger>
              <Sidebar.CollapsibleContent>
                <Sidebar.MenuSub>
                  <Sidebar.MenuSubItem v-for="label in ['Geometry', 'Refinement']" :key="label">
                    <Sidebar.MenuButton
                      :href="`?section=${label.toLowerCase()}`" :active="selected === label"
                      @click.prevent="emit('select', label); setMobileOpen(false)"
                    >{{ label }}</Sidebar.MenuButton>
                  </Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.CollapsibleContent>
            </Sidebar.Collapsible>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton :icon="Activity" href="?section=runs" disabled tooltip="Runs">
              Runs <Sidebar.MenuBadge>0</Sidebar.MenuBadge>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
      <Sidebar.Group v-if="long">
        <Sidebar.GroupLabel>Saved reports</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem v-for="index in 16" :key="index">
            <Sidebar.MenuButton :icon="FileText" :tooltip="`Report ${index}`" @click="emit('select', `Report ${index}`)">
              {{ index === 1 ? 'A long report name that must not widen the sidebar' : `Report ${index}` }}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton as-child disabled tooltip="Archived reports">
              <a href="?section=archived" @click.prevent="emit('select', 'Archived reports')">
                <Folder aria-hidden="true" /><Sidebar.MenuLabel>Archived reports</Sidebar.MenuLabel>
              </a>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Manage</Sidebar.GroupLabel>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton as-child tooltip="Settings" :active="selected === 'Settings'">
              <a href="?section=settings" @click.prevent="emit('select', 'Settings'); setMobileOpen(false)">
                <Settings aria-hidden="true" /><Sidebar.MenuLabel>Settings</Sidebar.MenuLabel>
              </a>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Context>
</template>
