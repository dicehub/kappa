<script setup lang="ts">
import { ref } from "vue";
import { ShikiProvider } from "@dicehub/kappa/components/code-block";
import ShikiStatus from "./ShikiStatus.vue";

const language = ref<"typescript" | "python">("typescript");
const mounted = ref(false);
const witness = ref(false);
function show(value: "typescript" | "python") {
  language.value = value;
  mounted.value = true;
}
</script>

<template>
  <main>
    <h1>Highlighter consumer</h1>
    <button @click="show('typescript')">Show TypeScript</button>
    <button @click="show('python')">Show Python</button>
    <button @click="mounted = false">Remove highlighter</button>
    <button @click="witness = true">Show second TypeScript highlighter</button>
    <section aria-label="Active highlighter">
      <ShikiProvider v-if="mounted" :languages="[language]">
        <ShikiStatus :language="language" />
      </ShikiProvider>
    </section>
    <section v-if="witness" aria-label="Waiting highlighter">
      <ShikiProvider :languages="['typescript']">
        <ShikiStatus language="typescript" />
      </ShikiProvider>
    </section>
  </main>
</template>
