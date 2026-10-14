<script setup lang="ts">
import { computed } from "vue";
import { useShikiHighlighter } from "@dicehub/kappa/components/code-highlighted";

const props = defineProps<{ language: "typescript" | "python" }>();
const { isLoading, isReady, error, highlight } = useShikiHighlighter();
const source = computed(() => props.language === "typescript" ? "const answer = 42;" : "answer = 42");
const html = computed(() => highlight(source.value, props.language));
</script>

<template>
  <output aria-label="Highlighter loading">{{ isLoading }}</output>
  <output aria-label="Highlighter ready">{{ isReady }}</output>
  <p v-if="error" role="alert">Highlighting unavailable: {{ error.message }}</p>
  <div v-if="html" aria-label="Highlighted source" v-html="html" />
  <pre v-else aria-label="Plain source">{{ source }}</pre>
</template>
