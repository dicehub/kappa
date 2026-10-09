<script setup lang="ts">
import { Check } from "@lucide/vue";
import type { SettingsDemoSaveState } from "./use-settings-demo-save";
defineProps<{ state: SettingsDemoSaveState; savedText?: string }>();
</script>

<template>
  <span class="settings-demo__save-status" role="status" :data-state="state">
    <template v-if="state === 'saving'">Saving…</template>
    <template v-else-if="state === 'saved'"><Check aria-hidden="true" />{{ savedText || "Saved" }}</template>
  </span>
</template>
