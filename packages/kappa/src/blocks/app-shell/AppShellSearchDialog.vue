<script setup lang="ts">
import { CommandPalette } from "../../components/command-palette";
defineProps<{ open: boolean }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();
</script>
<template><CommandPalette.Dialog :open="open" class="kappa-app-shell__search-dialog" @update:open="emit('update:open', $event)"><slot /></CommandPalette.Dialog></template>
<style src="./app-shell-search.css"></style>
