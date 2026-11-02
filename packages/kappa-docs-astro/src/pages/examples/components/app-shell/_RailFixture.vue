<script setup lang="ts">
import { ref } from "vue";
import { AppShell } from "@dicehub/kappa/blocks/app-shell";
import { Button } from "@dicehub/kappa/components/button";
import { PanelLeft } from "@lucide/vue";

const panels = ref(false);
const tools = ref(true);
</script>

<template>
  <AppShell.Root appearance="paneled" fill rail-label="Project tools">
    <template #toolbar>
      <Button @click="panels = !panels">{{ panels ? 'Hide panels' : 'Show panels' }}</Button>
      <Button @click="tools = !tools">{{ tools ? 'Hide tools' : 'Show tools' }}</Button>
    </template>
    <template v-if="panels" #default>
      <AppShell.Panels><AppShell.Page title="Project content" /></AppShell.Panels>
    </template>
    <template v-if="tools" #rail="context">
      <Button :icon="PanelLeft" variant="ghost" shape="square" aria-label="Toggle navigation"
        :aria-expanded="context.isMobile ? context.mobileOpen : context.open" @click="context.toggle" />
    </template>
  </AppShell.Root>
</template>
