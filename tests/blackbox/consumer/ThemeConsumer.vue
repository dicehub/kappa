<script setup lang="ts">
import metadata from "@dicehub/kappa/styles/tokens.json";
</script>

<template>
  <main>
    <h1>Theme consumer</h1>
    <section v-for="mode in metadata.modes" :key="mode" :data-kappa-theme="mode" :aria-label="mode + ' theme'"
      :style="{ backgroundColor: 'var(--kappa-canvas)' }">
      <p v-for="pair in metadata.contrastPairs" :key="pair.id" :data-pair="pair.id"
        :style="{ color: `var(${pair.foreground})`, backgroundColor: `var(${pair.background})` }">{{ pair.label }}</p>
    </section>
    <output aria-label="Published theme metadata">{{ JSON.stringify(metadata) }}</output>
  </main>
</template>
