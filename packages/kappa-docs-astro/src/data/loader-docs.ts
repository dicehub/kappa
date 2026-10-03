export const barrelCode = `import { Loader } from "@dicehub/kappa";`;

export const granularCode = `import { Loader } from "@dicehub/kappa/components/loader";`;

export const previewCode = `<script setup>
import { Loader } from "@dicehub/kappa/components/loader";
</script>

<template>
  <div class="payment-status" role="status" aria-live="polite">
    <Loader decorative size="lg" />
    <div>
      <strong>Processing payment...</strong>
      <span>Please keep this window open.</span>
    </div>
    <span>$100.00</span>
  </div>
</template>`;

export const usageCode = `<script setup>
import { Loader } from "@dicehub/kappa/components/loader";
</script>

<template>
  <Loader />
</template>`;

export const variantsCode = `<Loader variant="spinner" />
<Loader variant="waveform" />
<Loader variant="helix" />
<Loader variant="quantum" />
<Loader variant="dot-wave" />
<Loader variant="dot-stream" />
<Loader variant="mirage" />
<Loader variant="ping" />
<Loader variant="orbit" />`;

export const runCode = `<div role="status" aria-busy="true" aria-live="polite">
  <Loader decorative :duration="900" :size="80" variant="orbit" />
  <div>
    <strong>Waiting to start...</strong>
    <span>Preparing resources for the run.</span>
  </div>
</div>`;

export const sizesCode = `<Loader size="sm" label="Loading small example" />
<Loader size="base" label="Loading base example" />
<Loader size="lg" label="Loading large example" />`;

export const customSizeCode = `<Loader :size="40" label="Loading large preview" />`;

export const buttonCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Loader } from "@dicehub/kappa/components/loader";
</script>

<template>
  <div aria-busy="true">
    <Button disabled variant="primary">
      <Loader decorative data-icon="inline-start" size="sm" />
      Submitting
    </Button>
  </div>
</template>`;

export const badgeCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
import { Loader } from "@dicehub/kappa/components/loader";
</script>

<template>
  <Badge>
    <Loader decorative :size="12" data-icon="inline-start" />
    Syncing
  </Badge>
</template>`;

export const emptyCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Empty } from "@dicehub/kappa/components/empty";
import { Loader } from "@dicehub/kappa/components/loader";
</script>

<template>
  <Empty.Root size="sm">
    <Empty.Header>
      <Empty.Media><Loader decorative size="lg" /></Empty.Media>
      <Empty.Title>Processing your request</Empty.Title>
      <Empty.Description>
        Please wait while the request completes. Do not refresh this page.
      </Empty.Description>
    </Empty.Header>
    <Empty.Content><Button size="sm" variant="outline">Cancel</Button></Empty.Content>
  </Empty.Root>
</template>`;

export const loaderProps = [
  {
    name: "size",
    type: '"sm" | "base" | "lg" | number',
    defaultValue: '"base"',
    description: "Sets a 16, 24, or 32 pixel preset, or a custom positive pixel size.",
  },
  {
    name: "variant",
    type: '"spinner" | "waveform" | "helix" | "quantum" | "dot-wave" | "dot-stream" | "mirage" | "ping" | "orbit"',
    defaultValue: '"spinner"',
    description: "Selects the loading motion.",
  },
  {
    name: "duration",
    type: "number",
    defaultValue: "1500",
    description: "Sets the animation cycle in milliseconds. Values are limited to 400–10,000 ms.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Loading"',
    description: "Sets the visually hidden status text. Translate it for the current locale.",
  },
  {
    name: "decorative",
    type: "boolean",
    defaultValue: "false",
    description: "Removes status semantics when nearby visible text already describes the state.",
  },
] as const;

export const exportsList = [
  { name: "Loader", description: "Loading status component with several motion variants." },
  { name: "LoaderProps", description: "Public Loader prop contract." },
  { name: "LoaderSize / LoaderVariant", description: "Supported size and motion names." },
  { name: "LOADER_SIZES / LOADER_VARIANTS", description: "Stable preset collections." },
  { name: "LOADER_DEFAULT_*", description: "Default size, variant, duration, and status text." },
  { name: "LOADER_DEFAULT_LABEL", description: "Default status text." },
  { name: "isLoader*", description: "Runtime guards for preset values." },
  { name: "resolveLoader*", description: "Safe runtime resolvers for public props." },
] as const;
