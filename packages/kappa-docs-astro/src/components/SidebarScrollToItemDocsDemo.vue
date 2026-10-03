<script setup lang="ts">
import { ref } from "vue";
import { Sidebar, Button } from "@dicehub/kappa";
import { FileText, House, Settings } from "@lucide/vue";

const root = ref<HTMLElement>();
const selected = ref("Overview");
const items = ["Overview", ...Array.from({ length: 20 }, (_, index) => `Report ${index + 1}`), "Settings"];

// Scroll only Sidebar.Content. Native scrollIntoView can also move the outer page.
function scrollToItem(label: string, onlyIfNeeded = false) {
  const content = root.value?.querySelector<HTMLElement>('[data-slot="sidebar-content"]');
  const item = content?.querySelector<HTMLElement>(`[data-scroll-item="${CSS.escape(label)}"]`);
  if (!content || !item) return;
  selected.value = label;
  const box = content.getBoundingClientRect();
  const target = item.getBoundingClientRect();
  const top = target.top - box.top - content.clientTop + content.scrollTop;
  if (onlyIfNeeded && top >= content.scrollTop && top + target.height <= content.scrollTop + content.clientHeight) return;
  content.scrollTo({
    top: top - (content.clientHeight - target.height) / 2,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}
</script>

<template>
  <div ref="root" class="sidebar-scroll-demo" data-sidebar-demo="scroll-to-item">
    <Sidebar.Provider :mobile-breakpoint="0" collapsible="none" width="100%" class="sidebar-scroll-demo__layout">
      <Sidebar.Root label="scroll-to-item navigation">
        <Sidebar.Header><strong>Workspace</strong></Sidebar.Header>
        <Sidebar.Content aria-label="Report navigation">
          <Sidebar.Group><Sidebar.GroupLabel>Reports</Sidebar.GroupLabel>
            <Sidebar.Menu><Sidebar.MenuItem v-for="item in items" :key="item">
              <Sidebar.MenuButton :data-scroll-item="item" :active="selected === item"
                :icon="item === 'Overview' ? House : item === 'Settings' ? Settings : FileText" @click="selected = item">{{ item }}</Sidebar.MenuButton>
            </Sidebar.MenuItem></Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <div class="sidebar-scroll-demo__actions">
        <strong>Scroll to item</strong>
        <p>Jump to a navigation item. Only the list scrolls; keyboard focus stays on the button.</p>
        <div class="sidebar-scroll-demo__buttons">
          <Button v-for="item in ['Overview', 'Report 12', 'Settings']" :key="item" size="sm" variant="secondary" @click="scrollToItem(item)">Scroll to {{ item }}</Button>
          <Button size="sm" variant="ghost" @click="scrollToItem('Settings', true)">Keep Settings visible</Button>
        </div>
        <output role="status">Selected: {{ selected }}</output>
      </div>
    </Sidebar.Provider>
  </div>
</template>

<style src="./sidebar-scroll-demo.css"></style>
