<script setup lang="ts">
import { ref } from "vue";
import { NumberInput } from "@dicehub/kappa/components/number-input";
import { NumberInput as ArkNumberInput } from "@ark-ui/vue/number-input";
const mounted = ref(true), value = ref("12"), arkValue = ref("24");
const disabled = ref(false);
</script>

<template>
  <main>
    <h1>Number input consumer</h1>
    <button @click="mounted = false">Unmount Kappa input</button>
    <button @click="disabled = true">Disable scrubbing</button>
    <NumberInput.Root v-if="mounted" v-model="value" :min="0" :max="64">
      <NumberInput.Label>Kappa value</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
    </NumberInput.Root>
    <NumberInput.Root v-if="mounted" default-value="12.5" :step="0.5" :disabled="disabled">
      <NumberInput.Label>Scrub value</NumberInput.Label>
      <NumberInput.Control><NumberInput.ScrubbableInput /></NumberInput.Control>
    </NumberInput.Root>
    <ArkNumberInput.Root v-model="arkValue" :min="0" :max="64">
      <ArkNumberInput.Label>Ark value</ArkNumberInput.Label>
      <ArkNumberInput.Input />
      <ArkNumberInput.IncrementTrigger>Increment Ark value</ArkNumberInput.IncrementTrigger>
    </ArkNumberInput.Root>
    <output aria-label="Kappa model">{{ value }}</output>
    <output aria-label="Ark model">{{ arkValue }}</output>
  </main>
</template>
