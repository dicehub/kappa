<script setup lang="ts">
import { computed, ref } from "vue";
import { Collapsible } from "@dicehub/kappa";
import { CodeBlock, ShikiProvider } from "@dicehub/kappa/components/code-block";
import { CodeHighlighted } from "@dicehub/kappa/components/code-highlighted";

const open = ref(false);
const short = ref(false);
const collapsible = ref(true);
const previewLines = ref(3);
const lastRequest = ref("");
const plainLanguage = ref("text");
const source = computed(() => short.value ? "const short = true;" : Array.from(
  { length: 14 }, (_, index) => `const row${index + 1} = ${index + 1};`,
).join("\n"));
</script>

<template>
  <main style="max-width: 40rem; margin: 1rem auto">
    <h1>Collapsible code</h1>
    <button @click="open = !open">Toggle externally</button>
    <button @click="short = !short">Change source length</button>
    <button @click="collapsible = !collapsible">Toggle collapse feature</button>
    <button @click="previewLines = previewLines === 3 ? 20 : 3">Change preview size</button>
    <output aria-label="Requested state">{{ lastRequest }}</output>
    <ShikiProvider :languages="['typescript']">
      <section aria-label="Plain text in provider">
        <button @click="plainLanguage = plainLanguage === 'text' ? 'plain' : 'txt'">Change plain language</button>
        <CodeBlock :code="'const unhighlighted = true;'" :lang="plainLanguage" title="Plain source" show-copy-button />
      </section>
      <section aria-label="Controlled block">
        <CodeBlock
          v-model:open="open"
          :code="source"
          title="Controlled source"
          lang="typescript"
          :collapsible="collapsible"
          :collapsed-lines="previewLines"
          show-line-numbers
          show-copy-button
          @open-change="lastRequest = String($event.open)"
        />
      </section>
      <section aria-label="Default preview">
        <CodeBlock :code="source" lang="typescript" title="Default source" collapsible />
      </section>
      <section aria-label="Legacy block">
        <CodeHighlighted
          :code="source"
          lang="typescript"
          title="Legacy source"
          collapsible
          default-open
          expand-label="Show source"
          collapse-label="Hide source"
        />
      </section>
      <section aria-label="Wrapped single line">
        <CodeBlock
          code="const message = 'Use completed runs from the current project.';"
          lang="typescript"
          collapsible
          :collapsed-lines="1"
          show-copy-button
          wrap
        />
      </section>
      <section aria-label="Outer collapse control">
        <Collapsible.Root default-open>
          <Collapsible.Trigger>Toggle outer content</Collapsible.Trigger>
          <CodeBlock code="const answer = 42;" lang="typescript" title="Header actions">
            <template #actions>
              <Collapsible.Trigger>Toggle from code header</Collapsible.Trigger>
            </template>
          </CodeBlock>
          <Collapsible.Content>Outer details</Collapsible.Content>
        </Collapsible.Root>
      </section>
    </ShikiProvider>
  </main>
</template>
