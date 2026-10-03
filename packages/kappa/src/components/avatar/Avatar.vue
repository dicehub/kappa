<script setup lang="ts">
import { Avatar as ArkAvatar } from "@ark-ui/vue/avatar";
import { DEFAULT_LOCALE, LocaleProvider, useLocaleContext } from "@ark-ui/vue/locale";
import { computed } from "vue";
import {
  AVATAR_DEFAULT_SIZE,
  resolveAvatarSize,
  type AvatarEmits,
  type AvatarProps,
  type AvatarSlots,
} from "./avatar";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AvatarProps>(), {
  asChild: undefined,
  dir: undefined,
  id: undefined,
  ids: undefined,
  size: AVATAR_DEFAULT_SIZE,
});

const emit = defineEmits<AvatarEmits>();
defineSlots<AvatarSlots>();

const resolvedSize = computed(() => resolveAvatarSize(props.size));
const inheritedLocale = useLocaleContext(DEFAULT_LOCALE);
const locale = computed(() => {
  if (props.dir === undefined) return inheritedLocale.value.locale;
  return props.dir === "rtl" ? "ar" : "en-US";
});
</script>

<template>
  <LocaleProvider :locale="locale">
    <ArkAvatar.Root
      v-bind="$attrs"
      class="kappa-avatar"
      data-slot="avatar"
      :data-size="resolvedSize"
      :as-child="props.asChild"
      :id="props.id"
      :ids="props.ids"
      @status-change="emit('statusChange', $event)"
    >
      <slot />
    </ArkAvatar.Root>
  </LocaleProvider>
</template>

<style src="./avatar.css"></style>
