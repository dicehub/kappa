export const barrelCode = `import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@dicehub/kappa/components/item";`;

export const previewCode = `<script setup>
import { CheckCircle2 } from "@lucide/vue";
import { Item } from "@dicehub/kappa/components/item";
</script>

<template>
  <Item.Root as="article" variant="outline">
    <Item.Media variant="icon"><CheckCircle2 aria-hidden="true" /></Item.Media>
    <Item.Content>
      <Item.Title>Mesh validation passed</Item.Title>
      <Item.Description>12 checks completed in 1.8 seconds.</Item.Description>
    </Item.Content>
    <Item.Actions>Ready</Item.Actions>
  </Item.Root>
</template>`;

export const compositionCode = `Item.Group
├── Item.Root
│   ├── Item.Header (optional)
│   ├── Item.Media
│   ├── Item.Content
│   │   ├── Item.Title
│   │   └── Item.Description
│   ├── Item.Actions
│   └── Item.Footer (optional)
└── Item.Separator (optional)`;

export const usageCode = `<script setup>
import { Item } from "@dicehub/kappa/components/item";

const runs = [
  { id: "184", name: "Wake refinement", detail: "12 checks · 1.8 s", status: "Ready" },
  { id: "183", name: "Boundary sweep", detail: "8 checks · 2.4 s", status: "Review" },
];
</script>

<template>
  <Item.Group aria-label="Recent runs">
    <Item.Root v-for="run in runs" :key="run.id" as="article" role="listitem">
      <Item.Media variant="icon">{{ run.id }}</Item.Media>
      <Item.Content>
        <Item.Title>{{ run.name }}</Item.Title>
        <Item.Description>{{ run.detail }}</Item.Description>
      </Item.Content>
      <Item.Actions>{{ run.status }}</Item.Actions>
    </Item.Root>
  </Item.Group>
</template>`;

const variantsCode = `<script setup lang="ts">
import { Item } from "@dicehub/kappa/components/item";

const variants = ["default", "outline", "muted"] as const;
</script>

<template>
  <Item.Root v-for="variant in variants" :key="variant" :variant="variant">
    <Item.Content>
      <Item.Title>{{ variant }} surface</Item.Title>
      <Item.Description>Use the treatment that matches the surrounding surface.</Item.Description>
    </Item.Content>
  </Item.Root>
</template>`;

const sizesCode = `<script setup lang="ts">
import { Item } from "@dicehub/kappa/components/item";

const sizes = ["default", "sm", "xs"] as const;
</script>

<template>
  <Item.Root v-for="size in sizes" :key="size" :size="size" variant="outline">
    <Item.Content>
      <Item.Title>{{ size }} density</Item.Title>
      <Item.Description>Spacing and type scale change together.</Item.Description>
    </Item.Content>
  </Item.Root>
</template>`;

const mediaCode = `<script setup>
import { Item } from "@dicehub/kappa/components/item";
</script>

<template>
  <Item.Root variant="muted">
    <Item.Media variant="icon" aria-hidden="true">✓</Item.Media>
    <Item.Content>
      <Item.Title>Icon media</Item.Title>
      <Item.Description>Use image for a cropped thumbnail or default for custom content.</Item.Description>
    </Item.Content>
  </Item.Root>
</template>`;

const groupCode = `<script setup>
import { Item } from "@dicehub/kappa/components/item";
</script>

<template>
  <Item.Group aria-label="Simulation runs">
    <Item.Root role="listitem"><Item.Content><Item.Title>Run 184</Item.Title></Item.Content></Item.Root>
    <Item.Separator />
    <Item.Root role="listitem"><Item.Content><Item.Title>Run 183</Item.Title></Item.Content></Item.Root>
  </Item.Group>
</template>`;

const linkCode = `<script setup>
import { Item } from "@dicehub/kappa/components/item";
</script>

<template>
  <Item.Root as="a" href="/runs/run-184" variant="outline">
    <Item.Media variant="icon" aria-hidden="true">→</Item.Media>
    <Item.Content>
      <Item.Title>Run 184</Item.Title>
      <Item.Description>Open the full convergence report.</Item.Description>
    </Item.Content>
  </Item.Root>
</template>`;

const headerFooterCode = `<script setup>
import { Item } from "@dicehub/kappa/components/item";
</script>

<template>
  <Item.Root as="article" variant="muted">
    <Item.Header><span>RUN 184</span><span>18:42 UTC</span></Item.Header>
    <Item.Media variant="icon">CFD</Item.Media>
    <Item.Content>
      <Item.Title>Wake refinement</Item.Title>
      <Item.Description>Mesh and solver settings are ready.</Item.Description>
    </Item.Content>
    <Item.Footer><span>3 attachments</span><span>Owner: Mei Chen</span></Item.Footer>
  </Item.Root>
</template>`;

export const examples = [
  {
    id: "variants",
    title: "Variants",
    description: "Use the quiet default, outlined surface, or tinted muted treatment.",
    variant: "variants",
    code: variantsCode,
  },
  {
    id: "sizes",
    title: "Sizes",
    description: "Match row density to the surrounding workflow with default, small, or extra-small spacing.",
    variant: "sizes",
    code: sizesCode,
  },
  {
    id: "media",
    title: "Media",
    description: "Place an icon, avatar, image, or supplied visual before the item content.",
    variant: "media",
    code: mediaCode,
  },
  {
    id: "group",
    title: "Grouped Items",
    description: "Use Item.Group for a list of related rows and Item.Separator for deliberate divisions.",
    variant: "group",
    code: groupCode,
  },
  {
    id: "link",
    title: "Linked Item",
    description: "Render the complete surface as one native anchor when the item has one destination.",
    variant: "link",
    code: linkCode,
  },
  {
    id: "header-footer",
    title: "Header and Footer",
    description: "Add full-width metadata above or below the primary media, content, and action row.",
    variant: "header-footer",
    code: headerFooterCode,
  },
] as const;

export const rootProps = [
  {
    name: "as",
    type: '"div" | "article" | "section" | "li" | "a"',
    defaultValue: '"div"',
    description: "Native element rendered by the outer item surface.",
  },
  {
    name: "variant",
    type: '"default" | "outline" | "muted"',
    defaultValue: '"default"',
    description: "Controls the item surface treatment.",
  },
  {
    name: "size",
    type: '"default" | "sm" | "xs"',
    defaultValue: '"default"',
    description: "Controls spacing, media size, and type scale.",
  },
] as const;

export const mediaProps = [
  {
    name: "variant",
    type: '"default" | "icon" | "image"',
    defaultValue: '"default"',
    description: "Chooses the supplied, icon, or image media treatment.",
  },
] as const;

export const titleProps = [
  {
    name: "as",
    type: '"h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div"',
    defaultValue: '"div"',
    description: "Sets the semantic element used for the item title.",
  },
] as const;

export const parts = [
  { name: "Item.Root", element: "div", description: "Responsive row surface for media, content, and actions." },
  { name: "Item.Group", element: "div[role=list]", description: "List container for related items." },
  { name: "Item.Separator", element: "hr", description: "Horizontal native separator between grouped rows." },
  { name: "Item.Media", element: "div", description: "Contains an icon, avatar, image, or other leading visual." },
  { name: "Item.Content", element: "div", description: "Flexible title and description column." },
  { name: "Item.Title", element: "div", description: "Primary item label; use as for document semantics." },
  { name: "Item.Description", element: "p", description: "Supporting item context or status detail." },
  { name: "Item.Actions", element: "div", description: "Trailing actions, status, or metadata." },
  { name: "Item.Header", element: "div", description: "Full-width metadata row before the main content." },
  { name: "Item.Footer", element: "div", description: "Full-width metadata row after the main content." },
] as const;

export const dataSlots = [
  ["item", "Outer item surface."],
  ["item-group", "Related item list container."],
  ["item-separator", "Horizontal group separator."],
  ["item-media", "Leading media container."],
  ["item-content", "Flexible copy column."],
  ["item-title", "Primary item label."],
  ["item-description", "Supporting item description."],
  ["item-actions", "Trailing actions or metadata."],
  ["item-header", "Full-width leading metadata row."],
  ["item-footer", "Full-width trailing metadata row."],
] as const;

export const exportsList = [
  { name: "Item", description: "Compound API exposing all Item parts." },
  { name: "ItemRoot", description: "Unaugmented item surface component." },
  { name: "ItemGroup", description: "List container with role=list." },
  { name: "ItemSeparator", description: "Native horizontal separator." },
  { name: "ItemMedia", description: "Default, icon, or image media container." },
  { name: "ItemContent", description: "Flexible title and description column." },
  { name: "ItemTitle", description: "Configurable semantic title element." },
  { name: "ItemDescription", description: "Supporting description paragraph." },
  { name: "ItemActions", description: "Trailing action or metadata container." },
  { name: "ItemHeader / ItemFooter", description: "Full-width metadata regions." },
  { name: "ItemVariant / ItemSize / ItemMediaVariant", description: "Supported variant and density unions." },
] as const;
