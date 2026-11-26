<script setup lang="ts">
import { computed } from "vue";
import { useFocusVisible } from "@ark-ui/vue/interaction";
import { Button } from "../../components/button";
import { Kbd, KbdGroup } from "../../components/kbd";
import type { AppShellSearchTriggerProps } from "./app-shell";
const props = withDefaults(defineProps<AppShellSearchTriggerProps>(), { label: "Search or go to…", shortcut: "" });
const shortcutKeys = computed(() => props.shortcut.trim().split(/\s+\+\s+/).filter(Boolean));
const focusVisible = useFocusVisible();
</script>
<template>
  <Button class="kappa-app-shell__search" variant="ghost" :icon="icon" :aria-label="label" aria-haspopup="dialog" :data-kappa-focus-visible="focusVisible">
    <span class="kappa-app-shell__search-label">{{ label }}</span>
    <KbdGroup v-if="shortcutKeys.length" aria-hidden="true">
      <template v-for="(key, index) in shortcutKeys" :key="index">
        <span v-if="index">+</span><Kbd>{{ key }}</Kbd>
      </template>
    </KbdGroup>
  </Button>
</template>
<style src="./app-shell.css"></style>
