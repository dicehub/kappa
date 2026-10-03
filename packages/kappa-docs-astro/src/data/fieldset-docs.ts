export const barrelCode = `import { Fieldset } from "@dicehub/kappa";`;

export const granularCode = `import { Fieldset } from "@dicehub/kappa/components/fieldset";`;

export const previewCode = `<script setup>
import { Fieldset } from "@dicehub/kappa/components/fieldset";
</script>

<template>
  <Fieldset.Root id="delivery-channels">
    <Fieldset.Legend>Delivery channels</Fieldset.Legend>
    <label><input type="checkbox" checked /> Email digest</label>
    <label><input type="checkbox" /> Slack activity</label>
    <Fieldset.HelperText>Choose the updates that should reach your team.</Fieldset.HelperText>
  </Fieldset.Root>
</template>`;

export const usageCode = `<Fieldset.Root id="contact-preferences">
  <Fieldset.Legend>Contact preferences</Fieldset.Legend>
  <label><input type="checkbox" name="email" /> Email</label>
  <label><input type="checkbox" name="phone" /> Phone</label>
  <Fieldset.HelperText>Select every channel that works for you.</Fieldset.HelperText>
</Fieldset.Root>`;

export const compositionCode = `<script setup>
import {
  FieldsetRoot,
  FieldsetLegend,
  FieldsetHelperText,
} from "@dicehub/kappa/components/fieldset";
</script>

<template>
  <FieldsetRoot>
    <FieldsetLegend>Simulation outputs</FieldsetLegend>
    <label><input type="checkbox" /> Residual plot</label>
    <FieldsetHelperText>Reports are generated after the run completes.</FieldsetHelperText>
  </FieldsetRoot>
</template>`;

export const orientationCode = `<Fieldset.Root orientation="vertical">
  <Fieldset.Legend>Vertical layout</Fieldset.Legend>
  <label><input type="radio" name="vertical" /> Steady state</label>
  <label><input type="radio" name="vertical" /> Transient</label>
</Fieldset.Root>

<Fieldset.Root orientation="horizontal">
  <Fieldset.Legend>Horizontal layout</Fieldset.Legend>
  <label><input type="radio" name="horizontal" /> Local</label>
  <label><input type="radio" name="horizontal" /> Cluster</label>
</Fieldset.Root>`;

export const statesCode = `<Fieldset.Root id="required-channels" invalid>
  <Fieldset.Legend>Required channels</Fieldset.Legend>
  <label><input type="checkbox" /> Audit log</label>
  <Fieldset.ErrorText>Choose at least one channel.</Fieldset.ErrorText>
</Fieldset.Root>

<Fieldset.Root id="locked-channels" disabled>
  <Fieldset.Legend>Locked channels</Fieldset.Legend>
  <label><input type="checkbox" checked /> System alerts</label>
  <Fieldset.HelperText>Available to workspace administrators.</Fieldset.HelperText>
</Fieldset.Root>`;

export const rootProps = [
  {
    name: "orientation",
    type: '"vertical" | "horizontal"',
    defaultValue: '"vertical"',
    description: "Stacks direct children or flows them into responsive columns.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the native fieldset and its form controls.",
  },
  {
    name: "invalid",
    type: "boolean",
    defaultValue: "false",
    description: "Marks the group invalid and enables its ErrorText part.",
  },
  {
    name: "id",
    type: "string",
    defaultValue: "generated",
    description: "Sets the seed used for generated legend, helper, and error part IDs.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges Ark UI root behavior and attributes into one child element.",
  },
] as const;

export const partProps = [
  {
    part: "Legend / HelperText / ErrorText",
    prop: "asChild",
    type: "boolean",
    description: "Merges the part attributes into one child element.",
  },
] as const;

export const parts = [
  { name: "Root", description: "Native fieldset that owns group state, IDs, and layout." },
  { name: "RootProvider", description: "Renders a fieldset from a useFieldset machine." },
  { name: "Legend", description: "Native legend that names the control group." },
  { name: "HelperText", description: "Persistent guidance referenced by the fieldset." },
  { name: "ErrorText", description: "Invalid-state message with polite live semantics." },
  { name: "Context", description: "Exposes the current Ark fieldset context to a scoped slot." },
] as const;

export const exportsList = [
  { name: "Fieldset", description: "Compound Fieldset component and Root alias." },
  { name: "FieldsetRoot", description: "Named native fieldset root." },
  { name: "FieldsetRootProvider", description: "Root that consumes an external fieldset machine." },
  { name: "FieldsetLegend", description: "Named native legend part." },
  { name: "FieldsetHelperText", description: "Named helper text part." },
  { name: "FieldsetErrorText", description: "Named invalid-state text part." },
  { name: "FieldsetContext", description: "Scoped fieldset context slot." },
  { name: "useFieldset", description: "Creates an Ark fieldset machine for RootProvider." },
  { name: "useFieldsetContext", description: "Reads the closest fieldset context." },
  { name: "fieldsetAnatomy", description: "Ark UI fieldset anatomy metadata." },
  { name: "FIELDSET_ORIENTATIONS", description: "Supported Kappa layout values." },
  { name: "resolveFieldsetOrientation", description: "Safe runtime layout resolver." },
] as const;
