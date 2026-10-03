<script setup lang="ts">
import { ref } from "vue";
import { Badge } from "@dicehub/kappa/components/badge";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

type DemoVariant =
  | "preview"
  | "basic"
  | "sizes"
  | "controlled"
  | "states"
  | "file"
  | "inline"
  | "grid"
  | "required"
  | "badge"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const apiKey = ref("");
const email = ref("");
const caseName = ref("Rotor refinement");
const search = ref("");
const firstName = ref("Jordan");
const lastName = ref("Lee");
const workspace = ref("");
const webhook = ref("");
const arabicKey = ref("");
const submittedWorkspace = ref("");

const submitWorkspace = () => {
  submittedWorkspace.value = workspace.value;
};
</script>

<template>
  <div class="input-demo" :data-input-demo="props.variant">
    <div v-if="props.variant === 'preview'" class="input-demo__field">
      <Label for="input-preview-api-key">API key</Label>
      <Input
        id="input-preview-api-key"
        v-model="apiKey"
        name="api-key"
        aria-describedby="input-preview-help"
        autocomplete="off"
        password-manager-ignore
        placeholder="sk-..."
      />
      <p id="input-preview-help">Your API key is encrypted before it is stored.</p>
    </div>

    <Input
      v-else-if="props.variant === 'basic'"
      v-model="email"
      aria-label="Email address"
      autocomplete="email"
      name="email"
      placeholder="name@example.com"
      type="email"
    />

    <div v-else-if="props.variant === 'sizes'" class="input-demo__sizes">
      <div v-for="size in ['xs', 'sm', 'base', 'lg'] as const" :key="size">
        <span>{{ size }}</span>
        <Input :aria-label="`${size} input`" :size="size" :value="`${size} density`" />
      </div>
    </div>

    <div v-else-if="props.variant === 'controlled'" class="input-demo__field">
      <Label for="input-controlled-case">Case name</Label>
      <Input id="input-controlled-case" v-model="caseName" name="case-name" />
      <output class="input-demo__value" for="input-controlled-case">
        Current value: <span>{{ caseName }}</span>
      </output>
    </div>

    <div v-else-if="props.variant === 'states'" class="input-demo__state-grid">
      <div class="input-demo__field">
        <Label for="input-disabled" data-disabled>Disabled</Label>
        <Input id="input-disabled" disabled value="Unavailable" />
      </div>
      <div class="input-demo__field">
        <Label for="input-readonly">Read only</Label>
        <Input id="input-readonly" readonly value="build-2026.08" />
      </div>
      <div class="input-demo__field">
        <Label for="input-invalid">Invalid</Label>
        <Input
          id="input-invalid"
          invalid
          aria-describedby="input-invalid-error"
          value="invalid value"
        />
        <p id="input-invalid-error" class="input-demo__error">Use letters and numbers only.</p>
      </div>
    </div>

    <div v-else-if="props.variant === 'file'" class="input-demo__field">
      <Label for="input-file">Geometry file</Label>
      <Input id="input-file" accept=".step,.stp,.iges,.igs" name="geometry" type="file" />
      <p>STEP and IGES files up to 50 MB.</p>
    </div>

    <div v-else-if="props.variant === 'inline'" class="input-demo__field">
      <Label for="input-search">Search cases</Label>
      <div class="input-demo__inline">
        <Input id="input-search" v-model="search" name="search" placeholder="Search..." type="search" />
        <Button type="button">Search</Button>
      </div>
    </div>

    <div v-else-if="props.variant === 'grid'" class="input-demo__grid">
      <div class="input-demo__field">
        <Label for="input-first-name">First name</Label>
        <Input id="input-first-name" v-model="firstName" autocomplete="given-name" />
      </div>
      <div class="input-demo__field">
        <Label for="input-last-name">Last name</Label>
        <Input id="input-last-name" v-model="lastName" autocomplete="family-name" />
      </div>
    </div>

    <form v-else-if="props.variant === 'required'" class="input-demo__field" @submit.prevent="submitWorkspace">
      <Label for="input-required-workspace">Workspace name <span aria-hidden="true">*</span></Label>
      <Input
        id="input-required-workspace"
        v-model="workspace"
        name="workspace"
        required
        placeholder="Aerodynamics"
      />
      <Button type="submit">Create workspace</Button>
      <p v-if="submittedWorkspace" class="input-demo__status" role="status">
        Created {{ submittedWorkspace }}.
      </p>
    </form>

    <div v-else-if="props.variant === 'badge'" class="input-demo__field">
      <Label for="input-webhook">Webhook URL <Badge variant="beta">Beta</Badge></Label>
      <Input
        id="input-webhook"
        v-model="webhook"
        name="webhook"
        placeholder="https://api.example.com/webhook"
        type="url"
      />
    </div>

    <div v-else class="input-demo__field" dir="rtl" lang="ar">
      <Label for="input-rtl-key">مفتاح API</Label>
      <Input
        id="input-rtl-key"
        v-model="arabicKey"
        aria-describedby="input-rtl-help"
        autocomplete="off"
        placeholder="sk-..."
      />
      <p id="input-rtl-help">يتم تشفير مفتاح API وتخزينه بأمان.</p>
    </div>
  </div>
</template>

<style scoped>
.input-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.input-demo > :is(
    .kappa-input,
    .input-demo__field,
    .input-demo__sizes,
    .input-demo__state-grid,
    .input-demo__grid
  ) {
  inline-size: min(100%, 30rem);
}

.input-demo__field {
  display: grid;
  min-inline-size: 0;
  gap: 0.4375rem;
}

.input-demo__field > p,
.input-demo__value {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}

.input-demo__value span {
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-mono, monospace);
}

.input-demo__sizes,
.input-demo__state-grid {
  display: grid;
  gap: 0.875rem;
}

.input-demo__sizes > div {
  display: grid;
  grid-template-columns: 2.75rem minmax(0, 1fr);
  align-items: center;
  gap: 0.75rem;
}

.input-demo__sizes span {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
  text-transform: uppercase;
}

.input-demo__state-grid {
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

.input-demo__error,
.input-demo__field > .input-demo__error {
  color: var(--kappa-danger-text, var(--kappa-danger, #b42318));
}

.input-demo__inline {
  display: flex;
  min-inline-size: 0;
  align-items: center;
  gap: 0.5rem;
}

.input-demo__inline .kappa-input {
  flex: 1 1 auto;
}

.input-demo__inline .kappa-button {
  block-size: 2.25rem;
  flex: none;
}

.input-demo__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.75rem;
}

.input-demo__field > .kappa-button {
  justify-self: start;
  margin-block-start: 0.125rem;
}

.input-demo__status {
  color: var(--kappa-success-text, #027a48);
}
</style>
