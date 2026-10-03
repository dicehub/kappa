<script setup lang="ts">
import { Link, LinkExternalIcon } from "@dicehub/kappa/components/link";

type DemoVariant =
  | "preview"
  | "basic"
  | "variants"
  | "inline-paragraph"
  | "external"
  | "current"
  | "router"
  | "current-page"
  | "rtl";

const props = withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});
</script>

<template>
  <div class="link-demo" :data-link-demo="props.variant">
    <p v-if="props.variant === 'preview'">
      Start with the <Link href="/docs/installation">installation guide</Link>.
    </p>

    <p v-else-if="props.variant === 'basic'">
      Use <Link href="/docs/components/button">Button</Link> for actions and Link for navigation.
    </p>

    <div v-else-if="props.variant === 'variants'" class="link-demo__variants">
      <div><code>inline</code><Link href="#examples">Inline link</Link></div>
      <div><code>current</code><Link href="#accessibility" variant="current">Current-color link</Link></div>
      <div><code>plain</code><Link href="#api-reference" variant="plain">Plain link</Link></div>
    </div>

    <p v-else-if="props.variant === 'inline-paragraph'" class="link-demo__paragraph">
      Review the <Link href="/docs/accessibility">accessibility guide</Link> before you publish a
      new interface. It covers keyboard access, focus, and contrast.
    </p>

    <Link
      v-else-if="props.variant === 'external'"
      href="https://ark-ui.com/docs/guides/composition"
      external
    >
      Ark UI composition
      <LinkExternalIcon />
    </Link>

    <aside v-else-if="props.variant === 'current'" class="link-demo__notice">
      <strong>Service notice</strong>
      <span>
        Scheduled maintenance starts at 18:00 UTC.
        <Link href="#maintenance" variant="current">View details</Link>
      </span>
    </aside>

    <Link v-else-if="props.variant === 'router'" as-child>
      <a href="/docs/components" data-router-link>Component index</a>
    </Link>

    <nav
      v-else-if="props.variant === 'current-page'"
      class="link-demo__navigation"
      aria-label="Account sections"
    >
      <Link href="#overview" variant="plain">Overview</Link>
      <Link href="#activity" variant="plain" aria-current="page">Activity</Link>
      <Link href="#access" variant="plain">Access</Link>
    </nav>

    <p v-else dir="rtl" lang="ar">
      راجع <Link href="#accessibility">إرشادات إمكانية الوصول</Link> قبل النشر.
    </p>
  </div>
</template>

<style scoped>
.link-demo {
  display: flex;
  inline-size: 100%;
  min-inline-size: 0;
  min-block-size: 7rem;
  align-items: center;
  justify-content: center;
  color: var(--kappa-default, #17191f);
  font-family: var(--kappa-font-sans, inherit);
  font-size: 0.9375rem;
  line-height: 1.65;
}

.link-demo p {
  max-inline-size: 32rem;
  margin: 0;
}

.link-demo__paragraph {
  text-wrap: pretty;
}

.link-demo__variants {
  display: grid;
  inline-size: min(100%, 24rem);
  gap: 0.625rem;
}

.link-demo__variants > div {
  display: grid;
  grid-template-columns: 5.25rem minmax(0, 1fr);
  align-items: baseline;
  gap: 0.75rem;
}

.link-demo__variants code {
  color: var(--kappa-subtle, #6c7480);
  font-family: var(--kappa-font-mono, monospace);
  font-size: 0.6875rem;
}

.link-demo__notice {
  display: grid;
  inline-size: min(100%, 30rem);
  gap: 0.125rem;
  padding-block: 0.75rem;
  padding-inline: 0.875rem;
  border: 1px solid color-mix(in srgb, var(--kappa-info-text, #175cd3) 28%, transparent);
  border-radius: 0.625rem;
  background: var(--kappa-info-tint, #dbeafe);
  color: var(--kappa-info-text, #175cd3);
}

.link-demo__notice strong {
  font-size: 0.8125rem;
  line-height: 1.4;
}

.link-demo__notice span {
  font-size: 0.8125rem;
  line-height: 1.5;
}

.link-demo__navigation {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
}

@media (max-width: 30rem) {
  .link-demo {
    min-block-size: 8rem;
  }

  .link-demo__variants > div {
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }

  .link-demo__navigation {
    gap: 0.875rem;
  }
}
</style>
