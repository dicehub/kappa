<script setup lang="ts">
import { Highlight as ArkHighlight } from "@ark-ui/vue/highlight";
import { computed } from "vue";
import {
  HIGHLIGHT_DEFAULT_EXACT_MATCH,
  HIGHLIGHT_DEFAULT_IGNORE_CASE,
  resolveHighlightMatchAll,
  type HighlightProps,
} from "./highlight";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<HighlightProps>(), {
  ignoreCase: HIGHLIGHT_DEFAULT_IGNORE_CASE,
  matchAll: undefined,
  exactMatch: HIGHLIGHT_DEFAULT_EXACT_MATCH,
});

const resolvedMatchAll = computed(() => resolveHighlightMatchAll(props.query, props.matchAll));
</script>

<template>
  <span
    v-bind="$attrs"
    class="kappa-highlight"
    data-slot="highlight"
    :data-ignore-case="props.ignoreCase ? '' : undefined"
    :data-match-all="resolvedMatchAll ? '' : undefined"
    :data-exact-match="props.exactMatch ? '' : undefined"
  >
    <ArkHighlight
      :text="props.text"
      :query="props.query"
      :ignore-case="props.ignoreCase"
      :match-all="resolvedMatchAll"
      :exact-match="props.exactMatch"
    />
  </span>
</template>

<style src="./highlight.css"></style>
