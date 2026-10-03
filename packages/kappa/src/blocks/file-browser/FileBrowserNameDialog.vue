<script setup lang="ts">
import { ref, useId } from "vue";
import { Button } from "../../components/button";
import { DialogLayout } from "../../components/dialog-layout";
import { Input } from "../../components/input";
import type { FileBrowserLabels } from "./file-browser";

defineProps<{ open: boolean; mode: "create" | "rename"; name: string; error: string; busy: boolean; disabled: boolean; labels: FileBrowserLabels; finalFocusEl: () => HTMLElement | null }>();
const emit = defineEmits<{ "update:name": [value: string]; close: []; submit: [] }>();
const inputId = `kappa-file-browser-name-${useId()}`;
const form = ref<HTMLFormElement | null>(null);
const initialFocusEl = () => form.value?.querySelector<HTMLElement>("input") ?? null;
</script>
<template>
  <DialogLayout.Root :open="open" :initial-focus-el="initialFocusEl" :final-focus-el="finalFocusEl" :close-on-escape="!busy" :close-on-interact-outside="!busy" @update:open="value => { if (!value) emit('close'); }">
    <DialogLayout.Content class="kappa-file-browser__dialog" size="sm" :show-close-button="false" :aria-busy="busy || undefined">
      <DialogLayout.Header>
        <DialogLayout.Title>{{ mode === 'create' ? labels.newFolder : labels.rename }}</DialogLayout.Title>
        <DialogLayout.Description>{{ mode === 'create' ? labels.createDescription : labels.renameDescription }}</DialogLayout.Description>
      </DialogLayout.Header>
      <form ref="form" @submit.prevent="emit('submit')">
        <DialogLayout.Body class="kappa-file-browser__name-field">
          <label :for="inputId">{{ labels.name }}</label>
          <Input :id="inputId" :model-value="name" :invalid="Boolean(error)" :aria-describedby="error ? `${inputId}-error` : undefined" :readonly="busy" :disabled="disabled" autocomplete="off" :spellcheck="false" @update:model-value="emit('update:name', $event)" />
          <p v-if="error" :id="`${inputId}-error`" class="kappa-file-browser__form-error" role="alert">{{ error }}</p>
        </DialogLayout.Body>
        <DialogLayout.Actions :dismiss-label="labels.cancel" :dismiss-disabled="busy">
          <Button type="submit" size="sm" :loading="busy" :disabled="disabled || busy || !name.trim()">{{ mode === 'create' ? labels.create : labels.save }}</Button>
        </DialogLayout.Actions>
      </form>
    </DialogLayout.Content>
  </DialogLayout.Root>
</template>
