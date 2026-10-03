<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import {
  TableOfContents,
  useToc,
  type TocActiveChangeDetails,
  type TocItemData,
} from "@dicehub/kappa/components/table-of-contents";

const props = defineProps<{
  items: (TocItemData & { href: string; label: string })[];
  title: string;
}>();

let navigationTarget: string | null = null;
let navigationInProgress = false;
let scrollFrame: number | null = null;
const observedIds = new Set<string>();
let updatingActive = false;

const isAtPageEnd = () =>
  window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

const setActiveItem = (value: string) => {
  if (api.value.activeIds.length !== 1 || api.value.activeIds[0] !== value) {
    updatingActive = true;
    try {
      api.value.setActiveIds([value]);
    } finally {
      updatingActive = false;
    }
  }
};

const getObservedItem = (activeIds: string[] = []) => {
  for (const value of activeIds) observedIds.add(value);
  const reached = props.items.filter((item) => {
    if (!observedIds.has(item.value)) return false;
    const heading = document.getElementById(item.value);
    return heading && heading.getBoundingClientRect().top <=
      (Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0) + 1;
  });
  return reached.at(-1)?.value ?? activeIds[0];
};

const handleActiveChange = (details: TocActiveChangeDetails) => {
  if (updatingActive) return;
  const observedItem = getObservedItem(details.activeIds);
  const value = navigationTarget ??
    (isAtPageEnd() ? props.items.at(-1)?.value : observedItem);
  if (value) setActiveItem(value);
};

const api = useToc(() => ({
  id: "docs-page-toc",
  items: props.items,
  defaultActiveIds: [props.items[0]!.value],
  autoScroll: false,
  rootMargin: "-71px 0px 0px 0px",
  onActiveChange: handleActiveChange,
}));

const activateAnchor = (value: string) => {
  const heading = document.getElementById(value);
  if (!heading) return;
  const margin = Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
  const destination = Math.max(0, Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    heading.getBoundingClientRect().top + window.scrollY - margin,
  ));
  navigationTarget = value;
  navigationInProgress = Math.abs(window.scrollY - destination) > 2;
  setActiveItem(value);
};

const handleLinkClick = (event: MouseEvent, value: string) => {
  if (event.defaultPrevented || event.button !== 0 ||
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  activateAnchor(value);
};

const activateInitialHash = () => {
  const item = props.items.find((item) => item.href === window.location.hash);
  if (item) activateAnchor(item.value);
};

const handleScroll = () => {
  if (navigationTarget) {
    if (navigationInProgress) return;
    navigationTarget = null;
  }
  if (scrollFrame !== null) return;
  scrollFrame = requestAnimationFrame(() => {
    const lastItem = props.items.at(-1);
    if (!navigationTarget && lastItem && isAtPageEnd()) setActiveItem(lastItem.value);
    scrollFrame = null;
  });
};

const handleScrollEnd = () => {
  navigationInProgress = false;
  if (navigationTarget) return;
  const value = isAtPageEnd() ? props.items.at(-1)?.value : getObservedItem();
  if (value) setActiveItem(value);
};
const cancelNavigation = () => {
  navigationTarget = null;
  navigationInProgress = false;
};
const handlePopState = () => {
  const destination = props.items.find((item) => item.value === navigationTarget);
  if (destination?.href === window.location.hash) return;
  cancelNavigation();
};
const handleKeyDown = (event: KeyboardEvent) => {
  if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
    cancelNavigation();
  }
};

onMounted(() => {
  activateInitialHash();
  window.addEventListener("popstate", handlePopState);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("scrollend", handleScrollEnd);
  window.addEventListener("wheel", cancelNavigation, { passive: true });
  window.addEventListener("touchmove", cancelNavigation, { passive: true });
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", handlePopState);
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("scrollend", handleScrollEnd);
  window.removeEventListener("wheel", cancelNavigation);
  window.removeEventListener("touchmove", cancelNavigation);
  window.removeEventListener("keydown", handleKeyDown);
  if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
});
</script>

<template>
  <TableOfContents.RootProvider
    class="docs-page-toc__inner docs-page-toc__component"
    :value="api"
  >
    <TableOfContents.Nav id="docs-page-toc-nav">
      <TableOfContents.Title as-child><span>{{ title }}</span></TableOfContents.Title>
      <TableOfContents.List>
        <TableOfContents.Indicator aria-hidden="true" />
        <TableOfContents.Item v-for="item in items" :key="item.value" :item="item">
          <TableOfContents.Link
            :data-toc-link="item.value"
            :href="item.href"
            @click="handleLinkClick($event, item.value)"
          >
            {{ item.label }}
          </TableOfContents.Link>
        </TableOfContents.Item>
      </TableOfContents.List>
    </TableOfContents.Nav>
  </TableOfContents.RootProvider>
</template>
