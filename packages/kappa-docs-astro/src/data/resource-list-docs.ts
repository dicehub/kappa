export const resourceListExamples = [
  {
    id: "complete",
    title: "Complete",
    description:
      "Page identity, actions, filtering, resource rows, and contextual usage in one responsive layout.",
  },
  {
    id: "compact",
    title: "Compact",
    description:
      "Reduced page spacing and compact rows for dense technical workspaces.",
  },
  {
    id: "minimal",
    title: "Minimal",
    description:
      "The primary region can stand alone when the surrounding application already supplies page identity and controls.",
  },
] as const;

export type ResourceListExampleId = (typeof resourceListExamples)[number]["id"];

const completeSource = `<script setup lang="ts">
import { Button, ResourceListLayout } from "@dicehub/kappa"
</script>

<template>
  <ResourceListLayout
    title="Resources"
    description="Projects and groups available in the Engineering namespace."
  >
    <template #icon><!-- Product icon --></template>
    <template #actions>
      <Button variant="primary">New resource</Button>
    </template>
    <template #toolbar><!-- Search and filters --></template>

    <!-- List, loading state, empty state, and pagination -->

    <template #aside><!-- Usage and contextual help --></template>
  </ResourceListLayout>
</template>`;

const compactSource = `<template>
  <ResourceListLayout
    density="compact"
    title="Resources"
    description="Projects and groups available in this namespace."
  >
    <!-- Compact resource rows -->
  </ResourceListLayout>
</template>`;

const minimalSource = `<template>
  <ResourceListLayout>
    <!-- The application supplies the surrounding header and controls. -->
    <!-- Render resource rows, an empty state, or a loading state here. -->
  </ResourceListLayout>
</template>`;

export const resourceListSource = (id: ResourceListExampleId): string => {
  if (id === "compact") return compactSource;
  if (id === "minimal") return minimalSource;
  return completeSource;
};
