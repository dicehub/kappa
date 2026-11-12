<script setup lang="ts">
import { computed, ref } from "vue";
import { Search } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
import { Grid } from "@dicehub/kappa/components/grid";
import { InputGroup } from "@dicehub/kappa/components/input-group";
import { ToggleGroup } from "@dicehub/kappa/components/toggle-group";
import { communityProjectPreviews, communityProjectTags } from "./paneled-workspace-community";
import type { WorkspaceProject } from "./paneled-workspace-projects";

const props = defineProps<{ projects: WorkspaceProject[]; hrefForPage: (page: string) => string }>();
const emit = defineEmits<{ open: [page: string, event: MouseEvent] }>();
const query = ref("");
const tags = ref<string[]>([]);
const entries = computed(() => props.projects.flatMap(project => {
  const preview = communityProjectPreviews[project.code];
  return preview ? [{ ...project, ...preview }] : [];
}));
const filtered = computed(() => entries.value.filter(project => {
  const search = query.value.trim().toLowerCase();
  return (!tags.value.length || tags.value.every(tag => project.tags.includes(tag))) &&
    `${project.name} ${project.code} ${project.description} ${project.discipline} ${project.owner} ${project.tags.join(" ")}`.toLowerCase().includes(search);
}));
function clearFilters() { query.value = ""; tags.value = []; }
</script>

<template>
  <div class="paneled-community-projects">
    <p class="paneled-community-projects__intro">Explore simulation projects shared by the dicehub community.</p>
    <div class="paneled-community-projects__search-row">
      <InputGroup.Root class="paneled-community-projects__search">
        <InputGroup.Addon><Search aria-hidden="true" /></InputGroup.Addon>
        <InputGroup.Input v-model="query" type="search" aria-label="Search community projects" placeholder="Search projects, authors, or tags…" @keydown.esc="query = ''" />
      </InputGroup.Root>
      <p class="paneled-community-projects__count" role="status">{{ filtered.length }} {{ filtered.length === 1 ? 'project' : 'projects' }}</p>
    </div>
    <div class="paneled-community-projects__filters">
      <ToggleGroup.Root v-model="tags" multiple variant="outline" size="sm" spacing="md" aria-label="Filter community projects by tag" class="paneled-community-projects__tags">
        <ToggleGroup.Item v-for="tag in communityProjectTags" :key="tag" :value="tag">{{ tag }}</ToggleGroup.Item>
      </ToggleGroup.Root>
      <Button v-if="query || tags.length" variant="ghost" size="sm" @click="clearFilters">Clear filters</Button>
    </div>
    <Grid.Root v-if="filtered.length" as="ul" gap="sm" class="paneled-community-projects__grid" aria-label="Community projects">
      <Grid.Item v-for="project in filtered" :key="project.code" as="li">
        <Card as="a" size="sm" class="paneled-community-projects__card" :href="hrefForPage(project.code)" :aria-label="project.name" @click="emit('open', project.code, $event)">
          <img :src="`/images/community/${project.image}.webp`" alt="" width="800" height="500" loading="lazy" decoding="async" class="paneled-community-projects__preview" />
          <Card.Header class="paneled-community-projects__identity">
            <Avatar.Root size="sm" shape="circle" aria-hidden="true"><Avatar.Fallback>{{ project.owner.split(' ').map(word => word[0]).join('') }}</Avatar.Fallback></Avatar.Root>
            <div>
              <Card.Title>{{ project.name }}</Card.Title>
              <p class="paneled-community-projects__author">{{ project.owner }}</p>
            </div>
          </Card.Header>
          <Card.Content class="paneled-community-projects__card-tags"><Badge v-for="tag in project.tags" :key="tag" variant="outline">{{ tag }}</Badge></Card.Content>
        </Card>
      </Grid.Item>
    </Grid.Root>
    <div v-else class="paneled-project-list__empty">
      <h3>No projects found</h3>
      <p>Try another search or remove a tag.</p>
      <Button variant="outline" size="sm" @click="clearFilters">Clear filters</Button>
    </div>
  </div>
</template>

<style src="./paneled-workspace-community-projects.css"></style>
