<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { Banner } from "../../components/banner";
import { DialogLayout } from "../../components/dialog-layout";
import { Input } from "../../components/input";
import type { DialogOpenChangeDetails } from "../../components/dialog/dialog";
import {
  DELETE_RESOURCE_DEFAULTS,
  type DeleteResourceEmits,
  type DeleteResourceProps,
  type DeleteResourceSlots,
} from "./delete-resource";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DeleteResourceProps>(), {
  ...DELETE_RESOURCE_DEFAULTS,
  open: undefined,
  defaultOpen: false,
  requireName: false,
  deleting: false,
  disabled: false,
  error: undefined,
  finalFocusEl: undefined,
});
const emit = defineEmits<DeleteResourceEmits>();
defineSlots<DeleteResourceSlots>();

const inputId = `kappa-delete-resource-${useId()}`;
const resourceId = `${inputId}-name`;
const internalOpen = ref(props.defaultOpen);
const confirmation = ref("");
const formEl = ref<HTMLFormElement | null>(null);
const isOpen = computed(() => props.open ?? internalOpen.value);
const canConfirm = computed(() => !props.disabled && !props.deleting && (
  !props.requireName || (
    props.resourceName.length > 0 && confirmation.value === props.resourceName
  )
));

// Each opening and each new resource requires a fresh, explicit confirmation.
watch([isOpen, () => props.resourceName, () => props.requireName], () => {
  confirmation.value = "";
});

function onOpenChange(details: DialogOpenChangeDetails) {
  if (!details.open && props.deleting) return;
  internalOpen.value = details.open;
  emit("update:open", details.open);
  emit("openChange", details);
}

function initialFocusEl() {
  if (props.requireName) return formEl.value?.ownerDocument.getElementById(inputId) ?? null;
  return formEl.value?.querySelector<HTMLElement>(
    '[data-slot="dialog-layout-actions"] button:not(:disabled)',
  ) ?? null;
}

function confirm() {
  if (canConfirm.value) emit("confirm");
}
</script>

<template>
  <DialogLayout.Alert
    :open="isOpen"
    :close-on-escape="!props.deleting"
    :disable-pointer-dismissal="true"
    :initial-focus-el="initialFocusEl"
    :final-focus-el="props.finalFocusEl"
    @open-change="onOpenChange"
  >
    <DialogLayout.Trigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogLayout.Trigger>
    <DialogLayout.Content
      v-bind="$attrs"
      class="kappa-delete-resource"
      data-slot="delete-resource"
      :aria-busy="props.deleting || undefined"
      :show-close-button="false"
      size="sm"
    >
      <DialogLayout.Header>
        <DialogLayout.Title>{{ props.title }}</DialogLayout.Title>
        <DialogLayout.Description>{{ props.description }}</DialogLayout.Description>
      </DialogLayout.Header>
      <form ref="formEl" class="kappa-delete-resource__form" @submit.prevent="confirm">
        <DialogLayout.Body class="kappa-delete-resource__body">
          <p :id="resourceId" class="kappa-delete-resource__name">{{ props.resourceName }}</p>
          <div v-if="$slots.default" class="kappa-delete-resource__details"><slot /></div>
          <div v-if="props.requireName" class="kappa-delete-resource__confirmation">
            <label :for="inputId">{{ props.confirmationLabel }}</label>
            <Input
              :id="inputId"
              v-model="confirmation"
              :aria-describedby="resourceId"
              :readonly="props.deleting"
              :password-manager-ignore="true"
              autocomplete="off"
              autocapitalize="none"
              :spellcheck="false"
            />
          </div>
          <Banner v-if="props.error" role="alert" variant="error" size="sm">
            {{ props.error }}
          </Banner>
        </DialogLayout.Body>
        <DialogLayout.Actions
          :dismiss-label="props.cancelLabel"
          :dismiss-disabled="props.deleting"
        >
          <DialogLayout.Actions.Primary
            type="submit"
            variant="destructive"
            :disabled="!canConfirm"
            :loading="props.deleting"
          >
            {{ props.deleting ? props.deletingLabel : props.confirmLabel }}
          </DialogLayout.Actions.Primary>
        </DialogLayout.Actions>
      </form>
    </DialogLayout.Content>
  </DialogLayout.Alert>
</template>

<style src="./delete-resource.css"></style>
