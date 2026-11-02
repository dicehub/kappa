<script setup lang="ts">
import { computed, type Component } from "vue";
const props = defineProps<{ variant: string }>();
const starters = import.meta.glob("../snippets/app-shell/*.vue", { eager: true, import: "default" }) as Record<string, Component>;
const starter = computed(() => starters[`../snippets/app-shell/${props.variant}.vue`]);
</script>
<template><component :is="starter" /></template>
