<script setup lang="ts">
import { Toaster as ArkToaster } from "@ark-ui/vue/toast";
import { computed, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref } from "vue";
import ToastRoot from "./Toast.vue";
import ToastActionTrigger from "./ToastActionTrigger.vue";
import ToastCloseTrigger from "./ToastCloseTrigger.vue";
import ToastContent from "./ToastContent";
import ToastDescription from "./ToastDescription.vue";
import ToastIndicator from "./ToastIndicator.vue";
import ToastTitle from "./ToastTitle.vue";
import type { ToasterProps, ToasterSlots } from "./toast";
import { TOAST_DEFAULT_LIMIT } from "./toast";
import { toastLayoutKey, type ToastMeasurements } from "./toast-context";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<ToasterProps>(), {
  teleport: true,
  teleportTo: "body",
  closeLabel: "Dismiss notification",
  limit: TOAST_DEFAULT_LIMIT,
});
defineSlots<ToasterSlots>();
provide(toastLayoutKey, {
  limit: computed(() => Math.max(0, props.limit)),
  measurements: reactive(new Map<string, ToastMeasurements>()),
});
const mounted = ref(false);
const region = ref<{ $el: HTMLElement }>();
let unsubscribe: (() => void) | undefined;
let syncing = false;
let pending = false;
onMounted(() => {
  mounted.value = true;
  // Ark's newly added/updated items must join the already active group.
  unsubscribe = props.toaster.subscribe(() => {
    if (syncing || pending || !region.value?.$el.matches(":hover, :focus-within")) return;
    pending = true;
    void nextTick(() => {
      pending = false;
      if (!region.value?.$el.matches(":hover, :focus-within")) return;
      syncing = true;
      try {
        if (props.toaster.attrs.overlap) props.toaster.expand();
        props.toaster.pause();
      } finally { syncing = false; }
    });
  });
});
onBeforeUnmount(() => { unsubscribe?.(); });
</script>

<template>
  <Teleport :disabled="!props.teleport || !mounted" :to="props.teleportTo">
    <ArkToaster ref="region" v-bind="$attrs" v-slot="toast" :toaster="props.toaster" class="kappa-toaster" data-slot="toaster">
      <slot v-bind="toast">
        <ToastRoot>
          <div class="kappa-toast__body">
            <ToastIndicator />
            <div class="kappa-toast__copy">
              <ToastTitle v-if="toast.title != null"><ToastContent :value="toast.title" /></ToastTitle>
              <ToastDescription v-if="toast.description != null"><ToastContent :value="toast.description" /></ToastDescription>
              <ToastActionTrigger v-if="toast.action">{{ toast.action.label }}</ToastActionTrigger>
            </div>
            <ToastCloseTrigger v-if="toast.closable !== false" :aria-label="props.closeLabel" />
          </div>
        </ToastRoot>
      </slot>
    </ArkToaster>
  </Teleport>
</template>

<style src="./toast.css"></style>
