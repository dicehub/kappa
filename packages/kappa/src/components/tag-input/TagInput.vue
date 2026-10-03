<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import { computed } from "vue";
import {
  TAG_INPUT_DEFAULT_SIZE,
  resolveTagInputSize,
  type TagInputEmits,
  type TagInputProps,
  type TagInputRootSlots,
} from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputProps>(), {
  asChild: undefined,
  addOnPaste: undefined,
  allowDuplicates: undefined,
  allowOverflow: undefined,
  autoFocus: undefined,
  blurBehavior: undefined,
  defaultInputValue: undefined,
  defaultValue: undefined,
  delimiter: undefined,
  disabled: undefined,
  editable: undefined,
  form: undefined,
  id: undefined,
  ids: undefined,
  inputValue: undefined,
  invalid: undefined,
  max: undefined,
  maxLength: undefined,
  modelValue: undefined,
  name: undefined,
  placeholder: undefined,
  readOnly: undefined,
  required: undefined,
  sanitizeValue: undefined,
  size: TAG_INPUT_DEFAULT_SIZE,
  translations: undefined,
  validate: undefined,
});

const emit = defineEmits<TagInputEmits>();
defineSlots<TagInputRootSlots>();

const resolvedSize = computed(() => resolveTagInputSize(props.size));
</script>

<template>
  <ArkTagsInput.Root
    v-bind="$attrs"
    class="kappa-tag-input"
    data-slot="tag-input"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :add-on-paste="props.addOnPaste"
    :allow-duplicates="props.allowDuplicates"
    :allow-overflow="props.allowOverflow"
    :auto-focus="props.autoFocus"
    :blur-behavior="props.blurBehavior"
    :default-input-value="props.defaultInputValue"
    :default-value="props.defaultValue"
    :delimiter="props.delimiter"
    :disabled="props.disabled"
    :editable="props.editable"
    :form="props.form"
    :id="props.id"
    :ids="props.ids"
    :input-value="props.inputValue"
    :invalid="props.invalid"
    :max="props.max"
    :max-length="props.maxLength"
    :model-value="props.modelValue"
    :name="props.name"
    :placeholder="props.placeholder"
    :read-only="props.readOnly"
    :required="props.required"
    :sanitize-value="props.sanitizeValue"
    :translations="props.translations"
    :validate="props.validate"
    @focus-outside="emit('focusOutside', $event)"
    @highlight-change="emit('highlightChange', $event)"
    @input-value-change="emit('inputValueChange', $event)"
    @interact-outside="emit('interactOutside', $event)"
    @pointer-down-outside="emit('pointerDownOutside', $event)"
    @value-change="emit('valueChange', $event)"
    @value-invalid="emit('valueInvalid', $event)"
    @update:input-value="emit('update:inputValue', $event)"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </ArkTagsInput.Root>
</template>

<style src="./tag-input.css"></style>
