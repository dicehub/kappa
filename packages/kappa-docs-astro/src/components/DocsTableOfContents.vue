<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import type { TocItemData } from "@dicehub/kappa/components/table-of-contents";
import DocsTocNavigation from "./DocsTocNavigation.vue";

interface DocsTocItem extends TocItemData {
  href: string;
  label: string;
}

const items = ref<DocsTocItem[]>([]);
const title = ref("On this page");
const navigationRevision = ref(0);
const target = shallowRef<HTMLElement | null>(null);
let source: HTMLElement | null = null;

const getDepth = (link: HTMLAnchorElement, root: HTMLElement) => {
  let depth = 2;
  let list = link.closest("ul");

  while (list) {
    const parentList = list.parentElement?.closest("ul") ?? null;
    if (!parentList || !root.contains(parentList)) break;
    depth += 1;
    list = parentList;
  }

  return depth;
};

const restoreSource = () => {
  if (source?.isConnected) {
    source.hidden = false;
    source.classList.remove("docs-page-toc__fallback");
    source.classList.add("docs-page-toc__inner");
  }
  source = null;
};

const syncTableOfContents = () => {
  const nextTarget = document.querySelector<HTMLElement>(".docs-page-toc");
  if (nextTarget === target.value && source?.isConnected) return;

  restoreSource();
  target.value = null;
  items.value = [];

  const nextSource = nextTarget?.querySelector<HTMLElement>(
    ":scope > .docs-page-toc__inner:not(.docs-page-toc__component)",
  );
  if (!nextTarget || !nextSource) return;

  const seen = new Set<string>();
  const nextItems = [...nextSource.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    .map((link): DocsTocItem | null => {
      const value = link.dataset.tocLink ?? link.hash.slice(1);
      const label = link.textContent?.trim() ?? "";
      if (!value || !label || seen.has(value) || !document.getElementById(value)) return null;
      seen.add(value);
      return {
        value,
        depth: getDepth(link, nextSource),
        href: link.getAttribute("href") ?? `#${value}`,
        label,
      };
    })
    .filter((item): item is DocsTocItem => item !== null);

  if (!nextItems.length) return;

  title.value = nextSource.querySelector(".docs-page-toc__title")?.textContent?.trim() || "On this page";
  source = nextSource;
  source.hidden = true;
  source.classList.remove("docs-page-toc__inner");
  source.classList.add("docs-page-toc__fallback");
  items.value = nextItems;
  navigationRevision.value += 1;
  target.value = nextTarget;
};

onMounted(() => {
  syncTableOfContents();
  document.addEventListener("astro:page-load", syncTableOfContents);
});

onBeforeUnmount(() => {
  document.removeEventListener("astro:page-load", syncTableOfContents);
  restoreSource();
});
</script>

<template>
  <Teleport v-if="target && items.length" :to="target">
    <DocsTocNavigation :key="navigationRevision" :items="items" :title="title" />
  </Teleport>
</template>
