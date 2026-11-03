<script setup lang="ts">
import type { AppShellPageProps } from "./app-shell";
withDefaults(defineProps<AppShellPageProps>(), { as: "main" });
</script>
<template>
  <component :is="as" class="kappa-app-shell__page">
    <header v-if="title || $slots.actions" class="kappa-app-shell__page-heading">
      <div><h1 v-if="title">{{ title }}</h1><p v-if="description">{{ description }}</p></div>
      <div v-if="$slots.actions" class="kappa-app-shell__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </component>
</template>
<style src="./app-shell.css"></style>
