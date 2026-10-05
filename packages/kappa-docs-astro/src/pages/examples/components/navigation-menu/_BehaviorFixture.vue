<script setup lang="ts">
import { NavigationMenu, useNavigationMenu } from "@dicehub/kappa/components/navigation-menu";

const provider = useNavigationMenu();
// Exercise untyped callers without adding unsupported options to the public API.
const camelCaseMountOptions: Record<string, unknown> = { lazyMount: true, unmountOnExit: true };
const kebabCaseMountOptions: Record<string, unknown> = { "lazy-mount": true, "unmount-on-exit": true };

const menus = [
  { name: "hover-only", provider: false, disableClickTrigger: true, mountOptions: {} },
  { name: "eager", provider: false, disableClickTrigger: false, mountOptions: camelCaseMountOptions },
  { name: "eager-provider", provider: true, disableClickTrigger: false, mountOptions: kebabCaseMountOptions },
];
</script>

<template>
  <section v-for="menu in menus" :key="menu.name" :data-fixture="menu.name">
    <component :is="menu.provider ? NavigationMenu.RootProvider : NavigationMenu.Root"
      v-bind="menu.provider ? { value: provider, ...menu.mountOptions } : { ...menu.mountOptions, disableClickTrigger: menu.disableClickTrigger, openDelay: 500 }"
      :aria-label="menu.name">
      <NavigationMenu.List>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content style="--kappa-navigation-menu-content-width: 16rem">
            <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
            <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.ViewportPositioner align="start"><NavigationMenu.Viewport /></NavigationMenu.ViewportPositioner>
    </component>
  </section>
</template>

<style scoped>section { min-height: 14rem; padding: 2rem; }</style>
