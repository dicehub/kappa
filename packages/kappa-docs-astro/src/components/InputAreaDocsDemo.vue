<script setup lang="ts">
import { computed, ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Field } from "@dicehub/kappa/components/field";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

type DemoVariant =
  | "preview"
  | "basic"
  | "field"
  | "sizes"
  | "controlled"
  | "autoresize"
  | "states"
  | "limit"
  | "action"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const description = ref("");
const message = ref("");
const simulationNotes = ref("");
const reviewNotes = ref("Review the boundary conditions.");
const solverLog = ref("Initial residual: 2.1e-05");
const releaseSummary = ref("");
const feedback = ref("");
const arabicNotes = ref("");
const submittedFeedback = ref("");
const remaining = computed(() => 180 - releaseSummary.value.length);

const sendFeedback = () => {
  submittedFeedback.value = feedback.value;
};
</script>

<template>
  <div class="input-area-demo" :data-input-area-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="input-area-demo__field">
      <Label for="input-area-preview-description">Project description</Label>
      <InputArea
        id="input-area-preview-description"
        v-model="description"
        aria-describedby="input-area-preview-help"
        name="description"
        placeholder="Describe the goals and constraints..."
        rows="4"
      />
      <p id="input-area-preview-help">Keep the summary concise and actionable.</p>
    </div>

    <InputArea
      v-else-if="props.variant === 'basic'"
      v-model="message"
      aria-label="Message"
      name="message"
      placeholder="Write a message..."
      rows="3"
    />

    <Field
      v-else-if="props.variant === 'field'"
      id="input-area-field-notes"
      required
    >
      <Field.Label>
        Simulation notes
        <Field.RequiredIndicator />
      </Field.Label>
      <InputArea v-model="simulationNotes" name="simulation-notes" rows="3" />
      <Field.HelperText>Record assumptions that affect the result.</Field.HelperText>
    </Field>

    <div v-else-if="props.variant === 'sizes'" class="input-area-demo__sizes">
      <div v-for="size in ['xs', 'sm', 'base', 'lg'] as const" :key="size">
        <span>{{ size }}</span>
        <InputArea
          :aria-label="`${size} notes`"
          :model-value="`${size} density`"
          :size="size"
        />
      </div>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="input-area-demo__field">
      <Label for="input-area-controlled-notes">Review notes</Label>
      <InputArea
        id="input-area-controlled-notes"
        v-model="reviewNotes"
        rows="3"
      />
      <output class="input-area-demo__value" for="input-area-controlled-notes">
        {{ reviewNotes.length }} characters
      </output>
    </div>

    <div v-else-if="props.variant === 'autoresize'" class="input-area-demo__field">
      <Label for="input-area-solver-log">Solver log</Label>
      <InputArea
        id="input-area-solver-log"
        v-model="solverLog"
        autoresize
        rows="2"
      />
      <p>Add lines to grow the control. Manual resizing is disabled in this mode.</p>
    </div>

    <div v-else-if="props.variant === 'states'" class="input-area-demo__states">
      <div class="input-area-demo__field">
        <Label for="input-area-disabled" data-disabled>Disabled</Label>
        <InputArea
          id="input-area-disabled"
          disabled
          model-value="Editing is unavailable."
        />
      </div>
      <div class="input-area-demo__field">
        <Label for="input-area-readonly">Read only</Label>
        <InputArea
          id="input-area-readonly"
          readonly
          model-value="Approved for release."
        />
      </div>
      <div class="input-area-demo__field">
        <Label for="input-area-invalid">Invalid</Label>
        <InputArea
          id="input-area-invalid"
          invalid
          aria-describedby="input-area-invalid-error"
          model-value="Too short"
        />
        <p id="input-area-invalid-error" class="input-area-demo__error">
          Add at least 20 characters.
        </p>
      </div>
    </div>

    <div v-else-if="props.variant === 'limit'" class="input-area-demo__field">
      <Label for="input-area-release-summary">Release summary</Label>
      <InputArea
        id="input-area-release-summary"
        v-model="releaseSummary"
        maxlength="180"
        rows="3"
      />
      <output
        class="input-area-demo__counter"
        for="input-area-release-summary"
        aria-live="polite"
      >
        {{ remaining }} remaining
      </output>
    </div>

    <form
      v-else-if="props.variant === 'action'"
      class="input-area-demo__field"
      @submit.prevent="sendFeedback"
    >
      <Label for="input-area-feedback">Feedback</Label>
      <InputArea
        id="input-area-feedback"
        v-model="feedback"
        name="feedback"
        required
        rows="3"
      />
      <Button type="submit">Send feedback</Button>
      <p v-if="submittedFeedback" class="input-area-demo__status" role="status">
        Feedback sent.
      </p>
    </form>

    <div v-else class="input-area-demo__field" dir="rtl" lang="ar">
      <Label for="input-area-arabic-notes">ملاحظات</Label>
      <InputArea
        id="input-area-arabic-notes"
        v-model="arabicNotes"
        aria-describedby="input-area-arabic-help"
        placeholder="اكتب ملاحظاتك..."
        rows="3"
      />
      <p id="input-area-arabic-help">أضف التفاصيل المهمة للمراجعة.</p>
    </div>
  </div>
</template>

<style scoped>
.input-area-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.input-area-demo > :is(
    .kappa-input-area,
    .kappa-field,
    .input-area-demo__field,
    .input-area-demo__sizes,
    .input-area-demo__states
  ) {
  inline-size: min(100%, 32rem);
}

.input-area-demo__field {
  display: grid;
  min-inline-size: 0;
  gap: 0.4375rem;
}

.input-area-demo__field > p,
.input-area-demo__value,
.input-area-demo__counter {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}

.input-area-demo__sizes,
.input-area-demo__states {
  display: grid;
  gap: 0.875rem;
}

.input-area-demo__sizes > div {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
}

.input-area-demo__sizes span {
  padding-block-start: 0.375rem;
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
  text-transform: uppercase;
}

.input-area-demo__error,
.input-area-demo__field > .input-area-demo__error {
  color: var(--kappa-danger-text, var(--kappa-danger, #b42318));
}

.input-area-demo__counter {
  justify-self: end;
  font-family: var(--kappa-font-mono, monospace);
}

.input-area-demo__field > .kappa-button {
  justify-self: start;
  margin-block-start: 0.125rem;
}

.input-area-demo__status {
  color: var(--kappa-success-text, #027a48);
}
</style>
