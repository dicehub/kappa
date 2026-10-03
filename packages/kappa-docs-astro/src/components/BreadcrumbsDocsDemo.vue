<script setup lang="ts">
import { Menu } from "@ark-ui/vue/menu";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";

type DemoVariant =
  | "preview"
  | "basic"
  | "separator"
  | "sizes"
  | "icons"
  | "wrapping"
  | "ellipsis"
  | "menu"
  | "router"
  | "rtl";

withDefaults(defineProps<{ variant?: DemoVariant }>(), { variant: "preview" });
</script>

<template>
  <div class="breadcrumbs-demo" :data-breadcrumbs-demo="variant">
    <div v-if="variant === 'preview'" class="breadcrumbs-demo__workspace-strip">
      <span class="breadcrumbs-demo__context">Simulation workspace</span>
      <Breadcrumbs.Root aria-label="Simulation path">
        <Breadcrumbs.List>
          <Breadcrumbs.Item><Breadcrumbs.Link href="#projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item><Breadcrumbs.Link href="#rotor-study">Rotor study</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </div>

    <Breadcrumbs.Root v-else-if="variant === 'basic'">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#workspace">Workspace</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Link href="#simulations">Simulations</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Current>Run 042</Breadcrumbs.Current></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <Breadcrumbs.Root v-else-if="variant === 'separator'" aria-label="Dataset path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#data">Data</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator><span aria-hidden="true">/</span></Breadcrumbs.Separator>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#wind">Wind</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator><span aria-hidden="true">/</span></Breadcrumbs.Separator>
        <Breadcrumbs.Item><Breadcrumbs.Page>inlet.csv</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <div v-else-if="variant === 'sizes'" class="breadcrumbs-demo__sizes">
      <div v-for="size in ['sm', 'base'] as const" :key="size" class="breadcrumbs-demo__size-row">
        <code>{{ size }}</code>
        <Breadcrumbs.Root :size="size" :aria-label="`${size} breadcrumb path`">
          <Breadcrumbs.List>
            <Breadcrumbs.Item><Breadcrumbs.Link :href="`#${size}-models`">Models</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item><Breadcrumbs.Link :href="`#${size}-cases`">Cases</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
          </Breadcrumbs.List>
        </Breadcrumbs.Root>
      </div>
    </div>

    <Breadcrumbs.Root v-else-if="variant === 'icons'" aria-label="Resource path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link href="#icon-home">
            <svg class="breadcrumbs-demo__content-icon" viewBox="0 0 256 256" aria-hidden="true">
              <path d="M219.31 108.68 139.31 28.68a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32ZM208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80 80 80Z" />
            </svg>
            Home
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Link href="#icon-projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>Current Project</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <div v-else-if="variant === 'wrapping'" class="breadcrumbs-demo__narrow-column">
      <Breadcrumbs.Root aria-label="Long simulation path">
        <Breadcrumbs.List>
          <Breadcrumbs.Item><Breadcrumbs.Link href="#long-projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item>
            <Breadcrumbs.Link href="#offshore-platform">Offshore platform verification</Breadcrumbs.Link>
          </Breadcrumbs.Item>
          <Breadcrumbs.Separator />
          <Breadcrumbs.Item><Breadcrumbs.Page>Transient load case 2026-08</Breadcrumbs.Page></Breadcrumbs.Item>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </div>

    <Breadcrumbs.Root v-else-if="variant === 'ellipsis'" aria-label="Collapsed project path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#ellipsis-projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Ellipsis /></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <Breadcrumbs.Root v-else-if="variant === 'menu'" aria-label="Collapsed simulation path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#menu-projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item>
          <Menu.Root id="breadcrumbs-ancestor-menu" :positioning="{ placement: 'bottom-start', gutter: 6 }">
            <Menu.Trigger class="breadcrumbs-demo__ancestor-trigger">
              <Breadcrumbs.Ellipsis />
              <span class="docs-visually-hidden">Show collapsed ancestors</span>
            </Menu.Trigger>
            <Menu.Positioner class="breadcrumbs-demo__menu-positioner">
              <Menu.Content class="breadcrumbs-demo__menu" aria-label="Collapsed ancestors">
                <Menu.Item value="models" class="breadcrumbs-demo__menu-item" as-child>
                  <a href="#menu-models">Models</a>
                </Menu.Item>
                <Menu.Item value="rotor" class="breadcrumbs-demo__menu-item" as-child>
                  <a href="#menu-rotor">Rotor study</a>
                </Menu.Item>
                <Menu.Item value="mesh" class="breadcrumbs-demo__menu-item" as-child>
                  <a href="#menu-mesh">Mesh variants</a>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <Breadcrumbs.Root v-else-if="variant === 'router'" aria-label="Application path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link as-child>
            <a href="#router-projects" data-router-link="true">Projects</a>
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>

    <Breadcrumbs.Root v-else dir="rtl" aria-label="مسار المحاكاة">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="#rtl-projects">المشاريع</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Link href="#rtl-models">النماذج</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>التشغيل ٠٤٢</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  </div>
</template>

<style scoped>
.breadcrumbs-demo {
  display: grid;
  width: min(100%, 34rem);
  min-width: 0;
  min-height: 8rem;
  place-items: center;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.breadcrumbs-demo__workspace-strip {
  display: grid;
  width: min(100%, 30rem);
  min-width: 0;
  gap: 0.65rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.6rem;
  background: var(--docs-base);
  padding: 1rem 1.1rem;
}

.breadcrumbs-demo__context {
  color: var(--docs-subtle);
  font-size: 0.65rem;
  font-weight: 650;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.breadcrumbs-demo__sizes {
  display: grid;
  width: min(100%, 27rem);
  gap: 1rem;
}

.breadcrumbs-demo__size-row {
  display: grid;
  min-width: 0;
  grid-template-columns: 3rem minmax(0, 1fr);
  align-items: center;
  gap: 0.8rem;
}

.breadcrumbs-demo__size-row code {
  color: var(--docs-subtle);
  font-size: 0.7rem;
}

.breadcrumbs-demo__narrow-column {
  width: min(100%, 19rem);
  min-width: 0;
  border-inline-start: 2px solid var(--docs-line);
  padding-inline-start: 0.9rem;
}

.breadcrumbs-demo :deep([data-slot="breadcrumbs-link"]),
.breadcrumbs-demo :deep([data-slot="breadcrumbs-page"]) {
  min-width: 0;
}

.breadcrumbs-demo__content-icon {
  width: 1rem;
  height: 1rem;
  flex: none;
  fill: currentColor;
}

.breadcrumbs-demo__ancestor-trigger {
  display: inline-flex;
  width: 1.75rem;
  height: 1.75rem;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 0.35rem;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.breadcrumbs-demo__ancestor-trigger:hover { background: var(--docs-tint); }
.breadcrumbs-demo__ancestor-trigger:focus-visible {
  outline: 2px solid var(--kappa-focus, currentColor);
  outline-offset: 2px;
}

.breadcrumbs-demo__menu-positioner { z-index: 4; }
.breadcrumbs-demo__menu {
  z-index: 4;
  display: grid;
  min-width: 10rem;
  gap: 0.15rem;
  border: 1px solid var(--docs-line);
  border-radius: 0.5rem;
  background: var(--docs-base);
  padding: 0.3rem;
  outline: none;
}

.breadcrumbs-demo__menu[hidden] { display: none; }
.breadcrumbs-demo__menu-item {
  border-radius: 0.3rem;
  color: var(--docs-default);
  padding: 0.45rem 0.55rem;
  font-size: 0.78rem;
  text-decoration: none;
  outline: none;
}

.breadcrumbs-demo__menu-item[data-highlighted] {
  background: var(--docs-tint);
  color: var(--docs-strong);
}

@media (max-width: 520px) {
  .breadcrumbs-demo { min-height: 10rem; }
  .breadcrumbs-demo__workspace-strip { padding: 0.85rem; }
  .breadcrumbs-demo__size-row { grid-template-columns: 1fr; gap: 0.35rem; }
}

@media (forced-colors: active) {
  .breadcrumbs-demo__workspace-strip,
  .breadcrumbs-demo__menu { border-color: CanvasText; }
  .breadcrumbs-demo__ancestor-trigger:focus-visible { outline-color: Highlight; }
}
</style>
