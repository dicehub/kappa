<script setup lang="ts">
import { ref } from "vue";
import { Label } from "@dicehub/kappa/components/label";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@dicehub/kappa/components/native-select";

type DemoVariant =
  | "preview"
  | "basic"
  | "sizes"
  | "groups"
  | "states"
  | "multiple"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const region = ref("eu-central");
const strategy = ref("balanced");
const office = ref("london");
const priority = ref("");
const formats = ref(["pdf", "csv"]);
const arabicRegion = ref("cairo");
</script>

<template>
  <div class="native-select-demo" :data-native-select-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="native-select-demo__field">
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
    </div>

    <NativeSelect
      v-else-if="props.variant === 'basic'"
      v-model="strategy"
      aria-label="Release strategy"
    >
      <NativeSelectOption value="safe">Safe</NativeSelectOption>
      <NativeSelectOption value="balanced">Balanced</NativeSelectOption>
      <NativeSelectOption value="fast">Fast</NativeSelectOption>
    </NativeSelect>

    <div v-else-if="props.variant === 'sizes'" class="native-select-demo__sizes">
      <div>
        <span>xs</span>
        <NativeSelect size="xs" aria-label="Extra-small unit" value="metric">
          <NativeSelectOption value="metric">Metric units</NativeSelectOption>
          <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
        </NativeSelect>
      </div>
      <div>
        <span>sm</span>
        <NativeSelect size="sm" aria-label="Small unit" value="metric">
          <NativeSelectOption value="metric">Metric units</NativeSelectOption>
          <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
        </NativeSelect>
      </div>
      <div>
        <span>base</span>
        <NativeSelect size="base" aria-label="Base unit" value="metric">
          <NativeSelectOption value="metric">Metric units</NativeSelectOption>
          <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
        </NativeSelect>
      </div>
      <div>
        <span>lg</span>
        <NativeSelect size="lg" aria-label="Large unit" value="metric">
          <NativeSelectOption value="metric">Metric units</NativeSelectOption>
          <NativeSelectOption value="imperial">Imperial units</NativeSelectOption>
        </NativeSelect>
      </div>
    </div>

    <div v-else-if="props.variant === 'groups'" class="native-select-demo__field">
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
    </div>

    <div v-else-if="props.variant === 'states'" class="native-select-demo__states">
      <div class="native-select-demo__field">
        <Label for="native-select-disabled" data-disabled>Disabled</Label>
        <NativeSelect id="native-select-disabled" disabled value="archived">
          <NativeSelectOption value="archived">Archived</NativeSelectOption>
        </NativeSelect>
      </div>
      <div class="native-select-demo__field">
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
        <p id="native-select-error" class="native-select-demo__error">
          Select a priority.
        </p>
      </div>
    </div>

    <div v-else-if="props.variant === 'multiple'" class="native-select-demo__field">
      <Label for="native-select-formats">Export formats</Label>
      <NativeSelect id="native-select-formats" v-model="formats" multiple name="formats">
        <NativeSelectOption value="csv">CSV</NativeSelectOption>
        <NativeSelectOption value="json">JSON</NativeSelectOption>
        <NativeSelectOption value="pdf">PDF</NativeSelectOption>
        <NativeSelectOption value="xlsx">Excel</NativeSelectOption>
      </NativeSelect>
      <p>Selected: {{ formats.join(", ") }}</p>
    </div>

    <div v-else class="native-select-demo__field" dir="rtl" lang="ar">
      <Label for="native-select-region-ar">المنطقة</Label>
      <NativeSelect id="native-select-region-ar" v-model="arabicRegion">
        <NativeSelectOption value="cairo">القاهرة</NativeSelectOption>
        <NativeSelectOption value="dubai">دبي</NativeSelectOption>
        <NativeSelectOption value="doha">الدوحة</NativeSelectOption>
      </NativeSelect>
    </div>
  </div>
</template>

<style scoped>
.native-select-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.native-select-demo > :is(
    .native-select-demo__field,
    .native-select-demo__sizes,
    .native-select-demo__states
  ) {
  inline-size: min(100%, 28rem);
}

.native-select-demo__field,
.native-select-demo__states {
  display: grid;
  min-inline-size: 0;
  gap: 0.4375rem;
}

.native-select-demo__field > p {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}

.native-select-demo__sizes {
  display: grid;
  gap: 0.75rem;
}

.native-select-demo__sizes > div {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
}

.native-select-demo__sizes span {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
  text-transform: uppercase;
}

.native-select-demo__states {
  gap: 0.875rem;
}

.native-select-demo__error,
.native-select-demo__field > .native-select-demo__error {
  color: var(--kappa-danger-text, var(--kappa-danger, #b42318));
}
</style>
