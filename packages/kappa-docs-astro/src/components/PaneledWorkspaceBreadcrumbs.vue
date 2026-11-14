<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import PaneledWorkspaceProjectSwitcher from "./PaneledWorkspaceProjectSwitcher.vue";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{
  namespace: string;
  project?: WorkspaceProject;
  projects: WorkspaceProject[];
  view: string;
  pageTitle: string;
  hrefForPage: (page: string) => string;
}>();
const trail = ref<{ $el: HTMLElement }>();
const emit = defineEmits<{
  navigate: [page: string];
  open: [page: string, event: MouseEvent];
}>();
function switchProject(page: string) {
  emit("navigate", page);
  if (!props.projects.some(project => project.code === page)) {
    void nextTick(() => trail.value?.$el.querySelector<HTMLAnchorElement>('[aria-current="page"]')?.focus({ preventScroll: true }));
  }
}
</script>

<template>
  <Breadcrumbs.Root ref="trail" variant="context" class="paneled-workspace-demo__breadcrumbs" aria-label="Workspace breadcrumb">
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link :href="hrefForPage('Dashboard')" @click="emit('open', 'Dashboard', $event)">{{ namespace }}</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <template v-if="project">
        <Breadcrumbs.Item>
          <Breadcrumbs.Link :href="hrefForPage(project.code)" @click="emit('open', project.code, $event)">{{ project.name }}</Breadcrumbs.Link>
          <PaneledWorkspaceProjectSwitcher variant="breadcrumb" :project="project" :projects="projects"
            :href-for-page="hrefForPage" :compact="false" :is-mobile="false" @navigate="switchProject" />
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
      </template>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link :href="hrefForPage(view)" aria-current="page" @click="emit('open', view, $event)">{{ pageTitle }}</Breadcrumbs.Link>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>
