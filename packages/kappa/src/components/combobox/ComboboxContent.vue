<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  type PropType,
  ref,
  Teleport,
  watchEffect,
} from "vue";
import { getComboboxContentPositioning, type ComboboxContentProps } from "./combobox";
import { useKappaComboboxContext } from "./combobox-context";

defineOptions({ inheritAttrs: false });

const props = defineProps({
  applyStyles: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["applyStyles"]>,
  },
  arrowPadding: Number as PropType<ComboboxContentProps["arrowPadding"]>,
  boundary: [String, Array, Object, Function] as PropType<ComboboxContentProps["boundary"]>,
  fitViewport: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["fitViewport"]>,
  },
  flip: {
    default: undefined,
    type: [Boolean, Array] as PropType<ComboboxContentProps["flip"]>,
  },
  getAnchorElement: Function as PropType<ComboboxContentProps["getAnchorElement"]>,
  getAnchorRect: Function as PropType<ComboboxContentProps["getAnchorRect"]>,
  gutter: Number as PropType<ComboboxContentProps["gutter"]>,
  hideWhenDetached: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["hideWhenDetached"]>,
  },
  listeners: {
    default: undefined,
    type: [Boolean, Object] as PropType<ComboboxContentProps["listeners"]>,
  },
  offset: Object as PropType<ComboboxContentProps["offset"]>,
  onComplete: Function as PropType<ComboboxContentProps["onComplete"]>,
  onPositioned: Function as PropType<ComboboxContentProps["onPositioned"]>,
  overflowPadding: Number as PropType<ComboboxContentProps["overflowPadding"]>,
  overlap: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["overlap"]>,
  },
  placement: String as PropType<ComboboxContentProps["placement"]>,
  restoreStyles: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["restoreStyles"]>,
  },
  sameWidth: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["sameWidth"]>,
  },
  shift: Number as PropType<ComboboxContentProps["shift"]>,
  sizeMiddleware: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["sizeMiddleware"]>,
  },
  slide: {
    default: undefined,
    type: Boolean as PropType<ComboboxContentProps["slide"]>,
  },
  strategy: String as PropType<ComboboxContentProps["strategy"]>,
  teleport: { default: true, type: Boolean },
  teleportTo: {
    default: "body",
    type: [String, Object] as PropType<ComboboxContentProps["teleportTo"]>,
  },
  updatePosition: Function as PropType<ComboboxContentProps["updatePosition"]>,
});
const context = useKappaComboboxContext();
const isMounted = ref(false);
const positioning = computed(() => getComboboxContentPositioning(props));

watchEffect(() => {
  context.setContentPositioning(positioning.value);
});

onMounted(() => {
  isMounted.value = true;
});

onBeforeUnmount(() => {
  context.clearContentPositioning();
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <Combobox.Positioner class="kappa-combobox__positioner" data-slot="combobox-positioner">
      <Combobox.Content
        v-bind="$attrs"
        class="kappa-combobox__content"
        data-slot="combobox-content"
      >
        <slot />
      </Combobox.Content>
    </Combobox.Positioner>
  </Teleport>
</template>
