export const barrelCode = `import { Label } from "@dicehub/kappa";`;

export const granularCode = `import { Label } from "@dicehub/kappa/components/label";`;

export const previewCode = `<script setup>
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
  <Label for="username">Username</Label>
  <input id="username" name="username" value="jordanlee" autocomplete="username" />
</template>`;

export const usageCode = `<script setup>
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
  <Label for="email">Email address</Label>
  <input id="email" name="email" type="email" autocomplete="email" />
</template>`;

export const optionalCode = `<Label for="extension" show-optional>Extension</Label>
<input id="extension" name="extension" inputmode="numeric" />

<Label for="nickname" show-optional optional-text="facultatif">Surnom</Label>
<input id="nickname" name="nickname" lang="fr" />`;

export const associationCode = `<Label html-for="account-name">Account name</Label>
<input id="account-name" name="account-name" />`;

export const wrappedCode = `<Label class="checkbox-row">
  <input name="remember-device" type="checkbox" />
  Remember this device
</Label>`;

export const contentCode = `<script setup>
import { Checkbox } from "@dicehub/kappa/components/checkbox";
import { Label } from "@dicehub/kappa/components/label";
</script>

<template>
  <Checkbox.Root name="analytics" default-checked>
    <Checkbox.Control />
    <Checkbox.Label>
      <Label as-content>Share anonymous usage data</Label>
    </Checkbox.Label>
  </Checkbox.Root>
</template>`;

export const guidanceCode = `<Label for="invite-code">Invite code</Label>
<input id="invite-code" name="invite-code" aria-describedby="invite-code-help" />
<p id="invite-code-help">Use the 8-character code from your invitation email.</p>`;

export const disabledCode = `<Label for="member-id" data-disabled>Member ID</Label>
<input id="member-id" name="member-id" value="MBR-2841" disabled />`;

export const rtlCode = `<div dir="rtl" lang="ar">
  <Label for="city" show-optional optional-text="اختياري">المدينة</Label>
  <input id="city" name="city" value="عمّان" />
</div>`;

export const labelProps = [
  {
    name: "as",
    type: '"label" | "span"',
    defaultValue: '"label"',
    description: "Selects the native root element.",
  },
  {
    name: "asContent",
    type: "boolean",
    defaultValue: "false",
    description: "Renders a span and inherits surrounding typography for nested composition.",
  },
  {
    name: "htmlFor",
    type: "string",
    defaultValue: "—",
    description: "Associates a native label with a control id. Native `for` is also supported.",
  },
  {
    name: "showOptional",
    type: "boolean",
    defaultValue: "false",
    description: "Shows a quiet optional marker after the default slot.",
  },
  {
    name: "optionalText",
    type: "string",
    defaultValue: '"optional"',
    description: "Sets translated text inside the optional marker.",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Visible label text or content. Keep the accessible name concise.",
  },
] as const;

export const dataSlots = [
  { name: "label", element: "label | span", description: "Root label or content element." },
  {
    name: "label-optional",
    element: "span",
    description: "Optional marker rendered when showOptional is true.",
  },
] as const;

export const exportsList = [
  { name: "Label", description: "Native standalone form label component." },
  { name: "LabelProps / LabelSlots", description: "Public prop and slot contracts." },
  { name: "LabelElement", description: "Supported label and span root elements." },
  { name: "LABEL_ELEMENTS", description: "Supported native root elements." },
  { name: "LABEL_DEFAULT_ELEMENT", description: "Default native label root." },
  { name: "LABEL_DEFAULT_OPTIONAL_TEXT", description: "Default optional marker text." },
  { name: "isLabelElement", description: "Supported-element type guard." },
  { name: "resolveLabelElement", description: "Safe root-element resolver." },
  { name: "resolveLabelOptionalText", description: "Safe optional-text resolver." },
] as const;
