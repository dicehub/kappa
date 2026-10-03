<script setup lang="ts">
import { inject } from "vue";
import { Dropdown } from "../dropdown";
import { menuBarContextKey, menuBarMenuContextKey, type MenuBarContentProps, type MenuBarSlots } from "./menu-bar";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<MenuBarContentProps>(), {
  asChild: false,
  teleport: true,
  teleportTo: "body",
});
defineSlots<MenuBarSlots>();
const bar = inject(menuBarContextKey);
const menu = inject(menuBarMenuContextKey);
if (!bar || !menu) throw new Error("MenuBar.Content must be inside MenuBar.Menu");

const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const highlightedSubTrigger = event.currentTarget instanceof HTMLElement &&
    event.currentTarget.querySelector('[data-slot="dropdown-sub-trigger"][data-highlighted]');
  if (event.key === "ArrowRight" &&
    (target.closest('[data-slot="dropdown-sub-trigger"]') || highlightedSubTrigger)) return;
  event.preventDefault();
  event.stopPropagation();
  bar.move(menu.value, event.key === "ArrowRight" ? 1 : -1, true);
};
</script>

<template>
  <Dropdown.Content
    v-bind="$attrs"
    class="kappa-menu-bar__content"
    data-menu-bar-content=""
    :as-child="props.asChild"
    :teleport="props.teleport"
    :teleport-to="props.teleportTo"
    @keydown.capture="onKeydown"
  >
    <slot />
  </Dropdown.Content>
</template>
