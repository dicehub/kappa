<script setup lang="ts">
import { computed, ref } from "vue";
import { NumberInput, useNumberInput } from "@dicehub/kappa/components/number-input";
import { Field } from "@dicehub/kappa/components/field";

const controlled = ref("12");
const partial = ref("1");
const controlledFormatted = ref("1234");
const providerValue = ref("12");
const providerEvents = ref<string[]>([]);
const rejectCount = ref(0);
const emitProvider: NonNullable<Parameters<typeof useNumberInput>[1]> = (event, ...args) => {
  providerEvents.value.push(event);
  if (event === "update:modelValue") providerValue.value = String(args[0]);
};
const provider = useNumberInput(computed(() => ({
  id: "caret-provider",
  ids: { input: "caret-provider-input" },
  min: 1,
  max: 64,
  modelValue: providerValue.value,
  onValueChange: () => providerEvents.value.push("onValueChange"),
})), emitProvider);
</script>

<template>
  <main>
    <NumberInput.Root default-value="12" :min="1" :max="64" data-caret-case="uncontrolled">
      <NumberInput.Label>Uncontrolled amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
    </NumberInput.Root>
    <NumberInput.Root v-model="controlled" :min="1" :max="64" data-caret-case="controlled">
      <NumberInput.Label>Controlled amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      <output data-model-value>{{ controlled }}</output>
    </NumberInput.Root>
    <NumberInput.RootProvider :value="provider" data-caret-case="provider">
      <NumberInput.Label>Provider amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      <output data-model-value>{{ providerValue }}</output>
      <output data-provider-events>{{ JSON.stringify(providerEvents) }}</output>
    </NumberInput.RootProvider>
    <NumberInput.Root v-model="partial" :step="0.01" data-caret-case="partial">
      <NumberInput.Label>Decimal amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      <output data-model-value>{{ partial }}</output>
    </NumberInput.Root>
    <NumberInput.Root default-value="1234" :format-options="{ useGrouping: true }" data-caret-case="formatted">
      <NumberInput.Label>Formatted amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
    </NumberInput.Root>
    <NumberInput.Root v-model="controlledFormatted" :format-options="{ useGrouping: true }" data-caret-case="controlled-formatted">
      <NumberInput.Label>Controlled formatted amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      <output data-model-value>{{ controlledFormatted }}</output>
    </NumberInput.Root>
    <NumberInput.Root default-value="1.234,5" locale="de-DE" :format-options="{ minimumFractionDigits: 1 }" data-caret-case="locale">
      <NumberInput.Label>German amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
    </NumberInput.Root>
    <NumberInput.Root model-value="12" @value-change="rejectCount++" data-caret-case="rejected">
      <NumberInput.Label>Rejected amount</NumberInput.Label>
      <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      <output data-change-count>{{ rejectCount }}</output>
    </NumberInput.Root>
    <Field.Root id="caret-field" required invalid>
      <Field.Label>Field amount</Field.Label>
      <NumberInput.Root default-value="3">
        <NumberInput.Control><NumberInput.Input /></NumberInput.Control>
      </NumberInput.Root>
    </Field.Root>
    <button type="button" @click="providerValue = '24'">Set provider value</button>
  </main>
</template>
