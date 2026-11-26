<script setup lang="ts">
import { Dropdown } from "@dicehub/kappa/components/dropdown";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { Flag } from "@lucide/vue";

defineProps<{ railOnBottom: boolean }>();
const insetHeader = defineModel<boolean>("insetHeader", { required: true });
const centeredSearch = defineModel<boolean>("centeredSearch", { required: true });
const sidebarSearch = defineModel<boolean>("sidebarSearch", { required: true });
const smartResize = defineModel<boolean>("smartResize", { required: true });
const showSnapGuide = defineModel<boolean>("showSnapGuide", { required: true });
const projectGuide = defineModel<boolean>("projectGuide", { required: true });
const projectHeadingLink = defineModel<boolean>("projectHeadingLink", { required: true });
const collapsibleProjects = defineModel<boolean>("collapsibleProjects", { required: true });
const projectsSection = defineModel<boolean>("projectsSection", { required: true });
const compactShowMore = defineModel<boolean>("compactShowMore", { required: true });
const pinnedSection = defineModel<boolean>("pinnedSection", { required: true });
</script>

<template>
  <Dropdown.Root aria-label="Feature flags"
    :positioning="{ placement: railOnBottom ? 'top-end' : 'left-start', strategy: 'fixed', gutter: 4, fitViewport: true, overflowPadding: 8 }">
    <Dropdown.Trigger as-child>
      <ToolbarButton variant="ghost" size="sm" :icon="Flag" tooltip="Feature flags" :tooltip-placement="railOnBottom ? 'top' : 'left'" />
    </Dropdown.Trigger>
    <Dropdown.Context v-slot="menu">
      <Dropdown.Content show-arrow :inert="!menu.open || undefined">
        <Dropdown.Group>
          <Dropdown.Label>Feature flags</Dropdown.Label>
          <Dropdown.CheckboxItem v-model:checked="insetHeader" value="inset-header" close-on-select>
            Inset header
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-if="insetHeader" v-model:checked="centeredSearch" value="centered-search" inset :disabled="sidebarSearch" close-on-select>
            Centered search
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="sidebarSearch" value="sidebar-search" close-on-select>
            Search in sidebar
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="smartResize" value="smart-resize" close-on-select>
            Smart sidebar resizing
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="showSnapGuide" value="snap-guide" close-on-select>
            Show snap guide
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="projectGuide" value="project-guide" close-on-select>
            Project guide line
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="projectHeadingLink" value="project-heading-link" close-on-select>
            Clickable Projects heading
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="collapsibleProjects" value="collapsible-projects" close-on-select>
            Collapsible projects
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="projectsSection" value="projects-section" close-on-select>
            Projects section header
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="compactShowMore" value="compact-show-more" close-on-select>
            Compact Show more
          </Dropdown.CheckboxItem>
          <Dropdown.CheckboxItem v-model:checked="pinnedSection" value="pinned-section" close-on-select>
            Pinned section
          </Dropdown.CheckboxItem>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Context>
  </Dropdown.Root>
</template>
