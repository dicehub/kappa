export const barrelCode = `import { Input } from "@dicehub/kappa";`;

export const granularCode = `import { Input } from "@dicehub/kappa/components/input";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

const apiKey = ref("");
</script>

<template>
  <Label for="api-key">API key</Label>
  <Input
    id="api-key"
    v-model="apiKey"
    aria-describedby="api-key-help"
    autocomplete="off"
    password-manager-ignore
    placeholder="sk-..."
  />
  <p id="api-key-help">Your API key is encrypted before it is stored.</p>
</template>`;

export const basicCode = `<script setup>
import { ref } from "vue";
import { Input } from "@dicehub/kappa/components/input";

const email = ref("");
</script>

<template>
  <Input
    v-model="email"
    aria-label="Email address"
    autocomplete="email"
    placeholder="name@example.com"
    type="email"
  />
</template>`;

export const sizesCode = `<script setup>
import { Input } from "@dicehub/kappa/components/input";
</script>

<template>
<Input size="xs" aria-label="Extra-small input" value="xs density" />
<Input size="sm" aria-label="Small input" value="sm density" />
<Input size="base" aria-label="Base input" value="base density" />
<Input size="lg" aria-label="Large input" value="lg density" />
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

const caseName = ref("Rotor refinement");
</script>

<template>
  <Label for="case-name">Case name</Label>
  <Input id="case-name" v-model="caseName" />
  <output for="case-name">Current value: {{ caseName }}</output>
</template>`;

export const statesCode = `<script setup>
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<Label for="disabled-input" data-disabled>Disabled</Label>
<Input id="disabled-input" value="Unavailable" disabled />

<Label for="readonly-input">Read only</Label>
<Input id="readonly-input" value="build-2026.08" readonly />

<Label for="invalid-input">Invalid</Label>
<Input
  id="invalid-input"
  value="invalid value"
  invalid
  aria-describedby="invalid-input-error"
/>
<p id="invalid-input-error">Use letters and numbers only.</p>
</template>`;

export const fileCode = `<script setup>
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<Label for="geometry-file">Geometry file</Label>
<Input
  id="geometry-file"
  name="geometry"
  type="file"
  accept=".step,.stp,.iges,.igs"
/>
<p>STEP and IGES files up to 50 MB.</p>
</template>`;

export const inlineCode = `<script setup>
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<Label for="case-search">Search cases</Label>
<div class="inline-search">
  <Input id="case-search" name="search" type="search" placeholder="Search..." />
  <Button type="button">Search</Button>
</div>
</template>`;

export const gridCode = `<script setup>
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<div class="name-grid">
  <div>
    <Label for="first-name">First name</Label>
    <Input id="first-name" autocomplete="given-name" value="Jordan" />
  </div>
  <div>
    <Label for="last-name">Last name</Label>
    <Input id="last-name" autocomplete="family-name" value="Lee" />
  </div>
</div>
</template>`;

export const requiredCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";

const workspace = ref("");
const createWorkspace = () => {};
</script>

<template>
<form @submit.prevent="createWorkspace">
  <Label for="workspace">Workspace name <span aria-hidden="true">*</span></Label>
  <Input id="workspace" v-model="workspace" name="workspace" required />
  <Button type="submit">Create workspace</Button>
</form>
</template>`;

export const badgeCode = `<script setup>
import { Badge } from "@dicehub/kappa/components/badge";
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<Label for="webhook-url">
  Webhook URL
  <Badge variant="beta">Beta</Badge>
</Label>
<Input id="webhook-url" type="url" placeholder="https://api.example.com/webhook" />
</template>`;

export const rtlCode = `<script setup>
import { Input } from "@dicehub/kappa/components/input";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
<div dir="rtl" lang="ar">
  <Label for="api-key-ar">مفتاح API</Label>
  <Input id="api-key-ar" aria-describedby="api-key-ar-help" placeholder="sk-..." />
  <p id="api-key-ar-help">يتم تشفير مفتاح API وتخزينه بأمان.</p>
</div>
</template>`;

export const inputProps = [
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
    description: "Controlled value used by Vue v-model. Input updates emit strings.",
  },
  {
    name: "passwordManagerIgnore",
    type: "boolean",
    defaultValue: "false",
    description: "Adds common password-manager suppression attributes for non-credential fields.",
  },
  {
    name: "size",
    type: '"xs" | "sm" | "base" | "lg"',
    defaultValue: '"base"',
    description: "Sets visual control density and replaces the native character-count size attribute.",
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
    description: "Native listeners pass through to the input element.",
  },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"input"', description: "Stable root-part selector." },
  { name: "data-size", value: '"xs" | "sm" | "base" | "lg"', description: "Resolved density." },
  { name: "data-invalid", value: '""', description: "Present for invalid prop or ARIA state." },
] as const;

export const exportsList = [
  { name: "Input", description: "Native styled text-entry control." },
  { name: "InputProps / InputEmits", description: "Public native prop and Vue event contracts." },
  { name: "InputModelValue / InputSize", description: "Controlled-value and density types." },
  { name: "INPUT_SIZES", description: "Supported density values." },
  { name: "INPUT_DEFAULT_SIZE", description: "Default base density." },
  { name: "isInputSize", description: "Supported-size type guard." },
  { name: "resolveInputSize", description: "Safe size resolver with base fallback." },
] as const;
