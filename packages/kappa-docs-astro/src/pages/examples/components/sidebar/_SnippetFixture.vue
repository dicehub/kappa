<script setup lang="ts">
import { computed, onMounted, ref, type Component } from "vue";
const snippets = import.meta.glob<Component>("../../../../snippets/sidebar/*.vue", { eager: true, import: "default" });
const name = ref("preview");
const example = computed(() => snippets[`../../../../snippets/sidebar/${name.value}.vue`]);
onMounted(() => { name.value = new URL(location.href).searchParams.get("variant") ?? "preview"; });
</script>

<template>
  <div class="sidebar-snippet-fixture" :data-snippet="name">
    <component :is="example" v-bind="name === 'loading' ? { loading: true } : {}" />
  </div>
</template>

<style>
.sidebar-snippet-fixture { block-size: 100dvb; overflow: hidden; }
</style>
