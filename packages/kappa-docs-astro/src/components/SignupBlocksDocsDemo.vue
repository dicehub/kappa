<script setup lang="ts">
import { computed } from "vue";
import {
  DicehubLogo,
  LinkButton,
  LoginLayout,
  type LoginLayoutVariant,
} from "@dicehub/kappa";
import LoginEngineGraphic from "./LoginEngineGraphic.vue";
import LoginMeshGraphic from "./LoginMeshGraphic.vue";
import SignupFormDocsDemo from "./SignupFormDocsDemo.vue";
import "./signup-blocks-demo.css";

export type SignupBlockId = "complete" | "split" | "panel" | "media-card" | "email-only";

const props = withDefaults(
  defineProps<{
    standalone?: boolean;
    variant?: SignupBlockId;
  }>(),
  {
    standalone: false,
    variant: "complete",
  },
);

const layoutVariant = computed<LoginLayoutVariant>(() => {
  if (props.variant === "split") return "split";
  if (props.variant === "panel") return "panel";
  if (props.variant === "media-card") return "card";
  return "centered";
});

const style = computed(() => ({
  "--kappa-login-layout-min-block-size": props.standalone
    ? "100svh"
    : props.variant === "email-only"
      ? "38rem"
      : "50rem",
}));
</script>

<template>
  <LoginLayout
    class="signup-block-demo"
    :data-signup-block="props.variant"
    :data-standalone="props.standalone ? '' : undefined"
    :label="`${props.variant} signup example`"
    :media-side="props.variant === 'media-card' ? 'start' : 'end'"
    :style="style"
    :variant="layoutVariant"
  >
    <template #brand>
      <div class="signup-block-demo__brand" aria-label="dicehub">
        <span class="signup-block-demo__brand-mark">
          <DicehubLogo variant="glyph" title="" />
        </span>
        <span>dicehub</span>
      </div>
    </template>

    <LinkButton
      v-if="props.variant === 'split'"
      class="signup-block-demo__sign-in"
      href="#sign-in"
      size="lg"
      variant="secondary"
    >
      Sign in
    </LinkButton>

    <h2 class="signup-block-demo__title">
      {{ props.variant === "email-only" ? "Create your account" : "Great! You decided to sign up." }}
    </h2>

    <SignupFormDocsDemo :email-only="props.variant === 'email-only'" />

    <template v-if="props.variant === 'split' || props.variant === 'media-card'" #media>
      <div
        v-if="props.variant === 'split'"
        class="signup-block-demo__engine"
        aria-label="Illustrative full-flow methalox engine cycle"
      >
        <LoginEngineGraphic />
      </div>

      <div v-else class="signup-block-demo__visual" aria-label="Flow simulation preview">
        <LoginMeshGraphic />
        <div class="signup-block-demo__telemetry">
          <span>WORKSPACE / READY</span>
          <strong>Your first project starts here</strong>
          <small>Private by default</small>
        </div>
      </div>
    </template>

    <template v-if="props.variant === 'email-only'" #footer>
      By continuing, I agree to dicehub's <a href="#terms">terms</a>,
      <a href="#privacy">privacy policy</a>, and <a href="#cookies">cookie policy</a>.
    </template>
  </LoginLayout>
</template>
