<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";

const props = defineProps<{ project: string }>();
const emit = defineEmits<{ rename: [name: string] }>();
const name = ref(props.project);
const saved = ref(false);
function save() {
  if (!name.value.trim()) return;
  emit("rename", name.value.trim());
  saved.value = true;
}
</script>

<template>
  <p class="paneled-project-pages__intro">Manage the project name used in this workspace. Changes stay in this preview.</p>
  <form class="paneled-project-pages__settings" @submit.prevent="save">
    <Field.Root required><Field.Label>Project name <Field.RequiredIndicator /></Field.Label><Field.Input v-model="name" required @input="saved = false" /><Field.HelperText>Shown in navigation, breadcrumbs, and project pages.</Field.HelperText></Field.Root>
    <Button type="submit" size="sm" :disabled="!name.trim()">Save changes</Button>
    <p v-if="saved" role="status">Project settings saved.</p>
  </form>
</template>
