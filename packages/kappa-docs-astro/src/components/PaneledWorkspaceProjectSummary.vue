<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";
import type { WorkspaceProject } from "./paneled-workspace-projects";

defineProps<{ project: WorkspaceProject }>();
</script>

<template>
  <div class="paneled-project-pages">
    <p class="paneled-project-pages__eyebrow">{{ project.discipline }} · {{ project.code }}</p>
    <p class="paneled-project-pages__intro">{{ project.description }}</p>
    <dl class="paneled-project-pages__facts">
      <div><dt>Status</dt><dd><Badge :variant="project.status === 'In review' ? 'warning' : project.status === 'In progress' ? 'info' : 'neutral'">{{ project.status }}</Badge></dd></div>
      <div><dt>Project lead</dt><dd>{{ project.owner }}</dd></div>
      <div><dt>Phase</dt><dd>{{ project.phase }}</dd></div>
      <div><dt>Project ID</dt><dd>{{ project.code }}</dd></div>
    </dl>
    <section class="paneled-project-pages__section">
      <h3>Study goals</h3>
      <ul class="paneled-project-pages__objectives">
        <li v-for="(goal, index) in project.goals" :key="goal"><span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span><p>{{ goal }}</p></li>
      </ul>
    </section>
  </div>
</template>

<style src="./paneled-workspace-project-pages.css"></style>
