export const barrelCode = `import { InputArea } from "@dicehub/kappa";`;

export const granularCode = `import { InputArea } from "@dicehub/kappa/components/input-area";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

const description = ref("");
</script>

<template>
  <Label for="project-description">Project description</Label>
  <InputArea
    id="project-description"
    v-model="description"
    aria-describedby="project-description-help"
    placeholder="Describe the goals and constraints..."
    rows="4"
  />
  <p id="project-description-help">Keep the summary concise and actionable.</p>
</template>`;

export const basicCode = `<script setup>
import { ref } from "vue";
import { InputArea } from "@dicehub/kappa/components/input-area";

const message = ref("");
</script>

<template>
  <InputArea
    v-model="message"
    aria-label="Message"
    placeholder="Write a message..."
    rows="3"
  />
</template>`;

export const fieldCode = `<script setup>
import { ref } from "vue";
import { Field } from "@dicehub/kappa/components/field";
import { InputArea } from "@dicehub/kappa/components/input-area";

const notes = ref("");
</script>

<template>
  <Field id="simulation-notes" required>
    <Field.Label>
      Simulation notes
      <Field.RequiredIndicator />
    </Field.Label>
    <InputArea v-model="notes" rows="3" />
    <Field.HelperText>Record assumptions that affect the result.</Field.HelperText>
  </Field>
</template>`;

export const sizesCode = `<script setup>
import { InputArea } from "@dicehub/kappa/components/input-area";
</script>

<template>
  <InputArea size="xs" aria-label="Extra-small notes" value="Compact note" />
  <InputArea size="sm" aria-label="Small notes" value="Small note" />
  <InputArea size="base" aria-label="Base notes" value="Base note" />
  <InputArea size="lg" aria-label="Large notes" value="Large note" />
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

const notes = ref("Review the boundary conditions.");
</script>

<template>
  <Label for="controlled-notes">Review notes</Label>
  <InputArea id="controlled-notes" v-model="notes" rows="3" />
  <output for="controlled-notes">{{ notes.length }} characters</output>
</template>`;

export const autoresizeCode = `<script setup>
import { ref } from "vue";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

const log = ref("Initial residual: 2.1e-05");
</script>

<template>
  <Label for="solver-log">Solver log</Label>
  <InputArea id="solver-log" v-model="log" autoresize rows="2" />
</template>`;

export const statesCode = `<script setup>
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
  <Label for="disabled-notes" data-disabled>Disabled</Label>
  <InputArea id="disabled-notes" disabled value="Editing is unavailable." />

  <Label for="readonly-notes">Read only</Label>
  <InputArea id="readonly-notes" readonly value="Approved for release." />

  <Label for="invalid-notes">Invalid</Label>
  <InputArea
    id="invalid-notes"
    invalid
    aria-describedby="invalid-notes-error"
    value="Too short"
  />
  <p id="invalid-notes-error">Add at least 20 characters.</p>
</template>`;

export const limitCode = `<script setup>
import { computed, ref } from "vue";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

const summary = ref("");
const remaining = computed(() => 180 - summary.value.length);
</script>

<template>
  <Label for="release-summary">Release summary</Label>
  <InputArea id="release-summary" v-model="summary" maxlength="180" rows="3" />
  <output for="release-summary" aria-live="polite">{{ remaining }} remaining</output>
</template>`;

export const actionCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";

const feedback = ref("");
const send = () => {};
</script>

<template>
  <form @submit.prevent="send">
    <Label for="feedback">Feedback</Label>
    <InputArea id="feedback" v-model="feedback" required rows="3" />
    <Button type="submit">Send feedback</Button>
  </form>
</template>`;

export const rtlCode = `<script setup>
import { InputArea } from "@dicehub/kappa/components/input-area";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
  <div dir="rtl" lang="ar">
    <Label for="arabic-notes">ملاحظات</Label>
    <InputArea
      id="arabic-notes"
      aria-describedby="arabic-notes-help"
      placeholder="اكتب ملاحظاتك..."
      rows="3"
    />
    <p id="arabic-notes-help">أضف التفاصيل المهمة للمراجعة.</p>
  </div>
</template>`;

export const inputAreaProps = [
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges behavior and styling onto one child element through Ark UI.",
  },
  {
    name: "autoresize",
    type: "boolean",
    defaultValue: "false",
    description: "Uses Ark UI automatic height measurement and disables manual resizing.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Sets invalid presentation and aria-invalid=true.",
  },
  {
    name: "modelValue",
    type: "string | number",
    defaultValue: "—",
    description: "Controlled value used by Vue v-model. Updates emit strings.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets padding, radius, text size, and minimum height.",
  },
  {
    name: "$attrs",
    type: "TextareaHTMLAttributes",
    defaultValue: "—",
    description: "Native attributes such as rows, maxlength, required, readonly, and name.",
  },
] as const;

export const events = [
  {
    name: "update:modelValue",
    payload: "string",
    description: "Emitted on native input events for Vue v-model.",
  },
  {
    name: "input / change",
    payload: "Event",
    description: "Native listeners pass through to the textarea element.",
  },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"input-area"', description: "Stable root-part selector." },
  {
    name: "data-size",
    value: '"xs" | "sm" | "base" | "lg"',
    description: "Resolved density.",
  },
  { name: "data-autoresize", value: '""', description: "Present when Ark autoresize is active." },
  { name: "data-invalid", value: '""', description: "Present for invalid prop or ARIA state." },
] as const;

export const exportsList = [
  { name: "InputArea", description: "Styled Ark UI textarea control." },
  {
    name: "InputAreaProps / InputAreaEmits / InputAreaSlots",
    description: "Public textarea prop, event, and slot contracts.",
  },
  {
    name: "InputAreaModelValue / InputAreaSize",
    description: "Controlled-value and density types.",
  },
  { name: "INPUT_AREA_SIZES", description: "Supported density values." },
  { name: "INPUT_AREA_DEFAULT_SIZE", description: "Default base density." },
  { name: "isInputAreaSize", description: "Supported-size type guard." },
  { name: "resolveInputAreaSize", description: "Safe size resolver with base fallback." },
] as const;
