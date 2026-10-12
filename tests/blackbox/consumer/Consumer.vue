<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
const count = ref(0);
</script>

<template>
  <main><h1>Kappa public consumer</h1><Button @click="count++">Activate</Button><output aria-label="Activation count">{{ count }}</output></main>
</template>
