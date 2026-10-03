<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { DeleteResource } from "@dicehub/kappa/blocks/delete-resource";
import { Button } from "@dicehub/kappa/components/button";

const props = defineProps<{ variant: "simple" | "name-confirmation" | "async" }>();
const open = ref(false);
const deleting = ref(false);
const error = ref("");
const result = ref("");
const attempts = ref(0);
const name = computed(() => props.variant === "simple" ? "Pressure probe 04" : "Turbine cooling study");
let pending: ReturnType<typeof setTimeout> | undefined;

function onOpenChange(details: { open: boolean }) {
  if (details.open) {
    error.value = "";
    result.value = "";
    attempts.value = 0;
  }
}

function confirm() {
  if (deleting.value) return;
  if (props.variant !== "async") {
    open.value = false;
    result.value = "Deletion confirmed. This demo does not remove data.";
    return;
  }
  deleting.value = true;
  error.value = "";
  attempts.value += 1;
  pending = setTimeout(() => {
    deleting.value = false;
    if (attempts.value === 1) {
      error.value = "The request failed. Your project is unchanged. Try again.";
    } else {
      open.value = false;
      result.value = "Deletion confirmed. This demo does not remove data.";
    }
  }, 1800);
}

onBeforeUnmount(() => clearTimeout(pending));
</script>

<template>
  <div class="delete-resource-demo" :data-delete-resource-demo="props.variant">
    <div class="delete-resource-demo__row">
      <div class="delete-resource-demo__identity">
        <strong>{{ name }}</strong>
        <span>{{ props.variant === "simple" ? "Saved measurement · Updated today" : "Project · 3 runs · 1.2 GB" }}</span>
      </div>
      <DeleteResource
        v-model:open="open"
        :resource-name="name"
        :require-name="props.variant !== 'simple'"
        :deleting="deleting"
        :error="error"
        :title="props.variant === 'simple' ? 'Delete measurement?' : 'Delete project?'"
        :confirm-label="props.variant === 'simple' ? 'Delete measurement' : 'Delete project'"
        :data-delete-resource-surface="props.variant"
        @confirm="confirm"
        @open-change="onOpenChange"
      >
        <template #trigger><Button variant="destructive-outline" size="sm">Delete</Button></template>
        <template v-if="props.variant !== 'simple'" #default>
          <p>The project, its runs, and stored results will be removed for all members.</p>
        </template>
      </DeleteResource>
    </div>
    <p class="delete-resource-demo__note" role="status">{{ result || (props.variant === "async" ? "The first request fails. Try again to complete the demo." : "Demo only. No resources are removed.") }}</p>
  </div>
</template>

<style scoped>
.delete-resource-demo { inline-size: 100%; max-inline-size: 38rem; }
.delete-resource-demo__row { display: flex; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid var(--kappa-line); border-radius: 0.25rem; background: var(--kappa-control); }
.delete-resource-demo__identity { display: grid; flex: 1; gap: 0.25rem; min-inline-size: 0; font-size: 0.875rem; line-height: 1.4; }
.delete-resource-demo__identity strong { color: var(--kappa-strong); font-weight: 500; overflow-wrap: anywhere; }
.delete-resource-demo__identity span, .delete-resource-demo__note { color: var(--kappa-subtle); font-size: 0.75rem; }
.delete-resource-demo__note { margin: 0.75rem 0 0; line-height: 1.5; }
@media (max-width: 26rem) { .delete-resource-demo__row { align-items: start; flex-direction: column; } }
</style>
