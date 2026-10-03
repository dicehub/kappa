<script setup lang="ts">
import { TagsInput as ArkTagsInput } from "@ark-ui/vue/tags-input";
import { computed } from "vue";
import {
  TAG_INPUT_DEFAULT_SIZE,
  resolveTagInputSize,
  type TagInputRootProviderProps,
  type TagInputRootProviderSlots,
} from "./tag-input";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<TagInputRootProviderProps>(), {
  asChild: undefined,
  size: TAG_INPUT_DEFAULT_SIZE,
});

defineSlots<TagInputRootProviderSlots>();

const resolvedSize = computed(() => resolveTagInputSize(props.size));
</script>

<template>
  <ArkTagsInput.RootProvider
    v-bind="$attrs"
    class="kappa-tag-input"
    data-slot="tag-input"
    :data-size="resolvedSize"
    :as-child="props.asChild"
    :value="props.value"
  >
    <slot />
  </ArkTagsInput.RootProvider>
</template>

<style src="./tag-input.css"></style>
