<script setup lang="ts">
import { Button } from "@dicehub/kappa/components/button";
import {
  ClipboardText,
  type ClipboardCopyStatusDetails,
} from "@dicehub/kappa/components/clipboard-text";
import { Input } from "@dicehub/kappa/components/input";
import { computed, onBeforeUnmount, ref } from "vue";
import type { ColorsReferenceGroup, ColorsReferenceToken } from "../data/colors-docs";

/**
 * Complete Colors token reference.
 *
 * Every row is server-rendered, and the Markdown serializer keeps this island's
 * content through its `data-markdown-keep` marker, so `/docs/colors.md` ships
 * the same reference. Search only hides rows that already exist, and every copy
 * control composes ClipboardText parts: the ClipboardText trigger, its copied
 * indicator, and its status-change event.
 */
const props = defineProps<{ groups: ColorsReferenceGroup[]; total: number }>();

const query = ref("");
const statusMessage = ref("");
let feedbackTimer: number | undefined;

const searchTerms = computed(() =>
  query.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean),
);

const matchesToken = (token: ColorsReferenceToken) => {
  const haystack = `${token.name} ${token.description}`.toLocaleLowerCase();
  return searchTerms.value.every((term) => haystack.includes(term));
};

const matchCount = computed(
  () => props.groups.flatMap((group) => group.tokens).filter(matchesToken).length,
);

const countLabel = computed(() =>
  searchTerms.value.length === 0
    ? `${props.total} tokens`
    : `${matchCount.value} of ${props.total} tokens`,
);

const groupIsVisible = (group: ColorsReferenceGroup) => group.tokens.some(matchesToken);

const reportCopy = (value: string, details: ClipboardCopyStatusDetails) => {
  if (!details.copied) return;
  statusMessage.value = `Copied ${value}`;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    statusMessage.value = "";
  }, 2400);
};

onBeforeUnmount(() => {
  window.clearTimeout(feedbackTimer);
});
</script>

<template>
  <div class="docs-colors-reference" data-colors-reference data-markdown-keep>
    <div class="docs-colors-search" data-copy-ignore>
      <Input
        v-model="query"
        class="docs-colors-search__input"
        type="search"
        aria-label="Search color tokens"
        placeholder="Search token name or purpose…"
      />
      <p class="docs-colors-search__count" data-colors-count role="status" aria-live="polite">
        {{ countLabel }}
      </p>
      <Button
        v-if="query"
        class="docs-colors-search__clear"
        variant="ghost"
        size="sm"
        @click="query = ''"
      >
        Clear
      </Button>
      <p class="docs-colors-search__note" data-copy-ignore>
        Values stay selectable: when the browser blocks clipboard access, select the value text and
        copy it manually.
      </p>
    </div>

    <p
      v-show="matchCount === 0"
      class="docs-colors-empty"
      data-colors-reference-empty
      data-copy-ignore
    >
      No tokens match this search. Clear the field to restore the complete reference.
    </p>

    <span class="docs-visually-hidden" role="status" aria-live="polite" data-copy-ignore>
      {{ statusMessage }}
    </span>

    <section
      v-for="group in props.groups"
      v-show="groupIsVisible(group)"
      :key="group.id"
      class="docs-colors-group"
      data-colors-token-group
      :data-colors-group="group.id"
    >
      <h3 :id="`tokens-${group.id}`" class="docs-colors-group__title">{{ group.label }}</h3>
      <p class="docs-colors-group__description">{{ group.description }}</p>

      <div class="docs-colors-rows">
        <article
          v-for="token in group.tokens"
          v-show="matchesToken(token)"
          :key="token.name"
          class="docs-colors-token"
          data-colors-token-row
          :data-token-name="token.name"
        >
          <div class="docs-colors-token__identity">
            <div class="docs-colors-token__name-row">
              <code class="docs-colors-token__name">{{ token.name }}</code>
              <ClipboardText.Root
                :default-value="`var(${token.name})`"
                @status-change="reportCopy(`var(${token.name})`, $event)"
              >
                <ClipboardText.Trigger
                  class="docs-colors-copy"
                  :aria-label="`Copy var(${token.name})`"
                />
              </ClipboardText.Root>
            </div>
            <p class="docs-colors-token__description">{{ token.description }}</p>
            <p v-if="token.compatibility" class="docs-colors-token__compatibility">
              {{ token.compatibility }}
            </p>
          </div>

          <div class="docs-colors-token__modes">
            <div
              v-for="mode in token.modes"
              :key="mode.id"
              class="docs-colors-token__mode"
              :data-kappa-theme="mode.id"
              :data-colors-token-mode="mode.id"
            >
              <span class="docs-colors-token__mode-label">{{ mode.label }}</span>
              <span
                class="docs-colors-token__swatch"
                :data-colors-swatch="token.preview"
                :style="{
                  '--docs-colors-value': `var(${token.name})`,
                  '--docs-colors-swatch-background': `var(${token.swatchBackground})`,
                }"
                aria-hidden="true"
              >
                {{ token.preview === "text" ? "Aa" : "" }}
              </span>
              <span class="docs-colors-token__values">
                <code class="docs-colors-token__value">{{ mode.value }}</code>
                <span v-if="mode.resolved !== mode.value" class="docs-colors-token__resolved">
                  → {{ mode.resolved }}
                </span>
              </span>
              <ClipboardText.Root
                :default-value="mode.value"
                @status-change="reportCopy(mode.value, $event)"
              >
                <ClipboardText.Trigger
                  class="docs-colors-copy"
                  :aria-label="`Copy ${mode.label.toLowerCase()} value ${mode.value}`"
                />
              </ClipboardText.Root>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
