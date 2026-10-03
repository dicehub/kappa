<script setup lang="ts">
import { defineComponent, h, ref, useAttrs } from "vue";
import { Banner, BannerAction } from "@dicehub/kappa/components/banner";

type DemoVariant =
  | "preview"
  | "usage"
  | "variants"
  | "icon"
  | "action"
  | "actions"
  | "compact"
  | "custom"
  | "roles"
  | "rtl";

withDefaults(defineProps<{ variant?: DemoVariant }>(), {
  variant: "preview",
});

const makeIcon = (paths: string[]) =>
  defineComponent({
    inheritAttrs: false,
    setup() {
      const attrs = useAttrs();
      return () =>
        h(
          "svg",
          {
            ...attrs,
            "aria-hidden": "true",
            fill: "none",
            viewBox: "0 0 16 16",
          },
          paths.map((d) => h("path", { d })),
        );
    },
  });

const InfoIcon = makeIcon(["M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "M8 7v4", "M8 5h.01"]);
const AlertIcon = makeIcon(["M8 2 14 13H2L8 2Z", "M8 6v3.5", "M8 11.5h.01"]);
const ErrorIcon = makeIcon(["M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z", "m6 6 4 4", "m10 6-4 4"]);

const actionMessage = ref("");
</script>

<template>
  <div class="banner-demo" :data-banner-demo="variant">
    <Banner
      v-if="variant === 'preview'"
      :icon="InfoIcon"
      :icon-props="{ 'stroke-width': 1.75 }"
      title="Update available"
      description="A new version is ready to install."
    >
      <template #action>
        <Banner.Action @click="actionMessage = 'Update queued'">Update now</Banner.Action>
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'usage'"
      role="status"
      :icon="InfoIcon"
      :icon-props="{ 'stroke-width': 1.75 }"
      title="Mesh generated"
      description="The surface mesh is ready for review."
    />

    <div v-else-if="variant === 'variants'" class="banner-demo__stack">
      <Banner
        :icon="InfoIcon"
        :icon-props="{ 'stroke-width': 1.75 }"
        title="Update available"
        description="A new version is ready to install."
      />
      <Banner
        :icon="AlertIcon"
        :icon-props="{ 'stroke-width': 1.75 }"
        variant="alert"
        title="Session expiring"
        description="Your session will expire in 5 minutes."
      />
      <Banner
        :icon="ErrorIcon"
        :icon-props="{ 'stroke-width': 1.75 }"
        variant="error"
        title="Save failed"
        description="We couldn't save your changes."
      />
      <Banner
        :icon="InfoIcon"
        :icon-props="{ 'stroke-width': 1.75 }"
        variant="secondary"
        title="Maintenance scheduled"
        description="This service will be unavailable for 10 minutes."
      />
    </div>

    <Banner
      v-else-if="variant === 'icon'"
      :icon="InfoIcon"
      :icon-props="{ 'stroke-width': 2 }"
      title="Review required"
      description="Review the boundary conditions before running the case."
    />

    <Banner
      v-else-if="variant === 'action'"
      :icon="InfoIcon"
      :icon-props="{ 'stroke-width': 1.75 }"
      title="Update available"
      description="A new version is ready to install."
    >
      <template #action>
        <Banner.Action @click="actionMessage = 'Update queued'">Update now</Banner.Action>
        <Banner.Action variant="ghost" @click="actionMessage = 'Update dismissed'">
          Dismiss
        </Banner.Action>
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'actions'"
      :icon="AlertIcon"
      :icon-props="{ 'stroke-width': 1.75 }"
      variant="alert"
      title="Session expiring"
      description="Your session will expire in 5 minutes."
    >
      <template #action>
        <BannerAction variant="secondary" @click="actionMessage = 'Session dismissed'">
          Dismiss
        </BannerAction>
        <BannerAction @click="actionMessage = 'Session extended'">Extend session</BannerAction>
      </template>
    </Banner>

    <Banner
      v-else-if="variant === 'compact'"
      size="sm"
      description="A DNS record for solver.dicehub.dev already exists in this zone."
    >
      <template #action>
        <Banner.Action>Manage DNS</Banner.Action>
      </template>
    </Banner>

    <Banner v-else-if="variant === 'custom'" title="Custom content supported">
      <template #description>
        Read the <a href="#installation">installation guide</a> before updating the workspace.
      </template>
    </Banner>

    <div v-else-if="variant === 'roles'" class="banner-demo__stack">
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
    </div>

    <div v-else dir="rtl" class="banner-demo__rtl">
      <Banner
        :icon="InfoIcon"
        :icon-props="{ 'stroke-width': 1.75 }"
        variant="secondary"
        title="اكتمل التحليل"
        description="النتائج جاهزة للمراجعة."
      >
        <template #action>
          <Banner.Action>عرض النتائج</Banner.Action>
        </template>
      </Banner>
    </div>

    <p v-if="actionMessage" class="banner-demo__result" role="status">{{ actionMessage }}</p>
  </div>
</template>

<style scoped>
.banner-demo {
  display: grid;
  width: 100%;
  min-width: 0;
  min-height: 9rem;
  align-content: center;
  gap: 0.75rem;
  color: var(--docs-default);
  font-family: var(--docs-font-sans, "Geist", sans-serif);
}

.banner-demo__stack,
.banner-demo__rtl {
  display: grid;
  width: 100%;
  min-width: 0;
  gap: 0.75rem;
}

.banner-demo__result {
  margin: 0;
  color: var(--docs-subtle);
  font-size: 0.75rem;
  text-align: end;
}

.banner-demo :deep(svg) {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 620px) {
  .banner-demo {
    min-height: 10rem;
  }
}
</style>
