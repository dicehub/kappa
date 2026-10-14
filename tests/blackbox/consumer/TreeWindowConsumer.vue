<script setup lang="ts">
import { ref } from "vue";
import { VirtualTree, type VirtualTreeNode } from "@dicehub/kappa/components/virtual-tree";

const height = ref("200px");
const items: VirtualTreeNode[] = [{ value: "records", label: "Records", children:
  Array.from({ length: 100_000 }, (_, index) => ({ value: `node-${index}`, label: `Node ${index}` })),
}];
</script>

<template>
  <main>
    <h1>Tree window consumer</h1>
    <button @click="height = '400px'">Grow tree viewport</button>
    <VirtualTree aria-label="All results" :items="items" :default-expanded-value="['records']" :height="height" />
  </main>
</template>
