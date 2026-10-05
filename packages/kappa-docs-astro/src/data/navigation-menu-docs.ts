export const barrelCode = `import { NavigationMenu } from "@dicehub/kappa";`;
export const granularCode = `import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";`;

export const previewCode = `<script setup lang="ts">
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
</script>

<template>
  <NavigationMenu.Root aria-label="Main navigation">
    <NavigationMenu.List>
      <NavigationMenu.Item value="platform">
        <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/projects">Projects</NavigationMenu.Link>
          <NavigationMenu.Link href="/automation">Automation</NavigationMenu.Link>
          <NavigationMenu.Link href="/reports">Reports</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="resources">
        <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
          <NavigationMenu.Link href="/support">Support</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="pricing">
        <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.ViewportPositioner>
      <NavigationMenu.Viewport />
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
</template>`;

export const compactCode = `<script setup lang="ts">
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
</script>

<template>
  <NavigationMenu.Root size="sm" aria-label="Workspace navigation">
    <NavigationMenu.List>
      <NavigationMenu.Item value="platform">
        <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
        <NavigationMenu.Content style="--kappa-navigation-menu-content-width: 13.5rem">
          <NavigationMenu.Link href="/projects">Projects</NavigationMenu.Link>
          <NavigationMenu.Link href="/reports">Reports</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="pricing">
        <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.ViewportPositioner>
      <NavigationMenu.Viewport />
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
</template>`;

export const controlledCode = `<script setup lang="ts">
import { ref } from "vue";
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";

const openMenu = ref(""); // Empty string closes the menu.
</script>

<template>
  <NavigationMenu.Root v-model:value="openMenu" disable-hover-trigger
    disable-pointer-leave-close aria-label="Application navigation">
    <NavigationMenu.List>
      <NavigationMenu.Item value="resources">
        <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
          <NavigationMenu.Link href="/support">Support</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="admin" disabled>
        <NavigationMenu.Trigger>Admin</NavigationMenu.Trigger>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.ViewportPositioner>
      <NavigationMenu.Viewport />
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
  <button type="button" @click="openMenu = 'resources'">Open resources</button>
  <button type="button" @click="openMenu = ''">Close panel</button>
</template>`;

export const verticalCode = `<script setup lang="ts">
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
</script>

<template>
  <NavigationMenu.Root orientation="vertical" aria-label="Workspace sections">
    <NavigationMenu.List>
      <NavigationMenu.Item value="platform">
        <NavigationMenu.Trigger>Platform</NavigationMenu.Trigger>
        <NavigationMenu.Content style="--kappa-navigation-menu-content-width: 16rem">
          <NavigationMenu.Link href="/projects">Projects</NavigationMenu.Link>
          <NavigationMenu.Link href="/reports">Reports</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="settings">
        <NavigationMenu.Link href="/settings">Settings</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.ViewportPositioner align="start">
      <NavigationMenu.Viewport />
    </NavigationMenu.ViewportPositioner>
  </NavigationMenu.Root>
</template>`;

export const rtlCode = `<script setup lang="ts">
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
import { DirectionProvider } from "@dicehub/kappa/components/direction-provider";
</script>

<template>
  <DirectionProvider locale="ar">
    <NavigationMenu.Root aria-label="التنقل الرئيسي">
      <NavigationMenu.List>
        <NavigationMenu.Item value="platform">
          <NavigationMenu.Trigger>المنصة</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/projects">المشاريع</NavigationMenu.Link>
            <NavigationMenu.Link href="/reports">التقارير</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.ViewportPositioner>
        <NavigationMenu.Viewport />
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.Root>
  </DirectionProvider>
</template>`;

export const linksCode = `<script setup lang="ts">
import { NavigationMenu } from "@dicehub/kappa/components/navigation-menu";
</script>

<template>
  <NavigationMenu.Root size="sm" aria-label="Workspace pages">
    <NavigationMenu.List>
      <NavigationMenu.Item value="overview">
        <NavigationMenu.Link href="/overview" current>Overview</NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="projects">
        <NavigationMenu.Link href="/projects">Projects</NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="settings">
        <NavigationMenu.Link href="/settings">Settings</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</template>`;

export const routerCode = `<NavigationMenu.Link as-child :current="route.path === '/projects'">
  <RouterLink to="/projects">Projects</RouterLink>
</NavigationMenu.Link>`;

export const compositionCode = `NavigationMenu.Root
├── NavigationMenu.List
│   ├── NavigationMenu.Item
│   │   ├── NavigationMenu.Trigger
│   │   └── NavigationMenu.Content
│   │       └── NavigationMenu.Link
│   ├── NavigationMenu.Item
│   │   └── NavigationMenu.Link
│   └── NavigationMenu.Indicator (optional)
└── NavigationMenu.ViewportPositioner
    └── NavigationMenu.Viewport`;
