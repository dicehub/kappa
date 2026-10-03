<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import { computed, ref } from "vue";
import type { SidebarCollapsibleProps, SidebarCollapsibleEmits, SidebarSlots } from "./sidebar";
import { useSidebarContext } from "./sidebar-context";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SidebarCollapsibleProps>(), {
  open: undefined, defaultOpen: false, disabled: false,
});
const emit = defineEmits<SidebarCollapsibleEmits>();
defineSlots<SidebarSlots>();
const sidebar = useSidebarContext();
const internalOpen = ref(props.defaultOpen);
const open = computed(() => !sidebar.iconCollapsed.value && (props.open ?? internalOpen.value));
function setOpen(value: boolean) {
  if (sidebar.iconCollapsed.value && value) sidebar.setOpen(true);
  if (props.open === undefined) internalOpen.value = value;
  emit("update:open", value);
  emit("openChange", { open: value });
}
</script>

<template>
  <ArkCollapsible.Root
    v-bind="$attrs"
    :id="props.id"
    :open="open"
    :disabled="props.disabled"
    :unmount-on-exit="false"
    class="kappa-sidebar__collapsible"
    data-slot="sidebar-collapsible"
    @update:open="setOpen"
  ><slot /></ArkCollapsible.Root>
</template>

<style src="./sidebar.css"></style>
