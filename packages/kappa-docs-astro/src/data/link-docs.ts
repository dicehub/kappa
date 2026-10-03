export const barrelCode = `import { Link } from "@dicehub/kappa";`;

export const granularCode = `import { Link } from "@dicehub/kappa/components/link";`;

export const previewCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <p>Start with the <Link href="/docs/installation">installation guide</Link>.</p>
</template>`;

export const usageCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <p>
    Use <Link href="/docs/components/button">Button</Link> for actions and
    Link for navigation.
  </p>
</template>`;

export const variantsCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <div>
    <Link href="#examples">Inline link</Link>
    <Link href="#accessibility" variant="current">Current-color link</Link>
    <Link href="#api-reference" variant="plain">Plain link</Link>
  </div>
</template>`;

export const inlineParagraphCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <p>
    Review the <Link href="/docs/accessibility">accessibility guide</Link> before
    you publish a new interface. It covers keyboard access, focus, and contrast.
  </p>
</template>`;

export const externalCode = `<script setup>
import { Link, LinkExternalIcon } from "@dicehub/kappa/components/link";
</script>

<template>
  <Link href="https://ark-ui.com/docs/guides/composition" external>
    Ark UI composition
    <LinkExternalIcon />
  </Link>
</template>`;

export const currentCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <aside class="service-note">
    Scheduled maintenance starts at 18:00 UTC.
    <Link href="#maintenance" variant="current">View details</Link>
  </aside>
</template>

<style scoped>
.service-note {
  color: var(--kappa-info-text);
}
</style>`;

export const routerCode = `<script setup>
import { RouterLink } from "vue-router";
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <Link as-child>
    <RouterLink to="/settings">Account settings</RouterLink>
  </Link>
</template>`;

export const currentPageCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <nav class="section-links" aria-label="Account sections">
    <Link href="/overview" variant="plain">Overview</Link>
    <Link href="/activity" variant="plain" aria-current="page">Activity</Link>
    <Link href="/access" variant="plain">Access</Link>
  </nav>
</template>

<style scoped>
.section-links {
  display: flex;
  gap: 1.25rem;
}
</style>`;

export const rtlCode = `<script setup>
import { Link } from "@dicehub/kappa/components/link";
</script>

<template>
  <p dir="rtl" lang="ar">
    راجع <Link href="#accessibility">إرشادات إمكانية الوصول</Link> قبل النشر.
  </p>
</template>`;

export const linkProps = [
  {
    name: "href",
    type: "string",
    defaultValue: "—",
    description: "Sets the native anchor destination. The child owns navigation with asChild.",
  },
  {
    name: "variant",
    type: '"inline" | "current" | "plain"',
    defaultValue: '"inline"',
    description: "Selects an underlined accent, inherited underlined, or plain treatment.",
  },
  {
    name: "external",
    type: "boolean",
    defaultValue: "false",
    description: "Defaults target to _blank and merges noopener noreferrer into rel.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Merges Link attributes and styling onto one child, such as RouterLink.",
  },
  {
    name: "native anchor attributes",
    type: "AnchorHTMLAttributes",
    defaultValue: "—",
    description: "Forwards aria-*, download, hreflang, ping, referrerpolicy, rel, target, and listeners.",
  },
] as const;

export const slots = [
  {
    name: "default",
    description: "Descriptive link text and optional inline content such as Link.ExternalIcon.",
  },
] as const;

export const dataAttributes = [
  { name: "data-slot", value: '"link"', description: "Identifies the rendered link root." },
  {
    name: "data-variant",
    value: '"inline" | "current" | "plain"',
    description: "Exposes the resolved visual treatment.",
  },
  {
    name: "data-external",
    value: "present",
    description: "Present when external is true.",
  },
] as const;

export const exportsList = [
  { name: "Link", description: "Ark factory anchor with Link.ExternalIcon composition." },
  { name: "LinkRoot", description: "Standalone root component used by the compound Link export." },
  { name: "LinkExternalIcon", description: "Named decorative external-link indicator export." },
  { name: "LinkProps / LinkSlots / LinkVariant", description: "Public Vue and variant contracts." },
  { name: "LINK_VARIANTS / LINK_DEFAULT_VARIANT", description: "Supported variants and default." },
  { name: "isLinkVariant / resolveLinkVariant", description: "Guard and safe variant resolver." },
  { name: "resolveLinkTarget / resolveLinkRel", description: "Safe external navigation helpers." },
] as const;
