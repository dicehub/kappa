<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { SettingsSection } from "@dicehub/kappa/blocks/settings-layout";
import { Field } from "@dicehub/kappa/components/field";

const open = ref(true);
const disabled = ref(false);
const unmount = ref(false);
const ready = ref(false);
const outside = ref<HTMLElement>();
onMounted(() => {
  const params = new URLSearchParams(location.search);
  disabled.value = params.has("disabled");
  unmount.value = params.has("unmount");
  ready.value = true;
});
function close(enable = false, moveFocus = false) {
  open.value = false;
  if (enable) disabled.value = false;
  if (moveFocus) void nextTick(() => outside.value?.focus());
}
</script>

<template>
  <div :data-settings-focus-ready="ready">
    <SettingsSection title="Draft settings" :open="open" :disabled="disabled" :unmount-on-exit="unmount">
      <Field.Root><Field.Label>Draft</Field.Label><Field.Input /></Field.Root>
    </SettingsSection>
    <button type="button" @click="close()">Close section</button>
    <button type="button" @click="close(true)">Close and enable</button>
    <button type="button" @click="close(false, true)">Close and focus outside</button>
    <p ref="outside" tabindex="-1" data-external-focus>Outside focus target</p>
  </div>
</template>
