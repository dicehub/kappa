<script setup lang="ts">
import { Checkbox as ArkCheckbox, useCheckboxContext } from "@ark-ui/vue/checkbox";
import { nextTick } from "vue";

const checkbox = useCheckboxContext();

async function reconcileNativeState(event: Event) {
  const input = event.currentTarget;
  if (!(input instanceof HTMLInputElement)) return;
  await nextTick();
  if (!input.isConnected) return;
  input.checked = checkbox.value.checked;
  input.indeterminate = checkbox.value.indeterminate;
}
</script>

<template>
  <ArkCheckbox.HiddenInput @change="reconcileNativeState" />
</template>
