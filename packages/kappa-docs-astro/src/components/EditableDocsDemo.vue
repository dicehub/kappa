<script setup lang="ts">
import { ref } from "vue";
import { Editable, EDITABLE_SIZES } from "@dicehub/kappa/components/editable";

type DemoVariant =
  | "preview"
  | "basic"
  | "controls"
  | "controlled"
  | "states"
  | "sizes"
  | "textarea";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const projectName = ref("Ocean current study");
const committedName = ref(projectName.value);
</script>

<template>
  <div class="editable-demo" :data-editable-demo="props.variant">
    <Editable.Root
      v-if="props.variant === 'preview'"
      id="project-name-editor"
      default-value="Ocean current study"
      activation-mode="click"
    >
      <Editable.Label>Project name</Editable.Label>
      <Editable.Area>
        <Editable.Input aria-label="Project name" />
        <Editable.Preview />
      </Editable.Area>
      <Editable.Control>
        <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
        <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
        <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>

    <Editable.Root
      v-else-if="props.variant === 'basic'"
      id="section-name-editor"
      default-value="Boundary conditions"
      activation-mode="click"
    >
      <Editable.Label>Section name</Editable.Label>
      <Editable.Area>
        <Editable.Input aria-label="Section name" />
        <Editable.Preview />
      </Editable.Area>
    </Editable.Root>

    <Editable.Root
      v-else-if="props.variant === 'controls'"
      id="task-name-editor"
      default-value="Mesh review"
      activation-mode="click"
      submit-mode="none"
    >
      <Editable.Label>Task name</Editable.Label>
      <Editable.Area>
        <Editable.Input aria-label="Task name" />
        <Editable.Preview />
      </Editable.Area>
      <Editable.Control>
        <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
        <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
        <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>

    <div v-else-if="props.variant === 'controlled'" class="editable-demo__stack">
      <Editable.Root
        id="controlled-project-name-editor"
        v-model="projectName"
        activation-mode="click"
        @value-commit="committedName = $event.value"
      >
        <Editable.Label>Project name</Editable.Label>
        <Editable.Area>
          <Editable.Input aria-label="Project name" />
          <Editable.Preview />
        </Editable.Area>
      </Editable.Root>
      <output aria-live="polite">Saved value: {{ committedName }}</output>
    </div>

    <div v-else-if="props.variant === 'states'" class="editable-demo__stack">
      <Editable.Root id="disabled-project-editor" default-value="Archived project" disabled>
        <Editable.Label>Disabled</Editable.Label>
        <Editable.Area><Editable.Input aria-label="Disabled" /><Editable.Preview /></Editable.Area>
      </Editable.Root>
      <Editable.Root id="readonly-run-editor" default-value="Run 4189" read-only>
        <Editable.Label>Read only</Editable.Label>
        <Editable.Area><Editable.Input aria-label="Read only" /><Editable.Preview /></Editable.Area>
      </Editable.Root>
      <Editable.Root
        id="invalid-project-editor"
        default-value="Untitled"
        invalid
        activation-mode="click"
      >
        <Editable.Label>Invalid</Editable.Label>
        <Editable.Area><Editable.Input aria-label="Invalid" /><Editable.Preview /></Editable.Area>
      </Editable.Root>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="editable-demo__stack">
      <Editable.Root
        v-for="size in EDITABLE_SIZES"
        :id="`size-${size}-editor`"
        :key="size"
        :size="size"
        default-value="Surface refinement"
        activation-mode="click"
      >
        <Editable.Label>{{ size }}</Editable.Label>
        <Editable.Area>
          <Editable.Input :aria-label="`${size} editable field`" />
          <Editable.Preview />
        </Editable.Area>
      </Editable.Root>
    </div>

    <Editable.Root
      v-else
      id="review-note-editor"
      default-value="Review the inlet values before the next solver run."
      activation-mode="click"
      submit-mode="none"
    >
      <Editable.Label>Review note</Editable.Label>
      <Editable.Area>
        <Editable.Input as-child aria-label="Review note">
          <textarea rows="3" />
        </Editable.Input>
        <Editable.Preview />
      </Editable.Area>
      <Editable.Control>
        <Editable.EditTrigger aria-label="Edit">Edit</Editable.EditTrigger>
        <Editable.SubmitTrigger aria-label="Save">Save</Editable.SubmitTrigger>
        <Editable.CancelTrigger aria-label="Cancel">Cancel</Editable.CancelTrigger>
      </Editable.Control>
    </Editable.Root>
  </div>
</template>

<style scoped>
.editable-demo {
  display: grid;
  inline-size: min(100%, 28rem);
  min-inline-size: 0;
  place-items: center;
  color: var(--kappa-default);
  font-family: var(--kappa-font-sans);
}

.editable-demo > .kappa-editable,
.editable-demo__stack {
  inline-size: 100%;
}

.editable-demo__stack {
  display: grid;
  gap: 1rem;
}

.editable-demo[data-editable-demo="sizes"] {
  inline-size: min(100%, 12rem);
}

.editable-demo output {
  color: var(--kappa-subtle);
  font-family: var(--kappa-font-mono);
  font-size: 0.75rem;
}

.editable-demo textarea.kappa-editable__input {
  min-block-size: 5rem;
  padding-block: 0.5rem;
  line-height: 1.4;
  resize: vertical;
}

.editable-demo textarea + .kappa-editable__preview {
  min-block-size: 5rem;
  padding-block: 0.5rem;
  line-height: 1.4;
  white-space: normal;
}

</style>
