<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { Popover } from "@ark-ui/vue/popover";
import { Select, createListCollection } from "@ark-ui/vue/select";
import {
  AlertTriangle,
  ArrowRight,
  AudioLines,
  Bot,
  Check,
  ChevronDown,
  Copy,
  Plus,
  Search,
  Share2,
  Trash2,
  UserRoundX,
  VolumeX,
} from "@lucide/vue";
import { ref } from "vue";
import { Button } from "@dicehub/kappa/components/button";
import { ButtonGroup } from "@dicehub/kappa/components/button-group";

type CompositionVariant =
  | "nested-composer"
  | "input"
  | "input-group"
  | "dropdown-menu"
  | "select"
  | "popover";

withDefaults(defineProps<{ variant?: CompositionVariant }>(), {
  variant: "nested-composer",
});

const composerMessage = ref("");
const searchQuery = ref("");
const groupedMessage = ref("");
const voiceEnabled = ref(false);
const amount = ref("10.00");
const taskDescription = ref("");

const conversationItems = [
  { value: "mute", label: "Mute conversation", icon: VolumeX },
  { value: "read", label: "Mark as read", icon: Check },
  { value: "report", label: "Report conversation", icon: AlertTriangle },
  { value: "block", label: "Block user", icon: UserRoundX },
  { value: "share", label: "Share conversation", icon: Share2 },
  { value: "copy", label: "Copy conversation", icon: Copy },
];

const currencyItems = [
  { label: "$", value: "$", name: "US Dollar" },
  { label: "€", value: "€", name: "Euro" },
  { label: "£", value: "£", name: "British Pound" },
];
const currencies = createListCollection({ items: currencyItems });
const currency = ref(["$"]);
</script>

<template>
  <div
    class="button-group-composition-demo"
    :data-button-group-composition-demo="variant"
  >
    <ButtonGroup
      v-if="variant === 'nested-composer'"
      aria-label="Message composer"
      data-nested-composer-group
    >
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
            v-model="composerMessage"
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

    <form v-else-if="variant === 'input'" @submit.prevent>
      <ButtonGroup aria-label="Case search" data-input-group>
        <input
          v-model="searchQuery"
          class="button-group-native-input"
          data-slot="input"
          type="search"
          aria-label="Search cases"
          placeholder="Search..."
        />
        <Button
          :icon="Search"
          shape="square"
          variant="outline"
          type="submit"
          aria-label="Search"
        />
      </ButtonGroup>
    </form>

    <ButtonGroup
      v-else-if="variant === 'input-group'"
      aria-label="Message composer"
      data-input-group-composition
    >
      <ButtonGroup.Root aria-label="Attachment actions">
        <Button :icon="Plus" shape="square" variant="outline" aria-label="Add attachment" />
      </ButtonGroup.Root>
      <ButtonGroup.Root aria-label="Message controls">
        <div
          class="button-group-native-input-group"
          data-slot="input-group"
          :data-active="voiceEnabled ? 'true' : undefined"
          role="group"
          aria-label="Message and voice controls"
        >
          <input
            v-model="groupedMessage"
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

    <Menu.Root
      v-else-if="variant === 'dropdown-menu'"
      :positioning="{ placement: 'bottom-end', gutter: 6 }"
    >
      <ButtonGroup aria-label="Follow actions" data-dropdown-menu-group>
        <Button variant="outline">Follow</Button>
        <Menu.Trigger as-child>
          <Button
            :icon="ChevronDown"
            shape="square"
            variant="outline"
            aria-label="More follow options"
          />
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
            <Trash2 aria-hidden="true" /> Delete conversation
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>

    <Select.Root
      v-else-if="variant === 'select'"
      v-model="currency"
      class="button-group-select-root"
      :collection="currencies"
      :positioning="{ placement: 'bottom-start', gutter: 6 }"
    >
      <ButtonGroup aria-label="Transfer amount" data-select-group>
        <ButtonGroup.Root aria-label="Amount and currency">
          <Select.Trigger as-child>
            <Button
              :icon="ChevronDown"
              icon-position="inline-end"
              variant="outline"
              aria-label="Currency"
            >
              <Select.ValueText placeholder="$" />
            </Button>
          </Select.Trigger>
          <input
            v-model="amount"
            class="button-group-native-input button-group-amount-input"
            data-slot="input"
            type="text"
            inputmode="decimal"
            aria-label="Amount"
            placeholder="10.00"
          />
        </ButtonGroup.Root>
        <ButtonGroup.Root aria-label="Transfer actions">
          <Button
            :icon="ArrowRight"
            shape="square"
            variant="outline"
            aria-label="Send amount"
          />
        </ButtonGroup.Root>
      </ButtonGroup>
      <Select.HiddenSelect name="currency" />
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

    <Popover.Root
      v-else-if="variant === 'popover'"
      :portalled="false"
      :positioning="{ placement: 'bottom-end', gutter: 6 }"
    >
      <ButtonGroup aria-label="Copilot actions" data-popover-group>
        <Button :icon="Bot" variant="outline">Copilot</Button>
        <Popover.Trigger as-child>
          <Button
            :icon="ChevronDown"
            shape="square"
            variant="outline"
            aria-label="Open Copilot task"
          />
        </Popover.Trigger>
      </ButtonGroup>
      <Popover.Positioner class="button-group-positioner">
        <Popover.Content class="button-group-surface button-group-popover">
          <Popover.Title class="button-group-popover__title">
            Start a new task with Copilot
          </Popover.Title>
          <Popover.Description class="button-group-popover__description">
            Describe your task in natural language.
          </Popover.Description>
          <label class="button-group-popover__label" for="button-group-copilot-task">
            Task description
          </label>
          <textarea
            id="button-group-copilot-task"
            v-model="taskDescription"
            class="button-group-popover__textarea"
            rows="4"
            placeholder="I need to..."
          />
          <p class="button-group-popover__hint">
            Copilot will open a pull request for review.
          </p>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  </div>
</template>

<style scoped src="./ButtonGroupCompositionDocsDemo.css"></style>
