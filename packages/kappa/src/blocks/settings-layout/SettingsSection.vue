<script setup lang="ts">
import { Collapsible as ArkCollapsible } from "@ark-ui/vue/collapsible";
import { nextTick, ref, useId, useSlots, watch } from "vue";
import { Button } from "../../components/button";
import type { CollapsibleOpenChangeDetails } from "@ark-ui/vue/collapsible";
import type { SettingsSectionEmits, SettingsSectionProps, SettingsSectionSlots } from "./settings-layout";

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<SettingsSectionProps>(), {
  headingLevel: 2,
  collapsible: true,
  defaultOpen: false,
  open: undefined,
  disabled: undefined,
  lazyMount: undefined,
  unmountOnExit: undefined,
  expandLabel: "Expand",
  closeLabel: "Close",
});
const emit = defineEmits<SettingsSectionEmits>();
defineSlots<SettingsSectionSlots>();
const slots = useSlots();
const headingId = `kappa-settings-heading-${useId()}`;
const section = ref<HTMLElement | null>(null);

function restoreFocus(open: boolean | undefined) {
  const element = section.value;
  if (open !== false || !props.collapsible || !element) return;
  const content = element.querySelector('[data-slot="settings-section-content"]');
  const document = element.ownerDocument;
  const focused = document.activeElement;
  if (!content?.contains(focused)) return;
  void nextTick(() => {
    if (section.value !== element || !element.isConnected || !props.collapsible || props.open === true) return;
    if (document.activeElement !== focused && document.activeElement !== document.body) return;
    const trigger = element.querySelector<HTMLButtonElement>('[data-kappa-settings-trigger]');
    const target = trigger && !trigger.disabled ? trigger : element.querySelector<HTMLElement>(`[id="${headingId}"]`);
    target?.focus({ preventScroll: true });
  });
}

function onOpenChange(details: CollapsibleOpenChangeDetails) {
  if (props.open === undefined) restoreFocus(details.open);
  emit("openChange", details);
}

watch(() => props.open, restoreFocus);
</script>

<template>
  <ArkCollapsible.Root
    v-bind="$attrs"
    as-child
    :default-open="props.defaultOpen"
    :open="props.collapsible ? props.open : true"
    :disabled="props.disabled"
    :id="props.id"
    :ids="props.ids"
    :lazy-mount="props.lazyMount"
    :unmount-on-exit="props.unmountOnExit"
    @update:open="emit('update:open', $event)"
    @open-change="onOpenChange"
    @exit-complete="emit('exitComplete')"
  >
    <section ref="section" class="kappa-settings-section" data-slot="settings-section" :aria-labelledby="headingId">
      <ArkCollapsible.Context v-slot="context">
        <header class="kappa-settings-section__header">
          <div class="kappa-settings-section__identity">
            <component :is="`h${props.headingLevel}`" :id="headingId" :tabindex="props.collapsible ? -1 : undefined" class="kappa-settings-section__title">
              <slot name="title" :open="context.open">{{ props.title }}</slot>
            </component>
            <div v-if="props.description || slots.description" class="kappa-settings-section__description">
              <slot name="description" :open="context.open">{{ props.description }}</slot>
            </div>
          </div>
          <div v-if="props.collapsible || slots.actions" class="kappa-settings-section__actions">
            <slot name="actions" :open="context.open" />
            <ArkCollapsible.Trigger v-if="props.collapsible" as-child>
              <Button size="lg" variant="outline" data-kappa-settings-trigger :disabled="props.disabled" :aria-label="`${context.open ? props.closeLabel : props.expandLabel} ${props.title}`">
                {{ context.open ? props.closeLabel : props.expandLabel }}
              </Button>
            </ArkCollapsible.Trigger>
          </div>
        </header>
        <ArkCollapsible.Content class="kappa-settings-section__content" data-slot="settings-section-content">
          <div class="kappa-settings-section__content-body">
            <slot :open="context.open" />
          </div>
        </ArkCollapsible.Content>
      </ArkCollapsible.Context>
    </section>
  </ArkCollapsible.Root>
</template>

<style src="./settings-layout.css"></style>
