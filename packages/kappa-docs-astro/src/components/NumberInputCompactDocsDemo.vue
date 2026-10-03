<script setup lang="ts">
import { ref } from "vue";
import NumberInputField from "./NumberInputField.vue";

const value = ref(2);
</script>

<template>
  <div class="kappa-compact-number-demo" data-number-input-demo="compact-use">
    <NumberInputField label="Value" :value="value" @change="value = $event" />
  </div>
</template>

<style src="./number-input-compact-demo.css"></style>
