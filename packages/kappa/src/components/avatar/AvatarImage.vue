<script setup lang="ts">
import { Avatar as ArkAvatar } from "@ark-ui/vue/avatar";
import type { AvatarImageProps, AvatarImageSlots } from "./avatar";

defineOptions({ inheritAttrs: false });

const props = defineProps<AvatarImageProps>();
defineSlots<AvatarImageSlots>();
</script>

<template>
  <ArkAvatar.Image
    v-bind="{ ...$attrs, ...props }"
    class="kappa-avatar__image"
    data-slot="avatar-image"
  />
</template>
