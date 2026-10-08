<script setup lang="ts">
import { Sidebar } from "@dicehub/kappa/components/sidebar";
import { CommandPalette } from "@dicehub/kappa/components/command-palette";
import { ref } from "vue";
const disabled = ref(false);
const peek = ref(true);
const commandsOpen = ref(false);
const iconOpen = ref(true);
</script>

<template>
  <Sidebar.Provider id="outer-sidebar" peekable collapsible="offcanvas" :default-open="false" :mobile-breakpoint="0" class="sidebar-ownership-fixture">
    <Sidebar.Root label="Outer navigation"><Sidebar.Content><a href="#outer">Outer page</a></Sidebar.Content></Sidebar.Root>
    <main class="sidebar-ownership-fixture__main">
      <Sidebar.Trigger peek />
      <Sidebar.Provider id="inner-sidebar" peekable collapsible="offcanvas" :default-open="false" :mobile-breakpoint="0" class="sidebar-ownership-fixture__inner">
        <Sidebar.Root label="Inner navigation"><Sidebar.Content><a href="#inner">Inner page</a></Sidebar.Content></Sidebar.Root>
        <div>
          <Sidebar.Trigger :peek="peek" as-child><button type="button" :disabled="disabled">Inner toggle</button></Sidebar.Trigger>
          <button type="button" @keydown.d="disabled = true" @keydown.p="peek = false" @keydown.e="disabled = false; peek = true">Outside navigation</button>
        </div>
      </Sidebar.Provider>
    </main>
  </Sidebar.Provider>
  <button type="button" @click="commandsOpen = true">Open retained commands</button>
  <CommandPalette.Dialog v-model:open="commandsOpen" :lazy-mount="false" :unmount-on-exit="false"
    :ids="{ content: 'retained-command-content' }" aria-label="Retained commands">
    <CommandPalette.Panel :open="commandsOpen" :items="['Overview', 'Projects']" @close="commandsOpen = false">
      <CommandPalette.Input />
      <CommandPalette.List><CommandPalette.Results v-slot="{ item }"><CommandPalette.Item :value="item">{{ item }}</CommandPalette.Item></CommandPalette.Results></CommandPalette.List>
    </CommandPalette.Panel>
  </CommandPalette.Dialog>
  <Sidebar.Provider id="icon-no-collapse" v-model:open="iconOpen" resizable :collapse-on-resize="false"
    :default-width="240" :mobile-breakpoint="0" class="sidebar-icon-resize-fixture" @keydown.c="iconOpen = false">
    <Sidebar.Root label="Icon navigation with resizing">
      <Sidebar.Content><Sidebar.Menu><Sidebar.MenuItem><Sidebar.MenuButton href="#icon-page">Icon page</Sidebar.MenuButton></Sidebar.MenuItem></Sidebar.Menu></Sidebar.Content>
      <Sidebar.ResizeHandle label="Resize pinned icon navigation" />
    </Sidebar.Root>
    <main><Sidebar.Trigger /></main>
  </Sidebar.Provider>
</template>

<style>
.sidebar-ownership-fixture { block-size: 35rem; }
.sidebar-ownership-fixture__main { flex: 1; min-inline-size: 0; }
.sidebar-ownership-fixture__inner { block-size: 20rem; margin-block-start: 3rem; --kappa-sidebar-peek-top: 3rem; --kappa-sidebar-peek-gap: 1rem; }
.sidebar-icon-resize-fixture { block-size: 20rem; }
</style>
