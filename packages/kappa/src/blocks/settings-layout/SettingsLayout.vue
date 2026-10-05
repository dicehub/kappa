<script setup lang="ts">
import { computed, useSlots } from "vue";
import type { SettingsLayoutProps, SettingsLayoutSlots } from "./settings-layout";

defineOptions({ inheritAttrs: false });
const props = defineProps<SettingsLayoutProps>();
defineSlots<SettingsLayoutSlots>();
const slots = useSlots();
const showsHeader = computed(() => Boolean(props.title || props.description || slots.title || slots.description || slots.actions));
</script>

<template>
  <div v-bind="$attrs" class="kappa-settings-layout" data-slot="settings-layout">
    <div class="kappa-settings-layout__inner">
      <header v-if="showsHeader" class="kappa-settings-layout__header">
        <div class="kappa-settings-layout__identity">
          <h1 v-if="props.title || slots.title" class="kappa-settings-layout__title">
            <slot name="title">{{ props.title }}</slot>
          </h1>
          <div v-if="props.description || slots.description" class="kappa-settings-layout__description">
            <slot name="description">{{ props.description }}</slot>
          </div>
        </div>
        <div v-if="slots.actions" class="kappa-settings-layout__actions"><slot name="actions" /></div>
      </header>
      <div v-if="slots.navigation" class="kappa-settings-layout__navigation" data-slot="settings-navigation">
        <slot name="navigation" />
      </div>
      <div class="kappa-settings-layout__panel" data-slot="settings-panel"><slot /></div>
    </div>
  </div>
</template>

<style src="./settings-layout.css"></style>
