<script setup lang="ts">
import { Avatar as ArkAvatar } from "@ark-ui/vue/avatar";
import type { AvatarFallbackProps, AvatarFallbackSlots } from "./avatar";

defineOptions({ inheritAttrs: false });

const props = defineProps<AvatarFallbackProps>();
defineSlots<AvatarFallbackSlots>();
</script>

<template>
  <ArkAvatar.Fallback
    v-bind="{ ...$attrs, ...props }"
    class="kappa-avatar__fallback"
    data-slot="avatar-fallback"
  >
    <slot />
  </ArkAvatar.Fallback>
</template>
