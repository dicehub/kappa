<script setup lang="ts">
import { Dropdown } from "../dropdown";
import { computed, inject, provide } from "vue";
import {
  menuBarContextKey,
  menuBarMenuContextKey,
  type MenuBarMenuEmits,
  type MenuBarMenuProps,
  type MenuBarSlots,
} from "./menu-bar";

const props = defineProps<MenuBarMenuProps>();
const emit = defineEmits<MenuBarMenuEmits>();
defineSlots<MenuBarSlots>();
const bar = inject(menuBarContextKey);
if (!bar) throw new Error("MenuBar.Menu must be inside MenuBar.Root");
provide(menuBarMenuContextKey, { value: props.value });

const open = computed(() => bar.activeValue.value === props.value);
const onOpenUpdate = (next: boolean) => {
  if (next) bar.setActive(props.value);
  else if (open.value) bar.setActive(null);
};
</script>

<template>
  <Dropdown.Root
    :aria-label="props.ariaLabel"
    :open="open"
    @update:open="onOpenUpdate"
    @select="emit('select', $event)"
  >
    <slot />
  </Dropdown.Root>
</template>
