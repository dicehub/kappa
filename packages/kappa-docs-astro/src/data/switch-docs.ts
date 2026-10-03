export const barrelCode = `import {
  Switch,
  SwitchRoot,
  SwitchRootProvider,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchContext,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Switch,
  SwitchRoot,
  SwitchRootProvider,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchContext,
} from "@dicehub/kappa/components/switch";`;

export const previewCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/kappa/components/switch";

const airplaneMode = ref(false);
</script>

<template>
  <Switch.Root v-model:checked="airplaneMode">
    <Switch.Control />
    <Switch.Label>Airplane mode</Switch.Label>
  </Switch.Root>
</template>`;

export const usageCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root default-checked name="automatic-updates" value="enabled">
    <Switch.Control />
    <Switch.Label>Automatic updates</Switch.Label>
  </Switch.Root>
</template>`;

export const compositionCode = `<script setup>
import {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
} from "@dicehub/kappa/components/switch";
</script>

<template>
  <SwitchRoot>
    <SwitchControl>
      <SwitchThumb />
    </SwitchControl>
    <SwitchLabel>Automatic updates</SwitchLabel>
  </SwitchRoot>
</template>`;

export const descriptionCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root class="setting" default-checked>
    <Switch.Label class="setting__copy">
      <span class="setting__title">Share across devices</span>
      <span class="setting__description">
        Keep preferences synchronized on signed-in devices.
      </span>
    </Switch.Label>
    <Switch.Control />
  </Switch.Root>
</template>

<style scoped>
.setting {
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}

.setting__copy {
  display: grid;
  gap: 0.125rem;
}

.setting__title {
  font-weight: 600;
}

.setting__description {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 400;
}
</style>`;

export const choiceCardCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root class="choice-card" default-checked>
    <Switch.Label class="choice-card__copy">
      <span class="choice-card__title">Enable notifications</span>
      <span class="choice-card__description">
        Receive a message when important activity needs attention.
      </span>
    </Switch.Label>
    <Switch.Control />
  </Switch.Root>
</template>

<style scoped>
.choice-card {
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0.875rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
}

.choice-card:has([data-state="checked"]) {
  border-color: var(--kappa-accent, #4356e8);
}

.choice-card__copy {
  display: grid;
  gap: 0.25rem;
}

.choice-card__title {
  font-weight: 600;
}

.choice-card__description {
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  font-weight: 400;
}
</style>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { Switch } from "@dicehub/kappa/components/switch";

const focusMode = ref(true);
</script>

<template>
  <Switch.Root v-model:checked="focusMode">
    <Switch.Control />
    <Switch.Label>Focus mode</Switch.Label>
  </Switch.Root>
  <output aria-live="polite">State: {{ focusMode ? "on" : "off" }}</output>
</template>`;

export const contextCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root default-checked>
    <Switch.Control />
    <Switch.Label>
      Wi-Fi
      <Switch.Context v-slot="{ checked }">
        <span>{{ checked ? "On" : "Off" }}</span>
      </Switch.Context>
    </Switch.Label>
  </Switch.Root>
</template>`;

export const statesCode = `<script setup>
import { Field } from "@dicehub/kappa/components/field";
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root disabled>
    <Switch.Control />
    <Switch.Label>Disabled</Switch.Label>
  </Switch.Root>

  <Switch.Root disabled default-checked>
    <Switch.Control />
    <Switch.Label>Disabled and on</Switch.Label>
  </Switch.Root>

  <Switch.Root read-only default-checked>
    <Switch.Control />
    <Switch.Label>Read-only</Switch.Label>
  </Switch.Root>

  <Field.Root id="terms" invalid>
    <Switch.Root invalid required>
      <Switch.Control />
      <Switch.Label>Accept the terms</Switch.Label>
    </Switch.Root>
    <Field.ErrorText>You must accept the terms to continue.</Field.ErrorText>
  </Field.Root>
</template>`;

export const sizesCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <Switch.Root size="sm" default-checked>
    <Switch.Control />
    <Switch.Label>Small</Switch.Label>
  </Switch.Root>
  <Switch.Root size="base" default-checked>
    <Switch.Control />
    <Switch.Label>Base</Switch.Label>
  </Switch.Root>
  <Switch.Root size="lg" default-checked>
    <Switch.Control />
    <Switch.Label>Large</Switch.Label>
  </Switch.Root>
</template>`;

export const formCode = `<script setup>
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { Switch } from "@dicehub/kappa/components/switch";

const result = ref("Submit the form to inspect its value.");
const handleSubmit = (event) => {
  const data = new FormData(event.currentTarget);
  result.value = data.has("product-updates")
    ? "Product updates enabled"
    : "Product updates disabled";
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <Switch.Root name="product-updates" value="enabled" default-checked>
      <Switch.Control />
      <Switch.Label>Product updates</Switch.Label>
    </Switch.Root>
    <Button type="submit">Save preferences</Button>
    <output aria-live="polite">{{ result }}</output>
  </form>
</template>`;

export const rtlCode = `<script setup>
import { Switch } from "@dicehub/kappa/components/switch";
</script>

<template>
  <div dir="rtl" lang="ar">
    <Switch.Root dir="rtl" default-checked>
      <Switch.Control />
      <Switch.Label>تفعيل الإشعارات</Switch.Label>
    </Switch.Root>
  </div>
</template>`;

export const rootProps = [
  { name: "checked", type: "boolean", defaultValue: "—", description: "Controls the checked state." },
  { name: "defaultChecked", type: "boolean", defaultValue: "false", description: "Sets the initial uncontrolled state." },
  { name: "size", type: '"sm" | "base" | "lg"', defaultValue: '"base"', description: "Selects compact track, thumb, gap, and type geometry." },
  { name: "dir", type: '"ltr" | "rtl"', defaultValue: "inherited Ark locale", description: "Overrides the locale direction used by Ark UI and logical thumb movement." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Blocks focus and state changes." },
  { name: "readOnly", type: "boolean", defaultValue: "false", description: "Keeps the value available but blocks changes." },
  { name: "invalid", type: "boolean", defaultValue: "false", description: "Marks the control invalid and applies the danger treatment." },
  { name: "required", type: "boolean", defaultValue: "false", description: "Marks the hidden native input as required." },
  { name: "name / value / form", type: "string", defaultValue: "—", description: "Configures native form submission and external form association." },
  { name: "id / ids", type: "string / object", defaultValue: "generated", description: "Sets the machine or individual part identifiers." },
  { name: "label", type: "string", defaultValue: "—", description: "Supplies the localized accessible state label used by Ark UI." },
  { name: "asChild", type: "boolean", defaultValue: "false", description: "Merges root behavior onto one direct label child." },
] as const;

export const parts = [
  { name: "Root", element: "label", description: "Owns state, interaction, size, and the automatic hidden input." },
  { name: "Control", element: "span", description: "Renders the focusable visual track and a default Thumb." },
  { name: "Thumb", element: "span", description: "Moves between logical inline edges as state changes." },
  { name: "Label", element: "span", description: "Names the switch and expands the clickable target." },
  { name: "Context", element: "—", description: "Exposes checked, disabled, focused, setChecked, and toggleChecked." },
  { name: "RootProvider", element: "label", description: "Uses a machine returned by useSwitch instead of creating one." },
] as const;

export const events = [
  { name: "update:checked", payload: "boolean", description: "Supports v-model:checked and controlled state." },
  { name: "checkedChange", payload: "SwitchCheckedChangeDetails", description: "Reports the complete Ark state-change details." },
] as const;

export const dataAttributes = [
  { name: "data-state", value: '"checked" | "unchecked"', description: "Exposes the current binary state on Ark parts." },
  { name: "data-size", value: '"sm" | "base" | "lg"', description: "Exposes the resolved Kappa size on Root." },
  { name: "data-focus-visible", value: "present", description: "Marks keyboard-visible focus on Control." },
  { name: "data-hover / data-active", value: "present", description: "Marks pointer hover and active press states." },
  { name: "data-disabled / data-readonly", value: "present", description: "Marks non-editable states." },
  { name: "data-invalid / data-required", value: "present", description: "Marks form-validation states." },
] as const;

export const exportsList = [
  { name: "Switch", description: "Compound root with Root, RootProvider, Control, Thumb, Label, and Context." },
  { name: "SwitchRoot / SwitchRootProvider", description: "Named machine-owning and externally provided roots." },
  { name: "SwitchControl / SwitchThumb / SwitchLabel / SwitchContext", description: "Named composition parts." },
  { name: "SwitchProps / SwitchEmits / SwitchSize / SwitchDirection", description: "Public Vue, size, and direction contracts." },
  { name: "SWITCH_SIZES / SWITCH_DEFAULT_SIZE", description: "Supported compact sizes and default." },
  { name: "isSwitchSize / resolveSwitchSize", description: "Size guard and safe resolver." },
  { name: "switchAnatomy / useSwitch / useSwitchContext", description: "Re-exported Ark UI anatomy and hooks." },
] as const;

export const keyboardRows = [
  { key: "Space", description: "Toggles the focused switch." },
] as const;
