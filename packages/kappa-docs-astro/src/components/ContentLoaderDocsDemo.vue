<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { ContentLoader, type ContentLoaderState } from "@dicehub/kappa/components/content-loader";
import { Input } from "@dicehub/kappa/components/input";
import { SkeletonLine } from "@dicehub/kappa/components/skeleton-line";

const props = withDefaults(defineProps<{ variant?: "preview" | "compact" | "custom" | "preserve" }>(), { variant: "preview" });
const state = ref<ContentLoaderState>(props.variant === "preserve" ? "ready" : "loading");
const note = ref("");
let timer: ReturnType<typeof setTimeout> | undefined;
function setState(next: ContentLoaderState) {
  clearTimeout(timer);
  state.value = next;
}
function reload() {
  setState("loading");
  timer = setTimeout(() => { state.value = "ready"; }, 700);
}
onBeforeUnmount(() => clearTimeout(timer));
const states = ["ready", "loading", "empty", "error"] as const;
</script>

<template>
  <div class="content-loader-demo" :data-content-loader-demo="variant">
    <div v-if="variant === 'preview' || variant === 'custom'" class="content-loader-demo__controls" role="group" aria-label="Content state">
      <Button v-for="item in states" :key="item" size="sm" :variant="state === item ? 'secondary' : 'ghost'"
        :aria-pressed="state === item" @click="setState(item)">{{ item.charAt(0).toUpperCase() + item.slice(1) }}</Button>
    </div>
    <Button v-if="variant === 'preserve'" size="sm" :disabled="state === 'loading'" @click="reload">Refresh details</Button>
    <div class="content-loader-demo__panel">
      <div class="content-loader-demo__heading">{{ variant === "preserve" ? "Run note" : "Simulation cases" }}</div>
      <ContentLoader :state="state" :compact="variant === 'compact'" :keep-mounted="variant === 'preserve'"
        loading-label="Loading cases…" empty-title="No cases yet" empty-description="Create a case to start a simulation."
        error-title="Cases could not be loaded" error-description="Check your connection and try again." retryable @retry="reload">
        <template v-if="variant === 'custom'" #loading>
          <div class="content-loader-demo__skeleton" aria-hidden="true">
            <SkeletonLine v-for="index in 3" :key="index" style="width: 100%; height: 1.75rem" />
          </div>
        </template>
        <template v-if="variant === 'custom'" #empty>
          <p class="content-loader-demo__empty">No cases match the current filter.</p>
          <Button size="sm" @click="setState('ready')">Clear filter</Button>
        </template>
        <template v-if="variant === 'custom'" #error="{ retry }">
          <p class="content-loader-demo__empty">The case service is unavailable.</p>
          <Button size="sm" variant="outline" @click="retry">Reconnect</Button>
        </template>
        <div v-if="variant === 'preserve'" class="content-loader-demo__note">
          <label :for="'run-note-' + variant">Note</label>
          <Input :id="'run-note-' + variant" v-model="note" placeholder="Write a note, then refresh…" />
          <small>The input stays mounted during refresh.</small>
        </div>
        <ul v-else class="content-loader-demo__list">
          <li><span>Wing profile</span><span>Completed</span></li>
          <li><span>Cooling channel</span><span>Ready</span></li>
          <li><span>Intake manifold</span><span>Running</span></li>
        </ul>
      </ContentLoader>
    </div>
  </div>
</template>

<style scoped>
.content-loader-demo { display: grid; gap: 1rem; inline-size: 100%; max-inline-size: 36rem; min-inline-size: 0; }
.content-loader-demo__controls { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.content-loader-demo__panel { border: 1px solid var(--kappa-line); border-radius: 4px; background: var(--kappa-control); overflow: hidden; }
.content-loader-demo__heading { padding: 0.625rem 0.875rem; border-block-end: 1px solid var(--kappa-line); font-size: 0.8125rem; font-weight: 600; color: var(--kappa-default); }
.content-loader-demo__list { list-style: none; margin: 0; padding: 0; }
.content-loader-demo__list li { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.25rem 1rem; padding: 0.75rem 0.875rem; font-size: 0.8125rem; }
.content-loader-demo__list li + li { border-block-start: 1px solid var(--kappa-line); }
.content-loader-demo__list li span:last-child { color: var(--kappa-subtle); font-size: 0.75rem; }
.content-loader-demo__note { display: grid; gap: 0.5rem; padding: 0.875rem; }
.content-loader-demo__note small { color: var(--kappa-subtle); }
.content-loader-demo__skeleton { display: grid; gap: 1rem; inline-size: 85%; }
.content-loader-demo__empty { margin: 0; color: var(--kappa-subtle); font-size: 0.8125rem; }
.content-loader-demo[data-content-loader-demo="compact"] { max-inline-size: 24rem; }
</style>
