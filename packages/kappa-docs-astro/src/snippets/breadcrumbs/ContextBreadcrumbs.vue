<script setup lang="ts">
import { ref, useId, watch } from "vue";
import { Check, LockKeyhole, Search } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import { CommandPalette, type CommandPaletteSelectOptions } from "@dicehub/kappa/components/command-palette";
import { Popover } from "@dicehub/kappa/components/popover";
import { Tooltip } from "@dicehub/kappa/components/tooltip";

const projects = [
  { id: "WA-01", name: "Wind Aero Study" },
  { id: "HC-02", name: "Helicopter" },
  { id: "DR-03", name: "Drone" },
  { id: "HX-04", name: "Heat Exchanger Analysis" },
];
const current = ref(projects[0]!);
const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name, "en"));
const open = ref(false);
const query = ref("");
const surface = ref<HTMLElement>();
const triggerId = useId();
const projectName = (item: unknown) => (item as typeof projects[number]).name;
const projectId = (item: unknown) => (item as typeof projects[number]).id;
const matchesProject = (item: unknown, search: string) =>
  `${projectName(item)} ${projectId(item)}`.toLowerCase().includes(search.trim().toLowerCase());
const href = (item: typeof projects[number]) =>
  `/examples/appshell/paneled-workspace?view=Applications&project=${item.id}`;

watch(open, () => { query.value = ""; });
function selectProject(item: unknown, options: CommandPaletteSelectOptions) {
  const project = item as typeof projects[number];
  if (options.newTab) {
    window.open(href(project), "_blank", "noopener,noreferrer");
    return;
  }
  current.value = project;
  open.value = false;
}
</script>

<template>
  <Breadcrumbs.Root variant="context" aria-label="Project context">
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/examples/appshell/paneled-workspace?view=Dashboard">Ros.Space</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Breadcrumbs.Link :href="href(current)" aria-current="page">
          <LockKeyhole aria-hidden="true" /><span>{{ current.name }}</span>
        </Breadcrumbs.Link>
        <Popover.Root v-model:open="open" :ids="{ trigger: triggerId }" :initial-focus-el="() => surface?.querySelector('input') ?? null"
          :positioning="{ placement: 'bottom-start', gutter: 6, overflowPadding: 12 }">
          <Tooltip.Root :ids="{ trigger: triggerId }" :disabled="open" :open-delay="500" :close-delay="0" :positioning="{ placement: 'bottom' }">
            <Tooltip.Trigger as-child>
              <Popover.Trigger as-child>
                <Breadcrumbs.Trigger aria-label="Switch project" />
              </Popover.Trigger>
            </Tooltip.Trigger>
            <Tooltip.Content>Switch project</Tooltip.Content>
          </Tooltip.Root>
          <Popover.Content class="breadcrumbs-context-demo__picker" aria-label="Switch project">
            <div ref="surface">
              <CommandPalette.Panel v-slot="{ items }" :open="open" v-model:value="query" :items="sortedProjects"
                :item-to-string-value="projectName" :item-to-value="projectId" :filter="matchesProject" @select="selectProject" @close="open = false">
                <CommandPalette.Input aria-label="Search projects" placeholder="Search projects…">
                  <template #leading><Search :size="16" aria-hidden="true" /></template>
                  <template #trailing><span /></template>
                </CommandPalette.Input>
                <CommandPalette.List aria-label="Projects">
                  <CommandPalette.Item v-for="item in items" :key="projectId(item)" :value="item"
                    :aria-current="projectId(item) === current.id ? 'true' : undefined">
                    <Avatar.Root class="breadcrumbs-context-demo__avatar" aria-hidden="true">
                      <Avatar.Fallback>{{ projectName(item).slice(0, 1) }}</Avatar.Fallback>
                    </Avatar.Root>
                    <span class="breadcrumbs-context-demo__name">{{ projectName(item) }}</span>
                    <span class="breadcrumbs-context-demo__code">{{ projectId(item) }}</span>
                    <Check v-if="projectId(item) === current.id" :size="16" aria-hidden="true" />
                    <span v-else class="breadcrumbs-context-demo__check" aria-hidden="true" />
                  </CommandPalette.Item>
                  <CommandPalette.Empty>No projects found.</CommandPalette.Empty>
                </CommandPalette.List>
              </CommandPalette.Panel>
            </div>
            <footer class="breadcrumbs-context-demo__footer">
              <span>{{ projects.length }} projects</span>
              <a href="/examples/appshell/paneled-workspace?view=All+projects">Go to all projects</a>
            </footer>
          </Popover.Content>
        </Popover.Root>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>

<style>
.breadcrumbs-context-demo__picker.kappa-popover__content { --kappa-popover-padding: 0; inline-size: 28rem; gap: 0; overflow: hidden; border-radius: 0.5rem; font-size: 0.875rem; }
.breadcrumbs-context-demo__picker .kappa-command-palette__input-header { min-block-size: 3rem; gap: 0.5rem; padding: 0.5rem 0.75rem; border-block-end-color: var(--kappa-shell-menu-divider); }
.breadcrumbs-context-demo__picker .kappa-command-palette__input-header > svg { flex: none; color: var(--kappa-subtle); }
.breadcrumbs-context-demo__picker .kappa-command-palette__input { font-size: 0.875rem; }
.breadcrumbs-context-demo__picker .kappa-command-palette__list { max-block-size: 18.75rem; padding: 0.5rem; }
.breadcrumbs-context-demo__picker .kappa-command-palette__item { min-block-size: 2.1875rem; grid-template-columns: auto minmax(0, 1fr) auto 1rem; gap: 0.5rem; padding: 0.375rem 0.5rem; }
.breadcrumbs-context-demo__picker .kappa-command-palette__item::before { display: none; }
.breadcrumbs-context-demo__picker .kappa-command-palette__item:is([data-highlighted], :hover) { background: var(--kappa-dropdown-hover); color: var(--kappa-dropdown-foreground); }
.breadcrumbs-context-demo__picker .kappa-command-palette__item:active { background: var(--kappa-dropdown-pressed); }
.breadcrumbs-context-demo__avatar.kappa-avatar { --kappa-avatar-size: 1.5rem; --kappa-avatar-background: color-mix(in srgb, var(--kappa-info-tint) 60%, var(--kappa-control)); --kappa-avatar-foreground: color-mix(in srgb, var(--kappa-info-text) 60%, var(--kappa-default)); }
.breadcrumbs-context-demo__avatar.kappa-avatar::after { border: 1px solid var(--kappa-shell-avatar-border); }
.breadcrumbs-context-demo__name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.breadcrumbs-context-demo__code { color: var(--kappa-subtle); font-size: 0.75rem; }
.breadcrumbs-context-demo__check { inline-size: 1rem; block-size: 1rem; }
.breadcrumbs-context-demo__footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem; border-block-start: 1px solid var(--kappa-shell-menu-divider); color: var(--kappa-subtle); font-size: 0.75rem; }
.breadcrumbs-context-demo__footer a { color: var(--kappa-default); text-decoration: none; }
.breadcrumbs-context-demo__footer a:hover { text-decoration: underline; }
.breadcrumbs-context-demo__footer a:focus-visible { outline: 2px solid var(--kappa-focus); outline-offset: 3px; }
</style>
