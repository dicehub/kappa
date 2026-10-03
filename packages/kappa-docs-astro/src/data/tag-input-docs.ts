export const barrelCode = `import { TagInput } from "@dicehub/kappa";`;

export const granularCode = `import { TagInput } from "@dicehub/kappa/components/tag-input";`;

const tagParts = `    <TagInput.Context v-slot="{ value }">
      <TagInput.Item
        v-for="(tag, index) in value"
        :key="\`\${tag}-\${index}\`"
        :index="index"
        :value="tag"
      >
        <TagInput.ItemPreview>
          <TagInput.ItemText>{{ tag }}</TagInput.ItemText>
          <TagInput.ItemDeleteTrigger />
        </TagInput.ItemPreview>
        <TagInput.ItemInput />
      </TagInput.Item>
    </TagInput.Context>`;

export const previewCode = `<script setup>
import { TagInput } from "@dicehub/kappa/components/tag-input";
</script>

<template>
  <TagInput.Root :default-value="['solver', 'mesh', 'review']" placeholder="Add a tag…">
    <TagInput.Label>Project tags</TagInput.Label>
    <TagInput.Control>
${tagParts}
      <TagInput.Input aria-label="Add project tag" />
      <TagInput.ClearTrigger />
    </TagInput.Control>
    <TagInput.HiddenInput name="project-tags" />
  </TagInput.Root>
</template>`;

export const usageCode = `<script setup>
import { TagInput } from "@dicehub/kappa/components/tag-input";
</script>

<template>
  <TagInput.Root :default-value="['geometry', 'ready']" placeholder="Type and press Enter…">
    <TagInput.Label>Labels</TagInput.Label>
    <TagInput.Control>
${tagParts}
      <TagInput.Input aria-label="Add label" />
      <TagInput.ClearTrigger />
    </TagInput.Control>
    <TagInput.HiddenInput name="labels" />
  </TagInput.Root>
</template>`;

export const controlledCode = `<script setup>
import { ref } from "vue";
import { TagInput } from "@dicehub/kappa/components/tag-input";

const tags = ref(["mesh", "review"]);
</script>

<template>
  <TagInput.Root v-model="tags" placeholder="Add filter…">
    <TagInput.Label>Active filters</TagInput.Label>
    <TagInput.Control>
${tagParts}
      <TagInput.Input aria-label="Add active filter" />
      <TagInput.ClearTrigger />
    </TagInput.Control>
  </TagInput.Root>
  <output>{{ tags.join(" · ") }}</output>
</template>`;

export const pasteCode = `<script setup lang="ts">
import { ref } from "vue";
import { TagInput, type TagInputProps } from "@dicehub/kappa/components/tag-input";

const status = ref("Use 2–16 letters, numbers, or hyphens. Maximum four tags.");
const validate: NonNullable<TagInputProps["validate"]> = ({ inputValue }) =>
  inputValue
    .split(/[,\\n]/)
    .filter(Boolean)
    .every((value) => /^[a-z0-9-]{2,16}$/i.test(value.trim()));
</script>

<template>
  <TagInput.Root
    add-on-paste
    :delimiter="/[,\\n]/"
    :max="4"
    :sanitize-value="(value) => value.trim().toLowerCase()"
    :validate="validate"
    @value-invalid="status = $event.reason"
  >
    <TagInput.Label>Build targets</TagInput.Label>
    <TagInput.Control>
${tagParts}
      <TagInput.Input aria-label="Add build target" placeholder="Paste or enter tags…" />
      <TagInput.ClearTrigger />
    </TagInput.Control>
  </TagInput.Root>
  <output role="status">{{ status }}</output>
</template>`;

export const sizesCode = `<script setup>
import { TagInput } from "@dicehub/kappa/components/tag-input";

const sizes = ["xs", "sm", "base", "lg"];
</script>

<template>
  <TagInput.Root
    v-for="size in sizes"
    :key="size"
    :default-value="[size]"
    :size="size"
    :aria-label="\`\${size} tag input\`"
  >
    <TagInput.Control>
${tagParts}
      <TagInput.Input :aria-label="\`Add \${size} tag\`" placeholder="Add tag…" />
    </TagInput.Control>
  </TagInput.Root>
</template>`;

export const statesCode = `<script setup>
import { TagInput } from "@dicehub/kappa/components/tag-input";
</script>

<template>
  <TagInput.Root :default-value="['invalid']" invalid>
    <!-- Label, Control, tag items, and Input -->
  </TagInput.Root>
  <TagInput.Root :default-value="['locked', 'stable']" read-only>
    <!-- Label, Control, tag items, and Input -->
  </TagInput.Root>
  <TagInput.Root :default-value="['unavailable']" disabled>
    <!-- Label, Control, tag items, and Input -->
  </TagInput.Root>
</template>`;

export const providerCode = `<script setup>
import { TagInput, useTagsInput } from "@dicehub/kappa/components/tag-input";

const tagsInput = useTagsInput({ defaultValue: ["provider-owned"] });
</script>

<template>
  <TagInput.RootProvider :value="tagsInput">
    <TagInput.Label>Provider tags</TagInput.Label>
    <TagInput.Control>
      <!-- Render TagInput.Item parts from TagInput.Context. -->
      <TagInput.Input aria-label="Add provider tag" />
    </TagInput.Control>
  </TagInput.RootProvider>
</template>`;

export const rootProps = [
  { name: "modelValue / v-model", type: "string[]", defaultValue: "—", description: "Controlled tag values." },
  { name: "defaultValue", type: "string[]", defaultValue: "[]", description: "Initial values for uncontrolled use." },
  { name: "inputValue / v-model:inputValue", type: "string", defaultValue: "—", description: "Controlled text in the entry input." },
  { name: "delimiter", type: "string | RegExp", defaultValue: '","', description: "Adds or splits tags when this delimiter is entered or pasted." },
  { name: "addOnPaste", type: "boolean", defaultValue: "false", description: "Splits pasted text into tags with delimiter." },
  { name: "blurBehavior", type: '"add" | "clear"', defaultValue: "—", description: "Adds or clears unfinished input when focus leaves." },
  { name: "editable", type: "boolean", defaultValue: "true", description: "Lets a user edit a tag with Enter or double-click." },
  { name: "max / maxLength", type: "number", defaultValue: "∞ / —", description: "Limits the tag count and entry length." },
  { name: "validate", type: "(details) => boolean", defaultValue: "—", description: "Accepts or rejects a proposed tag." },
  { name: "sanitizeValue", type: "(value) => string", defaultValue: "trim", description: "Normalizes each tag before it is added." },
  { name: "allowDuplicates / allowOverflow", type: "boolean", defaultValue: "false", description: "Changes duplicate and maximum-value behavior." },
  { name: "disabled / readOnly / required / invalid", type: "boolean", defaultValue: "false", description: "Native and validation states passed to Ark UI." },
  { name: "name / form", type: "string", defaultValue: "—", description: "Connects HiddenInput to native form submission." },
  { name: "size", type: '"xs" | "sm" | "base" | "lg"', defaultValue: '"base"', description: "Kappa control and tag density." },
] as const;

export const parts = [
  { name: "Root", element: "div", description: "Owns the Ark tags-input machine and state." },
  { name: "RootProvider", element: "div", description: "Uses an external useTagsInput machine." },
  { name: "Label", element: "label", description: "Names and focuses the entry input." },
  { name: "Control", element: "div", description: "Wraps tag items, entry input, and clear action." },
  { name: "Item", element: "div", description: "Provides one value and index to its item parts." },
  { name: "ItemPreview", element: "div", description: "Shows a tag when it is not in edit mode." },
  { name: "ItemText", element: "span", description: "Displays consumer-provided tag text." },
  { name: "ItemDeleteTrigger", element: "button", description: "Removes its tag. A default close icon is included." },
  { name: "ItemInput", element: "input", description: "Edits a tag after Enter or double-click." },
  { name: "Input", element: "input", description: "Accepts new tag text and keyboard commands." },
  { name: "ClearTrigger", element: "button", description: "Clears all tags. A default close icon is included." },
  { name: "HiddenInput", element: "input", description: "Provides the serialized value for native forms." },
  { name: "Context / ItemContext", element: "slot", description: "Exposes root or item machine state to scoped slots." },
] as const;

export const events = [
  { name: "update:modelValue", payload: "string[]", description: "Emitted when controlled tag values change." },
  { name: "update:inputValue", payload: "string", description: "Emitted when controlled entry text changes." },
  { name: "valueChange", payload: "{ value: string[] }", description: "Emitted after a tag is added, edited, or removed." },
  { name: "valueInvalid", payload: '{ reason: "rangeOverflow" | "invalidTag" }', description: "Emitted when max or validate rejects a tag." },
  { name: "highlightChange", payload: "{ highlightedValue }", description: "Emitted when keyboard or pointer highlight changes." },
  { name: "inputValueChange", payload: "{ inputValue }", description: "Emitted when entry text changes." },
  { name: "focusOutside / interactOutside / pointerDownOutside", payload: "outside event", description: "Ark UI outside-interaction events." },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"tag-input" / "tag-input-control" / …', description: "Stable Kappa selectors for named parts." },
  { name: "data-size", value: '"xs" | "sm" | "base" | "lg"', description: "Resolved Kappa density on the root." },
  { name: "data-focus / data-empty", value: '""', description: "Root and control focus or empty state from Ark UI." },
  { name: "data-highlighted", value: '""', description: "The tag selected by pointer or keyboard navigation." },
  { name: "data-invalid / data-disabled / data-readonly", value: '""', description: "Validation and availability states from Ark UI." },
] as const;

export const exportsList = [
  { name: "TagInput", description: "Compound namespace and root component." },
  { name: "TagInput.Root / RootProvider", description: "Machine-owned and provider-owned roots." },
  { name: "TagInput.Label / Control / Item* / Input / ClearTrigger / HiddenInput", description: "Named compound parts." },
  { name: "TagInput.Context / ItemContext", description: "Scoped access to current root and item state." },
  { name: "TagInputProps / TagInputEmits", description: "Kappa root props and Vue event contracts." },
  { name: "TagInputApi / TagInputContextValue / TagInputItemContextValue", description: "Provider and context API types." },
  { name: "useTagsInput / useTagsInputContext / useTagsInputItemContext / tagsInputAnatomy", description: "Ark UI hooks and anatomy re-exports." },
  { name: "TAG_INPUT_SIZES / TAG_INPUT_DEFAULT_SIZE", description: "Kappa density values and default." },
] as const;
