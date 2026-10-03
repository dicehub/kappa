const nativeInputStyles = `.button-group-native-input {
  box-sizing: border-box;
  inline-size: clamp(8rem, 48vw, 14rem);
  min-inline-size: 0;
  block-size: 2rem;
  flex: 1 1 auto;
  appearance: none;
  padding-block: 0;
  padding-inline: 0.625rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: var(--kappa-button-group-radius, 0.5rem);
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.8125rem;
  line-height: 1rem;
}

.button-group-native-input::placeholder {
  color: var(--kappa-muted, #9aa2ae);
}

.button-group-native-input:focus-visible {
  outline: 2px solid var(--kappa-focus, #4c63ff);
  outline-offset: 2px;
}

.button-group-native-input:disabled {
  cursor: not-allowed;
  opacity: var(--kappa-disabled-opacity, 0.56);
}

@media (forced-colors: active) {
  .button-group-native-input { border-color: ButtonText; }
  .button-group-native-input:focus-visible { outline-color: Highlight; }
}`;

const nativeInputGroupStyles = `.button-group-native-input-group {
  box-sizing: border-box;
  display: flex;
  inline-size: clamp(10rem, 56vw, 18rem);
  min-inline-size: 0;
  block-size: 2rem;
  align-items: center;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: var(--kappa-button-group-radius, 0.5rem);
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
}

.button-group-native-input-group:focus-within {
  outline: 2px solid var(--kappa-focus, #4c63ff);
  outline-offset: 2px;
}

.button-group-native-input-group[data-active="true"] {
  border-color: var(--kappa-warning, #d97706);
}

.button-group-native-input-group--nested {
  inline-size: min(14.5625rem, 60vw);
}

.button-group-native-input-group__field {
  min-inline-size: 0;
  block-size: 100%;
  flex: 1 1 auto;
  padding-inline: 0.625rem;
  border: 0;
  background: transparent;
  color: inherit;
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.8125rem;
  outline: 0;
}

.button-group-native-input-group__field::placeholder {
  color: var(--kappa-muted, #9aa2ae);
}

.button-group-native-input-group__field:disabled {
  cursor: not-allowed;
}

.button-group-native-input-group__addon {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding-inline-end: 0.5rem;
  color: var(--kappa-subtle, #5f6875);
  user-select: none;
}

.button-group-native-input-group__addon svg {
  inline-size: 1rem;
  block-size: 1rem;
}

.button-group-native-input-group__action[data-active="true"] {
  background: var(--kappa-warning-tint, #fff4e5);
  color: var(--kappa-warning-text, #b54708);
}

.button-group-native-input-group__action {
  flex: none;
  color: var(--kappa-subtle, #5f6875);
}

.button-group-native-input-group__action:focus-visible {
  outline: 0;
}

@media (forced-colors: active) {
  .button-group-native-input-group { border-color: ButtonText; }
  .button-group-native-input-group:focus-within { outline-color: Highlight; }
}`;

const floatingSurfaceStyles = `.button-group-positioner {
  z-index: 30;
}

.button-group-surface {
  box-sizing: border-box;
  min-inline-size: 12rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.625rem;
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.8125rem;
}

.button-group-surface[hidden] {
  display: none;
}`;

const optionStyles = `.button-group-option {
  display: flex;
  min-block-size: 2rem;
  align-items: center;
  gap: 0.5rem;
  padding-inline: 0.625rem;
  border-radius: 0.375rem;
  cursor: default;
  outline: none;
}

.button-group-option[data-highlighted] {
  background: var(--kappa-overlay, #e9edf2);
}

.button-group-option svg {
  inline-size: 1rem;
  block-size: 1rem;
  flex: none;
}

.button-group-option--danger {
  color: var(--kappa-danger-text, #b42318);
}

.button-group-option--danger[data-highlighted] {
  background: var(--kappa-danger-tint, #fee4e2);
}

.button-group-separator {
  block-size: 1px;
  margin-block: 0.375rem;
  background: var(--kappa-line, #e3e6eb);
}`;

export const nestedComposerCode = `<script setup>
import { AudioLines, Plus } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Message composer">
    <ButtonGroup.Root aria-label="Attachment actions">
      <Button :icon="Plus" shape="square" variant="outline" aria-label="Add attachment" />
    </ButtonGroup.Root>
    <ButtonGroup.Root aria-label="Message input">
      <div
        class="button-group-native-input-group button-group-native-input-group--nested"
        data-slot="input-group"
        role="group"
        aria-label="Message and voice controls"
      >
        <input
          class="button-group-native-input-group__field"
          data-slot="input-group-control"
          type="text"
          aria-label="Message"
          placeholder="Send a message..."
        />
        <div
          class="button-group-native-input-group__addon"
          data-slot="input-group-addon"
          data-align="inline-end"
          role="img"
          aria-label="Voice Mode"
          title="Voice Mode"
        >
          <AudioLines aria-hidden="true" />
        </div>
      </div>
    </ButtonGroup.Root>
  </ButtonGroup>
</template>

<style scoped>
${nativeInputGroupStyles}
</style>`;

export const inputCode = `<script setup>
import { Search } from "@lucide/vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <ButtonGroup aria-label="Case search">
    <input
      class="button-group-native-input"
      data-slot="input"
      type="search"
      aria-label="Search cases"
      placeholder="Search..."
    />
    <Button :icon="Search" shape="square" variant="outline" aria-label="Search" />
  </ButtonGroup>
</template>

<style scoped>
${nativeInputStyles}
</style>`;

export const inputGroupCode = `<script setup>
import { AudioLines, Plus } from "@lucide/vue";
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";

const voiceEnabled = ref(false);
</script>

<template>
  <ButtonGroup aria-label="Message composer">
    <ButtonGroup.Root aria-label="Attachment actions">
      <Button :icon="Plus" shape="square" variant="outline" aria-label="Add attachment" />
    </ButtonGroup.Root>
    <ButtonGroup.Root aria-label="Message controls">
      <div
        class="button-group-native-input-group"
        data-slot="input-group"
        :data-active="voiceEnabled ? 'true' : undefined"
      >
        <input
          class="button-group-native-input-group__field"
          data-slot="input-group-control"
          type="text"
          aria-label="Message"
          :disabled="voiceEnabled"
          :placeholder="voiceEnabled ? 'Record and send audio...' : 'Send a message...'"
        />
        <Button
          :icon="AudioLines"
          class="button-group-native-input-group__action"
          shape="square"
          size="xs"
          variant="ghost"
          :aria-label="voiceEnabled ? 'Stop voice input' : 'Start voice input'"
          :aria-pressed="voiceEnabled"
          :data-active="voiceEnabled ? 'true' : undefined"
          :title="voiceEnabled ? 'Stop voice input' : 'Start voice input'"
          @click="voiceEnabled = !voiceEnabled"
        />
      </div>
    </ButtonGroup.Root>
  </ButtonGroup>
</template>

<style scoped>
${nativeInputGroupStyles}
</style>`;

export const dropdownMenuCode = `<script setup>
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Copy,
  Share2,
  Trash2,
  UserRoundX,
  VolumeX,
} from "@lucide/vue";
import { Menu } from "@ark-ui/vue/menu";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";

const conversationItems = [
  { value: "mute", label: "Mute conversation", icon: VolumeX },
  { value: "read", label: "Mark as read", icon: Check },
  { value: "report", label: "Report conversation", icon: AlertTriangle },
  { value: "block", label: "Block user", icon: UserRoundX },
  { value: "share", label: "Share conversation", icon: Share2 },
  { value: "copy", label: "Copy conversation", icon: Copy },
];
</script>

<template>
  <Menu.Root :positioning="{ placement: 'bottom-end', gutter: 6 }">
    <ButtonGroup aria-label="Follow actions">
      <Button variant="outline">Follow</Button>
      <Menu.Trigger as-child>
        <Button :icon="ChevronDown" shape="square" variant="outline" aria-label="More follow options" />
      </Menu.Trigger>
    </ButtonGroup>
    <Menu.Positioner class="button-group-positioner">
      <Menu.Content class="button-group-surface button-group-menu" aria-label="Conversation actions">
        <Menu.Item
          v-for="item in conversationItems"
          :key="item.value"
          :value="item.value"
          class="button-group-option"
        >
          <component :is="item.icon" aria-hidden="true" />
          {{ item.label }}
        </Menu.Item>
        <Menu.Separator class="button-group-separator" />
        <Menu.Item value="delete" class="button-group-option button-group-option--danger">
          <Trash2 aria-hidden="true" />
          Delete conversation
        </Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>

<style scoped>
${floatingSurfaceStyles}
${optionStyles}

.button-group-menu { inline-size: 13rem; padding: 0.375rem; }
</style>`;

export const selectCode = `<script setup>
import { Check, ChevronDown, ArrowRight } from "@lucide/vue";
import { Select, createListCollection } from "@ark-ui/vue/select";
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";

const currencyItems = [
  { label: "$", value: "$", name: "US Dollar" },
  { label: "€", value: "€", name: "Euro" },
  { label: "£", value: "£", name: "British Pound" },
];
const currencies = createListCollection({ items: currencyItems });
const currency = ref(["$"]);
</script>

<template>
  <Select.Root
    v-model="currency"
    :collection="currencies"
    name="currency"
    :positioning="{ placement: 'bottom-start', gutter: 6 }"
  >
    <ButtonGroup aria-label="Transfer amount">
      <ButtonGroup.Root aria-label="Amount and currency">
        <Select.Trigger as-child>
          <Button :icon="ChevronDown" icon-position="inline-end" variant="outline" aria-label="Currency">
            <Select.ValueText placeholder="$" />
          </Button>
        </Select.Trigger>
        <input
          class="button-group-native-input button-group-amount-input"
          data-slot="input"
          type="text"
          inputmode="decimal"
          aria-label="Amount"
          placeholder="10.00"
        />
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Transfer actions">
        <Button :icon="ArrowRight" shape="square" variant="outline" aria-label="Send amount" />
      </ButtonGroup.Root>
    </ButtonGroup>
    <Select.HiddenSelect />
    <Select.Positioner class="button-group-positioner">
      <Select.Content class="button-group-surface button-group-select" aria-label="Currencies">
        <Select.Item
          v-for="item in currencyItems"
          :key="item.value"
          :item="item"
          class="button-group-option"
        >
          <Select.ItemText>
            <span class="button-group-select__symbol">{{ item.label }}</span>
            <span>{{ item.name }}</span>
          </Select.ItemText>
          <Select.ItemIndicator class="button-group-select__indicator">
            <Check aria-hidden="true" />
          </Select.ItemIndicator>
        </Select.Item>
      </Select.Content>
    </Select.Positioner>
  </Select.Root>
</template>

<style scoped>
${nativeInputStyles}
${floatingSurfaceStyles}
${optionStyles}

.button-group-amount-input { inline-size: clamp(6rem, 28vw, 9rem); }
.button-group-select { min-inline-size: 11rem; padding: 0.375rem; }
.button-group-select__symbol { inline-size: 1.25rem; font-family: var(--kappa-font-mono, monospace); }
.button-group-select__indicator { margin-inline-start: auto; }
</style>`;

export const popoverCode = `<script setup>
import { Bot, ChevronDown } from "@lucide/vue";
import { Popover } from "@ark-ui/vue/popover";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";
</script>

<template>
  <Popover.Root :portalled="false" :positioning="{ placement: 'bottom-end', gutter: 6 }">
    <ButtonGroup aria-label="Copilot actions">
      <Button :icon="Bot" variant="outline">Copilot</Button>
      <Popover.Trigger as-child>
        <Button :icon="ChevronDown" shape="square" variant="outline" aria-label="Open Copilot task" />
      </Popover.Trigger>
    </ButtonGroup>
    <Popover.Positioner class="button-group-positioner">
      <Popover.Content class="button-group-surface button-group-popover">
        <Popover.Title class="button-group-popover__title">Start a new task with Copilot</Popover.Title>
        <Popover.Description class="button-group-popover__description">
          Describe your task in natural language.
        </Popover.Description>
        <label class="button-group-popover__label" for="copilot-task">Task description</label>
        <textarea
          id="copilot-task"
          class="button-group-popover__textarea"
          rows="4"
          placeholder="I need to..."
        ></textarea>
        <p class="button-group-popover__hint">Copilot will open a pull request for review.</p>
      </Popover.Content>
    </Popover.Positioner>
  </Popover.Root>
</template>

<style scoped>
${floatingSurfaceStyles}

.button-group-popover {
  display: grid;
  inline-size: min(20rem, calc(100vw - 2rem));
  gap: 0.75rem;
  padding: 1rem;
}

.button-group-popover__title { font-size: 0.875rem; font-weight: 650; }
.button-group-popover__description,
.button-group-popover__hint { margin: 0; color: var(--kappa-subtle, #5f6875); line-height: 1.4; }
.button-group-popover__label { font-weight: 600; }

.button-group-popover__textarea {
  box-sizing: border-box;
  inline-size: 100%;
  min-block-size: 6rem;
  resize: vertical;
  padding: 0.625rem;
  border: 1px solid var(--kappa-line, #e3e6eb);
  border-radius: 0.5rem;
  background: var(--kappa-control, #ffffff);
  color: var(--kappa-default, #17191f);
  font: inherit;
}

.button-group-popover__textarea::placeholder { color: var(--kappa-muted, #9aa2ae); }
.button-group-popover__textarea:focus-visible {
  outline: 2px solid var(--kappa-focus, #4c63ff);
  outline-offset: 2px;
}
</style>`;
