export const barrelCode = `import {
  Breadcrumbs,
  BreadcrumbsCurrent,
} from "@dicehub/kappa";`;

export const granularCode = `import {
  Breadcrumbs,
  BreadcrumbsCurrent,
  BreadcrumbsEllipsis,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
  BreadcrumbsPage,
  BreadcrumbsRoot,
  BreadcrumbsSeparator,
} from "@dicehub/kappa/components/breadcrumbs";`;

export const previewCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root aria-label="Simulation path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/projects/rotor-study">Rotor study</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Breadcrumbs.Page>Run 042</Breadcrumbs.Page>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const basicCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/workspace">Workspace</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/simulations">Simulations</Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Breadcrumbs.Current>Run 042</Breadcrumbs.Current>
      </Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const separatorCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root aria-label="Dataset path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/data">Data</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator><span aria-hidden="true">/</span></Breadcrumbs.Separator>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/data/wind">Wind</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator><span aria-hidden="true">/</span></Breadcrumbs.Separator>
      <Breadcrumbs.Item><Breadcrumbs.Page>inlet.csv</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const sizesCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root
    v-for="size in ['sm', 'base']"
    :key="size"
    :size="size"
    :aria-label="\`${'${size}'} breadcrumb path\`"
  >
    <Breadcrumbs.List>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/models">Models</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Link href="/cases">Cases</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const iconsCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root aria-label="Resource path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link href="/">
          <svg viewBox="0 0 256 256" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M219.31 108.68 139.31 28.68a16 16 0 0 0-22.62 0l-80 80A15.87 15.87 0 0 0 32 120v96a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-56h32v56a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8v-96a15.87 15.87 0 0 0-4.69-11.32ZM208 208h-48v-56a8 8 0 0 0-8-8h-48a8 8 0 0 0-8 8v56H48v-88l80-80 80 80Z" />
          </svg>
          Home
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>Current Project</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const wrappingCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <div class="narrow-workspace-column">
    <Breadcrumbs.Root aria-label="Long simulation path">
      <Breadcrumbs.List>
        <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Link href="/projects/offshore-platform">Offshore platform verification</Breadcrumbs.Link></Breadcrumbs.Item>
        <Breadcrumbs.Separator />
        <Breadcrumbs.Item><Breadcrumbs.Page>Transient load case 2026-08</Breadcrumbs.Page></Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  </div>
</template>

<style scoped>
.narrow-workspace-column { inline-size: min(100%, 19rem); }
</style>`;

export const ellipsisCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root aria-label="Collapsed project path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Ellipsis /></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const menuCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
import { Dropdown } from "@dicehub/kappa/components/dropdown";
</script>

<template>
  <Breadcrumbs.Root aria-label="Collapsed simulation path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">Projects</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item>
        <Dropdown.Root>
          <Dropdown.Trigger class="ancestor-trigger">
            <Breadcrumbs.Ellipsis />
            <span class="visually-hidden">Show collapsed ancestors</span>
          </Dropdown.Trigger>
          <Dropdown.Content aria-label="Collapsed ancestors">
            <Dropdown.LinkItem value="models" href="/models">Models</Dropdown.LinkItem>
            <Dropdown.LinkItem value="rotor" href="/models/rotor">Rotor study</Dropdown.LinkItem>
          </Dropdown.Content>
        </Dropdown.Root>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>

<style scoped>
.ancestor-trigger {
  display: inline-flex;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.visually-hidden {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>`;

export const routerCode = `<script setup>
import { RouterLink } from "vue-router";
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root aria-label="Application path">
    <Breadcrumbs.List>
      <Breadcrumbs.Item>
        <Breadcrumbs.Link as-child>
          <RouterLink to="/projects">Projects</RouterLink>
        </Breadcrumbs.Link>
      </Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>Run 042</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const rtlCode = `<script setup>
import { Breadcrumbs } from "@dicehub/kappa/components/breadcrumbs";
</script>

<template>
  <Breadcrumbs.Root dir="rtl" aria-label="مسار المحاكاة">
    <Breadcrumbs.List>
      <Breadcrumbs.Item><Breadcrumbs.Link href="/projects">المشاريع</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Link href="/models">النماذج</Breadcrumbs.Link></Breadcrumbs.Item>
      <Breadcrumbs.Separator />
      <Breadcrumbs.Item><Breadcrumbs.Page>التشغيل ٠٤٢</Breadcrumbs.Page></Breadcrumbs.Item>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>`;

export const rootProps = [
  { name: "size", type: '"sm" | "base"', defaultValue: '"base"', description: "Trail density." },
];

export const linkProps = [
  {
    name: "href",
    type: "string",
    defaultValue: "—",
    description: "Native destination. Required when Link renders its own anchor.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges Link attributes and styling onto one child anchor, such as RouterLink.",
  },
];

export const parts = [
  { name: "Root", element: "nav", description: "Labelled navigation landmark; forwards native nav attributes." },
  { name: "List", element: "ol", description: "Ordered hierarchy of breadcrumb items." },
  { name: "Item", element: "li", description: "Wraps one link, current page, ellipsis, or composed control." },
  { name: "Link", element: "a", description: "Ancestor link; supports asChild for router-link composition." },
  { name: "Page / Current", element: "span", description: "Noninteractive current location with aria-current=page." },
  { name: "Separator", element: "li", description: "Decorative, assistive-technology-hidden separator with a replaceable default slot." },
  { name: "Ellipsis", element: "span", description: "Decorative collapsed-state indicator; it does not hide items by itself." },
];

export const exportsList = [
  { name: "Breadcrumbs", description: "Compound root with Root, List, Item, Link, Page, Current, Separator, and Ellipsis." },
  { name: "BreadcrumbsRoot", description: "Unaugmented root component." },
  { name: "BreadcrumbsList", description: "Ordered-list part." },
  { name: "BreadcrumbsItem", description: "List-item part." },
  { name: "BreadcrumbsLink", description: "Ancestor-link part." },
  { name: "BreadcrumbsPage", description: "Current-page part." },
  { name: "BreadcrumbsCurrent", description: "Alias of BreadcrumbsPage." },
  { name: "BreadcrumbsSeparator", description: "Decorative separator part." },
  { name: "BreadcrumbsEllipsis", description: "Decorative ellipsis part." },
  { name: "BREADCRUMBS_SIZES", description: "Supported root-size values." },
  { name: "BREADCRUMBS_DEFAULT_SIZE", description: "Default root size." },
  { name: "isBreadcrumbsSize / resolveBreadcrumbsSize", description: "Runtime size guard and resolver." },
  { name: "Breadcrumbs*Props / Breadcrumbs*Slots", description: "Public root and part TypeScript contracts." },
];
