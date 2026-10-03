export const barrelCode = `import { Banner, BannerAction } from "@dicehub/kappa";`;

export const granularCode = `import { Banner, BannerAction } from "@dicehub/kappa/components/banner";`;

const iconMarkup = `<template #icon>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 7v4M8 5h.01" />
      </svg>
    </template>`;

export const previewCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    title="Update available"
    description="A new version is ready to install."
  >
    ${iconMarkup}
  </Banner>
</template>`;

export const usageCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    role="status"
    title="Mesh generated"
    description="The surface mesh is ready for review."
  >
    ${iconMarkup}
  </Banner>
</template>`;

export const variantsCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner title="Update available" description="A new version is ready." />
  <Banner
    variant="alert"
    title="Session expiring"
    description="Your session will expire in 5 minutes."
  />
  <Banner
    variant="error"
    title="Save failed"
    description="We couldn't save your changes."
  />
  <Banner
    variant="secondary"
    title="Maintenance scheduled"
    description="This service will be unavailable for 10 minutes."
  />
</template>`;

export const iconCode = `<script setup>
import { h } from "vue";
import { Banner } from "@dicehub/kappa/components/banner";

const InfoIcon = (props) => h(
  "svg",
  { ...props, viewBox: "0 0 16 16", fill: "none" },
  [
    h("circle", { cx: 8, cy: 8, r: 6 }),
    h("path", { d: "M8 7v4M8 5h.01" }),
  ],
);
</script>

<template>
  <Banner
    :icon="InfoIcon"
    :icon-props="{ 'stroke-width': 1.75 }"
    title="Review required"
    description="Review the boundary conditions before running the case."
  />
</template>`;

export const actionCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    title="Update available"
    description="A new version is ready to install."
  >
    <template #action>
      <Banner.Action>Update now</Banner.Action>
      <Banner.Action variant="ghost">Dismiss</Banner.Action>
    </template>
  </Banner>
</template>`;

export const multipleActionsCode = `<script setup>
import { Banner, BannerAction } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    variant="alert"
    title="Session expiring"
    description="Your session will expire in 5 minutes."
  >
    <template #action>
      <BannerAction variant="secondary">Dismiss</BannerAction>
      <BannerAction>Extend session</BannerAction>
    </template>
  </Banner>
</template>`;

export const compactCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    size="sm"
    description="A DNS record for solver.dicehub.dev already exists in this zone."
  >
    <template #action>
      <Banner.Action>Manage DNS</Banner.Action>
    </template>
  </Banner>
</template>`;

export const customContentCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner title="Custom content supported">
    <template #description>
      Read the <a href="/docs/installation">installation guide</a>
      before updating the workspace.
    </template>
  </Banner>
</template>`;

export const rtlCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <div dir="rtl">
    <Banner
      variant="secondary"
      title="اكتمل التحليل"
      description="النتائج جاهزة للمراجعة."
    >
      <template #action>
        <Banner.Action>عرض النتائج</Banner.Action>
      </template>
    </Banner>
  </div>
</template>`;

export const roleCode = `<script setup>
import { Banner } from "@dicehub/kappa/components/banner";
</script>

<template>
  <Banner
    role="status"
    title="Export complete"
    description="The report is ready to download."
  />

  <Banner
    role="alert"
    variant="error"
    title="Connection lost"
    description="Changes are no longer being saved."
  />
</template>`;

export const bannerProps = [
  {
    name: "variant",
    type: '"default" | "alert" | "error" | "secondary"',
    defaultValue: '"default"',
    description: "Selects the semantic visual treatment.",
  },
  {
    name: "size",
    type: '"base" | "sm"',
    defaultValue: '"base"',
    description: "Sets the banner density and the size of composed actions.",
  },
  {
    name: "icon",
    type: "Component",
    defaultValue: "-",
    description: "Vue component rendered before the banner copy.",
  },
  {
    name: "iconProps",
    type: "Record<string, unknown>",
    defaultValue: "{}",
    description: "Props forwarded to the icon component.",
  },
  {
    name: "title",
    type: "string",
    defaultValue: "-",
    description: "Primary text for structured content.",
  },
  {
    name: "description",
    type: "string",
    defaultValue: "-",
    description: "Supporting text for structured content.",
  },
  {
    name: "text",
    type: "string",
    defaultValue: "-",
    description: "Fallback text when structured content is omitted.",
  },
] as const;

export const bannerSlots = [
  { name: "default", description: "Simple content used when title and description are omitted." },
  { name: "icon", description: "Custom leading icon markup." },
  { name: "description", description: "Rich supporting content for structured banners." },
  { name: "action", description: "One or more actions placed after the banner copy." },
] as const;

export const actionProps = [
  {
    name: "variant",
    type: '"primary" | "secondary" | "ghost"',
    defaultValue: '"primary"',
    description: "Sets the action treatment while retaining the parent banner accent.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Disables the native button.",
  },
  {
    name: "type",
    type: '"button" | "submit" | "reset"',
    defaultValue: '"button"',
    description: "Sets the native button type.",
  },
] as const;

export const exportsList = [
  { name: "Banner", description: "Root banner with structured and slotted content APIs." },
  { name: "BannerAction", description: "Native button action, also available as Banner.Action." },
  { name: "BannerRoot", description: "Unaugmented root component." },
  { name: "BANNER_VARIANTS", description: "Readonly map of supported banner variants." },
  { name: "BANNER_SIZES", description: "Readonly map of supported banner sizes." },
  { name: "BANNER_DEFAULT_VARIANT", description: "Default banner variant." },
  { name: "BANNER_DEFAULT_SIZE", description: "Default banner size." },
  { name: "BANNER_ACTION_VARIANTS", description: "Readonly list of action variants." },
  { name: "BANNER_ACTION_TYPES", description: "Readonly list of native button types." },
  { name: "BANNER_ACTION_DEFAULT_VARIANT", description: "Default action variant." },
  { name: "BANNER_ACTION_DEFAULT_TYPE", description: "Default native button type." },
  { name: "BANNER_ACTION_DEFAULT_SIZE", description: "Fallback action size outside Banner." },
  { name: "BANNER_ACTION_SIZE_BY_BANNER", description: "Maps banner density to action density." },
  { name: "isBannerVariant", description: "Runtime banner-variant type guard." },
  { name: "isBannerSize", description: "Runtime banner-size type guard." },
  { name: "isBannerActionVariant", description: "Runtime action-variant type guard." },
  { name: "isBannerActionType", description: "Runtime action-type guard." },
  { name: "resolveBannerVariant", description: "Resolves unknown input to a banner variant." },
  { name: "resolveBannerSize", description: "Resolves unknown input to a banner size." },
  { name: "resolveBannerActionVariant", description: "Resolves unknown input to an action variant." },
  { name: "resolveBannerActionType", description: "Resolves unknown input to a native button type." },
  { name: "BannerProps", description: "Public root props." },
  { name: "BannerSlots", description: "Public root slot contract." },
  { name: "BannerVariant", description: "Supported banner-variant union." },
  { name: "BannerSize", description: "Supported banner-size union." },
  { name: "BannerActionProps", description: "Public action props." },
  { name: "BannerActionSlots", description: "Public action slot contract." },
  { name: "BannerActionVariant", description: "Supported action-variant union." },
  { name: "BannerActionType", description: "Supported native button-type union." },
  { name: "BannerActionSize", description: "Contextual action-size union." },
] as const;
