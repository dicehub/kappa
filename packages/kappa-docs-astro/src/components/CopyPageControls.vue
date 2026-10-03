<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { computed, onBeforeUnmount, ref } from "vue";

const props = withDefaults(
  defineProps<{ align?: "start" | "center" | "end"; markdownPath?: string }>(),
  { align: "end", markdownPath: undefined },
);

const copied = ref(false);
const statusMessage = ref("");
let copyTimer: number | undefined;

const showStatus = (message: string, wasCopied = false) => {
  statusMessage.value = message;
  copied.value = wasCopied;
  if (copyTimer) window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copied.value = false;
    statusMessage.value = "";
  }, 2000);
};

onBeforeUnmount(() => {
  if (copyTimer) window.clearTimeout(copyTimer);
});

const getPageUrl = () => window.location.href;

const getMarkdownUrl = () => {
  const url = new URL(window.location.href);
  if (props.markdownPath) return new URL(props.markdownPath, url.origin).href;
  const path = url.pathname.replace(/\/+$/, "");
  return `${url.origin}${path}.md`;
};

const copyText = async (text: string, message: string, wasCopied = false) => {
  try {
    await navigator.clipboard.writeText(text);
    showStatus(message, wasCopied);
  } catch (error) {
    console.error("Copy failed:", error);
    showStatus("Copy failed");
  }
};

const handleCopyPage = async () => {
  try {
    const response = await fetch(getMarkdownUrl());
    if (response.ok) {
      await copyText(await response.text(), "Page copied", true);
      return;
    }
  } catch (error) {
    console.warn("Markdown page unavailable; copying page link instead:", error);
  }

  await copyText(getPageUrl(), "Page link copied", true);
};

const handleCopyLink = async () => {
  await copyText(getPageUrl(), "Page link copied");
};

const handleViewMarkdown = () => {
  window.open(getMarkdownUrl(), "_blank", "noopener,noreferrer");
};

const getAiPromptUrl = (baseUrl: string) => {
  const prompt = encodeURIComponent(
    `Read through this Kappa documentation: ${getMarkdownUrl()}. I'll need your help to understand it, so be prepared to explain concepts, share examples, and assist with debugging.`,
  );
  return `${baseUrl}?q=${prompt}`;
};

const handleOpenInClaude = () => {
  window.open(getAiPromptUrl("https://claude.ai/new"), "_blank", "noopener,noreferrer");
};

const handleOpenInChatGPT = () => {
  window.open(getAiPromptUrl("https://chatgpt.com"), "_blank", "noopener,noreferrer");
};

const positioning = computed(() => ({
  placement:
    props.align === "center"
      ? ("bottom" as const)
      : props.align === "start"
        ? ("bottom-start" as const)
        : ("bottom-end" as const),
  gutter: 6,
}));
</script>

<template>
  <div
    class="docs-copy-controls"
    :class="{ 'docs-copy-controls--center': props.align === 'center' }"
    data-copy-ignore
  >
    <div class="docs-copy-controls__group">
      <button
        type="button"
        class="docs-copy-controls__button docs-copy-controls__button--main"
        @click="handleCopyPage"
      >
        <svg
          v-if="!copied"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <rect x="8" y="8" width="11" height="11" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
        <span>Copy page</span>
      </button>

      <Menu.Root :id="`copy-page-${props.align}`" :positioning="positioning">
        <Menu.Trigger as-child>
          <button
            type="button"
            class="docs-copy-controls__button docs-copy-controls__button--toggle"
            aria-label="Copy page options"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="m7 10 5 5 5-5" />
            </svg>
          </button>
        </Menu.Trigger>

        <Menu.Positioner class="docs-copy-controls__positioner">
          <Menu.Content class="docs-copy-controls__menu">
            <Menu.Item
              class="docs-copy-controls__menu-item"
              value="copy-link"
              @select="handleCopyLink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
                <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
              </svg>
              Copy page link
            </Menu.Item>

            <Menu.Item
              class="docs-copy-controls__menu-item"
              value="view-markdown"
              @select="handleViewMarkdown"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M14 3v5h5M9 16v-4l2 2 2-2v4M15 12v4l2-2" />
              </svg>
              View Page as Markdown
            </Menu.Item>

            <Menu.Separator class="docs-copy-controls__separator" />

            <Menu.Item
              class="docs-copy-controls__menu-item"
              value="claude"
              @select="handleOpenInClaude"
            >
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="m2.36 7.98 2.35-1.33.04-.11-.04-.07H4.6l-4.05-.17-.28-.06L0 5.89l.03-.17.24-.16 4.29.33h.2l.02-.08-.12-.1-3.12-2.12-.36-.25-.18-.23-.08-.5.33-.36.55.06 3.98 3.14.17.57.17.53h.08l.18-1.9.34-3.77.19-.45.37-.25.29.14.24.34-.46 3.28h.11L8.7 1.98l.7-.86.27-.21h.52l.38.56-.17.58-2.22 2.88.04.05 3.53-.6.42.2.04.19-.16.4-3.87.88-.02.02.02.03 3.45.2.4.26.23.32-.04.24-.61.31-3.39-.81h-.09v.05l3.07 2.75.06.29-.16.23-.17-.03L7.15 6.8h-.07v.08l1.4 2.09.06.54-.08.18-.31.1-.33-.05-1.96-3.02-.07.04-.5 4.39-.16.18-.37.14-.3-.23-.16-.37.64-3.23-.01-.02-.07.01-2.67 3.38-.2.08-.36-.18.03-.33L4.7 6.69h-.03L2.06 9.28l-.56.07-.24-.23.03-.37.11-.12z"
                />
              </svg>
              Open in Claude
            </Menu.Item>

            <Menu.Item
              class="docs-copy-controls__menu-item"
              value="chatgpt"
              @select="handleOpenInChatGPT"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path d="M12 3a5 5 0 0 1 4.7 3.3A5 5 0 0 1 18 16a5 5 0 0 1-8.7 2.7A5 5 0 0 1 6 9a5 5 0 0 1 6-6Z" />
                <path d="m8 8 4-2 4 2v5l-4 2-4-2zM12 10v8" />
              </svg>
              Open in ChatGPT
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </div>

    <span class="docs-visually-hidden" role="status" aria-live="polite">{{ statusMessage }}</span>
  </div>
</template>
