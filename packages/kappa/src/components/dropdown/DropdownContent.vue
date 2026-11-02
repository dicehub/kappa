<script setup lang="ts">
import { Menu as ArkMenu, useMenuContext } from "@ark-ui/vue/menu";
import { computed, inject, onMounted, ref, Teleport, useAttrs, watch } from "vue";
import { dropdownAriaLabelKey } from "./dropdown-aria-label";
import { useDropdownFocus } from "./use-dropdown-focus";
import DropdownArrow from "./DropdownArrow.vue";
import type { DropdownContentProps, DropdownContentSlots } from "./dropdown";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownContentProps>(), {
  asChild: undefined,
  showArrow: undefined,
  teleport: true,
  teleportTo: "body",
});

defineSlots<DropdownContentSlots>();

const attrs = useAttrs();
const menu = useMenuContext();
// Keep an explicitly controlled pointer mounted so Ark can track its position.
watch(() => props.showArrow, () => {
  if (menu.value.open) menu.value.reposition();
}, { flush: "post" });
const { keyboardFocus, onPointerMove, onKeyDown } = useDropdownFocus(() => menu.value.open);
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
      :class="{ 'kappa-dropdown__positioner--arrow': props.showArrow }"
      data-slot="dropdown-positioner"
    >
      <DropdownArrow
        v-if="props.showArrow !== undefined"
        aria-hidden="true"
        :hidden="!props.showArrow"
        :data-state="menu.open ? 'open' : 'closed'"
      />
      <ArkMenu.Content
        v-bind="{
          ...$attrs,
          ...(resolvedAriaLabel === undefined ? {} : { 'aria-label': resolvedAriaLabel }),
          ...(!menu.open ? { inert: true } : {}),
        }"
        class="kappa-dropdown__content"
        data-slot="dropdown-content"
        :data-kappa-keyboard-focus="keyboardFocus || undefined"
        :as-child="props.asChild"
        @pointermove.capture="onPointerMove"
        @keydown.capture="onKeyDown"
      >
        <slot />
      </ArkMenu.Content>
    </ArkMenu.Positioner>
  </Teleport>
</template>

<style src="./dropdown.css"></style>
