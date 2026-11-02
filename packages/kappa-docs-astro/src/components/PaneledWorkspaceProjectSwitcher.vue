<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Check, ChevronsUpDown, Search } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { ToolbarButton } from "@dicehub/kappa/components/button";
import { CommandPalette, type CommandPaletteSelectOptions } from "@dicehub/kappa/components/command-palette";
import { Popover } from "@dicehub/kappa/components/popover";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  project: WorkspaceProject;
  projects: WorkspaceProject[];
  hrefForPage: (page: string) => string;
  compact: boolean;
  isMobile: boolean;
}>();
const emit = defineEmits<{ navigate: [page: string] }>();
const open = ref(false);
const query = ref("");
const surface = ref<HTMLElement>();
const sortedProjects = computed(() => [...props.projects].sort((a, b) => a.name.localeCompare(b.name, "en")));
const projectLabel = (item: unknown) => (item as WorkspaceProject).name;
const projectCode = (item: unknown) => (item as WorkspaceProject).code;
const characters = new Intl.Segmenter(undefined, { granularity: "grapheme" });
const projectInitial = (name: string) => characters.segment(name.trim())[Symbol.iterator]().next().value?.segment.toUpperCase() ?? "";
const matchesProject = (item: unknown, search: string) => {
  const project = item as WorkspaceProject;
  return `${project.name} ${project.code}`.toLowerCase().includes(search.trim().toLowerCase());
};
watch(open, () => { query.value = ""; });
watch(() => props.project.code, () => { open.value = false; });
function selectProject(item: unknown, options: CommandPaletteSelectOptions) {
  const project = item as WorkspaceProject;
  if (options.newTab) { window.open(props.hrefForPage(project.code), "_blank", "noopener,noreferrer"); return; }
  open.value = false;
  emit("navigate", project.code);
}
function followProjectLink(event: MouseEvent) {
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-project-code]') : null;
  if (!link) return;
  // Handle ordinary clicks here; let the browser handle modified link clicks.
  event.stopPropagation();
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const project = props.projects.find(item => item.code === link.dataset.projectCode);
  if (project) selectProject(project, { newTab: false });
}
function allProjects(event: MouseEvent) {
  if (event.button || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  open.value = false;
  emit("navigate", "All projects");
}
</script>

<template>
  <Popover.Root v-model:open="open" :portalled="!isMobile" :initial-focus-el="() => surface?.querySelector('input') ?? null"
    :positioning="{ placement: compact ? 'right-start' : 'bottom-start', strategy: 'fixed', gutter: 10, overflowPadding: 8 }">
    <Popover.Trigger as-child>
      <ToolbarButton class="paneled-project-switcher__trigger" :data-compact="compact || undefined" :data-mobile="isMobile || undefined"
        :aria-label="`Switch project: ${project.name}`" :tooltip="`Switch project: ${project.name}`">
        <Avatar.Root class="paneled-project-switcher__avatar kappa-app-shell__project-avatar" aria-hidden="true">
          <Avatar.Image v-if="project.avatarSrc" :src="project.avatarSrc" alt="" />
          <Avatar.Fallback>{{ projectInitial(project.name) }}</Avatar.Fallback>
        </Avatar.Root>
        <span class="paneled-project-switcher__name">{{ project.name }}</span>
        <ChevronsUpDown class="paneled-project-switcher__chevrons" :size="14" aria-hidden="true" />
      </ToolbarButton>
    </Popover.Trigger>
    <Popover.Content :teleport="!isMobile" class="paneled-project-switcher__popover" aria-label="Switch project">
      <div ref="surface" class="paneled-project-switcher__surface">
        <CommandPalette.Panel v-slot="{ items }" :open="open" v-model:value="query" :items="sortedProjects"
          :item-to-string-value="projectLabel" :item-to-value="projectCode" :filter="matchesProject"
          @select="selectProject" @close="open = false">
          <CommandPalette.Input placeholder="Search projects…" aria-label="Search projects">
            <template #leading><Search :size="16" aria-hidden="true" /></template>
            <template #trailing><span /></template>
          </CommandPalette.Input>
          <CommandPalette.List aria-label="Projects" @click.capture="followProjectLink">
            <CommandPalette.Item v-for="item in items" :key="projectCode(item)" :value="item"
              :data-current="projectCode(item) === project.code || undefined" :aria-current="projectCode(item) === project.code || undefined">
              <a :href="hrefForPage(projectCode(item))" :data-project-code="projectCode(item)" class="paneled-project-switcher__link" tabindex="-1">
              <Avatar.Root class="paneled-project-switcher__avatar kappa-app-shell__project-avatar" aria-hidden="true">
                <Avatar.Image v-if="(item as WorkspaceProject).avatarSrc" :src="(item as WorkspaceProject).avatarSrc" alt="" />
                <Avatar.Fallback>{{ projectInitial(projectLabel(item)) }}</Avatar.Fallback>
              </Avatar.Root>
              <span class="paneled-project-switcher__option-name">{{ projectLabel(item) }}</span>
              <span class="paneled-project-switcher__code">{{ projectCode(item) }}</span>
              <Check v-if="projectCode(item) === project.code" :size="16" class="paneled-project-switcher__check" aria-hidden="true" />
              <span v-else class="paneled-project-switcher__check" aria-hidden="true" />
              </a>
            </CommandPalette.Item>
            <CommandPalette.Empty>No projects found.</CommandPalette.Empty>
          </CommandPalette.List>
        </CommandPalette.Panel>
        <footer class="paneled-project-switcher__footer">
          <span>{{ projects.length }} projects</span>
          <a :href="hrefForPage('All projects')" @click="allProjects">Go to all projects</a>
        </footer>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>

<style src="./paneled-workspace-project-switcher.css"></style>
