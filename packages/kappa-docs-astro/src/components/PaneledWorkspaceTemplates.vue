<script setup lang="ts">
import { computed } from "vue";
import { Layers2, Thermometer, Waves, Wind } from "@lucide/vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Card } from "@dicehub/kappa/components/card";
import { Dialog } from "@dicehub/kappa/components/dialog";
import { Grid } from "@dicehub/kappa/components/grid";
import { workspaceTemplateCatalogs } from "./paneled-workspace-templates";

const props = defineProps<{ page: string }>();
const catalogs = computed(() => {
  if (props.page === "All templates") return Object.values(workspaceTemplateCatalogs);
  const catalog = workspaceTemplateCatalogs[props.page];
  return catalog ? [catalog] : [];
});
const templates = computed(() => catalogs.value.flatMap(catalog => catalog.templates.map(template => ({ ...template, publisher: catalog.publisher }))));
const description = computed(() => props.page === "All templates"
  ? "Browse CFD, experimental, and your published templates for aerodynamic, thermal, and fluid-flow studies."
  : catalogs.value[0]?.description);
const icons = { Aerodynamics: Wind, Thermodynamics: Thermometer, "Fluid mechanics": Waves, Multiphysics: Layers2 };
</script>

<template>
  <div v-if="templates.length" class="paneled-template-catalog">
    <p class="paneled-template-catalog__intro">{{ description }}</p>
    <Grid.Root as="ul" gap="sm" class="paneled-template-catalog__grid" :aria-label="page">
      <Grid.Item v-for="template in templates" :key="template.name" as="li">
        <Card as="article" size="sm" class="paneled-template-catalog__card">
          <Card.Header>
            <p class="paneled-template-catalog__discipline"><component :is="icons[template.discipline]" :size="18" aria-hidden="true" />{{ template.discipline }}</p>
            <Card.Title as="h3">{{ template.name }}</Card.Title>
            <Card.Description>{{ template.description }}</Card.Description>
          </Card.Header>
          <Card.Footer class="paneled-template-catalog__footer">
            <Badge variant="outline">v{{ template.version }}</Badge>
            <Dialog.Root lazy-mount unmount-on-exit>
              <Dialog.Trigger as-child><Button variant="ghost" size="sm" :aria-label="`Preview ${template.name}`">Preview</Button></Dialog.Trigger>
              <Dialog.Content size="sm" class="paneled-template-catalog__preview">
                <Dialog.Header>
                  <Dialog.Title>{{ template.name }}</Dialog.Title>
                  <Dialog.Description>{{ template.description }}</Dialog.Description>
                </Dialog.Header>
                <dl class="paneled-template-catalog__facts">
                  <div><dt>Discipline</dt><dd>{{ template.discipline }}</dd></div>
                  <div><dt>Analysis</dt><dd>{{ template.analysis }}</dd></div>
                  <div><dt>Version</dt><dd>{{ template.version }}</dd></div>
                  <div><dt>Published by</dt><dd>{{ template.publisher }}</dd></div>
                </dl>
                <div class="paneled-template-catalog__includes">
                  <h3>Included in this template</h3>
                  <ul><li v-for="item in template.includes" :key="item">{{ item }}</li></ul>
                </div>
                <Dialog.Footer><Dialog.Close as-child><Button variant="outline" size="sm">Close preview</Button></Dialog.Close></Dialog.Footer>
              </Dialog.Content>
            </Dialog.Root>
          </Card.Footer>
        </Card>
      </Grid.Item>
    </Grid.Root>
  </div>
</template>

<style src="./paneled-workspace-templates.css"></style>
