<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SidebarLayout, SIDEBAR_LAYOUT_VARIANTS, type SidebarLayoutVariant } from "@dicehub/kappa/blocks/sidebar-layout";
import { Sidebar, type SidebarCollapsibleMode } from "@dicehub/kappa/components/sidebar";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
import { Button } from "@dicehub/kappa/components/button";
import { Folder } from "@lucide/vue";

const ready = ref(false);
const variant = ref<SidebarLayoutVariant>("workspace");
const collapsible = ref<SidebarCollapsibleMode>("icon");
const end = ref(false);
const rtl = ref(false);
const available = ref(false);
const cssWidth = ref<string>();
const width = ref(260);
const long = ref(false);
onMounted(() => {
  const params = new URLSearchParams(location.search);
  const requestedVariant = params.get("variant") as SidebarLayoutVariant;
  if (SIDEBAR_LAYOUT_VARIANTS.includes(requestedVariant)) variant.value = requestedVariant;
  if (params.get("collapsible") === "offcanvas" || params.get("collapsible") === "none") collapsible.value = params.get("collapsible") as SidebarCollapsibleMode;
  end.value = params.get("side") === "end";
  rtl.value = params.has("rtl");
  available.value = params.has("available");
  if (params.has("css-width")) cssWidth.value = "20rem";
  ready.value = true;
});
</script>

<template>
  <div class="centering-fixture" :data-ready="ready || undefined">
    <div class="centering-fixture__controls">
      <Button variant="secondary" @click="width = 180">180px</Button>
      <Button variant="secondary" @click="width = 400">400px</Button>
      <Button variant="secondary" @click="long = !long">Toggle long page</Button>
      <Button variant="secondary" @click="end = !end">Change side</Button>
    </div>
    <DirectionProvider :locale="rtl ? 'ar' : 'en'">
      <SidebarLayout v-model:resize-width="width" :resizable="!cssWidth" :width="cssWidth"
        :variant="variant" :collapsible="collapsible" :side="end ? 'end' : 'start'" :dir="rtl ? 'rtl' : 'ltr'"
        :content-alignment="available ? 'available' : 'shell'" :mobile-breakpoint="1000"
        :default-open="true" peekable :trigger-props="{ peek: collapsible === 'offcanvas' }"
        full-screen-on-mobile label="Centering navigation" class="centering-fixture__shell">
        <template #navigation><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton :icon="Folder" tooltip="Projects">Projects</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></template>
        <template #toolbar>Page title</template>
        <main class="centering-fixture__article">
          <h1>Reading column</h1>
          <p v-for="n in long ? 40 : 1" :key="n">Read the project brief and record the next steps for your team.</p>
        </main>
      </SidebarLayout>
    </DirectionProvider>
  </div>
</template>

<style>
.centering-fixture { padding: 1rem 2rem; }
.centering-fixture__controls { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-block-end: 1rem; }
.centering-fixture .centering-fixture__shell { block-size: 35rem; }
.centering-fixture__article { max-inline-size: 44rem; margin-inline: auto; padding: 2rem; }
.centering-fixture__article h1 { font-size: 1.5rem; }
.centering-fixture__article p { line-height: 1.6; }
@media (max-width: 999px) { .centering-fixture { padding-inline: 0; } .centering-fixture__article { padding: 1rem; } }
</style>
