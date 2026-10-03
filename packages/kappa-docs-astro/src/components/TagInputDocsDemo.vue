<script setup lang="ts">
import { ref } from "vue";
import { TagInput, type TagInputProps } from "@dicehub/kappa/components/tag-input";
import TagInputTagList from "./TagInputTagList.vue";

type DemoVariant = "preview" | "usage" | "controlled" | "paste" | "sizes" | "states";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const controlledTags = ref(["mesh", "review"]);
const validationStatus = ref("Use 2–16 letters, numbers, or hyphens. Maximum four tags.");

const validateTag: NonNullable<TagInputProps["validate"]> = ({ inputValue }) =>
  inputValue
    .split(/[,\n]/)
    .filter(Boolean)
    .every((value) => /^[a-z0-9-]{2,16}$/i.test(value.trim()));

const onInvalid = (details: { reason: "rangeOverflow" | "invalidTag" }) => {
  validationStatus.value =
    details.reason === "rangeOverflow"
      ? "Maximum four tags."
      : "Use 2–16 letters, numbers, or hyphens.";
};
</script>

<template>
  <div class="tag-input-demo" :data-tag-input-demo="props.variant">
    <TagInput.Root
      v-if="props.variant === 'preview'"
      :default-value="['solver', 'mesh', 'review']"
      placeholder="Add a tag…"
    >
      <TagInput.Label>Project tags</TagInput.Label>
      <TagInput.Control>
        <TagInputTagList />
        <TagInput.Input aria-label="Add project tag" />
        <TagInput.ClearTrigger />
      </TagInput.Control>
      <TagInput.HiddenInput name="project-tags" />
    </TagInput.Root>

    <TagInput.Root
      v-else-if="props.variant === 'usage'"
      :default-value="['geometry', 'ready']"
      placeholder="Type and press Enter…"
    >
      <TagInput.Label>Labels</TagInput.Label>
      <TagInput.Control>
        <TagInputTagList />
        <TagInput.Input aria-label="Add label" />
        <TagInput.ClearTrigger />
      </TagInput.Control>
      <TagInput.HiddenInput name="labels" />
    </TagInput.Root>

    <div v-else-if="props.variant === 'controlled'" class="tag-input-demo__stack">
      <TagInput.Root v-model="controlledTags" placeholder="Add filter…">
        <TagInput.Label>Active filters</TagInput.Label>
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input aria-label="Add active filter" />
          <TagInput.ClearTrigger />
        </TagInput.Control>
      </TagInput.Root>
      <output class="tag-input-demo__status" role="status">
        {{ controlledTags.length ? controlledTags.join(" · ") : "No active filters" }}
      </output>
    </div>

    <div v-else-if="props.variant === 'paste'" class="tag-input-demo__stack">
      <TagInput.Root
        add-on-paste
        :delimiter="/[,\n]/"
        :max="4"
        placeholder="Paste or enter tags…"
        :sanitize-value="(value) => value.trim().toLowerCase()"
        :validate="validateTag"
        @value-invalid="onInvalid"
      >
        <TagInput.Label>Build targets</TagInput.Label>
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input aria-label="Add build target" />
          <TagInput.ClearTrigger />
        </TagInput.Control>
      </TagInput.Root>
      <output class="tag-input-demo__status" role="status">{{ validationStatus }}</output>
    </div>

    <div v-else-if="props.variant === 'sizes'" class="tag-input-demo__stack">
      <TagInput.Root
        v-for="size in (['xs', 'sm', 'base', 'lg'] as const)"
        :key="size"
        :default-value="[size]"
        :size="size"
        :aria-label="`${size} tag input`"
        placeholder="Add tag…"
      >
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input :aria-label="`Add ${size} tag`" />
          <TagInput.ClearTrigger />
        </TagInput.Control>
      </TagInput.Root>
    </div>

    <div v-else class="tag-input-demo__stack">
      <TagInput.Root :default-value="['invalid']" invalid>
        <TagInput.Label>Invalid tags</TagInput.Label>
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input aria-label="Add invalid tag" />
        </TagInput.Control>
      </TagInput.Root>
      <TagInput.Root :default-value="['locked', 'stable']" read-only>
        <TagInput.Label>Read-only tags</TagInput.Label>
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input aria-label="Read-only tags" />
        </TagInput.Control>
      </TagInput.Root>
      <TagInput.Root :default-value="['unavailable']" disabled>
        <TagInput.Label>Disabled tags</TagInput.Label>
        <TagInput.Control>
          <TagInputTagList />
          <TagInput.Input aria-label="Disabled tags" />
        </TagInput.Control>
      </TagInput.Root>
    </div>
  </div>
</template>

<style scoped>
.tag-input-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
}

.tag-input-demo > :deep(.kappa-tag-input),
.tag-input-demo > .tag-input-demo__stack {
  inline-size: min(100%, 30rem);
}

.tag-input-demo__stack {
  display: grid;
  min-inline-size: 0;
  gap: 0.875rem;
}

.tag-input-demo__status {
  margin: 0;
  color: var(--kappa-subtle, #6c7480);
  font-size: 0.75rem;
  line-height: 1.4;
}
</style>
