<script setup lang="ts">
import { computed } from "vue";
import {
  DicehubLogo,
  LinkButton,
  LoginLayout,
  type LoginLayoutVariant,
} from "@dicehub/kappa";
import LoginEngineGraphic from "./LoginEngineGraphic.vue";
import LoginFormDocsDemo from "./LoginFormDocsDemo.vue";
import LoginMeshGraphic from "./LoginMeshGraphic.vue";
import "./login-blocks-demo.css";

export type LoginBlockId =
  | "simple"
  | "split"
  | "panel"
  | "media-card"
  | "email-only"
  | "neutral-background";

const props = withDefaults(
  defineProps<{
    standalone?: boolean;
    variant?: LoginBlockId;
  }>(),
  {
    standalone: false,
    variant: "simple",
  },
);

const layoutVariant = computed<LoginLayoutVariant>(() => {
  if (props.variant === "split") return "split";
  if (props.variant === "panel") return "panel";
  if (props.variant === "media-card") return "card";
  return "centered";
});

const style = computed(() => ({
  "--kappa-login-layout-min-block-size": props.standalone ? "100svh" : "38rem",
}));

</script>

<template>
  <LoginLayout
    class="login-block-demo"
    :data-login-block="props.variant"
    :data-standalone="props.standalone ? '' : undefined"
    :label="`${props.variant} login example`"
    :media-side="props.variant === 'media-card' ? 'start' : 'end'"
    :style="style"
    :variant="layoutVariant"
  >
    <template #brand>
      <div class="login-block-demo__brand" aria-label="dicehub">
        <span class="login-block-demo__brand-mark">
          <DicehubLogo variant="glyph" title="" />
        </span>
        <span>dicehub</span>
      </div>
    </template>

    <LinkButton
      v-if="props.variant === 'split'"
      class="login-block-demo__sign-up"
      href="#create-account"
      size="lg"
      variant="secondary"
    >
      Sign up
    </LinkButton>

    <LoginFormDocsDemo :email-only="props.variant === 'email-only'" />

    <template v-if="props.variant === 'split' || props.variant === 'media-card'" #media>
      <div
        v-if="props.variant === 'split'"
        class="login-block-demo__engine"
        aria-label="Illustrative full-flow methalox engine cycle"
      >
        <LoginEngineGraphic />
      </div>

      <div v-else class="login-block-demo__visual" aria-label="Flow simulation preview">
        <LoginMeshGraphic />
        <div class="login-block-demo__telemetry">
          <span>MESH / DOMAIN 07</span>
          <strong>Quality checks passed</strong>
          <small>42,816 structured cells</small>
        </div>
        <p>A structured mesh ready for the next simulation run.</p>
      </div>
    </template>

    <template #footer>
      By continuing, I agree to dicehub's <a href="#terms">terms</a>,
      <a href="#privacy">privacy policy</a>, and <a href="#cookies">cookie policy</a>.
    </template>
  </LoginLayout>
</template>
