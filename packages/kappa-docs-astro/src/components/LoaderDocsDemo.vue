<script setup lang="ts">
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Empty } from "@dicehub/kappa/components/empty";
import { Loader } from "@dicehub/kappa/components/loader";

type DemoVariant =
  | "preview"
  | "basic"
  | "variants"
  | "run"
  | "sizes"
  | "custom"
  | "button"
  | "badge"
  | "empty";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const sizes = ["sm", "base", "lg"] as const;
const loaderVariants = [
  ["spinner", "Spinner"],
  ["waveform", "Waveform"],
  ["helix", "Helix"],
  ["quantum", "Quantum"],
  ["dot-wave", "Dot wave"],
  ["dot-stream", "Dot stream"],
  ["mirage", "Mirage"],
  ["ping", "Ping"],
  ["orbit", "Orbit"],
] as const;
</script>

<template>
  <div class="loader-demo" :data-loader-demo="props.variant">
    <div
      v-if="props.variant === 'preview'"
      class="loader-demo__payment"
      role="status"
      aria-live="polite"
    >
      <Loader decorative size="lg" />
      <div class="loader-demo__payment-copy">
        <strong>Processing payment...</strong>
        <span>Please keep this window open.</span>
      </div>
      <span class="loader-demo__amount">$100.00</span>
    </div>

    <Loader v-else-if="props.variant === 'basic'" />

    <div v-else-if="props.variant === 'variants'" class="loader-demo__variants">
      <div
        v-for="[loaderVariant, name] in loaderVariants"
        :key="loaderVariant"
        class="loader-demo__variant"
      >
        <Loader decorative :variant="loaderVariant" :size="40" />
        <code>{{ name }}</code>
      </div>
    </div>

    <div
      v-else-if="props.variant === 'run'"
      class="loader-demo__run"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <Loader decorative :duration="900" :size="80" variant="orbit" />
      <div class="loader-demo__run-copy">
        <strong>Waiting to start...</strong>
        <span>Preparing resources for the run.</span>
      </div>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="loader-demo__sizes">
      <div v-for="size in sizes" :key="size" class="loader-demo__size">
        <Loader :size="size" :label="`Loading ${size} example`" />
        <code>{{ size }}</code>
      </div>
    </div>

    <div v-else-if="props.variant === 'custom'" class="loader-demo__size">
      <Loader :size="40" label="Loading large preview" />
      <code>40 px</code>
    </div>

    <div v-else-if="props.variant === 'button'" class="loader-demo__row" aria-busy="true">
      <Button disabled variant="primary">
        <Loader decorative data-icon="inline-start" size="sm" />
        Submitting
      </Button>
      <Button disabled variant="outline">
        Checking
        <Loader decorative data-icon="inline-end" size="sm" />
      </Button>
      <Button disabled shape="square" aria-label="Saving">
        <Loader decorative data-icon="inline-start" size="sm" />
      </Button>
    </div>

    <div v-else-if="props.variant === 'badge'" class="loader-demo__row">
      <Badge><Loader decorative :size="12" data-icon="inline-start" />Syncing</Badge>
      <Badge variant="secondary">
        <Loader decorative :size="12" data-icon="inline-start" />Updating
      </Badge>
      <Badge variant="outline">
        <Loader decorative :size="12" data-icon="inline-start" />Processing
      </Badge>
    </div>

    <Empty.Root v-else-if="props.variant === 'empty'" class="loader-demo__empty" size="sm">
      <Empty.Header>
        <Empty.Media><Loader decorative size="lg" /></Empty.Media>
        <Empty.Title>Processing your request</Empty.Title>
        <Empty.Description>
          Please wait while the request completes. Do not refresh this page.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content><Button size="sm" variant="outline">Cancel</Button></Empty.Content>
    </Empty.Root>
  </div>
</template>

<style scoped>
.loader-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.loader-demo__payment {
  box-sizing: border-box;
  display: grid;
  inline-size: min(100%, 24rem);
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.875rem;
  padding: 1rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.75rem;
  background: var(--kappa-control, #ffffff);
  box-shadow: var(--kappa-shadow-sm, 0 1px 2px rgb(16 24 40 / 6%));
}

.loader-demo__payment-copy {
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
  gap: 0.125rem;
}

.loader-demo__payment-copy strong {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.loader-demo__payment-copy span {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1rem;
}

.loader-demo__amount {
  font-size: 0.875rem;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.loader-demo__sizes,
.loader-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.loader-demo__variants {
  display: grid;
  inline-size: min(100%, 38rem);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.loader-demo__variant {
  display: flex;
  min-block-size: 7rem;
  min-inline-size: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
  background: var(--kappa-control, #ffffff);
}

.loader-demo__variant code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.75rem;
}

.loader-demo__run {
  display: flex;
  inline-size: min(100%, 26rem);
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
}

.loader-demo__run-copy {
  display: flex;
  min-inline-size: 0;
  flex-direction: column;
  gap: 0.25rem;
}

.loader-demo__run-copy strong {
  font-size: 1rem;
  font-weight: 600;
}

.loader-demo__run-copy span {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.8125rem;
}

.loader-demo__sizes {
  gap: 2rem;
}

.loader-demo__row {
  gap: 0.75rem;
}

.loader-demo__size {
  display: inline-flex;
  min-inline-size: 3.5rem;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
}

.loader-demo__size code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.75rem;
}

.loader-demo__empty {
  min-block-size: 15rem;
}

@media (max-width: 30rem) {
  .loader-demo__variants {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .loader-demo__payment {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .loader-demo__amount {
    grid-column: 2;
  }
}
</style>
