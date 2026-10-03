<script setup lang="ts">
import { Menu as ArkMenu } from "@ark-ui/vue/menu";
import { computed, inject, onMounted, ref, Teleport, useAttrs } from "vue";
import { dropdownAriaLabelKey } from "./dropdown-aria-label";
import type { DropdownContentProps, DropdownContentSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownContentProps>(), {
  asChild: undefined,
  teleport: true,
  teleportTo: "body",
});

defineSlots<DropdownContentSlots>();

const attrs = useAttrs();
const inheritedAriaLabel = inject(dropdownAriaLabelKey, undefined);
const resolvedAriaLabel = computed(() => {
  const label = attrs["aria-label"];
  if (typeof label === "string") return label;
  return inheritedAriaLabel?.value;
});
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <ArkMenu.Positioner
      class="kappa-dropdown__positioner"
      data-slot="dropdown-positioner"
    >
      <ArkMenu.Content
        v-bind="{
          ...$attrs,
          ...(resolvedAriaLabel === undefined ? {} : { 'aria-label': resolvedAriaLabel }),
        }"
        class="kappa-dropdown__content"
        data-slot="dropdown-content"
        :as-child="props.asChild"
      >
        <slot />
      </ArkMenu.Content>
    </ArkMenu.Positioner>
  </Teleport>
</template>

<style src="./dropdown.css"></style>
