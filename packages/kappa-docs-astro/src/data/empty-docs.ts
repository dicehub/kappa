export const barrelCode = `import {
  Empty,
  EmptyRoot,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Empty,
  EmptyRoot,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@dicehub/kappa/components/empty";`;

export const previewCode = `<script setup>
import { Empty } from "@dicehub/kappa/components/empty";
import { Box, Plus, Upload } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
</script>

<template>
  <Empty.Root class="case-empty">
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
</template>`;

export const usageCode = `<script setup>
import { Empty } from "@dicehub/kappa/components/empty";
</script>

<template>
  <Empty.Root>
    <Empty.Header>
      <Empty.Title>No results</Empty.Title>
      <Empty.Description>Try a different name or clear the active filters.</Empty.Description>
    </Empty.Header>
  </Empty.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  EmptyRoot,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@dicehub/kappa/components/empty";
</script>

<template>
  <EmptyRoot size="sm">
    <EmptyHeader>
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>Try a different query.</EmptyDescription>
    </EmptyHeader>
  </EmptyRoot>
</template>`;

export const sizesCode = `<Empty.Root size="sm">...</Empty.Root>
<Empty.Root size="base">...</Empty.Root>
<Empty.Root size="lg">...</Empty.Root>`;

export const mediaCode = `<Empty.Root>
  <Empty.Header>
    <Empty.Media>
      <ResidualPlotPreview aria-hidden="true" />
    </Empty.Media>
    <Empty.Title>No residual history</Empty.Title>
    <Empty.Description>
      Residual values appear after the solver writes its first time step.
    </Empty.Description>
  </Empty.Header>
</Empty.Root>`;

export const avatarCode = `<script setup>
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import { Empty } from "@dicehub/kappa/components/empty";
</script>

<template>
  <Empty.Root size="sm">
    <Empty.Header>
      <Empty.Media>
        <Avatar.Root size="lg">
          <Avatar.Image src="/avatars/mei-chen.webp" alt="" />
          <Avatar.Fallback aria-hidden="true">MC</Avatar.Fallback>
          <Avatar.Badge role="img" aria-label="Offline" />
        </Avatar.Root>
      </Empty.Media>
      <Empty.Title>Mei Chen is offline</Empty.Title>
      <Empty.Description>
        Leave a note for the project owner or continue the review later.
      </Empty.Description>
    </Empty.Header>
    <Empty.Content><Button size="sm">Leave a note</Button></Empty.Content>
  </Empty.Root>
</template>`;

export const avatarGroupCode = `<script setup>
import { Plus } from "@lucide/vue";
import { Avatar } from "@dicehub/kappa/components/avatar";
import { Button } from "@dicehub/kappa/components/button";
import { Empty } from "@dicehub/kappa/components/empty";
</script>

<template>
  <Empty.Root size="sm">
    <Empty.Header>
      <Empty.Media aria-hidden="true">
        <Avatar.Group>
          <Avatar.Root><Avatar.Image src="/avatars/mei-chen.webp" alt="" /><Avatar.Fallback>MC</Avatar.Fallback></Avatar.Root>
          <Avatar.Root><Avatar.Image src="/avatars/lina-haddad.webp" alt="" /><Avatar.Fallback>LH</Avatar.Fallback></Avatar.Root>
          <Avatar.Root><Avatar.Image src="/avatars/samir-aziz.webp" alt="" /><Avatar.Fallback>SA</Avatar.Fallback></Avatar.Root>
        </Avatar.Group>
      </Empty.Media>
      <Empty.Title>No review team</Empty.Title>
      <Empty.Description>Invite colleagues to review this simulation project.</Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <Button size="sm" variant="primary" :icon="Plus">Invite reviewers</Button>
    </Empty.Content>
  </Empty.Root>
</template>`;

export const actionsCode = `<Empty.Root size="sm">
  <Empty.Header>
    <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media>
    <Empty.Title>No projects</Empty.Title>
    <Empty.Description>Create a project to organize cases and results.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button size="sm" variant="primary">Create project</Button>
    <Button size="sm" variant="ghost">Read the guide</Button>
  </Empty.Content>
</Empty.Root>`;

export const outlinedCode = `<Empty.Root class="drop-empty" size="sm">
  <Empty.Header>
    <Empty.Media variant="icon"><Upload aria-hidden="true" /></Empty.Media>
    <Empty.Title>Drop geometry here</Empty.Title>
    <Empty.Description>STEP, STL, or OBJ up to 250 MB.</Empty.Description>
  </Empty.Header>
</Empty.Root>

<style scoped>
.drop-empty {
  border: 1px dashed var(--kappa-line);
  border-radius: var(--kappa-radius-lg);
  background: var(--kappa-control);
}
</style>`;

export const statusCode = `<Empty.Root role="status" aria-live="polite" size="sm">
  <Empty.Header>
    <Empty.Title as="h2">No matching runs</Empty.Title>
    <Empty.Description>The run list changed and now contains no matches.</Empty.Description>
  </Empty.Header>
</Empty.Root>`;

export const rtlCode = `<Empty.Root dir="rtl" size="sm">
  <Empty.Header>
    <Empty.Title>لا توجد مشاريع</Empty.Title>
    <Empty.Description>أنشئ مشروعًا لتنظيم حالات المحاكاة والنتائج.</Empty.Description>
  </Empty.Header>
</Empty.Root>`;

export const rootProps = [
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Controls spacing and type scale." },
] as const;

export const mediaProps = [
  { name: "variant", type: '"default" | "icon"', defaultValue: '"default"', description: "Uses supplied media unchanged or places an icon in a quiet container." },
] as const;

export const titleProps = [
  { name: "as", type: '"h2" | "h3" | "h4" | "p" | "div"', defaultValue: '"h3"', description: "Sets the semantic title element for the surrounding document hierarchy." },
] as const;

export const parts = [
  { name: "Empty.Root", element: "div", description: "Centers the complete empty-state composition and forwards native attributes." },
  { name: "Empty.Header", element: "div", description: "Groups media, title, and description." },
  { name: "Empty.Media", element: "div", description: "Contains an icon, image, avatar, chart preview, or other visual." },
  { name: "Empty.Title", element: "h3", description: "Names the empty state; the as prop changes its semantic element." },
  { name: "Empty.Description", element: "p", description: "Explains why the state is empty or what the user can do next." },
  { name: "Empty.Content", element: "div", description: "Groups actions, links, inputs, or other recovery controls." },
] as const;

export const exportsList = [
  { name: "Empty", description: "Compound API exposing Root, Header, Media, Title, Description, and Content." },
  { name: "EmptyRoot", description: "Unaugmented empty-state root component." },
  { name: "EmptyHeader", description: "Copy and media grouping component." },
  { name: "EmptyMedia", description: "Default or icon media container." },
  { name: "EmptyTitle", description: "Semantic empty-state title." },
  { name: "EmptyDescription", description: "Supporting description." },
  { name: "EmptyContent", description: "Action and recovery content group." },
  { name: "EmptySize", description: "Supported root size union." },
  { name: "EmptyMediaVariant", description: "Supported media treatment union." },
  { name: "EmptyTitleElement", description: "Supported semantic title element union." },
] as const;
