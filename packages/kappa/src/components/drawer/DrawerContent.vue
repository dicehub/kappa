<script setup lang="ts">
import { Drawer as ArkDrawer } from "@ark-ui/vue/drawer";
import { onMounted, ref, Teleport } from "vue";
import DrawerBackdrop from "./DrawerBackdrop.vue";
import DrawerClose from "./DrawerClose.vue";
import DrawerGrabber from "./DrawerGrabber.vue";
import DrawerPositioner from "./DrawerPositioner.vue";
import type { DrawerContentProps, DrawerContentSlots } from "./drawer";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DrawerContentProps>(), {
  closeLabel: "Close drawer",
  draggable: true,
  showBackdrop: true,
  showCloseButton: false,
  showGrabber: true,
  teleport: true,
  teleportTo: "body",
});

defineSlots<DrawerContentSlots>();

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!props.teleport || !isMounted" :to="props.teleportTo">
    <DrawerBackdrop v-if="props.showBackdrop" />
    <DrawerPositioner>
      <ArkDrawer.Content
        v-bind="$attrs"
        class="kappa-drawer__content"
        data-slot="drawer-content"
        :data-close-button="props.showCloseButton ? '' : undefined"
        :data-grabber="props.showGrabber ? '' : undefined"
        :draggable="props.draggable"
      >
        <slot v-if="props.showGrabber" name="grabber"><DrawerGrabber /></slot>
        <slot />
        <slot v-if="props.showCloseButton" name="close">
          <DrawerClose :label="props.closeLabel" />
        </slot>
      </ArkDrawer.Content>
    </DrawerPositioner>
  </Teleport>
</template>

<style src="./drawer.css"></style>
