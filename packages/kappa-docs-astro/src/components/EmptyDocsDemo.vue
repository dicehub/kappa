<script setup lang="ts">
import { Box, FolderOpen, Plus, Search, Upload } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyRoot,
  EmptyTitle,
} from "@dicehub/kappa/components/empty";

type DemoVariant =
  | "preview"
  | "basic"
  | "sizes"
  | "media"
  | "avatar"
  | "avatar-group"
  | "actions"
  | "outlined"
  | "status"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const portraits = {
  mei: "/avatars/mei-chen.webp",
  lina: "/avatars/lina-haddad.webp",
  samir: "/avatars/samir-aziz.webp",
};
</script>

<template>
  <div class="empty-demo" :data-empty-demo="props.variant">
    <Empty.Root v-if="props.variant === 'preview'" class="empty-demo__hero">
      <Empty.Header>
        <Empty.Media variant="icon"><Box aria-hidden="true" /></Empty.Media>
        <Empty.Title>No simulation cases</Empty.Title>
        <Empty.Description>
          Create a case or import an existing setup to start a simulation.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="primary" :icon="Plus">Create case</Button>
        <Button size="sm" variant="outline" :icon="Upload">Import case</Button>
      </Empty.Content>
    </Empty.Root>

    <EmptyRoot v-else-if="props.variant === 'basic'" size="sm">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>Try a different name or clear the active filters.</EmptyDescription>
      </EmptyHeader>
    </EmptyRoot>

    <div v-else-if="props.variant === 'sizes'" class="empty-demo__sizes">
      <Empty.Root v-for="size in ['sm', 'base', 'lg'] as const" :key="size" :size="size">
        <Empty.Header>
          <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media>
          <Empty.Title>{{ size }} empty state</Empty.Title>
          <Empty.Description>No files are attached to this run.</Empty.Description>
        </Empty.Header>
      </Empty.Root>
    </div>

    <Empty.Root v-else-if="props.variant === 'media'" class="empty-demo__hero">
      <Empty.Header>
        <Empty.Media>
          <div class="empty-demo__plot" aria-hidden="true">
            <span /><span /><span /><span /><span />
          </div>
        </Empty.Media>
        <Empty.Title>No residual history</Empty.Title>
        <Empty.Description>Residual values appear after the solver writes its first time step.</Empty.Description>
      </Empty.Header>
    </Empty.Root>

    <Empty.Root v-else-if="props.variant === 'avatar'" size="sm">
      <Empty.Header>
        <Empty.Media>
          <Avatar.Root size="lg">
            <Avatar.Image :src="portraits.mei" alt="" />
            <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
            <Avatar.Badge
              class="empty-demo__avatar-badge--offline"
              role="img"
              aria-label="Offline"
            />
          </Avatar.Root>
        </Empty.Media>
        <Empty.Title>Mei Chen is offline</Empty.Title>
        <Empty.Description>
          Leave a note for the project owner or continue the review later.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm">Leave a note</Button>
      </Empty.Content>
    </Empty.Root>

    <Empty.Root v-else-if="props.variant === 'avatar-group'" size="sm">
      <Empty.Header>
        <Empty.Media aria-hidden="true">
          <Avatar.Group>
            <Avatar.Root>
              <Avatar.Image :src="portraits.mei" alt="" />
              <Avatar.Fallback>MC</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root>
              <Avatar.Image :src="portraits.lina" alt="" />
              <Avatar.Fallback>LH</Avatar.Fallback>
            </Avatar.Root>
            <Avatar.Root>
              <Avatar.Image :src="portraits.samir" alt="" />
              <Avatar.Fallback>SA</Avatar.Fallback>
            </Avatar.Root>
          </Avatar.Group>
        </Empty.Media>
        <Empty.Title>No review team</Empty.Title>
        <Empty.Description>Invite colleagues to review this simulation project.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="primary" :icon="Plus">Invite reviewers</Button>
      </Empty.Content>
    </Empty.Root>

    <Empty.Root v-else-if="props.variant === 'actions'" size="sm">
      <Empty.Header>
        <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media>
        <Empty.Title>No projects</Empty.Title>
        <Empty.Description>Create a project to organize cases, runs, and results.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="primary" :icon="Plus">Create project</Button>
        <Button size="sm" variant="ghost">Read the guide</Button>
      </Empty.Content>
    </Empty.Root>

    <Empty.Root v-else-if="props.variant === 'outlined'" class="empty-demo__outlined" size="sm">
      <Empty.Header>
        <Empty.Media variant="icon"><Upload aria-hidden="true" /></Empty.Media>
        <Empty.Title>Drop geometry here</Empty.Title>
        <Empty.Description>STEP, STL, or OBJ up to 250 MB.</Empty.Description>
      </Empty.Header>
    </Empty.Root>

    <Empty.Root
      v-else-if="props.variant === 'status'"
      role="status"
      aria-live="polite"
      size="sm"
    >
      <Empty.Header>
        <Empty.Media variant="icon"><Search aria-hidden="true" /></Empty.Media>
        <Empty.Title as="h2">No matching runs</Empty.Title>
        <Empty.Description>The run list changed and now contains no matches.</Empty.Description>
      </Empty.Header>
    </Empty.Root>

    <Empty.Root v-else dir="rtl" size="sm">
      <Empty.Header>
        <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media>
        <Empty.Title>لا توجد مشاريع</Empty.Title>
        <Empty.Description>أنشئ مشروعًا لتنظيم حالات المحاكاة والنتائج.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm" variant="primary" :icon="Plus">إنشاء مشروع</Button>
      </Empty.Content>
    </Empty.Root>
  </div>
</template>

<style scoped>
.empty-demo {
  display: grid;
  inline-size: min(100%, 44rem);
  min-inline-size: 0;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.empty-demo__hero,
.empty-demo__outlined {
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-lg, 0.75rem);
  background: var(--kappa-control);
}

.empty-demo__outlined {
  border-style: dashed;
}

.empty-demo__sizes {
  display: grid;
  inline-size: 100%;
  gap: 0.75rem;
}

.empty-demo__sizes .kappa-empty {
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-md, 0.625rem);
  background: var(--kappa-control);
}

.empty-demo__plot {
  display: flex;
  inline-size: 8rem;
  block-size: 3.5rem;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--kappa-line);
  border-radius: var(--kappa-radius-md, 0.625rem);
  background: var(--kappa-tint);
}

.empty-demo__plot span {
  inline-size: 0.625rem;
  border-radius: 0.125rem 0.125rem 0 0;
  background: var(--kappa-accent);
  opacity: 0.45;
}

.empty-demo__plot span:nth-child(1) { block-size: 82%; }
.empty-demo__plot span:nth-child(2) { block-size: 62%; }
.empty-demo__plot span:nth-child(3) { block-size: 44%; }
.empty-demo__plot span:nth-child(4) { block-size: 31%; }
.empty-demo__plot span:nth-child(5) { block-size: 18%; }

.empty-demo :deep(.empty-demo__avatar-badge--offline) {
  background: var(--kappa-subtle);
}

@media (max-width: 36rem) {
  .empty-demo__sizes .kappa-empty--lg {
    --kappa-empty-padding-block: 3.5rem;
    --kappa-empty-padding-inline: 1.25rem;
  }
}
</style>
