export const deleteResourceExamples = [
  {
    id: "simple",
    title: "Simple confirmation",
    description: "Review the resource before deleting it. Initial focus stays on Cancel.",
    code: `<script setup lang="ts">
import { ref } from "vue"
import { Button, DeleteResource } from "@dicehub/kappa"
const open = ref(false)
// Replace this demo handler with your application's deletion request.
const confirm = () => { open.value = false }
<\/script>

<template>
  <DeleteResource
    v-model:open="open"
    resource-name="Pressure probe 04"
    title="Delete measurement?"
    confirm-label="Delete measurement"
    @confirm="confirm"
  >
    <template #trigger><Button variant="destructive-outline">Delete</Button></template>
  </DeleteResource>
</template>`,
  },
  {
    id: "name-confirmation",
    title: "Confirm the resource name",
    description: "Require the exact name for a deletion that affects other members or stored data.",
    code: `<DeleteResource
  v-model:open="open"
  resource-name="Turbine cooling study"
  title="Delete project?"
  confirm-label="Delete project"
  require-name
  @confirm="deleteProject"
>
  <template #trigger><Button variant="destructive-outline">Delete</Button></template>
  <p>The project, its runs, and stored results will be removed for all members.</p>
</DeleteResource>`,
  },
  {
    id: "async",
    title: "Pending request and retry",
    description: "Keep the dialog open until the request succeeds. Failed requests retain the name entry so the user can retry.",
    code: `<script setup lang="ts">
import { ref } from "vue"
import { Button, DeleteResource } from "@dicehub/kappa"

const props = defineProps<{ removeProject: () => Promise<void> }>()
const open = ref(false)
const deleting = ref(false)
const error = ref("")

async function confirm() {
  if (deleting.value) return
  deleting.value = true
  error.value = ""
  try {
    await props.removeProject()
    open.value = false
  } catch {
    error.value = "The request failed. Your project is unchanged. Try again."
  } finally {
    deleting.value = false
  }
}
<\/script>

<template>
  <DeleteResource
    v-model:open="open"
    resource-name="Turbine cooling study"
    require-name
    :deleting="deleting"
    :error="error"
    @confirm="confirm"
    @open-change="error = ''"
  >
    <template #trigger><Button variant="destructive-outline">Delete</Button></template>
  </DeleteResource>
</template>`,
  },
] as const;
