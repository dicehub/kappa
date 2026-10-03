<script setup lang="ts">
import { Combobox } from "@ark-ui/vue/combobox";
import { onMounted, ref, Teleport } from "vue";
import type { AutocompleteContentProps } from "./autocomplete";

defineOptions({ inheritAttrs: false });

withDefaults(defineProps<AutocompleteContentProps>(), {
  teleport: true,
  teleportTo: "body",
});

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>

<template>
  <Teleport :disabled="!teleport || !isMounted" :to="teleportTo">
    <Combobox.Positioner class="kappa-autocomplete__positioner">
      <Combobox.Content v-bind="$attrs" class="kappa-autocomplete__content">
        <slot />
      </Combobox.Content>
    </Combobox.Positioner>
  </Teleport>
</template>
