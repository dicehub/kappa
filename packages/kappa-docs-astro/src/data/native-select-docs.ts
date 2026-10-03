export const barrelCode = `import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const region = ref("eu-central");
</script>

<template>
  <Label for="native-select-preview-region">Deployment region</Label>
  <NativeSelect
    id="native-select-preview-region"
    v-model="region"
    name="region"
    aria-describedby="native-select-preview-help"
  >
    <NativeSelectOption value="us-east">US East</NativeSelectOption>
    <NativeSelectOption value="eu-central">EU Central</NativeSelectOption>
    <NativeSelectOption value="ap-southeast">Asia Pacific</NativeSelectOption>
  </NativeSelect>
  <p id="native-select-preview-help">Selected: {{ region }}</p>
</template>`;

export const basicCode = `<script setup>
import { ref } from "vue";
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const strategy = ref("balanced");
</script>

<template>
  <NativeSelect v-model="strategy" aria-label="Release strategy">
    <NativeSelectOption value="safe">Safe</NativeSelectOption>
    <NativeSelectOption value="balanced">Balanced</NativeSelectOption>
    <NativeSelectOption value="fast">Fast</NativeSelectOption>
  </NativeSelect>
</template>`;

export const sizesCode = `<script setup>
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";
</script>

<template>
  <NativeSelect size="xs" aria-label="Extra-small unit" value="metric">
    <NativeSelectOption value="metric">Metric units</NativeSelectOption>
    <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
  </NativeSelect>
  <NativeSelect size="sm" aria-label="Small unit" value="metric">
    <NativeSelectOption value="metric">Metric units</NativeSelectOption>
    <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
  </NativeSelect>
  <NativeSelect size="base" aria-label="Base unit" value="metric">
    <NativeSelectOption value="metric">Metric units</NativeSelectOption>
    <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
  </NativeSelect>
  <NativeSelect size="lg" aria-label="Large unit" value="metric">
    <NativeSelectOption value="metric">Metric units</NativeSelectOption>
    <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
  </NativeSelect>
</template>`;

export const groupsCode = `<script setup>
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const office = ref("london");
</script>

<template>
  <Label for="native-select-office">Office</Label>
  <NativeSelect id="native-select-office" v-model="office">
    <NativeSelectOptGroup label="Europe">
      <NativeSelectOption value="berlin">Berlin</NativeSelectOption>
      <NativeSelectOption value="london">London</NativeSelectOption>
    </NativeSelectOptGroup>
    <NativeSelectOptGroup label="Asia Pacific">
      <NativeSelectOption value="singapore">Singapore</NativeSelectOption>
      <NativeSelectOption value="sydney">Sydney</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
</template>`;

export const statesCode = `<script setup>
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const priority = ref("");
</script>

<template>
  <Label for="native-select-disabled" data-disabled>Disabled</Label>
  <NativeSelect id="native-select-disabled" disabled value="archived">
    <NativeSelectOption value="archived">Archived</NativeSelectOption>
  </NativeSelect>

  <Label for="native-select-invalid">Priority</Label>
  <NativeSelect
    id="native-select-invalid"
    v-model="priority"
    invalid
    required
    aria-describedby="native-select-error"
  >
    <NativeSelectOption value="" disabled>Select a priority</NativeSelectOption>
    <NativeSelectOption value="normal">Normal</NativeSelectOption>
    <NativeSelectOption value="urgent">Urgent</NativeSelectOption>
  </NativeSelect>
  <p id="native-select-error">Select a priority.</p>
</template>`;

export const multipleCode = `<script setup>
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const formats = ref(["pdf", "csv"]);
</script>

<template>
  <Label for="native-select-formats">Export formats</Label>
  <NativeSelect id="native-select-formats" v-model="formats" multiple name="formats">
    <NativeSelectOption value="csv">CSV</NativeSelectOption>
    <NativeSelectOption value="json">JSON</NativeSelectOption>
    <NativeSelectOption value="pdf">PDF</NativeSelectOption>
    <NativeSelectOption value="xlsx">Excel</NativeSelectOption>
  </NativeSelect>
  <p>Selected: {{ formats.join(", ") }}</p>
</template>`;

export const rtlCode = `<script setup>
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

const region = ref("cairo");
</script>

<template>
  <div dir="rtl" lang="ar">
    <Label for="native-select-region-ar">المنطقة</Label>
    <NativeSelect id="native-select-region-ar" v-model="region">
      <NativeSelectOption value="cairo">القاهرة</NativeSelectOption>
      <NativeSelectOption value="dubai">دبي</NativeSelectOption>
      <NativeSelectOption value="doha">الدوحة</NativeSelectOption>
    </NativeSelect>
  </div>
</template>`;

export const nativeSelectProps = [
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Sets invalid presentation and aria-invalid=true.",
  },
  {
    name: "modelValue",
    type: "string | number | readonly (string | number)[]",
    defaultValue: "—",
    description: "Controlled value used by Vue v-model. Multiple selects use an array.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets visual density. This replaces the native visible-row size attribute.",
  },
] as const;

export const events = [
  {
    name: "update:modelValue",
    payload: "string | string[]",
    description: "Emitted on native change. Multiple selects emit selected values as an array.",
  },
  {
    name: "change / input",
    payload: "Event",
    description: "Native listeners pass through to the select element.",
  },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"native-select"', description: "Stable control selector." },
  { name: "data-size", value: '"xs" | "sm" | "base" | "lg"', description: "Resolved density." },
  { name: "data-invalid", value: '""', description: "Present when the control is invalid." },
] as const;

export const exportsList = [
  { name: "NativeSelect", description: "Styled native select root with compound aliases." },
  { name: "NativeSelectRoot", description: "Explicit root alias." },
  { name: "NativeSelectOption", description: "Native option part." },
  { name: "NativeSelectOptGroup", description: "Native option-group part." },
  { name: "NativeSelectProps / NativeSelectEmits", description: "Public prop and event contracts." },
  { name: "NativeSelectModelValue / NativeSelectSize", description: "Value and density types." },
] as const;
