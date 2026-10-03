<script setup lang="ts">
import { ArrowRight, CheckCircle2, GitBranch, Server } from "@lucide/vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Item } from "@dicehub/kappa/components/item";

type DemoVariant =
  | "preview"
  | "usage"
  | "variants"
  | "sizes"
  | "media"
  | "group"
  | "link"
  | "header-footer";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const runs = [
  { id: "184", name: "Wake refinement", detail: "12 checks · 1.8 s", status: "Ready" },
  { id: "183", name: "Boundary sweep", detail: "8 checks · 2.4 s", status: "Review" },
  { id: "182", name: "Mesh baseline", detail: "16 checks · 0.9 s", status: "Ready" },
] as const;

const mediaItems = [
  { label: "Icon media", detail: "A compact symbol with a contained surface.", variant: "icon" as const },
  { label: "Image media", detail: "A thumbnail fills the available media frame.", variant: "image" as const },
  { label: "Supplied media", detail: "Custom content keeps its natural dimensions.", variant: "default" as const },
];
</script>

<template>
  <div class="item-demo" :data-item-demo="props.variant">
    <Item.Root v-if="props.variant === 'preview'" as="article" variant="outline">
      <Item.Media variant="icon"><CheckCircle2 aria-hidden="true" /></Item.Media>
      <Item.Content>
        <Item.Title>Mesh validation passed</Item.Title>
        <Item.Description>12 checks completed in 1.8 seconds.</Item.Description>
      </Item.Content>
      <Item.Actions><Badge variant="success">Ready</Badge></Item.Actions>
    </Item.Root>

    <Item.Group v-else-if="props.variant === 'usage'" aria-label="Recent simulation runs">
      <Item.Root v-for="run in runs" :key="run.id" as="article" role="listitem">
        <Item.Media variant="icon"><GitBranch aria-hidden="true" /></Item.Media>
        <Item.Content>
          <Item.Title>Run {{ run.id }} · {{ run.name }}</Item.Title>
          <Item.Description>{{ run.detail }}</Item.Description>
        </Item.Content>
        <Item.Actions><Badge :variant="run.status === 'Ready' ? 'success' : 'warning'">{{ run.status }}</Badge></Item.Actions>
      </Item.Root>
    </Item.Group>

    <div v-else-if="props.variant === 'variants'" class="item-demo__stack">
      <Item.Root v-for="variant in ['default', 'outline', 'muted'] as const" :key="variant" as="article" :variant="variant">
        <Item.Media variant="icon"><Server aria-hidden="true" /></Item.Media>
        <Item.Content>
          <Item.Title>{{ variant }} surface</Item.Title>
          <Item.Description>Useful for a dense application row.</Item.Description>
        </Item.Content>
        <Item.Actions><span class="item-demo__meta">{{ variant }}</span></Item.Actions>
      </Item.Root>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="item-demo__stack">
      <Item.Root v-for="size in ['default', 'sm', 'xs'] as const" :key="size" as="article" variant="outline" :size="size">
        <Item.Media variant="icon"><GitBranch aria-hidden="true" /></Item.Media>
        <Item.Content>
          <Item.Title>{{ size }} density</Item.Title>
          <Item.Description>Use the smallest row that keeps copy legible.</Item.Description>
        </Item.Content>
        <Item.Actions><span class="item-demo__meta">{{ size }}</span></Item.Actions>
      </Item.Root>
    </div>

    <div v-else-if="props.variant === 'media'" class="item-demo__stack">
      <Item.Root v-for="media in mediaItems" :key="media.label" as="article" variant="muted">
        <Item.Media :variant="media.variant">
          <CheckCircle2 v-if="media.variant === 'icon'" aria-hidden="true" />
          <span v-else-if="media.variant === 'default'" class="item-demo__media-mark">CFD</span>
          <div v-else class="item-demo__thumbnail" aria-hidden="true">184</div>
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ media.label }}</Item.Title>
          <Item.Description>{{ media.detail }}</Item.Description>
        </Item.Content>
        <Item.Actions><span class="item-demo__meta">{{ media.variant }}</span></Item.Actions>
      </Item.Root>
    </div>

    <Item.Group v-else-if="props.variant === 'group'" aria-label="Simulation runs">
      <Item.Root v-for="(run, index) in runs" :key="run.id" as="article" role="listitem" variant="outline">
        <Item.Media variant="icon"><span aria-hidden="true">{{ index + 1 }}</span></Item.Media>
        <Item.Content>
          <Item.Title>Run {{ run.id }}</Item.Title>
          <Item.Description>{{ run.name }} · {{ run.detail }}</Item.Description>
        </Item.Content>
        <Item.Actions><span class="item-demo__meta">{{ run.status }}</span></Item.Actions>
      </Item.Root>
      <Item.Separator />
      <Item.Root as="article" role="listitem">
        <Item.Content><Item.Title>Archive complete</Item.Title><Item.Description>Older runs are available in project history.</Item.Description></Item.Content>
      </Item.Root>
    </Item.Group>

    <Item.Root v-else-if="props.variant === 'link'" as="a" href="#composition" variant="outline">
      <Item.Media variant="icon"><ArrowRight aria-hidden="true" /></Item.Media>
      <Item.Content>
        <Item.Title>Open run 184</Item.Title>
        <Item.Description>Review the full convergence report.</Item.Description>
      </Item.Content>
      <Item.Actions aria-hidden="true"><ArrowRight :size="16" /></Item.Actions>
    </Item.Root>

    <Item.Root v-else as="article" variant="muted">
      <Item.Header><span>RUN 184</span><span>18:42 UTC</span></Item.Header>
      <Item.Media variant="icon"><GitBranch aria-hidden="true" /></Item.Media>
      <Item.Content>
        <Item.Title>Wake refinement</Item.Title>
        <Item.Description>Mesh and solver settings are ready.</Item.Description>
      </Item.Content>
      <Item.Footer>
        <span>3 attachments</span>
        <Button size="xs" variant="ghost">Review</Button>
      </Item.Footer>
    </Item.Root>
  </div>
</template>

<style scoped>
.item-demo {
  display: grid;
  inline-size: min(100%, 42rem);
  min-inline-size: 0;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.item-demo__stack {
  display: grid;
  gap: 0.625rem;
}

.item-demo__meta {
  color: var(--kappa-subtle);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.item-demo__media-mark {
  color: var(--kappa-accent);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.item-demo__thumbnail {
  display: grid;
  inline-size: 100%;
  block-size: 100%;
  place-items: center;
  background: var(--kappa-accent);
  color: var(--kappa-accent-foreground, #ffffff);
  font-size: 0.6875rem;
  font-weight: 700;
}

.item-demo__footer-note {
  color: var(--kappa-subtle);
}

@media (max-width: 38rem) {
  .item-demo :deep(.kappa-item__actions) {
    flex: 1 1 100%;
    justify-content: flex-start;
    margin-inline-start: 0;
    padding-inline-start: calc(var(--kappa-item-media-size) + var(--kappa-item-gap));
  }
}
</style>
