<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Button } from "../button";
import { Empty } from "../empty";
import { Loader } from "../loader";
import type { ContentLoaderEmits, ContentLoaderProps, ContentLoaderSlots } from "./content-loader";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ContentLoaderProps>(), {
  state: "ready",
  keepMounted: false,
  compact: false,
  loadingLabel: "Loading…",
  emptyTitle: "No results",
  emptyDescription: "There is no content to show.",
  errorTitle: "Unable to load content",
  errorDescription: "Try again in a moment.",
  retryable: false,
  retryLabel: "Try again",
});
const emit = defineEmits<ContentLoaderEmits>();
defineSlots<ContentLoaderSlots>();
const hasRendered = ref(false);
watch(() => props.state, (state) => {
  if (state === "ready") hasRendered.value = true;
}, { immediate: true });
const announcement = computed(() => {
  if (props.state === "loading") return props.loadingLabel;
  if (props.state === "empty") return props.emptyTitle;
  if (props.state === "error") return props.errorTitle;
  return "";
});
const retry = () => emit("retry");
</script>

<template>
  <div v-bind="$attrs" class="kappa-content-loader" data-slot="content-loader"
    :data-state="state" :data-compact="compact ? '' : undefined">
    <span class="kappa-content-loader__announcement" role="status" aria-live="polite" aria-atomic="true">{{ announcement }}</span>
    <div data-slot="content-loader-region" :aria-busy="state === 'loading'">
      <div v-if="state === 'loading'" class="kappa-content-loader__state" data-slot="content-loader-loading">
        <slot name="loading">
          <Loader size="base" decorative />
          <span class="kappa-content-loader__message">{{ loadingLabel }}</span>
        </slot>
      </div>
      <div v-else-if="state === 'empty'" class="kappa-content-loader__state" data-slot="content-loader-empty">
        <slot name="empty">
          <Empty size="sm">
            <Empty.Header>
              <Empty.Title>{{ emptyTitle }}</Empty.Title>
              <Empty.Description v-if="emptyDescription">{{ emptyDescription }}</Empty.Description>
            </Empty.Header>
          </Empty>
        </slot>
      </div>
      <div v-else-if="state === 'error'" class="kappa-content-loader__state" data-slot="content-loader-error">
        <slot name="error" :retry="retry">
          <Empty size="sm">
            <Empty.Header>
              <Empty.Title>{{ errorTitle }}</Empty.Title>
              <Empty.Description v-if="errorDescription">{{ errorDescription }}</Empty.Description>
            </Empty.Header>
            <Empty.Content v-if="retryable"><Button size="sm" variant="outline" @click="retry">{{ retryLabel }}</Button></Empty.Content>
          </Empty>
        </slot>
      </div>
      <div v-if="state === 'ready' || (keepMounted && hasRendered)" v-show="state === 'ready'"
        data-slot="content-loader-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style src="./content-loader.css"></style>
